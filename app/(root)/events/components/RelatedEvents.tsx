import Card from "@/components/Card";
import { useSession } from "next-auth/react";

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

const RelatedEvents: React.FC<EventDataProps> = ({ allEvents }) => {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col gap-5 px-5 md:px-0">
      <div>
        <h1 className="text-3xl font-montserrat font-bold">Related Events</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {allEvents?.length > 0 ? (
          allEvents.map((event: any, i: number) => (
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
          ))
        ) : (
          <div className="flex justify-center items-center flex-col gap-1 pt-10">
            <h1 className="font-bold text-xl">No Events Found</h1>
            <p className="text-sm font-inter text-gray-600">Come back later</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RelatedEvents;
