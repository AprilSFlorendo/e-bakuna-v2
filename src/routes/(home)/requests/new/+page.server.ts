import { redirect } from '@sveltejs/kit';
import { eq, desc, gte } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { schema } from '../schema';
import { db } from '$lib/server/db';
import { generateId } from 'lucia';
import { request } from '$lib/server/db/schema/request';
import { CalendarDate } from '@internationalized/date';
import { vaccine } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		return redirect(302, '/login');
	}

	const vaccines = await db.query.vaccine.findMany({
		orderBy: (vaccine, { asc }) => asc(vaccine.name),
		where: gte(vaccine.available, 1)
	});

	const form = await superValidate(zod(schema));
	const date = new Date();
	form.data.date = new CalendarDate(
		date.getFullYear(),
		date.getMonth() + 1,
		date.getDate()
	).toString();
	form.data.shots = 1;

	return {
		form,
		vaccines: vaccines.map((vaccine) => ({
			value: vaccine.id,
			label: `${vaccine.available?.toLocaleString()} - ${vaccine.name}`
		}))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const user = event.locals.user;
		if (!user) {
			return fail(401);
		}

		const form = await superValidate(event, zod(schema));
		if (!form.valid) {
			return fail(401, { form });
		}

		const latest = await db
			.select()
			.from(request)
			.where(eq(request.userId, user!.id))
			.orderBy(desc(request.ticketNumber))
			.limit(1);

		let number = 1;
		if (latest.length > 0) {
			number = latest[0].ticketNumber + 1;
		}
		await db.insert(request).values({
			id: generateId(40),
			ticketNumber: number,
			date: new Date(form.data.date),
			vaccineId: form.data.vaccine,
			createdAt: new Date(Date.now()),
			shots: form.data.shots,
			status: 'pending',
			userId: user.id
		});

		return {
			form
		};
	}
};
