import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const headerClassName = 'p-4 bg-gray-900 text-white';
  const mainClassName = 'flex-1 p-8';
  const footerClassName = 'p-4 bg-gray-900 text-white text-center';
  const linkClassName = 'underline ml-1';
  const parentDivClassName = 'min-h-screen flex flex-col';

  return (
    <div className={parentDivClassName}>
      <header className={headerClassName}>
        <h1>ArtiGate</h1>
      </header>
      <main className={mainClassName}>{children}</main>
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
