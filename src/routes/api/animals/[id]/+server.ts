import { lucia } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { animal } from '$lib/server/db/schema';
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

	await db.delete(animal).where(eq(animal.id, params.id));

	return json({ success: true, id: params.id });
}
