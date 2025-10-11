'use client'

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { App } from "antd";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <App message={{maxCount: 1, top: 700}} notification={{placement: 'bottom', maxCount: 1}}>
          <SessionProvider> 
            {children}
          </SessionProvider>
        </App>
      </body>
    </html>
  );
}
