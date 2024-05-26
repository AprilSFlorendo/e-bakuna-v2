import { defineConfig } from 'drizzle-kit';

const url =
	process.env.TURSO_CONFIG === 'dev' ? process.env.TURSO_LOCAL : process.env.TURSO_CONNECTION_URL;

export default defineConfig({
	schema: './src/lib/server/db/schema',
	out: './migrations',
	driver: 'turso',
	dialect: 'sqlite',
	dbCredentials: {
		url: url!,
		authToken: process.env.TURSO_AUTH_TOKEN
	}
});
