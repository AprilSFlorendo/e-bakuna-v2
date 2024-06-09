import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { schedule } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user!;
	const result = await db.query.schedule.findMany({
		with: { animal: true, vaccine: true },
		where: eq(schedule.userId, user.id)
	});

	return {
		schedules: result
	};
};
