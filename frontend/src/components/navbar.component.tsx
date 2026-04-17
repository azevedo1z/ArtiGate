import React from 'react';
import Container from './container.component';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { clearUser } from '../store/slices/user.slice';
import { clearRoles } from '../store/slices/roles.slice';
import { toast } from 'react-hot-toast';
import { useIsLoggedIn } from '../hooks/useUser';
import { useIsReviewer } from '../hooks/useRoles';
import { ROUTES } from '../config/routes.config';

const Navbar: React.FC = () => {
  const isLoggedIn = useIsLoggedIn();
  const isReviewer = useIsReviewer();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: ROUTES.HOME },
    { name: 'My Articles', path: ROUTES.MY_ARTICLES },
    ...(isReviewer ? [{ name: 'My Reviews', path: ROUTES.MY_REVIEWS }] : []),
    { name: 'About', path: ROUTES.ABOUT },
  ];

  const baseClassName = 'bg-snow border-b border-ink-100';
  const containerClassName = 'py-4 flex items-center justify-between';
  const logoClassName =
    'text-xl font-semibold text-ink-800 tracking-tight hover:text-primary-500 transition-colors duration-150';
  const logoMarkClassName = 'text-primary-500';

  const navLinksClassName = 'hidden md:flex gap-7 items-center';
  const navLinkActiveClassName =
    'text-sm font-semibold text-primary-600 relative after:absolute after:bottom-[-16px] after:left-0 after:w-full after:h-[2px] after:bg-primary-500';
  const navLinkInactiveClassName =
    'text-sm font-medium text-ink-500 hover:text-ink-800 transition-colors duration-150';

  const logoutClassName =
    'inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-ink-600 hover:text-ink-800 hover:bg-ink-50 rounded-md transition-colors duration-150';

  const handleLogout = () => {
    dispatch(clearUser());
    dispatch(clearRoles());
    localStorage.removeItem('access_token');
    toast.success('Logged out successfully');
    navigate(ROUTES.LANDING);
  };

  return (
    <nav className={baseClassName}>
      <Container noDefaultPadding className={containerClassName}>
        <Link
          to={isLoggedIn ? ROUTES.HOME : ROUTES.LANDING}
          className={logoClassName}
        >
          <span className={logoMarkClassName}>Arti</span>Gate
        </Link>

        {isLoggedIn && (
          <>
            <div className={navLinksClassName}>
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    isActive ? navLinkActiveClassName : navLinkInactiveClassName
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            <button onClick={handleLogout} className={logoutClassName}>
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
