import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { schedule } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user!;
	const result = await db.query.request.findMany({
		with: { vaccine: true },
		where: eq(schedule.userId, user.id)
	});

	console.log(result);

	return {
		schedules: result
	};
};
