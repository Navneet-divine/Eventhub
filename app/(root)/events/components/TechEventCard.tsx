import Image from "next/image";
import { formatDateTime } from "@/utils/formatDate";
import Link from "next/link";

interface TechEventCardProps {
  title: string;
  image: string;
  eventId: string;
  price: string;
  isFree: string;
  startDate: string;
}

const TechEventCard: React.FC<TechEventCardProps> = ({
  title,
  startDate,
  image,
  price,
  isFree,
  eventId,
}) => {
  return (
    <Link href={`/events/event-detail/${eventId}`}>
      <div className="flex gap-5 p-2 w-full items-start cursor-pointer">
        {/* Image */}
        <div className="flex-shrink-0 w-32 h-14">
          <Image
            src={image}
            alt="Event"
            width={100}
            height={100}
            className="w-32 h-20 object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col justify-between w-full">
          <h1 className="text-lg font-semibold">{title}</h1>
          <p className="text-gray-500 text-sm">{formatDateTime(startDate)}</p>
          <div>
            <button className="bg-violet-600 px-2 font-inter text-sm text-white rounded-sm">
              {" "}
              {price ? <p>{price}</p> : <p>Free</p>}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TechEventCard;
