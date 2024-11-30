import React, { useState, useEffect } from 'react';
import { Link, useLoaderData, useNavigate } from '@remix-run/react';
import { json, redirect } from '@remix-run/node';
import { getCollectionItems } from '~/utils/directusClient';
import ShopifyScriptComponent from './book';
import ShopifyScriptComponentMobile from './book_mobile';
import ProductComponentWrapperMobile from './ProductComponentWrapper_mobile';
import ProductComponentWrapper from './ProductComponentWrapper';
import { useMediaQuery } from 'react-responsive';

type CardData = {
  id: string;
  slug: string;
  kategori: string;
  altkategori?: string;
  altaltkategori?: string;
  kursBasligi: string;
  kimlerIcin: string;
  suresi: string;
  seviye: number;
  kampKitabı: string;
  kursAciklamasi: string;
  image?: string;
  videoUrl?: string;
  shopifyProductId?: string;
};

export const loader = async ({ params, request }: { params: { category?: string; subcategory?: string; subsubcategory?: string }, request: Request }) => {
  const cardsData: CardData[] = await getCollectionItems('cards');
  const categoriesData = await getCollectionItems('Kategoriler');
  const { category, subcategory, subsubcategory } = params;
  const url = new URL(request.url);
  const { pathname } = url;

  // Redirect to the homepage if the URL does not match any category or subcategory
  if (category && !categoriesData.some((cat) => normalizeString(cat) === category)) {
    return redirect('/');
  }

  return json({ cardsData, categoriesData, initialCategory: category || 'YKS Hazırlık', initialSubcategory: subcategory || '', initialSubsubcategory: subsubcategory || '', pathname });
};

// Utility function to convert Turkish characters to English equivalents
// Utility function to convert Turkish characters to English equivalents
const normalizeString = (str: any) => {
  if (typeof str !== 'string') {
    return '';
  }

  return str
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[ı]/g, 'i')
    .replace(/[ç]/g, 'c')
    .replace(/[ş]/g, 's')
    .replace(/[ö]/g, 'o')
    .replace(/[ü]/g, 'u')
    .replace(/[ğ]/g, 'g')
    .replace(/\s+/g, '-'); // Replace spaces with hyphens for SEO
};

const categoryVideos: { [key: string]: string } = {
  'TYT': 'https://www.youtube.com/embed/videoseries?list=PLwyfvkhKMmwowVyIegsf3QQw3OsYfEkPR',
  'AYT': 'https://www.youtube.com/embed/videoseries?list=PLwyfvkhKMmwowVyIegsf3QQw3OsYfEkPR',
  '9. Sınıf': 'https://www.youtube.com/embed/videoseries?list=PLwyfvkhKMmwowVyIegsf3QQw3OsYfEkPR',
  '10. Sınıf': 'https://www.youtube.com/embed/videoseries?list=PLwyfvkhKMmwowVyIegsf3QQw3OsYfEkPR',
  '11. Sınıf': 'https://www.youtube.com/embed/videoseries?list=PLwyfvkhKMmwowVyIegsf3QQw3OsYfEkPR',
  '12. Sınıf': 'https://www.youtube.com/embed/videoseries?list=PLwyfvkhKMmwowVyIegsf3QQw3OsYfEkPR'
};

export default function Index() {
  const navigate = useNavigate();
  const { cardsData, categoriesData, initialCategory, initialSubcategory, initialSubsubcategory, pathname } = useLoaderData<typeof loader>();

  useEffect(() => {
    if (pathname) {
      window.history.replaceState(null, '', pathname);
    }
  }, [pathname]);

  const [filteredCategory, setFilteredCategory] = useState<string>(initialCategory);
  const [filteredSubcategory, setFilteredSubcategory] = useState<string>(initialSubcategory);
  const [filteredSubsubcategory, setFilteredSubsubcategory] = useState<string>(initialSubsubcategory);
  const [filteredCards, setFilteredCards] = useState<CardData[]>([]);

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  const categories = Array.from(new Set(cardsData.map((card) => card.kategori)));

  const subcategories =
    filteredCategory !== 'YKS Hazırlık'
      ? Array.from(
          new Set([
            'neler var',
            ...cardsData
              .filter((card) => card.kategori === filteredCategory)
              .map((card) => card.altkategori)
          ])
        )
      : [];

  const subsubcategories =
    filteredSubcategory !== ''
      ? Array.from(
          new Set(
            cardsData
              .filter((card) => card.altkategori === filteredSubcategory)
              .map((card) => card.altaltkategori)
          )
        )
      : [];

  useEffect(() => {
    setFilteredCards(cardsData);
  }, [cardsData]);

  const handleFilter = (kategori: string) => {
    setFilteredCategory(kategori);
    setFilteredSubcategory('');
    setFilteredSubsubcategory('');
    const normalizedKategori = normalizeString(kategori);
    window.history.pushState(null, '', `/${normalizedKategori}`);
  };

  const handleSubcategoryFilter = (altkategori: string) => {
    setFilteredSubcategory(altkategori);
    setFilteredSubsubcategory('');
    const normalizedKategori = normalizeString(filteredCategory);
    const normalizedAltkategori = normalizeString(altkategori);
    window.history.pushState(null, '', `/${normalizedKategori}/${normalizedAltkategori}`);
  };

  const handleSubsubcategoryFilter = (altaltkategori: string) => {
    setFilteredSubsubcategory(altaltkategori);
    const normalizedKategori = normalizeString(filteredCategory);
    const normalizedAltkategori = normalizeString(filteredSubcategory);
    const normalizedAltaltkategori = normalizeString(altaltkategori);
    window.history.pushState(null, '', `/${normalizedKategori}/${normalizedAltkategori}/${normalizedAltaltkategori}`);
  };

  useEffect(() => {
    let updatedFilteredCards = cardsData;

    if (filteredCategory !== 'YKS Hazırlık') {
      updatedFilteredCards = updatedFilteredCards.filter(
        (card) => card.kategori === filteredCategory
      );
    }

    if (filteredSubcategory !== '') {
      updatedFilteredCards = updatedFilteredCards.filter(
        (card) => card.altkategori === filteredSubcategory
      );
    }

    if (filteredSubsubcategory !== '') {
      updatedFilteredCards = updatedFilteredCards.filter(
        (card) => card.altaltkategori === filteredSubsubcategory
      );
    }

    setFilteredCards(updatedFilteredCards);
  }, [filteredCategory, filteredSubcategory, filteredSubsubcategory, cardsData]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: '#f0f4f8',
        minHeight: '100vh',
        padding: isMobile ? '10px' : '20px',
        width: '100%',
        maxWidth: isMobile ? '100%' : '1000px',
        margin: '0 auto',
      }}
    >
      {/* Filter Buttons */}
      <div
        style={{
          marginTop: '20px',
          display: 'flex',
          gap: isMobile ? '10px' : '20px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #ece9e6, #ffffff)',
          padding: isMobile ? '10px' : '20px',
          borderRadius: '25px',
          boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)',
        }}
      >
        {['YKS Hazırlık', ...categories].map((kategori) => (
          <button
            key={kategori}
            onClick={() => handleFilter(kategori)}
            style={{
              padding: isMobile ? '5px 10px' : '10px 20px',
              cursor: 'pointer',
              borderRadius: '25px',
              border: 'none',
              backgroundColor: filteredCategory === kategori ? '#6c63ff' : '#fff',
              color: filteredCategory === kategori ? '#fff' : '#6c63ff',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
              transition: 'background-color 0.3s ease, color 0.3s ease',
            }}
          >
            {kategori}
          </button>
        ))}
      </div>
      {/* Subcategories Filter Buttons */}
      {filteredCategory !== 'YKS Hazırlık' && subcategories.length > 0 && (
        <div
          style={{
            marginTop: '20px',
            display: 'flex',
            gap: isMobile ? '10px' : '20px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f9f9f9, #ffffff)',
            padding: isMobile ? '10px' : '20px',
            borderRadius: '25px',
            boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.15)',
          }}
        >
          {subcategories.map((altkategori) => (
            <button
              key={altkategori}
              onClick={() => handleSubcategoryFilter(altkategori)}
              style={{
                padding: isMobile ? '5px 10px' : '10px 20px',
                cursor: 'pointer',
                borderRadius: '25px',
                border: 'none',
                backgroundColor: filteredSubcategory === altkategori ? '#28a745' : '#fff',
                color: filteredSubcategory === altkategori ? '#fff' : '#28a745',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                transition: 'background-color 0.3s ease, color 0.3s ease',
              }}
            >
              {altkategori}
            </button>
          ))}
        </div>
      )}
      {/* Subsubcategories Filter Buttons */}
      {filteredSubcategory !== '' && subsubcategories.length > 0 && (
        <div
          style={{
            marginTop: '20px',
            display: 'flex',
            gap: isMobile ? '10px' : '20px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f9f9f9, #ffffff)',
            padding: isMobile ? '10px' : '20px',
            borderRadius: '25px',
            boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.15)',
          }}
        >
          {subsubcategories.map((altaltkategori) => (
            <button
              key={altaltkategori}
              onClick={() => handleSubsubcategoryFilter(altaltkategori)}
              style={{
                padding: isMobile ? '5px 10px' : '10px 20px',
                cursor: 'pointer',
                borderRadius: '25px',
                border: 'none',
                backgroundColor: filteredSubsubcategory === altaltkategori ? '#ff6347' : '#fff',
                color: filteredSubsubcategory === altaltkategori ? '#fff' : '#ff6347',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                transition: 'background-color 0.3s ease, color 0.3s ease',
              }}
            >
              {altaltkategori}
            </button>
          ))}
        </div>
      )}
      {/* Static Video for "neler var" Subcategory */}
      {filteredSubcategory === 'neler var' && categoryVideos[filteredCategory] && (
        <div
          style={{
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            backgroundColor: '#ffffff',
            padding: '10px',
            borderRadius: '15px',
            boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)',
          }}
        >
          <iframe
            width={isMobile ? '100%' : '700px'}
            height={isMobile ? '200px' : '400px'}
            src={categoryVideos[filteredCategory]}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              borderRadius: '15px',
              boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.2)',
              objectFit: 'cover',
            }}
          ></iframe>
        </div>
      )}
      {/* Filtered Cards */}
      <div style={{ marginTop: '20px', width: '100%' }}>
        {filteredCards.length > 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: isMobile ? '10px' : '20px',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'center',
            }}
          >
            {filteredCards.map((card) => (
              <Link
                key={card.id}
                to={`/icerik/${card.slug}`}
                style={{ textDecoration: 'none', color: 'inherit', width: '100%', display: 'flex', justifyContent: 'center', maxWidth: '1200px' }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    marginBottom: '20px',
                    cursor: 'pointer',
                    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
                    borderRadius: '15px',
                    overflow: 'hidden',
                    transition: 'transform 0.3s ease',
                    backgroundColor: '#fff',
                    width: '100%',
                    textAlign: 'left',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    const detayButton = e.currentTarget.querySelector('.detay-button');
                    if (detayButton) detayButton.style.right = '0';
                  }}
                  onMouseLeave={(e) => {
                    const detayButton = e.currentTarget.querySelector('.detay-button');
                    if (detayButton) detayButton.style.right = '-80px';
                  }}
                >
                  {card.videoUrl ? (
                    <iframe
                      width={isMobile ? '100%' : '250px'}
                      height={isMobile ? '200px' : '200px'}
                      src={`https://www.youtube.com/embed/${card.videoUrl.split('v=')[1]?.split('&')[0] || ''}`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{
                        borderRadius: isMobile ? '15px 15px 0 0' : '15px 0 0 15px',
                        boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.2)',
                        objectFit: 'cover',
                      }}
                    ></iframe>
                  ) : (
                    <div
                      style={{
                        width: isMobile ? '100%' : '150px',
                        height: '150px',
                        backgroundColor: '#ccc',
                        borderRadius: isMobile ? '15px 15px 0 0' : '15px 0 0 15px',
                      }}
                    >
                      Görsel Yok
                    </div>
                  )}
                  <div
                    style={{
                      padding: '15px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'flex-start',
                      textAlign: 'left',
                      position: 'relative',
                      width: '100%',
                    }}
                  >
                    <h3 style={{ color: '#007bff', marginBottom: '10px', whiteSpace: 'normal', overflow: 'visible', textOverflow: 'unset' }}>{card.kursBasligi}</h3>
                    <p style={{ color: '#555', marginBottom: '5px' }}><strong>Kimler İçin:</strong> {card.kimlerIcin}</p>
                    <p style={{ color: '#555', marginBottom: '5px' }}><strong>Süresi Ne Kadar:</strong> {card.suresi}</p>
                    <p style={{ color: '#555', marginBottom: '5px' }}><strong>Seviye:</strong> {card.seviye}</p>
                    <p style={{ color: '#555', marginBottom: '5px' }}><strong>Kamp Kitabı:</strong> {card.kampKitabı}</p>
                    <hr style={{
                      border: 'none',
                      height: '2px',
                      background: 'linear-gradient(to right, #ff8c00, #ff0080, #8a2be2)',
                      width: '100%',
                      margin: '10px 0',
                    }} />
                    <p style={{ color: '#555', whiteSpace: 'normal', overflow: 'visible', textOverflow: 'unset' }}><strong>Kurs Açıklaması: </strong>{card.kursAciklamasi}</p>
                    <div
                      style={{
                        position: 'absolute',
                        right: '-80px',
                        top: '0',
                        bottom: '0',
                        background: 'linear-gradient(to right, #ff8c00, #ff0080)',
                        color: '#fff',
                        padding: '5px 15px',
                        borderRadius: '0 25px 25px 0',
                        fontWeight: 'bold',
                        transition: 'right 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      className="detay-button"
                    >
                      DETAY
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p style={{ color: '#555' }}>Kriterlerinize uygun sonuç bulunamadı.</p>
        )}
      </div>
    </div>
  );
}
