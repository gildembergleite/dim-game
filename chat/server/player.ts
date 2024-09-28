import { RpgPlayer, RpgPlayerHooks, RpgMap, RpgWorld } from '@rpgjs/server'

function sendMessage(obj: { message: string, map: RpgMap, player?: RpgPlayer, type?: string }) {
    const { message, map, player, type } = obj
    let newType: string;
    /** @ts-ignore */
    if (type === 'player'){
        let command: any = null;
        const match = message.match(/@(\w+)/);
        if (match) {
            command = match[1]; // A primeira captura corresponde à palavra após o @
          }
    
        if (command){
            switch (command){
                case 'dm':
                    newType = 'dm';
                    break;
                case 'gamemaster':
                    newType = 'gamemaster';
                    break;
                default:
                    newType = 'player'
            }
        }
    } else {
        newType = 'info'
    }

    const data: any = {
        message,
        date: Date.now(),
        /** @ts-ignore */
        type: newType
    }
    if (player) {
        data.sender = player.id
    }
    RpgWorld.getPlayersOfMap(map.id).forEach(p => {
        p.emit('chat-message', data)
    })
}


export const player: RpgPlayerHooks = {
    onJoinMap(player: RpgPlayer, map: RpgMap) {
        sendMessage({
            message: `${player.name} entrou no mapa..`, 
            map, 
            player,
            type: 'info'
        })
        player.off('chat-message')
        player.on('chat-message', (message) => {
            sendMessage({
                message: `${player.name}: ${message}`, 
                map, 
                player,
                type: 'player'
            })
        })
    },
    onLeaveMap(player: RpgPlayer, map: RpgMap) {
        sendMessage({
            message: `${player.name} saiu do mapa.. `, 
            map, 
            player,
            type: 'info'
        })
    }
}