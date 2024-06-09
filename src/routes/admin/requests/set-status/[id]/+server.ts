import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { request as req } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';

export const PATCH: RequestHandler = async ({ request, params }) => {
	const { status } = await request.json();

	console.log('status', params.id, status);

	await db.update(req).set({ status }).where(eq(req.id, params.id));

	return json({
		id: params.id,
		status
	});
};
