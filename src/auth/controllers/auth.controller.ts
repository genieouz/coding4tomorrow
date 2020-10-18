import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from '~/auth/services/auth.service';
import { LoginDto } from '~/auth/dto/login.dto';
import { RegisterDto } from '~/auth/dto/register.dto';
import { ISession } from '../interface/session.interface';
import { Session } from '~/auth/entities/session.entity';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    signup(@Body() user: RegisterDto): Promise<Session> {
        return this.authService.signup(user);
    }

    @Post('signin')
    signin(@Body() credentials: LoginDto): Promise<Session> {
        return this.authService.signin(credentials);
    }
}
