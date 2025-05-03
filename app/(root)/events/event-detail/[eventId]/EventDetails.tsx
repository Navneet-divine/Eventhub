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
}

const EventDetails = () => {
  const { data: session } = useSession();
  const params = useParams();
  const eventId = params?.eventId as string;
  const [relatedEvents, setRelatedEvents] = useState<any>([]);
  const [event, setEvent] = useState<Event | null>(null);
  const [isBooked, setIsBooked] = useState<Boolean>();
  const [isRelatedEventsLoading, setIsRelatedEventsLoading] = useState(true);
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

  // Fetch related events
  useEffect(() => {
    if (!eventId) return;

    const fetchAllEvents = async () => {
      try {
        const res = await getRelatedEvent(eventId);
        setRelatedEvents(res);
      } catch (error) {
        console.error("Failed to fetch related events:", error);
      } finally {
        setIsRelatedEventsLoading(false);
      }
    };

    fetchAllEvents();
  }, [eventId]);

  // Handle Stripe checkout
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
        const res = await toggleBookEvent(event._id, session?.user.email);
        setIsBooked((prev) => !prev);
      } else {
        console.error("Event is null");
      }
    } catch (error: any) {
      alert("error");
    }
  }

  return (
    <section className="md:px-5 lg:px-28 xl:px-40 pt-5 pb-10 h-full">
      {event ? (
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
              <div className="flex items-center justify-between w-full">
                <div>
                  <p className="text-4xl font-inter font-semibold">
                    {event.title}dddfdfdfd
                  </p>
                </div>
                <div onClick={handleToggleBookmark} className="cursor-pointer">
                  {isBooked ? (
                    <BookmarkCheck size={30} className="text-violet-500" />
                  ) : (
                    <Bookmark size={30} className="text-violet-400" />
                  )}
                </div>
              </div>
              <div className="flex gap-x-5">
                {Number(event.price) > 0 ? (
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
                    <Image src={calenderIcon} alt="" width={30} height={100} />
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
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Rem,
                  nulla. Deleniti architecto consequatur ullam mollitia
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
        <div className="flex justify-center items-center w-full h-full">
          <p>Loading...</p>
        </div>
      )}
      {/* Related Events Section */}
      <div>
        {/* {isRelatedEventsLoading ? (
          <div className="flex justify-center items-center w-full h-full">
            <p>Loading...</p>
          </div>
        ) : (
          <RelatedEvents allEvents={relatedEvents} />
        )} */}
        <RelatedEvents allEvents={relatedEvents} />
      </div>
    </section>
  );
};

export default EventDetails;
