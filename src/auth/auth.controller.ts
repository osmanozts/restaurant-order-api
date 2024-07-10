import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { SignInUserDto } from './dto/sign-in-user.dto';
import { JwtPayloadWithRt } from './strategies/jwt-payload-with-rt';
import { RtStrategy } from './strategies/rt.strategy';

interface CustomRequest extends Request {
  refreshToken: string; // Definiere refreshToken als Eigenschaft des Request-Objekts
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signUp')
  async signUp(@Body() createUserDto: CreateUserDto): Promise<void> {
    await this.authService.createUser(createUserDto);
  }

  @Post('/signIn')
  async signIn(
    @Body() signInUserDto: SignInUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const { accessToken, refreshToken } =
      await this.authService.signIn(signInUserDto);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.json({ accessToken, refreshToken });
  }

  @Post('/refresh')
  @UseGuards(RtStrategy)
  async refreshTokens(
    @Req() req: CustomRequest, // Verwende das angepasste Request-Interface
    @Body() user: JwtPayloadWithRt,
    @Res() res: Response,
  ) {
    if (!user || !user.email) {
      throw new UnauthorizedException('Invalid token payload');
    }

    const refreshToken = req.cookies.refreshToken;

    try {
      const { accessToken, refreshToken: newRefreshToken } =
        await this.authService.refreshToken(user.email, refreshToken);

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      return res.json({ accessToken });
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Invalid refresh token', error);
    }
  }
}
