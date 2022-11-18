
import { reactive } from 'vue'

const userInitialState = {
  currentUser: {}
}

// Torna o state reativo.
let state = reactive(userInitialState)

export default state

export function resetUserStore () {
  state = reactive(userInitialState)
}

/* Limpa o usuário atual. */
export function cleanCurrentUser () {
  state.currentUser = {}
}

/* Altera o valor do usuário atual. */
export function setCurrentUser (user) {
  state.currentUser = user
}

/* Altera o valor da ApiKey */
export function setApiKey (apiKey) {
  // Obtem o objeto que contem o usuario atual e sua chave da API.
  // ..state - Cria um usuário baseado no usuário atual logado,
  // incluindo o apikey.
  const currentUser = { ...state.currentUser, apiKey }

  /* Altera o valor do state. */
  state.currentUser = currentUser
}
