import React, { useState, useEffect } from 'react';
import { Link, useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import { getCollectionItems } from '~/utils/directusClient';
import ShopifyScriptComponent from './book';

// Kart veri tipini tanımlıyoruz
type CardData = {
  id: string;
  slug: string;
  title: string;
  category: string;
  subcategory: string;
  subsubcategory?: string;
  description: string;
  image?: string; // URL olarak çekilecek
  videoUrl?: string;
  shopifyProductId?: string;
};

// Directus'tan tüm kart verilerini çekiyoruz
export const loader = async () => {
  const cardsData: CardData[] = await getCollectionItems('cards');
  return json({ cardsData });
};

export default function Index() {
  const { cardsData } = useLoaderData<typeof loader>();
  const [filteredCategory, setFilteredCategory] = useState<string>('Tüm Sınıflar');
  const [filteredSubcategory, setFilteredSubcategory] = useState<string>('');
  const [filteredSubsubcategory, setFilteredSubsubcategory] = useState<string>('');

  // Açılışta alt kategori ve alt alt kategoriler de gösterilsin
  useEffect(() => {
    if (subcategories.length > 0) {
      setFilteredSubcategory(subcategories[0]);
    }
  }, [filteredCategory]);

  useEffect(() => {
    if (subsubcategories.length > 0) {
      setFilteredSubsubcategory(subsubcategories[0]);
    }
  }, [filteredSubcategory]);
  const [filteredCards, setFilteredCards] = useState<CardData[]>(cardsData);
  const [selectedVideoCard, setSelectedVideoCard] = useState<{ [key: string]: CardData | null }>({});
  const [selectedBookCard, setSelectedBookCard] = useState<{ [key: string]: CardData | null }>({});

  // Dinamik olarak kategorileri elde ediyoruz
  const categories = Array.from(new Set(cardsData.map((card) => card.category)));

  // Dinamik olarak alt kategorileri elde ediyoruz
  const subcategories =
    filteredCategory !== 'Tüm Sınıflar'
      ? Array.from(
          new Set(
            cardsData
              .filter((card) => card.category === filteredCategory)
              .map((card) => card.subcategory)
          )
        )
      : [];

  // Dinamik olarak alt alt kategorileri elde ediyoruz
  const subsubcategories =
    filteredSubcategory !== ''
      ? Array.from(
          new Set(
            cardsData
              .filter((card) => card.subcategory === filteredSubcategory)
              .map((card) => card.subsubcategory)
          )
        )
      : [];

  const handleFilter = (category: string) => {
    setFilteredCategory(category);
    setFilteredSubcategory(''); // Alt kategori seçimi sıfırlanır
    setFilteredSubsubcategory(''); // Alt alt kategori seçimi sıfırlanır
  };

  const handleSubcategoryFilter = (subcategory: string) => {
    setFilteredSubcategory(subcategory);
    setFilteredSubsubcategory(''); // Alt alt kategori seçimi sıfırlanır
  };

  const handleSubsubcategoryFilter = (subsubcategory: string) => {
    setFilteredSubsubcategory(subsubcategory);
  };

  // Filtreleme işlemi - kategori, alt kategori ve alt alt kategori değiştiğinde güncellenir
  useEffect(() => {
    let updatedFilteredCards = cardsData;

    if (filteredCategory !== 'Tüm Sınıflar') {
      updatedFilteredCards = updatedFilteredCards.filter(
        (card) => card.category === filteredCategory
      );
    }

    if (filteredSubcategory !== '') {
      updatedFilteredCards = updatedFilteredCards.filter(
        (card) => card.subcategory === filteredSubcategory
      );
    }

    if (filteredSubsubcategory !== '') {
      updatedFilteredCards = updatedFilteredCards.filter(
        (card) => card.subsubcategory === filteredSubsubcategory
      );
    }

    setFilteredCards(updatedFilteredCards);
  }, [filteredCategory, filteredSubcategory, filteredSubsubcategory]);

  // Her kategori için tek bir video ve kitap verisi seçme
  useEffect(() => {
    const videoCards: { [key: string]: CardData | null } = {};
    const bookCards: { [key: string]: CardData | null } = {};

    categories.forEach((category) => {
      const filteredCategoryCards = cardsData.filter((card) => card.category === category);
      videoCards[category] = filteredCategoryCards.find((card) => card.videoUrl) || null;
      bookCards[category] = filteredCategoryCards.find((card) => card.shopifyProductId) || null;
    });

    setSelectedVideoCard(videoCards);
    setSelectedBookCard(bookCards);
  }, [filteredCategory, cardsData]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: '#f0f4f8',
        minHeight: '100vh',
        padding: '20px',
        width: '100%',
        maxWidth: '1000px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          marginTop: '20px',
          display: 'flex',
          gap: '20px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #ece9e6, #ffffff)',
          padding: '20px',
          borderRadius: '25px',
          boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)',
        }}
      >
        {['Tüm Sınıflar', ...categories].map((category) => (
          <button
            key={category}
            onClick={() => handleFilter(category)}
            style={{
              padding: '10px 20px',
              cursor: 'pointer',
              borderRadius: '25px',
              border: 'none',
              backgroundColor: filteredCategory === category ? '#6c63ff' : '#fff',
              color: filteredCategory === category ? '#fff' : '#6c63ff',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
              transition: 'background-color 0.3s ease, color 0.3s ease',
            }}
          >
            {category}
          </button>
        ))}
      </div>
      {filteredCategory === 'Tüm Sınıflar' && (
        <div
          style={{
            marginTop: '20px',
            display: 'flex',
            gap: '15px',
            justifyContent: 'center',
            alignItems: 'flex-start',
            width: '100%',
            backgroundColor: '#ffffff',
            padding: '10px',
            borderRadius: '15px',
            flexWrap: 'wrap',
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
              maxWidth: '700px',
              height: 'auto',
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
              height="400px"
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
              {/* Shopify ürün bileşeni */}
              <ShopifyScriptComponent productId="9849553518897" />
            </div>
          </div>
        </div>
      )}
      {filteredCategory !== 'Tüm Sınıflar' && (
        <div
          style={{
            marginTop: '20px',
            display: 'flex',
            gap: '15px',
            justifyContent: 'center',
            alignItems: 'flex-start',
            width: '100%',
            backgroundColor: '#ffffff',
            padding: '10px',
            borderRadius: '15px',
            flexWrap: 'wrap',
          }}
        >
          {/* Video Bileşeni */}
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
                maxWidth: '700px',
                height: 'auto',
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
                height="400px"
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

          {/* Kitap Bileşeni */}
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
                {/* Shopify ürün bileşeni */}
                <ShopifyScriptComponent productId={selectedBookCard[filteredCategory]?.shopifyProductId} />
              </div>
            </div>
          )}
        </div>
      )}
      {subcategories.length > 0 && (
        <div
          style={{
          marginTop: '20px',
          display: 'flex',
          gap: '20px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f9f9f9, #ffffff)',
          padding: '20px',
          borderRadius: '25px',
          boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.15)',
          }}
        >
          {subcategories.map((subcategory) => (
            <button
              key={subcategory}
              onClick={() => handleSubcategoryFilter(subcategory)}
              style={{
                padding: '10px 20px',
                cursor: 'pointer',
                borderRadius: '25px',
                border: 'none',
                backgroundColor: filteredSubcategory === subcategory ? '#28a745' : '#fff',
                color: filteredSubcategory === subcategory ? '#fff' : '#28a745',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                transition: 'background-color 0.3s ease, color 0.3s ease',
              }}
            >
              {subcategory}
            </button>
          ))}
        </div>
      )}
      {subsubcategories.length > 0 && (
        
        <div
        style={{
        marginTop: '20px',
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f9f9f9, #ffffff)',
        padding: '20px',
        borderRadius: '25px',
        boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.15)',
        }}
      >

          {subsubcategories.map((subsubcategory) => (
            <button
              key={subsubcategory}
              onClick={() => handleSubsubcategoryFilter(subsubcategory)}
              style={{
                padding: '10px 20px',
                cursor: 'pointer',
                borderRadius: '25px',
                border: 'none',
                backgroundColor: filteredSubsubcategory === subsubcategory ? '#ff6347' : '#fff',
                color: filteredSubsubcategory === subsubcategory ? '#fff' : '#ff6347',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                transition: 'background-color 0.3s ease, color 0.3s ease',
              }}
            >
              {subsubcategory}
            </button>
          ))}
        </div>
      )}
      <div style={{ marginTop: '20px', width: '100%' }}>
        {filteredCards.length > 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'center',
            }}
          >
            {filteredCards.map((card) => (
              <Link
                key={card.id}
                to={`/card/${card.slug}`}
                style={{ textDecoration: 'none', color: 'inherit', width: '100%', display: 'flex', justifyContent: 'center' }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginBottom: '20px',
                    cursor: 'pointer',
                    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
                    borderRadius: '15px',
                    overflow: 'hidden',
                    transition: 'transform 0.3s ease',
                    backgroundColor: '#fff',
                    maxWidth: '450px',
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  {card.videoUrl ? (
                    <iframe
                      width="150px"
                      height="150px"
                      src={`https://www.youtube.com/embed/${card.videoUrl.split('v=')[1]?.split('&')[0]}`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{
                        borderRadius: '15px 0 0 15px',
                        boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.2)',
                        objectFit: 'cover',
                      }}
                    ></iframe>
                  ) : (
                    <div
                      style={{
                        width: '150px',
                        height: '150px',
                        backgroundColor: '#ccc',
                        borderRadius: '15px 0 0 15px',
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
                    }}
                  >
                    <h3 style={{ color: '#007bff', marginBottom: '10px', whiteSpace: 'normal', overflow: 'visible', textOverflow: 'unset' }}>{card.title}</h3>
                    <p style={{ color: '#555', whiteSpace: 'normal', overflow: 'visible', textOverflow: 'unset' }}>{card.description}</p>
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
