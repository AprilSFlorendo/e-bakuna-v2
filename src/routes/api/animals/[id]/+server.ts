import { lucia } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { animal } from '$lib/server/db/schema';
import { cloudinary } from '$lib/upload/cloudinary';
import { error, json } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

export async function DELETE({ cookies, params }) {
	const sessionId = cookies.get(lucia.sessionCookieName);

	if (!sessionId) {
		error(401, 'Unauthorized');
	}

	const { user } = await lucia.validateSession(sessionId);
	if (!user) {
		error(401, 'Unauthorized');
	}

	const current = await db.query.animal.findFirst({
		where: and(eq(animal.id, params.id), eq(animal.userId, user.id))
	});

	if (!current) {
		error(404, 'Animal not found');
	}

	await db.delete(animal).where(eq(animal.id, params.id));

	if (current.cloudinaryId) {
		cloudinary.uploader.destroy(current.cloudinaryId, function () {
			console.log('Deleted image', current.cloudinaryId);
		});
	}

	return json({ success: true, id: params.id });
}
