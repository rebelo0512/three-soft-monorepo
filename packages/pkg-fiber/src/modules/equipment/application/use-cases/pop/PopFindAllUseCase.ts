import { BaseUseCase } from '@three-soft/core-backend';
import { PopDto, IPopRepository } from '../../../domain';

export class PopFindAllUseCase extends BaseUseCase<void, PopDto[]> {
  constructor(private repository: IPopRepository) {
    super();
  }

  async execute(): Promise<PopDto[]> {
    return this.repository.findAll();
  }
}
