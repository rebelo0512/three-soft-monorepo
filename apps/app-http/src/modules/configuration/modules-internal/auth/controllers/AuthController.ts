import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AuthInputDto, AuthUseCase } from '@three-soft/pkg-configuration';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthUseCase.name) private authUseCase: AuthUseCase) {}

  @Post()
  auth(@Body() dto: AuthInputDto) {
    return this.authUseCase.execute(dto);
  }
}
