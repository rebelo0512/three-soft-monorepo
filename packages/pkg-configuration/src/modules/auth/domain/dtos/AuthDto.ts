export type AuthInputDto = {
  email: string;
  password: string;
};

export type AuthOutputDto = {
  token: string;
  user: {
    user_id: number;
    user_name: string;
    queues: Array<{
      queue_name: string;
      queue_tag: string;
    }>;
  };
};
