import { SIDEBAR_ROUTES } from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 h-full p-4 space-y-4 bg-gray-50 border-r border-gray-200">
      <nav>
        <ul className="space-y-2">
          {SIDEBAR_ROUTES.map((route) => (
            <li key={route.href}>
              <Link
                href={route.href}
                className="block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-cryptocash-secondary rounded-md"
              >
                <Image
                  src={route.icon}
                  alt={`${route.label} icon`}
                  className="inline-block mr-2"
                  width={24}
                  height={24}
                />
                {route.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
export { Sidebar };
