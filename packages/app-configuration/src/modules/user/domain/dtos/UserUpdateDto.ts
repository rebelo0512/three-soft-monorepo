export type UserUpdateInputDto = {
  id: number;
  name: string;
  email: string;
  password: string | null;
  status: boolean;
  group: string;
};
