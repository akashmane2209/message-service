import { apiReference } from "@scalar/hono-api-reference";
export default function configureOpenAPI(app) {
    app.doc("/doc", {
        openapi: "3.0.0",
        info: {
            version: "0.0.1",
            title: "Tasks API",
        },
    });
    app.get("/reference", apiReference({
        theme: "kepler",
        layout: "modern",
        defaultHttpClient: {
            targetKey: "javascript",
            clientKey: "fetch",
        },
        spec: {
            url: "/doc",
        },
    }));
}
