# Analytics Dashboard

An advanced analytics platform that provides real-time insights into business metrics through interactive visualizations, custom report generation, and comprehensive data analysis tools.

## Features

- **Real-time Data Updates**: WebSocket-based real-time data streaming with <1s latency
- **Interactive Visualizations**: 
  - Chart.js for responsive charts (Line, Doughnut)
  - D3.js for advanced custom visualizations
- **Custom Report Generation**: Create and save custom reports with selected metrics and categories
- **Time Range Selection**: View data for different time periods (1h, 24h, 7d, 30d)
- **PostgreSQL Integration**: Robust database backend for storing and querying large datasets
- **Responsive Design**: Modern UI built with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Visualization**: D3.js, Chart.js, react-chartjs-2
- **Database**: PostgreSQL
- **Real-time**: WebSocket (ws)
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up your environment variables:

Create a `.env.local` file in the root directory:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/analytics_db
WS_PORT=3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
NODE_ENV=development
```

3. Set up the database:

```bash
# Run migrations
npm run db:migrate

# Seed sample data
npm run db:seed
```

4. Start the development servers:

```bash
# Terminal 1: Start Next.js dev server
npm run dev

# Terminal 2: Start WebSocket server
node server/websocket-server.js
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
analytics/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main dashboard page
├── components/            # React components
│   ├── Dashboard.tsx      # Main dashboard component
│   ├── MetricCard.tsx    # Metric display cards
│   ├── TimeSeriesChart.tsx # Chart.js line chart
│   ├── CategoryDistribution.tsx # Chart.js doughnut chart
│   ├── D3Visualization.tsx # D3.js advanced visualization
│   └── ReportGenerator.tsx # Report generation component
├── hooks/                 # Custom React hooks
│   └── useWebSocket.ts    # WebSocket connection hook
├── lib/                   # Utility libraries
│   ├── db.ts             # Database connection
│   ├── db-schema.sql     # Database schema
│   └── api.ts            # API client functions
├── server/                # Server-side code
│   └── websocket-server.js # WebSocket server
└── scripts/              # Utility scripts
    ├── migrate.js        # Database migration
    └── seed.js          # Database seeding
```

## Key Features Explained

### Real-time Updates

The dashboard uses WebSockets to receive real-time data updates. The WebSocket server polls the database every second and broadcasts updates to all connected clients.

### Visualizations

- **Chart.js**: Used for standard charts (line, doughnut) with built-in interactivity
- **D3.js**: Used for custom, advanced visualizations with full control over rendering

### Report Generation

Users can:
- Select specific categories and metrics
- Generate custom reports
- Save reports for future reference
- View report summaries with selected data

## Performance

- Optimized for handling 1M+ data points
- Efficient database queries with proper indexing
- Real-time updates with minimal latency (<1s)
- Responsive UI that works on all devices

## Development

### Running in Development Mode

```bash
npm run dev
```

### Building for Production

```bash
npm run build
npm start
```

### Database Migrations

```bash
npm run db:migrate
```

### Seeding Sample Data

```bash
npm run db:seed
```

## License

MIT

# analytics-dashboard
