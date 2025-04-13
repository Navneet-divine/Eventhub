import logo from "@/public/icons/logo.png";
import Image from "next/image";
import Navigation from "./Navigation";
import Link from "next/link";
import { NAV_LINK } from "@/constants/index";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <div className="flex justify-between items-center p-3 px-5 md:px-40">
      <div>
        <div className="flex items-center">
          <Image src={logo.src} alt="logo" width={35} height={35} />
          <h1 className="text-xl font-bold ml-2 font-montserrat">Eventhub</h1>
        </div>
      </div>
      <div className="max-md:hidden">
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
      {/* <div className="max-md:hidden">
        <Avatar className="cursor-pointer">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback className="bg-gray-600 text-white">CN</AvatarFallback>
        </Avatar>
      </div> */}
    </div>
  );
}
