<template>
   <rpg-window width="300px" position="bottom-middle" v-if="page == 'login'">
         <p>Login</p>
         <form @submit.prevent="login">
             <input type="text" placeholder="Email" v-model="user.email">
             <input type="password" placeholder="Senha" v-model="user.password">
             <button class="btn-success login">Entrar</button>
             <button class="css-button-3d--grey" type="button" @click="page = 'create'">Registrar</button>
        </form>
  </rpg-window>
  <CreateAccount v-else @back="page = 'login'" />
</template>

<script>
import CreateAccount from './create-account.vue'

export default {
    name: 'rpg-login',
    inject: ['rpgGui', 'rpgGuiInteraction', 'rpgSocket'],
    components: {
        CreateAccount
    },
    data() {
        return {
           page: 'login',
           user: {}
        }
    },
    mounted() {
        const socket = this.rpgSocket()
        socket.on('login-fail', ({ message }) => {
            let msg = ''
            switch (message) {
                case 'LOGIN_FAIL':
                    msg = 'Credenciais erradas, tente novamente!'
                    break;
                 case 'PLAYER_IN_GAME':
                    msg = 'Esse usuário já está em jogo.'
                    break;
                default:
                    msg = 'Aconteceu um erro inesperado.'
            }
            this.notificationError(msg)
        })
    },
    methods: {
        login() {
            if (!this.user.email) {
                return this.notificationError('Por favor digite o seu e-mail.')
            }
            if (!this.user.password) {
                return this.notificationError('Por favor digite sua senha.')
            }
            this.rpgGuiInteraction('rpg-title-screen', 'login', this.user)
        },
        notificationError(msg) {
            this.rpgGui.display('rpg-notification', {
                message: msg,
                time: 5000,
                position: 'top',
                type: 'error'
            })
        }
    }
}
</script>

<style scoped lang="scss">
form {
    text-align: center;
}

p {
    margin-bottom: 25px;
}

button {
    margin-top: 20px;
}

input {
    width: 85%;
}

.login {
    margin-right: 10px;
}
</style>