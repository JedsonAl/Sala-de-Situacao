interface BarChartProps {
  data: Array<{ [key: string]: any }>;
  xKey: string;
  yKey: string;
  colors?: string[];
  height?: number;
}

export default function BarChart({ 
  data, 
  xKey, 
  yKey, 
  colors = ["#2563eb"],
  height = 200 
}: BarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-gray-500">Nenhum dado disponível</p>
      </div>
    );
  }

  const width = 400;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const maxValue = Math.max(...data.map(d => d[yKey]));
  const barHeight = chartHeight / data.length;
  const barPadding = 8;

  return (
    <div className="w-full">
      <svg width={width} height={height} className="w-full">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(value => {
          const x = padding + (value / maxValue) * chartWidth;
          return (
            <g key={value}>
              <line
                x1={x}
                y1={padding}
                x2={x}
                y2={height - padding}
                stroke="#f3f4f6"
                strokeWidth="1"
              />
              <text
                x={x}
                y={height - padding + 15}
                textAnchor="middle"
                className="text-xs fill-gray-500"
              >
                {value}%
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((item, index) => {
          const barWidth = (item[yKey] / maxValue) * chartWidth;
          const y = padding + index * barHeight + barPadding / 2;
          const color = colors[index % colors.length];
          
          return (
            <g key={index}>
              <rect
                x={padding}
                y={y}
                width={barWidth}
                height={barHeight - barPadding}
                fill={color}
                rx="2"
                className="hover:opacity-80 transition-opacity"
              />
              
              {/* Value label */}
              <text
                x={padding + barWidth + 5}
                y={y + (barHeight - barPadding) / 2 + 4}
                className="text-xs fill-gray-700"
              >
                {item[yKey]}%
              </text>
              
              {/* Category label */}
              <text
                x={padding - 5}
                y={y + (barHeight - barPadding) / 2 + 4}
                textAnchor="end"
                className="text-xs fill-gray-600"
              >
                {item[xKey]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
