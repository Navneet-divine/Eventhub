"use client";

import { useEffect, useState } from "react";
import EditEventForm from "../../components/EditEventForm";
import { useParams } from "next/navigation";
import { getEventById } from "@/lib/actions/event.actions";

interface EventDataProps {
  _id: string;
  title: string;
  description: string;
  price: string;
  imageUrl: string;
  location: string;
  organizer: string;
  category: string;
  startDateTime: Date;
  endDateTime: Date;
  url: string;
  isFree: boolean;
}

const EditEvent: React.FC = () => {
  const { eventId } = useParams();
  const [eventData, setEventData] = useState<EventDataProps | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const event = await getEventById(eventId as string);
        setEventData(event);
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };

    fetchEvent();
  }, [eventId]);

  return (
    <>
      <div className="px-5 lg:px-28 xl:px-40 ">
        <div className="flex justify-start py-5 md:pt-5 md:py-0">
          <h1 className="font-bold text-3xl font-inter">Edit Event</h1>
        </div>
        <div>
          {eventData && (
            <EditEventForm event={eventData} eventId={eventData._id} />
          )}
        </div>
      </div>
    </>
  );
};

export default EditEvent;
