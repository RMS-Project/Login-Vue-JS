<template>
  <main>
    <div id="parallelogram"></div>

    <section>
      <h1>Login</h1>
      <!-- Login do back-end - igor@igor.me -->
      <!-- Senha 1234 -->
      <!-- @submit.prevent - Chama a função handleSubmit sem recarregar a página. -->
      <form autocomplete="off" @submit.prevent="handleSubmit">
        <div class="container">

          <!-- border-red - Condição que adiciona uma classe no elemento. -->
          <input
            :required="true"
            type="email"
            name="email"
            id="email-field"
            v-model.lazy="state.email.value"
            :class="{'border-red': !!state.email.errorMessage}"
          >

          <label>E-mail</label>

          <!-- Condição - Se a mensagem existir, apresente-a -->
          <span v-if="!!state.email.errorMessage">
            {{ state.email.errorMessage }}
          </span>
        </div>

        <div class="container">
          <!-- v-model.lazy - Atribuir depois de perder o foco. -->
          <input
            :required="true"
            type="password"
            name="password"
            id="password-field"
            v-model.lazy="state.password.value"
            :class="{'border-red': !!state.password.errorMessage}"
          >

          <label>Senha</label>

          <!-- Condição - Se a mensagem existir, apresente-a -->
          <span v-if="!!state.password.errorMessage">
            {{ state.password.errorMessage }}
          </span>
        </div>

        <div id="submit">
          <button
            id="submit-button"
            :disabled="state.isLoading"
            type="submit"
            :class="{
              'opacity-50': state.isLoading
            }" >
            Entrar
          </button>
        </div>
      </form>

      <footer>
        <a href="#">Não consegue entrar ?</a>
        <a href="#">Criar conta</a>
      </footer>
    </section>
  </main>
</template>

<script>
/* watch - Para verificar em qual path o usuário está */
/* e verificar se neste caminho é necessário autentificação. */
import { reactive } from 'vue'

/* Biblioteca de validação de formulário. */
import { useField } from 'vee-validate'

/* Biblioteca de mensagens pop-up. */
import { useToast } from 'vue-toastification'

/* Funções de validação */
import { validateEmptyAndLength3, validateEmptyAndEmail } from '../utils/validators'

/* Importa os arquivos que faz requisição ao servidor. */
import services from '../services'

import { useRouter } from 'vue-router'

export default {
  name: 'Home',

  setup () {
    const router = useRouter()
    const toast = useToast()

    /* Função do vee-validate. */
    const {
      /* Renomear as variáveis de retorno. */
      value: emailValue,
      errorMessage: emailErrorMessage
    } = useField('email', validateEmptyAndEmail)

    /* Função do vee-validate. */
    const {
      /* Renomear as variáveis de retorno. */
      value: passwordValue,
      errorMessage: passwordErrorMessage
    } = useField('password', validateEmptyAndLength3)

    const state = reactive({
      hasErrors: false,
      isLoading: false,

      email: {
        value: emailValue,
        errorMessage: emailErrorMessage
      },

      password: {
        value: passwordValue,
        errorMessage: passwordErrorMessage
      }

    })

    async function handleSubmit () {
      console.log('opa')
      try {
        // Limpa o objeto de notificações.
        toast.clear()

        // Muda o status do loaging para não ocorrer varias
        // solicitações se o processo demorar e o usuário
        // der muitos clicks no botão de envio.
        state.isLoading = true

        // Chama a camada de autentificação passando os dados do formulário.
        // a camada de serviço chama do arquivo auth.js o método login.
        const { data, errors } = await services.auth.login({
          email: state.email.value,
          password: state.password.value
        })

        // Se o objeto errors for vazio.
        if (!errors) {
          // Registra o token existente e data.
          window.localStorage.setItem('token', data.token)

          // Definir a rota caso o login for valido.
          router.push({ name: 'Application' })
          /* window.location.href = 'https://localhost:8080/feedbacks' */
          state.isLoading = false

          // Caso use um modal para apresentar o login.
          // modal.close()
          return
        }

        if (errors.status === 404) {
          toast.error('E-mail não encontrado')
        }
        if (errors.status === 401) {
          toast.error('E-mail ou senha inválidos')
        }
        if (errors.status === 400) {
          toast.error('Ocorreu um erro ao fazer o login')
        }

        state.isLoading = false
      } catch (error) {
        state.isLoading = false
        state.hasErrors = !!error
        toast.error('Ocorreu um erro ao fazer o login')
      }
    }
    return {
      handleSubmit,
      state
    }
  }
}

</script>

<style lang="sass">

  /* Cor dos elementos que atualmente estão em azul. */
  $elementsColor: #00acd7

  @import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@500&display=swap')

  *
    margin: 0
    padding: 0
    box-sizing: border-box
    font-family: "Ubuntu", sans-serif

  body
    background: #2e2e2e

  main
    display: flex
    align-items: center
    justify-content: center
    min-height: 100vh

  #parallelogram
    background: $elementsColor
    width: 380px
    height: 540px
    max-width: 70vw
    border-radius: 10px
    box-shadow: 5px 5px 15px
    transform: skew(4deg, 4deg)
    position: absolute
    z-index: -1

  section
    background: #fff
    border-radius: 10px
    box-shadow: 5px 5px 15px
    width: 360px
    height: 520px
    padding: 0 20px

  h1
    text-align: center
    font-size: 20pt
    margin: 70px 0

  .container
    display: flex
    flex-wrap: wrap
    position: relative
    padding: 10px 0

    input
      width: 100%
      height: 70px
      border: none
      border-radius: 5px
      background: #ededed
      font-size: 12pt
      outline: none
      padding: 10px
      padding-top: 30px

      &:focus ~ label,
      &:valid ~ label
        left: 10px
        top: -10px
        color: $elementsColor

    .border-red
      border-bottom: 1px solid #ff0000

    label
      text-transform: uppercase
      font-size: 14px
      font-weight: 700
      color: #9d9d9d
      position: absolute
      line-height: 70px
      top: 0px
      left: 10px
      user-select: none
      pointer-events: none
      transition: 0.5s

    span
      position: absolute
      bottom: -5px
      font-size: 10pt
      color: red

  #submit
    display: flex
    justify-content: right

    button
      width: calc(50% - 10px)
      height: 70px
      margin: 10px 0
      background-color: $elementsColor
      color: #fff
      font-size: 20px
      border:none
      border-radius: 10px
      cursor: pointer
      transition: .3s linear
      border: none

      &:hover
        opacity: 0.85

  section footer
    display: flex
    flex-direction: column
    text-align: center
    margin: 10px 0

    a
      color: black
      text-decoration: none
      padding: 5px 0
      transition: 0.3s
      font-size: 11pt

    a:hover
      opacity: 0.8

  @media only screen and (max-width: 550px)
    #parallelogram
      display: none

  @media only screen and (max-width: 370px)
    section
      padding: 0 10px

    button
      width: 100%
</style>
