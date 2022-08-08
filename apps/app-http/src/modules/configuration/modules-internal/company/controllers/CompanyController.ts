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
  create(@Body() dto: CompanyCreateInputDto) {
    return this.companyCreateUseCase.execute(dto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: CompanyUpdateInputDto) {
    return this.companyUpdateUseCase.execute({ ...dto, id });
  }
}
