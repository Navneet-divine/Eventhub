"use client";

import Card from "@/components/Card";
import Loader from "@/components/Loader";
import { getMoreEvents } from "@/lib/actions/event.actions";
import { useEffect, useState } from "react";

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
        const res = await new Promise<EventProps[]>((resolve) =>
          setTimeout(async () => resolve(await getMoreEvents()), 1000)
        );
        setAllEvents(res);
      } catch (error) {
        alert("Failed to fetch events");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchAllEvents();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="px-5 lg:px-28 xl:px-40 pt-5 pb-5">
      <h1 className="text-3xl md:text-4xl font-montserrat font-bold">
        All Events that are
      </h1>
      <p className="text-gray-500 font-inter">recommended by eventhub</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {allEvents.map((e) => (
          <Card
            key={e._id}
            title={e.title}
            description={e.description}
            imageUrl={e.imageUrl}
            date={e.date}
            location={e.location}
            price={e.price}
            eventId={e._id}
            category={e.category}
            startDateTime={e.startDateTime}
            organizer={e.organizer.name}
            onDelete={() => {}}
          />
        ))}
      </div>
      <div className="flex justify-center text-gray-600 text-lg font-montserrat mt-5">
        No more events
      </div>
    </div>
  );
};

export default AllEvents;
