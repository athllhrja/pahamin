import { endpoint } from "../http/handler";
import { readJson } from "../http/body";
import { authSchema } from "../schemas";
import { login, logout } from "../services/auth";
import { requireUser } from "../supabase/session";

export const loginHandler = endpoint(async (request, client) => {
  const user = await login(client, authSchema.parse(await readJson(request)));
  return { id: user.id, email: user.email };
});

export const logoutHandler = endpoint(async (_request, client) => {
  await requireUser(client);
  await logout(client);
  return null;
});
