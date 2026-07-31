"use client";

import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import type { Session } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

function SessionCacheResetter() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const lastUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    const userId = session?.user?.id ?? null;
    if (lastUserIdRef.current === userId) return;
    lastUserIdRef.current = userId;
    queryClient.clear();
  }, [queryClient, session]);

  return null;
}

export function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <SessionCacheResetter />
        {children}
      </SessionProvider>
    </QueryClientProvider>
  );
}
