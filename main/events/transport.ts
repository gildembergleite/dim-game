import { RpgEvent, EventData, RpgPlayer, Move} from '@rpgjs/server'

@EventData({
    name: 'EV-7', 
    hitbox: {
        width: 16,
        height: 16
    }
})
export default class Transport extends RpgEvent {
    onInit() {
        this.setGraphic('female');
    }
    async onAction(player: RpgPlayer) {
        player.exp += 1000
    }
} 