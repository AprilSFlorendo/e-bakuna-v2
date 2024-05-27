import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { schema } from '../schema';
import { db } from '$lib/server/db';
import { animal } from '$lib/server/db/schema';
import { and, eq, sql, ne } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals, params }) => {
	const user = locals.user;
	if (!user) {
		return redirect(302, '/login');
	}

	const entity = await db.query.animal.findFirst({
		where: and(eq(animal.id, params.id), eq(animal.userId, user.id))
	});

	if (!entity) {
		return fail(404);
	}

	const form = await superValidate(zod(schema));

	form.data.id = entity.id;
	form.data.name = entity.name;
	form.data.details = entity.details;
	return {
		form
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
			return fail(400, {
				form
			});
		}

		const existing = await db
			.select()
			.from(animal)
			.where(
				and(
					eq(sql`lower(${animal.name})`, sql`lower(${form.data.name})`),
					ne(animal.id, form.data.id),
					eq(animal.userId, user.id)
				)
			)
			.execute();

		if (existing && existing.length > 0) {
			return fail(400, { form, message: 'Vaccine already exists' });
		}

		await db
			.update(animal)
			.set({
				name: form.data.name,
				details: form.data.details
			})
			.where(and(eq(animal.id, form.data.id), eq(animal.userId, user.id)))
			.execute();

		return { form };
	}
};
