import { z } from 'zod';

export const schema = z
	.object({
		username: z.string().min(1, { message: 'Username is required' }),
		password: z.string().min(1, { message: 'Password is required' }),
		confirmPassword: z.string().min(1, { message: 'Please confirm password' })
	})
	.superRefine(({ password, confirmPassword }, ctx) => {
		if (confirmPassword !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'The passwords did not match',
				path: ['confirmPassword']
			});
		}
	});

export type Schema = typeof schema;
