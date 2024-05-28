import { lucia } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { schedule } from '$lib/server/db/schema';
import { error, json } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

export async function PUT({ request, cookies, locals }) {
	const sessionId = cookies.get(lucia.sessionCookieName);

	if (!sessionId) {
		error(401, 'Unauthorized');
	}

	const { user } = await lucia.validateSession(sessionId);
	if (!user) {
		error(401, 'Unauthorized');
	}
	const body = await request.json();

	console.log('locals', locals.user);

	await db
		.update(schedule)
		.set({ done: body.done })
		.where(and(eq(schedule.id, body.id), eq(schedule.userId, user.id)))
		.execute();

	return json(body);
}
