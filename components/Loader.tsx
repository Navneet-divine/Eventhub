"use client";

import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-40 w-full">
      <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
