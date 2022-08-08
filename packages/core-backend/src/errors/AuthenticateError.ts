export class AuthenticateError extends Error {
  constructor(error_type: 'prop_wrong' | 'inactive') {
    const messagesObj = {
      prop_wrong: 'Email ou senha incorretos',
      inactive: 'Usuário inativo'
    };

    super(messagesObj[error_type]);
    this.name = AuthenticateError.name;
  }
}
