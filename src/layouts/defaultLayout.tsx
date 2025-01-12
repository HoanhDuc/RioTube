"use client";
import Header from "@/ui/header";
import React, { ReactNode } from "react";
import { NextUIProvider } from "@nextui-org/react";
import PageTransition from "@/components/PageTransition";


interface DefaultLayoutProps {
  children: ReactNode;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main>
        <PageTransition>
          <NextUIProvider>{children}</NextUIProvider>
        </PageTransition>
      </main>
    </div>
  );
};

export default DefaultLayout;
