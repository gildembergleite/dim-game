<template>
  <div class="chat" >
      <ul ref="chat-list" :style="{ 'list-style': 'none', color: 'white', 'font-family': $window-font-family, 'font-size': '12px', padding: '0', 'margin-left': '10px', overflow: 'auto', 'height': chatMaxHeight + 'px' }">
          <li v-for="(msg, i) in messages" :key="i" :class="`type-${msg.type}`" >{{ msg.message }}</li>
      </ul>
      <div class="input-container">
        <input class="custom-input"
            type="text" 
            placeholder="Digite sua mensagem..."
            v-model="text" 
            @keypress.enter="send">
            <button @click="adjustMaxHeight">{{ this.textButton }}</button>
      </div>
  </div>
</template>

<script>
const GUI_CONTROLS = 'rpg-controls'

export default {
    name: 'rpg-chat',
    inject: ['rpgEngine', 'rpgGui', 'rpgSocket', 'KeyboardControls', ],
    data() {
        return {
            text: '',
            messages: [],
            chatMaxHeight: 60,
            textButton: "▲",
            allowedTypes: ['info', '', 'dm', 'gamemaster', 'battle'],
        }
    },
    mounted() {
        const socket = this.rpgSocket()
        socket.on('chat-message', ({ message, type }) => {
            this.messages.push({
                message,
                type
            })
            const el = this.$refs['chat-list']
            el.scrollTop = el.scrollHeight + 100
        })
    },
    methods: {
        chatGeral(){
            this.allowedTypes = ['info', 'player', 'dm', 'gamemaster', 'battle']
        },
        chatBatalha(){
            this.allowedTypes = ['info', 'gamemaster', 'battle']
        },
        chatPrivado(){
            this.allowedTypes = ['info', 'gamemaster', 'dm']
        },
        stopMove() {
            if (this.KeyboardControls.getControl(Input.Enter)){
                this.rpgEngine.controls.stop = true
            }
        },
        startMove() {
             if (this.rpgGui.exists(GUI_CONTROLS)) this.rpgGui.display(GUI_CONTROLS)
            this.rpgEngine.controls.stop = false
        },
        send() {
            if (!this.text) return
            const socket = this.rpgSocket()
            socket.emit('chat-message', this.text)
            this.text = ''
        },
        adjustMaxHeight() {
         // Modifique o valor da variável chatMaxHeight aqui conforme necessário
            if (this.chatMaxHeight === 60) {
                this.chatMaxHeight = 180; // Por exemplo, ajuste para 200px
                textButton: "▼"
            } else {
                this.chatMaxHeight = 60;
                textButton: "▲"
            }
        }
    }
}
</script>

<style scoped lang="scss">
.chat {
    position: absolute;
    z-index: 101;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 70;
}

.chat input {
    padding: 5px;
    width: 300px;
}

.chat ul {
    list-style: none;
    color: white;
    font-family: $window-font-family;
    font-size: 12px;
    padding: 0;
    margin-left: 10px;
    overflow: auto;
}

.chat li.type-info {
    color: #59da25;
}

.chat li.type-gamemaster {
    color: #FF0000;
}

.chat li.type-dm {
    color: #FAED27;
}

.chat li.type-battle {
    color: #FAED27;
}

.input-container {
  display: flex;
  align-items: center;
}

.input-container input {
  flex: 1;
}

.input-container button {
  position: absolute;
  right: 2px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: inherit;
  color: inherit;
  opacity: 0.3
}

.button-geral {
  position: absolute;
  color: white; 
  font-size: 10px;
  right: 270px;
  bottom: 114px;
  background: none;
  border: none;
}

.button-batalha {
  position: absolute;
  color: white;
  font-size: 10px;
  right: 222px;
  bottom: 114px;
  background: none;
  border: none;

}

.button-privado {
  position: absolute;
  color: white;
  font-size: 10px;
  right: 174px;
  bottom: 114px;
  background: none;
  border: none;
}

</style>