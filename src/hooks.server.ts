import { lucia } from '$lib/server/auth';
import { error, redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get(lucia.sessionCookieName);
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;

		if (event.url.pathname.includes('/api')) {
			error(401, 'Unauthorized');
		}

		if (event.url.pathname.includes('/login') || event.url.pathname.includes('/register')) {
			return resolve(event);
		}

		return redirect(303, '/login');
	}

	const { session, user } = await lucia.validateSession(sessionId);
	if (event.url.pathname.includes('/api') && !user) {
		error(401, 'Unauthorized');
	}

	if (user?.isAdmin && !event.url.pathname.startsWith('/admin')) {
		return redirect(303, '/admin');
	}

	if (!user?.isAdmin && event.url.pathname.startsWith('/admin')) {
		return error(401, 'Sorry, you are not authorized to view this page.');
	}

	if (session && session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}
	if (!session) {
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}

	event.locals.user = user;
	event.locals.session = session;
	return resolve(event);
};
