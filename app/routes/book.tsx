import { useEffect } from 'react';
import ProductComponentWrapper from './ProductComponentWrapper';

declare global {
  interface Window {
    ShopifyBuy: any;
  }
}

const ShopifyScriptComponent = ({ productId }: { productId: string }) => {
  useEffect(() => {
    const scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';

    if (window.ShopifyBuy && window.ShopifyBuy.UI) {
      ShopifyBuyInit();
    } else {
      loadScript();
    }

    function loadScript() {
      const script = document.createElement('script');
      script.async = true;
      script.src = scriptURL;
      script.onload = ShopifyBuyInit;
      (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
    }

    function ShopifyBuyInit() {
      const client = window.ShopifyBuy.buildClient({
        domain: 'fizikfinito.zeduva.com',
        storefrontAccessToken: '4884ce168030867a5687db354cd9aae2',
      });

      const productElement = document.querySelector(`.shopify-product[data-product-id="${productId}"]`);
      if (productElement && !productElement.hasAttribute('data-shopify-rendered')) {
        productElement.setAttribute('data-shopify-rendered', 'true');
        window.ShopifyBuy.UI.onReady(client).then((ui: any) => {
          ui.createComponent('product', {
            id: productId,
            node: productElement,
            moneyFormat: '%7B%7Bamount%7D%7DTL',
            options: {
              product: {
                styles: {
                  product: {
                    '@media (min-width: 601px)': {
                      'max-width': 'calc(33.33% - 20px)',
                      'margin-left': '10px',
                      'margin-right': '10px',
                      'margin-bottom': '50px',
                    },
                  },
                  button: {
                    'font-size': '16px',
                    'padding-top': '16px',
                    'padding-bottom': '16px',
                    'border-radius': '13px',
                  },
                  quantityInput: {
                    'font-size': '16px',
                    'padding-top': '16px',
                    'padding-bottom': '16px',
                  },
                },
                text: {
                  button: 'Sepete Ekle',
                },
                contents: {
                  description: productElement.hasAttribute('data-description'),
                },
                templates: {
                  title:
                    '<h1 class="{{data.classes.product.title}}" data-element="product.title"><a class="shopify-buy__product__title" href="{{data.onlineStoreUrl}}" target="_blank">{{data.title}}</a></h1>',
                  img:
                    '<a class="shopify-buy__product__title" href="{{data.onlineStoreUrl}}" target="_blank">{{#data.currentImage.srcLarge}}<div class="{{data.classes.product.imgWrapper}}" data-element="product.imgWrapper"><img alt="{{data.currentImage.altText}}" data-element="product.img" class="{{data.classes.product.img}}" src="{{data.currentImage.srcLarge}}" /></div>{{/data.currentImage.srcLarge}}</a>',
                },
              },
              modalProduct: {
                contents: {
                  img: false,
                  imgWithCarousel: true,
                  button: false,
                  buttonWithQuantity: true,
                },
                styles: {
                  product: {
                    '@media (min-width: 601px)': {
                      'max-width': '100%',
                      'margin-left': '0px',
                      'margin-bottom': '0px',
                    },
                  },
                  button: {
                    'font-size': '16px',
                    'padding-top': '16px',
                    'padding-bottom': '16px',
                    'border-radius': '13px',
                  },
                  quantityInput: {
                    'font-size': '16px',
                    'padding-top': '16px',
                    'padding-bottom': '16px',
                  },
                },
                text: {
                  button: 'Add to cart',
                },
              },
              cart: {
                styles: {
                  button: {
                    'font-size': '16px',
                    'padding-top': '16px',
                    'padding-bottom': '16px',
                    'border-radius': '13px',
                  },
                },
                text: {
                  title: 'Sepetim',
                  total: 'Toplam fiyat',
                  empty: 'Sepetiniz boş',
                  notice: 'Kargo ve indirim kodları ödeme sırasında eklenir.',
                  button: 'Ödeme',
                },
                popup: false,
              },
              toggle: {
                styles: {
                  count: {
                    'font-size': '16px',
                  },
                },
              },
            },
          });
        });
      }
    }
  }, [productId]);

  return (
    <ProductComponentWrapper />
  );
};

export default ShopifyScriptComponent;
