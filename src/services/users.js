
export default httpClient => ({
  /* Obtem o usuario logado. */
  getMe: async () => {
    /* Obtem apartir da rota localhost:3000/users/me */
    /* Os dados do usuário autenticado. */
    const response = await httpClient.get('/users/me')

    return {
      /* Retorna os dados do usuário. */
      data: response.data
      // errors: null
      /* Pose-se retornar errors:null não sendo necessário, */
      /* uma vez que se resposne.data for null ele serorna undefined. */
    }
  },
  generateApikey: async () => {
    const response = await httpClient.post('/users/me/apikey')

    return {
      data: response.data
    }
  }
})
