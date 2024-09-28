<template>
    <div class="enemy-player">
        <div class="enemy-player__photo-class">
            <div class="circle-enemy">
                <div class="spritesheet-preview-enemy" :style="spritesheet()" />
            </div>
        </div>
        <div class="health-enemy-bar">
            <p> {{ this.otherPlayer.name }} </p>
            <span class="info-enemy-stats"> Level: {{ this.otherPlayer.level }} | Fase: {{ this.otherPlayer._class.nivel.name }} </span>
            <div class="bar">
                <div class="inner-enemy-bar" :style="{ width }"></div>
            </div>
            <span class="hp-maxHp-enemy"> {{ this.otherPlayer.hp }}/{{ this.otherPlayer.maxHp }}</span>
        </div>
    </div>
</template>

<script>

import CharacterPreview from './../src/components/CharacterPreview.vue';

export default {
    name: 'rpg-enemy-player',
    inject: ['rpgResource'],
    props: {
        otherPlayer: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            hp: 0,
            maxHp: 0,
            level: 0,
            name: "",
            atributo: "",
            nivel: "",
        }
    },
    mounted() {
        console.log("Teste")
    },
    computed: {
        width() {
            return ((this.otherPlayer.hp / this.otherPlayer.maxHp) * 100) + '%'
        },
    },
    methods: {
        graphics() {
            return [
                ...this.otherPlayer._class.graphics.pernament,
                ...Object.values(this.otherPlayer._class.graphics.baseEquipment),
            ];
        },
        spritesheet() {
            return {
                'background-image': `url(${this.rpgResource.spritesheets.get(this.otherPlayer._class.graphics.pernament[0])?.image})`,
            }
        },
    }
}
</script>

<style>

.circle-enemy {
    width: 100px;
    height: 100px;
    border-radius: 50%; /* Define o border-radius para 50% para criar um círculo */
    overflow: hidden; /* Garante que a imagem dentro do círculo não ultrapasse os limites do círculo */
/*    border: 2px solid #3498db; */
    position: absolute;
    top: 60px;
    left: 10px;
}

/* Estilizando a imagem */
.circle-enemy img {
    width: 100%; /* Ajusta a largura da imagem para 100% do contêiner pai (.circle-enemy) */
    display: block; /* Remove espaços extras abaixo da imagem */
}

.spritesheet-preview-enemy {
    margin-top: -282px;
    margin-left: -286px;
    width: 900px;
    height: 900px;
    transform: scale(0.09) translateX(calc(-146%)) translateY(calc(-141%));
}

.enemy-player{
    &__photo-class {
        position: absolute;
        top: 58%;
        left: 50%;
    }
}

.hp-maxHp-enemy{
    position: absolute;
    top: 51px;
    left: 76px;
    font-size: 8px;
    font-family: 'Arial Rounded MT Bold', sans-serif;
}

.health-enemy-bar {
    width: 200px;
    position: absolute;
    top: 0px;
    left: 10px;
    display: flex;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 10px;
}

.health-enemy-bar p {
    margin: 5px;
    color: black;
    font-size: 21px;
    font-weight: bold;
    font-family: 'Arial Rounded MT Bold', sans-serif;
}

.info-enemy-stats {
    margin-left: 5px;
    color: black;
    font-size: 12px;
    font-family: 'Arial Rounded MT Bold', sans-serif;
}

.bar {
    border: 2px solid black;
    border-radius: 5px;
    position: relative;
}

.inner-enemy-bar {
  background: #c54;
  height: 10px;
  position: relative;
  transition: width .5s linear;
}

</style>