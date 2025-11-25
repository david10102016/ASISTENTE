// voice.js - Sistema de voz (reconocimiento y síntesis)

const voice = {
    recognition: null,
    synth: window.speechSynthesis,
    isListening: false,
    lastCommand: '',
    lastResponse: 'Bienvenido. Di "Ayuda" para conocer los comandos.',

    // Inicializar reconocimiento de voz
    initRecognition: function() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.error('Reconocimiento de voz no soportado');
            return false;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'es-ES';
        this.recognition.continuous = true;  // CAMBIADO: permite escuchar más tiempo
        this.recognition.interimResults = true; // CAMBIADO: detecta mientras hablas
        this.recognition.maxAlternatives = 1;

        this.recognition.onstart = () => {
            this.isListening = true;
            this.updateUI('listening');
            console.log('🎤 Micrófono activado - Habla ahora');
        };

        this.recognition.onresult = (event) => {
            const results = event.results;
            const lastResult = results[results.length - 1];
            
            if (lastResult.isFinal) {
                const command = lastResult[0].transcript;
                console.log('📝 Comando detectado:', command);
                this.lastCommand = command;
                this.updateCommandDisplay(command);
                this.recognition.stop(); // Detener después de recibir comando
                this.processCommand(command);
            }
        };

        this.recognition.onerror = (event) => {
            console.error('❌ Error de reconocimiento:', event.error);
            this.isListening = false;
            this.updateUI('idle');
            
            if (event.error === 'no-speech') {
                console.log('⚠️ No se detectó voz');
                this.speak('No escuché nada. Intenta de nuevo.');
            } else if (event.error === 'aborted') {
                console.log('⚠️ Reconocimiento cancelado');
            } else {
                this.speak('Hubo un error. Intenta de nuevo.');
            }
        };

        this.recognition.onend = () => {
            this.isListening = false;
            this.updateUI('idle');
            console.log('🔴 Micrófono desactivado');
        };

        return true;
    },

    // Iniciar escucha
    startListening: function() {
        if (!this.recognition) {
            if (!this.initRecognition()) {
                alert('Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge.');
                return;
            }
        }

        if (!this.isListening) {
            try {
                this.recognition.start();
            } catch (error) {
                console.error('Error al iniciar reconocimiento:', error);
            }
        }
    },

    // Síntesis de voz (hablar)
    speak: function(text) {
        this.synth.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        this.synth.speak(utterance);
        this.lastResponse = text;
        this.updateResponseDisplay(text);
        console.log('🔊 Respuesta:', text);
    },

    // Procesar comando de voz
    processCommand: function(command) {
        const cmd = command.toLowerCase().trim();

        // HORA
        if (cmd.includes('hora')) {
            this.speak(datetime.getTimeVoice());
        }
        // FECHA
        else if (cmd.includes('fecha') && !cmd.includes('día')) {
            this.speak(datetime.getDateVoice());
        }
        // DÍA
        else if (cmd.includes('día') && !cmd.includes('fecha')) {
            this.speak(datetime.getDayVoice());
        }
        // MES
        else if (cmd.includes('mes')) {
            this.speak(datetime.getMonthVoice());
        }
        // AÑO
        else if (cmd.includes('año')) {
            this.speak(datetime.getYearVoice());
        }
        // RECORDATORIOS - LISTAR (DEBE IR ANTES QUE CREAR)
        else if (cmd.includes('mis recordatorios') || cmd.includes('lista de recordatorios') || cmd.includes('qué recordatorios')) {
            const list = reminders.getAll();
            if (list.length === 0) {
                this.speak('Aún no tienes recordatorios. Para crear uno, di: "Recordar" seguido de tu mensaje. Por ejemplo: "Recordar comprar pan" o "Recordar tomar medicina a las 8"');
            } else {
                let text = `Tienes ${list.length} recordatorio${list.length > 1 ? 's' : ''}: `;
                list.forEach((r, i) => {
                    text += `${i + 1}. ${r.text}. `;
                });
                this.speak(text);
            }
        }
        // RECORDATORIO - AGREGAR
        else if (cmd.includes('recordar') || cmd.includes('recordatorio')) {
            let reminderText = command.trim();
            
            // Buscar y eliminar las palabras clave del inicio
            const keywords = ['recordar', 'recordatorio', 'agregar', 'añadir', 'recuérdame', 'recordarme'];
            for (const keyword of keywords) {
                const regex = new RegExp(`^${keyword}\\s+`, 'gi');
                reminderText = reminderText.replace(regex, '');
            }
            
            // También eliminar "que" al inicio si quedó
            reminderText = reminderText.replace(/^que\s+/gi, '').trim();
            
            if (reminderText.length > 2) {
                reminders.add(reminderText);
                this.speak(`Recordatorio guardado: ${reminderText}`);
            } else {
                this.speak('¿Qué quieres que recuerde? Di: recordar seguido de tu mensaje.');
            }
        }
        // BRÚJULA - DIRECCIÓN
        else if (cmd.includes('dirección') || cmd.includes('hacia dónde') || cmd.includes('norte') || cmd.includes('sur') || cmd.includes('este') || cmd.includes('oeste') || cmd.includes('brújula')) {
            orientation.getDirection();
        }
        // LUZ - NIVEL
        else if (cmd.includes('luz') || cmd.includes('iluminación') || cmd.includes('oscuro') || cmd.includes('brillante') || cmd.includes('iluminado')) {
            orientation.getLightLevel();
        }
        // BILLETE - DETECTAR
        else if (cmd.includes('billete') || cmd.includes('dinero') || cmd.includes('moneda') || cmd.includes('bolivianos')) {
            currency.detect();
        }
        // AYUDA
        else if (cmd.includes('ayuda') || cmd.includes('comandos') || cmd.includes('qué puedes hacer') || cmd.includes('que puedes hacer')) {
            this.speak('Puedo ayudarte con: consultar hora actual, fecha, día de la semana, mes y año. Crear y listar recordatorios. Saber hacia dónde miras usando la brújula. Detectar nivel de luz del ambiente. Y reconocer billetes. ¿Qué necesitas?');
        }
        // NO ENTENDIDO
        else {
            this.speak('No entendí tu solicitud. Di "ayuda" para conocer los comandos disponibles.');
        }
    },

    // Actualizar interfaz según estado
    updateUI: function(state) {
        const voiceBtn = document.getElementById('voice-btn');
        const voiceStatus = document.getElementById('voice-status');

        if (state === 'listening') {
            voiceBtn.classList.add('listening');
            voiceStatus.textContent = 'Escuchando...';
        } else {
            voiceBtn.classList.remove('listening');
            voiceStatus.textContent = 'Presiona para hablar';
        }
    },

    // Actualizar display de comando
    updateCommandDisplay: function(command) {
        document.getElementById('last-command').textContent = `"${command}"`;
    },

    // Actualizar display de respuesta
    updateResponseDisplay: function(response) {
        document.getElementById('last-response').textContent = response;
    },

    // Repetir última respuesta
    repeatLast: function() {
        this.speak(this.lastResponse);
    }
};

// Exportar para uso global
window.voice = voice;