export type UserRepositoryUpdateInput = {
  id: number;
  name: string;
  email: string;
  password: string | null;
  status: boolean;
  group_id: number;
};
