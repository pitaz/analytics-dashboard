import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query(
      `SELECT * FROM reports ORDER BY created_at DESC`
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, config, categories, metrics, includeTimeSeries } = body;

    // Handle both formats: { config } or { categories, metrics, includeTimeSeries }
    const reportConfig = config || { categories, metrics, includeTimeSeries };

    if (!reportConfig) {
      return NextResponse.json(
        { error: 'Config is required' },
        { status: 400 }
      );
    }

    // Generate report data based on config
    const { categories, metrics, includeTimeSeries } = reportConfig;
    const reportData: any = {};

    if (categories && categories.length > 0) {
      // Validate categories to prevent SQL injection
      const validCategories = ['revenue', 'users', 'conversion', 'engagement', 'performance'];
      const filteredCategories = categories.filter((c: string) => 
        typeof c === 'string' && validCategories.includes(c.toLowerCase())
      );

      if (filteredCategories.length === 0) {
        return NextResponse.json(
          { error: 'Invalid categories provided' },
          { status: 400 }
        );
      }

      // Use parameterized query for safety
      const placeholders = filteredCategories.map((_, i) => `$${i + 1}`).join(',');
      
      // Get metrics data
      const metricsResult = await query(
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
        WHERE category IN (${placeholders})
          AND timestamp > NOW() - INTERVAL '24 hours'
        GROUP BY category
        ORDER BY category
      `,
        filteredCategories
      );

      reportData.metrics = metricsResult.rows;

      // Get time series if requested
      if (includeTimeSeries) {
        const timeSeriesResult = await query(
          `
          SELECT 
            DATE_TRUNC('hour', timestamp) as hour,
            category,
            AVG(value) as avg_value,
            COUNT(*) as count
          FROM metrics
          WHERE category IN (${placeholders})
            AND timestamp > NOW() - INTERVAL '24 hours'
          GROUP BY hour, category
          ORDER BY hour, category
        `,
          filteredCategories
        );
        reportData.timeSeries = timeSeriesResult.rows;
      }
    }

    // Save report to database if name is provided
    if (name) {
      const insertResult = await query(
        `
        INSERT INTO reports (name, description, config)
        VALUES ($1, $2, $3)
        RETURNING *
      `,
        [name, description || null, JSON.stringify(reportConfig)]
      );

      return NextResponse.json({
        report: insertResult.rows[0],
        data: reportData,
      });
    }

    return NextResponse.json({ data: reportData });
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json(
      { error: 'Failed to create report' },
      { status: 500 }
    );
  }
}

