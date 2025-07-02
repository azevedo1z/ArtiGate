import React, { ReactNode } from 'react';
import Container from './container.component';
import { ExternalLink } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  headerContent?: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  showHeader = true,
  showFooter = true,
  headerContent,
}) => {
  const baseClassName = 'min-h-screen grid grid-rows-[auto_1fr_auto]';

  const headerClassName =
    'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-lg border-b border-gray-700';
  const headerContentClassName = 'flex items-center justify-between';
  const logoClassName =
    'text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent';

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
      {showHeader && (
        <header className={headerClassName}>
          <Container noDefaultPadding className="py-4">
            <div className={headerContentClassName}>
              <h1 className={logoClassName}>ArtiGate</h1>
              {headerContent}
            </div>
          </Container>
        </header>
      )}

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
