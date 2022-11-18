<template>
  <router-view/>
</template>
<script>
/* watch - Para verificar em qual path o usuário está */
/* e verificar se neste caminho é necessário autentificação. */
import { watch } from 'vue'

import { useRouter, useRoute } from 'vue-router'

import { setCurrentUser } from './store/user'

/* Importa os arquivos que faz requisição ao servidor. */
import services from './services'

export default {
  name: 'app',

  setup () {
    /* Roteamento para endereços permitidos ao usuário logado. */
    /* Esta parte sempre fica no App.vue */

    /* Ações - Ir para frente, voltar uma página ou ir para um */
    /* determindo endereço. */
    const router = useRouter()

    /* Obter informaçoes da rota como nome da rota em que estou, path. */
    const route = useRoute()

    /* watch - Vai ficar escutando a mudança de rotas */
    /* recebe como parametro uma função como o que deseja escutar */
    /* e quando ocorrer a mudança da rota ele vai disparar a função */
    /* passada como segundo parâmetro. */
    watch(() => route.path, async () => {
      /* Verifica se o uruário precisa estar logado em uma determinada rota. */
      /* Busca o hasAuth de router/index.js */
      if (route.meta.hasAuth) {
        /* Se sim - Obtem o token. */
        const token = window.localStorage.getItem('token')

        /* Mesmo assim, verifica se o token existe. */
        if (!token) {
          /* se não tiver o token, envia devolta para a home. */
          router.push({ name: 'Home' })
          return
        }

        /* Se o token for valido, obtem o usuário logado. */
        /* De mesma forma se o usuário não estiver logado */
        /* Ele cai no interceptors.request de server/index.js */
        const { data } = await services.users.getMe()

        // Seta o usuário no status global (store/index.js).
        setCurrentUser(data)
      }
    })
  }
}
</script>
