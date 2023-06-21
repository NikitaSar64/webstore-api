import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { AuthFields } from './dto/auth.dto';
import { DatabaseService } from 'src/database/database.service';
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from './dto/refreshToken.dto';

@Injectable()
export class AuthService {
	constructor(
		private readonly databaseService: DatabaseService,
		private readonly jwtService: JwtService,
	) {}

	async register(dto: AuthFields) {
		const oldUser = await this.databaseService.user.findUnique({
			where: {
				email: dto.email,
			},
		});

		if (oldUser) {
			throw new BadRequestException(
				'User with this email is already in the system',
			);
		}

		const newUser = await this.databaseService.user.create({
			data: {
				email: dto.email,
				password: await hash(dto.password),
			},
		});

		const tokens = await this.issueTokenPair(newUser.id);

		return {
			newUser,
			...tokens,
		};
	}

	async login(dto: AuthFields) {
		const user = await this.validateUser(dto);
		const tokens = await this.issueTokenPair(user.id);

		return {
			user,
			...tokens,
		};
	}

	async getNewTokens({ refreshToken }: RefreshTokenDto) {
		if (!refreshToken) {
			throw new UnauthorizedException('Please sign in!');
		}

		const result = await this.jwtService.verifyAsync(refreshToken);

		if (!result) {
			throw new UnauthorizedException('Invalid token or expired');
		}

		const user = await this.databaseService.user.findUnique({
			where: {
				id: result._id,
			},
		});

		const tokens = await this.issueTokenPair(user.id);

		return {
			user,
			...tokens,
		};
	}

	async validateUser(dto: AuthFields) {
		const user = await this.databaseService.user.findUnique({
			where: {
				email: dto.email,
			},
		});

		if (!user) {
			throw new UnauthorizedException('User not found');
		}

		const isValidPassword = await verify(user.password, dto.password);

		if (!isValidPassword) {
			throw new UnauthorizedException('Invalid password');
		}

		return user;
	}

	async issueTokenPair(userId: number) {
		const data = { _id: userId };

		const refreshToken = await this.jwtService.signAsync(data, {
			expiresIn: '10d',
		});

		const accessToken = await this.jwtService.signAsync(data, {
			expiresIn: '60s',
		});

		return { refreshToken, accessToken };
	}
}
