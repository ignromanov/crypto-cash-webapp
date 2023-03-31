import React from "react";
import { ExecStatusDisplayProps } from "./ExecStatusDisplay.types";

const ExecStatusDisplay: React.FC<ExecStatusDisplayProps> = ({
  execStatus,
}) => {
  const alertClasses = "mb-3 rounded-md mt-3 py-2 px-6 text-sm font-medium";

  if (execStatus.pending) {
    return (
      <div className={`${alertClasses} bg-blue-100 text-blue-700`} role="alert">
        {execStatus.message}
      </div>
    );
  }

  if (execStatus.success !== null) {
    return (
      <div
        className={`${alertClasses} ${
          execStatus.success
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
        role="alert"
      >
        {execStatus.message}
      </div>
    );
  }

  return null;
};

export { ExecStatusDisplay };
