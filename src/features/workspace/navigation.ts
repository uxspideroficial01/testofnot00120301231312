import {
  CalendarDays,
  Rows3,
  Clock3,
  Link2,
  SquareKanban,
  Clipboard,
  ListTodo,
  Mail,
  Inbox,
  Megaphone,
  UsersRound,
  Apple,
  BookOpen,
  Layers,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
export const NAVIGATION_GROUPS: {
  label: string;
  items: { name: string; icon: LucideIcon }[];
}[] = [
  {
    label: "Scheduling",
    items: [
      { name: "Calendar", icon: CalendarDays },
      { name: "Sessions", icon: Rows3 },
      { name: "Availability Finder", icon: Clock3 },
      { name: "Scheduling Links", icon: Link2 },
    ],
  },
  {
    label: "Engage",
    items: [
      { name: "CRM", icon: SquareKanban },
      { name: "Forms", icon: Clipboard },
      { name: "Tasks", icon: ListTodo },
      { name: "Email", icon: Mail },
      { name: "Text & Voice", icon: Inbox },
      { name: "Marketing", icon: Megaphone },
    ],
  },
  {
    label: "People",
    items: [
      { name: "Members", icon: UsersRound },
      { name: "Staff", icon: Apple },
    ],
  },
  {
    label: "Offerings",
    items: [
      { name: "Services", icon: BookOpen },
      { name: "Group Classes", icon: Layers },
    ],
  },
];
