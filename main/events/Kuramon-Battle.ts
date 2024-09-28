import { RpgEvent, EventData, RpgPlayer, Move, Components} from '@rpgjs/server'

@EventData({
    name: 'Kuramon-Battle', 
    hitbox: {
        width: 32,
        height: 32
    }
})
export default class KuramonBattle extends RpgEvent {
    onInit() {
        this.setGraphic('009_Kuramon');
        this.name = 'Kuramon'
        this.through = true;
        this.throughOtherPlayer = true;
        this.setComponentsTop(Components.text('{name}', {"fill": "#ffffff", "fontSize": 10, "stroke": "#000000"}))
        this.setComponentsBottom([
            /** @ts-ignore */
            Components.hpBar({}, null),
            /** @ts-ignore */
            // Components.text(''),
        ], {width: 32} )
        this.level = 1
        this._class = {
            "id": 18, 
            "name": "Kuramon", 
            "nivel": {
                "name": "Bebe I",
                "atributo": "Neutro",
                "levelMax": 4,
                "levelMin": 1,
                "nivelValue": 1,
                "atributoValue": -2
            }, 
            "graphics": {
                "pernament": ["009_Kuramon-Face"], 
                "animations": [], 
                "baseEquipment": {}
            }, 
            "description": "Digimon criança", 
            "skillsToLearn": [], 
            "statesEfficiency": {}, 
            "elementsEfficiency": []
        }
        this.param =  {"agi": 50, "dex": 48, "int": 36, "str": 57, "nivelValue": 1, "atributoValue": -2}
    }
    async onAction(player: RpgPlayer) {
        player.server.module.emit('server.player.offBattle', [player], true)        
    }
} 