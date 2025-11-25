// datetime.js - Manejo de fecha y hora

const datetime = {
    // Actualizar hora en pantalla
    updateTime: function() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        
        const timeString = `${displayHours}:${minutes} ${ampm}`;
        document.getElementById('current-time').textContent = timeString;
    },

    // Actualizar fecha en pantalla
    updateDate: function() {
        const now = new Date();
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        
        const dateString = `${days[now.getDay()]}, ${now.getDate()} de ${months[now.getMonth()]} de ${now.getFullYear()}`;
        document.getElementById('current-date').textContent = dateString;
    },

    // Obtener hora en formato de voz
    getTimeVoice: function() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'de la tarde' : 'de la mañana';
        const displayHours = hours % 12 || 12;
        
        return `Son las ${displayHours} y ${minutes} ${ampm}`;
    },

    // Obtener fecha en formato de voz
    getDateVoice: function() {
        const now = new Date();
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        
        return `Hoy es ${days[now.getDay()]}, ${now.getDate()} de ${months[now.getMonth()]} de ${now.getFullYear()}`;
    },

    // Obtener día de la semana
    getDayVoice: function() {
        const now = new Date();
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        return `Hoy es ${days[now.getDay()]}`;
    },

    // Obtener mes actual
    getMonthVoice: function() {
        const now = new Date();
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        return `Estamos en ${months[now.getMonth()]}`;
    },

    // Obtener año actual
    getYearVoice: function() {
        const now = new Date();
        return `Estamos en el año ${now.getFullYear()}`;
    },

    // Inicializar actualizaciones
    init: function() {
        this.updateTime();
        this.updateDate();
        
        // Actualizar cada segundo
        setInterval(() => {
            this.updateTime();
            this.updateDate();
        }, 1000);
    }
};

// Auto-inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => datetime.init());
} else {
    datetime.init();
}