import { sign } from 'jsonwebtoken';

type TokenProps = {
  user_id: number;
  group_id: number;
};

export function encodeToken(props: TokenProps) {
  return sign(
    {
      id: props.user_id,
      group_id: props.user_id
    },
    String(process.env.SECRET),
    {
      expiresIn: '1d'
    }
  );
}
