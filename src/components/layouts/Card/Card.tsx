import React from "react";
import { Props } from "./Card.types";

const Card: React.FC<Props> = ({ children }) => {
  return (
    <div className="container mx-auto px-4 py-4">
      <div className="bg-white p-6 rounded-lg shadow-lg">{children}</div>
    </div>
  );
};

export { Card };
