import React, { Children } from "react";

type CardProps = {
  children?: React.ReactNode;
};

const Card: React.FC<CardProps> = ({ children }) => {
  return (
    <div className="container mx-auto px-4 py-4">
      <div className="bg-white p-6 rounded-lg shadow-lg">{children}</div>
    </div>
  );
};

export default Card;
