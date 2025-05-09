"use client";
import { useState } from "react";
import Testimonial1 from "@/public/images/testimonial1.webp";
import Testimonial2 from "@/public/images/testimonial2.webp";
import Testimonial3 from "@/public/images/testimonial3.jpg";
import Image from "next/image";

const Testimonial: React.FC = () => {
  const [showActiveText, setShowActiveText] = useState(1);

  return (
    <div className="px-5 lg:px-28 xl:px-40 pt-5 pb-10">
      <div className="py-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl text-violet-500 font-montserrat font-semibold">
          Our Happy Users
        </h1>
      </div>

      <div className="flex flex-col items-center md:flex-row md:justify-center flex-wrap gap-6">
        {/* Testimonial 1 */}
        <div
          onClick={() => setShowActiveText(1)}
          className={`flex gap-5 py-3 px-10 items-center rounded-lg shadow-3xl  hover:translate-y-[-4px] transition-all cursor-pointer ${
            showActiveText === 1 ? "shadow-xl" : ""
          }`}
        >
          <div className="rounded-full">
            <Image
              src={Testimonial1}
              alt="img"
              width={50}
              height={50}
              className="rounded-full"
            />
          </div>
          <div>
            <h1 className="font-inter font-semibold">Navneet Kushwaha</h1>
            <p className="text-gray-600 text-sm font-inter">New Delhi, India</p>
          </div>
        </div>

        {/* Testimonial 2 */}
        <div
          onClick={() => setShowActiveText(2)}
          className={`flex gap-5 py-3 px-10 items-center rounded-lg shadow-3xl hover:translate-y-[-4px] transition-all cursor-pointer ${
            showActiveText === 2 ? "shadow-xl" : ""
          }`}
        >
          <div className="rounded-full">
            <Image
              src={Testimonial2}
              alt="img"
              width={50}
              height={50}
              className="rounded-full"
            />
          </div>
          <div>
            <h1 className="font-inter font-semibold">Ankit Yadav</h1>
            <p className="text-gray-600 text-sm font-inter">New York, USA</p>
          </div>
        </div>

        {/* Testimonial 3 */}
        <div
          onClick={() => setShowActiveText(3)}
          className={`flex gap-5 py-3 px-10 items-center rounded-lg shadow-3xl hover:translate-y-[-4px] transition-all cursor-pointer ${
            showActiveText === 3 ? "shadow-xl" : ""
          }`}
        >
          <div className="rounded-full">
            <Image
              src={Testimonial3}
              alt="img"
              width={50}
              height={50}
              className="rounded-full"
            />
          </div>
          <div>
            <h1 className="font-inter font-semibold">Vinod Kumar</h1>
            <p className="text-gray-600 text-sm font-inter">Berlin, Germany</p>
          </div>
        </div>
      </div>

      {/* Testimonial Text */}
      <div>
        {showActiveText === 1 && (
          <div className="flex flex-col  gap-5 pt-10 px-5">
            <h1 className="text-3xl font-semibold font-montserrat">
              Fastest Eventhub Hosting!
            </h1>
            <p className="text-gray-600 font-inter">
              I've been using eventhub for quite a while now. I went to a lot of
              meetups because I love interacting with different people and I've
              been thinking about hosting my own meetup. So I went to eventhub
              to host a meetup and I was SHOCKED! after seeing how easy it was
              to host a meetup on this platform. Thanks{" "}
              <span className="text-violet-500">@eventhub</span> for making this
              platform.
            </p>
          </div>
        )}
        {showActiveText === 2 && (
          <div className="flex flex-col gap-5 pt-10 px-5">
            <h1 className="text-3xl font-semibold font-montserrat">
              Heaven for Techy people
            </h1>
            <p className="text-gray-600 font-inter">
              As a software engineer, I always wanted to meet other developers
              to increase my knowledge and to grow my career. This was not easy.
              After finding out about{" "}
              <span className="text-violet-500">@eventhub</span>, I was super
              happy because there were a lot of tech meetups. Meeting other
              developers outside my company became super easy and simple.
            </p>
          </div>
        )}
        {showActiveText === 3 && (
          <div className="flex flex-col gap-5 pt-10 px-5">
            <h1 className="text-3xl font-semibold font-montserrat">
              Taking a break
            </h1>
            <p className="text-gray-600 font-inter">
              I was exhausted from work and wanted to take a break, so my friend
              told me about meetups and how great they are. So I decided to go
              to <span className="text-violet-500">@eventhub</span>, and guess
              what? Now I love going to nearby events, which I almost always
              find on eventhub. Taking a break to attend an eventhub was a great
              idea — everyone should try it at least once.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Testimonial;
