import { IUser } from '~/users/models/interfaces/user.interface';
import { TOKEN_OPTIONS } from '~/auth/auth.conf';
import { UserService } from '~/users/services/user.service';
import { Injectable, ForbiddenException, NotFoundException, ConflictException } from '@nestjs/common';
import { SIB_V3_API_KEY } from '~/commons/config/env';
import { TokenService } from '~/auth/services/token.service';
import { LoginDto } from '~/auth/dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { getRndInteger } from '~/commons/utils';
import { ISession } from '~/auth/interface/session.interface';
const SibApiV3Sdk = require('sib-api-v3-sdk');

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService
  ) {
  }


  async signup(user: RegisterDto): Promise<ISession> {
    const found = await this.userService.findOne({ email: user.email });
    if (found) {
      throw new ConflictException("Email déjà utilisé");
    }
    const createdUser: IUser = await this.userService.insertOne(user);
    const connectionToken: string = this.tokenService.sign(
      { sub: createdUser._id },
      TOKEN_OPTIONS.connectionTokenOption,
    );
    createdUser.password = null;
    const session: ISession = { token: connectionToken, user: createdUser };
    return session;
  }

  async signin(credentials: LoginDto): Promise<ISession> {
    const user = await this.userService.findOne(credentials);
    if (!user) {
      throw new NotFoundException('Ce compte n\'existe pas!');
    }
    const connectionToken: string = this.tokenService.sign(
      { sub: user._id },
      TOKEN_OPTIONS.connectionTokenOption,
    );
    user.password = null;
    const session: ISession = { token: connectionToken, user: user };
    return session;
  }

  async sendResetPasswordEmail(email: string): Promise<string> {
    const defaultClient = SibApiV3Sdk.ApiClient.instance
    const apiKey = defaultClient.authentications['api-key']
    const apiInstance = new SibApiV3Sdk.SMTPApi()
    apiKey.apiKey = SIB_V3_API_KEY;
    const code = getRndInteger(1000, 9999);
    const resetToken: string = this.tokenService.sign(
      { sub: { email, code } },
      TOKEN_OPTIONS.connectionTokenOption,
    );
    let sendSmtpEmail = {
      to: [{ email }],
      templateId: 1,
      params: {
        code,
      }
    }
    apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
      console.log('API called successfully. Returned data: ' + data);
    }, function(error) {
      console.error(error);
    });
    return resetToken;
  }
  
}
