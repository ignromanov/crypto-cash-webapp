import React from "react";

const AdminAlert: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-4 ">
      <div
        className="rounded-lg bg-orange-100 py-5 px-6 text-base text-orange-800"
        role="alert"
      >
        The current page should only be available to the administrator!
      </div>
    </div>
  );
};

export { AdminAlert };
