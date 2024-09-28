import { Spritesheet } from '@rpgjs/client'

const to = () => {
    const array: any = []
    let k = 0
    const durationFrame = 10
    for (let i=0 ; i < 2 ; i++) {
        for (let j=0 ; j < 5 ; j++) {
            array.push({ time: k * durationFrame, frameX: j, frameY: i })
            k++
        }
    }
    // This last beat allows the last frame to be played, otherwise the animation ends abruptly at the last frame. This can be considered as the total animation time.
    array.push({ time: k * durationFrame })
    return array
}

@Spritesheet({
    id: 'damage',
    image: require('./damage.png'),
    framesWidth: 17,
    framesHeight: 1,
    width: 32,
    height: 32,
    opacity: 1,
    anchor: [0.425, 0.55],
    textures: {
        default: {
            /*
            animations: [
                [ 
                    { time: 0, frameX: 0, frameY: 0 },
                    { time: 5, frameX: 1, frameY: 0 } ,
                    { time: 10, frameX: 2, frameY: 0 } ,
                    { time: 15, frameX: 3, frameY: 0 }
                    // etc...
                ]
            ]
            */
            animations: [ to() ]
        }
    }
})
export default class LevelUPAnimation {}