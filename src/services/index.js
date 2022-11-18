/* Arquivo para a camada de serviço */
/* Utiliza da biblioteca Axios para fazer a comunicação com o back-end */

import axios from 'axios'
import router from '../router'
import AuthService from './auth'
import UsersService from './users'
import { setGlobalLoading } from '../store/global'

// Definicao do objeto com endereco do back-end.
const API_ENVS = {
  // Camada de producao.
  production: '',

  // Camada de desenvolvedor.
  development: '',

  // Camada de aplicacao.
  local: 'http://localhost:3000'
}

// Cria o cliente com o axios passando a baseURL com o API_ENVS.
const httpClient = axios.create({
  // obs: Necessario condicao para definir outras camadas (pesquisar).
  baseURL: API_ENVS[process.env.NODE_ENV] || API_ENVS.local
})

// Intercepta a requisição
// Para verificar a existencia do token toda vez que f
httpClient.interceptors.request.use(config => {
  // Altera o status global para informar que uma requisição está ocorrento.
  setGlobalLoading(true)

  // Obtem o token do navegador.
  const token = window.localStorage.getItem('token')

  // Se existir um token
  if (token) {
    // Anexa cabeçalho de autoriaçao para todas as solicitações.
    config.headers.common.Authorization = `Bearer ${token}`
  }

  // Ao retornar vai verificar em todas as requisições se existe o token.
  // Colocando nas configurações do request.
  return config
})

// Intercepta a resposta para retornar status significativos para a aplicacao.
httpClient.interceptors.response.use((response) => {
  // Caso a response tenha sucesso altera o status global
  // e retorna response.
  setGlobalLoading(false)
  return response
}, (error) => {
  /* Quando a resposta conter erro 0 ou 500
     0 - Para quando a requisicao falhou.
     500 - Para quando o servidor nao consegue especificar qual o erro. */
  const canThrowAnError = error.request.status === 0 ||
    error.request.status === 500

  // caso tenha erro.
  if (canThrowAnError) {
    setGlobalLoading(false)
    // throw - Lança uma excecao definida.
    throw new Error(error.message)
  }

  // Quando o token não for válido vai retornar 401.
  if (error.response.status === 401) {
    // Envia de volta para a tela de login.
    router.push({ name: 'Home' })
  }

  setGlobalLoading(false)
  return error
})

export default {
  // Metodos de servico.
  // Desta forma o codigo fica mais testável.
  // Ele sabe que e um httpClient podendo usar
  // qualquer outro como fetch ou axios.
  auth: AuthService(httpClient),

  // Importando no arquivo e exportando, para ficar
  // disponível no objeto.
  users: UsersService(httpClient)
}
