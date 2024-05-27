import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';
import { animal } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;
	if (!user) {
		return {
			animals: []
		};
	}

	const animals = await db
		.select()
		.from(animal)
		.where(eq(animal.userId, user.id))
		.orderBy(animal.name)
		.execute();

	return {
		animals
	};
};
