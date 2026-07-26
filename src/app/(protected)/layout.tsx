import { auth } from "@/auth";
import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Separator } from "@base-ui/react";
import { Link } from "lucide-react";
import { SessionProvider } from "next-auth/react";
import { redirect } from "next/navigation";

export default async  function ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()
  if(!session) {
    redirect("/login", "replace")
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
          </div>
        </header>
          {children}
          </SidebarInset>
          </SidebarProvider>
    </TooltipProvider>

    </SessionProvider>
  );
}




