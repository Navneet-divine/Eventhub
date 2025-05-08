import Image, { StaticImageData } from "next/image";

interface FeatureCardProps {
  image: string | StaticImageData;
  title: string;
  text: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ image, text, title }) => {
  return (
    <div className="flex flex-col justify-center items-center bg-violet-50 p-5 rounded-sm max-md:w-[90%] mx-auto border min-h-[300px]">
      <div className="flex justify-center items-center h-20 w-20 border border-violet-600 rounded-full">
        <Image src={image} alt="" width={50} height={50} />
      </div>
      <div>
        <h3 className="font-montserrat font-semibold text-sm">{title}</h3>
      </div>
      <div className="text-center font-inter text-gray-500 pt-5">{text}</div>
    </div>
  );
};

export default FeatureCard;
