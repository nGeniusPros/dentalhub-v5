export interface NavItem {
  icon: string;
  label: string;
  path: string;
}

export interface NavSection {
  category: string;
  items: NavItem[];
}

export interface SidebarProps {
  role?: "admin" | "staff" | "patient";
  className?: string;
}
