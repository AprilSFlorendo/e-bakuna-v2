import type { PageServerLoad } from './$types';
import type { Actions } from './$types.js';
import { superValidate } from 'sveltekit-superforms';
import { schema as infoSchema } from './info/schema';
import { schema as credentialsSchema } from './credentials/schema';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { user } from '$lib/server/db/schema';
import { Argon2id } from 'oslo/password';
import { generateId } from 'lucia';

export const load: PageServerLoad = async () => {
	return {
		infoForm: await superValidate(zod(infoSchema)),
		credentialsForm: await superValidate(zod(credentialsSchema))
	};
};

export const actions: Actions = {
	next: async (event) => {
		const form = await superValidate(event, zod(infoSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const existingUser = await db.query.user.findFirst({
			where: eq(user.email, form.data.email)
		});

		if (existingUser) {
			return fail(400, { form, message: 'User already exists' });
		}

		return { form };
	},
	register: async (event) => {
		const form = await superValidate(event, zod(credentialsSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const firstName = event.url.searchParams.get('firstName') ?? '';
		const lastName = event.url.searchParams.get('lastName') ?? '';
		const email = event.url.searchParams.get('email') ?? '';

		if (firstName === '' || lastName === '' || email === '') {
			return fail(400, { form, message: 'Missing required basic info' });
		}

		const existingUser = await db.query.user.findFirst({
			where: eq(user.username, form.data.username)
		});

		if (existingUser) {
			return fail(400, { form, message: 'Username already exists' });
		}

		const hashedPassword = await new Argon2id().hash(form.data.password);
		const id = generateId(40);

		await db.insert(user).values({
			id,
			provider: 'manual',
			providerId: '',
			firstName: firstName,
			lastName: lastName,
			isAdmin: false,
			email: email,
			username: form.data.username,
			hashPassword: hashedPassword,
			avatarUrl: ''
		});

		return redirect(302, '/login');
	}
};
