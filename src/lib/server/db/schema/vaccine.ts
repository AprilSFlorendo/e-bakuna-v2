import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const vaccine = sqliteTable('vaccines', {
	id: text('id', { length: 100 }).primaryKey(),
	name: text('name', { length: 100 }).notNull(),
	description: text('description', { length: 255 }).notNull(),
	doses: integer('doses').notNull(),
	interval: integer('interval').notNull()
});
