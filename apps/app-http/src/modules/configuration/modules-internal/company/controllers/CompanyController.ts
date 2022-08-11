import { Body, Controller, Get, Inject, Param, Post, Put } from '@nestjs/common';
import {
  CompanyCreateInputDto,
  CompanyCreateUseCase,
  CompanyFindAllUseCase,
  CompanyFindByIdUseCase,
  CompanyUpdateInputDto,
  CompanyUpdateUseCase
} from '@three-soft/pkg-configuration';

@Controller('company')
export class CompanyController {
  /* c8 ignore start */
  constructor(
    @Inject(CompanyFindAllUseCase.name)
    private companyFindAllUseCase: CompanyFindAllUseCase,
    @Inject(CompanyFindByIdUseCase.name)
    private companyFindByIdUseCase: CompanyFindByIdUseCase,
    @Inject(CompanyCreateUseCase.name)
    private companyCreateUseCase: CompanyCreateUseCase,
    @Inject(CompanyUpdateUseCase.name)
    private companyUpdateUseCase: CompanyUpdateUseCase
  ) {}
  /* c8 ignore stop */

  @Get()
  findAll() {
    return this.companyFindAllUseCase.execute();
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.companyFindByIdUseCase.execute({ id });
  }

  @Post()
  async create(@Body() dto: CompanyCreateInputDto) {
    const company = await this.companyCreateUseCase.execute(dto);

    return {
      status: 'sucesso',
      message: 'Empresa cadastrada com sucesso',
      company
    };
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: CompanyUpdateInputDto) {
    const company = await this.companyUpdateUseCase.execute({ ...dto, id });

    return {
      status: 'sucesso',
      message: 'Empresa atualizada com sucesso',
      company
    };
  }
}
