import { Body, Controller, Get, Inject, Param, Post, Put, Query } from '@nestjs/common';
import {
  PopCreateInputDto,
  PopCreateUseCase,
  PopFindAllUseCase,
  PopFindByIdUseCase,
  PopSearchInputDto,
  PopSearchUseCase,
  PopUpdateInputDto,
  PopUpdateUseCase
} from '@three-soft/pkg-fiber';

@Controller()
export class PopController {
  constructor(
    @Inject(PopFindAllUseCase.name) private popFindAllUseCase: PopFindAllUseCase,
    @Inject(PopSearchUseCase.name) private popSearchUseCase: PopSearchUseCase,
    @Inject(PopFindByIdUseCase.name) private popFindByIdUseCase: PopFindByIdUseCase,
    @Inject(PopCreateUseCase.name) private popCreateUseCase: PopCreateUseCase,
    @Inject(PopUpdateUseCase.name) private popUpdateUseCase: PopUpdateUseCase
  ) {}

  @Get()
  findAll() {
    return this.popFindAllUseCase.execute();
  }

  @Get('/search')
  search(@Query() dto: PopSearchInputDto) {
    return this.popSearchUseCase.execute(dto);
  }

  @Get('/:id')
  findById(@Param('id') id: number) {
    return this.popFindByIdUseCase.execute({ id });
  }

  @Post()
  async create(@Body() dto: PopCreateInputDto) {
    const pop = await this.popCreateUseCase.execute(dto);

    return {
      status: 'sucesso',
      message: 'Pop cadastrado com sucesso',
      pop
    };
  }

  @Put('/:id')
  async update(@Param('id') id: number, @Body() dto: PopUpdateInputDto) {
    const pop = await this.popUpdateUseCase.execute({ ...dto, id });

    return {
      status: 'sucesso',
      message: 'Pop atualizado com sucesso',
      pop
    };
  }
}
