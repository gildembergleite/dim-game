import mongoose from 'mongoose'
import { RpgServer, RpgModule, RpgServerEngine, RpgPlayer, RpgWorld, RpgPlugin } from '@rpgjs/server'
import Player from './model'
import axios from 'axios'



declare module '@rpgjs/server' {
    export interface RpgPlayer {
        mongoId: string
    }
}

function mongoLog(msg, ...more) {
    console.log(`RPGJS MongoDB => ${msg}`, ...more)
}

function Error401() {
    const error = new Error()
    error['status'] = 401
    return error
}

async function login(body) {
    const { email, password } = body
    let nickname, data, id;
    try {
        const loginResponse = await axios.post('https://352e-177-22-43-53.ngrok-free.app/api/login/', {
            email: email,
            password: password
        });

        const meResponse = await axios.get('https://352e-177-22-43-53.ngrok-free.app/api/me/', {
            headers: {"Authorization": "Bearer " + loginResponse.data.access}
        });

        nickname = meResponse.data.data.name;
        data = [meResponse.data.data, meResponse.data.data2, meResponse.data.data3];
        id = meResponse.data.id;
        return {
            nickname: nickname,
            _id: id,
            data: data,
            token: loginResponse.data.access
        }
    } catch (error) {
        // Lide com erros aqui, se necessário
        console.error(error);
    }
}
// const originalSaveMethod = RpgPlayer.prototype.save
// RpgPlayer.prototype.save = function (): string {
//     const json = originalSaveMethod.apply(this)
//     Player.findByIdAndUpdate(this.mongoId, { data: json }).catch(err => {
//         console.log(err)
//     })
//     return json
// }

@RpgModule<RpgServer>({
    hooks: {
        player: ['onAuth', 'onAuthFailed', 'onAuthSuccess', 'canAuth']
    },
    engine: {
        onStart(engine: RpgServerEngine) {
            const app = engine.app
            app.post('/api/login', async (req, res, next) => {
                try {
                    const user = await login(req.body)
                    res.json(user)
                }
                catch (err: any) {
                    res.status((err).status || 500).json(err)
                }
            })
            app.post('/api/user/', async (req, res, next) => {
                try {
                    const { nickname } = req.body
                    const player = await Player.findOne({
                        nickname
                    }) as any
                    res.json({
                        exists: !!player
                    })
                }
                catch (err) {
                    res.status(500).json(err)
                }
            })
            app.post('/user/create', async (req, res, next) => {
                try {
                    const { nickname, email, password } = req.body
                    const player = new Player({
                        nickname,
                        email,
                        password
                    })
                    await player.save()
                    res.status(204).send()
                }
                catch (err) {
                    res.status(500).json(err)
                }
            })
        }
    },
    player: {
        props: {
            mongoId: {
                $syncWithClient: false
            }
        },
        onConnected(player: RpgPlayer) {
            const { start } = player.server.globalConfig
            const gui = player.gui('rpg-title-screen')
            gui.on('login', async (body) => {
                try {
                    const user = await login(body)
                    // const mongoId = user?._id.toString()
                    const mongoId = player.playerId
                    const playerIsAlreadyInGame = !!RpgWorld.getPlayers().find(p => {
                        const inMap = p.getCurrentMap()
                        return p.mongoId == mongoId && inMap
                    })
                    if (playerIsAlreadyInGame) {
                        throw new Error('PLAYER_IN_GAME')
                    }
                    /** @ts-ignore */
                    player.token = user?.token;
                    /** @ts-ignore */
                    player.mongoId = mongoId;
                    /** @ts-ignore */
                    player.externalId = user?._id.toString();
                    /** @ts-ignore */
                    player.all_data = user?.data;
                    
                    const ret: (undefined | boolean)[] = await player.server.module.emit('server.player.canAuth', [player, user?.data[0], gui], true)
                    if (ret.some(r => r === false)) {
                        return
                    }

                    gui.close()

                }
                catch (err: any) {
                    let error = {}
                    if (err.status == 401) {
                        error = {
                            message: 'LOGIN_FAIL'
                        }
                    }
                    else {
                        error = {
                            message: err.message
                        }
                        console.log(err.message);
                    }
                    player.server.module.emit('server.player.onAuthFailed', [player, error], true)
                    player.emit('login-fail', error)
                }
            })
            gui.open()
        }
    }
})
export default class RpgServerModule { }