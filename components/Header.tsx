"use client";
import logo from "@/public/icons/logo.png";
import Image from "next/image";
import Navigation from "./Navigation";
import Link from "next/link";
import { NAV_LINK } from "@/constants/index";

import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import { MobileNav } from "./MobileNav";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Header() {
  const { data: session } = useSession();
  const pathName = usePathname();

  return (
    <div className="flex justify-between items-center p-3 px-5 lg:px-28 xl:px-40 border border-r-gray-200">
      <div>
        <div className="flex items-center">
          <Image src={logo.src} alt="logo" width={35} height={35} />
          <h1 className="text-xl font-bold ml-2 font-montserrat">Eventhub</h1>
        </div>
      </div>

      {session && (
        <div className="max-sm:hidden">
          <Navigation>
            <ul className="flex gap-5 text-sm">
              {NAV_LINK.map((link, index) => {
                return (
                  <Link
                    key={index}
                    href={link.route}
                    className={`text-gray-500 font-inter hover:text-violet-500 ${
                      pathName === link.route
                        ? "text-violet-600 hover:text-violet-600"
                        : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </ul>
          </Navigation>
        </div>
      )}

      <div className="flex items-center justify-end h-full">
        {session?.user.image && (
          <div className="flex items-center justify-center space-x-2">
            <div
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-full h-9 w-9 cursor-pointer flex items-center justify-center"
            >
              <LogOut className="text-red-400" />
            </div>
            <div className="rounded-full h-9 w-9 cursor-pointer overflow-hidden">
              <Image
                src={session.user.image}
                alt="userAvatar"
                width={36}
                height={36}
                className="rounded-full"
              />
            </div>
          </div>
        )}

        {session &&
          !session.user.image &&
          (session?.user.avatar ? (
            <div className="rounded-full h-9 mr-2 shrink-0 w-9 cursor-pointer">
              <Image
                src={session.user.avatar}
                alt="userAvatar"
                width={100}
                height={100}
                className="rounded-full h-9 w-9 object-fill"
              />
            </div>
          ) : (
            <>
              <div
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-full h-9 w-9 cursor-pointer flex items-center justify-center"
              >
                <LogOut className="text-red-400" />
              </div>
              <div
                className="flex justify-center items-center rounded-full h-9 mr-2 shrink-0 w-9 text-white font-montserrat cursor-pointer"
                style={{ backgroundColor: session.user.color }}
              >
                {session.user.name?.charAt(0).toUpperCase()}
              </div>
            </>
          ))}

        {session && (
          <div className="sm:hidden">
            <MobileNav />
          </div>
        )}
      </div>

      {!session?.user && (
        <div>
          <Link href="/sign-in">
            <Button
              className="rounded-full bg-violet-600 hover:bg-violet-600 cursor-pointer"
              size="lg"
            >
              Login
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
