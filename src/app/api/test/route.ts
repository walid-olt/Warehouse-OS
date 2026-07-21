import { connectDB } from "@/lib/mongodb";

export async function GET(): Promise<Response> {
  const db = await connectDB();
  let dbState: string = "disconnected";

  switch (db.connection.readyState) {
    case 0:
      dbState = "disconnected";
      break;
    case 1:
      dbState = "connected";
      break;
    case 2:
      dbState = "connecting";
      break;
    case 3:
      dbState = "disconnecting";
      break;
    case 99:
      dbState = "uninitialized";
      break;
  }
  return new Response(
    JSON.stringify({
      ok: true,
      dbState: dbState,
      message: "Database connection is healthy",
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}
