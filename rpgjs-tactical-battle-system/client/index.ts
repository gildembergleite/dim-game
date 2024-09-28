import { RpgClient, RpgModule, RpgSceneMap, RpgSprite, RpgClientEngine, RpgGui, PrebuiltGui } from '@rpgjs/client';
import { PositionXY } from '@rpgjs/types';
import infoPlayer from './gui/info-player.vue'
import battlerPlayer from './gui/battle-player.vue'
import enemyPlayer from './gui/enemy-player.vue'


let _socket: any;
@RpgModule<RpgClient>({
    gui: [
        infoPlayer,
        battlerPlayer,
        enemyPlayer,
    ],
    scenes: {
        map: {
            onMapLoading(scene: RpgSceneMap) {
                scene.viewport?.setZoom(1.4) // https://davidfig.github.io/pixi-viewport/jsdoc/Viewport.html#setZoom
            },
            onAfterLoading(scene: RpgSceneMap) {
                scene.on('click', (position) => {
                    _socket.emit('click', position)
                })
            }
        }
    },
    engine: {
        onStart(){
            // RpgGui.display(PrebuiltGui.Notification, {
            //     message: "Você venceu a batalha! Parabéns.",
            //     time: 5000,
            //     position: 'top',
            // })
            
            // RpgGui.display(PrebuiltGui.Notification, {
            //     message: "Você perdeu a batalha! Será redirecionado para a cidade do princípio.",
            //     time: 5000,
            //     position: 'top',
            // })
        },
        onConnected(rpgEngine: RpgClientEngine, socket: any) {
            _socket = socket
        }
    }
 })
export default class RpgClientModuleEngine {}