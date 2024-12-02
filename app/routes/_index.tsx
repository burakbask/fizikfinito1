import React, { useState, useEffect } from 'react';
import { Link, useLoaderData, useNavigate } from '@remix-run/react';
import { json, redirect } from '@remix-run/node';
import { getCollectionItems } from '~/utils/directusClient';
import { useMediaQuery } from 'react-responsive';

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

  // Redirect to the homepage if the URL does not match any category or subcategory
  if (category && !categoriesData.some((cat) => normalizeString(cat) === category)) {
    return redirect('/');
  }

  return json({ cardsData, categoriesData, initialCategory: category || '', initialSubcategory: subcategory || '', initialSubsubcategory: subsubcategory || '', pathname });
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
  'TYT': 'https://www.youtube.com/embed/videoseries?list=PLwyfvkhKMmwowVyIegsf3QQw3OsYfEkPR',
  'AYT': 'https://www.youtube.com/embed/videoseries?list=PLwyfvkhKMmwowVyIegsf3QQw3OsYfEkPR',
  '9. Sınıf': 'https://www.youtube.com/embed/videoseries?list=PLwyfvkhKMmwowVyIegsf3QQw3OsYfEkPR',
  '10. Sınıf': 'https://www.youtube.com/embed/videoseries?list=PLwyfvkhKMmwowVyIegsf3QQw3OsYfEkPR',
  '11. Sınıf': 'https://www.youtube.com/embed/videoseries?list=PLwyfvkhKMmwowVyIegsf3QQw3OsYfEkPR',
  '12. Sınıf': 'https://www.youtube.com/embed/videoseries?list=PLwyfvkhKMmwowVyIegsf3QQw3OsYfEkPR'
};

export default function Index() {
  const navigate = useNavigate();
  const { cardsData, categoriesData, initialCategory: initialCategoryFromLoader, initialSubcategory, initialSubsubcategory, pathname } = useLoaderData<typeof loader>();

  const categories = Array.from(new Set(cardsData.map((card) => card.kategori)));

  const subcategories =
    initialCategoryFromLoader !== ''
      ? Array.from(
          new Set([
            'Neler Bulabilirsiniz?',
            ...cardsData
              .filter((card) => card.kategori === initialCategoryFromLoader)
              .map((card) => card.altkategori)
          ])
        )
      : [];

  useEffect(() => {
    if (pathname) {
      window.history.replaceState(null, '', pathname);
    }
  }, [pathname]);

  const [filteredCategory, setFilteredCategory] = useState<string>(initialCategoryFromLoader);
  const [filteredSubcategory, setFilteredSubcategory] = useState<string>(initialSubcategory || (subcategories.length > 0 ? subcategories[0] : ''));
  const [filteredSubsubcategory, setFilteredSubsubcategory] = useState<string>(initialSubsubcategory);
  const [filteredCards, setFilteredCards] = useState<CardData[]>([]);

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

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
    setFilteredSubcategory(subcategories.length > 0 ? subcategories[0] : '');
    setFilteredSubsubcategory('');
    const normalizedKategori = normalizeString(kategori);
    window.history.pushState(null, '', `/${normalizedKategori}`);
    if (typeof window !== 'undefined') {
      localStorage.setItem('filteredCategory', kategori);
    }
    sessionStorage.removeItem('filteredSubcategory');
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
    if (typeof window !== 'undefined') {
      const savedCategory = localStorage.getItem('filteredCategory');
      const savedSubcategory = sessionStorage.getItem('filteredSubcategory');
      const savedSubsubcategory = sessionStorage.getItem('filteredSubsubcategory');
  
      if (savedCategory) {
        setFilteredCategory(savedCategory);
      } else {
        setFilteredCategory(initialCategoryFromLoader);
      }

      if (savedSubcategory && savedCategory) {
        setFilteredSubcategory(savedSubcategory);
      } else {
        setFilteredSubcategory(initialSubcategory || (subcategories.length > 0 ? subcategories[0] : ''));
      }

      if (savedSubsubcategory && savedSubcategory && savedCategory) {
        setFilteredSubsubcategory(savedSubsubcategory);
      } else {
        setFilteredSubsubcategory(initialSubsubcategory);
      }
    }
}, []);


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
    // Prevent horizontal scrolling when switching categories
    document.body.style.overflowX = 'hidden';
    return () => {
      document.body.style.overflowX = 'auto';
    };
  }, [filteredCategory, filteredSubcategory, filteredSubsubcategory]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Filter Buttons */}
      <div
        style={{
          marginTop: '10px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #ece9e6, #ffffff)',
          padding: '5px',
          borderRadius: '25px',
          boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)',
        }}
      >
        {categories.filter(kategori => kategori !== '').map((kategori) => (
          <button
            key={kategori}
            onClick={() => handleFilter(kategori)}
            style={{
              padding: '10px 20px',
              cursor: 'pointer',
              borderRadius: '25px',
              border: 'none',
              backgroundColor: filteredCategory === kategori ? '#6c63ff' : '#fff',
              color: filteredCategory === kategori ? '#fff' : '#6c63ff',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
              transition: 'background-color 0.3s ease, color 0.3s ease',
              width: 'auto',
              margin: '5px' // Adjusted margin to reduce extra space
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
            marginTop: '10px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #ece9e6, #ffffff)',
            padding: '5px',
            borderRadius: '25px',
            boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)',
          }}
        >
          {subcategories.map((altkategori) => (
            <button
              key={altkategori}
              onClick={() => handleSubcategoryFilter(altkategori)}
              style={{
                padding: '5px 10px',
                cursor: 'pointer',
                borderRadius: '25px',
                border: 'none',
                backgroundColor: filteredSubcategory === altkategori ? '#28a745' : '#fff',
                color: filteredSubcategory === altkategori ? '#fff' : '#28a745',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                transition: 'background-color 0.3s ease, color 0.3s ease',
                width: 'auto',
                margin: '5px' // Adjusted margin to reduce extra space
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
            marginTop: '10px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #ece9e6, #ffffff)',
            padding: '5px',
            borderRadius: '25px',
            boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)',
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
                width: 'auto',
                margin: '5px' // Adjusted margin to reduce extra space
              }}
            >
              {altaltkategori}
            </button>
          ))}
        </div>
      )}
      {/* Static Video for "neler var" Subcategory */}
      {filteredSubcategory === 'Neler Bulabilirsiniz?' && categoryVideos[filteredCategory] && (
        <div
          style={{
            marginTop: isMobile ? '10px' : '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            backgroundColor: '#ffffff',
            padding: '5px',
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
                    <p style={{ color: '#555', marginBottom: '1px' }}><strong>Kimler İçin:</strong> {card.kimlerIcin}</p>
                    <p style={{ color: '#555', marginBottom: '1px' }}><strong>Süresi Ne Kadar?:</strong> {card.suresi}</p>
                    <p style={{ color: '#555', marginBottom: '1px' }}><strong>Seviye:</strong> {card.seviye}</p>
                    <p style={{ color: '#555', marginBottom: '1px' }}><strong>Güncel mi?:</strong> {card.guncelMi}</p>
                    <p style={{ color: '#555', marginBottom: '1px' }}><strong>Kamp Kitabı:</strong> {card.kampKitabı}</p>
                    <hr style={{
                      border: 'none',
                      height: '2px',
                      background: 'linear-gradient(to right, #ff8c00, #ff0080, #8a2be2)',
                      width: '100%',
                      margin: '5px 0',
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
