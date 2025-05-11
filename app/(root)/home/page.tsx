import HeroSection from "@/components/HeroSection";
import Collection from "@/components/Collection";
import { getAllEvent } from "@/lib/actions/event.actions";
import { signOut } from "next-auth/react";

import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import TechEventsPage from "../events/tech-events/page";

export const metadata: Metadata = {
  title: "Eventhub | Home",
};

const Dashboard: React.FC = async () => {
  const allEvents = await getAllEvent();

  return (
    <div className="pb-10">
      <HeroSection />
      <Collection allEvents={allEvents.data} />
      <TechEventsPage/>
      <section className="flex mt-10 flex-col w-full p-10 px-5 md:p-16 md:px-20 bg-gradient-to-r from-purple-800 to-violet-400 text-white">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold font-inter">
            Interested in more events?
          </h1>
        </div>
        <div>
          <p className="font-semibold">
            We have enough events for everyone. Find more!
          </p>
        </div>
        <div className="pt-3">
          <Link href="/events/all-events">
            <Button className="text-violet-600 bg-white cursor-pointer hover:bg-white font-inter px-7">
              view more
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
