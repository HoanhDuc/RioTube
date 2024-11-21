import type { Metadata } from "next";
import DefaultLayout from "@/layouts/defaultLayout";

export const metadata: Metadata = {
  title: "RioTube",
  description: "RioTube - Your favorite videos in one place",
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DefaultLayout>{children}</DefaultLayout>;
}
