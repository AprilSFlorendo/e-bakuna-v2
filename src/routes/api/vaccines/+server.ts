import { lucia } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { vaccine } from '$lib/server/db/schema/vaccine.js';
import { error, json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export async function GET({ cookies }) {
	const sessionId = cookies.get(lucia.sessionCookieName);

	if (!sessionId) {
		error(401, 'Unauthorized');
	}

	const { user } = await lucia.validateSession(sessionId);
	if (!user) {
		error(401, 'Unauthorized');
	}

	const vaccines = await db.query.vaccine.findMany({
		where: eq(vaccine.userId, user.id)
	});

	return json(vaccines);
}
