export type GroupUpdateInputDto = {
  id: number;
  permissions: number[];
  system: string;
  domain: string;
  sub_domain: string | null;
};
