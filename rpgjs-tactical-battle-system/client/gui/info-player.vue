<template>
    <div class="info-player">
        <div class="info-player__photo-class">
            <div class="circle">
                <div class="spritesheet-preview" :style="spritesheet()" />
            </div>
        </div>
        <div class="health-bar">
            <p> {{ name }} </p>
            <span class="stats"> {{ classe.name }} | Level: {{ level }} | Fase: {{ this.nivel }} </span>
            <div class="bar">
                <div class="inner-bar" :style="{ width }"></div>
            </div>
            <span class="hp-maxHp-player"> {{hp}}/{{maxHp}} </span>
        </div>
    </div>
</template>

<script>

import CharacterPreview from './../src/components/CharacterPreview.vue';

export default {
    name: 'rpg-info-player',
    inject: ['rpgCurrentPlayer', 'rpgResource'],
    props: {
        classe: {
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
        console.log(this.classe)
        this.obsCurrentPlayer = this.rpgCurrentPlayer
            .subscribe(({ object }) => {
                this.hp = object.hp
                this.maxHp = object.param.maxHp
                this.level = object.level
                this.name = object.name
                this.atributo = this.classe.nivel.atributo
                this.nivel = this.classe.nivel.name
            })
    },
    computed: {
        width() {
            return ((this.hp / this.maxHp) * 100) + '%'
        },
        height() {
            return ((this.hp / this.maxHp) * 100) + '%' 
        }
    },
    unmounted() {
        this.obsCurrentPlayer.unsubscribe()
    },
    methods: {
        graphics() {
            return [
                ...this.classe.graphics.pernament,
                ...Object.values(this.classe.graphics.baseEquipment),
            ];
        },
        spritesheet() {
            return {
                'background-image': `url(${this.rpgResource.spritesheets.get(this.classe.graphics.pernament[0])?.image})`,
            }
        },
    }
}
</script>

<style>

.circle {
    width: 100px;
    height: 100px;
    border-radius: 50%; /* Define o border-radius para 50% para criar um círculo */
    overflow: hidden; /* Garante que a imagem dentro do círculo não ultrapasse os limites do círculo */
/*    border: 2px solid #3498db; */
    position: absolute;
    bottom: 60px;
    left: 10px;
}

/* Estilizando a imagem */
.circle img {
    width: 100%; /* Ajusta a largura da imagem para 100% do contêiner pai (.circle) */
    display: block; /* Remove espaços extras abaixo da imagem */
}

.spritesheet-preview {
    margin-top: -282px;
    margin-left: -286px;
    width: 900px;
    height: 900px;
    transform: scale(0.09) translateX(calc(-146%)) translateY(calc(-141%));
}

.info-player{
    &__photo-class {
        position: absolute;
        top: 58%;
        left: 50%;
    }
}

.hp-maxHp-player{
    position: absolute;
    bottom: 2px;
    font-size: 8px;
    left: 76px;
    font-family: 'Arial Rounded MT Bold', sans-serif;
}

.health-bar {
    width: 200px;
    position: absolute;
    bottom: 0px;
    left: 10px;
    display: flex;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 10px;
}

.health-bar p {
    margin: 5px;
    color: black;
    font-size: 21px;
    font-weight: bold;
    font-family: 'Arial Rounded MT Bold', sans-serif;
}

.stats {
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

.inner-bar {
  background: #c54;
  height: 10px;
  position: relative;
  transition: width .5s linear;
}

</style>