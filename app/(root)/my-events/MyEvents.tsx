"use client";

import { useSession } from "next-auth/react";
import { useEffect} from "react";
import { getUserEvents } from "@/lib/actions/user.actions";
import MyEvents from "@/components/MyEvents";
import BookedEvents from "@/components/BookedEvents";

const MyEvent: React.FC = () => {
  const { data: session } = useSession();

  useEffect(() => {
    const fetchUserEvents = async () => {
      if (!session?.user?.email) return;

      try {
        const res = await getUserEvents(session.user.email);
        if (res) {
        } else {
          console.error("Failed to fetch user events");
        }
      } catch (err) {
        console.error("Error fetching user events:", err);
      }
    };

    fetchUserEvents();
  }, [session?.user?.email]);

  return (
    <>
      <div className="px-5 lg:px-28 xl:px-40 pt-10 pb-10">
        <h1 className="text-4xl font-montserrat font-semibold">My Events</h1>
        {session && <p>Welcome, {session.user.name}!</p>}
        <div className="pt-10">
          <MyEvents />
        </div>
        <div className="pt-10">
          <h1 className="text-4xl font-montserrat font-semibold">
            Booked Events
          </h1>
          <div className="pt-10">
            <BookedEvents />
          </div>
        </div>
      </div>
    </>
  );
};

export default MyEvent;
