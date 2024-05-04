import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signUp')
  private signUp(@Body() createUserDto: CreateUserDto): Promise<void> {
    console.log('createUserDto:', createUserDto);
    return this.authService.createUser(createUserDto);
  }
}
