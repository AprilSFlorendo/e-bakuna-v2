import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { schema } from '../schema';
import { db } from '$lib/server/db';
import { generateId } from 'lucia';
import { and, eq, sql } from 'drizzle-orm';
import { animal } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		return redirect(302, '/login');
	}
	return {
		form: await superValidate(zod(schema))
	};
};

export const actions = {
	default: async (event) => {
		const user = event.locals.user;
		if (!user) {
			return fail(401);
		}

		const form = await superValidate(event, zod(schema));
		if (!form.valid) {
			return fail(401, { form });
		}

		const existing = await db
			.select()
			.from(animal)
			.where(
				and(
					eq(sql`lower(${animal.name})`, sql`lower(${form.data.name})`),
					eq(animal.userId, user.id)
				)
			)
			.execute();

		if (existing && existing.length > 0) {
			return fail(401, { form, message: 'Animal already exists' });
		}

		await db.insert(animal).values({
			id: generateId(40),
			userId: user.id,
			name: form.data.name,
			details: form.data.details
		});

		return { form };
	}
};
