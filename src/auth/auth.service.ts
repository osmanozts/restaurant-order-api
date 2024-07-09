import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../typeorm/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { SignInUserDto } from 'src/auth/dto/sign-in-user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './strategies/jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<void> {
    const { email, username, password } = createUserDto;

    const salt = await bcrypt.genSalt(6);
    const hashedPassword = await bcrypt.hash(password, salt.toString());

    const newUser = await this.userRepository.create({
      email,
      username,
      password: hashedPassword,
    });

    try {
      await this.userRepository.save(newUser);
    } catch (error) {
      if (error.code === 23505) {
        throw new ConflictException('username or email already exists!');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(
    signInUserDto: SignInUserDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password: givenPassword } = signInUserDto;

    const user = await this.userRepository.findOneBy({ email });

    const isCorrectPassword = await bcrypt.compare(
      givenPassword,
      user.password,
    );

    const { password, ...destructuredUser } = user;

    if (user && isCorrectPassword) {
      const payload: JwtPayload = { ...destructuredUser };
      const accessToken: string = await this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '15m',
      });
      const refreshToken: string = await this.jwtService.sign(payload, {
        secret: process.env.JWT_RT_SECRET,
        expiresIn: '7d',
      });

      // Save the refresh token in the database (optional)
      user.refreshToken = refreshToken;
      await this.userRepository.save(user);

      return { accessToken, refreshToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async refreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findOne({
      where: { id: userId, refreshToken },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload: JwtPayload = { email: user.email };
    const newAccessToken: string = await this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    });
    const newRefreshToken: string = await this.jwtService.sign(payload, {
      secret: process.env.JWT_RT_SECRET,
      expiresIn: '7d',
    });

    user.refreshToken = newRefreshToken;
    await this.userRepository.save(user);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}
