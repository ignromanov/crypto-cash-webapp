import { ReactNode } from "react";

interface SwitcherProps {
  id: string;
  isChecked: boolean;
  isDisabled: boolean;
  handleToggle: () => void;
  children?: ReactNode;
}

export type { SwitcherProps };
