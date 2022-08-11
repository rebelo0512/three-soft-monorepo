import { Body, Controller, Get, Inject, Param, Post, Put, Query } from '@nestjs/common';
import {
  GroupCreateInputDto,
  GroupCreateUseCase,
  GroupFindAllUseCase,
  GroupSearchInputDto,
  GroupSearchUseCase,
  GroupUpdateInputDto,
  GroupUpdateUseCase
} from '@three-soft/pkg-configuration';

@Controller('group')
export class GroupController {
  constructor(
    @Inject(GroupFindAllUseCase.name)
    private groupFindAllUseCase: GroupFindAllUseCase,
    @Inject(GroupSearchUseCase.name)
    private groupSearchUseCase: GroupSearchUseCase,
    @Inject(GroupCreateUseCase.name)
    private groupCreateUseCase: GroupCreateUseCase,
    @Inject(GroupUpdateUseCase.name)
    private groupUpdateUseCase: GroupUpdateUseCase
  ) {}

  @Get()
  findAll() {
    return this.groupFindAllUseCase.execute();
  }

  @Get('/search')
  search(@Query() query: GroupSearchInputDto) {
    return this.groupSearchUseCase.execute(query);
  }

  @Post()
  async create(@Body() dto: GroupCreateInputDto) {
    const group = await this.groupCreateUseCase.execute(dto);

    return {
      status: 'sucesso',
      message: 'Grupo cadastrado com sucesso',
      group
    };
  }

  @Put('/:id')
  async update(@Param('id') id: number, @Body() dto: GroupUpdateInputDto) {
    const group = await this.groupUpdateUseCase.execute({ ...dto, id });

    return {
      status: 'sucesso',
      message: 'Grupo atualizado com sucesso',
      group
    };
  }
}
