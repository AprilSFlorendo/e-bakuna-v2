import { lucia } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { animal, schedule } from '$lib/server/db/schema';
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
	console.log(body);

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
