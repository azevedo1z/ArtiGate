import React, { ReactNode } from 'react';
import Navbar from './navbar.component';
import Container from './container.component';
import { ExternalLink } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  showHeader = true,
  showFooter = true,
}) => {
  const baseClassName = 'min-h-screen grid grid-rows-[auto_1fr_auto] bg-snow';

  const mainClassName = 'row-start-2 bg-snow';

  const footerClassName = 'bg-snow border-t border-ink-100';
  const footerContentClassName =
    'text-center text-xs text-ink-400 tracking-wide';

  const linkClassName =
    'inline-flex items-center gap-1 text-primary-500 hover:text-primary-600 transition-colors duration-150 font-medium';
  const currentYear = new Date().getFullYear();

  return (
    <div className={baseClassName}>
      {showHeader && <Navbar />}

      <main className={mainClassName}>{children}</main>

      {showFooter && (
        <footer className={footerClassName}>
          <Container noDefaultPadding className="py-5">
            <div className={footerContentClassName}>
              <p>
                &copy; {currentYear} ArtiGate &middot; Crafted by{' '}
                <a
                  href="https://github.com/azevedo1x"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClassName}
                >
                  <span>azevedo1x</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </p>
            </div>
          </Container>
        </footer>
      )}
    </div>
  );
};

export default Layout;
