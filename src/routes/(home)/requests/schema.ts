import { z } from 'zod';

export const schema = z.object({
	id: z.string().default(''),
	date: z
		.string()
		.min(1, { message: 'Proposed Date required' })
		.refine(validateDateString, { message: 'Invalid date' }),
	vaccine: z.string().min(1, { message: 'Vaccine is required' }),
	shots: z.number({ message: 'Invalid value' }).min(1, { message: 'Invalid value' })
});

export type Schema = typeof schema;

function validateDateString(value: string) {
	try {
		const date = new Date(value);

		if (date.getDate() < new Date().getDate()) {
			return false;
		}
		return true;
	} catch (e) {
		return false;
	}
}
