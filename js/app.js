// app.js - Inicialización y eventos principales

document.addEventListener('DOMContentLoaded', function() {
    
    console.log('🚀 Asistente Visual - Iniciando...');

    // ========================================
    // BOTÓN PRINCIPAL DE VOZ
    // ========================================
    const voiceBtn = document.getElementById('voice-btn');
    if (voiceBtn) {
        voiceBtn.addEventListener('click', function() {
            voice.startListening();
        });
    }

    // ========================================
    // BOTONES DE ACCESO RÁPIDO
    // ========================================
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const command = this.getAttribute('data-command');
            
            switch(command) {
                case 'hora':
                    voice.processCommand('qué hora es');
                    break;
                case 'fecha':
                    voice.processCommand('qué fecha es');
                    break;
                case 'recordatorios':
                    voice.processCommand('mis recordatorios');
                    break;
                case 'ayuda':
                    voice.processCommand('ayuda');
                    break;
            }
        });
    });

    // ========================================
    // FUNCIONES ESPECIALES
    // ========================================
    
    // Brújula
    const compassBtn = document.getElementById('compass-btn');
    if (compassBtn) {
        compassBtn.addEventListener('click', function() {
            orientation.getDirection();
        });
    }

    // Sensor de luz
    const lightBtn = document.getElementById('light-btn');
    if (lightBtn) {
        lightBtn.addEventListener('click', function() {
            orientation.getLightLevel();
        });
    }

    // Detector de billetes
    const currencyBtn = document.getElementById('currency-btn');
    if (currencyBtn) {
        currencyBtn.addEventListener('click', function() {
            currency.detect();
        });
    }

    // ========================================
    // BOTÓN REPETIR
    // ========================================
    const repeatBtn = document.getElementById('repeat-btn');
    if (repeatBtn) {
        repeatBtn.addEventListener('click', function() {
            voice.repeatLast();
        });
    }

    // ========================================
    // ACCESIBILIDAD - ATAJOS DE TECLADO
    // ========================================
    document.addEventListener('keydown', function(e) {
        // Espacio o Enter: Activar voz
        if (e.code === 'Space' || e.code === 'Enter') {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                voice.startListening();
            }
        }
        
        // H: Hora
        if (e.key === 'h' || e.key === 'H') {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                voice.processCommand('qué hora es');
            }
        }
        
        // F: Fecha
        if (e.key === 'f' || e.key === 'F') {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                voice.processCommand('qué fecha es');
            }
        }
        
        // R: Recordatorios
        if (e.key === 'r' || e.key === 'R') {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                voice.processCommand('mis recordatorios');
            }
        }
        
        // A: Ayuda
        if (e.key === 'a' || e.key === 'A') {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                voice.processCommand('ayuda');
            }
        }
    });

    // ========================================
    // MENSAJE DE BIENVENIDA
    // ========================================
    setTimeout(() => {
        if (window.voice) {
            voice.speak('Bienvenido al Asistente Visual. Di "Ayuda" para conocer todos los comandos disponibles.');
        }
    }, 1000);

    // ========================================
    // VERIFICAR SOPORTE DE FUNCIONALIDADES
    // ========================================
    checkBrowserSupport();

    console.log('✅ Asistente Visual - Listo');
});

// ========================================
// VERIFICAR SOPORTE DEL NAVEGADOR
// ========================================
function checkBrowserSupport() {
    const features = {
        speechRecognition: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
        speechSynthesis: 'speechSynthesis' in window,
        deviceOrientation: 'DeviceOrientationEvent' in window,
        ambientLight: 'AmbientLightSensor' in window,
        camera: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices
    };

    console.log('🔍 Soporte del navegador:');
    console.log('  - Reconocimiento de voz:', features.speechRecognition ? '✅' : '❌');
    console.log('  - Síntesis de voz:', features.speechSynthesis ? '✅' : '❌');
    console.log('  - Orientación (brújula):', features.deviceOrientation ? '✅' : '❌');
    console.log('  - Sensor de luz:', features.ambientLight ? '✅' : '⚠️ (fallback disponible)');
    console.log('  - Cámara:', features.camera ? '✅' : '❌');

    // Advertencias para funcionalidades críticas
    if (!features.speechRecognition) {
        console.warn('⚠️ Reconocimiento de voz no disponible. Usa Chrome o Edge.');
    }

    if (!features.speechSynthesis) {
        console.error('❌ Síntesis de voz no disponible. La aplicación no funcionará correctamente.');
    }
}

// ========================================
// MANEJO DE ERRORES GLOBALES
// ========================================
window.addEventListener('error', function(e) {
    console.error('Error global:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Promesa rechazada:', e.reason);
});

// ========================================
// SERVICE WORKER (opcional para PWA)
// ========================================
if ('serviceWorker' in navigator) {
    // Descomentar cuando tengas service-worker.js
    /*
    navigator.serviceWorker.register('/service-worker.js')
        .then(reg => console.log('Service Worker registrado:', reg.scope))
        .catch(err => console.log('Error al registrar Service Worker:', err));
    */
}

// ========================================
// EXPORTAR PARA DEBUGGING
// ========================================
window.app = {
    version: '1.0.0',
    modules: {
        voice: window.voice,
        datetime: window.datetime,
        reminders: window.reminders,
        orientation: window.orientation,
        currency: window.currency
    },
    checkBrowserSupport: checkBrowserSupport
};