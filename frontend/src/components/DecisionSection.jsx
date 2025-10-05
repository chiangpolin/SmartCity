import { useState, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  CircleMarker,
  Popup,
  Polyline,
} from 'react-leaflet';

const traffics = ['Light', 'Moderate', 'Heavy'];
const sections = [
  {
    title: 'Algorithmic Decision-Making for Autonomous Urban Mobility',
    text: 'This study explores an algorithm that enables autonomous vehicles to decide whether to park or keep driving. The decision is based on predicted waiting times, parking availability, traffic conditions, and the cost trade-off between driving and parking, aiming to reduce overall cost and improve city traffic flow.',
    img: '/images/algorithm.png',
    reverse: false,
  },
];

const Section = ({ title, text, img, reverse }) => (
  <div
    className={`flex flex-col md:flex-row ${
      reverse ? 'md:flex-row-reverse' : ''
    } items-center gap-12`}
  >
    <div className='w-full md:w-1/2 space-y-3'>
      <h2 className='text-2xl md:text-3xl font-bold text-gray-800'>{title}</h2>
      <p className='text-gray-600 text-lg'>{text}</p>
    </div>
    <div className='w-full md:w-1/2 h-auto bg-gray-200 rounded-2xl shadow-lg flex items-center justify-center'>
      <img
        src={img}
        alt={title}
        className='rounded-2xl shadow-lg w-full h-full object-cover'
      />
    </div>
  </div>
);

// Map icon
const customIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const TrafficSelector = ({ traffic, setTraffic }) => {
  const getDelay = (t) =>
    t === 'Heavy' ? '30 mins' : t === 'Moderate' ? '15 mins' : '5 mins';

  return (
    <div>
      <label className='block font-medium mb-1'>Current Traffic</label>
      <select
        value={traffic}
        onChange={(e) => setTraffic(e.target.value)}
        className='w-full px-4 py-2 border rounded-lg'
      >
        {traffics.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      <p className='mt-1 text-gray-600'>Estimated delay: {getDelay(traffic)}</p>
    </div>
  );
};

const ParkingSelector = ({
  parkingLots,
  parking,
  setParking,
  parkingTime,
  setParkingTime,
}) => {
  const totalParkingCost = parking.costPerHour * parkingTime;

  return (
    <div>
      <label className='block font-medium mb-1'>Parking Lot</label>
      <select
        value={parking.name}
        onChange={(e) =>
          setParking(parkingLots.find((p) => p.name === e.target.value))
        }
        className='w-full px-4 py-2 border rounded-lg'
      >
        {parkingLots.map((p) => (
          <option key={p.name} value={p.name}>
            {p.name} (${p.costPerHour}/hr)
          </option>
        ))}
      </select>
      <label className='block mt-2 font-medium mb-1'>
        Parking Time (hours)
      </label>
      <input
        type='number'
        min='1'
        value={parkingTime}
        onChange={(e) => setParkingTime(Number(e.target.value))}
        className='w-full px-4 py-2 border rounded-lg'
      />
      <p className='mt-1 text-gray-600'>
        Total Parking Cost: ${totalParkingCost.toFixed(2)}
      </p>
    </div>
  );
};

export default function LeftPanelMap() {
  const [location, setLocation] = useState({ lat: 25.032, lng: 121.565 });
  const [traffic, setTraffic] = useState(traffics[0]);
  const [parkingLots, setParkingLots] = useState([]);
  const [parking, setParking] = useState({});
  const [parkingTime, setParkingTime] = useState(1);
  const [decision, setDecision] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/data/parking.json');
        const data = await res.json();
        const { start_point: s, parking_lots: lots } = data;
        setLocation({ lat: s.y, lng: s.x });
        const parking_lots = lots.map((lot) => ({
          lat: lot.y,
          lng: lot.x,
          costPerHour: Math.round((Math.random() * (5 - 2) + 2) * 10) / 10,
          ...lot,
        }));
        setParkingLots(parking_lots);
        setParking(parking_lots[0]);
      } catch (err) {
        console.error('Failed to fetch traffic data', err);
      }
    })();
  }, []);

  const electricityCostPerKm = 0.5;
  const distanceToDestination = 5;

  const totalElectricityCost = distanceToDestination * electricityCostPerKm;
  const totalParkingCost = parking.costPerHour * parkingTime;

  const coordinates =
    parking?.polyline?.geoJsonLinestring?.coordinates?.map((i) => [
      i[1],
      i[0],
    ]) || [];

  return (
    <>
      <section className='py-20 bg-gray-50 px-8'>
        <div className='max-w-6xl mx-auto space-y-24'>
          {sections.map((s, i) => (
            <Section key={i} {...s} />
          ))}
        </div>
      </section>
      <section className='relative w-full h-full overflow-hidden px-8'>
        <MapContainer
          center={[25.032, 121.555]}
          zoom={15}
          scrollWheelZoom={false}
          className='absolute inset-0 w-full h-full z-0'
        >
          <TileLayer url='https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png' />
          {parking.name && (
            <Marker position={[parking.y, parking.x]} icon={customIcon}>
              <Popup>{parking.name}</Popup>
            </Marker>
          )}
          {parkingLots
            .filter((p) => p.name !== parking.name)
            .map((p) => (
              <CircleMarker center={[p.lat, p.lng]} radius={1} color='red' />
            ))}
          <CircleMarker
            center={[location.lat, location.lng]}
            radius={4}
            color='red'
          />
          <Polyline positions={coordinates} color='red' weight={2} />
        </MapContainer>
        <div className='max-w-6xl mx-auto'>
          <div className='relative mt-20 md:w-1/2 bg-white/90 backdrop-blur-sm p-6 rounded-xl z-10 flex flex-col justify-between space-y-4'>
            <h2 className='text-2xl font-bold mb-4'>Cost Estimator</h2>
            <div>
              <label className='block font-medium mb-1'>Current Location</label>
              <input
                type='text'
                value={location.lat + ', ' + location.lng}
                onChange={(e) => {
                  const [lat, lng] = e.target.value.split(',').map(Number);
                  setLocation({ lat, lng });
                }}
                placeholder='Enter your current location'
                className='w-full px-4 py-2 border rounded-lg'
                disabled
              />
            </div>
            <TrafficSelector traffic={traffic} setTraffic={setTraffic} />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <p className='font-medium'>Electricity Cost for Car:</p>
                <p>${totalElectricityCost.toFixed(2)}</p>
              </div>
              <ParkingSelector
                parkingLots={parkingLots}
                parking={parking}
                setParking={setParking}
                parkingTime={parkingTime}
                setParkingTime={setParkingTime}
              />
            </div>

            <div className='flex gap-4'>
              <button
                className='flex-1 bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300'
                onClick={() => setDecision('Keep Driving')}
              >
                Keep Driving
              </button>
              <button
                className='flex-1 bg-indigo-700 text-white px-4 py-2 rounded-lg hover:bg-indigo-800'
                onClick={() => setDecision('Park')}
              >
                Park
              </button>
            </div>
            {decision && (
              <div className='mt-4 p-4 bg-gray-50 rounded-lg border'>
                {decision === 'Park' ? (
                  <p>
                    Route to <strong>{parking.name}</strong> selected. Estimated
                    parking cost for {parkingTime} hours: $
                    {totalParkingCost.toFixed(2)}{' '}
                  </p>
                ) : (
                  <p>
                    Continue driving. Estimated electricity cost for next{' '}
                    {distanceToDestination} km: $
                    {totalElectricityCost.toFixed(2)}.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
