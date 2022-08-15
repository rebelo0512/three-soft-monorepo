import { Body, Controller, Delete, Get, Inject, Param, Post, Put } from '@nestjs/common';
import {
  AttendanceHourFindAllUseCase,
  AttendanceHourFindByIdUseCase,
  AttendanceHourCreateUseCase,
  AttendanceHourUpdateUseCase,
  AttendanceHourDeleteUseCase,
  AttendanceHourCreateInputDto,
  AttendanceHourUpdateInputDto
} from '@three-soft/pkg-configuration';

@Controller()
export class AttendanceHourController {
  constructor(
    @Inject(AttendanceHourFindAllUseCase.name) private attendanceHourFindAllUseCase: AttendanceHourFindAllUseCase,
    @Inject(AttendanceHourFindByIdUseCase.name) private attendanceHourFindByIdUseCase: AttendanceHourFindByIdUseCase,
    @Inject(AttendanceHourCreateUseCase.name) private attendanceHourCreateUseCase: AttendanceHourCreateUseCase,
    @Inject(AttendanceHourUpdateUseCase.name) private attendanceHourUpdateUseCase: AttendanceHourUpdateUseCase,
    @Inject(AttendanceHourDeleteUseCase.name) private attendanceHourDeleteUseCase: AttendanceHourDeleteUseCase
  ) {}

  @Get()
  findAll() {
    return this.attendanceHourFindAllUseCase.execute();
  }

  @Get('/:id')
  findById(@Param('id') id: number) {
    return this.attendanceHourFindByIdUseCase.execute({ id });
  }

  @Post()
  async create(@Body() dto: AttendanceHourCreateInputDto) {
    const att_hour = await this.attendanceHourCreateUseCase.execute(dto);

    return {
      status: 'sucesso',
      message: 'Horário de Atendimento Cadastrado com sucesso',
      att_hour
    };
  }

  @Put('/:id')
  async update(@Param('id') id: number, @Body() dto: AttendanceHourUpdateInputDto) {
    const att_hour = await this.attendanceHourUpdateUseCase.execute({ ...dto, id });

    return {
      status: 'sucesso',
      message: 'Horário de Atendimento atualizada com sucesso',
      att_hour
    };
  }

  @Delete('/:id')
  async delete(@Param('id') id: number) {
    const att_hour = await this.attendanceHourDeleteUseCase.execute({ id });

    return {
      status: 'sucesso',
      message: 'Regra excluída com sucesso',
      att_hour
    };
  }
}
