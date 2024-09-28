import { RpgEvent, EventData, RpgPlayer, Move} from '@rpgjs/server'

@EventData({
    name: 'SHAPE-BATTLE', 
    hitbox: {
        width: 16,
        height: 16
    }
})
export default class ShapeBattle extends RpgEvent {
    onInit() {
        this.setGraphic('move');
    }
    // async onAction(player: RpgPlayer) {
    //     player.server.module.emit('server.player.offMyTurn', [player], true)
        
    // }
} 