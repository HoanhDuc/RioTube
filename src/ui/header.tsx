"use client";
import {
  Avatar,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Dropdown,
  Input,
  Link,
} from "@nextui-org/react";
import { signOut, useSession } from "next-auth/react";
import Logo from "./logo";
import { useRouter } from "next/navigation";

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  return (
    <header className="sticky top-0 flex items-center justify-between px-4 py-2 border-b-2 border-primary bg-black z-50">
      <Link href="/">
        <Logo size={50} />
      </Link>
      <div className="flex items-center justify-end gap-4 w-full">
        <Input
          radius="full"
          size="sm"
          placeholder="Search on RioTube"
          startContent={
            <svg
              aria-hidden="true"
              className="w-5 h-5 text-primary transition-transform duration-300 group-focus-within:rotate-90"
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
          }
          className="text-primary border rounded-full border-secondary w-2/3 max-w-[300px]"
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
