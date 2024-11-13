import { getConnInfo } from "@hono/node-server/conninfo";
import * as HttpStatusCodes from "stoker/http-status-codes";
const RATE_LIMIT = 5;
const RATE_LIMIT_PERIOD = 60 * 1000;
const rateLimitStore = new Map();
export function rateLimitter() {
    return async (c, next) => {
        const info = getConnInfo(c);
        const ip = info.remote.address;
        const now = Date.now();
        const requestInfo = rateLimitStore.get(ip) || { count: 0, lastRequest: now };
        // Reset the request count if the time window has passed
        if (now - requestInfo.lastRequest > RATE_LIMIT_PERIOD) {
            requestInfo.count = 0;
            requestInfo.lastRequest = now;
        }
        // Update request count
        requestInfo.count += 1;
        requestInfo.lastRequest = now;
        // Store updated request info
        rateLimitStore.set(ip, requestInfo);
        // Check if the IP has exceeded the rate limit
        if (requestInfo.count > RATE_LIMIT) {
            return c.json({
                message: "Rate limit exceeded. Try again later.",
            }, HttpStatusCodes.TOO_MANY_REQUESTS);
        }
        await next();
    };
}
