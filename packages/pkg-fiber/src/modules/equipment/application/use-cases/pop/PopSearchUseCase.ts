import { BaseUseCase } from '@three-soft/core-backend';
import { PopDto, IPopRepository, PopSearchInputDto } from '../../../domain';

export class PopSearchUseCase extends BaseUseCase<PopSearchInputDto, PopDto[]> {
  constructor(private repository: IPopRepository) {
    super();
  }

  async execute(input: PopSearchInputDto): Promise<PopDto[]> {
    return this.repository.search(input);
  }
}
