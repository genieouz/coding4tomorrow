import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";
import { UserService } from "~/users/services/user.service";
import { LoginDto } from "~/auth/dto/login.dto";
import { RegisterDto } from "~/auth/dto/register.dto";
import { AuthService } from "~/auth/services/auth.service";
import { TokenService } from "~/auth/services/token.service";
import { NotFoundException } from "@nestjs/common";
import { UpdatePasswordDto } from "../dto/update-password.dto";
import { ISession } from "~/auth/interface/session.interface";
import { Session } from "~/auth/entities/session.entity";

@Resolver()
export class AuthResolver {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly tokenService: TokenService,
    ) {}

    @Query(returns => Session)
    login(
        @Args({ name: 'loginInput', type: () => LoginDto }) loginInput: LoginDto
    ): Promise<ISession> {
        return this.authService.signin(loginInput);
    }

    @Mutation(returns => Session)
    register(
        @Args({ name: 'registerInput', type: () => RegisterDto }) registerDto: RegisterDto
    ): Promise<ISession> {
        return this.authService.signup(registerDto); 
    }

    @Query(returns => String)
    async resetPassword(
        @Args({ name: 'email', type: () => String }) email: string,
    ): Promise<string> {
        await this.userService.findOneOrFail({ email });
        return this.authService.sendResetPasswordEmail(email);
    }

    @Mutation(returns => Boolean)
    async updatePassword(
        @Args({ name: 'updatePasswordDto', type: () => UpdatePasswordDto }) updatePasswordDto: UpdatePasswordDto,
    ): Promise<boolean> {
        const payload = this.tokenService.verify(updatePasswordDto.resetToken);
        console.log(payload)
        if(!payload || payload.sub.code !== updatePasswordDto.resetCode) {
            throw new NotFoundException('Token expiré');
        } else {
            const user  = await this.userService.findOneOrFail({ email: payload.sub.email });
            await this.userService.updateOneById(user._id, { password: updatePasswordDto.password });
        }
        return true; 
    }

}