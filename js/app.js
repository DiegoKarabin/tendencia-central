function buscar(arreglo, caso) {
    for (let i = 0; i < arreglo.length; i++)
        if (caso(arreglo[i]))
            return i;

    return -1;
}

Vue.component('app-footer', {
    template: '<footer class="footer"><p>&copy; 2018 - Diego Karabin</p></footer>'
})

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

Vue.component('app-double-value-form', {
    template: '#double-value-form',
    data() {
        return {
            valor: undefined,
            frecuencia: undefined
        }
    },
    computed: {
        habilitar() {
            return this.numero_valido(this.valor) &&
                   this.numero_valido(this.frecuencia);
        }
    },
    methods: {
        numero_valido(numero) {
            return numero && !isNaN(Number(numero));
        },

        enviar() {
            this.$emit('enviar', Number(this.valor), Number(this.frecuencia));
            this.valor = undefined;
            this.frecuencia = undefined;
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
});

Vue.component('app-few-values', {
    template: '#few-values',
    data() {
        return {
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
        }
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

            this.conjunto.forEach((element) => {
                let index = buscar(numbers, item => item.number == element);
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
});

Vue.component('app-many-values', {
    template: '#many-values',
    data() {
        return {
            conjunto: [],
            mostrar: false,
            media_aritmetica: undefined,
            mediana: undefined,
            moda: undefined,
            varianza: undefined,
            desviacion: undefined
        }
    },
    methods: {
        agregar(valor, frecuencia) {
            let indice = buscar(this.conjunto, item => item.numero == valor);

            if (indice == -1)
                this.conjunto.push({
                    numero: valor,
                    frecuencia: frecuencia
                });
            else
                this.conjunto[indice].frecuencia += frecuencia;
        },

        retirar(indice) {
            this.conjunto.splice(indice, 1);
        },

        limpiar() {
            this.conjunto = [];
            this.mostrar = false;
        },

        calcular() {
            this.conjunto.sort((a, b) => a.numero - b.numero);
            this.mostrar = true;
            this.media_aritmetica = this.calcular_media_aritmetica();
            this.mediana = this.calcular_mediana();
            this.moda = this.calcular_moda();
            this.varianza = this.calcular_varianza();
            this.desviacion = Math.sqrt(this.varianza);
        },

        calcular_media_aritmetica() {
            return this.conjunto.reduce(
                (acum, xi) => acum + xi.frecuencia * xi.numero, 0
            ) / this.conjunto.reduce(
                (acum, xi) => acum + xi.frecuencia, 0
            );
        },

        calcular_mediana() {
            let len = this.conjunto.length;
            if (len % 2 == 0) {
                let mitad = len / 2;
                return (this.conjunto[mitad].numero +
                        this.conjunto[mitad - 1].numero) / 2;
            }

            return this.conjunto[(len - 1) / 2].numero;
        },

        calcular_moda() {
            if (this.conjunto.every(elemento => elemento.frequencia == 1))
                return 'No hay moda';
            
            let mayor_frecuencia = this.conjunto.reduce(
                (mayor, xi) => {
                    if (xi.frecuencia > mayor)
                        return xi.frecuencia;
                    return mayor;
                }, 0),
                mod = '';
            this.conjunto.forEach((elemento) => {
                if (elemento.frecuencia == mayor_frecuencia)
                    mod += elemento.numero + ', ';
            });
            let s = mod.split(',');
            s.pop();
            mod = s.join(',');

            return mod;
        },

        calcular_varianza() {
            return (this.conjunto.reduce(
                (acum, xi) => acum + (
                    Math.pow(xi.numero, 2) * xi.frecuencia)
                , 0) / this.conjunto.reduce(
                    (acum, xi) => acum + xi.frecuencia, 0
                )) - Math.pow(this.media_aritmetica, 2);
        }
    }
});

let vm = new Vue({
    el: '#app',
    data: {
        opcion: undefined
    }
});