import React from 'react';
import Container from './container.component';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'My Articles', path: '/articles/{userId}' },
  { name: 'About', path: '/about' },
];

const Navbar: React.FC = () => {
  // TODO: Implement redux
  // const { isLoggedIn } = useAuth();

  const baseClassName =
    'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-lg border-b border-gray-700';
  const containerClassName = 'py-2 flex items-center justify-between';
  const logoClassName =
    'text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent';

  const navLinksClassName = 'flex gap-6 items-center';
  const navLinksContentClassName =
    'text-sm font-medium hover:text-blue-400 transition duration-200';
  const settingsButtonClassName =
    'ml-4 p-2 rounded-lg hover:bg-gray-800 transition duration-200';

  return (
    <nav className={baseClassName}>
      <Container noDefaultPadding className={containerClassName}>
        <Link to="/" className={logoClassName}>
          ArtiGate
        </Link>

        {/* {isLoggedIn && ( */}
          <div className={navLinksClassName}>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={navLinksContentClassName}
              >
                {link.name}
              </Link>
            ))}
          </div>
        {/* )} */}
        <Link
          to="/settings"
          className={settingsButtonClassName}
          aria-label="Settings"
        >
          <Settings className="h-5 w-5" />
        </Link>

        {/* TODO: Mobile responsivity */}
        {/* <button aria-label="Open menu">
          <Menu className="h-6 w-6" />
        </button> */}
      </Container>
    </nav>
  );
};

export default Navbar;
