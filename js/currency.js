// currency.js - Detector de billetes (simulado/base para implementar)

const currency = {
    isDetecting: false,

    // Detectar billete
    detect: function() {
        if (this.isDetecting) {
            if (window.voice) {
                window.voice.speak('Ya estoy procesando un billete. Espera un momento.');
            }
            return;
        }

        this.isDetecting = true;

        if (window.voice) {
            window.voice.speak('Esta función está en desarrollo. Por ahora simula la detección. En el futuro podrá reconocer billetes reales usando la cámara.');
        }

        // Simular detección (en producción aquí iría la lógica de ML/visión computacional)
        setTimeout(() => {
            this.simulateDetection();
            this.isDetecting = false;
        }, 2500);
    },

    // Simular detección (para demostración)
    simulateDetection: function() {
        // Billetes bolivianos comunes
        const bolivianBills = [
            { value: 10, color: 'café', description: 'billete de diez bolivianos, color café' },
            { value: 20, color: 'rojo', description: 'billete de veinte bolivianos, color rojo' },
            { value: 50, color: 'naranja', description: 'billete de cincuenta bolivianos, color naranja' },
            { value: 100, color: 'verde', description: 'billete de cien bolivianos, color verde' },
            { value: 200, color: 'azul', description: 'billete de doscientos bolivianos, color azul' }
        ];

        // Seleccionar billete aleatorio para simular
        const detected = bolivianBills[Math.floor(Math.random() * bolivianBills.length)];

        if (window.voice) {
            window.voice.speak(`Billete detectado: ${detected.description}`);
        }
    },

    // Acceder a la cámara (base para implementación real)
    accessCamera: function() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.error('Acceso a cámara no disponible');
            if (window.voice) {
                window.voice.speak('No se puede acceder a la cámara en este dispositivo');
            }
            return;
        }

        navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: 'environment' // Cámara trasera
            } 
        })
        .then(stream => {
            console.log('Cámara accedida exitosamente');
            // Aquí iría la lógica de procesamiento de video
            // Por ahora solo cerramos el stream
            stream.getTracks().forEach(track => track.stop());
        })
        .catch(error => {
            console.error('Error al acceder a la cámara:', error);
            if (window.voice) {
                window.voice.speak('No se pudo acceder a la cámara. Verifica los permisos.');
            }
        });
    },

    // Implementación futura con ML
    // Esta función es un placeholder para cuando se implemente TensorFlow.js o similar
    detectWithML: function(imageData) {
        /*
        NOTA PARA IMPLEMENTACIÓN FUTURA:
        
        1. Usar TensorFlow.js con un modelo preentrenado
        2. Cargar modelo de detección de billetes bolivianos
        3. Procesar frames de video en tiempo real
        4. Identificar características: tamaño, color dominante, patrones
        5. Retornar valor y confianza de detección
        
        Ejemplo de estructura:
        
        const model = await tf.loadLayersModel('path/to/model.json');
        const tensor = tf.browser.fromPixels(imageData);
        const prediction = model.predict(tensor);
        const [value, confidence] = await prediction.data();
        
        return { value, confidence };
        */

        console.log('Detección ML no implementada aún. Usando simulación.');
        return null;
    },

    // Información educativa sobre billetes
    getBillInfo: function(value) {
        const info = {
            10: 'Billete de 10 bolivianos. Color café. Presenta la imagen de Cecilio Guzmán de Rojas.',
            20: 'Billete de 20 bolivianos. Color rojo. Presenta la imagen de Pantaleón Dalence.',
            50: 'Billete de 50 bolivianos. Color naranja. Presenta la imagen de Melchor Pérez de Holguín.',
            100: 'Billete de 100 bolivianos. Color verde. Presenta la imagen de Gabriel René Moreno.',
            200: 'Billete de 200 bolivianos. Color azul. Presenta la imagen de Franz Tamayo.'
        };

        return info[value] || 'Información no disponible';
    }
};

// Exportar para uso global
window.currency = currency;