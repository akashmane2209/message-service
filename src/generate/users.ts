/* eslint-disable no-console */
import { count } from "drizzle-orm";

import db from "@/db";
import { users } from "@/db/schema";
import { hash } from "@/utils/bcrypt";

export async function generateUsers() {
  try {
    const usersData = [
      {
        name: "Alice Johnson",
        email: "alice.johnson@example.com",
        password: "Alice!23@2024",
      },
      {
        name: "Bob Smith",
        email: "bob.smith@example.com",
        password: "BobSecure#789",
      },
      {
        name: "Carol Davis",
        email: "carol.davis@example.com",
        password: "Carol!Password45",
      },
      {
        name: "David Brown",
        email: "david.brown@example.com",
        password: "David@Safe123",
      },
      {
        name: "Emma Wilson",
        email: "emma.wilson@example.com",
        password: "Emma#Secure789",
      },
    ];

    const usersCount = await db.select({ count: count() }).from(users);

    if (usersCount[0].count > 0) {
      console.log("Users already exist");
      return;
    }

    console.log("Generating users");

    for (const user of usersData) {
      const hashedPassword = await hash(user.password as string);
      const newUser = {
        name: user.name,
        email: user.email,
        password: hashedPassword,
      };
      await db.insert(users).values(newUser);
    }
  }
  catch (error) {
    console.error("❌ Failed to generate users:");
    console.error(error);
  }
}
