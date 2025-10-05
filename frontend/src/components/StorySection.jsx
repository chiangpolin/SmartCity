export default function StorySection() {
  const sections = [
    {
      title: 'Autonomous Vehicles',
      text: 'Autonomous vehicles in future smart cities face continuous decisions, such as whether to park or continue driving. This research examines strategies to reduce operational costs while improving traffic flow, aiming to identify practical solutions for efficient urban mobility.',
      img: '/images/car.jpg',
      reverse: false,
    },
    {
      title: 'Autonomous Buses',
      text: 'In future smart cities, autonomous buses may reshape urban spaces by parking and offering temporary services. However, each decision to drive or park affects operational costs and traffic conditions',
      img: '/images/bus.jpg',
      reverse: true,
    },
  ];

  return (
    <section className='py-20 bg-gray-50'>
      <div className='max-w-6xl mx-auto px-6 space-y-24'>
        {sections.map((s, i) => (
          <div
            key={i}
            className={`flex flex-col md:flex-row ${
              s.reverse ? 'md:flex-row-reverse' : ''
            } items-center gap-12`}
          >
            {/* Text */}
            <div className='w-full md:w-1/2 space-y-3'>
              <h2 className='text-2xl md:text-3xl font-bold text-gray-800'>
                {s.title}
              </h2>
              <p className='text-gray-600 text-lg'>{s.text}</p>
            </div>

            {/* Image */}
            <div className='w-full md:w-1/2 h-64 md:h-96 bg-gray-200 rounded-2xl shadow-lg flex items-center justify-center'>
              <img
                src={s.img}
                alt={s.title}
                className='rounded-2xl shadow-lg w-full h-full object-cover'
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
