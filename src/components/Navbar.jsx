function Navbar() {
  return (
    <nav className='absolute top-0 left-0 w-full z-20 bg-transparent px-8 py-4 flex justify-between items-center'>
      <div className='text-white text-2xl font-bold'></div>
      <ul className='flex space-x-6 text-white text-lg'>
        <li>
          <a href='/' className='hover:underline'>
            Home
          </a>
        </li>
        <li>
          <a href='/#about' className='hover:underline'>
            About
          </a>
        </li>
      </ul>
    </nav>
  );
}
