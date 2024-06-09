import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { schema } from '../schema';
import { db } from '$lib/server/db';
import { vaccine } from '$lib/server/db/schema/vaccine';
import { and, eq, sql, ne } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals, params }) => {
	const user = locals.user;
	if (!user) {
		return redirect(302, '/login');
	}

	const entity = await db.query.vaccine.findFirst({
		where: and(eq(vaccine.id, params.id), eq(vaccine.userId, user.id))
	});

	if (!entity) {
		return fail(404);
	}

	const form = await superValidate(zod(schema));

	form.data.id = entity.id;
	form.data.name = entity.name;
	form.data.description = entity.description;
	form.data.doses = entity.doses;
	form.data.interval = entity.interval;
	form.data.available = entity.available ?? 0;
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
			.from(vaccine)
			.where(
				and(
					eq(sql`lower(${vaccine.name})`, sql`lower(${form.data.name})`),
					ne(vaccine.id, form.data.id),
					eq(vaccine.userId, user.id)
				)
			)
			.execute();

		if (existing && existing.length > 0) {
			return fail(400, { form, message: 'Vaccine already exists' });
		}

		await db
			.update(vaccine)
			.set({
				name: form.data.name,
				description: form.data.description,
				doses: form.data.doses,
				interval: form.data.interval,
				available: form.data.available
			})
			.where(and(eq(vaccine.id, form.data.id), eq(vaccine.userId, user.id)))
			.execute();

		return { form };
	}
};
