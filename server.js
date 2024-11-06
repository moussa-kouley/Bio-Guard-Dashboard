const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

let gpsDataArray = [];

app.set('view engine', 'ejs');
app.use(express.static('public'));

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Set up Supabase real-time subscription with error handling
const setupRealtimeSubscription = async () => {
  try {
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
      .subscribe((status) => {
        console.log('Subscription status:', status);
        
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to real-time changes');
        } else if (status === 'CLOSED') {
          console.log('Subscription closed, attempting to reconnect...');
          setTimeout(setupRealtimeSubscription, 5000); // Retry after 5 seconds
        }
      });

    return subscription;
  } catch (error) {
    console.error('Error setting up real-time subscription:', error);
    setTimeout(setupRealtimeSubscription, 5000); // Retry after 5 seconds
  }
};

// Initial data fetch with error handling
const fetchInitialData = async () => {
  try {
    const { data, error } = await supabase
      .from('gps_data')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching initial data:', error);
      return;
    }

    gpsDataArray = data || [];
    console.log(`Fetched ${gpsDataArray.length} records from database`);
  } catch (error) {
    console.error('Error fetching initial data:', error);
  }
};

// Initialize data and subscriptions with connection status logging
(async () => {
  console.log('Initializing server...');
  await fetchInitialData();
  const subscription = await setupRealtimeSubscription();
  
  if (subscription) {
    console.log('Real-time subscription initialized successfully');
  }
})();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected');
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
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