import { ReactNode } from "react";

const Navigation: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <nav>{children}</nav>;
};

export default Navigation;
