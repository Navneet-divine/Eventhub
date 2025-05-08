"use client";

import type React from "react";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { deleteEvent, getAllEvent } from "@/lib/actions/event.actions";
import Card from "@/components/Card";
import SearchForm from "./SearchForm";
import CategoryForm from "./CategoryForm";
import spinner from "@/public/icons/spinner.svg";
import Loader from "./Loader";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationLink,
} from "@/components/ui/pagination";
import Image from "next/image";

interface CollectionProps {
  allEvents: any;
  className?: string;
}

const Collection: React.FC<CollectionProps> = ({ allEvents, className }) => {
  const [isDeleted, setIsDeleted] = useState(false)
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [events, setEvents] = useState(allEvents);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);


  // Use refs to track the current state values for async operations
  const pageRef = useRef(page);
  const searchRef = useRef(search);
  const categoryRef = useRef(category);

  // Update refs when state changes
  useEffect(() => {
    pageRef.current = page;
    searchRef.current = search;
    categoryRef.current = category;
  }, [page, search, category]);

  const { data: session } = useSession();

  // Memoize the fetch function to prevent recreating it on every render
  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      // Use the ref values to ensure we're using the latest state
      const res = await getAllEvent(
        9,
        searchRef.current,
        categoryRef.current,
        pageRef.current
      );

      if (res.success) {
        setEvents(res.data);
        setTotalPages(res.totalPages ?? 1);
      } else {
        console.error("Error fetching events:", res.error);
        setEvents([]);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [isDeleted]);

  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    } else {
      fetchEvents();
    }
  }, [search, category, fetchEvents]);

  useEffect(() => {
    if (document.readyState === "complete") {
      fetchEvents();
    }
  }, [page, fetchEvents]);

  const handleSearch = (title: string) => {
    setSearch(title);
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
  };

  const handleNextPage = () => {
    if (page < totalPages && !isLoading) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1 && !isLoading) {
      setPage(page - 1);
    }
  };

   const handleDelete = async (eventId: string) => {
      await deleteEvent(eventId);
    };

  return (
    <div className={`px-5 lg:px-28 xl:px-40 pt-8 ${className}`}>
      <div>
        <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold font-montserrat">
          Trusted by <br /> Thousands of Events
        </h2>
      </div>

      <div className="w-full items-center flex flex-col gap-4 md:flex-row md:justify-between md:gap-6 px-2 mt-6">
        <div className="w-full">
          <SearchForm onSearch={handleSearch} />
        </div>
        <div className="w-full">
          <CategoryForm onCategoryChange={handleCategoryChange} />
        </div>
      </div>

      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-white p-4 pt-10 min-h-[300px]">
          {isLoading ? (
            <div className="flex justify-center items-center h-40 col-span-full w-full">
              <Loader />
            </div>
          ) : events?.length > 0 ? (
            events.map((event: any) => (
              <Card
                key={event._id}
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
                showEditDelete={session?.user?.email === event.organizer.email}
                onDelete={handleDelete}
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

        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <Pagination className="cursor-pointer">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={handlePreviousPage}
                    className={
                      page === 1 || isLoading
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>

                {/* Show a few page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((pageNum) => Math.abs(pageNum - page) <= 2) // Only show near current
                  .map((pageNum) => (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        isActive={pageNum === page}
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                {totalPages > 5 && page < totalPages - 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={handleNextPage}
                    className={
                      page === totalPages || isLoading
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
