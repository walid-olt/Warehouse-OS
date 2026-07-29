import {
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import type { Icon } from "@phosphor-icons/react";
import {
  ChartBarIcon,
  FolderIcon,
  PackageIcon,
  SwapIcon,
} from "@phosphor-icons/react";
import NavLink from "@/components/Navlink";
import { usePathname } from "next/navigation";

export const DashboardNav = () => {
  return (
    <>
      <DashboardNavItem
        label="Dashboard"
        Icon={ChartBarIcon}
        href="/dashboard"
      />
      <DashboardNavItem
        label="Categories"
        Icon={FolderIcon}
        href="/categories"
      />
      <DashboardNavItem label="Products" Icon={PackageIcon} href="/products" />
      <DashboardNavItem
        label="Stock Movements"
        Icon={SwapIcon}
        href="/stock/movements"
      />
    </>
  );
};

type DashboardNavItemProps = {
  label: string;
  Icon: Icon;
  href: string;
};
function DashboardNavItem({ label, Icon, href }: DashboardNavItemProps) {
  const { state, isMobile } = useSidebar();
  const path = usePathname();
  const isActive = path === href || path.startsWith(`${href}/`);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        size="lg"
        isActive={isActive}
        tooltip={label}

        render={() => (
          <NavLink
            href={href}
            className="flex items-center gap-5 px-4 py-4 text-lg font-medium rounded-lg transition-all hover:scale-[1.02] hover:bg-sidebar-accent/80 active:scale-[0.98]"
          >
            <Icon size={24} weight={isActive ? "fill" : "regular"} />
            {(state === "expanded" || isMobile) && <span className="truncate">{label}</span>}
          </NavLink>
        )}
      />
    </SidebarMenuItem>
  );
}
