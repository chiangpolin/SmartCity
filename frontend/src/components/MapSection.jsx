// src/components/MapSection.jsx
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';

function getColor(value, min, max) {
  if (max === min) return 'rgb(255,255,128)'; // Avoid division by zero
  const ratio = (value - min) / (max - min);
  const r = 255;
  const g = Math.round(255 - 155 * ratio);
  const b = Math.round(128 - 128 * ratio);
  return `rgb(${r},${g},${b})`;
}

// Reusable Map component
function MapChart({ markers, getMarkerProps }) {
  return (
    <div className='w-full h-96 md:h-[500px] max-w-6xl mx-auto rounded-lg overflow-hidden shadow-lg border border-gray-200'>
      <MapContainer
        center={[25.05, 121.52]}
        zoom={13}
        scrollWheelZoom={false}
        className='w-full h-full'
      >
        <TileLayer
          url='https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
          attribution='&copy; <a href="https://www.carto.com/">CARTO</a> &copy; OpenStreetMap contributors'
        />
        {markers.map((marker) => (
          <CircleMarker
            key={marker.id}
            center={marker.coords}
            radius={getMarkerProps(marker).radius}
            pathOptions={getMarkerProps(marker).pathOptions}
          />
        ))}
      </MapContainer>
    </div>
  );
}

export default function MapSection() {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const fetchMarkers = async () => {
      const res = await fetch('/data/parking_data.csv');
      const csvText = await res.text();
      const lines = csvText.split('\n').map((line) => line.split(','));

      const parsedMarkers = lines.reduce((acc, i) => {
        const id = i[0];
        const lat = Number(i[5]);
        const lng = Number(i[4]);
        const payex = Number(i[9]);
        const availablecar = Number(i[11]);

        if (
          !id ||
          Number.isNaN(lat) ||
          Number.isNaN(lng) ||
          Number.isNaN(payex)
        )
          return acc;

        acc.push({
          id,
          name: `Park ${id}`,
          coords: [lat, lng],
          payex,
          availablecar,
        });
        return acc;
      }, []);

      setMarkers(parsedMarkers);
    };

    fetchMarkers();
  }, []);

  if (!markers.length) return null;

  const minPayex = Math.min(...markers.map((m) => m.payex));
  const maxPayex = Math.max(...markers.map((m) => m.payex));

  const maps = [
    {
      title: 'Parking Lot Locations',
      text: 'Explore the geographical distribution of parking lots across Taipei.',
      getMarkerProps: (m) => ({
        radius: 1,
        pathOptions: {
          color: 'transparent',
          fillColor: 'yellow',
          fillOpacity: 1,
        },
      }),
    },
    {
      title: 'Parking Prices & Availability',
      text: 'Compare parking lots by cost and available spaces to find the best spot quickly.',
      getMarkerProps: (m) => ({
        radius: Math.ceil(m.availablecar / 200),
        pathOptions: {
          color: 'transparent',
          fillColor: getColor(m.payex, minPayex, maxPayex),
          fillOpacity: 1,
        },
      }),
    },
  ];

  return (
    <section className='w-full py-16 bg-black text-center'>
      {maps.map((m, idx) => (
        <div key={idx} className='mb-12'>
          <h2 className='text-3xl font-bold mb-4 text-white'>{m.title}</h2>
          <p className='max-w-2xl mx-auto mb-8 text-white'>{m.text}</p>
          <MapChart markers={markers} getMarkerProps={m.getMarkerProps} />
        </div>
      ))}
    </section>
  );
}
