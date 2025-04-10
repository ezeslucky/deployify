import { relations, sql } from "drizzle-orm";
import {
	boolean,
	integer,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { projects } from "./project";
import { server } from "./server";
import { users_temp } from "./user";

export const account = pgTable("account", {
    id: text("id").primaryKey().$defaultFn(() => nanoid()),
    accountId: text("account_id").notNull().$defaultFn(() => nanoid()),
    providerId: text("provider_id").notNull(),
    userId: text("user_id").notNull().references(() => users_temp.id, {
        onDelete: "cascade"
    }),
    accessToken: text("account_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    
})