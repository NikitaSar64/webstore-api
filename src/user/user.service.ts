import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { hash } from 'argon2';

@Injectable()
export class UserService {
	constructor(private readonly databaseService: DatabaseService) {}

	async getProfile(id: number) {
		const user = await this.databaseService.user.findUnique({
			where: {
				id,
			},
		});

		if (!user) {
			throw new NotFoundException('User not found');
		}

		return user;
	}

	async updateProfile(id: number, dto: UpdateUserDto) {
		const user = await this.getProfile(id);

		if (dto.password) {
			user.password = await hash(dto.password);
		}

		if (dto.email) {
			const isUniqueEmail = await this.databaseService.user.findUnique({
				where: {
					email: dto.email,
				},
			});

			if (!isUniqueEmail) {
				user.email = dto.email;
			} else {
				throw new NotFoundException('Email is busy');
			}
		}

		if (dto.name) {
			user.name = dto.name;
		}

		await this.databaseService.user.update({
			where: {
				id,
			},
			data: user,
		});

		return;
	}
}
