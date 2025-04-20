"use client";

import { getEventById } from "@/lib/actions/event.actions";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const EventDetails = () => {
  const params = useParams();
  const eventId = params?.eventId as string; // Make sure your file is named [eventId]

  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      const res = await getEventById(eventId);
      setEvent(res);
    };

    fetchEvent();
  }, [eventId]);

  return (
    <section className="px-5 lg:px-28 xl:px-40 pt-5 pb-10">
      <h1 className="text-2xl font-bold">Event Details</h1>
      {event ? (
        <div className="mt-4">
          <p>
            <strong>Title:</strong> {event.title}
          </p>
          <p>
            <strong>Description:</strong> {event.description}
          </p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </section>
  );
};

export default EventDetails;
