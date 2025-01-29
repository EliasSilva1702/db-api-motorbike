import dotenv from 'dotenv';
dotenv.config();

import { get } from 'env-var';

export const envs = {
	PORT: get('PORT').required().asPortNumber(),
	PASSWORD_DATABASE: get('PASSWORD_DATABASE').required().asString(),
	USERNAME_DATABASE: get('USERNAME_DATABASE').required().asString(),
	DATABASE: get('DATABASE').required().asString(),
	PORT_DATABASE: get('PORT_DATABASE').required().asPortNumber(),
	HOST_DATABASE: get('HOST_DATABASE').required().asString(),
	JWT_SECRET: get('JWT_SECRET').required().asString(),
	JWT_EXPIRES_IN: get('JWT_EXPIRES_IN').required().asString(),
};
