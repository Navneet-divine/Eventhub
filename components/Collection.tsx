"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { getAllEvent } from "@/lib/actions/event.actions";
import Card from "@/components/Card";
import SearchForm from "./SearchForm";
import CategoryForm from "./CategoryForm";

const formSchema = z.object({
  search: z.string().min(0), // Allow empty search string to fetch all events
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
});

type FormSchemaType = z.infer<typeof formSchema>;

interface CollectionProps {
  allEvents: any;
  className?: string;
}

const Collection: React.FC<CollectionProps> = ({ allEvents, className }) => {
  const [search, setSearch] = useState("");
  const [events, setEvents] = useState(allEvents);
  const [loading, setLoading] = useState(false); // Loading state

  const { data: session } = useSession();
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: "",
      category: "",
    },
  });

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await getAllEvent(8, search);
        setEvents(res.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [search]);

  function handleSearch(title: string) {
    setSearch(title);
  }

  return (
    <div className={`px-5 lg:px-28 xl:px-40 pt-8 ${className}`}>
      <div>
        <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold font-montserrat">
          Trusted by <br /> Thousands of Events
        </h2>
      </div>

      {/* div 2 */}
      <div className="w-full items-center flex flex-col gap-4 md:flex-row md:justify-between md:gap-6 px-2 mt-6">
        <div className="w-full">
          <SearchForm onSearch={handleSearch} /> {/* Search form */}
        </div>
        <div className="w-full">
          <CategoryForm /> {/* Category filter form */}
        </div>
      </div>

      {/* div 3 */}
      <div>
        {/* Display events */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 pt-10 min-h-[300px]">
          {events?.length > 0 ? (
            events.map((event: any, i: number) => (
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
                showEditDelete={session?.user.email === event.organizer.email}
              />
            ))
          ) : (
            <div className="flex justify-center items-center flex-col gap-1 col-span-full">
              <h1 className="font-bold text-xl font-montserrat">
                No Events Found
              </h1>
              <p className="text-sm font-montserrat text-gray-600">
                Come back later
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;
