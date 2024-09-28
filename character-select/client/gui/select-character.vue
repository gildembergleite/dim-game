<template>
    <div>
        <div class="character-select">
            <div v-if="!showApp2" class="character-select__preview-wrapper">
                <CharacterPreview :graphics="graphics()" />
            </div>
            <div class="character-select__description-wrapper" v-if="currentActor">
                <div class="character-select__description-content">
                    <h2 class="character-select__title">
                        <span class="character-select__actor-name">{{ currentActor.name === '' ? 'Espaço Vazio' : currentActor.name }}&nbsp;</span>
                    </h2>
                    <div class="character-select__actor-nickname">
                        <p><i>{{ currentActor.name === '' ? '' : currentActor.class.name }}</i></p>
                        <p>{{ currentActor.name === '' ? '' : 'Level: ' + currentActor.level }}</p>
                        <p>{{ currentActor.name === '' ? '' : 'Mapa: ' + currentActor.map }}</p>
                    </div>
                </div>
                <div>
                    <button @click="handleButtonClick()" class="btn-success character-select__submit-button">{{ currentActor.name === '' ? 'Criar Personagem' : 'Entrar' }}</button>
                </div>
            </div>
            <button v-if="!showApp2" @click="handlePreviousCharacter()" class="character-select__arrow-left"></button>
            <button v-if="!showApp2" @click="handleNextCharacter()" class="character-select__arrow-right"></button>
        </div>
        <div v-if="showApp2">
            <div class="character-select">
                <div class="character-select__preview-wrapper_new">
                    <CharacterPreview :graphics="graphicsClasses()" />
                </div>
                <div class="character-select__description-wrapper_new" v-if="currentnewClasses">
                    <h2 class="character-select__title">
                        <span class="character-select__actor-name_new">{{ currentnewClasses.name }}&nbsp;</span>
                    </h2>
                </div>
            <button v-if="showApp2" @click="handlePreviousClasses()" class="character-select__arrow-left_new"></button>
            <button v-if="showApp2" @click="handleNextClasses()" class="character-select__arrow-right_new"></button>
            <form v-if="showApp2">
             <input class="character-select__input-text" type="text" placeholder="Nickname" v-model="new_nickname" >
            </form>
            </div>
            <button @click="handleButtonCreate()" class="btn-success character-select__check-ok-button" :disabled="isButtonDisabled" :class="{ 'btn-disabled character-select__check-ok-button-disabled': isButtonDisabled }">Criar Personagem</button>
        </div>
    </div>
</template>

<script lang="ts">
import CharacterPreview from './../src/components/CharacterPreview.vue';
import ClassGraphics from './../../server/src/graphics/ClassGraphics'
import App2 from './../gui/create-character.vue'; // Importe o componente App2
import axios from 'axios';

interface Actor {
    id: string,
    name: string,
    level: string,
    nickname: string,
    description: string,
    map: string,
    class: {
        type: string,
        graphics: object,
    }
}

interface newClasses {
    id: string,
    name: string,
    description: string,
    class: {
        type: string,
        graphics: object,
    }
}

export default {
    name: 'rpg-character-select',
    inject: ['rpgGuiInteraction'],
    props: {
        actors: {
            type: Array as () => Actor[],
            default: () => [],
        },
        newClasses: {
            type: Array as () => newClasses[],
            default: () => [],
        },
    },
    components: {
        CharacterPreview,
        App2,
    },
    data: () => ({
        currentSelectedActor: null as string | null,
        currentSelectednewClasses: null as string | null,
        showApp2: false,
        new_nickname: '',
        createNewPerson: false,
    }),
    mounted() {
        this.currentSelectedActor = 1;
        this.currentSelectednewClasses = Object.keys(this.newClasses)[0];

    },
    computed: {
        currentActor(): Actor {
            return this.actors[this.currentSelectedActor];
        },
        currentnewClasses(): newClasses {
            return this.newClasses[this.currentSelectednewClasses];
        },
        isButtonDisabled() {
            return this.new_nickname.trim() === '';
        },
        createPerson() {
            axios.get('https://352e-177-22-43-53.ngrok-free.app/api/users/?nickname='+this.new_nickname).then(function (response) {
                if (response.data.results.length === 0) {
                    return true;
                } else {
                    return false;
                }
            });
        }
    },
    methods: {
        handleButtonClick() {
            if (this.currentActor.name === '') {
                this.showApp2 = !this.showApp2;
            } else {
                this.handleSelectCurrentActor();
            }
        },
        handleButtonCreate() {
            console.log(this.newClasses)
            this.actors[this.currentSelectedActor] = {
                id: this.newClasses[this.currentSelectednewClasses].id,
                name: this.newClasses[this.currentSelectednewClasses].name,
                level: 1,
                nickname: this.new_nickname,
                description: this.newClasses[this.currentSelectednewClasses].description,
                map: "simplemap",
                class: {
                    type: this.newClasses[this.currentSelectednewClasses].class.type,
                    graphics: this.newClasses[this.currentSelectednewClasses].class.graphics,
                }
            }
            this.createNewPerson = true;
            this.showApp2 = !this.showApp2;
        },
        handleSelectCurrentActor() {
            console.log("ActorID Selecionado ", this.currentSelectedActor)
            this.rpgGuiInteraction('rpg-character-select', 'character-selected', {
                actorId: this.currentSelectedActor,
                newClassesId: this.currentSelectednewClasses,
                createNewPerson: this.createNewPerson,
                newClasses: this.newClasses,
                actors: this.actors
            });
        },
        handlePreviousCharacter() {
            const ids = Object.keys(this.actors);

            const currentIndex = ids.findIndex(id => id === this.currentSelectedActor);
            const previousIndex = currentIndex - 1;

            if (previousIndex < 0) {
                this.currentSelectedActor = ids[ids.length - 1];
            } else {
                this.currentSelectedActor = ids[previousIndex];
            }
        },
        handlePreviousClasses() {
            const ids = Object.keys(this.newClasses);

            const currentIndex = ids.findIndex(id => id === this.currentSelectednewClasses);
            const previousIndex = currentIndex - 1;

            if (previousIndex < 0) {
                this.currentSelectednewClasses = ids[ids.length - 1];
            } else {
                this.currentSelectednewClasses = ids[previousIndex];
            }
        },
        handleNextCharacter() {
            const ids = Object.keys(this.actors);

            const currentIndex = ids.findIndex(id => id === this.currentSelectedActor);
            const nextIndex = currentIndex + 1;

            if (nextIndex > ids.length - 1) {
                this.currentSelectedActor = ids[0];
            } else {
                this.currentSelectedActor = ids[nextIndex];
            }
        },
        handleNextClasses() {
            const ids = Object.keys(this.newClasses);
            console.log(ids)
            const currentIndex = ids.findIndex(id => id === this.currentSelectednewClasses);
            const nextIndex = currentIndex + 1;

            if (nextIndex > ids.length - 1) {
                this.currentSelectednewClasses = ids[0];
            } else {
                this.currentSelectednewClasses = ids[nextIndex];
            }
        },
        graphics() {
            if (!this.currentSelectedActor) {
                this.currentSelectedActor = 1;
            }
            const actor = this.actors[this.currentSelectedActor];
            return [
                ...actor.class.graphics.pernament,
                ...Object.values(actor.class.graphics.baseEquipment),
            ];
        },
        graphicsClasses() {
            if (!this.currentSelectednewClasses) {
                return [];
            }
            const classes = this.newClasses[this.currentSelectednewClasses];
            console.log(this.newClasses)
            return [
                ...classes.class.graphics.pernament,
                ...Object.values(classes.class.graphics.baseEquipment),
            ];
        }
    }
}
</script>

<style lang="scss">
$character-select-screen-background: url('../assets/backgrounds/character-select.png') !default;
$window-button-success-color: #1c8634 !default;
$window-button-success-shadow: #0d4c30 !default;
$window-button-color: rgba(128, 130, 162, 0.7) !default;
$window-button-shadow: rgb(128, 130, 162) !default;

$character-select-arrow-left-image: url('../assets/gui/arrow-left.png') !default;
$character-select-arrow-right-image: url('../assets/gui/arrow-right.png') !default;

.character-select {
    background: $character-select-screen-background;
    background-size: cover;
    background-position: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    &__preview-wrapper {
        position: absolute;
        top: 58%;
        left: 50%;
    }

    &__preview-wrapper_new {
        position: absolute;
        top: 40%;
        left: 30%;
    }

    &__arrow-left,
    &__arrow-right {
        background-size: 100% 100%;
        width: 100px;
        height: 100px;
        background-color: transparent;
        border: none;
        outline: none;
        position: absolute;
        top: 62%;
        left: 25%;
        filter: brightness(1.5);
        filter: brightness(0.9);
        transition: filter 0.15s ease-in-out;
        z-index: 100;

        &:hover {
            cursor: pointer;
            filter: brightness(1);
        }
    }

    &__arrow-left_new {
        background-size: 100% 100%;
        width: 100px;
        height: 100px;
        background-color: transparent;
        border: none;
        outline: none;
        position: absolute;
        top: 62%;
        left: 25%;
        filter: brightness(1.5);
        filter: brightness(0.9);
        transition: filter 0.15s ease-in-out;
        z-index: 100;

        &:hover {
            cursor: pointer;
            filter: brightness(1);
        }
    }

    &__arrow-right_new {
        background-size: 100% 100%;
        width: 100px;
        height: 100px;
        background-color: transparent;
        border: none;
        outline: none;
        position: absolute;
        top: 62%;
        left: 25%;
        filter: brightness(1.5);
        filter: brightness(0.9);
        transition: filter 0.15s ease-in-out;
        z-index: 100;

        &:hover {
            cursor: pointer;
            filter: brightness(1);
        }
    }

    &__arrow-right {
        background-image: $character-select-arrow-right-image;
        left: unset;
        right: 25%;
    }

    &__arrow-left_new {
        background-image: $character-select-arrow-left-image;
    }

    &__arrow-right_new {
        background-image: $character-select-arrow-right-image;
        left: unset;
        right: 25%;
    }

    &__arrow-left {
        background-image: $character-select-arrow-left-image;
    }

    &__actor-nickname {
    
    }

    &__description-content {
        width: 300px;
        height: 150px;
        background: rgba(255, 255, 255, 0.7);
        color: #000000;
        border-radius: 7px;
        padding: 1rem;
        margin-top: -100px;
        overflow: auto;
        display: flex;
        align-items: baseline;
        justify-content: center;


        &::-webkit-scrollbar {
            width: 5px;
            background: #fff;
        }

        &::-webkit-scrollbar-thumb {
            background-color: rgb(0, 0, 0, .5);
        }

        &::-webkit-scrollbar-track {
            background-color: #fff;
        }
    }

    &__description-wrapper {
        position: absolute;
        top: 20%;
        right: 30%;
    }

    &__description-wrapper_new {
        position: absolute;
        top: 20%;
        right: 40%;
        font-size: 24px;
    }

    &__submit-button {
        position: absolute;
        bottom: 10%;
        left: 50%;
        transform: translateX(-50%);
        width: 200px;
        height: 50px;
    }

    &__check-ok-button {
        position: absolute;
        bottom: 10%;
        left: 50%;
        transform: translateX(-50%);
        width: 200px;
        height: 50px;
    }

    &__check-ok-button-disabled {
        position: absolute;
        bottom: 10%;
        left: 50%;
        transform: translateX(-50%);
        width: 200px;
        height: 50px;
    }

    &__title {
        margin: 0;
        padding: 0;
    }

    &__input-text {
    position: absolute;
    left: 60%;
    top: 45%;
    width: 240px;
    height: 30px;
    border: none;
    border-radius: 8px;
    }
}

.btn-success {
    min-width: 130px;
    height: 40px;
    color: #fff;
    padding: 5px 10px;
    font-weight: bold;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-block;
    outline: none;
    border-radius: 5px;
    border: none;
    background: $window-button-success-color;
}

.btn-disabled {
    color: #5d5d5d;
    min-width: 130px;
    height: 40px;
    background: rgb(110 116 140);
    padding: 5px 10px;
    font-weight: bold;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-block;
    outline: none;
    border-radius: 5px;
    border: none;
}

.btn-success:hover {
    box-shadow: 0 3px $window-button-success-shadow;
}

.btn-success:active {
    box-shadow: 0 0 $window-button-success-shadow;
}
</style>

.form {
    text-align: center;
}

.login {
    margin-right: 10px;

.input-text {
    position: absolute;
    left: 60%;
    top: 45%;
    width: 240px;
    height: 30px;
    border: none;
    border-radius: 8px;

}