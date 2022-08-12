// eslint-disable-next-line object-curly-newline
import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query } from '@nestjs/common';
import {
  AttendanceTagCreateInputDto,
  AttendanceTagCreateUseCase,
  AttendanceTagDeleteUseCase,
  AttendanceTagFindAllUseCase,
  AttendanceTagFindByIdUseCase,
  AttendanceTagSearchUseCase,
  AttendanceTagUpdateInputDto,
  AttendanceTagUpdateUseCase
} from '@three-soft/pkg-configuration';

@Controller('queue')
export class AttendanceTagController {
  constructor(
    @Inject(AttendanceTagFindAllUseCase.name) private attendanceTagFindAllUseCase: AttendanceTagFindAllUseCase,
    @Inject(AttendanceTagSearchUseCase.name) private attendanceTagSearchUseCase: AttendanceTagSearchUseCase,
    @Inject(AttendanceTagFindByIdUseCase.name) private attendanceTagFindByIdUseCase: AttendanceTagFindByIdUseCase,
    @Inject(AttendanceTagCreateUseCase.name) private attendanceTagCreateUseCase: AttendanceTagCreateUseCase,
    @Inject(AttendanceTagUpdateUseCase.name) private attendanceTagUpdateUseCase: AttendanceTagUpdateUseCase,
    @Inject(AttendanceTagDeleteUseCase.name) private attendanceTagDeleteUseCase: AttendanceTagDeleteUseCase
  ) {}

  @Get()
  findAll() {
    return this.attendanceTagFindAllUseCase.execute();
  }

  @Get('/search')
  search(@Query('name') name: string | null) {
    return this.attendanceTagSearchUseCase.execute({ name });
  }

  @Get('/:id')
  findById(@Param('id') id: number) {
    return this.attendanceTagFindByIdUseCase.execute({ id });
  }

  @Post()
  async create(@Body() dto: AttendanceTagCreateInputDto) {
    const tag = await this.attendanceTagCreateUseCase.execute(dto);

    return {
      status: 'sucesso',
      message: 'Tag cadastrada com sucesso',
      tag
    };
  }

  @Put('/:id')
  async update(@Param('id') id: number, @Body() dto: AttendanceTagUpdateInputDto) {
    const tag = await this.attendanceTagUpdateUseCase.execute({ ...dto, id });

    return {
      status: 'sucesso',
      message: 'Tag atualizada com sucesso',
      tag
    };
  }

  @Delete('/:id')
  async delete(@Param('id') id: number) {
    const tag = await this.attendanceTagDeleteUseCase.execute({ id });

    return {
      status: 'sucesso',
      message: 'Tag excluída com sucesso',
      tag
    };
  }
}
