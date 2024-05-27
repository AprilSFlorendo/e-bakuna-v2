import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { user } from './user';

export const vaccine = sqliteTable('vaccines', {
	id: text('id', { length: 100 }).primaryKey(),
	name: text('name', { length: 100 }).notNull(),
	description: text('description', { length: 255 }).notNull(),
	doses: integer('doses').notNull(),
	interval: integer('interval').notNull(),
	userId: text('user_id', { length: 100 }).notNull()
});

export const vaccineRelations = relations(vaccine, ({ one }) => ({
	user: one(user, {
		fields: [vaccine.userId],
		references: [user.id]
	})
}));
