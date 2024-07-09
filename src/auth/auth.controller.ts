import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { SignInUserDto } from './dto/sign-in-user.dto';
import { JwtPayload } from './strategies/jwt-payload';
import { RtStrategy } from './strategies/rt.strategy';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signUp')
  private signUp(@Body() createUserDto: CreateUserDto): Promise<void> {
    return this.authService.createUser(createUserDto);
  }

  @Post('/signIn')
  private signIn(
    @Body() signInUserDto: SignInUserDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.signIn(signInUserDto);
  }

  @Post('/refresh')
  @UseGuards(RtStrategy)
  async refreshTokens(@Req() req: Request, @Res() res: Response) {
    const user = req.user as JwtPayload;
    const refreshToken = req.cookies['refreshToken'];

    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.refreshToken(user.email, refreshToken);

    res.cookie('refreshToken', newRefreshToken, { httpOnly: true });
    return res.json({ accessToken });
  }
}
