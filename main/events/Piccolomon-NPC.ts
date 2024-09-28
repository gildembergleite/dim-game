import { RpgEvent, EventData, RpgPlayer, Components} from '@rpgjs/server'

@EventData({
    name: 'Picklemon', 
    hitbox: {
        width: 32,
        height: 32
    }
})
export default class Piccolomon extends RpgEvent {
    onInit() {
        this.setGraphic('202_Piccolomon');
        this.name = 'Picklemon'
        this.setComponentsTop(Components.text('{name}', {"fill": "#ffffff", "fontSize": 10, "stroke": "#000000"}))
    }
    async onAction(player: RpgPlayer) {
        await player.showText('Agora está restaurado.', {
            talkWith: this
        })
        player.allRecovery()
    }
} 