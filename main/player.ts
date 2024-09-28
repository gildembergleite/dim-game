import { RpgPlayer, type RpgPlayerHooks, Control, Components, Direction, RpgEvent, EventData, RpgMap} from '@rpgjs/server'
import axios from 'axios'

function sleep(seconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

function clearEvents(player: RpgPlayer, events: any, map: RpgMap){
    if (player.getVariable('IN_BATTLE')){
        try{
            for (let key of Object.keys(events)){
                map.removeEvent(events[key].id)
            }
        } catch (error) {
            console.log("Erro ao limpar eventos: ", error)
        }
    }
}

function dateFormat(date: Date){
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mês começa do zero
    const year = date.getFullYear().toString().slice(-2);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;

}

async function drawShape(MAX_MOVE: number, MAX_X: number, MAX_Y: number, blocoX:number, blocoY:number, map: RpgMap, local_players: any, enemy_players: any){
    @EventData({
        name: 'shape-move', 
        hitbox: {
            width: 32,
            height: 32
        }
    })
    class ShapeMove extends RpgEvent {
        onInit() {
            this.setGraphic('move');
        }
    }
    @EventData({
        name: 'shape-move-atk', 
        hitbox: {
            width: 32,
            height: 32
        }
    })
    class ShapeAtk extends RpgEvent {
        onInit() {
            this.setGraphic('move-atk');
        }
    }
    @EventData({
        name: 'shape-move-block', 
        hitbox: {
            width: 32,
            height: 32
        }
    })
    class ShapeBlock extends RpgEvent {
        onInit() {
            this.setGraphic('move-block');
        }
    }
    let events: Record<string, any> = {};
    let newEvent: any;
    let chave: any;
    let useEvent: any[] = [];
    for (let i=1 ; i<=MAX_X; i++){
        for (let j=1 ; j<=MAX_Y; j++){
            useEvent = [];
            chave = (blocoX + i) + ',' + (blocoY + j);
            if (local_players.includes(chave)){
                useEvent.push(ShapeBlock)
            }
            if (enemy_players.includes(chave)){
                useEvent.push(ShapeAtk)
            }
            if (useEvent.length === 0){
                useEvent.push(ShapeMove)
            }
            if ((blocoX + i < 20 || blocoY + j < 15) && !events.hasOwnProperty(chave) && (i + j <= MAX_MOVE)){
                newEvent = Object.values(map.createDynamicEvent({
                    x: ((blocoX + i) * 32),
                    y: ((blocoY + j) * 32),
                    event: useEvent[0],
                })) as RpgEvent[];
                events[chave] = newEvent[0];
            }
            useEvent = [];
            chave = (blocoX + i) + ',' + (blocoY - j);
            if (local_players.includes(chave)){
                useEvent.push(ShapeBlock)
            }
            if (enemy_players.includes(chave)){
                useEvent.push(ShapeAtk)
            }
            if (useEvent.length === 0){
                useEvent.push(ShapeMove)
            }
            if ((blocoX + i < 20 || blocoY - j < 15) && !events.hasOwnProperty(chave) && (i + j <= MAX_MOVE)){
                newEvent = Object.values(map.createDynamicEvent({
                    x: ((blocoX + i) * 32),
                    y: ((blocoY - j) * 32),
                    event: useEvent[0],
                })) as RpgEvent[];
                events[chave] = newEvent[0];
            }
            useEvent = [];
            chave = (blocoX - i) + ',' + (blocoY + j);
            if (local_players.includes(chave)){
                useEvent.push(ShapeBlock)
            }
            if (enemy_players.includes(chave)){
                useEvent.push(ShapeAtk)
            }
            if (useEvent.length === 0){
                useEvent.push(ShapeMove)
            }
            if ((blocoX - i < 20 || blocoY + j < 15) && !events.hasOwnProperty(chave) && (i + j <= MAX_MOVE)){
                newEvent = Object.values(map.createDynamicEvent({
                    x: ((blocoX - i) * 32),
                    y: ((blocoY + j) * 32),
                    event: useEvent[0],
                })) as RpgEvent[];
                events[chave] = newEvent[0];
            }
            useEvent = [];
            chave = (blocoX - i) + ',' + (blocoY - j);
            if (local_players.includes(chave)){
                useEvent.push(ShapeBlock)
            }
            if (enemy_players.includes(chave)){
                useEvent.push(ShapeAtk)
            }
            if (useEvent.length === 0){
                useEvent.push(ShapeMove)
            }
            if ((blocoX - i < 20 || blocoY - j < 15) && !events.hasOwnProperty(chave) && (i + j <= MAX_MOVE)){
                newEvent = Object.values(map.createDynamicEvent({
                    x: ((blocoX - i) * 32),
                    y: ((blocoY - j) * 32),
                    event: useEvent[0],
                })) as RpgEvent[];
                events[chave] = newEvent[0];
            }
            useEvent = [];
            chave = (blocoX) + ',' + (blocoY - j);
            if (local_players.includes(chave)){
                useEvent.push(ShapeBlock)
            }
            if (enemy_players.includes(chave)){
                useEvent.push(ShapeAtk)
            }
            if (useEvent.length === 0){
                useEvent.push(ShapeMove)
            }
            if ((blocoX < 20 || blocoY - j < 15) && !events.hasOwnProperty(chave) && (j <= MAX_MOVE)){
                newEvent = Object.values(map.createDynamicEvent({
                    x: ((blocoX) * 32),
                    y: ((blocoY - j) * 32),
                    event: useEvent[0],
                })) as RpgEvent[];
                events[chave] = newEvent[0];
            }
            useEvent = [];
            chave = (blocoX - i) + ',' + (blocoY);
            if (local_players.includes(chave)){
                useEvent.push(ShapeBlock)
            }
            if (enemy_players.includes(chave)){
                useEvent.push(ShapeAtk)
            }
            if (useEvent.length === 0){
                useEvent.push(ShapeMove)
            }
            if ((blocoX - i < 20 || blocoY < 15) && !events.hasOwnProperty(chave) && (i <= MAX_MOVE)){
                newEvent = Object.values(map.createDynamicEvent({
                    x: ((blocoX - i) * 32),
                    y: ((blocoY) * 32),
                    event: useEvent[0],
                })) as RpgEvent[];
                events[chave] = newEvent[0];
            }
            useEvent = [];
            chave = (blocoX) + ',' + (blocoY + j);
            if (local_players.includes(chave)){
                useEvent.push(ShapeBlock)
            }
            if (enemy_players.includes(chave)){
                useEvent.push(ShapeAtk)
            }
            if (useEvent.length === 0){
                useEvent.push(ShapeMove)
            }
            if ((blocoX < 20 || blocoY + j < 15) && !events.hasOwnProperty(chave) && (j <= MAX_MOVE)){
                newEvent = Object.values(map.createDynamicEvent({
                    x: ((blocoX) * 32),
                    y: ((blocoY + j) * 32),
                    event: useEvent[0],
                })) as RpgEvent[];
                events[chave] = newEvent[0];
            }
            useEvent = [];
            chave = (blocoX + i) + ',' + (blocoY);
            if (local_players.includes(chave)){
                useEvent.push(ShapeBlock)
            }
            if (enemy_players.includes(chave)){
                useEvent.push(ShapeAtk)
            }
            if (useEvent.length === 0){
                useEvent.push(ShapeMove)
            }
            if ((blocoX + i < 20 || blocoY < 15) && !events.hasOwnProperty(chave) && (i <= MAX_MOVE)){
                newEvent = Object.values(map.createDynamicEvent({
                    x: ((blocoX + i) * 32),
                    y: ((blocoY) * 32),
                    event: useEvent[0],
                })) as RpgEvent[];
                events[chave] = newEvent[0];
            }
       }
    }
    return events
}

const customMove = (x1: number, y1: number, x2: number, y2: number) => {
    let route: any[] = [];
    let count: number;
    const ON_MOVE = 16;
    if ((x1 > x2)){
        count = 1
        for (let r=0; r < (Math.floor((x1-x2)) * ON_MOVE); r++){
            count +=1
            route.push(Direction.Left)
        }
    }
    if ((x1 < x2)) {
        count = 1
        for (let r=0; r < (Math.floor((x2-x1)) * ON_MOVE); r++){
            count +=1
            route.push(Direction.Right)
        }
    }
    if ((y1 > y2)){
        count = 1
        for (let r=0; r < (Math.floor((y1-y2)) * ON_MOVE); r++){
            count += 1
            route.push(Direction.Up)
        }
    } 
    if ((y1 < y2)) {
        count = 1
        for (let r=0; r < (Math.floor((y2-y1)) * ON_MOVE); r++){
            count += 1
            route.push(Direction.Down)
        }
    }

    return route
}


function calcularDistancia(x1: number, y1: number, x2: number, y2: number): number {
    let deltaX = x2 - x1;
    let deltaY = y2 - y1;
    
    let distancia = Math.abs(deltaX) + Math.abs(deltaY);
    
    return Math.ceil(distancia);
}

declare module '@rpgjs/server' {
    export interface RpgPlayer {
        externalId: string,
        backend_socket: any,
        token: string,
        all_data: any,
        linhaEvolutiva: any,
        actorId: number,
        statesBattle: any,
    }
   }

const player: RpgPlayerHooks = {
    props: {
        externalId: {
            $permanent: true
        },
        backend_socket: {
            $permanent: true
        },
        token:  {
            $permanent: true
        },
        all_data:  {
            $permanent: true
        },
        linhaEvolutiva:  {
            $permanent: true
        },
        actorId: {
            $permanent: true
        },
        statesBattle: {
            $permanent: true
        }
    },
    onConnected(player: RpgPlayer) {
        // try{
        //     player.canMove = false
        //     player.on('click', (position) => {
        //         if (Object.keys(player.statesBattle).length === 0){
        //             player.moveTo(position).subscribe()
        //         }            
        //     });
        // } catch (error:any) {
        //     console.log("Usuário não identificado.")
        // }
    },
    onInput(player: RpgPlayer, { input }) {
        if (input == Control.Back) {
            player.callMainMenu()
        }
    },
    /* @ts-ignore */
    onLevelUp(player: RpgPlayer, nbLevel: number){
        const linhasEvolutivas = player.linhaEvolutiva;
        let evolution = false;
        let graphicEvolution: any;
        let toEvolution: any;
        for (let linhaEvolutiva of linhasEvolutivas){
            /* @ts-ignore */
            if (linhaEvolutiva.by.id === player._class.id){
                /* @ts-ignore */
                if ('level' in linhaEvolutiva.requirement){
                    /* @ts-ignore */
                    if (player.level + 1 === linhaEvolutiva.requirement.level){
                        evolution = true;
                        /* @ts-ignore */
                        graphicEvolution = linhaEvolutiva.to.graphics.pernament[0].replace("-Face", "")
                        /* @ts-ignore */
                        toEvolution = linhaEvolutiva.to
                    } else {
                        evolution = false;
                    }
                } else {
                };
            };
        };
        if (evolution){
            player.showAnimation('digievolution', 'default');
            player.setGraphic(graphicEvolution)
            player._class = toEvolution
            player.all_data[player.actorId]._class = toEvolution
            player.save()
            player.removeGui('rpg-info-player')
            player.gui('rpg-info-player').open({classe: toEvolution}, {
                waitingAction: false,
                blockPlayerInput: false
            })
            
        } else {
            player.showAnimation('levelup', 'default')             
        }
    },
    /* @ts-ignore */
    async onJoinMap(player: RpgPlayer, map: RpgMap) {
        player.gui('rpg-info-player').open({classe: player.all_data[player.actorId]._class}, {
            waitingAction: false,
            blockPlayerInput: false
        })
        try{
            player.setGraphic(player.all_data[player.actorId]._class.graphics.pernament[0].replace("-Face", ""))
            player.setComponentsTop(Components.text('{name}',
                                    player.all_data[player.actorId].layout.top?.lines[0].col[0].value.style)
            )
        } catch {
            console.log("Deu erro no setgrapich")
        }
    },
    onDisconnected(player:RpgPlayer){
        try{
            let variables, content, payload;
            if (Object.keys(player.variables).length === 0) {
                variables = [];
            } else {
                variables = player.variables;
            }
            content = {
                actorId: player.actorId,
                externalId: player.externalId,
                hp: player.hp,
                sp: player.sp,
                exp: player.exp,
                map: player.map,
                gold: player.gold,
                name: player.name,
                items: player.items,
                level: player.level,
                param: player.param,
                speed: player.speed,
                width: player.width,
                _class: player._class,
                height: player.height,
                layout: player.layout,
                canMove: player.canMove,
                hHitbox: player.hHitbox,
                mongoId: player.mongoId,
                through: player.through,
                wHitbox: player.wHitbox,
                position: player.position,
                direction: player.direction,
                frequency: player.frequency,
                variables: variables,
                finalLevel: player.finalLevel,
                initialLevel: player.initialLevel,
                expForNextlevel: player.expForNextlevel,
                throughOtherPlayer: player.throughOtherPlayer,
                statesBattle: player.statesBattle,
            }
            // content = JSON.stringify(player.save())
            payload = {
                id: player.externalId
            }

            if (player.actorId == 0){
                payload["data"] = content
            } else {
                let actor = player.actorId + 1;
                payload["data"+actor] = content
            }
            axios.patch('https://352e-177-22-43-53.ngrok-free.app/api/users/'+player.externalId +'/',
            payload, 
            {headers: {'Authorization': "Bearer " + player.token}});   
            console.log("Último estado salvo.");
        } catch (err: any) {
            console.log("Errado: " + err.message);
        }
    },
    async onAuthSuccess(player: RpgPlayer) {
        /** @ts-ignore */        
        try{
            const res = await axios.get('https://352e-177-22-43-53.ngrok-free.app/api/linha-evolutiva/')
            player.linhaEvolutiva = res.data.results
            // player.setGraphic(player.all_data[player.actorId]._class.graphics.pernament[0].replace("-Face", ""))
            // player.changeMap(player.all_data[player.actorId].map, {x: player.all_data[player.actorId].position.x, y: player.all_data[player.actorId].position.y})
        } catch {
            console.log("Não foi possivel registrar a linha evolutiva.")
        }

    },
    /** @ts-ignore */
    async onBattle(player: RpgPlayer, mapId: string, otherPlayer: string){
        console.log("Chamado on battle.")
        player.changeMap(mapId, {x: 480, y: 224})
        player.setVariable('IN_BATTLE', true)
        player.setVariable('MAP_BEFORE_BATTLE', player.map)
        player.setVariable('X_BEFORE_BATTLE', player.position.x)
        player.setVariable('Y_BEFORE_BATTLE', player.position.y)
        let content = {
            id: 1,
            mapId: mapId,
            othersPlayer: otherPlayer,
            myTurn: true,
            timeTurn: 5,
            MAX_ROUTE: 6,
            turnRoute: 0,
            isMoving: false,
            position: {
                x: 480/32,
                y: 224/32
            },
            draw: true,
        }
        player.frequency = 0
        player.speed = 2
        player.statesBattle = content
        player.through = true;
        player.throughOtherPlayer = true;
        await sleep(1);
        player.statesBattle.othersPlayer = player.getCurrentMap()?.events;
        player.gui('rpg-battle-player').open({classe: player.all_data[player.actorId]._class}, {
            waitingAction: false,
            blockPlayerInput: false
        })
        const otherPlayerContent = {
            name: player.statesBattle.othersPlayer[Object.keys(player.statesBattle.othersPlayer)[0]].name,
            hp: player.statesBattle.othersPlayer[Object.keys(player.statesBattle.othersPlayer)[0]].hp,
            maxHp: player.statesBattle.othersPlayer[Object.keys(player.statesBattle.othersPlayer)[0]].param.maxHp,
            level: player.statesBattle.othersPlayer[Object.keys(player.statesBattle.othersPlayer)[0]].level,
            _class: player.statesBattle.othersPlayer[Object.keys(player.statesBattle.othersPlayer)[0]]._class,
        }
        player.gui('rpg-enemy-player').open({otherPlayer: otherPlayerContent}, {
            waitingAction: false,
            blockPlayerInput: false
        });
        // player.canMove = false
        player.server.module.emit('server.player.onMyTurn', [player, player.getCurrentMap()], true);
    },
    async moveBattle(player: RpgPlayer,  events: any, map: RpgMap, newBlocoX: number, newBlocoY: number, atk: boolean, enemy_id: string){
        let dmg = {damage: 0};
        if (atk){
            await player.moveRoutes([customMove(player.statesBattle.position.x, player.statesBattle.position.y, newBlocoX, newBlocoY).slice(0, -16)])
            const dmg = map.events[enemy_id].applyDamage(player)
            const data: any = {
                message: `[${dateFormat(new Date(Date.now()))}] [${player.name}] Dano aplicado em ${map.events[enemy_id].name}: ${dmg.damage}`,
                date: Date.now(),
                type: 'battle'
            }
            if (player) {
                data.sender = player.id
            }
            player.emit('chat-message', data)

        } else {
            await player.moveRoutes([customMove(player.statesBattle.position.x, player.statesBattle.position.y, newBlocoX, newBlocoY)])   

        }
        player.statesBattle.position.x = player.position.x/32
        player.statesBattle.position.y = player.position.y/32
        player.statesBattle.isMoving = false
        if ((atk) && (dmg.damage >= map.events[enemy_id].hp)){
            player.server.module.emit('server.player.offBattle', [player, true], true)
        } else {
            if (player.statesBattle.turnRoute === player.statesBattle.MAX_ROUTE) {
                player.server.module.emit('server.player.offMyTurn', [player, map], true)
            } else {
                player.server.module.emit('server.player.onMyTurn', [player, player.getCurrentMap()], true)
            }
        }
        
    },
    async onMyTurn(player: RpgPlayer, map: RpgMap){
        if (player.getVariable('IN_BATTLE')){
            player.statesBattle.myTurn = true
            player.removeGui('rpg-battle-player');
            player.removeGui('rpg-enemy-player');
            player.gui('rpg-battle-player').open({classe: player.statesBattle}, {
                waitingAction: false,
                blockPlayerInput: false
            });
            const otherPlayerContent = {
                name: player.statesBattle.othersPlayer[Object.keys(player.statesBattle.othersPlayer)[0]].name,
                hp: player.statesBattle.othersPlayer[Object.keys(player.statesBattle.othersPlayer)[0]].hp,
                maxHp: player.statesBattle.othersPlayer[Object.keys(player.statesBattle.othersPlayer)[0]].param.maxHp,
                level: player.statesBattle.othersPlayer[Object.keys(player.statesBattle.othersPlayer)[0]].level,
                _class: player.statesBattle.othersPlayer[Object.keys(player.statesBattle.othersPlayer)[0]]._class,
            }
            player.gui('rpg-enemy-player').open({otherPlayer: otherPlayerContent}, {
                waitingAction: false,
                blockPlayerInput: false
            });
            const othersPlayer = map.events
            player.statesBattle.draw = true
            let local_players: string[] = []; 
            let chave: boolean;
            for (let player_obj of Object.keys(map.players)){
                local_players.push((map.players[player_obj].position.x/32) + ',' + (map.players[player_obj].position.y/32))
            }
            let enemy_players: string[] = [];
            let enemy_players_id: string[] = [];
            for (let events_obj of Object.keys(map.events)){
                enemy_players.push((map.events[events_obj].position.x/32) + ',' + (map.events[events_obj].position.y/32))
                enemy_players_id.push(events_obj)
            }
            player.canMove = false
            const MAX_MOVE = player.statesBattle.MAX_ROUTE - player.statesBattle.turnRoute;
            const MAX_X = 7;
            const MAX_Y = 7;
            let events;
            if (player.statesBattle.draw){
                events = await drawShape(MAX_MOVE, MAX_X, MAX_Y, player.statesBattle.position.x, player.statesBattle.position.y, map, local_players, enemy_players)
                player.statesBattle.draw = false
            }
    
            player.stopMoveTo()
    
            player.once('click', (position) => {
                try{     
                    let newBloco = map.getTileOriginPosition(position.x, position.y);
                    let enemyBloco = map.getTileOriginPosition((map.events[enemy_players_id[0]].position.x), (map.events[enemy_players_id[0]].position.y))
                    let dist = calcularDistancia(player.statesBattle.position.x, player.statesBattle.position.y, newBloco.x/32, newBloco.y/32);
                    if (((dist + player.statesBattle.turnRoute) <= player.statesBattle.MAX_ROUTE) && (!player.statesBattle.isMoving)){
                        chave = ((enemyBloco.x/32 === newBloco.x/32) && (enemyBloco.y/32 === newBloco.y/32));
                        if (chave){
                            player.statesBattle.isMoving = true
                            dist -= 1
                            player.statesBattle.turnRoute += 2 + dist
                            if (!player.statesBattle.draw){
                                clearEvents(player, events, map)
                            }
                            player.server.module.emit('server.player.moveBattle', [player, events, map, newBloco.x/32, newBloco.y/32, true, enemy_players_id[0]], true)
                        } else {
                            player.statesBattle.isMoving = true
                            player.statesBattle.turnRoute += dist
                            if (!player.statesBattle.draw){
                                clearEvents(player, events, map)
                            }
                            player.server.module.emit('server.player.moveBattle', [player, events, map, newBloco.x/32, newBloco.y/32, false, ""], true)
                        }
                    } else {
                        if (!player.statesBattle.draw){
                            clearEvents(player, events, map)
                        }
                    }
                } catch (error: any){
                    console.log('Error: ', error.message)
                }
            });
        }
    },
    async offMyTurn(player: RpgPlayer, map: RpgMap){
        if (player.getVariable('IN_BATTLE')){
            const otherPlayer = player.statesBattle.othersPlayer[Object.keys(player.statesBattle.othersPlayer)[0]];            
            otherPlayer.frequency = 0;
            otherPlayer.speed = 2;
            const MAX_ACTION = 6;
            let turnMove = 0;
            /** @ts-ignore */
            let actionPerformed = true;
            while (actionPerformed) {
                player.statesBattle.myTurn = false
                player.removeGui('rpg-battle-player');
                player.gui('rpg-battle-player').open({classe: player.statesBattle}, {
                    waitingAction: false,
                    blockPlayerInput: false
                });
                player.removeGui('rpg-enemy-player');
                const otherPlayerContent = {
                    name: player.statesBattle.othersPlayer[Object.keys(player.statesBattle.othersPlayer)[0]].name,
                    hp: player.statesBattle.othersPlayer[Object.keys(player.statesBattle.othersPlayer)[0]].hp,
                    maxHp: player.statesBattle.othersPlayer[Object.keys(player.statesBattle.othersPlayer)[0]].param.maxHp,
                    level: player.statesBattle.othersPlayer[Object.keys(player.statesBattle.othersPlayer)[0]].level,
                    _class: player.statesBattle.othersPlayer[Object.keys(player.statesBattle.othersPlayer)[0]]._class,
                }
                player.gui('rpg-enemy-player').open({otherPlayer: otherPlayerContent}, {
                    waitingAction: false,
                    blockPlayerInput: false
                });
                actionPerformed = true;
                console.log('Posição inicial NPC: ', otherPlayer.position.x/32, otherPlayer.position.y/32);
                console.log('Posição Player: ', player.position.x/32, player.position.y/32);
                console.log('turnMove: ', turnMove);
                let dist = calcularDistancia(otherPlayer.position.x/32, otherPlayer.position.y/32, player.position.x/32, player.position.y/32);
                /** @ts-ignore */
                if ((dist > 1)) {
                    if ((dist + turnMove) <= MAX_ACTION){
                        turnMove += dist;
                    } else {
                        turnMove = MAX_ACTION;
                    }
                    let route = customMove(otherPlayer.position.x/32, otherPlayer.position.y/32, player.position.x/32, player.position.y/32);
                    if ((turnMove === dist) && (dist <= MAX_ACTION)){
                        await otherPlayer.moveRoutes([route.slice(0,(turnMove-1)*16)]);
                        turnMove -= 1;
                    } else {
                        await otherPlayer.moveRoutes([route.slice(0,turnMove*16)]);
                    }
                    dist = calcularDistancia(otherPlayer.position.x/32, otherPlayer.position.y/32, player.position.x/32, player.position.y/32);
                } 
                
                if ((MAX_ACTION - turnMove >= 2)){
                    turnMove += 2
                    console.log("####### Distância para ataque. Ataque em andamento.");
                    const dmg = player.applyDamage(otherPlayer);
                    const data: any = {
                        message: `[${dateFormat(new Date(Date.now()))}] [${otherPlayer.name}] Dano aplicado em ${player.name}: ${dmg.damage}`,
                        date: Date.now(),
                        type: 'battle'
                    }
                    if (player) {
                        data.sender = player.id
                    }
                    player.emit('chat-message', data)
                }
                if ((dist === 1) && (MAX_ACTION - turnMove < 2)){
                    actionPerformed = false
                }
                await sleep(2);
            }
    
            // if ((dist <= 1)){
            //     player.server.module.emit('server.player.offBattle', [player], true)
            // } else {
            player.statesBattle.turnRoute = 0;
            player.server.module.emit('server.player.onMyTurn', [player, player.getCurrentMap()], true)
            // }
        }

    },
    async offBattle(player: RpgPlayer, winner: Boolean){
        player.removeGui('rpg-battle-player')
        player.removeGui('rpg-enemy-player')
        if (player.getVariable('IN_BATTLE')){

            if (winner){
                const data: any = {
                    message: `[${dateFormat(new Date(Date.now()))}] ${player.name} venceu a batalha!`,
                    date: Date.now(),
                    type: 'battle'
                }
                if (player) {
                    data.sender = player.id
                }
                player.emit('chat-message', data)
        
            } else {
                const data: any = {
                    message: `[${dateFormat(new Date(Date.now()))}] ${player.name} perdeu a batalha`,
                    date: Date.now(),
                    type: 'battle'
                }
                if (player) {
                    data.sender = player.id
                }
                player.emit('chat-message', data)
            
                    // player.showText('Você perdeu a batalha! Será redirecionado para a cidade do princípio.')
    
            }
            const mapBattle = player.getCurrentMap()
            const playerMap = player.getVariable('MAP_BEFORE_BATTLE')
            const playerX = player.getVariable('X_BEFORE_BATTLE')
            const playerY = player.getVariable('Y_BEFORE_BATTLE')
            console.log(player.server.sceneMap.getMapBydId(player.statesBattle.mapId));
            
            player.changeMap(playerMap, {x: playerX, y: playerY})
            player.canMove = true
            player.removeVariable('MAP_BEFORE_BATTLE')
            player.removeVariable('X_BEFORE_BATTLE')
            player.removeVariable('Y_BEFORE_BATTLE')
            player.setVariable('IN_BATTLE', false)
            player.statesBattle = {}
            player.through = false;
            player.throughOtherPlayer = false;
            await sleep(1)
            // mapBattle?.removeEvent(player.statesBattle.othersPlayer[Object.keys(player.statesBattle.othersPlayer)[0]].id)
            console.log("Players: ", mapBattle?.players)
            console.log("Eventos: ", mapBattle?.events)
            mapBattle?.removeFromWorldMaps()
            mapBattle?.remove();
            player.off('onMyTurn');
            player.off('offMyTurn');
            player.off('moveBattle');
            player.off('onBattle');
        }
    }
}

export default player