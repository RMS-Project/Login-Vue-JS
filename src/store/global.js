// Saber quando ocorreu um loading na aplicação.
// Será disparado toda vez que ocorrer um request
// em services/index.js

import { reactive } from 'vue'

const state = reactive({
  isLoading: false
})

export default state

export function setGlobalLoading (status) {
  state.isLoading = status
}
