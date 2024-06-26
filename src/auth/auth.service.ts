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
import { JwtPayload } from './strategies/jwt-payload.interface';

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

  async signIn(signInUserDto: SignInUserDto): Promise<{ accessToken: string }> {
    const { email, password } = signInUserDto;

    const user = await this.userRepository.findOneBy({ email });

    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (user && isCorrectPassword) {
      const payload: JwtPayload = { email };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}
