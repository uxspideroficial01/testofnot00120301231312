import { createElement, type SVGProps } from "react";
import type { IconNode } from "lucide-react";
import { SIDEBAR_ICON_PATHS } from "./sidebar-icon-paths";

export type SidebarIconName = keyof typeof SIDEBAR_ICON_PATHS;

type Props = Omit<SVGProps<SVGSVGElement>, "name"> & {
  name: SidebarIconName;
  size?: number;
};

/** Decorative navigation glyph; its enclosing button supplies the label. */
export function SidebarIcon({ name, size = 16, ...props }: Props) {
  const nodes: IconNode = SIDEBAR_ICON_PATHS[name];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {nodes.map(([tag, attributes]) => createElement(tag, attributes))}
    </svg>
  );
}
