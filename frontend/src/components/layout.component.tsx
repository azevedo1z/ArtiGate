import React, { ReactNode } from 'react';
import Container from './container.component';
import Navbar from './navbar.component';
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
  const baseClassName = 'min-h-screen grid grid-rows-[auto_1fr_auto]';

  const mainClassName =
    'row-start-2 bg-gradient-to-br from-gray-50 via-white to-blue-50';

  const footerClassName =
    'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white border-t border-gray-700';
  const footerContentClassName = 'text-center text-sm text-gray-300';

  const linkClassName =
    'inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition duration-200 font-medium';
  const currentYear = new Date().getFullYear();

  return (
    <div className={baseClassName}>
      {showHeader && <Navbar />}

      <main className={mainClassName}>
        <Container>{children}</Container>
      </main>

      {showFooter && (
        <footer className={footerClassName}>
          <Container noDefaultPadding className="py-6">
            <div className={footerContentClassName}>
              <p>
                &copy; {currentYear} ArtiGate. All rights reserved to{' '}
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
