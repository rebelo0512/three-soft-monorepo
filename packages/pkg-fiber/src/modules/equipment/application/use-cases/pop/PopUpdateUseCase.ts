import { BaseUseCase, EntityNotFoundError, validateSchema } from '@three-soft/core-backend';
import { PopUpdateValidationSchema } from '../../validators';
import { PopDto, PopUpdateInputDto, IPopRepository } from '../../../domain';

export class PopUpdateUseCase extends BaseUseCase<PopUpdateInputDto, PopDto> {
  constructor(private repository: IPopRepository) {
    super();
  }

  async execute(input: PopUpdateInputDto): Promise<PopDto> {
    const dto = await validateSchema<PopUpdateInputDto>(PopUpdateValidationSchema, input);

    const pop = await this.getPop(dto);

    return this.repository.update({
      ...dto,
      id: pop.pop_id
    });
  }

  private async getPop(dto: PopUpdateInputDto) {
    const pop = await this.repository.findById(dto.id);

    if (!pop) throw new EntityNotFoundError('Pop', dto.id, 'id');

    return pop;
  }
}
