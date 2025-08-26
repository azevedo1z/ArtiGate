import React from 'react';
import Container from './container.component';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/my.store';
import { clearUser } from '../store/slices/user.slice';
import Button from './button.component';
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
    'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-lg border-b border-gray-700';
  const containerClassName = 'py-2 flex items-center justify-between';
  const logoClassName =
    'text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent';

  const navLinksClassName = 'flex gap-6 items-center';
  const navLinksContentClassName =
    'text-sm font-medium hover:text-blue-400 transition duration-200';

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

            <Button
              variantClassName="secondary"
              sizeClassName='sm'
              onClick={handleLogout}
              leadingIcon={<LogOut className="h-5 w-5" />}
            >
              Logout
            </Button>
          </>
        )}
      </Container>
    </nav>
  );
};

export default Navbar;
