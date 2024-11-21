"use client";
import Header from "@/ui/header";
import React, { ReactNode } from "react";
import { NextUIProvider } from "@nextui-org/react";

interface DefaultLayoutProps {
  children: ReactNode;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <NextUIProvider>{children}</NextUIProvider>
      </main>
      <footer>
        <div className="container mx-auto px-4 py-6 text-center">
          <p>
            © {new Date().getFullYear()} Your Site Name. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DefaultLayout;
