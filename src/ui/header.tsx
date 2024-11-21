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
  const items = [
    {
      key: "logout",
      label: "Logout",
    },
  ];
  return (
    <header className=" sticky top-0 flex items-center justify-between px-4 py-2 bg-black z-50">
      <Link href="/">
        <Logo size={50} />
      </Link>
      <div className="w-[400px] flex items-center justify-between gap-4">
        <Input
          label="Search videos ..."
          radius="full"
          size="sm"
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
        <Dropdown>
          <DropdownTrigger className="cursor-pointer">
            <Avatar
              src={session?.user?.picture || ""}
              alt={session?.user?.name || ""}
              className="w-[50px] h-[40px]"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Dynamic Actions" items={items}>
            {(item) => (
              <DropdownItem
                key={item.key}
                color={item.key === "logout" ? "danger" : "default"}
                className={item.key === "logout" ? "text-danger" : ""}
                onClick={() => signOut({ callbackUrl: "/auth/login" })}
              >
                {item.label}
              </DropdownItem>
            )}
          </DropdownMenu>
        </Dropdown>
      </div>
    </header>
  );
}
