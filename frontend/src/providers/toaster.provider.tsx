import React from 'react';
import { Toaster } from 'react-hot-toast';

interface ToasterProviderProps {
  children: React.ReactNode;
}

const ToasterProvider: React.FC<ToasterProviderProps> = ({ children }) => {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#374151',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            boxShadow:
              '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            style: {
              background: '#d1fae5',
              border: '1px solid #a7f3d0',
              color: '#059669',
            },
            iconTheme: {
              primary: '#059669',
              secondary: '#d1fae5',
            },
          },
          error: {
            style: {
              background: '#fee2e2',
              border: '1px solid #fecaca',
              color: '#dc2626',
            },
            iconTheme: {
              primary: '#dc2626',
              secondary: '#fee2e2',
            },
          },
        }}
      />
      {children}
    </>
  );
};

export default ToasterProvider;
