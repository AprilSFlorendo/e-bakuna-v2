import { lucia } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { vaccine } from '$lib/server/db/schema/vaccine.js';
import { error, json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export async function DELETE({ cookies, params }) {
	const sessionId = cookies.get(lucia.sessionCookieName);

	if (!sessionId) {
		error(401, 'Unauthorized');
	}

	const { user } = await lucia.validateSession(sessionId);
	if (!user) {
		error(401, 'Unauthorized');
	}

	await db.delete(vaccine).where(eq(vaccine.id, params.id));

	return json({ success: true, id: params.id });
}
