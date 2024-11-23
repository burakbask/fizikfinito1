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
  const [filteredCards, setFilteredCards] = useState<CardData[]>(cardsData);
  const [selectedVideoCard, setSelectedVideoCard] = useState<CardData | null>(null);
  const [selectedBookCard, setSelectedBookCard] = useState<CardData | null>(null);

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

  const handleFilter = (category: string) => {
    setFilteredCategory(category);
    setFilteredSubcategory(''); // Alt kategori seçimi sıfırlanır
  };

  const handleSubcategoryFilter = (subcategory: string) => {
    setFilteredSubcategory(subcategory);
  };

  // Filtreleme işlemi - kategori, alt kategori ve arama terimi değiştiğinde güncellenir
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

    setFilteredCards(updatedFilteredCards);
  }, [filteredCategory, filteredSubcategory, cardsData]);

  // Tek bir video ve kitap verisi seçme
  useEffect(() => {
    if (filteredCategory !== 'Tüm Sınıflar') {
      const videoCard = filteredCards.find((card) => card.videoUrl);
      const bookCard = filteredCards.find((card) => card.shopifyProductId);
      setSelectedVideoCard(videoCard || null);
      setSelectedBookCard(bookCard || null);

      console.log('Selected Video Card:', videoCard);
      console.log('Selected Book Card:', bookCard);
    } else {
      setSelectedVideoCard(null);
      setSelectedBookCard(null);
    }
  }, [filteredCategory, filteredCards]);

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
          gap: '15px',
          flexWrap: 'wrap',
          justifyContent: 'center',
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
      {filteredCategory !== 'Tüm Sınıflar' && (
        <div
          style={{
            marginTop: '20px',
            display: 'flex',
            gap: '15px',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            backgroundColor: '#ffffff',
            padding: '10px',
            borderRadius: '15px',
          }}
        >
          {/* Video Bileşeni */}
          {selectedVideoCard && selectedVideoCard.videoUrl && (
            <div
              style={{
                flex: 3, // Boyutu artırmak için flex değerini büyütüyoruz
                backgroundColor: '#ffffff',
                borderRadius: '15px',
                boxShadow: '15px 15px 15px rgba(0, 0, 0, 0.1)',
                padding: '0',
                textAlign: 'center',
                width: '100%',
                maxWidth: '700px', // Daha büyük bir maksimum genişlik
                aspectRatio: '16 / 9',
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <iframe
                width="100%"
                height="350px" // Boyutu artırmak için yükseklik değeri değiştirildi
                src={`https://www.youtube.com/embed/${selectedVideoCard.videoUrl.split('v=')[1]?.split('&')[0]}`}
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
          {/* Kitap Bileşeni */}
          {selectedBookCard && selectedBookCard.shopifyProductId && (
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
                <ShopifyScriptComponent productId={selectedBookCard.shopifyProductId} />
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
            gap: '15px',
            flexWrap: 'wrap',
            justifyContent: 'center',
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
      <div style={{ marginTop: '20px', width: '100%' }}>
        {filteredCards.length > 0 ? (
          <div
            style={{
              display: 'flex',
              gap: '20px',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {filteredCards.map((card) => (
              <Link
                key={card.id}
                to={`/card/${card.slug}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div
                  style={{
                    display: 'flex',
                    width: '450px',
                    marginBottom: '20px',
                    cursor: 'pointer',
                    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
                    borderRadius: '15px',
                    overflow: 'hidden',
                    transition: 'transform 0.3s ease',
                    backgroundColor: '#fff',
                    maxWidth: '100%',
                  }}
                >
                  {card.videoUrl ? (
                    <iframe
                      width="100%"
                      height="100%"
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
                        width: '200px',
                        height: '120px',
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
                      alignItems: 'center',
                      flex: 1,
                      textAlign: 'center',
                    }}
                  >
                    <h3 style={{ color: '#007bff', marginBottom: '10px' }}>{card.title}</h3>
                    <p style={{ color: '#555' }}>{card.description}</p>
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
