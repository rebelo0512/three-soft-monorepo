import { Body, Controller, Get, Inject, Post, Put, Query } from '@nestjs/common';
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
  create(@Body() dto: GroupCreateInputDto) {
    return this.groupCreateUseCase.execute(dto);
  }

  @Put('/:id')
  update(@Body() dto: GroupUpdateInputDto) {
    return this.groupUpdateUseCase.execute(dto);
  }
}
