export class TokenError extends Error {
  constructor(error_type: 'expired' | 'missing') {
    const messagesObj = {
      expired: 'Ocorreu algo errado com o token',
      missing: 'Token ausente'
    };

    super(messagesObj[error_type]);
    this.name = TokenError.name;
  }
}
