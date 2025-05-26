'use client'

import "./globals.css";
// import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Provider } from "react-redux";
import { store } from "../store";
import { CookieConsent } from "../components/CookieConsent";
import { RiskWarningPopup } from "../components/RiskWarningPopup";
import { MobileMenu } from "../components/MobileMenu";
import { GoogleOAuthProvider } from "@react-oauth/google";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Бартер.ру",
//   description: "Маркетплейс обмена товарами и услугами",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <MobileMenu />
        <GoogleOAuthProvider clientId="demo">
          <Provider store={store}>{children}</Provider>
        </GoogleOAuthProvider>
        <CookieConsent />
        <RiskWarningPopup />
      </body>
    </html>
  );
}
