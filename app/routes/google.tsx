import { LoaderFunction } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";

export let loader: LoaderFunction = async ({ request }) => {
  // Kullanıcıyı Google kimlik doğrulama sayfasına yönlendirin
  return authenticator.authenticate("google", request);
};
