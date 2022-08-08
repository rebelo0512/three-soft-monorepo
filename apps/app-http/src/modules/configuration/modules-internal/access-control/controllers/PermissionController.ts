import { Body, Controller, Get, Inject, Param, Post, Query } from '@nestjs/common';
import {
  PermissionFindAllByGroupIdUseCase,
  PermissionFindAllSystemsUseCase,
  PermissionFindAllBySubDomainUseCase,
  PermissionFindAllByDomainNameUseCase,
  PermissionFindByDomainNameInputDto,
  PermissionFindAllDomainsBySystemNameUseCase,
  PermissionCreateUseCase,
  PermissionCreateInputDto
} from '@three-soft/pkg-configuration';

@Controller('permission')
export class PermissionController {
  constructor(
    @Inject(PermissionFindAllByGroupIdUseCase.name)
    private permissionFindAllByGroupIdUseCase: PermissionFindAllByGroupIdUseCase,
    @Inject(PermissionFindAllSystemsUseCase.name)
    private permissionFindAllSystemsUseCase: PermissionFindAllSystemsUseCase,
    @Inject(PermissionFindAllBySubDomainUseCase.name)
    private permissionFindAllSubPermissionFindAllBySubDomainUseCase: PermissionFindAllBySubDomainUseCase,
    @Inject(PermissionFindAllByDomainNameUseCase.name)
    private permissionFindAllByDomainNameUseCase: PermissionFindAllByDomainNameUseCase,
    @Inject(PermissionFindAllDomainsBySystemNameUseCase.name)
    private permissionFindAllDomainsBySystemNameUseCase: PermissionFindAllDomainsBySystemNameUseCase,
    @Inject(PermissionCreateUseCase.name)
    private permissionCreatePermissionCreateUseCase: PermissionCreateUseCase
  ) {}

  @Get('/group')
  findAllByGroupId(@Query('group_id') group_id: number) {
    return this.permissionFindAllByGroupIdUseCase.execute({ group_id });
  }

  @Get('/system/all')
  findAllSystem() {
    return this.permissionFindAllSystemsUseCase.execute();
  }

  // @Get('/user')
  // findByUserId() {
  //   return this.permissionFindByUserId.handle(req, res);
  // }

  @Get('/system/domain')
  findAllByDomainName(@Query() dto: PermissionFindByDomainNameInputDto) {
    return this.permissionFindAllByDomainNameUseCase.execute(dto);
  }

  @Get('/system/:system_name')
  findAllBySystemName(@Param('system_name') system_name: string) {
    return this.permissionFindAllDomainsBySystemNameUseCase.execute({ system_name });
  }

  @Get('/system/sub_domain/:sub_dom')
  findAllBySubDomain(@Param('sub_dom') sub_dom: string) {
    return this.permissionFindAllSubPermissionFindAllBySubDomainUseCase.execute({ sub_dom });
  }

  @Post()
  create(@Body() dto: PermissionCreateInputDto) {
    return this.permissionCreatePermissionCreateUseCase.execute(dto);
  }
}
