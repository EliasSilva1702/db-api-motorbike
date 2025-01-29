import { Request, Response } from 'express';
import { CustomError } from '../../domain';
import { UserService } from '../services/user.service';
import { CreateUserDTO } from '../../domain/dtos/users/create-user.dto';
import { UpdateUserDTO } from '../../domain/dtos/users/update-user.dto';
import { protectAccountOwner } from '../../config/validate-owner';

export class UserController {
	constructor(private readonly userService: UserService) {}

	private handleError = (error: unknown, res: Response) => {
		if (error instanceof CustomError) {
			return res.status(error.statusCode).json({ message: error.message });
		}

		console.error(error);
		return res.status(500).json({ message: 'Something went very wrong! 💥' });
	};

	findAllUsers = async (req: Request, res: Response) => {
		try {
			const data = await this.userService.findAll();
			return res.status(200).json(data);
		} catch (error) {
			this.handleError(error, res);
		}
	};

	findOneUser = async (req: Request, res: Response) => {
		const { id } = req.params;

		try {
			const data = await this.userService.findOne(id);
			return res.status(200).json(data);
		} catch (error) {
			this.handleError(error, res);
		}
	};

	createUser = async (req: Request, res: Response) => {
		const [error, createUserDto] = CreateUserDTO.create(req.body);

		if (error) {
			return res.status(422).json({ message: error });
		}

		try {
			const data = await this.userService.create(createUserDto!);
			return res.status(201).json(data);
		} catch (error) {
			this.handleError(error, res);
		}
	};

	updateUser = async (req: Request, res: Response) => {
		const { id } = req.params;
		const sessionUserId = req.body.sessionUser.id;

		if (!protectAccountOwner(id, sessionUserId)) {
			return res
				.status(401)
				.json({ message: 'You are not the owner of this account' });
		}

		const [error, updateUserDto] = UpdateUserDTO.create(req.body);

		if (error) {
			return res.status(422).json({ message: error });
		}

		try {
			const data = await this.userService.update(id, updateUserDto!);
			return res.status(200).json(data);
		} catch (error) {
			this.handleError(error, res);
		}
	};

	deleteUser = async (req: Request, res: Response) => {
		const { id } = req.params;
		const sessionUserId = req.body.sessionUser.id;

		if (!protectAccountOwner(id, sessionUserId)) {
			return res
				.status(401)
				.json({ message: 'You are not the owner of this account' });
		}

		try {
			await this.userService.delete(id);
			return res.status(204).send();
		} catch (error) {
			this.handleError(error, res);
		}
	};

	loginUser = (req: Request, res: Response) => {
		const { email, password } = req.body;

		this.userService
			.login(email, password)
			.then((data) => res.status(200).json(data))
			.catch((error: any) => this.handleError(error, res));
	};
}
