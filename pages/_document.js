import Navbar from "@/components/Navbar";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document(props) {
  const pathname = props?.__NEXT_DATA__?.page;
  const isRegisterPage = pathname?.includes("register") ? true : false;

  return (
    <Html lang="en">
      <Head />
      <body>
        {isRegisterPage ? <></> : <Navbar />}
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
