const express = require('express');
const mqtt = require('mqtt');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 3000;

let gpsDataArray = [];

app.set('view engine', 'ejs');
app.use(express.static('public'));

const mqttOptions = {
    host: 'eu1.cloud.thethings.network',
    port: 1883,
    username: 'lora-bioguard@ttn',
    password: 'NNSXS.JJMG2KBYBLB2YG55VRVPCO4V3QO5HRG43AI37AY.KMG2MXIZYALI6RU3QTJCBLOZWRMTDL5UZNB6TDVYBARGBS5DQ6JA',
};

const client = mqtt.connect(mqttOptions);
const topic = 'v3/lora-bioguard@ttn/devices/+/up';

client.on('connect', () => {
    console.log('Connected to TTN MQTT broker');
    client.subscribe(topic, (err) => {
        if (!err) {
            console.log(`Subscribed to topic: ${topic}`);
        } else {
            console.error(`Failed to subscribe: ${err}`);
        }
    });
});

const supabaseUrl = 'https://hgdnvwejokhlfdwymtyq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnZG52d2Vqb2tobGZkd3ltdHlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3MTAxMTYsImV4cCI6MjA0NjI4NjExNn0.tRVa2DVuEP-qc08xdwoVkmwmA2zwptTs0imUaU2Mmxc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function insertGpsData(gpsData) {
  try {
    const { data, error } = await supabase
      .from('gps_data') 
      .insert([gpsData]);

    if (error) {
      console.error('Error inserting data:', error);
    } else {
      console.log('Data inserted successfully:', data);
    }
  } catch (error) {
    console.error('Error inserting data:', error);
  }
}

client.on('message', (topic, message) => {
    try {
        const payload = JSON.parse(message.toString());
        console.log('Received payload:', payload);

        const { latitude, longitude, altitude, hdop, temperature, PH, DissolvedSolids } = payload.uplink_message.decoded_payload;
        const f_port = payload.uplink_message.f_port;
        const timestamp = new Date(payload.uplink_message.received_at);

        const gpsData = {
            latitude: latitude === 'N/A' ? null : parseFloat(latitude),
            longitude: longitude === 'N/A' ? null : parseFloat(longitude),
            altitude: altitude === 'N/A' ? null : parseFloat(altitude),
            hdop: hdop === 'N/A' ? null : parseFloat(hdop),
            temperature: temperature === 'N/A' ? null : parseFloat(temperature),
            ph: PH === 'N/A' ? null : parseFloat(PH),
            dissolvedsolids: DissolvedSolids === 'N/A' ? null : parseFloat(DissolvedSolids),
            timestamp: timestamp.toISOString(),
            f_port: f_port === 'N/A' ? null : parseInt(f_port)
        };

        gpsDataArray.push(gpsData);
        console.log('GPS Data Updated:', gpsData);
        io.emit('gpsDataUpdate', gpsData);
        insertGpsData(gpsData); 
    } catch (error) {
        console.error('Failed to parse message:', error);
    }
});

app.get('/', (req, res) => {
    res.render('index', { gpsDataArray });
});

app.get('/gps-data', (req, res) => {
    res.json(gpsDataArray);
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});