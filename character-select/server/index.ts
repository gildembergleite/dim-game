import { RpgServer, RpgModule, RpgPlayer, Components } from '@rpgjs/server'
import axios from 'axios';

function sleep(seconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

/** @ts-ignore */
@RpgModule<RpgServer>({
    hooks: {
        player: ['onCharacterSelected'],
    },
    player: {
        /** @ts-ignore */
        canAuth(player: RpgPlayer, userData: any, authGui: any): boolean {
            const { actors, gui } = player.server.globalConfig.characterSelect;
            authGui.close();
            const guiInstance = player.gui(gui || 'rpg-character-select')
            guiInstance.on('character-selected', async ({ actorId, newClassesId, createNewPerson, newClasses, actors }: { actorId: string, newClassesId: string, createNewPerson: boolean, newClasses: object, actors: object }) => {
                guiInstance.close();
            
                var actorIdAsNumber = parseInt(actorId, 10) - 1;
                /** @ts-ignore */
                player.actorId = actorIdAsNumber;
                player.canMove = true;
                console.log(actorIdAsNumber, "actorIdAsNumber")
                if (createNewPerson){
                    /** @ts-ignore */
                    player.all_data[actorIdAsNumber] = newClasses[newClassesId].initial_data
                    /** @ts-ignore */
                    player.all_data[actorIdAsNumber].name = actors[actorId].nickname
                    /** @ts-ignore */
                    player.all_data[actorIdAsNumber].actorId = actorIdAsNumber
                    if (actorIdAsNumber === 0){
                        /** @ts-ignore */
                        await axios.patch('https://352e-177-22-43-53.ngrok-free.app/api/users/'+player.externalId +'/',
                            {
                                /** @ts-ignore */
                                id: player.externalId,
                                actorId: actorIdAsNumber,
                                /** @ts-ignore */
                                data: player.all_data[actorIdAsNumber],
                            }, 
                            /** @ts-ignore */
                            {headers: {'Authorization': "Bearer " + player.token}});
                    }

                    if (actorIdAsNumber === 1){
                        /** @ts-ignore */
                        await axios.patch('https://352e-177-22-43-53.ngrok-free.app/api/users/'+player.externalId +'/',
                            {
                                /** @ts-ignore */
                                id: player.externalId,
                                actorId: actorIdAsNumber,
                                /** @ts-ignore */
                                data2: player.all_data[actorIdAsNumber],
                            }, 
                            /** @ts-ignore */
                            {headers: {'Authorization': "Bearer " + player.token}});
                        }

                    if (actorIdAsNumber === 2){
                        /** @ts-ignore */
                        await axios.patch('https://352e-177-22-43-53.ngrok-free.app/api/users/'+player.externalId +'/',
                        {
                            /** @ts-ignore */
                                id: player.externalId,
                                actorId: actorIdAsNumber,
                                /** @ts-ignore */
                                data3: player.all_data[actorIdAsNumber],
                            }, 
                            /** @ts-ignore */
                            {headers: {'Authorization': "Bearer " + player.token}});
                        }
                        
                }
                    /** @ts-ignore */
                    player.load(player.all_data[actorIdAsNumber])
                    /** @ts-ignore */
                    console.log("LOG: ", player.all_data[actorIdAsNumber].map, player.all_data[actorIdAsNumber].position)
                    /** @ts-ignore */
                    player.setGraphic(player.all_data[player.actorId]._class.graphics.pernament[0].replace("-Face", ""))
                    /** @ts-ignore */
                    player.changeMap(player.all_data[actorIdAsNumber].map, player.all_data[actorIdAsNumber].position)
                    /** @ts-ignore */
                    // player._class = player.all_data[actorIdAsNumber]._class
                    console.log(player.toJSON())
                    /** @ts-ignore */
                    console.log(player.all_data[actorIdAsNumber]._class)
                    console.log(player._class)
                    player.addParameter('atributoValue', {
                        /** @ts-ignore */
                        start: player.all_data[actorIdAsNumber]._class.nivel.atributoValue,
                        /** @ts-ignore */
                        end: player.all_data[actorIdAsNumber]._class.nivel.atributoValue
                    })
                    player.addParameter('nivelValue', {
                        /** @ts-ignore */
                        start: player.all_data[actorIdAsNumber]._class.nivel.nivelValue,
                        /** @ts-ignore */
                        end: player.all_data[actorIdAsNumber]._class.nivel.nivelValue
                    })
                    player.addParameter('level', {
                        /** @ts-ignore */
                        start: player.all_data[actorIdAsNumber].level,
                        /** @ts-ignore */
                        end: player.all_data[actorIdAsNumber].level
                    })
                    await sleep(2);

                    /** @ts-ignore */
                    player.server.module.emit('server.player.onAuthSuccess', [player], true)
                });
                axios.get('https://352e-177-22-43-53.ngrok-free.app/api/classes/?is_initial__exact=True').then(function (response) {
                    const newClasses = {};
                for (let classes of response.data.results){
                        if (classes.is_initial){
                            newClasses[classes.id] = {
                                id: classes.id,
                                name: classes.name,
                                description: classes.description,
                                class: {
                                    "type": classes.name,
                                    "graphics": classes.graphics
                                },
                                initial_data: classes.initial_data
                            }
                        }
                }
                const actorClasses = {};
                let counter = 1;
                /** @ts-ignore */
                for (let data of player.all_data) {
                    try {
                        let item = data["_class"]
                        actorClasses[counter] = {
                                id: item.id,
                                name: item.name,
                                description: item.description,
                                level: data.level, 
                                nickname: data.name,
                                map: data.map,
                                class: {
                                "type": item.name,
                                "graphics": item.graphics
                                },
                            };
                    } catch {
                        actorClasses[counter] = {
                            id: "",
                            name: "",
                            description: "",
                            level: "", 
                            nickname: "",
                            map: "",
                            class: {
                            "type": "",
                            "graphics": {"pernament": ["000_Digivice-Face"], "animations": [], "baseEquipment": {}}
                            },
                        };
                    }
                    counter++;
                };
                guiInstance.open({
                    actors: actorClasses,
                    newClasses: newClasses
                });
            })
            return false;
        },
    }
})
export default class RpgServerModule { }
