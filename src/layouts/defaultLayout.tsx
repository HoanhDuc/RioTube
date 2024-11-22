"use client";
import Header from "@/ui/header";
import React, { ReactNode } from "react";
import { NextUIProvider } from "@nextui-org/react";

interface DefaultLayoutProps {
  children: ReactNode;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main>
        <NextUIProvider>{children}</NextUIProvider>
      </main>
    </div>
  );
};

export default DefaultLayout;
