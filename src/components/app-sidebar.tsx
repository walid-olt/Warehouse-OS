"use client";
import { CaretDoubleUpIcon } from "@phosphor-icons/react/dist/ssr";
import { Logo } from "@/components/logo";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { DashboardNav } from "@/features/dashboard/components/Dashboard-nav";
import { ThemeSwitcher } from "./theme-switcher";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state, isMobile } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            {state === "expanded" || isMobile ? (
              <SidebarMenuButton
                size="lg"
                render={() => (
                  <div className="flex justify-between items-baseline">
                    <Logo />

                    <ThemeSwitcher />
                  </div>
                )}
              ></SidebarMenuButton>
            ) : (
              <SidebarMenuButton
                size="lg"
                className="pointer-events-none mx-auto"
              >
                <CaretDoubleUpIcon
                  size={48}
                  fill="#25D366"
                  className="rotate-45 m-auto scale-125 dark:invert "
                />
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <DashboardNav />
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
