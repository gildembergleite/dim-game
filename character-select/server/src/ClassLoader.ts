import { RpgPlayer } from "@rpgjs/server";

export default class ClassLoader {
    static load(player: RpgPlayer, userData: any) {
        if (!userData) {
            return;
        }
        
        // const json = JSON.parse(userData);
        // console.log(userData)
        /** It is required because engine load method restores only id of class */
        // if (userData._class && userData._class.id) {
        //     player.setClass(userData._class.id);
        // }
    }
}
