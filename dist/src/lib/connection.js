import { generateUsers } from "../generate/users.js";
export async function connectionInit() {
    try {
        await generateUsers();
    }
    catch (error) {
        console.error("❌ Failed to connect to database:");
        console.error(error);
        process.exit(1);
    }
}
