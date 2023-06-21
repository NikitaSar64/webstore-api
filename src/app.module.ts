import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { FileModule } from './file/file.module';

@Module({
	imports: [AuthModule, UserModule, FileModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
