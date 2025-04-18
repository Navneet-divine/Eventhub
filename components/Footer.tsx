import logo from "@/public/icons/logo.png";
import Image from "next/image";

export default function Footer() {
  return (
    <div className="flex items-center md:justify-between w-full md:flex-row flex-col gap-2 py-3 border-t-2 lg:px-28 xl:px-40 md:px-5">
      <div className="flex items-center">
        <Image src={logo.src} alt="logo" width={35} height={35} />
        <h1 className="text-xl font-bold ml-2 font-montserrat">Eventhub</h1>
      </div>
      <div className="text-sm font-inter text-gray-500">
        <p> 2025 Eventhub. All Rights reserved.</p>
      </div>
    </div>
  );
}
