import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { user, animal, vaccine } from '.';

export const schedule = sqliteTable('schedules', {
	id: text('id', { length: 100 }).primaryKey(),
	title: text('title', { length: 100 }).notNull(),
	done: integer('done', { mode: 'boolean' }).notNull(),
	userId: text('user_id', { length: 100 }).notNull(),
	animalId: text('animal_id', { length: 100 }).notNull(),
	vaccineId: text('vaccine_id', { length: 100 }).notNull(),
	start: integer('start', { mode: 'timestamp' }).notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	color: text('color', { length: 100 })
});

export const scheduleRelations = relations(schedule, ({ one }) => ({
	user: one(user, {
		fields: [schedule.userId],
		references: [user.id]
	}),
	animal: one(animal, {
		fields: [schedule.animalId],
		references: [animal.id]
	}),
	vaccine: one(vaccine, {
		fields: [schedule.vaccineId],
		references: [vaccine.id]
	})
}));
