"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getUserBookedEvents } from "@/lib/actions/user.actions";
import ProfileCard from "@/components/ProfileCard";
import notFound from "@/public/images/no-data .webp";
import Image from "next/image";
import Loader from "./Loader";

const BookedEvents: React.FC = () => {
  const { data: session } = useSession();
  interface Event {
    id: string;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    location: string;
    organizer: string;
    category: string;
    startDateTime: Date;
    endDateTime: Date;
    url: string;
    isFree: boolean;
  }

  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [hasTriedLoadingMore, setHasTriedLoadingMore] = useState(false);

  const fetchUserEvents = async (pageNum = 1) => {
    if (!session?.user?.email) return;

    try {
      setLoading(true);
      const res = await getUserBookedEvents(session.user.email, pageNum, 9);
      if (res) {
        if (pageNum === 1) {
          setEvents(res.events);
        } else {
          setEvents((prev) => [...prev, ...res.events]);
        }
        setHasMore(res.hasMore ?? false);
      } else {
        console.error("Failed to fetch user events");
      }
    } catch (err) {
      console.error("Error fetching user events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserEvents(1);
  }, [session?.user?.email]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    setHasTriedLoadingMore(true);
    fetchUserEvents(nextPage);
  };

  if (loading && events.length === 0) return <Loader />;

  return (
    <div>
      {events.length > 0 ? (
        <>
          <ProfileCard allEvents={events} />
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleLoadMore}
                className="bg-violet-600 text-white font-montserrat cursor-pointer px-4 py-2 rounded hover:bg-violet-700 transition"
                disabled={loading}
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
          {!hasMore && hasTriedLoadingMore && (
            <p className="text-center mt-4 text-sm text-gray-500">
              No more events to load
            </p>
          )}
        </>
      ) : (
        <div className="w-full flex flex-col items-center justify-center">
          <div>
            <Image
              alt="not found Img"
              src={notFound}
              width={250}
              height={100}
            />
          </div>
          <div>
            <h1 className="text-2xl font-montserrat font-semibold text-center mt-3">
              No booked events found
            </h1>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookedEvents;
