import { db } from '$lib/server/db';
import { schedule } from '$lib/server/db/schema';
import { vaccine } from '$lib/server/db/schema/vaccine.js';
import { error, json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export async function DELETE({ params }) {
	const inUsed = await db.query.schedule.findFirst({ where: eq(schedule.vaccineId, params.id) });
	if (inUsed) {
		error(400, 'Cannot delete a vaccine that is in use');
	}

	await db.delete(vaccine).where(eq(vaccine.id, params.id));

	return json({ success: true, id: params.id });
}
