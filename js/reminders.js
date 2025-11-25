// reminders.js - Gestión de recordatorios

const reminders = {
    list: [],
    storageKey: 'voice-assistant-reminders',

    // Cargar recordatorios del localStorage
    load: function() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                this.list = JSON.parse(saved);
                this.render();
            }
        } catch (error) {
            console.error('Error al cargar recordatorios:', error);
        }
    },

    // Guardar en localStorage
    save: function() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.list));
        } catch (error) {
            console.error('Error al guardar recordatorios:', error);
        }
    },

    // Agregar nuevo recordatorio
    add: function(text) {
        if (!text || text.trim().length === 0) {
            return false;
        }

        const reminder = {
            id: Date.now(),
            text: text.trim(),
            createdAt: new Date().toISOString()
        };

        this.list.push(reminder);
        this.save();
        this.render();
        return true;
    },

    // Eliminar recordatorio
    delete: function(id) {
        this.list = this.list.filter(r => r.id !== id);
        this.save();
        this.render();
        
        if (window.voice) {
            window.voice.speak('Recordatorio eliminado');
        }
    },

    // Obtener todos los recordatorios
    getAll: function() {
        return this.list;
    },

    // Limpiar todos
    clear: function() {
        if (confirm('¿Estás seguro de eliminar todos los recordatorios?')) {
            this.list = [];
            this.save();
            this.render();
            
            if (window.voice) {
                window.voice.speak('Todos los recordatorios han sido eliminados');
            }
        }
    },

    // Renderizar en el DOM
    render: function() {
        const section = document.getElementById('reminders-section');
        const list = document.getElementById('reminders-list');
        const count = document.getElementById('reminders-count');

        // Actualizar contador
        count.textContent = this.list.length;

        // Mostrar/ocultar sección
        if (this.list.length === 0) {
            section.style.display = 'none';
            list.innerHTML = '';
            return;
        }

        section.style.display = 'block';

        // Renderizar lista
        list.innerHTML = '';
        this.list.forEach((reminder, index) => {
            const item = document.createElement('div');
            item.className = 'reminder-item';
            
            item.innerHTML = `
                <span class="reminder-text">${index + 1}. ${reminder.text}</span>
                <button class="delete-btn" data-id="${reminder.id}">Eliminar</button>
            `;

            // Event listener para eliminar
            const deleteBtn = item.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                this.delete(reminder.id);
            });

            list.appendChild(item);
        });
    },

    // Inicializar
    init: function() {
        this.load();
    }
};

// Auto-inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => reminders.init());
} else {
    reminders.init();
}

// Exportar para uso global
window.reminders = reminders;