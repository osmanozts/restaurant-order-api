import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<void> {
    const { email, username, password } = createUserDto;

    const newUser = await this.userRepository.create({
      email,
      username,
      password,
    });
    try {
      await this.userRepository.save(newUser);
    } catch (error) {
      if (error.code === 23505) {
        throw new ConflictException('username already exists!');
      }
    }
  }
}
