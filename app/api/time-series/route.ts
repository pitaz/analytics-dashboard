import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

function getTimeRangeHours(timeRange: string): number {
  switch (timeRange) {
    case '1h':
      return 1;
    case '24h':
      return 24;
    case '7d':
      return 24 * 7;
    case '30d':
      return 24 * 30;
    default:
      return 24;
  }
}

function getInterval(timeRange: string): string {
  switch (timeRange) {
    case '1h':
      return 'minute';
    case '24h':
      return 'hour';
    case '7d':
      return 'day';
    case '30d':
      return 'day';
    default:
      return 'hour';
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const timeRange = searchParams.get('timeRange') || '24h';
    const hours = getTimeRangeHours(timeRange);
    const interval = getInterval(timeRange);

    // Validate inputs to prevent SQL injection
    const validIntervals = ['minute', 'hour', 'day', 'week', 'month'];
    if (!validIntervals.includes(interval) || isNaN(hours) || hours < 0 || hours > 8760) {
      return NextResponse.json(
        { error: 'Invalid time range' },
        { status: 400 }
      );
    }

    const result = await query(
      `
      SELECT 
        DATE_TRUNC('${interval}', timestamp) as hour,
        category,
        AVG(value) as avg_value,
        COUNT(*) as count
      FROM metrics
      WHERE timestamp > NOW() - INTERVAL '${hours} hours'
      GROUP BY hour, category
      ORDER BY hour, category
    `
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching time series:', error);
    return NextResponse.json(
      { error: 'Failed to fetch time series' },
      { status: 500 }
    );
  }
}

