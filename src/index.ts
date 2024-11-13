import { serve } from "@hono/node-server";

import app from "./app";
import db from "./db";
import env from "./env";

const port = env.PORT;
// eslint-disable-next-line no-console
console.log(`Server is running on port http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port: env.PORT,
});
