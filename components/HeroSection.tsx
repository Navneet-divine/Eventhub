import { Button } from "@/components/ui/button";
import heroImg from "@/public/images/hero.png";
import Image from "next/image";
import Link from "next/link";

const HeroSection: React.FC = () => {
  return (
    <>
      <section className="flex flex-col sm:flex-row bg-violet-50 px-5 lg:px-28 xl:px-40  pt-5 pb-10">
        <div className="sm:w-1/2 pt-7">
          <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold font-montserrat">
            Host,connect, Celebrate: Your Events,
            <span className="text-violet-700">Our Platform!</span>
          </h1>
          <div className="pt-5 sm:pr-10 text-sm md:text-base ">
            <p className="font-inter">
              Book and learn helpful tips from 3168+ mentors in world-class
              companies with our global community.
            </p>
          </div>
          <div className="flex max-sm:justify-center py-5">
            <Link href="/sign-in" className="w-full">
              <Button className="w-full min-[510px]:w-40 sm:w-40 rounded-full h-12 bg-violet-600 font-inter hover:bg-violet-600 cursor-pointer">
                Explore now
              </Button>
            </Link>
          </div>
        </div>
        <div className="sm:w-1/2 flex justify-center md:hidden ">
          <Image
            src={heroImg}
            alt="hero image"
            width={300}
            height={300}
            className="object-contain"
          />
        </div>

        <div className="md:w-1/2 flex justify-center max-md:hidden ">
          <Image
            src={heroImg}
            alt="hero image"
            width={350}
            height={350}
            className="object-contain"
          />
        </div>
      </section>
    </>
  );
};

export default HeroSection;
