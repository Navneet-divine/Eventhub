"use client";

import Card from "@/components/Card";
import { getEventByCategory } from "@/lib/actions/event.actions";
import { useEffect, useState } from "react";
import TechEventCard from "./TechEventCard";
import Loader from "@/components/Loader";

interface EventProps {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  location: string;
  price: number;
  category: string;
  startDateTime: string;
  isFree: string;
  organizer: {
    name: string;
  };
}

const AllEvents: React.FC = () => {
  const [allEvents, setAllEvents] = useState<EventProps[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchAllEvents() {
      try {
        setLoading(true);
        const res = await getEventByCategory("technology");
        console.log("Fetched events:", res);
        if (Array.isArray(res)) {
          setAllEvents(res);
        } else {
          console.warn("getEventByCategory did not return an array", res);
          setAllEvents([]);
        }
      } catch (error) {
        alert("Failed to fetch events");
        console.error(error);
        setAllEvents([]);
      } finally {
        setLoading(false);
      }
    }
    fetchAllEvents();
  }, []);

  return (
    <div className="px-5 lg:px-28 xl:px-40 pt-5 pb-10">
      <h1 className="text-2xl md:text-3xl font-montserrat font-bold">
        Evetns for <span className="text-violet-600">"Techy"</span> Peoples
      </h1>

      {loading ? (
        <div className="w-full h-32 mt-5">
          <Loader />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mt-6">
          {allEvents.map((e, i) => (
            <TechEventCard
              key={i}
              eventId={e._id}
              title={e.title}
              image={e.imageUrl}
              price={e.price.toString()}
              isFree={e.isFree}
              startDate={e.startDateTime}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllEvents;
