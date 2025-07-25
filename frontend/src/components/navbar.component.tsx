import React from 'react';
import Container from './container.component';
import { Link } from 'react-router-dom';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'My Articles', path: '/articles/{userId}' },
  { name: 'About', path: '/about' },
];

const Navbar: React.FC = () => {
  // TODO: Search for useLocation()
  //   const location = useLocation();

  const baseClassName =
    'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-lg border-b border-gray-700';
  const containerClassName = 'py-2 flex items-center justify-between';
  const logoClassName =
    'text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent';

  return (
    <nav className={baseClassName}>
      <Container noDefaultPadding className={containerClassName}>
        <Link to="/" className={logoClassName}>
          ArtiGate
        </Link>
      </Container>
    </nav>
  );
};

export default Navbar;
