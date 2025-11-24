'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface D3VisualizationProps {
  data: any[];
}

export default function D3Visualization({ data }: D3VisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    // Clear previous render
    d3.select(svgRef.current).selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 60, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Group data by category
    const categories = Array.from(new Set(data.map((d) => d.category)));
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Prepare data for each category
    const categoryData = categories.map((category) => {
      const categoryPoints = data
        .filter((d) => d.category === category)
        .map((d) => ({
          date: new Date(d.hour),
          value: parseFloat(d.avg_value),
          category,
        }))
        .sort((a, b) => a.date.getTime() - b.date.getTime());

      return { category, points: categoryPoints };
    });

    // Set up scales
    const xExtent = d3.extent(
      data.flatMap((d) => new Date(d.hour).getTime())
    ) as [number, number];
    const yExtent = [
      0,
      d3.max(data.map((d) => parseFloat(d.avg_value))) || 0,
    ] as [number, number];

    const xScale = d3.scaleTime().domain(xExtent).range([0, width]);
    const yScale = d3.scaleLinear().domain(yExtent).range([height, 0]);

    // Create line generator
    const line = d3
      .line<{ date: Date; value: number }>()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.value))
      .curve(d3.curveMonotoneX);

    // Add area generator for filled areas
    const area = d3
      .area<{ date: Date; value: number }>()
      .x((d) => xScale(d.date))
      .y0(height)
      .y1((d) => yScale(d.value))
      .curve(d3.curveMonotoneX);

    // Add areas
    categoryData.forEach(({ category, points }) => {
      svg
        .append('path')
        .datum(points)
        .attr('fill', colorScale(category))
        .attr('fill-opacity', 0.2)
        .attr('d', area);
    });

    // Add lines
    categoryData.forEach(({ category, points }) => {
      svg
        .append('path')
        .datum(points)
        .attr('fill', 'none')
        .attr('stroke', colorScale(category))
        .attr('stroke-width', 2)
        .attr('d', line);
    });

    // Add circles for data points
    categoryData.forEach(({ category, points }) => {
      svg
        .selectAll(`.dot-${category}`)
        .data(points)
        .enter()
        .append('circle')
        .attr('class', `dot-${category}`)
        .attr('cx', (d) => xScale(d.date))
        .attr('cy', (d) => yScale(d.value))
        .attr('r', 3)
        .attr('fill', colorScale(category))
        .attr('stroke', '#fff')
        .attr('stroke-width', 1)
        .on('mouseover', function (event, d) {
          d3.select(this).attr('r', 6);
          // Tooltip would go here
        })
        .on('mouseout', function () {
          d3.select(this).attr('r', 3);
        });
    });

    // Add X axis
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(6)
          .tickFormat(d3.timeFormat('%H:%M') as any)
      )
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');

    // Add Y axis
    svg.append('g').call(d3.axisLeft(yScale));

    // Add axis labels
    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('fill', '#666')
      .text('Value');

    svg
      .append('text')
      .attr('transform', `translate(${width / 2}, ${height + margin.bottom - 10})`)
      .style('text-anchor', 'middle')
      .style('fill', '#666')
      .text('Time');

    // Add legend
    const legend = svg
      .append('g')
      .attr('transform', `translate(${width - 100}, 20)`);

    categories.forEach((category, i) => {
      const legendRow = legend
        .append('g')
        .attr('transform', `translate(0, ${i * 20})`);

      legendRow
        .append('rect')
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', colorScale(category));

      legendRow
        .append('text')
        .attr('x', 20)
        .attr('y', 12)
        .style('font-size', '12px')
        .style('fill', '#666')
        .text(category);
    });
  }, [data]);

  return (
    <div className="w-full overflow-x-auto">
      <svg ref={svgRef} className="w-full" style={{ minHeight: '450px' }} />
    </div>
  );
}

