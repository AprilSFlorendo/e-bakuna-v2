import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';
import { vaccine } from '$lib/server/db/schema';

export const load: PageServerLoad = async () => {
	const vaccines = await db.select().from(vaccine).orderBy(vaccine.name).execute();

	return {
		vaccines
	};
};
