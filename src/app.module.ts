import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

@Module({
	imports: [AuthModule, UserModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
