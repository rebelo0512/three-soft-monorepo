import { BaseDto } from '.';

export type OmitBaseDto<T extends BaseDto> = Omit<T, 'created_at' | 'updated_at'>;
