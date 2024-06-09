import { db } from '$lib/server/db';
import { request } from '$lib/server/db/schema/request';
import { ne } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const requests = await db.query.request.findMany({
		with: { vaccine: true },
		where: ne(request.status, 'completed')
	});

	return { requests };
};
