import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <header className="p-4 bg-gray-900 text-white">
      <h1>ArtiGate</h1>
    </header>
    <main className="flex-1 p-8">{children}</main>
    <footer className="p-4 bg-gray-900 text-white text-center">
      &copy; {new Date().getFullYear()} ArtiGate. All rights reserved to
      <a
        href="https://github.com/azevedo1x"
        className="underline ml-1"
        target="_blank"
        rel="noopener noreferrer"
      >
        https://github.com/azevedo1x
      </a>
      .
    </footer>
  </div>
);

export default Layout;
