import { createTaskHandler, listTasksHandler } from "../../../../backend/controllers/tasks";
import { createRouteClient } from "@/lib/supabase/route";

export async function GET(request: Request) {
  return listTasksHandler(request, createRouteClient);
}

export async function POST(request: Request) {
  return createTaskHandler(request, createRouteClient);
}
