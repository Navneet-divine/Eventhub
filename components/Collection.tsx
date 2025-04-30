"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import searchIcon from "@/public/icons/search.svg";
import Image from "next/image";
import Dropdown from "@/app/(root)/events/components/Dropdown";
import Card from "@/components/Card";
import { useSession } from "next-auth/react";

const formSchema = z.object({
  search: z.string().min(2, {
    message: "Please enter at least 2 characters for location.",
  }),
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
  const { data: session } = useSession();
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: "",
      category: "",
    },
  });

  const onSubmit = (values: FormSchemaType) => {
    console.log("Form values:", values);
  };

  return (
    <div className={`px-5 lg:px-28 xl:px-40 pt-8  ${className}`}>
      <div>
        <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold font-montserrat">
          Trusted by <br /> Thousands of Events
        </h2>
      </div>
      {/* div 2 */}
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:gap-6">
              {/* Search Input */}
              <FormField
                control={form.control}
                name="search"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <div className="relative w-full h-[54px]">
                        {/* Search Icon */}
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center">
                          <Image
                            src={searchIcon}
                            alt="Search"
                            width={20}
                            height={20}
                          />
                        </div>

                        {/* Input */}
                        <Input
                          {...field}
                          placeholder="Search events..."
                          className="pl-12 h-full rounded-full "
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category Dropdown */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Dropdown
                        onChangeHandler={field.onChange}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="rounded-full px-8">
              Submit
            </Button>
          </form>
        </Form>
      </div>
      {/* div 3 */}
      <div>
        {/* Card Component */}

        {/* Card Component */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 pt-10 min-h-[300px]">
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
