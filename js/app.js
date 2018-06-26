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
        media_geometrica: undefined,
        media_armonica: undefined,
        media_cuadratica: undefined,
        mediana: undefined,
        moda: undefined,
        varianza: undefined,
        desviacion: undefined
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
            if (this.conjunto.length) {
                this.conjunto.sort((a, b) => a - b);
                this.media_aritmetica = this.calcular_media_aritmetica();
                this.media_geometrica = this.calcular_media_geometrica();
                this.media_armonica = this.calcular_media_armonica();
                this.media_cuadratica = this.calcular_media_cuadratica();
                this.mediana = this.calcular_mediana();
                this.moda = this.calcular_moda();
                this.varianza = this.calcular_varianza();
                this.desviacion = Math.sqrt(this.varianza);
                this.mostrar = true;
            }
        },

        calcular_media_aritmetica() {
            return this.conjunto.reduce(
                (acum, xi) => acum + xi
            ) / this.conjunto.length;
        },

        calcular_media_geometrica() {
            return Math.pow(
                this.conjunto.reduce(
                    (acum, xi) => acum * xi
                ),
                1 / this.conjunto.length
            );
        },

        calcular_media_armonica() {
            return this.conjunto.length / (
                this.conjunto.reduce(
                    (acum, xi) => acum + (1 / xi), 0
                )
            );
        },

        calcular_media_cuadratica() {
            return Math.sqrt(
                this.conjunto.reduce(
                    (acum, xi) => acum + Math.pow(xi, 2), 0
                ) / this.conjunto.length
            );
        },

        calcular_mediana() {
            let len = this.conjunto.length;
            if (len % 2 == 0) {
                let mitad = len / 2;
                return (this.conjunto[mitad] +
                        this.conjunto[mitad - 1]) / 2;
            }

            return this.conjunto[(len - 1) / 2];
        },

        calcular_moda() {
            let numbers = [];

            function look(number) {
                for (let i = 0; i < numbers.length; i++)
                    if (numbers[i].number == number)
                        return i;

                return -1;
            }

            this.conjunto.forEach((element) => {
                let index = look(element);
                if (index == -1)
                    numbers.push({
                        number: element,
                        frequency: 1
                    });
                else
                    numbers[index].frequency++;
            });

            if (numbers.every(element => element.frequency == 1))
                return 'No hay moda';
            
            numbers.sort((a, b) => b.frequency - a.frequency);
            let mod = '';
            numbers.forEach((element) => {
                if (element.frequency == numbers[0].frequency)
                    mod += element.number + ', ';
            });
            let s = mod.split(',');
            s.pop();
            mod = s.join(',');

            return mod;
        },

        calcular_varianza() {
            return this.conjunto.reduce(
                (acum, xi) => acum + Math.pow(
                    (xi - this.media_aritmetica), 2
                ), 0) / this.conjunto.length;
        }
    }
})