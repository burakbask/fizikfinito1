import { LoaderFunction } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";

export let loader: LoaderFunction = async ({ request }) => {
  // Giriş başarılı olursa ana sayfaya yönlendirin, başarısız olursa giriş sayfasına
  return authenticator.authenticate("google", request, {
    successRedirect: "/",
    failureRedirect: "/login",
  });
};
