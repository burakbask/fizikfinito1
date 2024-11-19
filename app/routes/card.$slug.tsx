import React, { useState } from 'react';
import { useLoaderData } from '@remix-run/react';
import { LoaderArgs, json } from '@remix-run/node';
import { getItemBySlug } from '~/utils/directusClient';
import ShopifyScriptComponent from './book';

// Directus API'den veri almak için loader fonksiyonu
export const loader = async ({ params }: LoaderArgs) => {
  const { slug } = params;
  if (!slug) {
    throw new Response('Not Found', { status: 404 });
  }

  // Directus'tan ilgili kart verisini alıyoruz
  try {
    const card = await getItemBySlug('card_details', slug);
    if (!card) {
      throw new Response('Not Found', { status: 404 });
    }

    return json(card);
  } catch (error) {
    console.error("Error fetching card data:", error);
    throw new Response('Server Error', { status: 500 });
  }
};

// CardDetail bileşeni
export default function CardDetail() {
  const card = useLoaderData<typeof loader>();
  const [tabIndex, setTabIndex] = useState(0);

  const videoId = card.videoUrl?.split('v=')[1]?.split('&')[0]; // Video ID'sini doğru şekilde almak için bölme işlemi
  const embedUrl =
    videoId && typeof window !== 'undefined'
      ? `https://www.youtube.com/embed/${videoId}?origin=${window.location.origin}`
      : null;

  return (
    <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f0f4f8', color: '#333', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#2c3e50', marginBottom: '20px' }}>{card.title}</h1>
      {embedUrl && (
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
          <iframe
            width="800"
            height="450"
            src={embedUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ borderRadius: '15px', boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.2)' }}
          ></iframe>
        </div>
      )}
      <button
        style={{
          backgroundColor: '#e74c3c',
          color: 'white',
          padding: '15px 30px',
          border: 'none',
          borderRadius: '50px',
          cursor: 'pointer',
          marginTop: '30px',
          transition: 'background-color 0.3s ease, transform 0.3s ease',
          fontSize: '1.2rem',
          fontWeight: 'bold'
        }}
        onClick={() => window.location.href = 'https://www.youtube.com/channel/UC...'}
      >
        YOUTUBE KAMPIMIZA KATIL!
      </button>
      <div style={{ width: '80%', margin: '40px auto', padding: '20px', backgroundColor: '#ffffff', borderRadius: '15px', boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', borderBottom: '2px solid #ccc' }}>
          {['Açıklama', 'Müfredat', 'PDF\'ler', 'Diğer Videolarımız', 'Video\'ya Ait Kitabımız'].map((tab, index) => (
            <button
              key={index}
              onClick={() => setTabIndex(index)}
              style={{
                padding: '15px',
                border: 'none',
                background: tabIndex === index ? '#ecf0f1' : 'transparent',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
                borderRadius: '10px 10px 0 0',
                fontWeight: tabIndex === index ? 'bold' : 'normal',
                fontSize: '1.1rem',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
        <div style={{ padding: '20px', textAlign: 'left' }}>
          {tabIndex === 0 && <p><strong>Açıklama:</strong> {card.description}</p>}
          {tabIndex === 1 && <p><strong>Müfredat:</strong> {card.category}</p>}
          {tabIndex === 2 && <p><strong>PDF'e gitmek için tıklayın:</strong> {card.pdf ? <a href={card.pdf} style={{ color: '#007bff' }}>PDF Linki</a> : ' PDF mevcut değil'}</p>}
          {tabIndex === 3 && (
            <div>
              <h2 style={{ color: '#333' }}>İçerik Detayları</h2>
              <p>{card.content}</p>
            </div>
          )}
          {tabIndex === 4 && card.shopifyProductId && (
            <div>
              {/* Shopify ürün bileşeni */}
              <ShopifyScriptComponent productId={card.shopifyProductId} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
