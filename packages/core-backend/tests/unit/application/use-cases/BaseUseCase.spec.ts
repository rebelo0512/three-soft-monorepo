import { BaseDto, BaseUseCase } from '../../../../src';

interface StubDto extends BaseDto {
  id: number;
  name: string;
}

interface StubInputDto {
  id: number;
  name: string;
}

class StubUseCase extends BaseUseCase<StubInputDto, StubDto> {
  execute(input: StubInputDto): StubDto {
    return {
      id: input.id,
      name: input.name,
      created_at: new Date(),
      updated_at: new Date()
    };
  }
}

describe('BaseUseCase Unit Tests', () => {
  it('should test execute method', () => {
    const stubUseCase = new StubUseCase();

    const stubDto = stubUseCase.execute({ id: 1, name: 'Name 01' });

    expect(stubDto).toEqual({ id: 1, name: 'Name 01', created_at: expect.any(Date), updated_at: expect.any(Date) });
  });
});
