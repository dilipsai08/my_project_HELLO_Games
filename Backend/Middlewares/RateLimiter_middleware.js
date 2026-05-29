import { rateLimit } from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { createClient } from "redis";
import logger from "../utils/logger.js";

const redis_client = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
    password: process.env.REDIS_PASSWORD || "",
});

redis_client.connect()
    .then(() => logger.info("Redis connected successfully!"))
    .catch((err) => logger.error("Redis failed to connect", err));

const r_Store = new RedisStore({
    sendCommand: (...args) => redis_client.sendCommand(args)
});
export async function ban_check(req, res, next) {
    try {
        const ip = req.ip;
        const is_banned = await redis_client.get(`banned:${ip}`);
        if (is_banned) {
            res.status(403).send("You are banned from accessing this service!");
            return;
        }
    } catch (err) {
        logger.error("Error checking IP ban status in Redis", err);
    }
    next();
}
export const Rate_limiter= rateLimit({
    windowMs:5*60*1000,
    limit:100,
    message:{
        error:"Too many requests from this IP, please try again later",
        status:429,
    },
    store: r_Store,
})
export const  OAuth_rate_limiter= rateLimit({
    windowMs:5*60*1000,
    limit:100,
    message:{
        error:"Too many requests from this IP, please try again later",
        status:429,
    },
    store: r_Store,
})