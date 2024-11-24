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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Sosyal Medya</h2>
              <ul className="space-y-4">
                <li>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600 transition duration-300 ease-in-out">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.893-4.788 4.658-4.788 1.325 0 2.463.099 2.794.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.312h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.324-.593 1.324-1.324V1.325C24 .593 23.407 0 22.675 0z" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600 transition duration-300 ease-in-out">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557a9.833 9.833 0 0 1-2.825.775A4.934 4.934 0 0 0 23.337 3.1a9.864 9.864 0 0 1-3.127 1.195 4.924 4.924 0 0 0-8.391 4.49A13.975 13.975 0 0 1 1.671 3.149a4.922 4.922 0 0 0 1.523 6.573A4.903 4.903 0 0 1 .964 9.71v.062a4.925 4.925 0 0 0 3.946 4.827 4.902 4.902 0 0 1-2.224.084 4.926 4.926 0 0 0 4.598 3.417A9.874 9.874 0 0 1 0 19.54a13.95 13.95 0 0 0 7.548 2.212c9.057 0 14.01-7.513 14.01-14.01 0-.213-.005-.426-.015-.637A9.978 9.978 0 0 0 24 4.557z" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600 transition duration-300 ease-in-out">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.976 1.246 2.243 1.308 3.609.058 1.265.07 1.645.07 4.849s-.012 3.584-.07 4.85c-.062 1.366-.332 2.633-1.308 3.608-.976.975-2.243 1.246-3.609 1.308-1.265.058-1.645.07-4.849.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.332-3.608-1.308-.975-.976-1.246-2.243-1.308-3.609-.058-1.265-.07-1.645-.07-4.849s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.976-.975 2.243-1.246 3.609-1.308C8.416 2.175 8.796 2.163 12 2.163m0-2.163C8.756 0 8.332.015 7.052.073 5.775.132 4.565.5 3.513 1.553 2.46 2.606 2.093 3.817 2.034 5.094.975 6.374.96 6.798.96 12s.015 5.625.073 6.906c.059 1.277.426 2.487 1.479 3.54 1.052 1.052 2.263 1.42 3.54 1.479 1.281.058 1.705.073 6.907.073s5.625-.015 6.906-.073c1.277-.059 2.487-.426 3.54-1.479 1.052-1.052 1.42-2.263 1.479-3.54.058-1.281.073-1.705.073-6.907s-.015-5.625-.073-6.906c-.059-1.277-.426-2.487-1.479-3.54-1.052-1.052-2.263-1.42-3.54-1.479C16.625.015 16.201 0 12 0z" />
                      <path d="M12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.164a4.002 4.002 0 1 1 0-8.004 4.002 4.002 0 0 1 0 8.004zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
                    </svg>
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