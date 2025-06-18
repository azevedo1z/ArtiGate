import React, { ReactNode } from 'react';
import Container from './container.component';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const layoutClassName = 'min-h-screen grid grid-rows-[auto_1fr_auto]';
  const headerClassName = 'p-4 bg-gray-900 text-white row-start-1';
  const mainClassName = 'row-start-2';
  const footerClassName = 'p-4 bg-gray-900 text-white text-center';
  const linkClassName = 'underline ml-1';

  return (
    <div className={layoutClassName}>
      <header className={headerClassName}>
        <h1>ArtiGate</h1>
      </header>
      <main className={mainClassName}>
        <Container>{children}</Container>
      </main>
      <footer className={footerClassName}>
        &copy; {new Date().getFullYear()} ArtiGate. All rights reserved to
        <a
          href="https://github.com/azevedo1x"
          className={linkClassName}
          target="_blank"
          rel="noopener noreferrer"
        >
          https://github.com/azevedo1x
        </a>
        .
      </footer>
    </div>
  );
};

export default Layout;
