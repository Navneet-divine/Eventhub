"use client";

import Image from "next/image";
import Link from "next/link";

import { formatDateTime } from "@/utils/formatDate";
import editIcon from "@/public/icons/edit.svg";
import deleteIcon from "@/public/icons/delete.svg";


import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface CardProps {
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  location: string;
  price: number;
  eventId: string;
  category: string;
  startDateTime: string;
  organizer: string;
  showEditDelete?: boolean;
  onDelete: (eventId: string) => void;
}

const Card: React.FC<CardProps> = ({
  title,
  imageUrl,
  price,
  eventId,
  category,
  startDateTime,
  organizer,
  showEditDelete,
  onDelete,
}) => {
  return (
    <div className="flex min-h-[300px] w-full rounded-t-lg border flex-col justify-between bg-white">
      {/* Event Image with Link */}
      <div className="relative rounded-lg w-full">
        <Link
          href={`/events/event-detail/${eventId}`}
          className="block w-full h-full"
        >
          <Image
            src={imageUrl}
            className="object-cover rounded-t-lg w-full h-42"
            alt={title}
            width={100}
            height={100}
            priority
          />
        </Link>

        {showEditDelete && (
          <div className="absolute flex items-center flex-col gap-2 top-3 right-2 z-10">
            <Link
              href={`/events/edit-event/${eventId}`}
              className="cursor-pointer"
            >
              <div className="bg-white p-2 rounded-sm shadow-md hover:bg-gray-100">
                <Image src={editIcon} alt="Edit icon" width={20} height={20} />
              </div>
            </Link>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="bg-white p-2 rounded-sm shadow-md hover:bg-gray-100 cursor-pointer">
                  <Image
                    src={deleteIcon}
                    alt="Delete icon"
                    width={20}
                    height={20}
                  />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-montserrat">
                    Do you want to delete event?
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="cursor-pointer">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="cursor-pointer"
                    onClick={() => onDelete(eventId)}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      {/* Event Details */}
      <div className="p-3 pt-0">
        <div className="flex items-center gap-4 text-sm ">
          {/* Price */}
          <div className="bg-green-100 px-2 rounded-full">
            <p className="text-green-500 font-semibold font-inter">
              {price > 0 ? `$${price}` : "Free"}
            </p>
          </div>

          {/* Category Badge */}
          <div className="flex items-center justify-center bg-gray-300 px-2 rounded-full">
            <p className="text-gray-600 font-semibold font-inter text-sm lg:text-xs truncate max-w-[100px]">
              {category}
            </p>
          </div>
        </div>

        {/* Date */}
        <p className="text-xs text-gray-500 font-inter mt-2">
          {formatDateTime(startDateTime)}
        </p>

        {/* Title */}
        <h1 className="font-bold font-inter text-sm mt-2">{title}</h1>

        {/* Organizer */}
        <h1 className="text-xs font-montserrat text-gray-500 mt-4">
          {organizer}
        </h1>
      </div>
    </div>
  );
};

export default Card;
