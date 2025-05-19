import Link from "next/link";
import notFound from "@/public/images/not-found.svg";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex gap-1 flex-col justify-center items-center h-screen">
      <div>
        <Image src={notFound} alt="notfoundimg" width={400} height={400} />
      </div>
      <h2 className="text-2xl font-montserrat">Not Found</h2>
      <Link href="/" className="text-xl text-violet-500 underline">
        Return Home
      </Link>
    </div>
  );
}
