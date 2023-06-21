import {
	Body,
	Controller,
	Get,
	HttpCode,
	Put,
	Req,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { User } from './decorators/user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('profile')
	@UseGuards(JwtAuthGuard)
	async getProfile(@User('id') id: number) {
		return this.userService.getProfile(id);
	}

	//@UsePipes(new ValidationPipe())
	@Put('profile')
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	async updateProfile(@User('id') id: number, @Body() dto: UpdateUserDto) {
		return this.userService.updateProfile(id, dto);
	}
}
