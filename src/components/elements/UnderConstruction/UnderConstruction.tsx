/* eslint-disable @next/next/no-img-element */
import React from "react";

const UnderConstruction: React.FC = () => {
  return (
    <div className="min-h-fit pt-10 bg-gray-100 flex flex-col justify-center items-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-700 mb-4">
          Under Construction
        </h1>
        <p className="text-xl text-gray-500">
          {
            "We're working hard to bring you this feature. Please check back soon!"
          }
        </p>
      </div>
      <div className="mt-8">
        <img
          src="https://cdn.pixabay.com/photo/2017/06/16/07/26/under-construction-2408062_960_720.png"
          alt="Under Construction"
          className="w-max h-64 object-cover"
        />
      </div>
    </div>
  );
};

export { UnderConstruction };
