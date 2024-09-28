import { RpgSceneMapHooks, RpgSceneMap,  } from '@rpgjs/client'

const sceneMap: RpgSceneMapHooks = {
    onAfterLoading(scene: RpgSceneMap) {
        scene.showAnimation({
            graphic: 'levelup',
            animationName: 'default'
        })
    }
}

export default sceneMap;