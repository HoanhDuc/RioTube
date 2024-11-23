"use client";

import Logo from "@/ui/logo";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col gap-10 items-center justify-center bg-black">
      <Logo size={150} />
      <button
        onClick={async () => {
          try {
            await signIn("google", {
              callbackUrl: "/",
              redirect: true,
            });
          } catch (error) {
            console.error("Sign in error:", error);
          }
        }}
        className="flex items-center gap-2 rounded-lg border px-6 py-3 text-white hover:text-primary shadow-md hover:bg-white transition-all"
      >
        <Image
          src="/google-icon.svg"
          alt="Google Logo"
          loading="lazy"
          width={30}
          height={30}
          priority
        />
        Sign in with Google
      </button>
    </div>
  );
}
