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
import { signOut, signIn } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Header() {
  const { data: session, status } = useSession();
  const pathName = usePathname();
  const [avatar, setAvatar] = useState<string | undefined>(
    session?.user?.avatar
  );

  // Function to refresh the session after avatar change
  const refreshSession = async () => {
    try {
      // Trigger a session refresh after the avatar update
      await signIn("credentials", { force: true });
    } catch (error) {
      console.error("Error refreshing session", error);
    }
  };

  // Update avatar when session or avatar changes
  useEffect(() => {
    if (session?.user?.avatar) {
      setAvatar(session.user.avatar);
    } else if (session?.user?.image) {
      setAvatar(session.user.image);
    }
  }, [session?.user?.avatar, session?.user?.image]);

  return (
    <div className="flex justify-between items-center p-3 px-5 lg:px-28 xl:px-40 border border-r-gray-200">
      <div>
        <div className="flex items-center">
          <Image src="/icons/logo.png" alt="logo" width={35} height={35} />
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
        {session?.user?.image && (
          <div className="flex items-center justify-center space-x-2">
            <div
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-full h-9 w-9 cursor-pointer flex items-center justify-center"
            >
              <LogOut className="text-red-400" />
            </div>
            <Link href="/profile">
              <div className="rounded-full h-9 w-9 cursor-pointer overflow-hidden">
                <Image
                  src={avatar ?? "/default-avatar.png"} 
                  alt="userAvatar"
                  width={36}
                  height={36}
                  className="rounded-full"
                />
              </div>
            </Link>
          </div>
        )}

        {session && !session.user.image && (
          <>
            <div
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-full h-9 w-9 cursor-pointer flex items-center justify-center"
            >
              <LogOut className="text-red-400" />
            </div>
            <Link href="/profile">
              <div
                className="flex justify-center items-center rounded-full h-9 mr-2 shrink-0 w-9 text-white font-montserrat cursor-pointer"
                style={{ backgroundColor: session.user.color }}
              >
                {session.user.name?.charAt(0).toUpperCase()}
              </div>
            </Link>
          </>
        )}

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
