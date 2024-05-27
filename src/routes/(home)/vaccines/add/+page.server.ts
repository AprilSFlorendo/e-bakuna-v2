import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { schema } from '../schema';
import { db } from '$lib/server/db';
import { generateId } from 'lucia';
import { vaccine } from '$lib/server/db/schema/vaccine';
import { eq, sql } from 'drizzle-orm';

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
		const form = await superValidate(event, zod(schema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const existing = await db
			.select()
			.from(vaccine)
			.where(eq(sql`lower(${vaccine.name})`, sql`lower(${form.data.name})`))
			.execute();

		if (existing && existing.length > 0) {
			return fail(400, { form, message: 'Vaccine already exists' });
		}

		await db.insert(vaccine).values({
			id: generateId(40),
			name: form.data.name,
			description: form.data.description,
			doses: form.data.doses,
			interval: form.data.interval
		});

		return { form };
	}
};
