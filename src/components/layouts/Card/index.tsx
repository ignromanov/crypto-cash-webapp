import React, { Children } from "react";

type CardProps = {
  children?: React.ReactNode;
};

const Card: React.FC<CardProps> = ({ children }) => {
  return <div className="bg-white p-6 rounded-lg shadow-lg">{children}</div>;
};

export default Card;
