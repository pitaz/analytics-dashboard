const WebSocket = require('ws');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const wss = new WebSocket.Server({ port: process.env.WS_PORT || 3001 });

console.log(`WebSocket server running on port ${process.env.WS_PORT || 3001}`);

// Store connected clients
const clients = new Set();

// Broadcast data to all connected clients
function broadcast(data) {
  const message = JSON.stringify(data);
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Fetch latest metrics from database
async function fetchLatestMetrics() {
  try {
    const result = await pool.query(`
      SELECT 
        category,
        COUNT(*) as count,
        AVG(value) as avg_value,
        SUM(value) as total_value,
        MAX(value) as max_value,
        MIN(value) as min_value,
        MAX(timestamp) as latest_timestamp
      FROM metrics
      WHERE timestamp > NOW() - INTERVAL '24 hours'
      GROUP BY category
      ORDER BY category
    `);
    return result.rows;
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return [];
  }
}

// Fetch time series data
async function fetchTimeSeriesData(hours = 24) {
  try {
    const result = await pool.query(`
      SELECT 
        DATE_TRUNC('hour', timestamp) as hour,
        category,
        AVG(value) as avg_value,
        COUNT(*) as count
      FROM metrics
      WHERE timestamp > NOW() - INTERVAL '${hours} hours'
      GROUP BY hour, category
      ORDER BY hour, category
    `);
    return result.rows;
  } catch (error) {
    console.error('Error fetching time series:', error);
    return [];
  }
}

// Send real-time updates
async function sendUpdates() {
  const metrics = await fetchLatestMetrics();
  const timeSeries = await fetchTimeSeriesData(24);
  
  broadcast({
    type: 'metrics_update',
    timestamp: new Date().toISOString(),
    data: {
      metrics,
      timeSeries,
    },
  });
}

wss.on('connection', (ws) => {
  console.log('New client connected');
  clients.add(ws);

  // Send initial data
  sendUpdates();

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message.toString());
      
      if (data.type === 'request_update') {
        await sendUpdates();
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    clients.delete(ws);
  });
});

// Send updates every second for real-time feel
setInterval(sendUpdates, 1000);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing WebSocket server');
  wss.close(() => {
    pool.end();
    process.exit(0);
  });
});

