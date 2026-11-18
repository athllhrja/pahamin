import { logoutHandler } from "../../../../../backend/controllers/auth";
import { createRouteClient } from "@/lib/supabase/route";

export async function POST(request: Request) {
  return logoutHandler(request, createRouteClient);
}
