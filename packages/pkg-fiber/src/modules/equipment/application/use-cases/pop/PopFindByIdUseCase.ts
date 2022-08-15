import { BaseUseCase, EntityNotFoundError } from '@three-soft/core-backend';
import { IPopRepository, PopDto, PopFindByIdInputDto } from '../../../domain';

export class PopFindByIdUseCase extends BaseUseCase<PopFindByIdInputDto, PopDto> {
  constructor(private repository: IPopRepository) {
    super();
  }

  async execute(input: PopFindByIdInputDto): Promise<PopDto> {
    const pop = await this.repository.findById(input.id);

    if (!pop) throw new EntityNotFoundError('Pop', input.id, 'id');

    return pop;
  }
}
