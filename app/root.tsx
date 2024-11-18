import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  Link
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

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

export default function Root() {
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
          <nav className="bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 p-6 flex items-center justify-center shadow-lg">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center">
                <img
                  src="https://yt3.googleusercontent.com/g3EIUoVlq6BcGY7I7uC6oO0bYV92EK2_eXg1r5UTXhPgzIc8hK0ERX1NjOxnfKXOANUOpXbu=s160-c-k-c0x00ffffff-no-rj"
                  alt="Logo"
                  className="h-12 w-12 rounded-full border-2 border-white"
                />
                <span className="text-white text-3xl font-extrabold tracking-wide ml-4"></span>
              </Link>
              <ul className="flex space-x-8 text-lg font-semibold">
                <li>
                  <Link to="/" className="text-white hover:text-yellow-300 transition duration-300 ease-in-out text-xl">
                    Ana Sayfa
                  </Link>
                </li>
                <li>
                  <Link to="/calendar" className="text-white hover:text-yellow-300 transition duration-300 ease-in-out text-xl">
                    Takvim
                  </Link>
                </li>
                <li>
                  <Link to="/card" className="text-white hover:text-yellow-300 transition duration-300 ease-in-out text-xl">
                    Kartlar
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </header>
        <main className="p-8 flex-1 w-full max-w-7xl mx-auto">
          <Outlet />
        </main>
        <footer className="bg-gray-900 text-white p-6 text-center mt-auto w-full">
          <p>&copy; 2024 Fizikfinito - Tüm Hakları Saklıdır</p>
        </footer>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
