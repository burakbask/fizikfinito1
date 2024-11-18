import axios from 'axios';

export const getCollectionItems = async (collectionName) => {
  try {
    const response = await axios.get(`${process.env.DIRECTUS_API_URL}/items/${collectionName}`, {
      headers: {
        Authorization: `Bearer ${process.env.DIRECTUS_API_TOKEN}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching ${collectionName}:`, error);
    return [];
  }
};

export const getItem = async (collectionName, itemId) => {
  try {
    const response = await axios.get(`${process.env.DIRECTUS_API_URL}/items/${collectionName}`, {
      params: {
        filter: { slug: { _eq: itemId } }
      },
      headers: {
        Authorization: `Bearer ${process.env.DIRECTUS_API_TOKEN}`,
      },
    });
    return response.data.data.length > 0 ? response.data.data[0] : null;
  } catch (error) {
    console.error(`Error fetching item from ${collectionName} with slug ${itemId}:`, error);
    return null;
  }
};

export const getItemBySlug = async (collectionName, slug) => {
  try {
    const response = await axios.get(`${process.env.DIRECTUS_API_URL}/items/${collectionName}`, {
      params: {
        filter: { slug: { _eq: slug } }
      },
      headers: {
        Authorization: `Bearer ${process.env.DIRECTUS_API_TOKEN}`,
      },
    });
    return response.data.data.length > 0 ? response.data.data[0] : null;
  } catch (error) {
    console.error(`Error fetching item by slug from ${collectionName}:`, error);
    return null;
  }
};

// Yeni bir item ekleme
export const addItem = async (collectionName, itemData) => {
  try {
    const response = await axios.post(`${process.env.DIRECTUS_API_URL}/items/${collectionName}`, itemData, {
      headers: {
        Authorization: `Bearer ${process.env.DIRECTUS_API_TOKEN}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error(`Error adding item to ${collectionName}:`, error);
    return null;
  }
};

// Mevcut bir item'ı güncelleme
export const updateItem = async (collectionName, itemId, itemData) => {
  try {
    const response = await axios.patch(`${process.env.DIRECTUS_API_URL}/items/${collectionName}/${itemId}`, itemData, {
      headers: {
        Authorization: `Bearer ${process.env.DIRECTUS_API_TOKEN}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error(`Error updating item in ${collectionName} with ID ${itemId}:`, error);
    return null;
  }
};

// Bir item'ı silme
export const deleteItem = async (collectionName, itemId) => {
  try {
    await axios.delete(`${process.env.DIRECTUS_API_URL}/items/${collectionName}/${itemId}`, {
      headers: {
        Authorization: `Bearer ${process.env.DIRECTUS_API_TOKEN}`,
      },
    });
  } catch (error) {
    console.error(`Error deleting item from ${collectionName} with ID ${itemId}:`, error);
  }
};

// Tüm item'ları belirli bir filtre ile getirme
export const getItemsByFilter = async (collectionName, filter) => {
  try {
    const response = await axios.get(`${process.env.DIRECTUS_API_URL}/items/${collectionName}`, {
      params: {
        filter
      },
      headers: {
        Authorization: `Bearer ${process.env.DIRECTUS_API_TOKEN}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching items from ${collectionName} with filter:`, error);
    return [];
  }
};
