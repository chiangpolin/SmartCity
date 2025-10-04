import { useEffect, useState, useMemo } from 'react';
import {
  ComposedChart,
  Line,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

// Map icon
const customIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

// Generate scatter data
const generateScatterData = (selected, type) => {
  if (!selected.section_id) return [];
  return selected[type].x.map((val, i) => ({
    hour: roundTo(val?.[0] ?? 0, 3),
    traffic: roundTo(selected[type].y[i]?.[0] ?? 0, 3),
    location: selected.section_id,
  }));
};

// Generate line data
const generateLineData = (selected, type) => {
  if (!selected.section_id) return [];
  return selected[type].x_predict.map((val, i) => ({
    hour: roundTo(val[0], 3),
    traffic: roundTo(selected[type].y_predict[i][0], 3),
    location: selected.section_id,
  }));
};

export default function TrafficDashboardSection() {
  const [locations, setLocations] = useState([]);
  const [selected, setSelected] = useState({ location: [25.032, 121.565] });

  useEffect(() => {
    (async () => {
      const res = await fetch('/data/traffic.json');
      const data = await res.json();
      const formatted = data.map((d) => ({
        ...d,
        location: d.location.map((coord) => roundTo(coord, 3)),
      }));
      setLocations(formatted);
      setSelected(formatted[0]);
    })();
  }, []);

  // Memoized chart data
  const weekdayScatter = useMemo(
    () => generateScatterData(selected, 'weekday'),
    [selected]
  );
  const weekendScatter = useMemo(
    () => generateScatterData(selected, 'weekend'),
    [selected]
  );
  const weekdayLine = useMemo(
    () => generateLineData(selected, 'weekday'),
    [selected]
  );
  const weekendLine = useMemo(
    () => generateLineData(selected, 'weekend'),
    [selected]
  );

  return (
    <section className='w-full py-16 bg-white text-center'>
      <h2 className='text-3xl font-bold mb-8'>Daily Traffic Flow</h2>
      <p className='text-gray-600 mb-8'>
        Comparing Observed Traffic Patterns with Regression Model Predictions
      </p>
      <div className='grid md:grid-cols-2 gap-8 max-w-6xl mx-auto'>
        {/* Left: Controls + Chart */}
        <div className='space-y-6'>
          <div className='flex gap-2 justify-center md:justify-start flex-wrap'>
            {locations.map((loc) => (
              <button
                key={loc.id}
                onClick={() => setSelected(loc)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  selected.section_id === loc.section_id
                    ? 'bg-indigo-700 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {loc.section_id}
              </button>
            ))}
          </div>

          <div className='w-full h-72 p-4 rounded-lg shadow bg-white'>
            <ResponsiveContainer width='100%' height='100%'>
              <ComposedChart>
                <CartesianGrid strokeDasharray='3 3' stroke='#eee' />
                <XAxis
                  type='number'
                  ticks={[0, 3, 6, 9, 12, 15, 18, 21, 24]}
                  dataKey='hour'
                />
                <YAxis />
                <Scatter
                  data={weekdayScatter}
                  dataKey='traffic'
                  fill='#4F46E5'
                />
                <Scatter
                  data={weekendScatter}
                  dataKey='traffic'
                  fill='#FFB81C'
                />
                {/* Predicted lines */}
                <Line
                  type='monotone'
                  dataKey='traffic'
                  data={weekdayLine}
                  stroke='#4F46E5'
                  strokeWidth={1}
                  dot={false}
                />
                <Line
                  type='monotone'
                  dataKey='traffic'
                  data={weekendLine}
                  stroke='#FFB81C'
                  strokeWidth={1}
                  dot={false}
                />
                <Tooltip
                  formatter={(val) => `${roundTo(val, 0)} vehicles`}
                  labelFormatter={(label) => {
                    return `${formatHour(label % 24)}`;
                  }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Map */}
        <div className='w-full h-96 md:h-full rounded-lg overflow-hidden shadow'>
          <MapContainer
            center={[25.05, 121.53]}
            zoom={12}
            className='w-full h-full'
            scrollWheelZoom={false}
          >
            <TileLayer
              url='https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
              attribution='&copy; <a href="https://www.carto.com/">CARTO</a> &copy; OpenStreetMap'
            />
            <Marker position={selected.location} icon={customIcon}>
              <Popup>{selected.section_id}</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </section>
  );
}
