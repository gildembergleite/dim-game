<template>
    <div v-if="graphics" v-for="sprite in mapSpritesheets(graphics)" class="spritesheet-preview"
        :style="spritesheet(sprite)"></div>
</template>

<script lang="ts">
export default {
    inject: ['rpgCurrentPlayer', 'rpgResource'],
    props: {
        graphics: {
            type: Array as () => string[],
            default: () => [],
        },
    },
    methods: {
        mapSpritesheets(graphics: string[]): string[] {
            const spritesheets = graphics.map(
                graphic => this.rpgResource.spritesheets.get(graphic)?.image
            ).filter(sprite => Boolean(sprite));

            return spritesheets as string[];
        },
        spritesheet(sprite: string) {
            return {
                'background-image': `url(${sprite})`,
            }
        },
    },
}
</script>

<style>
.spritesheet-preview {
    margin-top: -300px;
    margin-left: -375px;
    width: 900px;
    height: 900px;
    transform: scale(0.2) translateX(calc(-50%)) translateY(calc(-50%));
}
</style>
