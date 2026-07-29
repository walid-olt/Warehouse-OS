"use client";
import { NavUser } from "@/components/nav-user";
import { Logo } from "@/components/logo";
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
import { CaretDoubleUpIcon } from "@phosphor-icons/react/dist/ssr";
import { ThemeSwitcher } from "./theme-switcher";
import { DashboardNav } from "@/features/dashboard/components/Dashboard-nav";

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
              <SidebarMenuButton size="lg" className="pointer-events-none">
                <CaretDoubleUpIcon
                  size={32}
                  fill="#25D366"
                  className="rotate-45 m-auto"
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
