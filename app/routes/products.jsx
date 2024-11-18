import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { getCollectionItems } from "../utils/directusClient";
import styles from "../styles/products.css";

export const links = () => [
  { rel: "stylesheet", href: styles }
];

export const loader = async ({ request }) => {
  const items = await getCollectionItems("products");
  const directusApiUrl = process.env.DIRECTUS_API_URL;

  return json({
    products: items,
    directusApiUrl,
  });
};

// Sayfa bileşeni: Ürünleri ekranda gösterir
export default function Products() {
  const { products, directusApiUrl } = useLoaderData();

  return (
    <div className="products-container">
      <h1>Ürünler</h1>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            {product.image && (
              <img
                src={`${directusApiUrl}/assets/${product.image}`}
                alt={product.name}
                className="product-image"
              />
            )}
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p className="price">Fiyat: {product.price}₺</p>
          </div>
        ))}
      </div>
    </div>
  );
}

