import { db } from "./server/db";

await db.user.create({
  data: {
    email: "test@test.com",
    firstName: "Test",
    lastName: "User",
  },
});
