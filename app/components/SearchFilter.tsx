import React, { useState } from 'react';

interface SearchFilterProps {
  categories: string[];
  onSearch: (searchTerm: string) => void;
  onFilter: (category: string) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ categories, onSearch, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    onSearch(event.target.value);
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const category = event.target.value;
    setSelectedCategory(category);
    onFilter(category);
  };

  return (
    <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <input
        type="text"
        placeholder="Ara..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ padding: '8px', marginBottom: '10px', width: '300px', textAlign: 'center' }}
      />
      <select
        value={selectedCategory}
        onChange={handleCategoryChange}
        style={{ padding: '8px', width: '320px', textAlign: 'center' }}
      >
        <option value="">Tüm Kategoriler</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchFilter;
