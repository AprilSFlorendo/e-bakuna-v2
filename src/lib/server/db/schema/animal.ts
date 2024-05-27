import { relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { user } from './user';

export const animal = sqliteTable('animals', {
	id: text('id', { length: 100 }).primaryKey(),
	name: text('name', { length: 100 }).notNull(),
	details: text('details', { length: 255 }).notNull(),
	userId: text('user_id', { length: 100 }).notNull()
});

export const animalRelations = relations(animal, ({ one }) => ({
	user: one(user, {
		fields: [animal.userId],
		references: [user.id]
	})
}));
