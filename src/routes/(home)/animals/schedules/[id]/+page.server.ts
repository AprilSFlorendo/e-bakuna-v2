import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { animal, schedule } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const current = await db.query.animal.findFirst({
		where: eq(animal.id, params.id)
	});

	const schedules = await db.query.schedule.findMany({
		with: {
			animal: true,
			vaccine: true
		},
		where: eq(schedule.animalId, params.id)
	});

	return {
		schedules,
		animal: current
	};
};
