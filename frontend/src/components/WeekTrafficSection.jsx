import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function roundTo(num, decimals = 3) {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}

function formatHour(hourDecimal) {
  const h = Math.floor(hourDecimal);
  const m = Math.round((hourDecimal - h) * 60);
  const hh = String(h).padStart(2, '0');
  const mm = String(m).padStart(2, '0');
  return `${hh}:${mm}`;
}

function generateTrafficData(rawData) {
  return rawData.flatMap((dayData, dayIndex) =>
    dayData.mean_x.map((xVal, i) => ({
      hour: roundTo(xVal + 24 * dayIndex, 3),
      volume: roundTo(dayData.mean_y[i], 0),
      upperCI: roundTo(dayData.ci_upper[i], 0),
      lowerCI: roundTo(dayData.ci_lower[i], 0),
      day: DAYS[Math.floor((xVal + 24 * dayIndex) / 24)],
    }))
  );
}

export default function TrafficSection() {
  return (
    <section className='w-full py-20 bg-white text-center px-8'>
      <h2 className='text-3xl font-bold mb-4'>Weekly Traffic Flow</h2>
      <p className='text-gray-600 mb-8'>
        Average traffic volume per hour over a week, showing peak and off-peak
        hours in Taipei City.
      </p>
      <div className='w-full max-w-6xl mx-auto'>
        <TrafficLineChart />
      </div>
    </section>
  );
}

function TrafficLineChart() {
  const [rawData, setRawData] = useState([]);

  useEffect(() => {
    const fetchTrafficData = async () => {
      try {
        const res = await fetch('/data/traffic_all.json');
        const json = await res.json();
        setRawData(json);
      } catch (err) {
        console.error('Failed to fetch traffic data:', err);
      }
    };
    fetchTrafficData();
  }, []);

  const trafficData = generateTrafficData(rawData);
  const ticks = Array.from({ length: 7 }, (_, i) => i * 24 + 12);

  // Transform data for proper Area shading
  const areaData = trafficData.map((d) => ({
    hour: d.hour,
    volume: d.volume,
    ci_diff: d.ci_upper - d.ci_lower,
    ci_lower: d.ci_lower,
    day: d.day,
  }));

  return (
    <div className='w-full h-96 bg-white p-4 rounded-lg shadow-md'>
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart data={areaData}>
          <CartesianGrid strokeDasharray='3 3' stroke='#eee' />
          <XAxis
            dataKey='hour'
            type='number'
            ticks={ticks}
            tickFormatter={(hour) => {
              const day = DAYS[Math.floor(hour / 24)];
              return `${day} ${formatHour(hour % 24)}`;
            }}
          />
          <YAxis
            label={{ value: 'Vehicles', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            formatter={(val) => `${roundTo(val, 0)} vehicles`}
            labelFormatter={(label) => {
              const day = DAYS[Math.floor(label / 24)];
              return `${day} ${formatHour(label % 24)}`;
            }}
          />
          <Line type='monotone' dataKey='volume' stroke='#4F46E5' dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
