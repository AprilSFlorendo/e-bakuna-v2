import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { user, vaccine } from '.';

export const request = sqliteTable('requests', {
	id: text('id', { length: 100 }).primaryKey(),
	ticketNumber: integer('ticket_number').notNull(),
	date: integer('created_at', { mode: 'timestamp' }).notNull(),
	vaccineId: text('vaccine_id', { length: 100 })
		.notNull()
		.references(() => vaccine.id),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	shots: integer('shots').notNull(),
	status: text('status', {
		enum: ['on-hold', 'pending', 'approved', 'completed', 'cancelled']
	}).notNull(),
	userId: text('user_id', { length: 100 })
		.notNull()
		.references(() => user.id)
});

export const requestRelations = relations(request, ({ one }) => ({
	user: one(user, {
		fields: [request.userId],
		references: [user.id]
	}),
	vaccine: one(vaccine, {
		fields: [request.vaccineId],
		references: [vaccine.id]
	})
}));
