import { z } from 'zod';

export const schema = z.object({
	name: z.string().min(1, { message: 'Name is required' }),
	description: z.string().min(1, { message: 'Description is required' }),
	doses: z.coerce
		.number({ message: 'Invalid value' })
		.int({ message: 'Invalid value' })
		.min(1, { message: 'Doses is required' }),
	interval: z.coerce
		.number({ message: 'Invalid value' })
		.int({ message: 'Invalid value' })
		.min(1, { message: 'Interval is required' })
});

export type Schema = typeof schema;
