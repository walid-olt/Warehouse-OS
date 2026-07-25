import { TooltipProvider } from "@/components/ui/tooltip";

export default function ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <TooltipProvider>{children}</TooltipProvider>
    </>
  );
}
