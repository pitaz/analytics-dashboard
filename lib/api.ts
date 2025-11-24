const API_BASE = '/api';

export async function fetchMetrics(timeRange: string = '24h') {
  const response = await fetch(`${API_BASE}/metrics?timeRange=${timeRange}`);
  if (!response.ok) {
    throw new Error('Failed to fetch metrics');
  }
  return response.json();
}

export async function fetchTimeSeries(timeRange: string = '24h') {
  const response = await fetch(`${API_BASE}/time-series?timeRange=${timeRange}`);
  if (!response.ok) {
    throw new Error('Failed to fetch time series');
  }
  return response.json();
}

export async function generateReport(config: any) {
  const response = await fetch(`${API_BASE}/reports`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ config }),
  });
  if (!response.ok) {
    throw new Error('Failed to generate report');
  }
  const result = await response.json();
  return result.data || result;
}

export async function saveReport(name: string, description: string, config: any) {
  const response = await fetch(`${API_BASE}/reports`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, description, config }),
  });
  if (!response.ok) {
    throw new Error('Failed to save report');
  }
  return response.json();
}

export async function getReports() {
  const response = await fetch(`${API_BASE}/reports`);
  if (!response.ok) {
    throw new Error('Failed to fetch reports');
  }
  return response.json();
}

