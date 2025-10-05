import { useEffect, useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

// Utility to round numbers
function roundTo(num, decimals) {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}

// Small chart for a single location with section_id
function SmallChart({ data }) {
  const chartData = useMemo(() => {
    if (!data?.weekday || !data?.weekend) return [];
    return data.weekday.x_predict
      .map((x, i) => {
        if (!x) return null;
        return {
          x: roundTo(x[0], 3),
          y: roundTo(data.weekday.y_predict[i][0], 3),
          y_2: roundTo(data.weekend.y_predict[i][0], 3),
        };
      })
      .filter(Boolean);
  }, [data]);

  if (!data) return null;

  return (
    <div className='w-full'>
      {/* Chart */}
      <ResponsiveContainer width='100%' height={120}>
        <LineChart data={chartData}>
          <XAxis dataKey='x' hide />
          <YAxis hide />
          <Line
            type='monotone'
            dataKey='y'
            stroke='#4F46E5'
            strokeWidth={2}
            dot={false}
          />
          <Line
            type='monotone'
            dataKey='y_2'
            stroke='#FFB81C'
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
      {/* Section ID as title */}
      <div className='text-center mb-2'>
        <div className='font-semibold text-sm'>{data.section_id}</div>
      </div>
    </div>
  );
}

// Main grid of small charts
export default function ChartGrid() {
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/data/traffic.json');
        const jsonData = await res.json();
        const formatted = jsonData.map((d) => ({
          ...d,
          location: [roundTo(d.location[0], 3), roundTo(d.location[1], 3)],
        }));
        setData(formatted);
      } catch (err) {
        console.error('Failed to fetch traffic data', err);
      }
    })();
  }, []);

  return (
    <section className='w-full py-16 bg-white text-center px-8'>
      <h2 className='text-3xl font-bold mb-8'>Traffic Flow By Location</h2>
      <p className='text-gray-600 mb-8'>
        Analysis of Weekday and Weekend Traffic Patterns
      </p>
      <div className='max-w-6xl mx-auto'>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
          {data.slice(0, 10).map((item, i) => (
            <div
              key={item.section_id || i}
              className='bg-white rounded-2xl shadow p-2 flex flex-col items-center justify-center'
            >
              {/* Each chart shows its own section_id */}
              <SmallChart data={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
