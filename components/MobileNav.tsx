import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import menuICon from "@/public/icons/menu.svg";
import Image from "next/image";

import logo from "@/public/icons/logo.png";
import { NAV_LINK } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileNav() {
  const pathName = usePathname();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Image
          src={menuICon}
          alt="menuIcon"
          width={34}
          height={34}
          className="cursor-pointer"
        />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            <div className="flex items-center">
              <Image src={logo.src} alt="logo" width={35} height={35} />
              <h1 className="text-xl font-bold ml-2 font-montserrat">
                Eventhub
              </h1>
            </div>
          </SheetTitle>

          <ul className="flex flex-col pt-5 gap-3 font-montserrat">
            {NAV_LINK.map((link, index) => {
              return (
                <Link
                  key={index}
                  href={link.route}
                  className={`${
                    pathName === link.route ? "text-violet-600" : "text-black"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </ul>
        </SheetHeader>

        <SheetFooter>
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center">
              <Image src={logo.src} alt="logo" width={35} height={35} />
              <h1 className="text-xl font-bold ml-2 font-montserrat">
                Eventhub
              </h1>
            </div>
            <div className="text-sm font-inter text-gray-500 ">
              <p> 2025 Eventhub. All Rights reserved.</p>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
