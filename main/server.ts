import { RpgServerEngineHooks, RpgServerEngine } from '@rpgjs/server'
import axios from 'axios'

const server: RpgServerEngineHooks = {
    async onStart(server: RpgServerEngine) {
        const res = await axios.get('https://352e-177-22-43-53.ngrok-free.app/api/classes/')
        for (let item of res.data.results) {
             server.addInDatabase(item.id, item, 'class') // Put items in memory. The third parameter is the type, it could be weapon, armor, etc.
        }
    }
}

export default server