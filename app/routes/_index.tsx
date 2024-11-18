import React from 'react';
import { Link } from '@remix-run/react';

export default function Index() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #1e3c72, #2a5298)',
      padding: '20px',
    }}>
      <header style={{ textAlign: 'center', paddingBottom: '20px' }}>
        <h1 style={{ color: 'white', fontSize: '3rem', fontWeight: 'bold' }}>
          Eğitim ve Bilgi Portalımıza Hoş Geldiniz
        </h1>
        <p style={{ color: '#f0f4f8', fontSize: '1.2rem' }}>
          Etkinlikler, ders kartları ve çok daha fazlasını keşfedin.
        </p>
      </header>
      <nav style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
        <Link to="/calendar" style={navButtonStyle}>
          Takvim
        </Link>
        <Link to="/cards" style={navButtonStyle}>
          Ders Kartları
        </Link>
      </nav>
    </div>
  );
}

const navButtonStyle = {
  padding: '15px 30px',
  backgroundColor: '#007bff',
  color: 'white',
  textDecoration: 'none',
  borderRadius: '25px',
  fontWeight: 'bold',
  transition: 'background-color 0.3s ease, transform 0.3s ease',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  cursor: 'pointer',
  ':hover': {
    backgroundColor: '#0056b3',
    transform: 'scale(1.05)',
  },
};
