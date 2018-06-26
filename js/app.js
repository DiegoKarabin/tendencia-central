Vue.component('app-single-value-form', {
    template: '#single-value-form',
    data() {
        return {
            valor: undefined,
        }
    },
    computed: {
        habilitar() {
            return this.valor && !isNaN(Number(this.valor));
        }
    },
    methods: {
        enviar() {
            this.$emit('enviar', Number(this.valor));
            this.valor = undefined;
        }
    }
});

Vue.component('app-btn', {
    template: '<button :class="css_classes" @click="action">{{ text }}</button>',
    props: ['type', 'action', 'text'],
    computed: {
        css_classes() {
            return 'btn btn-' + this.type;
        }
    }
});

Vue.component('app-dataset', {
    template: '#dataset',
    props: ['conjunto'],
    methods: {
        retirar(indice) {
            this.$emit('remove', indice);
        }
    }
})

let vm = new Vue({
    el: '#app',
    data: {
        conjunto: [],
        mostrar: false,
        media_aritmetica: undefined,
        mediana: undefined,
        moda: undefined
    },
    methods: {
        agregar(valor) {
            if (this.conjunto.length < 30)
                this.conjunto.push(valor);
        },

        retirar(indice) {
            this.conjunto.splice(indice, 1);
        },

        limpiar() {
            this.conjunto = [];
            this.mostrar = false;
        },

        calcular() {
            this.conjunto.sort((a, b) => a - b);
            this.calcular_media_aritmetica();
            this.mostrar = true;
        },

        calcular_media_aritmetica() {
            if (this.conjunto.length)
                this.media_aritmetica = this.conjunto.reduce(
                    (xi, acum) => acum + xi
                ) / this.conjunto.length;
        }
    }
})