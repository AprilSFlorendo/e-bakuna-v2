import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { schema } from './schema';
import { db } from '$lib/server/db';
import { generateId } from 'lucia';
import { vaccine } from '$lib/server/db/schema/vaccine';

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
		console.log(event);
		const form = await superValidate(event, zod(schema));
		if (!form.valid) {
			return {
				status: 400,
				body: {
					form
				}
			};
		}

		await db.insert(vaccine).values({
			id: generateId(40),
			name: form.data.name,
			description: form.data.description,
			doses: form.data.doses,
			interval: form.data.interval
		});

		return {
			status: 200,
			body: {
				form
			}
		};
	}
};
