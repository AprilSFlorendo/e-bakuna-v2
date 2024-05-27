import { z } from 'zod';

export const schema = z.object({
	id: z.string().default(''),
	name: z.string().min(1, { message: 'Name is required' }),
	details: z.string().min(1, { message: 'Details is required' })
});

export type Schema = typeof schema;
