import { NextFunction, Request, Response } from 'express';
import { Role, Status, User } from '../../data/postgres/models/user.model';
import { JwtAdapter } from '../../config/jwt.adapter';

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

			const user = await User.findOne({
				where: { id: payload.id, status: Status.AVAILABLE },
			});
			req.body.sessionUser = user;

			next();
		} catch (error) {
			console.log(error);
			return res.status(500).json({ message: 'Internal server error' });
		}
	}

	static protect = AuthMiddleware.verifyToken;

	static restrictTo = (roles: Role[]) => {
		return (req: Request, res: Response, next: NextFunction) => {
			if (!roles.includes(req.body.sessionUser.role)) {
				return res.status(401).json({ message: 'You are not authorized' });
			}
			next();
		};
	};
}
