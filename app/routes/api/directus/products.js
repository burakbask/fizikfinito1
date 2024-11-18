import { json } from "@remix-run/node";
import axios from "axios";

// Loader fonksiyonu: Directus API'ye proxy olarak istek yapar
export const loader = async () => {
  try {
    const directusApiUrl = process.env.DIRECTUS_API_URL;
    const response = await axios.get(`${directusApiUrl}/items/products`);
    return json(response.data);
  } catch (error) {
    console.error("Directus API Proxy hatası:", error.message);
    throw new Response("Directus Proxy Hatası: " + error.message, { status: 500 });
  }
};
