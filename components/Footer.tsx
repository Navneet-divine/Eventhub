import Image from "next/image";

export default function Footer() {
  return (
    <div className="flex items-center md:justify-between w-full md:flex-row flex-col gap-2 py-3 lg:px-28 xl:px-40 md:px-5  border border-b-0 border-gray-200">
      <div className="flex items-center">
        <Image src="/icons/logo.png" alt="logo" width={35} height={35} />
        <h1 className="text-xl font-bold ml-2 font-montserrat">Eventhub</h1>
      </div>
      <div className="text-sm font-inter text-gray-500">
        <p> 2025 Eventhub. All Rights reserved.</p>
      </div>
    </div>
  );
}
