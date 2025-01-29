import { genSaltSync, hashSync, compareSync } from 'bcrypt';

export const bcryptAdapter = {
	encrypt: async (text: string) => {
		const salt = genSaltSync(10);
		return hashSync(text, salt);
	},
	compare: async (text: string, hash: string) => {
		return compareSync(text, hash);
	},
};
