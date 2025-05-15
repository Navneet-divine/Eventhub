import React, { ReactNode } from "react";

interface SocialsProps {
  text: string;
  logo: ReactNode;
}

const Socials: React.FC<SocialsProps> = ({ text, logo}) => {
  return (
    <div className="pb-5">
      <div className="flex justify-between border-b-2 pb-1 border-black">
        <div className="">{logo}</div>
        <div>
          <p>{text}</p>
        </div>
      </div>
    </div>
  );
};

export default Socials;
