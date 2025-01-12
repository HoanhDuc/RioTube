"use client";
import {
  Avatar,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Dropdown,
  Link,
} from "@nextui-org/react";
import { signOut, useSession } from "next-auth/react";
import Logo from "./logo";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

const NAV_ITEMS = [
  { name: "Home", href: "/" },
  { name: "TV Shows", href: "/tv" },
  { name: "Movies", href: "/movies" },
  { name: "New & Popular", href: "/new" },
  { name: "My List", href: "/my-list" },
];

export default function Header() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed w-full top-0 z-50 transition-all bg-gradient-to-b from-black to-transparent">
      <div className="flex items-center justify-between px-4 lg:px-12 py-4">
        <div className="flex items-center md:gap-8">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden hover:bg-primary p-2 rounded-xl"
          >
            <svg
              className="w-7 h-7 text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="text-red-600 text-3xl font-bold flex items-center"
          >
            <Logo size={60} className="hidden sm:flex" />
            <Image
              src="/logo.svg"
              alt="logo"
              width={60}
              height={60}
              className="sm:hidden"
              loading="lazy"
            />
          </Link>

          {/* Navigation - Now visible from md breakpoint */}
          <nav className="hidden md:flex gap-4 lg:gap-6">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-white transition-colors text-sm lg:text-base"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Side - Search & Profile */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Search Bar */}
          <div className="relative flex items-center">
            <input
              className="p-2 pl-9 bg-primary/70 text-secondary rounded-xl transition-all duration-300 w-[40px] h-[40px] focus:w-[160px] sm:focus:w-[200px] md:focus:w-[300px] lg:focus:w-[400px] focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  router.push(
                    `/results?search_query=${
                      (e.target as HTMLInputElement).value || ""
                    }`
                  );
                }
              }}
            />
            <svg
              aria-hidden="true"
              className="absolute left-3 text-secondary pointer-events-none w-5 h-5 transition-transform duration-300 group-focus-within:rotate-90"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Profile Dropdown - adjusted size */}
          <Dropdown className="bg-primary">
            <DropdownTrigger className="cursor-pointer">
              <div className="w-[40px]">
                <Avatar
                  src={session?.user?.picture || ""}
                  alt={session?.user?.name || ""}
                  className="w-[40px]"
                />
              </div>
            </DropdownTrigger>
            <DropdownMenu aria-label="User menu">
              <DropdownItem isReadOnly className="gap-2 pt-6">
                <div className="absolute -top-5 w-[40px]">
                  <Avatar
                    src={session?.user?.picture || ""}
                    alt={session?.user?.name || ""}
                    className="w-[40px]"
                  />
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold">{session?.user?.name}</p>
                  <p className="text-sm text-default-500">
                    {session?.user?.email}
                  </p>
                </div>
              </DropdownItem>
              <DropdownItem key="my-channel">My channel</DropdownItem>
              <DropdownItem key="my-subscriptions">
                My subscriptions
              </DropdownItem>
              <DropdownItem
                key="separator"
                className="p-0 h-px my-1 bg-primary"
              />
              <DropdownItem
                key="logout"
                color="danger"
                onClick={() => signOut({ callbackUrl: "/auth/login" })}
              >
                Logout
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      {/* Mobile Navigation Menu - Changed breakpoint to md */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-[73px] bg-black/95 z-50">
          <nav className="flex flex-col p-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-white py-3 px-4 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
