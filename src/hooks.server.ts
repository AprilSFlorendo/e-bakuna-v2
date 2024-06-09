import { lucia } from '$lib/server/auth';
import { error, redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const path = event.url.pathname;
	if (path.startsWith('/login') || path.startsWith('/logout')) {
		return resolve(event);
	}

	const sessionId = event.cookies.get(lucia.sessionCookieName);
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;

		return redirect(302, '/login');
	}

	const { session, user } = await lucia.validateSession(sessionId);

	if (!user) {
		redirect(302, '/login');
	}

	if (user && user.isAdmin && !event.url.pathname.startsWith('/admin')) {
		redirect(302, '/admin');
	}

	if (user && !user.isAdmin && event.url.pathname.startsWith('/admin')) {
		error(403, 'Sorry, you do not have permission to access this page.');
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
