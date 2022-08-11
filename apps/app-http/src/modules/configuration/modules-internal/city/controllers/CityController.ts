import { Body, Controller, Get, Inject, Param, Post, Put } from '@nestjs/common';
import {
  CityCreateInputDto,
  CityCreateUseCase,
  CityFindAllUseCase,
  CityFindByIdUseCase,
  CityUpdateInputDto,
  CityUpdateUseCase
} from '@three-soft/pkg-configuration';

@Controller('city')
export class CityController {
  /* c8 ignore start */
  constructor(
    @Inject(CityFindAllUseCase.name)
    private cityFindAllUseCase: CityFindAllUseCase,
    @Inject(CityFindByIdUseCase.name)
    private cityFindByIdUseCase: CityFindByIdUseCase,
    @Inject(CityCreateUseCase.name)
    private cityCreateUseCase: CityCreateUseCase,
    @Inject(CityUpdateUseCase.name)
    private cityUpdateUseCase: CityUpdateUseCase
  ) {}
  /* c8 ignore stop */

  @Get()
  findAll() {
    return this.cityFindAllUseCase.execute();
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.cityFindByIdUseCase.execute({ id });
  }

  @Post()
  async create(@Body() dto: CityCreateInputDto) {
    const city = await this.cityCreateUseCase.execute(dto);

    return {
      status: 'sucesso',
      message: 'Cidade cadastrada com sucesso',
      city
    };
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: CityUpdateInputDto) {
    const city = await this.cityUpdateUseCase.execute({ ...dto, id });

    return {
      status: 'sucesso',
      message: 'Cidade atualizada com sucesso',
      city
    };
  }
}
