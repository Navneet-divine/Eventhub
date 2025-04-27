"use client";

import {
  getAllEvent,
  getEventById,
  getRelatedEvent,
} from "@/lib/actions/event.actions";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import calenderIcon from "@/public/icons/calendar.svg";
import locationIcon from "@/public/icons/location.svg";
import { formatDateTime } from "@/utils/formatDate";
import RelatedEvents from "../../components/RelatedEvents";

const EventDetails = () => {
  const params = useParams();
  const eventId = params?.eventId as string;
  const [relatedEvents, setRelatedEvents] = useState<any>([]);

  const [event, setEvent] = useState<any>(null);
  console.log(event);

  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      const res = await getEventById(eventId);
      setEvent(res);
    };

    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    const fetchAllEvents = async () => {
      const res = await getRelatedEvent(eventId);
      setRelatedEvents(res);
    };
    fetchAllEvents();
  }, [eventId]);

  console.log(relatedEvents);

  return (
    <>
      <section className="md:px-5 lg:px-28 xl:px-40 pt-5 pb-10 h-full">
        {/* <h1 className="text-2xl font-bold">Event Details</h1> */}
        {event ? (
          <div className="md:flex gap-15 md:gap-5 lg:gap-15">
            {/* first div */}
            <div>
              <Image
                className="h-[90%] object-cover max-md:hidden"
                src={event.imageUrl}
                alt="event img"
                width={900}
                height={800}
              />
              <Image
                className="w-full max-md:h-[300px] md:hidden object-cover"
                src={event.imageUrl}
                alt="event img"
                width={300}
                height={400}
              />
            </div>
            {/* second div */}
            <div className="w-full md:mt-5 p-4 md:p-0">
              <div className="flex flex-col gap-5">
                <div>
                  <p className="text-4xl font-inter font-semibold">
                    {event.title}
                  </p>
                </div>
                <div className="flex gap-x-5">
                  {event.price > 0 ? (
                    <p className="text-green-600 font-semibold font-inter">
                      ${event.price}
                    </p>
                  ) : (
                    <p className="text-green-600 font-semibold font-inter">
                      Free
                    </p>
                  )}

                  <div className="flex items-center justify-center bg-gray-300 px-2 rounded-full">
                    <p className="text-gray-600 font-semibold font-inter text-sm">
                      {event.category}
                    </p>
                  </div>
                  <div>
                    <p className="font-montserrat text-sm font-semibold">
                      by{" "}
                      <span className="text-violet-600 font-inter">
                        {event.organizer.name}
                      </span>
                    </p>
                  </div>
                </div>
                <div>
                  <Button className="w-30 rounded-full h-10 bg-violet-600 font-inter hover:bg-violet-600 cursor-pointer">
                    Get Ticket
                  </Button>
                </div>
                <div className="">
                  <div className="flex gap-2 items-center">
                    <div>
                      <Image src={locationIcon} alt="" width={30} height={30} />
                    </div>
                    <div>
                      <p>
                        {formatDateTime(event.startDateTime)} /{" "}
                        {formatDateTime(event.endDateTime)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3 items-center">
                    <div>
                      <Image
                        src={calenderIcon}
                        alt=""
                        width={30}
                        height={100}
                      />
                    </div>
                    <div>
                      <p>{event.location}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h1 className="font-inter font-bold text-gray-500">
                    What You'll Learn:
                  </h1>
                  <p className="font-montserrat">
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Rem, nulla. Deleniti architecto consequatur ullam mollitia
                    perspiciatis, quaerat corrupti, sit enim obcaecati quisquam
                    eum animi, magni reiciendis odio. Ex, consectetur pariatur!
                  </p>
                </div>
                <div>
                  <Link className="text-violet-600 underline" href={event.url}>
                    {event.url}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
        <div>
          <RelatedEvents allEvents={relatedEvents} />
        </div>
      </section>
    </>
  );
};

export default EventDetails;
