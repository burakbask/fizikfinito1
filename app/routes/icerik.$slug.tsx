//card.$slug.tsx
import React, { useState, useEffect } from 'react';
import { useLoaderData } from '@remix-run/react';
import { LoaderArgs, json } from '@remix-run/node';
import { getItemBySlug } from '~/utils/directusClient';
import ShopifyScriptComponent from './book';
import ShopifyScriptComponentMobile from './book_mobile';
import { useMediaQuery } from 'react-responsive';

// Directus API'den veri almak için loader fonksiyonu
export const loader = async ({ params }: LoaderArgs) => {
  const { slug } = params;
  if (!slug) {
    throw new Response('Not Found', { status: 404 });
  }

  try {
    const card = await getItemBySlug('card_details', slug, { fields: '*,camp_tracking_details.id,camp_tracking_details.topic,camp_tracking_details.year,camp_tracking_details.aytPhysics,camp_tracking_details.vdkTests,camp_tracking_details.questionBankTests,camp_tracking_details.redRepeatTests,shopifyProductId' });
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
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  const playlistId = card.videoUrl?.split('list=')[1]?.split('&')[0];
  const videoId = card.videoUrl?.split('v=')[1]?.split('&')[0];
  const embedUrl = videoId && playlistId ? `https://www.youtube.com/embed/${videoId}?list=${playlistId}&origin=${typeof window !== 'undefined' ? window.location.origin : ''}` : null;

  useEffect(() => {
    if (typeof window !== 'undefined' && card.shopifyProductId) {
      window.scrollTo(0, 0);
    }
  }, [card.shopifyProductId]);

  return (
    <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f0f4f8', color: '#333', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#2c3e50', marginBottom: '40px' }}>{card.title}</h1>
      {embedUrl && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ flex: '1 1 700px', maxWidth: '900px', borderRadius: '15px', overflow: 'hidden', boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.2)', height: 'auto', aspectRatio: '16 / 9' }}>
            <iframe
              width="100%"
              height="100%"
              src={embedUrl}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ objectFit: 'contain' }}
            ></iframe>
          </div>
          {card.shopifyProductId && (
            <div style={{ flex: '1 1 300px', maxWidth: '275px', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '15px', boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)', padding: '10px', height: '100%' }}>
              {isMobile ? (
                <ShopifyScriptComponentMobile productId={card.shopifyProductId} />
              ) : (
                <ShopifyScriptComponent productId={card.shopifyProductId} />
              )}
            </div>
          )}
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
          marginTop: '40px',
          transition: 'background-color 0.3s ease, transform 0.3s ease',
          fontSize: '1.2rem',
          fontWeight: 'bold'
        }}
        onClick={() => {
          if (typeof window !== 'undefined') {
            window.location.href = 'https://www.youtube.com/channel/UC...';
          }
        }}
      >
        YOUTUBE KAMPIMIZA KATIL!
      </button>
      <div style={{ width: '100%', maxWidth: '1000px', margin: '40px auto', padding: '20px', backgroundColor: '#ffffff', borderRadius: '15px', boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', borderBottom: '2px solid #ccc', flexWrap: 'wrap' }}>
          {['Kamp Takip', 'Açıklama', 'Müfredat', 'PDF'].map((tab, index) => (
            <button
              key={index}
              onClick={() => setTabIndex(index)}
              style={{
                padding: '10px',
                border: 'none',
                background: tabIndex === index ? '#ecf0f1' : 'transparent',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
                borderRadius: '10px 10px 0 0',
                fontWeight: tabIndex === index ? 'bold' : 'normal',
                fontSize: '1rem',
                flex: '1 1 auto',
                textAlign: 'center'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
        <div style={{ padding: '20px', textAlign: 'left' }}>
          {tabIndex === 0 && (
            <div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                      <th style={{ padding: '10px', border: '1px solid #ddd' }}>Ünite ve Bölümler - PDF</th>
                      <th style={{ padding: '10px', border: '1px solid #ddd' }}>Yıl</th>
                      <th style={{ padding: '10px', border: '1px solid #ddd' }}>AYT Fizik</th>
                      <th style={{ padding: '10px', border: '1px solid #ddd' }}>VDK Konu Testleri</th>
                      <th style={{ padding: '10px', border: '1px solid #ddd' }}>Soru Bankası Testleri</th>
                      <th style={{ padding: '10px', border: '1px solid #ddd' }}>Kırmızı Ara Tekrarlar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {card.camp_tracking_details?.length > 0 ? (
                      card.camp_tracking_details.map((detail: any, index: number) => (
                        <tr key={index}>
                          <td style={{ padding: '10px', border: '1px solid #ddd' }}>{detail.topic || 'N/A'}</td>
                          <td style={{ padding: '10px', border: '1px solid #ddd' }}>{detail.year || 'N/A'}</td>
                          <td style={{ padding: '10px', border: '1px solid #ddd' }}>{detail.aytPhysics || 'N/A'}</td>
                          <td style={{ padding: '10px', border: '1px solid #ddd' }}>{detail.vdkTests || 'N/A'}</td>
                          <td style={{ padding: '10px', border: '1px solid #ddd' }}>{detail.questionBankTests || 'N/A'}</td>
                          <td style={{ padding: '10px', border: '1px solid #ddd' }}>{detail.redRepeatTests || 'N/A'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>Bu kısım yakında eklenecektir.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {tabIndex === 1 && <p><strong>Açıklama:</strong> {card.description}</p>}
          {tabIndex === 2 && <p><strong>Müfredat:</strong> {card.content}</p>}
          {tabIndex === 3 && (
            <div>
              {[card.pdfImage1, card.pdfImage2, card.pdfImage3].map((pdfImage, index) => (
                pdfImage && (
                  <div key={index} style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '15px', boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)', maxWidth: '100%' }}>
                    <img src={pdfImage} alt={`PDF ${index + 1}`} style={{ maxWidth: '300px', width: '100%', borderRadius: '10px' }} />
                    <div style={{ marginTop: '20px' }}>
                      <button
                        style={{
                          backgroundColor: '#007bff',
                          color: 'white',
                          padding: '10px 20px',
                          border: 'none',
                          borderRadius: '25px',
                          cursor: 'pointer',
                          transition: 'background-color 0.3s ease',
                          fontSize: '1rem',
                          fontWeight: 'bold'
                        }}
                        onClick={() => {
                          if (typeof window !== 'undefined') {
                            window.location.href = [card.pdfLink1, card.pdfLink2, card.pdfLink3][index];
                          }
                        }}
                      >
                        PDF İndir
                      </button>
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
