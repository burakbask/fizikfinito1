import React, { useState, useEffect } from 'react';
import { Link, useLoaderData, useNavigate } from '@remix-run/react';
import { json, redirect } from '@remix-run/node';
import { getCollectionItems } from '~/utils/directusClient';
import { useMediaQuery } from 'react-responsive';
import ShopifyScriptComponent from './book';
import ShopifyScriptComponentMobile from './book_mobile';

// Type definition for CardData
type CardData = {
  id: string;
  slug: string;
  kategori: string;
  altkategori?: string;
  altaltkategori?: string;
  kursBasligi: string;
  kimlerIcin: string;
  suresi: string;
  seviye: string;
  guncelMi: string;
  kampKitabı: string;
  kursAciklamasi: string;
  image?: string;
  videoUrl?: string;
  shopifyProductId?: string;
};

// Loader function for fetching data
export const loader = async ({ params, request }: { params: { category?: string; subcategory?: string; subsubcategory?: string }, request: Request }) => {
  const cardsData: CardData[] = await getCollectionItems('cards');
  const categoriesData = await getCollectionItems('Kategoriler');
  const { category, subcategory, subsubcategory } = params;
  const url = new URL(request.url);
  const { pathname } = url;

  const firstCategory = categoriesData.length > 0 ? categoriesData[0] : '';

  // Redirect to the homepage if the URL does not match any category or subcategory
  if (category && !categoriesData.some((cat) => normalizeString(cat) === category)) {
    return redirect('/');
  }

  return json({
    cardsData,
    categoriesData,
    initialCategory: category || normalizeString(firstCategory),
    initialSubcategory: subcategory || 'Neler Bulabilirsiniz?',
    initialSubsubcategory: subsubcategory || '',
    pathname
  });
};

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

// Category videos map
const categoryVideos: { [key: string]: string } = {
  'YKS': 'https://www.youtube.com/embed/videoseries?list=PLwyfvkhKMmwowVyIegsf3QQw3OsYfEkPR',
  'TYT': 'https://www.youtube.com/embed/videoseries?list=PLwyfvkhKMmwowVyIegsf3QQw3OsYfEkPR',
  'AYT': 'https://www.youtube.com/embed/videoseries?list=PLwyfvkhKMmwowVyIegsf3QQw3OsYfEkPR',
  '9. Sınıf': 'https://www.youtube.com/embed/videoseries?list=PLwyfvkhKMmwowVyIegsf3QQw3OsYfEkPR',
  '10. Sınıf': 'https://www.youtube.com/embed/videoseries?list=PLwyfvkhKMmwowVyIegsf3QQw3OsYfEkPR',
  '11. Sınıf': 'https://www.youtube.com/embed/videoseries?list=PLwyfvkhKMmwowVyIegsf3QQw3OsYfEkPR',
  '12. Sınıf': 'https://www.youtube.com/embed/videoseries?list=PLwyfvkhKMmwowVyIegsf3QQw3OsYfEkPR'
};

// Product IDs for each category
const categoryProducts: { [key: string]: string } = {
  'YKS': '9840110862641',
  'TYT': '9845540684081',
  'AYT': '9849083003185',
  '9. Sınıf': '9840130916657',
  '10. Sınıf': '9865880830257',
  '11. Sınıf': '9839677997361',
  '12. Sınıf': '9845521613105'
};

export default function Index() {
  const navigate = useNavigate();
  const { cardsData, categoriesData, initialCategory: initialCategoryFromLoader, initialSubcategory, initialSubsubcategory, pathname } = useLoaderData<typeof loader>();

  useEffect(() => {
    if (pathname) {
      window.history.replaceState(null, '', pathname);
    }
  }, [pathname]);

  const [filteredCategory, setFilteredCategory] = useState<string>(initialCategoryFromLoader);
  const [filteredSubcategory, setFilteredSubcategory] = useState<string>(initialSubcategory);
  const [filteredSubsubcategory, setFilteredSubsubcategory] = useState<string>(initialSubsubcategory);
  const [filteredCards, setFilteredCards] = useState<CardData[]>([]);

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  const categories = Array.from(new Set(cardsData.map((card) => card.kategori)));

  const subcategories =
    filteredCategory !== ''
      ? Array.from(
          new Set([
            'Neler Bulabilirsiniz?',
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
    setFilteredSubcategory('Neler Bulabilirsiniz?'); // Varsayılan altkategori
    setFilteredSubsubcategory('');
    const normalizedKategori = normalizeString(kategori);
    window.history.pushState(null, '', `/${normalizedKategori}`);

    if (typeof window !== 'undefined') {
      localStorage.setItem('filteredCategory', kategori);
    }

    sessionStorage.setItem('filteredSubcategory', 'Neler Bulabilirsiniz?'); // Varsayılan altkategori kaydediliyor
    sessionStorage.removeItem('filteredSubsubcategory');
  };

  const handleSubcategoryFilter = (altkategori: string) => {
    setFilteredSubcategory(altkategori);
    setFilteredSubsubcategory('');
    const normalizedKategori = normalizeString(filteredCategory);
    const normalizedAltkategori = normalizeString(altkategori);
    window.history.pushState(null, '', `/${normalizedKategori}/${normalizedAltkategori}`);
    sessionStorage.setItem('filteredSubcategory', altkategori);
    sessionStorage.removeItem('filteredSubsubcategory');
  };

  const handleSubsubcategoryFilter = (altaltkategori: string) => {
    setFilteredSubsubcategory(altaltkategori);
    const normalizedKategori = normalizeString(filteredCategory);
    const normalizedAltkategori = normalizeString(filteredSubcategory);
    const normalizedAltaltkategori = normalizeString(altaltkategori);
    window.history.pushState(null, '', `/${normalizedKategori}/${normalizedAltkategori}/${normalizedAltaltkategori}`);
    sessionStorage.setItem('filteredSubsubcategory', altaltkategori);
  };

  useEffect(() => {
    if (filteredCategory === '' && categories.length > 0) {
      const firstCategory = categories[0];
      setFilteredCategory(firstCategory);
      setFilteredSubcategory('Neler Bulabilirsiniz?');
      setFilteredSubsubcategory('');
      const normalizedKategori = normalizeString(firstCategory);
      window.history.replaceState(null, '', `/${normalizedKategori}`);
    }
  }, [filteredCategory, categories]);

  useEffect(() => {
    let updatedFilteredCards = cardsData;

    if (filteredCategory !== '') {
      updatedFilteredCards = updatedFilteredCards.filter(
        (card) => card.kategori === filteredCategory
      );
    }

    if (filteredSubcategory === 'Neler Bulabilirsiniz?') {
      updatedFilteredCards = updatedFilteredCards.filter(
        (card) => card.kategori === filteredCategory
      );
    } else if (filteredSubcategory !== '') {
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

  useEffect(() => {
    document.body.style.overflowX = 'hidden';
    return () => {
      document.body.style.overflowX = 'auto';
    };
  }, [filteredCategory, filteredSubcategory, filteredSubsubcategory]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      {/* Filter Buttons */}
      <div
        style={{
          marginTop: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
          padding: '10px',
          borderRadius: '30px',
          boxShadow: '0px 15px 40px rgba(0, 0, 0, 0.1)',
          width: 'fit-content',
          margin: '0 auto'
        }}
      >
        {categories.filter(kategori => kategori !== '').map((kategori) => (
          <button
            key={kategori}
            onClick={() => handleFilter(kategori)}
            style={{
              padding: '12px 25px',
              cursor: 'pointer',
              borderRadius: '30px',
              border: 'none',
              backgroundColor: filteredCategory === kategori ? '#6a5acd' : '#fff',
              color: filteredCategory === kategori ? '#fff' : '#6a5acd',
              boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.1)',
              transition: 'background-color 0.3s ease, color 0.3s ease',
              margin: '10px',
              fontWeight: 'bold'
            }}
          >
            {kategori}
          </button>
        ))}
      </div>
      {/* Subcategories Filter Buttons */}
      {filteredCategory !== '' && subcategories.length > 0 && (
        <div
          style={{
            marginTop: '20px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
            padding: '10px',
            borderRadius: '30px',
            boxShadow: '0px 15px 40px rgba(0, 0, 0, 0.1)',
            width: 'fit-content',
            margin: '20px auto'
          }}
        >
          {subcategories.map((altkategori) => (
            <button
              key={altkategori}
              onClick={() => handleSubcategoryFilter(altkategori)}
              style={{
                padding: '12px 25px',
                cursor: 'pointer',
                borderRadius: '30px',
                border: 'none',
                backgroundColor: filteredSubcategory === altkategori ? '#32cd32' : '#fff',
                color: filteredSubcategory === altkategori ? '#fff' : '#32cd32',
                boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.1)',
                transition: 'background-color 0.3s ease, color 0.3s ease',
                margin: '10px',
                fontWeight: 'bold'
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
            flexWrap: 'wrap',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
            padding: '10px',
            borderRadius: '30px',
            boxShadow: '0px 15px 40px rgba(0, 0, 0, 0.1)',
            width: 'fit-content',
            margin: '20px auto'
          }}
        >
          {subsubcategories.map((altaltkategori) => (
            <button
              key={altaltkategori}
              onClick={() => handleSubsubcategoryFilter(altaltkategori)}
              style={{
                padding: isMobile ? '8px 15px' : '12px 25px',
                cursor: 'pointer',
                borderRadius: '30px',
                border: 'none',
                backgroundColor: filteredSubsubcategory === altaltkategori ? '#ff4500' : '#fff',
                color: filteredSubsubcategory === altaltkategori ? '#fff' : '#ff4500',
                boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.1)',
                transition: 'background-color 0.3s ease, color 0.3s ease',
                margin: '10px',
                fontWeight: 'bold'
              }}
            >
              {altaltkategori}
            </button>
          ))}
        </div>
      )}
      {/* Static Video for "Neler Bulabilirsiniz?" Subcategory */}
      {filteredSubcategory === 'Neler Bulabilirsiniz?' && categoryVideos[filteredCategory] && (
        <div
          style={{
            marginTop: isMobile ? '10px' : '30px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            backgroundColor: '#ffffff',
            padding: '15px',
            borderRadius: '20px',
            boxShadow: '0px 15px 30px rgba(0, 0, 0, 0.1)',
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
          {categoryProducts[filteredCategory] && (
            <div style={{ marginLeft: '20px' }}>
              {isMobile ? (
                <ShopifyScriptComponentMobile productId={categoryProducts[filteredCategory]} />
              ) : (
                <ShopifyScriptComponent productId={categoryProducts[filteredCategory]} />
              )}
            </div>
          )}
        </div>
      )}
      {/* Filtered Cards */}
      <div style={{ marginTop: '30px', width: '100%' }}>
        {filteredCards.length > 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: isMobile ? '15px' : '30px',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'center',
              textAlign: 'center'
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
                    marginBottom: '30px',
                    cursor: 'pointer',
                    boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.1)',
                    borderRadius: '20px',
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
                      width={isMobile ? '100%' : '300px'}
                      height={isMobile ? '200px' : '200px'}
                      src={`https://www.youtube.com/embed?listType=playlist&list=${card.videoUrl.split('list=')[1] || ''}`}
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
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'flex-start',
                      textAlign: 'left',
                      position: 'relative',
                      width: '100%',
                    }}
                  >
                    <h3 style={{ color: '#4b0082', marginBottom: '5px', whiteSpace: 'normal', overflow: 'visible', textOverflow: 'unset', fontWeight: 'bold' }}>{card.kursBasligi}</h3>
                    <p style={{ color: '#555', marginBottom: '5px' }}><strong>Kimler İçin:</strong> {card.kimlerIcin}</p>
                    <p style={{ color: '#555', marginBottom: '5px' }}><strong>Süresi:</strong> {card.suresi}</p>
                    <p style={{ color: '#555', marginBottom: '5px' }}><strong>Seviye:</strong> {card.seviye}</p>
                    <p style={{ color: '#555', marginBottom: '5px' }}><strong>Güncel mi?:</strong> {card.guncelMi}</p>
                    <hr style={{
                      border: 'none',
                      height: '3px',
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
                        padding: '10px 20px',
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
