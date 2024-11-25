import React, { useState, useEffect } from 'react';
import { Link, useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import { getCollectionItems } from '~/utils/directusClient';
import ShopifyScriptComponent from './book';
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
  kampKitabi: string;
  kursAciklamasi: string;
  image?: string;
  videoUrl?: string;
  shopifyProductId?: string;
};

export const loader = async () => {
  const cardsData: CardData[] = await getCollectionItems('cards');
  const categoriesData = await getCollectionItems('Kategoriler');
  return json({ cardsData, categoriesData });
};

export default function Index() {
  const { cardsData, categoriesData } = useLoaderData<typeof loader>();
  const [filteredCategory, setFilteredCategory] = useState<string>('YKS Hazırlık');
  const [filteredSubcategory, setFilteredSubcategory] = useState<string>('');
  const [filteredSubsubcategory, setFilteredSubsubcategory] = useState<string>('');
  const [filteredCards, setFilteredCards] = useState<CardData[]>([]);
  const [selectedVideoCard, setSelectedVideoCard] = useState<{ [key: string]: CardData | null }>({});
  const [selectedBookCard, setSelectedBookCard] = useState<{ [key: string]: CardData | null }>({});

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  const categories = Array.from(new Set(cardsData.map((card) => card.kategori)));

  const subcategories =
    filteredCategory !== 'YKS Hazırlık'
      ? Array.from(
          new Set(
            cardsData
              .filter((card) => card.kategori === filteredCategory)
              .map((card) => card.altkategori)
          )
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

  useEffect(() => {
    if (subcategories.length > 0 && !subcategories.includes(filteredSubcategory)) {
      setFilteredSubcategory(subcategories[0] || '');
    }
  }, [filteredCategory, subcategories]);

  const handleFilter = (kategori: string) => {
    setFilteredCategory(kategori);
    setFilteredSubcategory('');
    setFilteredSubsubcategory('');
    const params = new URLSearchParams();
    params.set('kategori', kategori);
    window.history.pushState(null, '', `?${params.toString()}`);
  };

  const handleSubcategoryFilter = (altkategori: string) => {
    setFilteredSubcategory(altkategori);
    setFilteredSubsubcategory('');
    const params = new URLSearchParams(window.location.search);
    params.set('kategori', filteredCategory);
    params.set('altkategori', altkategori);
    window.history.pushState(null, '', `?${params.toString()}`);
  };

  const handleSubsubcategoryFilter = (altaltkategori: string) => {
    setFilteredSubsubcategory(altaltkategori);
    const params = new URLSearchParams(window.location.search);
    params.set('kategori', filteredCategory);
    params.set('altkategori', filteredSubcategory);
    params.set('altaltkategori', altaltkategori);
    window.history.pushState(null, '', `?${params.toString()}`);
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

  useEffect(() => {
    const videoCards: { [key: string]: CardData | null } = {};
    const bookCards: { [key: string]: CardData | null } = {};

    categories.forEach((kategori) => {
      const filteredCategoryCards = cardsData.filter((card) => card.kategori === kategori);
      videoCards[kategori] = filteredCategoryCards.find((card) => card.videoUrl) || null;
      bookCards[kategori] = filteredCategoryCards.find((card) => card.shopifyProductId) || null;
    });

    setSelectedVideoCard(videoCards);
    setSelectedBookCard(bookCards);
  }, [cardsData]);

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
      {/* Video and Book Components */}
      {filteredCategory === 'YKS Hazırlık' && (
        <div
          style={{
            marginTop: '20px',
            display: 'flex',
            gap: isMobile ? '10px' : '15px',
            justifyContent: 'center',
            alignItems: 'flex-start',
            width: '100%',
            backgroundColor: '#ffffff',
            padding: '10px',
            borderRadius: '15px',
            flexWrap: isMobile ? 'wrap' : 'nowrap',
            flexDirection: isMobile ? 'column' : 'row',
          }}
        >
          <div
            style={{
              flex: 3,
              backgroundColor: '#ffffff',
              borderRadius: '15px',
              boxShadow: '15px 15px 15px rgba(0, 0, 0, 0.1)',
              padding: '0',
              textAlign: 'center',
              width: '100%',
              maxWidth: isMobile ? '100%' : '700px',
              height: isMobile ? '200px' : 'auto',
              aspectRatio: '16 / 9',
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '0 auto',
            }}
          >
            <iframe
              width="100%"
              height={isMobile ? '200px' : '400px'}
              src="https://www.youtube.com/embed/Bg0YEuJgB3s"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                borderRadius: '15px',
                boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.2)',
                objectFit: 'cover',
                marginBottom: '0',
                paddingBottom: '0',
              }}
            ></iframe>
          </div>
          <div
            style={{
              flex: 1,
              backgroundColor: '#ffffff',
              borderRadius: '15px',
              boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)',
              padding: '10px',
              textAlign: 'center',
              maxWidth: 'auto',
            }}
          >
            <div
              style={{
                textAlign: 'center',
                width: '100%',
              }}
            >
              <ShopifyScriptComponent productId="9849553518897" />
            </div>
          </div>
        </div>
      )}
      {filteredCategory !== 'YKS Hazırlık' && (
        <div
          style={{
            marginTop: '20px',
            display: 'flex',
            gap: isMobile ? '10px' : '15px',
            justifyContent: 'center',
            alignItems: 'flex-start',
            width: '100%',
            backgroundColor: '#ffffff',
            padding: '10px',
            borderRadius: '15px',
            flexWrap: isMobile ? 'wrap' : 'nowrap',
            flexDirection: isMobile ? 'column' : 'row',
          }}
        >
          {selectedVideoCard[filteredCategory] && selectedVideoCard[filteredCategory]?.videoUrl && (
            <div
              style={{
                flex: 3,
                backgroundColor: '#ffffff',
                borderRadius: '15px',
                boxShadow: '15px 15px 15px rgba(0, 0, 0, 0.1)',
                padding: '0',
                textAlign: 'center',
                width: '100%',
                maxWidth: isMobile ? '100%' : '700px',
                height: isMobile ? '200px' : 'auto',
                aspectRatio: '16 / 9',
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '0 auto',
              }}
            >
              <iframe
                width="100%"
                height={isMobile ? '200px' : '400px'}
                src={`https://www.youtube.com/embed/${selectedVideoCard[filteredCategory]?.videoUrl.split('v=')[1]?.split('&')[0]}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  borderRadius: '15px',
                  boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.2)',
                  objectFit: 'cover',
                  marginBottom: '0',
                  paddingBottom: '0',
                }}
              ></iframe>
            </div>
          )}

          {selectedBookCard[filteredCategory] && selectedBookCard[filteredCategory]?.shopifyProductId && (
            <div
              style={{
                flex: 1,
                backgroundColor: '#ffffff',
                borderRadius: '15px',
                boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)',
                padding: '10px',
                textAlign: 'center',
                maxWidth: 'auto',
              }}
            >
              <div
                style={{
                  textAlign: 'center',
                  width: '100%',
                }}
              >
                <ShopifyScriptComponent productId={selectedBookCard[filteredCategory]?.shopifyProductId} />
              </div>
            </div>
          )}
        </div>
      )}
      {/* Subcategories Filter Buttons */}
      {subcategories.length > 0 && (
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
      {subsubcategories.length > 0 && (
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
                to={`/card/${card.slug}`}
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
                      src={`https://www.youtube.com/embed/${card.videoUrl.split('v=')[1]?.split('&')[0]}`}
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
                    <p style={{ color: '#555', marginBottom: '5px' }}><strong>Kamp Kitabı:</strong> {card.kampKitabi}</p>
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
