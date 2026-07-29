import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from "@/components/ui/empty"
import { WarningCircle } from "@phosphor-icons/react/dist/ssr"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <WarningCircle className="size-5" />
          </EmptyMedia>
          <EmptyTitle>Page not found</EmptyTitle>
          <EmptyDescription>
            The page you&apos;re looking for doesn&apos;t exist or has been moved.{" "}
            <Link href="/dashboard" className="text-primary underline underline-offset-4 hover:text-primary/80">
              Go to Dashboard
            </Link>
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}
