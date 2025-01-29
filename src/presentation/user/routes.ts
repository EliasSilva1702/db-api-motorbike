import { NextFunction, Request, Response } from 'express';
import { JwtAdapter } from '../../config/jwt.adapter';
import { User } from '../../data/postgres/models/user.model';
import { Router } from 'express';
import { UserController } from './controller';
import { UserService } from '../services/user.service';

export class AuthMiddleware {
	static async verifyToken(req: Request, res: Response, next: NextFunction) {
		const authorization = req.header('Authorization');

		if (!authorization) {
			return res
				.status(401)
				.json({ message: 'Provide a token, please login again' });
		}

		if (!authorization.startsWith('Bearer ')) {
			return res
				.status(401)
				.json({ message: 'Invalid token, please login again' });
		}

		const token = authorization.split(' ')[1] || '';

		try {
			const payload = (await JwtAdapter.verifyToken(token)) as { id: string };
			if (!payload)
				return res
					.status(401)
					.json({ message: 'Invalid token, please login again' });

			const user = await User.findOne({ where: { id: payload.id } });
			req.body.sessionUser = user;

			next();
		} catch (error) {
			console.log(error);
			return res.status(500).json({ message: 'Internal server error' });
		}
	}

	static protect = AuthMiddleware.verifyToken;
}

export class UserRouter {
	static get routes(): Router {
		const router = Router();

		const userService = new UserService();
		const controller = new UserController(userService);

		router.post('/login', controller.loginUser);
		router.post('/', controller.createUser);

		router.use(AuthMiddleware.protect);

		router.get('/', controller.findAllUsers);
		router.get('/:id', controller.findOneUser);
		router.patch('/:id', controller.updateUser);
		router.delete('/:id', controller.deleteUser);

		return router;
	}
}
