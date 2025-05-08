import Link from "next/link";
import { Button } from "./ui/button";

const AboveFooter: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-6 w-full border-t bg-violet-500 text-white py-16 px-4 sm:px-8 md:px-16">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-montserrat font-bold leading-tight">
          Do not waste time thinking
        </h1>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-montserrat font-bold  leading-tight">
          Create your Eventhub account today
        </h1>
      </div>
      <div>
        <Link href="/sign-up">
          <Button className="w-36 h-11 rounded-full sm:w-40 sm:h-12 bg-violet-600 hover:bg-violet-700 cursor-pointer font-montserrat font-semibold text-base sm:text-lg">
            Join now!
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default AboveFooter;
