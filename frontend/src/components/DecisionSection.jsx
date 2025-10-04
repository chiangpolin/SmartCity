import { useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';

const mockTraffic = ['Light', 'Moderate', 'Heavy'];
const mockParkingLots = [
  { name: 'Lot A', lat: 25.033, lng: 121.565, costPerHour: 2 },
  { name: 'Lot B', lat: 25.037, lng: 121.57, costPerHour: 3 },
];

const sections = [
  {
    title: 'Fast & Scalable',
    text: 'Our platform is built to scale effortlessly with your needs, providing high performance at every stage.',
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
        {mockTraffic.map((t) => (
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
          setParking(mockParkingLots.find((p) => p.name === e.target.value))
        }
        className='w-full px-4 py-2 border rounded-lg'
      >
        {mockParkingLots.map((p) => (
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
  const [traffic, setTraffic] = useState(mockTraffic[0]);
  const [parking, setParking] = useState(mockParkingLots[0]);
  const [parkingTime, setParkingTime] = useState(1);
  const [decision, setDecision] = useState('');

  const electricityCostPerKm = 0.5;
  const distanceToDestination = 5;

  const totalElectricityCost = distanceToDestination * electricityCostPerKm;
  const totalParkingCost = parking.costPerHour * parkingTime;

  return (
    <>
      <section className='py-20 bg-gray-50'>
        <div className='max-w-6xl mx-auto space-y-24'>
          {sections.map((s, i) => (
            <Section key={i} {...s} />
          ))}
        </div>
      </section>

      <section className='relative w-full h-full overflow-hidden'>
        <MapContainer
          center={[25.032, 121.555]}
          zoom={15}
          scrollWheelZoom={false}
          className='absolute inset-0 w-full h-full z-0'
        >
          <TileLayer url='https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png' />
          <Marker position={[25.032, 121.565]} />
          <Marker position={[25.037, 121.57]} />
        </MapContainer>

        <div className='max-w-6xl mx-auto'>
          <div className='relative mt-20 md:w-1/2 bg-white/90 backdrop-blur-sm p-6 rounded-xl z-10 flex flex-col justify-between space-y-4'>
            <h2 className='text-2xl font-bold mb-4'>
              Autonomous Driving Panel
            </h2>

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
              />
            </div>

            <TrafficSelector traffic={traffic} setTraffic={setTraffic} />

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <p className='font-medium'>Electricity Cost for Car:</p>
                <p>${totalElectricityCost.toFixed(2)}</p>
              </div>
              <ParkingSelector
                parking={parking}
                setParking={setParking}
                parkingTime={parkingTime}
                setParkingTime={setParkingTime}
              />
            </div>

            <div className='flex gap-4'>
              <button
                className='flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700'
                onClick={() => setDecision('Park')}
              >
                Park
              </button>
              <button
                className='flex-1 bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300'
                onClick={() => setDecision('Keep Driving')}
              >
                Keep Driving
              </button>
            </div>

            {decision && (
              <div className='mt-4 p-4 bg-gray-50 rounded-lg border'>
                {decision === 'Park' ? (
                  <p>
                    Route to <strong>{parking.name}</strong> selected. Estimated
                    cost: $
                    {(totalElectricityCost + totalParkingCost).toFixed(2)}{' '}
                    including electricity and parking.
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
