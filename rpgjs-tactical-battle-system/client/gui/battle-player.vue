<template>
    <div class="battle-player">
        <div class="battle-bar">
            <p :style="{ color: this.turn ? '#2986cc' : 'red' }"> {{ this.turn ? 'Seu Turno' : 'Turno do Oponente' }} </p>
            <span> Pontos de Ação: {{ this.turnRoute }} | Máximo: {{ this.maxTurnRoute }} </span>
            <div class="bar">
                <div class="battle-inner-bar" :style="{ width }"></div>
            </div>
        </div>
    </div>
</template>

<script>

import CharacterPreview from './../src/components/CharacterPreview.vue';

export default {
    name: 'rpg-battle-player',
    inject: ['rpgCurrentPlayer', 'rpgResource'],
    props: {
        classe: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            turnRoute: 0,
            maxTurnRoute: 0,
            turn: "",
            name: "",
        }
    },
    mounted() {
        this.obsCurrentPlayer = this.rpgCurrentPlayer
            .subscribe(({ object }) => {
                this.turnRoute = this.classe.MAX_ROUTE - this.classe.turnRoute
                this.maxTurnRoute = this.classe.MAX_ROUTE
                this.turn = this.classe.myTurn
                this.name = this.classe.MAX_ROUTE
            })
    },
    computed: {
        width() {
            return ((this.turnRoute / this.maxTurnRoute) * 100) + '%'
        },
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

.battle-player{
    &__photo-class {
        position: absolute;
        top: 58%;
        left: 50%;
    }
}

.battle-bar {
    width: 220px;
    position: absolute;
    bottom: 0px;
    left: 235px;
    display: flex;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 10px;
}

.battle-bar p {
    margin: 5px;
    font-size: 21px;
    font-weight: bold;
    font-family: 'Arial Rounded MT Bold', sans-serif;
}

.battle-bar span {
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

.battle-inner-bar {
  background: #2986cc;
  height: 10px;
  position: relative;
  transition: width .5s linear;
}

.heart-main-border{
    transform: scale(0.24);
    bottom: -265px;
    position: absolute;
}

.heart-main{
    transform: scale(0.22);
    bottom: -265px;
    position: absolute;
}

.heart-main p {
    margin-left: 5px;
    bottom: 230px;
    left: 239px;
    position: absolute;
    color: white;
    font-size: 64px;
    font-weight: bold;
    font-family: 'Arial Rounded MT Bold', sans-serif;
}

.heart {
    margin: 200px;
    background-color: red;
    background: linear-gradient(to bottom, transparent 0%, white 100%);
    height: 200px;
    transform: rotate(-45deg);
    width: 200px;
    position: relative;
    animation: heartbeat 1s infinite alternate;

}

.heart:before,
.heart:after {
  content: "";
  background-color: red;
  border-radius: 50%;
  height: 200px;
  position: absolute;
  width: 200px;
}

.heart:before {
    top: -100px;
}

.heart:after {
    left: 100px;
}

.heart-border {
    margin: 200px;
    background-color: #AA0000;
    height: 200px;
    transform: rotate(-45deg);
    width: 200px;
    position: relative;
}

.heart-border:before,
.heart-border:after {
  content: "";
  background-color: #AA0000;
  border-radius: 50%;
  height: 200px;
  position: absolute;
  width: 200px;
}

.heart-border:before {
    top: -100px;
}

.heart-border:after {
    left: 100px;
}

.star-main{
    transform: scale(0.3);
    bottom: -93px;
    left: 180px;
    position: absolute;
}

.star {
margin: 100px;
position: relative;
display: block;
width: 0px;
height: 0px;
border-right: 100px solid transparent;
border-bottom: 70px solid blue;
border-left: 100px solid transparent;
transform: rotate(35deg);
}

.star:before {
border-bottom: 80px solid blue;
border-left: 30px solid transparent;
border-right: 30px solid transparent;
position: absolute;
height: 0;
width: 0;
top: -45px;
left: -65px;
display: block;
content: "";
transform: rotate(-35deg);
}

.star:after {
position: absolute;
display: block;
top: 3px;
left: -105px;
width: 0px;
height: 0px;
border-right: 100px solid transparent;
border-bottom: 70px solid blue;
border-left: 100px solid transparent;
transform: rotate(-70deg);
content: "";
}

.star-main-border{
    transform: scale(0.36);
    bottom: -93px;
    left: 181px;
    position: absolute;
}

.star-border {
margin: 100px;
position: relative;
display: block;
width: 0px;
height: 0px;
border-right: 100px solid transparent;
border-bottom: 70px solid #000080;
border-left: 100px solid transparent;
transform: rotate(35deg);
}

.star-border:before {
border-bottom: 80px solid #000080;
border-left: 30px solid transparent;
border-right: 30px solid transparent;
position: absolute;
height: 0;
width: 0;
top: -45px;
left: -65px;
display: block;
content: "";
transform: rotate(-35deg);
}

.star-border:after {
position: absolute;
display: block;
top: 3px;
left: -105px;
width: 0px;
height: 0px;
border-right: 100px solid transparent;
border-bottom: 70px solid #000080;
border-left: 100px solid transparent;
transform: rotate(-70deg);
content: "";
}

</style>