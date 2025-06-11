import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <header style={{ padding: '1rem', background: '#222', color: '#fff' }}>
      <h1>ArtiGate</h1>
    </header>
    <main style={{ flex: 1, padding: '2rem' }}>{children}</main>
    <footer
      style={{
        padding: '1rem',
        background: '#222',
        color: '#fff',
        textAlign: 'center',
      }}
    >
      &copy; {new Date().getFullYear()} ArtiGate. All rights reserved to
      https://github.com/azevedo1x.
    </footer>
  </div>
);

export default Layout;
