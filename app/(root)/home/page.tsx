import HeroSection from "@/components/HeroSection";
import Collection from "@/components/Collection";
import { getAllEvent } from "@/lib/actions/event.actions";
import { signOut } from "next-auth/react";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eventhub | Home",
};

const Dashboard: React.FC = async () => {
  const allEvents = await getAllEvent();

  return (
    <div className="pb-10">
      <HeroSection />
      <Collection allEvents={allEvents.data} />
    </div>
  );
};

export default Dashboard;
