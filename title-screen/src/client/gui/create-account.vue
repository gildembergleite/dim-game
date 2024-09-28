<template>
   <rpg-window width="300px" position="bottom-middle">
         <p>Registrar conta</p>
         <form @submit.prevent="createAccount">
             <input type="email" placeholder="Email" v-model="user.email">
             <input type="password" placeholder="Senha (6 caracteres min.)" required minlength="6" v-model="user.password">
             <input type="password" placeholder="Confirme a senha" required v-model="confirmPassword">
             <button class="btn-success login">Criar</button>
             <button class="css-button-3d--grey" type="button" @click="$emit('back')">Voltar</button>
        </form>
  </rpg-window>
</template>

<script>
import axios from 'axios'
axios.defaults.baseURL = 'https://channels.zarc.tech';

const NICKNAME_EXISTS_MSG = 'Já existe uma conta com o e-mail informado.'

export default {
    name: 'rpg-login',
    inject: ['rpgGui'],
    data() {
        return {
           user: {},
           confirmPassword: '',
           nicknameExists: false
        }
    },
    computed: {
        apiUrl() {
            return 'localhost/'
        }
    },
    methods: {
        async createAccount() {
            try {
                if (this.nicknameExists) {
                    throw NICKNAME_EXISTS_MSG
                }
                if (!this.user.password) {
                    throw 'Por favor digite sua senha.'
                }
                if (!this.user.email) {
                    throw 'Por favor digite seu e-mail.'
                }
                if (this.user.password > 6) {
                    throw 'A senha deve ter no mínimo 6 caracteres.'
                }
                if (this.user.password != this.confirmPassword) {
                    throw 'As senhas não estão iguais.'
                }
                const response = await axios.post('/api/users/', this.user);
                this.rpgGui.display('rpg-notification', {
                    message: 'Conta criada com sucesso!',
                    time: 5000,
                    position: 'top',
                    type: 'success'
                })
                this.$emit('back')
            }
            catch (err) {
                if (typeof err == 'string') {
                    this.notificationError(err)
                }
            }
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