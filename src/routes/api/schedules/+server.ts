import { lucia } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { animal, schedule, vaccine } from '$lib/server/db/schema';
import { error, json } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { generateId } from 'lucia';

export async function POST({ request, cookies }) {
	const sessionId = cookies.get(lucia.sessionCookieName);

	if (!sessionId) {
		error(401, 'Unauthorized');
	}

	const { user } = await lucia.validateSession(sessionId);
	if (!user) {
		error(401, 'Unauthorized');
	}
	const body = await request.json();

	const current = await db.query.animal
		.findFirst({
			where: and(eq(animal.id, body.animalId), eq(animal.userId, user.id))
		})
		.execute();

	if (!current) {
		error(404, 'Animal not found');
	}

	const entity = {
		id: generateId(40),
		title: body.title,
		userId: user.id,
		animalId: body.animalId,
		vaccineId: body.vaccineId,
		start: new Date(body.date),
		done: false,
		createdAt: new Date(Date.now())
	};
	await db.insert(schedule).values(entity).execute();

	return json(entity);
}

export async function PUT({ request, cookies }) {
	const sessionId = cookies.get(lucia.sessionCookieName);

	if (!sessionId) {
		error(401, 'Unauthorized');
	}

	const { user } = await lucia.validateSession(sessionId);
	if (!user) {
		error(401, 'Unauthorized');
	}
	const body = await request.json();

	const current = await db.query.animal
		.findFirst({
			where: and(eq(animal.id, body.animalId), eq(animal.userId, user.id))
		})
		.execute();

	if (!current) {
		error(404, 'Animal not found');
	}

	const data = await db
		.update(schedule)
		.set({
			title: body.title,
			vaccineId: body.vaccineId,
			start: new Date(body.date)
		})
		.where(and(eq(schedule.id, body.id), eq(schedule.userId, user.id)))
		.returning()
		.execute();

	if (data.length === 0) {
		error(404, 'Schedule not found');
	}

	const result = data[0];
	const vac = await db.query.vaccine
		.findFirst({ where: eq(vaccine.id, data[0].vaccineId) })
		.execute();

	return json({
		...result,
		vaccine: vac
	});
}
