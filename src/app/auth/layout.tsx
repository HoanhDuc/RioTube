import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - RioTube",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="bg-black">{children}</div>;
}
