// eslint-disable-next-line object-curly-newline
import { Body, Controller, Get, Headers, Inject, Param, Patch, Post, Put, Query } from '@nestjs/common';
import {
  UserCreateInputDto,
  UserCreateUseCase,
  UserFindAllUseCase,
  UserFindByIdUseCase,
  UserMyInformationUseCase,
  UserSearchInputDto,
  UserSearchUseCase,
  UserUpdateInputDto,
  UserUpdatePasswordInputDto,
  UserUpdatePasswordUseCase,
  UserUpdateUseCase
} from '@three-soft/pkg-configuration';

@Controller('user')
export class UserController {
  constructor(
    @Inject(UserFindAllUseCase.name)
    private userFindAllUseCase: UserFindAllUseCase,
    @Inject(UserSearchUseCase.name)
    private userSearchUseCase: UserSearchUseCase,
    @Inject(UserMyInformationUseCase.name)
    private userMyInformationUseCase: UserMyInformationUseCase,
    @Inject(UserFindByIdUseCase.name)
    private userFindByIdUseCase: UserFindByIdUseCase,
    @Inject(UserCreateUseCase.name)
    private userCreateUseCase: UserCreateUseCase,
    @Inject(UserUpdateUseCase.name)
    private userUpdateUseCase: UserUpdateUseCase,
    @Inject(UserUpdatePasswordUseCase.name)
    private userUpdatePasswordUseCase: UserUpdatePasswordUseCase
  ) {}

  @Get()
  findAll() {
    return this.userFindAllUseCase.execute();
  }

  @Get('/search')
  search(@Query() dto: UserSearchInputDto) {
    return this.userSearchUseCase.execute(dto);
  }

  @Get('/my_information')
  myInformation(@Headers('tokenaccess') token: string) {
    return this.userMyInformationUseCase.execute({ token });
  }

  @Get('/:id')
  findById(@Param('id') id: number) {
    return this.userFindByIdUseCase.execute({ id });
  }

  @Post()
  async create(@Body() dto: UserCreateInputDto) {
    const user = await this.userCreateUseCase.execute(dto);

    return { status: 'sucesso', message: 'Usuário cadastrado com sucesso', user };
  }

  @Put('/:id')
  async update(@Param('id') id: number, @Body() dto: UserUpdateInputDto) {
    const user = await this.userUpdateUseCase.execute({ ...dto, id });

    return {
      status: 'sucesso',
      message: 'Usuário atualizado com sucesso',
      user
    };
  }

  @Patch('/:id/password')
  async updatePassword(@Param('id') id: number, @Body() dto: UserUpdatePasswordInputDto) {
    const user = await this.userUpdatePasswordUseCase.execute({ ...dto, id });

    return {
      status: 'sucesso',
      message: 'Senha atualizada com sucesso',
      user
    };
  }
}
