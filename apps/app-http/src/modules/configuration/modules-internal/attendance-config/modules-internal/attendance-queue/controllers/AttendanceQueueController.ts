// eslint-disable-next-line object-curly-newline
import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query } from '@nestjs/common';
import {
  AttendanceQueueCreateInputDto,
  AttendanceQueueCreateUseCase,
  AttendanceQueueDeleteUseCase,
  AttendanceQueueFindByIdUseCase,
  AttendanceQueueSearchUseCase,
  AttendanceQueueUpdateInputDto,
  AttendanceQueueUpdateUseCase
} from '@three-soft/pkg-configuration';

@Controller('queue')
export class AttendanceQueueController {
  constructor(
    @Inject(AttendanceQueueSearchUseCase.name) private attendanceQueueSearchUseCase: AttendanceQueueSearchUseCase,
    @Inject(AttendanceQueueFindByIdUseCase.name) private attendanceQueueFindByIdUseCase: AttendanceQueueFindByIdUseCase,
    @Inject(AttendanceQueueCreateUseCase.name) private attendanceQueueCreateUseCase: AttendanceQueueCreateUseCase,
    @Inject(AttendanceQueueUpdateUseCase.name) private attendanceQueueUpdateUseCase: AttendanceQueueUpdateUseCase,
    @Inject(AttendanceQueueDeleteUseCase.name) private attendanceQueueDeleteUseCase: AttendanceQueueDeleteUseCase
  ) {}

  @Get('/search')
  search(@Query('name') name: string | null) {
    return this.attendanceQueueSearchUseCase.execute({ name });
  }

  @Get('/:id')
  findById(@Param('id') id: number) {
    return this.attendanceQueueFindByIdUseCase.execute({ id });
  }

  @Post()
  async create(@Body() dto: AttendanceQueueCreateInputDto) {
    const queue = await this.attendanceQueueCreateUseCase.execute(dto);

    return {
      status: 'sucesso',
      message: 'Fila cadastrada com sucesso',
      queue
    };
  }

  @Put('/:id')
  async update(@Param('id') id: number, @Body() dto: AttendanceQueueUpdateInputDto) {
    const queue = await this.attendanceQueueUpdateUseCase.execute({ ...dto, id });

    return {
      status: 'sucesso',
      message: 'Fila atualizada com sucesso',
      queue
    };
  }

  @Delete('/:id')
  async delete(@Param('id') id: number) {
    const queue = await this.attendanceQueueDeleteUseCase.execute({ id });

    return {
      status: 'sucesso',
      message: 'Fila excluída com sucesso',
      queue
    };
  }
}
