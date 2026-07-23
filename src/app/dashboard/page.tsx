import { WarehouseIcon } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — Distrible",
  description: "Manage your warehouse operations.",
};

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-border">
        <nav className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-6 lg:px-8">
          <WarehouseIcon className="size-6 text-accent" weight="fill" />
          <span className="font-serif text-lg font-bold">Distrible</span>
        </nav>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-6 py-20 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-accent/10">
            <WarehouseIcon className="size-8 text-accent" weight="fill" />
          </div>
          <h1 className="font-serif text-3xl font-bold">Dashboard</h1>
          <p className="mt-2 max-w-md text-muted-foreground">
            Your warehouse command center. Inventory tracking, order management,
            and analytics — coming soon.
          </p>
        </div>
      </main>
    </div>
  );
}
