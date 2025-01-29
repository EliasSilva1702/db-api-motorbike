import 'reflect-metadata';
import { PostgresDatabase } from './data/postgres/postgres-database';
import { envs } from './config';
import { Server } from './presentation/server';
import { AppRoutes } from './presentation/routes';

async function main() {
	const postgres = new PostgresDatabase({
		username: envs.USERNAME_DATABASE,
		password: envs.PASSWORD_DATABASE,
		host: envs.HOST_DATABASE,
		database: envs.DATABASE,
		port: Number(envs.PORT_DATABASE),
	});

	await postgres.connect();

	const server = new Server({
		port: Number(envs.PORT),
		routes: AppRoutes.routes,
	});

	await server.start();
}

main();
