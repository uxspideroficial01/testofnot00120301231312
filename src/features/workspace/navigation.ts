import type { SidebarIconName } from "./icons/sidebar-icon";
export const NAVIGATION_GROUPS: {
  label: string;
  items: { name: string; icon: SidebarIconName }[];
}[] = [
  {
    label: "Scheduling",
    items: [
      { name: "Calendar", icon: "calendar" },
      { name: "Sessions", icon: "rows-4" },
      { name: "Availability Finder", icon: "clock" },
      { name: "Scheduling Links", icon: "link" },
    ],
  },
  {
    label: "Engage",
    items: [
      { name: "CRM", icon: "square-kanban" },
      { name: "Forms", icon: "clipboard" },
      { name: "Tasks", icon: "list-checks" },
      { name: "Email", icon: "mail" },
      { name: "Text & Voice", icon: "inbox" },
      { name: "Marketing", icon: "megaphone" },
    ],
  },
  {
    label: "People",
    items: [
      { name: "Members", icon: "users" },
      { name: "Staff", icon: "apple" },
    ],
  },
  {
    label: "Offerings",
    items: [
      { name: "Services", icon: "user-round" },
      { name: "Group Classes", icon: "layers" },
    ],
  },
  {
    label: "Finance",
    items: [{ name: "Payroll", icon: "banknote" }],
  },
];
