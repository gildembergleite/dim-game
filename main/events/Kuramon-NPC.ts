import { RpgEvent, EventData, RpgPlayer, Move, EventMode, RpgServerEngine, inject, Components} from '@rpgjs/server'


@EventData({
    name: 'Kuramon', 
    hitbox: {
        width: 16,
        height: 16
    },
    mode: EventMode.Shared
})
export default class KuramonNPC extends RpgEvent {
    onInit() {
        this.setGraphic('009_Kuramon');
        this.name = 'Kuramon'
        this.infiniteMoveRoute([Move.tileRandom()])
        this.setComponentsTop(Components.text('{name}', {"fill": "#e50202", "fontSize": 10, "stroke": "#ffffff"}))        
        this.speed = 2
    }
    onAction(player: RpgPlayer) {
        const server = inject(RpgServerEngine);
        const mapId = 'battle-field'+player.playerId;
        server.sceneMap.createDynamicMap({
            id: mapId,
            file: require('../worlds/maps/battle-field.tmx')
       });
       
        console.log("Encostou no evento")
        player.server.module.emit('server.player.onBattle', [player, mapId, this.playerId], true);
        this.remove()
    }
} 