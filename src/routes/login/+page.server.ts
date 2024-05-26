import type { PageServerLoad } from './$types.js';
import type { Actions } from './$types.js';
import { superValidate } from 'sveltekit-superforms';
import { schema } from './schema.js';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import { Argon2id } from 'oslo/password';
import { lucia } from '$lib/server/auth.js';
import { db } from '$lib/server/db';
import { or, eq } from 'drizzle-orm';
import { user } from '$lib/server/db/schema/user';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		return redirect(302, '/');
	}
	return {
		form: await superValidate(zod(schema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(schema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const username = form.data.username;
		const password = form.data.password;

		const existingUser = await db.query.user.findFirst({
			where: or(eq(user.username, username), eq(user.email, username))
		});

		if (!existingUser || existingUser.hashPassword === null) {
			return fail(400, {
				form,
				message: 'User not found'
			});
		}

		const validPassword = await new Argon2id().verify(existingUser!.hashPassword!, password);
		if (!validPassword) {
			return fail(400, {
				form,
				message: 'Incorrect password'
			});
		}

		const session = await lucia.createSession(existingUser.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		return redirect(302, '/');
	}
};
