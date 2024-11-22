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

export default function Header() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 flex items-center justify-between px-4 py-2 border-b-2 border-primary bg-black z-50">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="hover:bg-primary p-2 rounded-xl flex items-center justify-center"
        >
          <svg
            className="w-7 h-7 text-secondary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 12h16"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 18h16"
            />
          </svg>
        </button>
        <Link href="/">
          <Logo size={50} className="hidden md:flex" />
          <Image
            src="/logo.svg"
            alt="logo"
            width={60}
            height={60}
            className="md:hidden"
          />
        </Link>
      </div>
      <div className="flex items-center justify-end gap-4 w-full">
        <div className="relative flex items-center">
          <input
            className={`p-2 pl-9 bg-primary text-secondary rounded-xl transition-all duration-300 md:focus:w-[400px] focus:w-[200px] blur:w-[40px] h-[40px] w-[40px] focus:outline-none`}
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
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <Dropdown className="text-primary">
          <DropdownTrigger className="cursor-pointer">
            <div>
              <Avatar
                src={session?.user?.picture || ""}
                alt={session?.user?.name || ""}
                className="w-[40px]"
              />
            </div>
          </DropdownTrigger>
          <DropdownMenu aria-label="User menu">
            <DropdownItem isReadOnly className="h-14 gap-2">
              <div className="flex flex-col">
                <p className="font-semibold">{session?.user?.name}</p>
                <p className="text-sm text-default-500">
                  {session?.user?.email}
                </p>
              </div>
            </DropdownItem>
            <DropdownItem key="my-channel">My channel</DropdownItem>
            <DropdownItem key="my-subscriptions">My subscriptions</DropdownItem>
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
    </header>
  );
}
