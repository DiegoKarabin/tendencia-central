Vue.component('app-single-value-form', {
    template: '#single-value-form',
    data() {
        return {
            valor: undefined,
        }
    },
    methods: {
        enviar() {
            this.$emit('enviar', this.valor);
            this.valor = undefined;
        }
    }
});

let vm = new Vue({
    el: '#app',
    data: {
        conjunto: [],
        mostrar: false,
    },
    computed: {
        media_aritmetica() {
            if (this.conjunto.length)
                return this.conjunto.reduce(
                    (xi, acum) => acum + xi
                ) / this.conjunto.length;
        }
    },
    methods: {
        agregar(valor) {
            if (this.conjunto.length < 30) {
                this.conjunto.push(Number(valor));
            }
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
            this.mostrar = true;
        }
    }
})