import { db } from '$lib/server/db';
import { ne } from 'drizzle-orm';
import { request } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const result = await db.query.request.findMany({
		with: { vaccine: true },
		where: ne(request.status, 'completed')
	});

	return {
		schedules: result
	};
};
