import Link from "next/link";
import notFound from "@/public/images/not-found.svg";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex gap-3 flex-col justify-center items-center h-screen">
      <div>
        <Image src={notFound} alt="notfoundimg" width={100} height={100} />
      </div>
      <h2>Not Found</h2>
      <Link href="/">Return Home</Link>
    </div>
  );
}
