interface GaugeChartProps {
  value: number;
  label: string;
  color?: string;
  size?: number;
}

export default function GaugeChart({ 
  value, 
  label, 
  color = "#2563eb",
  size = 200 
}: GaugeChartProps) {
  const radius = size / 2 - 10;
  const circumference = Math.PI * radius; // Half circumference for semicircle
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center">
      <svg 
        width={size} 
        height={size / 2 + 20} 
        className="transform -rotate-90"
      >
        {/* Background arc */}
        <path
          d={`M 10 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 10} ${size / 2}`}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="8"
          strokeLinecap="round"
        />
        
        {/* Progress arc */}
        <path
          d={`M 10 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 10} ${size / 2}`}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ top: size / 4 }}>
        <div className="text-2xl font-bold" style={{ color }}>
          {Math.round(value)}%
        </div>
        <div className="text-sm text-gray-500">
          {label}
        </div>
      </div>
    </div>
  );
}
