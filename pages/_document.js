import Navbar from "@/components/Navbar";
import Cookies from "js-cookie";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document(props) {
  let isLoggedIn = Cookies.get("access-token") ? true : false;
  // if (!isLoggedIn) redirect("/login");

  return (
    <Html lang="en">
      <Head />
      <body>
        {/* {isLoggedIn ? <Navbar /> : <></>} */}
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
