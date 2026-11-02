type ErroDeAutenticacao = {
  message?: string;
  code?: string;
  status?: number;
  name?: string;
};

export function getErrorMessage(error: unknown): string {
  const e = (error ?? {}) as ErroDeAutenticacao;
  const message = (e.message ?? '').toLowerCase();

  if (
    e.name === 'AuthRetryableFetchError' ||
    message.includes('network') ||
    message.includes('failed to fetch')
  ) {
    return 'Sem conexão com o servidor. Verifique sua internet e tente novamente.';
  }

  if (typeof e.status === 'number' && e.status >= 500) {
    return 'O servidor está indisponível no momento. Tente novamente em instantes.';
  }

  if (e.code === 'invalid_credentials' || message.includes('invalid login credentials')) {
    return 'E-mail ou senha incorretos.';
  }

  if (e.code === 'user_already_exists' || message.includes('already registered')) {
    return 'Este e-mail já está cadastrado.';
  }

  if (e.code === 'weak_password') {
    return 'A senha é muito fraca. Use pelo menos 6 caracteres.';
  }

  if (e.code === 'email_address_invalid' || e.code === 'validation_failed') {
    return 'Dados inválidos. Confira o e-mail e a senha informados.';
  }

  if (e.code === 'over_request_rate_limit' || e.code === 'over_email_send_rate_limit') {
    return 'Muitas tentativas seguidas. Aguarde um pouco e tente de novo.';
  }

  return 'Algo deu errado. Tente novamente.';
}