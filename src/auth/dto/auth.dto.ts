import { IsEmail, IsString, MinLength } from 'class-validator';

export class AuthFields {
	@IsEmail()
	email: string;

	name?: string;

	@MinLength(6, {
		message: 'Password can`t be less than 6 characters',
	})
	@IsString()
	password: string;
}
