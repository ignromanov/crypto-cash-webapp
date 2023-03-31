import React from "react";
import Link from "next/link";

const links = [
  { href: "/balances", label: "Balances" },
  { href: "/generate-codes", label: "Code Generation" },
  { href: "/redeem-code", label: "Code Redemption" },
];

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 h-full p-4 space-y-4 bg-gray-50 border-r border-gray-200">
      <nav>
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-cryptocash-secondary rounded-md"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
