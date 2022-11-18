// Consentra os modulos do status global.
// Os importando e exportando para uso.

/* Permite que os objetos importados possam apenas ler o estado */
/* não podendo altera-lo diretamente. */
import { readonly } from 'vue'

// Modulo apenas para leitura
import UserModule from './user'

// Saber quando ocorreu um loading na aplicação.
import GlobalModule from './global'

// readonly - Impede que as importações de store
// permitam realizar alterações diretas no objeto User.
// Para isso utiliza-se os métodos declarados nele.
export default readonly({
  User: UserModule,
  Global: GlobalModule
})

// Para utilizar, use o hook/userStore.js
