import { FEATURES } from "@/constants";
import FeatureCard from "./FeatureCard";

const Features: React.FC = () => {
  return (
    <div className="px-5 lg:px-28 xl:px-40 pt-5 pb-10">
      {/* Heading */}
      <div className="py-10 ">
        <h1 className="text-3xl sm:text-4xl md:text-5xl text-violet-500 font-montserrat font-semibold">
          Why Eventhub?
        </h1>
      </div>

      {/* Feature Cards Row (starting from md screens) */}
      <div className="flex flex-col items-center md:flex-row md:justify-center flex-wrap gap-6">
        {FEATURES.map((f, i) => (
          <div className="w-full md:w-[300px]" key={i}>
            <FeatureCard title={f.title} text={f.text} image={f.image} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
