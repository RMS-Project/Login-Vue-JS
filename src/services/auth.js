// Lida com a parte de seviços da API

// Obtem e exporta o httpClient
export default httpClient => ({

  // Para o formulário de cadastro.
  register: async ({ name, email, password }) => {
    // O restante da url esta em index -> local: 'http://localhost:3000'.
    // Envia para o endereço via método post os dados do formulário de cadastro.
    const response = await httpClient.post('/auth/register', {
      name,
      email,
      password
    })

    // Lida com erros.
    let errors = null

    // Se response não retornar nada.
    if (!response.data) {
      // Objeto de erroque contém o status de erro e
      // o texto sobre o tipo de erro.
      // estes dados vem na requisição.
      errors = {
        status: response.request.status,
        statusText: response.request.statusText
      }
    }

    return {
      data: response.data,
      errors
    }
  },

  // Para o formulario de login.
  login: async ({ email, password }) => {
    // O restante da url esta em index -> local: 'http://localhost:3000'.
    // Envia para o endereco via metodo post o email e password.
    const response = await httpClient.post('/auth/login', {
      email,
      password
    })

    // Lida com erros.
    let errors = null

    // Se response não retornar nada.
    if (!response.data) {
      errors = {
        status: response.request.status,
        statusText: response.request.statusText
      }
    }

    // Retorna o resultado de response.data e errors.
    // Quem vai utilizar e o submit dos modals.
    return {
      data: response.data,
      errors
    }
  }
})
