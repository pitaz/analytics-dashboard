-- Analytics Dashboard Database Schema

-- Metrics table for storing various business metrics
CREATE TABLE IF NOT EXISTS metrics (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  value DECIMAL(15, 2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB
);

-- Time series data for historical tracking
CREATE TABLE IF NOT EXISTS time_series_data (
  id SERIAL PRIMARY KEY,
  metric_id INTEGER REFERENCES metrics(id),
  value DECIMAL(15, 2) NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User events for tracking interactions
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  user_id VARCHAR(255),
  session_id VARCHAR(255),
  properties JSONB,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reports table for saved custom reports
CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  config JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_metrics_timestamp ON metrics(timestamp);
CREATE INDEX IF NOT EXISTS idx_metrics_category ON metrics(category);
CREATE INDEX IF NOT EXISTS idx_time_series_metric_timestamp ON time_series_data(metric_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_events_timestamp ON events(timestamp);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);

