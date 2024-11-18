import React, { useState } from 'react';
import { Link, useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import { getCollectionItems } from '~/utils/directusClient';
import Carousel from '~/components/Carousel';

// Directus'tan tüm kart verilerini çekiyoruz
export const loader = async () => {
  const cardsData = await getCollectionItems('cards');
  return json({ cardsData, directusApiUrl: process.env.DIRECTUS_API_URL });
};

export default function Index() {
  const { cardsData, directusApiUrl } = useLoaderData();
  const [filteredCategory, setFilteredCategory] = useState<string>('Tüm Sınıflar');
  const [filteredSubcategory, setFilteredSubcategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Dinamik olarak kategorileri elde ediyoruz
  const categories = Array.from(new Set(cardsData.map((card: any) => card.category)));

  // Dinamik olarak alt kategorileri elde ediyoruz
  const subcategories = filteredCategory !== 'Tüm Sınıflar' 
    ? Array.from(new Set(cardsData.filter((card: any) => card.category === filteredCategory).map((card: any) => card.subcategory)))
    : [];

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilter = (category: string) => {
    setFilteredCategory(category);
    setFilteredSubcategory(''); // Alt kategori seçimi sıfırlanır
  };

  const handleSubcategoryFilter = (subcategory: string) => {
    setFilteredSubcategory(subcategory);
  };

  // Filtreleme işlemi
  const filteredCards = cardsData.filter((card: any) => {
    return (
      (filteredCategory === 'Tüm Sınıflar' || card.category === filteredCategory) &&
      (filteredSubcategory === '' || card.subcategory === filteredSubcategory) &&
      card.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', backgroundColor: '#f0f4f8', minHeight: '100vh', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '10px' }}>
        <input
          type="text"
          placeholder="Ara..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ padding: '10px', width: '300px', borderRadius: '25px', border: '1px solid #ccc', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}
        />
      </div>
      <div style={{ marginTop: '20px', display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {['Tüm Sınıflar', ...categories].map((category) => (
          <button
            key={category}
            onClick={() => handleFilter(category)}
            style={{
              padding: '10px 20px',
              cursor: 'pointer',
              borderRadius: '25px',
              border: 'none',
              backgroundColor: filteredCategory === category ? '#007bff' : '#fff',
              color: filteredCategory === category ? '#fff' : '#007bff',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
              transition: 'background-color 0.3s ease, color 0.3s ease',
            }}
          >
            {category}
          </button>
        ))}
      </div>
      {filteredCategory !== 'Tüm Sınıflar' && subcategories.length > 0 && (
        <div style={{ marginTop: '20px', display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
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
      <div style={{ marginTop: '20px' }}>
        {filteredCards.length > 0 ? (
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {filteredCards.map((card: any) => (
              <Link key={card.id} to={`/card/${card.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ width: '250px', marginBottom: '20px', cursor: 'pointer', boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)', borderRadius: '15px', overflow: 'hidden', transition: 'transform 0.3s ease' }}>
                  {card.image ? (
                    <img src={`http://localhost:8055/assets/${card.image}`} alt={card.title} style={{ width: '100%' }} />
                  ) : (
                    <div style={{ width: '100%', height: '150px', backgroundColor: '#ccc' }}>Görsel Yok</div>
                  )}
                  <div style={{ padding: '15px', backgroundColor: '#fff' }}>
                    <h3 style={{ color: '#007bff' }}>{card.title}</h3>
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
