import z from 'zod';

const createRepairSchema = z.object({
	date: z
		.string({ message: 'date is required' })
		.regex(/^\d{2}-\d{2}-\d{4}$/, {
			message: 'Date must be in format MM-DD-YYYY',
		})
		.refine(
			(date) => {
				const [month, day, year] = date.split('-').map(Number);
				const parsedDate = new Date(year, month - 1, day);
				return (
					parsedDate.getMonth() === month - 1 &&
					parsedDate.getDate() === day &&
					parsedDate.getFullYear() === year
				);
			},
			{
				message: 'Invalid date',
			},
		),
	motorsNumber: z.string().min(5, { message: 'motorsNumber is required' }),
	description: z.string().min(10, { message: 'description is required' }),
	userId: z.string().uuid({ message: 'userId is required' }),
});

export class CreateRepairDTO {
	constructor(
		public date: string,
		public userId: string,
		public motorsNumber: string,
		public description: string,
	) {}

	static create(object: {
		[key: string]: any;
	}): [Record<string, string>?, CreateRepairDTO?] {
		const { date, userId, motorsNumber, description } = object;

		const result = createRepairSchema.safeParse(object);

		if (!result.success) {
			const errorMessages = result.error.errors.reduce((acc: any, err: any) => {
				const field = err.path.join('.');
				acc[field] = err.message;
				return acc;
			}, {} as Record<string, string>);

			return [errorMessages];
		}

		return [
			undefined,
			new CreateRepairDTO(date, userId, motorsNumber, description),
		];
	}
}
