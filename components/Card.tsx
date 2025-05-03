import Image from "next/image";
import Link from "next/link";

import { formatDateTime } from "@/utils/formatDate";
import editIcon from "@/public/icons/edit.svg";
import deleteIcon from "@/public/icons/delete.svg";
import { deleteEvent } from "@/lib/actions/event.actions";

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
}) => {
  function handleDelete(eventId: string) {
    deleteEvent(eventId);
  }

  return (
    <div className="flex w-full rounded-t-lg shadow-lg flex-col justify-between bg-white">
      {/* Event Image with Link */}
      <div className="relative rounded-lg w-full h-36">
        <Link
          href={`/events/event-detail/${eventId}`}
          className="block w-full h-full"
        >
          <Image
            src={imageUrl}
            className="object-cover rounded-t-lg w-full h-36"
            alt={title}
            width={100}
            height={100}
          />
        </Link>

        {/* Edit/Delete Buttons (Only if showEditDelete is true) */}
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

            <div
              onClick={() => handleDelete(eventId)}
              className="bg-white p-2 rounded-sm shadow-md hover:bg-gray-100 cursor-pointer"
            >
              <Image
                src={deleteIcon}
                alt="Delete icon"
                width={20}
                height={20}
              />
            </div>
          </div>
        )}
      </div>

      {/* Event Details */}
      <div className="p-3">
        <div className="flex items-center  gap-4 text-sm mt-2">
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
