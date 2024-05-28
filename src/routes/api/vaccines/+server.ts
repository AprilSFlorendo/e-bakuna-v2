import { db } from '$lib/server/db';
import { vaccine } from '$lib/server/db/schema/vaccine.js';
import { json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export async function GET({ locals }) {
	const user = locals.user!;

	const vaccines = await db.query.vaccine.findMany({
		where: eq(vaccine.userId, user.id)
	});

	return json(vaccines);
}
