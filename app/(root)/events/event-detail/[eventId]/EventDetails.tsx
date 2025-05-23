"use client";

import {
  getEventById,
  getRelatedEvent,
  toggleBookEvent,
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
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useSession } from "next-auth/react";
import Loader from "@/components/Loader";

interface Event {
  _id: string;
  title: string;
  price: number | string;
  category: string;
  organizer: {
    name: string;
  };
  startDateTime: string;
  endDateTime: string;
  location: string;
  imageUrl: string;
  url: string;
  isBooked: boolean;
  description: string;
}

const EventDetails = () => {
  const { data: session } = useSession();
  const params = useParams();
  const eventId = params?.eventId as string;
  const [relatedEvents, setRelatedEvents] = useState<Event[]>([]);
  const [event, setEvent] = useState<Event | null>(null);
  const [isBooked, setIsBooked] = useState<boolean>();

  const [hasPurchased, setHasPurchased] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const status = searchParams.get("status");

    if (status === "success") {
      setHasPurchased(true);
    }
  }, []);

  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      const res = await getEventById(eventId);
      setEvent(res);
    };

    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    if (!eventId) return;

    const fetchAllEvents = async () => {
      try {
        const res = await getRelatedEvent(eventId);
        setRelatedEvents(res);
      } catch (error) {
        console.error("Failed to fetch related events:", error);
      }
    };

    fetchAllEvents();
  }, [eventId]);

  const handleCheckout = async () => {
    const stripe: Stripe | null = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    );

    if (!stripe) {
      console.error("Stripe failed to load.");
      return;
    }

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: event!._id,
          eventTitle: event!.title,
          eventPrice: event!.price,
          eventCategory: event!.category,
          eventOrganizer: event!.organizer.name,
        }),
      });

      const data = await response.json();
      if (data.error) {
        console.error("Error during checkout session creation:", data.error);
        return;
      }

      const { sessionId } = data;
      await stripe.redirectToCheckout({
        sessionId: sessionId,
      });
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  useEffect(() => {
    if (event) {
      setIsBooked(event.isBooked);
    }
  }, [event]);

  async function handleToggleBookmark() {
    try {
      if (event) {
        if (session?.user.email) {
          await toggleBookEvent(event._id, session.user.email);
        } else {
          console.error("User email is undefined or null");
        }
        setIsBooked((prev) => !prev);
      } else {
        console.error("Event is null");
      }
    } catch {
      alert("error");
    }
  }

  return (
    <section className="md:px-5 lg:px-28 xl:px-40 md:pt-5  pb-10 h-full">
      {event ? (
        <>
          <div className="md:flex gap-15 md:gap-5 lg:gap-15">
            {/* Event Image Section */}
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
            {/* Event Info Section */}
            <div className="w-full md:mt-5 p-4 md:p-0">
              <div className="flex flex-col gap-5">
                <div className="flex items-start justify-between w-full">
                  <div className="flex-1">
                    <p className="text-4xl font-inter font-semibold break-words break-all leading-snug">
                      {event.title}
                    </p>
                  </div>
                  <div
                    onClick={handleToggleBookmark}
                    className="cursor-pointer ml-3 mt-3"
                  >
                    {isBooked ? (
                      <BookmarkCheck size={30} className="text-violet-500" />
                    ) : (
                      <Bookmark size={30} className="text-violet-400" />
                    )}
                  </div>
                </div>

                <div className="flex gap-x-5">
                  {Number(event.price) > 0 ? (
                    <div className="px-2 bg-green-100  rounded-full">
                      <p className="text-green-600 font-semibold font-inter">
                        ${event.price}
                      </p>
                    </div>
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
                      by&nbsp;
                      <span className="text-violet-600 font-inter">
                        {event.organizer.name}
                      </span>
                    </p>
                  </div>
                </div>
                <div>
                  {event.price !== "" && (
                    <Button
                      onClick={handleCheckout}
                      disabled={hasPurchased}
                      className={`w-30 rounded-full h-10 font-inter ${
                        hasPurchased
                          ? "bg-green-500 cursor-not-allowed"
                          : "bg-violet-600 hover:bg-violet-700 cursor-pointer"
                      }`}
                    >
                      {hasPurchased ? "Purchased" : "Get Ticket"}
                    </Button>
                  )}
                </div>
                {/* Event Date and Location */}
                <div>
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
                    What You&apos;ll Learn:
                  </h1>
                  <p className="font-montserrat">{event.description}</p>
                </div>
                <div>
                  <Link className="text-violet-600 underline" href={event.url}>
                    {event.url}
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div>
            <RelatedEvents
              allEvents={relatedEvents.map((event) => ({
                id: event._id,
                title: event.title,
                description: event.description,
                price: Number(event.price),
                imageUrl: event.imageUrl,
                location: event.location,
                organizer: { name: event.organizer.name, email: "" },
                category: event.category,
                startDateTime: new Date(event.startDateTime),
                endDateTime: new Date(event.endDateTime),
                url: event.url,
                isFree: Number(event.price) === 0,
              }))}
            />
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center w-full h-full">
          <Loader />
        </div>
      )}
    </section>
  );
};

export default EventDetails;
