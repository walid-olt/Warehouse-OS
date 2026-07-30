import { redirect } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { AppSidebar } from "@/components/app-sidebar";
import { DynamicBreadcrumb } from "@/components/dynamic-breadcrumb";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default async function ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (!session) {
    redirect("/login", "replace");
  }
  return (
    <SessionProvider session={session}>
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <DynamicBreadcrumb />
              </div>
            </header>
            <div className="px-4">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </SessionProvider>
  );
}
