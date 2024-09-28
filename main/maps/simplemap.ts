import { MapData, RpgMap } from "@rpgjs/server";
import KuramonNPC from "../events/Kuramon-NPC";
import { Spawner } from '../utils/Spawner';
import { getMobsOnMapCount } from '../utils/utils';

/** @ts-ignore */
const MobSpawnList: NPC = {
    'Kuramon': {
        class: KuramonNPC,
        hitbox: {
            width: 32,
            height: 32,
        }
    }
}

@MapData({
    id: 'simplemap',
    file: require('../worlds/maps/simplemap.tmx'),
})
export default class SimpleMap extends RpgMap {
    onLoad() {
        try{
            const spawner = new Spawner(this, MobSpawnList);    
            setInterval(() => {
                const mobs = getMobsOnMapCount(this);
                spawner.populate(mobs);
            }, 60 * 1000)
    
            spawner.populate({});
        } catch {
            console.log("Mapa carregado mas não foi criado nenhum mob.")
        }
    }
}