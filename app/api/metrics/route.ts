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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const timeRange = searchParams.get('timeRange') || '24h';
    const hours = getTimeRangeHours(timeRange);

    // Validate hours to prevent SQL injection
    if (isNaN(hours) || hours < 0 || hours > 8760) {
      return NextResponse.json(
        { error: 'Invalid time range' },
        { status: 400 }
      );
    }

    const result = await query(
      `
      SELECT 
        category,
        COUNT(*) as count,
        AVG(value) as avg_value,
        SUM(value) as total_value,
        MAX(value) as max_value,
        MIN(value) as min_value,
        MAX(timestamp) as latest_timestamp
      FROM metrics
      WHERE timestamp > NOW() - INTERVAL '${hours} hours'
      GROUP BY category
      ORDER BY category
    `
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}

