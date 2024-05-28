import { db } from '$lib/server/db';
import { vaccine } from '$lib/server/db/schema/vaccine.js';
import { json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export async function DELETE({ params }) {
	await db.delete(vaccine).where(eq(vaccine.id, params.id));

	return json({ success: true, id: params.id });
}
