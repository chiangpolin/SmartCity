export default function Hero() {
  return (
    <section className='relative h-screen w-full'>
      {/* Background image */}
      <img
        src='/images/smart_city.jpg'
        alt='Hero background'
        className='absolute inset-0 w-full h-full object-cover z-0'
      />

      {/* Overlay */}
      <div className='absolute inset-0 bg-black/20 z-0' />

      {/* Content */}
      <div className='relative z-10 flex h-full items-center pl-12 md:pl-24'>
        <div className='text-white max-w-xl'>
          <h1 className='text-2xl md:text-4xl font-bold mb-6'>
            Self-Driving City
          </h1>
          <p className='text-lg md:text-xl mb-8'>
            Case Study: Traffic and Parking Challenges in Taipei
          </p>
          <a
            href='https://www.chiangpolin.com/pdf/smart-city.pdf'
            target='_blank'
            rel='noopener noreferrer'
            className='inline-block px-6 py-3 bg-indigo-700 hover:bg-blue-700 rounded-2xl shadow-lg transition'
          >
            Download PDF
          </a>
        </div>
      </div>
    </section>
  );
}