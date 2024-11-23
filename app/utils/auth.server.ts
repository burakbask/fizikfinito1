import { GoogleStrategy } from "remix-auth-google";
import { Authenticator } from "remix-auth";
import { sessionStorage } from "../utils/session.server"; // Oturumları yönetmek için session storage ekleyin
import dotenv from "dotenv";

// .env dosyasındaki değişkenleri kullanabilmek için dotenv'i içe aktarın
dotenv.config();

// Yeni bir Authenticator oluştur
export let authenticator = new Authenticator(sessionStorage);

// GoogleStrategy oluşturuyoruz
let googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL!,
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    // Kullanıcıyı veritabanınıza ekleyin veya mevcut kullanıcıyı alın
    return profile;
  }
);

// Authenticator'a strateji ekliyoruz
authenticator.use(googleStrategy);
