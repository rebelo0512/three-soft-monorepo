import { Body, Controller, Get, Inject, Param, Post, Query } from '@nestjs/common';
import {
  PermissionFindAllByGroupIdUseCase,
  PermissionFindAllSystemsUseCase,
  PermissionFindAllBySubDomainUseCase,
  PermissionFindAllByDomainNameUseCase,
  PermissionFindByDomainNameInputDto,
  PermissionFindAllDomainsBySystemNameUseCase,
  PermissionCreateUseCase,
  PermissionCreateInputDto,
  PermissionFindAllByUserIdUseCase
} from '@three-soft/pkg-configuration';

@Controller('permission')
export class PermissionController {
  constructor(
    @Inject(PermissionFindAllByGroupIdUseCase.name)
    private permissionFindAllByGroupIdUseCase: PermissionFindAllByGroupIdUseCase,
    @Inject(PermissionFindAllByUserIdUseCase.name)
    private permissionFindAllByUserIdUseCase: PermissionFindAllByUserIdUseCase,
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

  @Get('/user')
  findAllByUserId(@Query('id_user') id_user: number) {
    return this.permissionFindAllByUserIdUseCase.execute({ user_id: id_user });
  }

  @Get('/system/all')
  findAllSystems() {
    return this.permissionFindAllSystemsUseCase.execute();
  }

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
  async create(@Body() dto: PermissionCreateInputDto) {
    const permission = await this.permissionCreatePermissionCreateUseCase.execute(dto);

    return {
      status: 'sucesso',
      message: 'Permissão cadastrada com sucesso',
      permission
    };
  }
}
