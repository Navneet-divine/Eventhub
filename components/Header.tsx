"use client";
import logo from "@/public/icons/logo.png";
import Image from "next/image";
import Navigation from "./Navigation";
import Link from "next/link";
import { NAV_LINK } from "@/constants/index";

import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import { MobileNav } from "./MobileNav";

export default function Header() {
  const { data: session, status } = useSession();

  // if (status === "loading") {
  //   return (
  //     <div>
  //       <p className="p-4 text-gray-500"></p>;
  //     </div>
  //   );
  // }

  return (
    <div className="flex justify-between items-center p-3 px-5 lg:px-28 xl:px-40">
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
                    className="text-gray-500 hover:text-gray-900"
                  >
                    {link.label}
                  </Link>
                );
              })}
            </ul>
          </Navigation>
        </div>
      )}

      <div className="flex items-center justify-end  h-full">
        {session?.user.image && (
          <div className="rounded-full h-9 mr-2 shrink-0 w-9">
            <Image
              src={session.user.image}
              alt="userAvatar"
              width={100}
              height={100}
              className="rounded-full"
            />
          </div>
        )}

        {session &&
          !session.user.image &&
          (session?.user.avatar ? (
            <div className="rounded-full h-9 mr-2 shrink-0 w-9">
              <Image
                src={session.user.avatar}
                alt="userAvatar"
                width={100}
                height={100}
                className="rounded-full h-9 w-9 object-fill"
              />
            </div>
          ) : (
            <div
              className="flex justify-center items-center rounded-full h-9 mr-2 shrink-0 w-9 text-white font-montserrat"
              style={{ backgroundColor: session.user.color }}
            >
              {session.user.name?.charAt(0).toUpperCase()}
            </div>
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
