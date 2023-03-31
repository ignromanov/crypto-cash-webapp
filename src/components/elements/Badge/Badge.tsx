import React from "react";
import { BadgeProps } from "./Badge.types";

const Badge: React.FC<BadgeProps> = ({
  caption,
  status,
  textSize = "text-md",
}) => {
  const badgeColor =
    status === null
      ? "bg-gray-300 text-gray-700"
      : status
      ? "bg-green-300 text-green-800"
      : "bg-red-300 text-red-800";

  return (
    <span
      className={`inline-block py-1 px-2 ${textSize} font-semibold rounded-md ${badgeColor} whitespace-nowrap`}
    >
      {caption}
    </span>
  );
};

export { Badge };
