import { db } from '$lib/server/db';
import { schedule } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

export async function PUT({ request, locals }) {
	const body = await request.json();
	const user = locals.user!;
	await db
		.update(schedule)
		.set({ done: body.done })
		.where(and(eq(schedule.id, body.id), eq(schedule.userId, user.id)))
		.execute();

	return json(body);
}
