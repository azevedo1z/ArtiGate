import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const headerClass = 'p-4 bg-gray-900 text-white';
  const mainClass = 'flex-1 p-8';
  const footerClass = 'p-4 bg-gray-900 text-white text-center';
  const linkClass = 'underline ml-1';

  return (
    <div className="min-h-screen flex flex-col">
      <header className={headerClass}>
        <h1>ArtiGate</h1>
      </header>
      <main className={mainClass}>{children}</main>
      <footer className={footerClass}>
        &copy; {new Date().getFullYear()} ArtiGate. All rights reserved to
        <a
          href="https://github.com/azevedo1x"
          className={linkClass}
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
