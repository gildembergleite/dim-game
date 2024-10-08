import { RpgClient, RpgModule } from '@rpgjs/client'
/** @ts-ignore */
import characterSelectGui from './gui/select-character.vue';

@RpgModule<RpgClient>({
    gui: [
        characterSelectGui
    ]
})
export default class RpgClientEngine {}
