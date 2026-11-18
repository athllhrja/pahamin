import { endpoint } from "../http/handler";
import { readJson } from "../http/body";
import { taskSchema } from "../schemas";
import { createTask, listTasks } from "../services/tasks";
import { requireUser } from "../supabase/session";

export const listTasksHandler = endpoint(async (_request, client) => listTasks(client));

export const createTaskHandler = endpoint(async (request, client) => {
  await requireUser(client);
  return createTask(client, taskSchema.parse(await readJson(request)));
}, 201);
