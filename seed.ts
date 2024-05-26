import 'dotenv/config';
import { Argon2id } from 'oslo/password';
import * as schema from './src/lib/server/db/schema';
import { db } from './src/lib/server/db';
import { generateId } from 'lucia';

const seed = async () => {
	const hashedPassword = await new Argon2id().hash('admin');
	const id = generateId(40);

	const user = schema.user;
	await db.insert(user).values({
		id,
		provider: 'manual',
		providerId: '',
		firstName: 'Admin',
		lastName: 'User',
		isAdmin: true,
		email: '',
		username: 'admin',
		hashPassword: hashedPassword,
		avatarUrl: ''
	});
};

seed();
