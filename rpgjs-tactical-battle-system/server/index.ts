import { RpgServer, RpgModule, RpgServerEngine, RpgPlayer, RpgMap, RpgShape } from '@rpgjs/server';

@RpgModule<RpgServer>({
    hooks: {
        player: ['onBattle', 'onMyTurn',  'offMyTurn',  'offBattle', 'moveBattle'],
    },
    engine:{
        onStart(engine: RpgServerEngine) {
            console.log("O modulo está online");
            // const sceneMap = engine.sceneMap
            // sceneMap.createDynamicMap({
            //     id: 'myid',
            //     file: require('./tmx/battlemap.tmx')
            // })
            engine.damageFormulas = {
                damagePhysic: function(a, b){
                    let ATK = 0; 
                    let PDEF = 0;
                    let modAtkAtributo = 0;
                    let modAtkNivel = 0;
                    let modDefAtributo = 0;
                    let modDefNivel = 0; 
                    // Calculando o ataque.
                    ATK += a['str']
                    ATK += Math.ceil(a['dex']/5) + 1
                    if (a['atributoValue'] > 0) {
                        if ((a['atributoValue'] > b['atributoValue']) || (a['atributoValue'] === 2 && b['atributoValue'] === 0)){
                            modAtkAtributo = 0.08 * ATK
                        }
                    }
                    if (a['nivelValue'] > b['nivelValue']){
                        modAtkNivel = 0.06 * ATK
                    }   
                    ATK = ATK + modAtkAtributo
                    ATK = ATK + modAtkNivel
                    
                    // Calculando a defesa.
                    PDEF += Math.ceil(b['agi']/5) + 1
                    PDEF += Math.ceil(b['str']/10) + 1
                    if (b['atributoValue'] > 0) {
                        if ((b['atributoValue'] > a['atributoValue']) || (b['atributoValue'] === 2 && a['atributoValue'] === 0)){
                            modDefAtributo = 0.06 * PDEF
                        }
                    }
                    if (b['nivelValue'] > a['nivelValue']){
                        modDefNivel = 0.04 * PDEF
                    }
                    PDEF = PDEF + modDefAtributo
                    PDEF = PDEF + modDefNivel

                    let damage = Math.round((ATK * 100) / (PDEF + 100))
                    console.log('damage: ', damage)
                    if (damage < 0) damage = 0

                    return damage

                },
                coefficientElements: function(a){
                    return 1
                }
            }
        }
    }
 })
export default class RpgServerModuleEngine {}
