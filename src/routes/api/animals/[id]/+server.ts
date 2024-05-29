import { db } from '$lib/server/db';
import { animal, schedule } from '$lib/server/db/schema';
import { cloudinary } from '$lib/upload/cloudinary';
import { error, json } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

export async function DELETE({ locals, params }) {
	const user = locals.user!;
	const current = await db.query.animal.findFirst({
		where: and(eq(animal.id, params.id), eq(animal.userId, user.id))
	});

	if (!current) {
		error(404, 'Animal not found');
	}

	const inUsed = await db.query.schedule.findFirst({ where: eq(schedule.animalId, params.id) });
	if (inUsed) {
		error(400, 'Cannot delete an animal that is in use');
	}

	await db.delete(animal).where(eq(animal.id, params.id));

	if (current.cloudinaryId) {
		cloudinary.uploader.destroy(current.cloudinaryId, function () {
			console.log('Deleted image', current.cloudinaryId);
		});
	}

	return json({ success: true, id: params.id });
}
