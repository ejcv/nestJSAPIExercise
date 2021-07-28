import { Controller, Body, Post, ValidationPipe } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/aut-credentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) {}

    @Post('/signup')
    signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.authService.signUp(authCredentialsDto);
    }

    @Post('/signin')
    signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise< {accessToken: string} > {
        return this.authService.signIn(authCredentialsDto);
    }
}
