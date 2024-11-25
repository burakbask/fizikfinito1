import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  Link,
  useLoaderData
} from "@remix-run/react";
import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server"; // aaaGoogle OAuth için ekleme

import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export const loader = async ({ request }: LoaderArgs) => {
  let user = await authenticator.isAuthenticated(request);
  return { user };
};

export default function Root() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="flex flex-col min-h-screen bg-gray-100">
        <header>
          <nav className="bg-white p-6 shadow-md">
            <div className="container mx-auto flex items-center justify-between">
              <Link to="/" className="flex items-center">
                <img
                  src="https://yt3.googleusercontent.com/g3EIUoVlq6BcGY7I7uC6oO0bYV92EK2_eXg1r5UTXhPgzIc8hK0ERX1NjOxnfKXOANUOpXbu=s160-c-k-c0x00ffffff-no-rj"
                  alt="Logo"
                  className="h-10 w-10 rounded-full"
                />
                <span className="text-gray-900 text-2xl font-bold ml-4">Fizikfinito</span>
              </Link>
              <ul className="hidden md:flex space-x-8 text-lg font-medium">
                <li>
                  <Link to="/card" className="text-gray-700 hover:text-blue-600 transition duration-300 ease-in-out">
                    Ana Sayfa
                  </Link>
                </li>
                <li>
                  <Link to="/calendar" className="text-gray-700 hover:text-blue-600 transition duration-300 ease-in-out">
                    Takvim
                  </Link>
                </li>
                <li>
                  <Link to="/dersplanlamam" className="text-gray-700 hover:text-blue-600 transition duration-300 ease-in-out">
                    Ders Planlamam
                  </Link>
                </li>
              </ul>
              <div className="flex items-center space-x-4">
                {user ? (
                  <Link to="/profile" className="text-gray-900 text-lg font-semibold hover:text-blue-600 transition duration-300 ease-in-out">
                    Hoşgeldiniz, {user.displayName}
                  </Link>
                ) : (
                  <Link
                    to="/google"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold transition duration-300 ease-in-out hover:bg-blue-700"
                  >
                    Google ile Giriş Yap
                  </Link>
                )}
                <button className="md:hidden text-gray-900 focus:outline-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                </button>
              </div>
            </div>
          </nav>
        </header>
        <div className="flex flex-1 relative">
          <aside className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-transparent p-6">
            <div className="flex flex-col items-center">
              <ul className="space-y-4">
                <li>
                  <a href="https://instagram.com/fizikfinito" target="_blank" rel="noopener noreferrer" className="transition duration-300 ease-in-out">
                    <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" className="h-8 w-8" />
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com/fizikfinito" target="_blank" rel="noopener noreferrer" className="transition duration-300 ease-in-out">
                    <img src="https://cdn-icons-png.flaticon.com/512/5968/5968830.png " alt="Twitter" className="h-8 w-8" />
                  </a>
                </li>
                <li>
                  <a href="https://tiktok.com/@fizikfinito" target="_blank" rel="noopener noreferrer" className="transition duration-300 ease-in-out">
                    <img src="https://cdn-icons-png.flaticon.com/512/2504/2504942.png " alt="TikTok" className="h-8 w-8" />
                  </a>
                </li>
              </ul>
            </div>
          </aside>
          <main className="p-8 flex-1 w-full max-w-7xl mx-auto">
            <Outlet />
          </main>
        </div>
        <footer className="bg-gray-900 text-white p-6 text-center mt-auto w-full">
          <p>&copy; 2024 Fizikfinito - Tüm Hakları Saklıdır</p>
        </footer>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}