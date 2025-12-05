import React from 'react';
import Container from './container.component';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/my.store';
import { clearUser } from '../store/slices/user.slice';
import toast from 'react-hot-toast';

const Navbar: React.FC = () => {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  // const userId = useSelector((state: RootState) => state.user.data?._id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/home' },
    // { name: 'My Articles', path: `/articles/${userId}` },
    { name: 'My Articles', path: `#` },
    { name: 'About', path: '/about' },
  ];

  const baseClassName =
    'bg-gray-950 text-white shadow-2xl border-b-2 border-blue-500/20 backdrop-blur-sm';
  const containerClassName = 'py-4 flex items-center justify-between';
  const logoClassName =
    'text-3xl font-bold text-blue-500 hover:text-blue-400 transition-colors duration-300 tracking-tight';

  const navLinksClassName = 'flex gap-8 items-center';
  const navLinksContentClassName =
    'text font-semibold text-gray-300 hover:text-blue-400 transition-all duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-blue-400 after:transition-all after:duration-300 hover:after:w-full';

  const logoutClassName =
    'flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-300 hover:text-blue-400 border border-gray-700 hover:border-blue-400 rounded-lg transition-all duration-300 hover:bg-gray-900/50';

  const handleLogout = () => {
    dispatch(clearUser());
    localStorage.removeItem('access_token');
    toast.success('Logged out successfully');
    setTimeout(() => navigate('/'), 1000);
  };

  return (
    <nav className={baseClassName}>
      <Container noDefaultPadding className={containerClassName}>
        <Link to="/home" className={logoClassName}>
          ArtiGate
        </Link>

        {isLoggedIn && (
          <>
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

            <button
              onClick={handleLogout}
              className={logoutClassName}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </>
        )}
      </Container>
    </nav>
  );
};

export default Navbar;
