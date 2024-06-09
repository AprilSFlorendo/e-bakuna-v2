import { db } from '$lib/server/db';
import { request } from '$lib/server/db/schema/request';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user!;

	const requests = await db.query.request.findMany({
		with: { vaccine: true },
		where: eq(request.userId, user.id)
	});

	return { requests };
};
