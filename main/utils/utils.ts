export interface MobsOnMap {
    [name: string]: number;
}

import { RpgMap, RpgEvent } from "@rpgjs/server";

export const getMobsOnMapCount = (map: RpgMap): MobsOnMap => {
    return getMobsOnMap(map)
        .map((event: RpgEvent) => event.name)
        .reduce((acc, name) => {
            if (!acc[name]) {
                acc[name] = 0;
            }
            acc[name]++;
            return acc;
        }, {})
        ;
}

export const getMobsOnMap = (map: RpgMap): RpgEvent[] => {
    return Object.values(map.events)
        .filter(event => event instanceof RpgEvent) as RpgEvent[];
}