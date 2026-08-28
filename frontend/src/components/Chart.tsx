import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';

// Premium color palette for data visualizations
const palette = [
  '#4f46e5', // Indigo 600 (Primary)
  '#14b8a6', // Teal 500
  '#f59e0b', // Amber 500
  '#0ea5e9', // Sky 500
  '#8b5cf6', // Violet 500
  '#ec4899', // Pink 500
  '#64748b', // Slate 500
];

// Custom HTML tooltip for charts with premium typography and styling
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-100 bg-slate-900/95 p-3 shadow-xl backdrop-blur-sm text-xs text-white">
        <p className="font-semibold text-slate-300 mb-1.5">{label}</p>
        {payload.map((item: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mt-1">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: item.color || item.fill }}
            />
            <span className="text-slate-400">{item.name}:</span>
            <span className="font-bold text-white">
              {typeof item.value === 'number' && item.name.toLowerCase().includes('rate')
                ? `${item.value.toFixed(1)}%`
                : item.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

interface ChartProps {
  title: string;
  data: any[];
  x?: string;
  pie?: boolean;
}

export function Chart({ title, data, x = 'project', pie = false }: ChartProps) {
  const isDataEmpty = !data || data.length === 0;

  return (
    <section className="rounded-2xl border border-slate-100 p-5 shadow-sm card-design">
      <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">
        {title}
      </h3>
      <div className="h-64 w-full flex items-center justify-center">
        {isDataEmpty ? (
          <p className="text-sm text-slate-400">No chart data available</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {pie ? (
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey={x}
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={2}
                  cx="50%"
                  cy="50%"
                >
                  {data.map((_: any, i: number) => (
                    <Cell
                      key={`cell-${i}`}
                      fill={palette[i % palette.length]}
                      className="transition-all duration-300 hover:opacity-90 outline-none"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            ) : (
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey={x}
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                  dy={8}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  dx={-4}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                <Bar
                  dataKey="value"
                  fill="#4f46e5"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={45}
                  name={title.split(' by ')[0] || 'Total'}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
