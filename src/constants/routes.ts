interface Route {
  href: string;
  label: string;
  icon: string;
}

const SIDEBAR_ROUTES: Route[] = [
  {
    href: "/",
    label: "Balances",
    icon: "/svg/balances.svg",
  },
  {
    href: "/generate-codes",
    label: "Code Generation",
    icon: "/svg/codes-generation.svg",
  },
  {
    href: "/redeem-code",
    label: "Code Redemption",
    icon: "/svg/code-redemption.svg",
  },
  {
    href: "/transfer",
    label: "Transfer",
    icon: "/svg/transfer.svg",
  },
  {
    href: "/purchase",
    label: "Purchase",
    icon: "/svg/purchase.svg",
  },
  {
    href: "/bills",
    label: "Bills",
    icon: "/svg/invoices.svg",
  },
  {
    href: "/debts",
    label: "Debts",
    icon: "/svg/debts.svg",
  },
];

export { SIDEBAR_ROUTES };
