const express = require('express');
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

const supabaseUrl = 'https://hgdnvwejokhlfdwymtyq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnZG52d2Vqb2tobGZkd3ltdHlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3MTAxMTYsImV4cCI6MjA0NjI4NjExNn0.tRVa2DVuEP-qc08xdwoVkmwmA2zwptTs0imUaU2Mmxc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Set up Supabase real-time subscription
const setupRealtimeSubscription = () => {
  const subscription = supabase
    .channel('gps_data_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'gps_data'
      },
      (payload) => {
        const newData = payload.new;
        if (newData) {
          gpsDataArray.unshift(newData);
          io.emit('gpsDataUpdate', newData);
        }
      }
    )
    .subscribe();

  return subscription;
};

// Initial data fetch - now fetching all records
const fetchInitialData = async () => {
  try {
    const { data, error } = await supabase
      .from('gps_data')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching initial data:', error);
    } else {
      gpsDataArray = data || [];
      console.log(`Fetched ${gpsDataArray.length} records from database`);
    }
  } catch (error) {
    console.error('Error fetching initial data:', error);
  }
};

// Initialize data and subscriptions
(async () => {
  await fetchInitialData();
  setupRealtimeSubscription();
})();

app.get('/', (req, res) => {
  res.render('index', { gpsDataArray });
});

app.get('/gps-data', (req, res) => {
  res.json(gpsDataArray);
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});