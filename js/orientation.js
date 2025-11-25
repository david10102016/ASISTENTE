// orientation.js - Brújula y sensor de luz

const orientation = {
    currentDirection: '--',
    currentLight: '--',

    // Obtener dirección de la brújula
    getDirection: function() {
        // Verificar soporte
        if (!('DeviceOrientationEvent' in window)) {
            this.updateDirection('No disponible');
            if (window.voice) {
                window.voice.speak('La brújula no está disponible en este dispositivo o navegador. Esta función requiere un dispositivo móvil con sensor de orientación.');
            }
            return;
        }

        if (window.voice) {
            window.voice.speak('Intentando acceder a la brújula. Mantén el dispositivo nivelado.');
        }

        // Solicitar permisos en iOS 13+
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission()
                .then(permissionState => {
                    if (permissionState === 'granted') {
                        this.startCompass();
                    } else {
                        this.updateDirection('Sin permisos');
                        if (window.voice) {
                            window.voice.speak('Necesito permisos para acceder a la brújula. Por favor otorga los permisos cuando se soliciten.');
                        }
                    }
                })
                .catch(error => {
                    console.error('Error al solicitar permisos:', error);
                    this.updateDirection('Error de permisos');
                    if (window.voice) {
                        window.voice.speak('No se pudieron obtener los permisos para la brújula.');
                    }
                });
        } else {
            this.startCompass();
        }
    },

    // Iniciar lectura de brújula
    startCompass: function() {
        let readings = 0;
        const maxReadings = 3;
        
        const handleOrientation = (event) => {
            const alpha = event.alpha; // Rotación alrededor del eje Z
            
            if (alpha === null || alpha === undefined) {
                readings++;
                if (readings >= maxReadings) {
                    this.updateDirection('No disponible');
                    if (window.voice) {
                        window.voice.speak('Tu dispositivo no tiene brújula disponible o los permisos están bloqueados');
                    }
                    window.removeEventListener('deviceorientation', handleOrientation);
                }
                return;
            }

            // Convertir ángulo a dirección cardinal
            let direction = '';
            let cardinalDirection = '';

            if (alpha >= 337.5 || alpha < 22.5) {
                direction = 'Norte';
                cardinalDirection = 'Norte';
            } else if (alpha >= 22.5 && alpha < 67.5) {
                direction = 'Noreste';
                cardinalDirection = 'Noreste';
            } else if (alpha >= 67.5 && alpha < 112.5) {
                direction = 'Este';
                cardinalDirection = 'Este';
            } else if (alpha >= 112.5 && alpha < 157.5) {
                direction = 'Sureste';
                cardinalDirection = 'Sureste';
            } else if (alpha >= 157.5 && alpha < 202.5) {
                direction = 'Sur';
                cardinalDirection = 'Sur';
            } else if (alpha >= 202.5 && alpha < 247.5) {
                direction = 'Suroeste';
                cardinalDirection = 'Suroeste';
            } else if (alpha >= 247.5 && alpha < 292.5) {
                direction = 'Oeste';
                cardinalDirection = 'Oeste';
            } else if (alpha >= 292.5 && alpha < 337.5) {
                direction = 'Noroeste';
                cardinalDirection = 'Noroeste';
            }

            this.updateDirection(direction);
            
            if (window.voice) {
                window.voice.speak(`Estás mirando hacia el ${cardinalDirection}. Valor de brújula: ${Math.round(alpha)} grados`);
            }

            // Remover listener después de una lectura exitosa
            window.removeEventListener('deviceorientation', handleOrientation);
        };

        window.addEventListener('deviceorientation', handleOrientation);

        // Timeout de 3 segundos para casos donde no hay respuesta
        setTimeout(() => {
            if (readings === 0) {
                this.updateDirection('Sin respuesta');
                if (window.voice) {
                    window.voice.speak('La brújula no respondió. Esta función funciona mejor en dispositivos móviles al aire libre, lejos de objetos metálicos.');
                }
            }
            window.removeEventListener('deviceorientation', handleOrientation);
        }, 3000);
    },

    // Obtener nivel de luz
    getLightLevel: function() {
        // Verificar soporte para AmbientLightSensor
        if ('AmbientLightSensor' in window) {
            try {
                const sensor = new AmbientLightSensor();
                
                sensor.addEventListener('reading', () => {
                    const lux = sensor.illuminance;
                    let level = '';
                    let description = '';

                    if (lux < 50) {
                        level = 'Muy oscuro';
                        description = 'muy oscuro';
                    } else if (lux < 200) {
                        level = 'Poca luz';
                        description = 'con poca luz';
                    } else if (lux < 500) {
                        level = 'Normal';
                        description = 'iluminado normalmente';
                    } else if (lux < 1000) {
                        level = 'Brillante';
                        description = 'muy brillante';
                    } else {
                        level = 'Muy brillante';
                        description = 'extremadamente brillante';
                    }

                    this.updateLight(level);
                    
                    if (window.voice) {
                        window.voice.speak(`El ambiente está ${description}, con ${Math.round(lux)} lux de iluminación`);
                    }

                    sensor.stop();
                });

                sensor.addEventListener('error', (event) => {
                    console.error('Error del sensor de luz:', event.error);
                    this.updateLight('Error');
                    
                    if (window.voice) {
                        window.voice.speak('No se pudo leer el sensor de luz');
                    }
                });

                sensor.start();

                // Timeout de 5 segundos
                setTimeout(() => {
                    sensor.stop();
                }, 5000);

            } catch (error) {
                console.error('Error al crear sensor de luz:', error);
                this.simulateLightLevel();
            }
        } else {
            // Fallback: simular con hora del día
            this.simulateLightLevel();
        }
    },

    // Simular nivel de luz basado en hora del día
    simulateLightLevel: function() {
        const hour = new Date().getHours();
        let level = '';
        let description = '';

        if (hour >= 6 && hour < 8) {
            level = 'Poca luz (amanecer)';
            description = 'con poca luz, parece ser de mañana temprano';
        } else if (hour >= 8 && hour < 18) {
            level = 'Normal (día)';
            description = 'iluminado normalmente, es de día';
        } else if (hour >= 18 && hour < 20) {
            level = 'Poca luz (atardecer)';
            description = 'con poca luz, parece ser el atardecer';
        } else {
            level = 'Oscuro (noche)';
            description = 'oscuro, es de noche';
        }

        this.updateLight(level);
        
        if (window.voice) {
            window.voice.speak(`Tu dispositivo no tiene sensor de luz. Basándome en la hora, el ambiente debería estar ${description}`);
        }
    },

    // Actualizar dirección en UI
    updateDirection: function(direction) {
        this.currentDirection = direction;
        const element = document.getElementById('direction-value');
        if (element) {
            element.textContent = direction;
        }
    },

    // Actualizar luz en UI
    updateLight: function(level) {
        this.currentLight = level;
        const element = document.getElementById('light-value');
        if (element) {
            element.textContent = level;
        }
    }
};

// Exportar para uso global
window.orientation = orientation;