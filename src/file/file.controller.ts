import {
	Controller,
	HttpCode,
	Post,
	Query,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('file')
export class FileController {
	constructor(private readonly fileService: FileService) {}

	@Post()
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(FileInterceptor('image'))
	async uploadFiles(
		@UploadedFile() file: Express.Multer.File,
		@Query('folder') folder?: string,
	) {
		return this.fileService.saveFiles([file], folder);
	}
}
