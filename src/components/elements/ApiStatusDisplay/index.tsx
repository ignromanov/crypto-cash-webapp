import React from "react";
import { ApiStatus } from "../../../hooks/useApiStatus";

interface ApiStatusDisplayProps {
  apiStatus: ApiStatus;
}

const ApiStatusDisplay: React.FC<ApiStatusDisplayProps> = ({ apiStatus }) => {
  if (apiStatus.pending) {
    return (
      <div className="mt-4 text-sm font-medium text-blue-500">
        Processing request...
      </div>
    );
  }

  if (apiStatus.success !== null) {
    return (
      <div
        className={`mt-4 text-sm font-medium ${
          apiStatus.success ? "text-green-500" : "text-red-500"
        }`}
      >
        {apiStatus.message}
      </div>
    );
  }

  return null;
};

export default ApiStatusDisplay;
