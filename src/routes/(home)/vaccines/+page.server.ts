import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';
import { vaccine } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;
	if (!user) {
		return {
			vaccines: []
		};
	}

	const vaccines = await db
		.select()
		.from(vaccine)
		.where(eq(vaccine.userId, user.id))
		.orderBy(vaccine.name)
		.execute();

	return {
		vaccines
	};
};
