"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getUserEvents } from "@/lib/actions/user.actions";
import ProfileCard from "@/components/ProfileCard";
import notFound from "@/public/images/no-data .webp";
import Image from "next/image";

const Profile: React.FC = () => {
  const { data: session, status } = useSession();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserEvents = async () => {
      if (!session?.user?.email) return;

      try {
        const res = await getUserEvents(session.user.email);
        if (res) {
          setEvents(res);
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
    <div className="px-5 lg:px-28 xl:px-40 pt-10">
      <h1 className="text-4xl font-montserrat font-semibold">My Events</h1>
      {session && <p>Welcome, {session.user.name}!</p>}

      <div className="mt-5">
        {events.length > 0 ? (
          <ProfileCard allEvents={events} />
        ) : (
          <div className="w-full flex flex-col items-center justify-center mt-10">
            <div>
              <Image alt="" src={notFound} width={100} height={100} />
            </div>
            <div>
              <h1 className="text-2xl font-montserrat font-semibold text-center mt-5">
                No events found
              </h1>
              <p className="text-center mt-2">
                You have not created any events.
              </p>
              <p className="text-center mt-2">
                Create an event to see it here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
