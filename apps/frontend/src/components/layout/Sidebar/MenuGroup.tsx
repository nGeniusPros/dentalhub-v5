import React from "react";
import { motion } from "framer-motion";
import { MenuItem } from "./MenuItem";
import type { MenuItem as MenuItemType } from "../../../types";

interface MenuGroupProps {
  title: string;
  items: MenuItemType[];
  isCollapsed: boolean;
}

export const MenuGroup: React.FC<MenuGroupProps> = ({
  title,
  items,
  isCollapsed,
}) => {
  return (
    <div>
      {!isCollapsed && (
        <h2 className="text-xs uppercase text-white/50 font-semibold mb-2 px-3">
          {title}
        </h2>
      )}
      <motion.ul initial={false} className="space-y-1">
        {items.map((item) => (
          <MenuItem key={item.id} item={item} isCollapsed={isCollapsed} />
        ))}
      </motion.ul>
    </div>
  );
};
