import {
	BaseEntity,
	Column,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.model';

export enum RepairStatus {
	PENDING = 'PENDING',
	COMPLETED = 'COMPLETED',
	CANCELLED = 'CANCELLED',
}

@Entity()
export class Repair extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column('date', {
		nullable: false,
	})
	date!: Date;

	@Column('varchar', {
		nullable: true,
	})
	motorsNumber!: string;

	@Column('varchar', {
		nullable: false,
	})
	description!: string;

	@Column('enum', {
		enum: RepairStatus,
		default: RepairStatus.PENDING,
	})
	status!: RepairStatus;

	@Column('varchar', {
		nullable: false,
	})
	userId!: string;

	@ManyToOne(() => User, (user) => user.repairs)
	user!: User;
}
