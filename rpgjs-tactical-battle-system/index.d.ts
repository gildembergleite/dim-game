import { RpgPlayer, RpgMap } from "@rpgjs/server";

declare module '@rpgjs/server' {
    export interface RpgPlayerHooks {
        /**
         * This method is called at the end of character select process, when everything has worked.
         *
         * @prop { (player: RpgPlayer, mapId: string) => void } [onJoinBattle]
         * @param {RpgPlayer} player - The RPG player object.00
         * @param {string} mapId - Id of map.
         * @returns {void}
         * @memberof RpgPluginTacticalBattleSystem
         * @since 1.1.0-rc.3
         * @example
         *
         * ```ts
         * import { RpgPlayer, RpgPlayerHooks } from '@rpgjs/server'

         * const player: RpgPlayerHooks = {
         *    onCharacterSelected(player: RpgPlayer, mapId: string) {
         *          console.log(player.name, 'joined on battle in ', mapId);
         *    }
         * }
         * ```
         */
        onBattle?: (player: RpgPlayer, mapId: string, otherPlayer: string) => void;
        onMyTurn?: (player: RpgPlayer, map: RpgMap) => void;
        offMyTurn?: (player: RpgPlayer, map: RpgMap) => void;
        offBattle?: (player: RpgPlayer, winner: Boolean) => void;
        moveBattle?: (player: RpgPlayer,  events: any, map: RpgMap, newBlocoX: number, newBlocoY: number, atk: boolean, enemy_id: string) => void;
    }
}
