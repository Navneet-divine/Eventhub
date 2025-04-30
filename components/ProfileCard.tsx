import Card from "@/components/Card";
import { useSession } from "next-auth/react";

import noDataImg from "@/public/images/no-data .webp";
import Image from "next/image";

interface EventDataProps {
  allEvents: Array<{
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
  }>;
}

const ProfileCard: React.FC<EventDataProps> = ({ allEvents }) => {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col gap-5 px-5 md:px-0">
      {allEvents?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {allEvents.map((event: any, i: number) => (
            <Card
              key={i}
              eventId={event._id}
              title={event.title}
              description={event.description}
              imageUrl={event.imageUrl}
              date={event.date}
              location={event.location}
              price={event.price}
              category={event.category}
              startDateTime={event.startDateTime}
              organizer={event.organizer.name}
              showEditDelete={
                session?.user.email === event.organizer.email ? true : false
              }
            />
          ))}
        </div>
      ) : (
        <>
          <div className="flex justify-center items-center flex-col gap-1 col-span-full">
            <Image
              src={noDataImg}
              alt="No Data"
              width={400}
              height={400}
              className="mt-5"
            />
          </div>
          <div className="flex flex-col justify-center items-center bg-white p-4 pb-0 rounded-lg">
            <h1 className="font-bold text-xl font-montserrat">
              No Related Events Found
            </h1>
            <p className="text-sm font-montserrat text-gray-600 ">
              Come back later
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileCard;
