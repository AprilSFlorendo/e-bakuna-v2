import { db } from '$lib/server/db';
import { animal } from '$lib/server/db/schema';
import { cloudinary, upload } from '$lib/upload/cloudinary';
import { error, json } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

export async function POST({ request, locals, params }) {
	try {
		const id = params.id;
		const file = await request.blob();

		const uploadResult = await upload(file, 'e-bakuna/animals');
		if (uploadResult.error) {
			error(500, uploadResult.error);
		}

		const user = locals.user!;
		const currentAnimal = await db.query.animal.findFirst({
			where: and(eq(animal.id, id), eq(animal.userId, user.id))
		});

		if (!currentAnimal) {
			error(404, 'Animal not found');
		}

		await db
			.update(animal)
			.set({
				imageUrl: uploadResult.secure_url,
				cloudinaryId: uploadResult.public_id
			})
			.where(and(eq(animal.id, id), eq(animal.userId, user.id)))
			.execute();

		if (currentAnimal.cloudinaryId) {
			cloudinary.uploader.destroy(currentAnimal.cloudinaryId, function () {
				console.log('Deleted image', currentAnimal.cloudinaryId);
			});
		}

		return json({
			id,
			imageUrl: uploadResult.secure_url,
			cloudinaryId: uploadResult.public_id
		});
	} catch (error) {
		console.error(error);
		return json({ error: 'An error occurred' });
	}
}
