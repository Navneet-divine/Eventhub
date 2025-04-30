"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getUserEvents } from "@/lib/actions/user.actions";
import MyEvents from "@/components/MyEvents";

const Profile: React.FC = () => {
  const { data: session, status } = useSession();
  const [events, setEvents] = useState<{
    events: any;
    hasMore: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserEvents = async () => {
      if (!session?.user?.email) return;

      try {
        const res = await getUserEvents(session.user.email);
        if (res) {
          setEvents({ events: res.events, hasMore: res.hasMore });
        } else {
          console.error("Failed to fetch user events");
        }
      } catch (err) {
        console.error("Error fetching user events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserEvents();
  }, [session?.user?.email]);

  if (loading) return <p className="px-5 pt-10">Loading...</p>;

  return (
    <div className="px-5 lg:px-28 xl:px-40 pt-10 pb-10">
      <h1 className="text-4xl font-montserrat font-semibold">My Events</h1>
      {session && <p>Welcome, {session.user.name}!</p>}
      <div className="pt-10">
        <MyEvents />
      </div>
    </div>
  );
};

export default Profile;
