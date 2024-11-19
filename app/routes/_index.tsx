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
      height: '100vh',
      overflow: 'hidden',
      backgroundImage: 'url(https://cdn.zeduva.com/2024/11/fizikfintoarkaplan.webp)',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      padding: '0',
      boxSizing: 'border-box',
      margin: '0',
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
    }}>
      <header style={{ textAlign: 'center', paddingBottom: '20px', marginTop: '20px' }}>
        <h1 style={{ color: 'white', fontSize: '3rem', fontWeight: 'bold' }}>
          Eğitim ve Bilgi Portalımıza Hoş Geldiniz
        </h1>
        <p style={{ color: '#f0f4f8', fontSize: '1.2rem' }}>
          Etkinlikler, ders kartları ve çok daha fazlasını keşfedin.
        </p>
      </header>
      <nav style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
        <Link 
          to="/calendar" 
          style={{
            padding: '15px 30px',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '25px',
            fontWeight: 'bold',
            transition: 'background-color 0.3s ease, transform 0.3s ease',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#0056b3';
            (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#007bff';
            (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)';
          }}
        >
          Takvim
        </Link>
        <Link 
          to="/card" 
          style={{
            padding: '15px 30px',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '25px',
            fontWeight: 'bold',
            transition: 'background-color 0.3s ease, transform 0.3s ease',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#0056b3';
            (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#007bff';
            (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)';
          }}
        >
          Ders Kartları
        </Link>
      </nav>
    </div>
  );
}
