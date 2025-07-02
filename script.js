/**
 * Главный скрипт веб-ассистента
 * Обрабатывает пользовательский ввод, поиск по базе данных и управление интерфейсом
 */

class WebAssistant {
    constructor() {
        // Элементы DOM
        this.messagesContainer = document.getElementById('messagesContainer');
        this.messageInput = document.getElementById('messageInput');
        this.inputForm = document.getElementById('inputForm');
        this.loadingIndicator = document.getElementById('loadingIndicator');
        this.chatTitle = document.getElementById('chatTitle');
        // Убираем sendButton так как теперь отправка происходит через Enter
        this.inputWrapper = document.querySelector('.input-wrapper');
        this.contextMenu = document.getElementById('customContextMenu');
        
        // Состояние приложения
        this.isProcessing = false;
        this.messageHistory = [];
        this.firstMessage = true;
        
        // Состояние для контекстного меню
        this.selectedText = '';
        this.selectedElement = null;
        this.longPressTimer = null;
        this.longPressStarted = false;
        this.startX = 0;
        this.startY = 0;
        
        // Инициализация норвежской базы данных
        this.norwegianEngine = null;
        
        // Инициализация
        this.init();
    }

    /**
     * Инициализация приложения
     */
    init() {
        this.bindEvents();
        this.initializeFeatherIcons();
        this.initializeNorwegianEngine();
        this.initializePWA();
        
        // Фокус на поле ввода
        this.messageInput.focus();
        
        console.log('Веб-ассистент для изучения норвежского языка инициализирован');
    }

    /**
     * Инициализация иконок Feather
     */
    initializeFeatherIcons() {
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }

    /**
     * Инициализация норвежской базы данных
     */
    initializeNorwegianEngine() {
        if (typeof NorwegianSearchEngine !== 'undefined') {
            this.norwegianEngine = new NorwegianSearchEngine();
            console.log('Норвежская база данных загружена:', NORWEGIAN_DATABASE.vocabulary.length, 'записей');
        } else {
            console.warn('Норвежская база данных не найдена');
        }
    }

    /**
     * Инициализация PWA функций
     */
    initializePWA() {
        // Регистрация Service Worker
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then((registration) => {
                        console.log('Service Worker зарегистрирован:', registration.scope);
                        
                        // Проверка обновлений
                        registration.addEventListener('updatefound', () => {
                            console.log('Найдено обновление Service Worker');
                        });
                    })
                    .catch((error) => {
                        console.log('Ошибка регистрации Service Worker:', error);
                    });
            });
        }

        // Обработка установки PWA
        let deferredPrompt;
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            console.log('PWA готово к установке');
            this.showInstallPrompt(deferredPrompt);
        });

        // Отслеживание установки
        window.addEventListener('appinstalled', () => {
            console.log('PWA установлено');
            deferredPrompt = null;
        });
    }

    /**
     * Показать предложение установки PWA
     */
    showInstallPrompt(deferredPrompt) {
        // Можно добавить кнопку установки в интерфейс
        // Пока просто логируем возможность установки
        console.log('Приложение можно установить как PWA');
    }

    /**
     * Привязка событий
     */
    bindEvents() {
        // Отправка сообщения
        this.inputForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });



        // Автоматическое изменение размера поля ввода
        this.messageInput.addEventListener('input', () => {
            this.adjustInputHeight();
        });

        // Обработка нажатий клавиш
        this.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSubmit();
            }
        });

        // Предотвращение отправки пустых сообщений
        this.messageInput.addEventListener('paste', () => {
            // Обработка вставки текста
        });

        // Эффекты при вводе текста
        this.messageInput.addEventListener('input', () => {
            this.handleInputEffects();
        });

        this.messageInput.addEventListener('focus', () => {
            this.inputWrapper.classList.add('typing');
        });

        this.messageInput.addEventListener('blur', () => {
            if (this.messageInput.value.trim() === '') {
                this.inputWrapper.classList.remove('typing');
            }
        });

        // Обработчики для кастомного контекстного меню
        this.bindContextMenuEvents();
        
        // Обработчики для стабилизации шапки убраны - используем CSS-only подход

        // Обработка кнопок в новом интерфейсе
        const newChatBtn = document.getElementById('newChatBtn');
        
        if (newChatBtn) {
            newChatBtn.addEventListener('click', () => {
                this.startNewChat();
            });
        }
    }



    /**
     * Привязка обработчиков для стабилизации шапки при появлении клавиатуры
     * ОТКЛЮЧЕНО - используем CSS-only подход
     */
    // bindKeyboardHandlers() {
    //     // Метод отключен, используем только CSS решение
    // }

    /**
     * Привязка событий для контекстного меню
     */
    bindContextMenuEvents() {
        // Делегированное событие для всех сообщений
        this.messagesContainer.addEventListener('mousedown', (e) => {
            const messageContent = e.target.closest('.message-content');
            if (messageContent) {
                this.startLongPress(e, messageContent);
            }
        });

        this.messagesContainer.addEventListener('touchstart', (e) => {
            const messageContent = e.target.closest('.message-content');
            if (messageContent) {
                this.startLongPress(e, messageContent);
            }
        });

        // Отмена долгого нажатия
        document.addEventListener('mouseup', () => this.cancelLongPress());
        document.addEventListener('touchend', () => this.cancelLongPress());
        
        // Отмена только при значительном движении
        document.addEventListener('mousemove', (e) => {
            if (this.longPressTimer && this.startX !== 0) {
                const deltaX = Math.abs(e.clientX - this.startX);
                const deltaY = Math.abs(e.clientY - this.startY);
                if (deltaX > 10 || deltaY > 10) {
                    this.cancelLongPress();
                }
            }
        });
        
        document.addEventListener('touchmove', (e) => {
            if (this.longPressTimer && this.startX !== 0) {
                const touch = e.touches[0] || e.changedTouches[0];
                const deltaX = Math.abs(touch.clientX - this.startX);
                const deltaY = Math.abs(touch.clientY - this.startY);
                if (deltaX > 10 || deltaY > 10) {
                    this.cancelLongPress();
                }
            }
        });

        // Скрытие контекстного меню при клике вне его
        document.addEventListener('click', (e) => {
            if (!this.contextMenu.contains(e.target)) {
                this.hideContextMenu();
            }
        });

        // Предотвращение стандартного контекстного меню
        document.addEventListener('contextmenu', (e) => {
            if (e.target.closest('.message-content')) {
                e.preventDefault();
            }
        });
    }

    /**
     * Начало долгого нажатия
     */
    startLongPress(e, element) {
        this.cancelLongPress();
        this.selectedElement = element;
        this.selectedText = element.textContent;
        
        // Сохраняем начальные координаты
        this.startX = e.clientX || (e.touches && e.touches[0].clientX);
        this.startY = e.clientY || (e.touches && e.touches[0].clientY);
        
        this.longPressTimer = setTimeout(() => {
            this.showContextMenu(e);
            this.longPressStarted = true;
        }, 500); // 500ms для долгого нажатия
    }

    /**
     * Отмена долгого нажатия
     */
    cancelLongPress() {
        if (this.longPressTimer) {
            clearTimeout(this.longPressTimer);
            this.longPressTimer = null;
        }
        this.longPressStarted = false;
        this.startX = 0;
        this.startY = 0;
    }

    /**
     * Показать контекстное меню
     */
    showContextMenu(e) {
        const x = e.clientX || (e.touches && e.touches[0].clientX);
        const y = e.clientY || (e.touches && e.touches[0].clientY);
        
        this.contextMenu.style.left = x + 'px';
        this.contextMenu.style.top = y + 'px';
        
        // Проверка, не выходит ли меню за границы экрана
        setTimeout(() => {
            const rect = this.contextMenu.getBoundingClientRect();
            if (rect.right > window.innerWidth) {
                this.contextMenu.style.left = (x - rect.width) + 'px';
            }
            if (rect.bottom > window.innerHeight) {
                this.contextMenu.style.top = (y - rect.height) + 'px';
            }
        }, 0);
        
        this.contextMenu.classList.add('show');
    }

    /**
     * Скрыть контекстное меню
     */
    hideContextMenu() {
        this.contextMenu.classList.remove('show');
    }

    /**
     * Копировать выделенный текст
     */
    copySelectedText() {
        if (this.selectedText) {
            navigator.clipboard.writeText(this.selectedText).then(() => {
                console.log('Текст скопирован:', this.selectedText);
                this.hideContextMenu();
            }).catch(err => {
                console.error('Ошибка копирования:', err);
                // Fallback для старых браузеров
                const textArea = document.createElement('textarea');
                textArea.value = this.selectedText;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                this.hideContextMenu();
            });
        }
    }

    /**
     * Автоматическое изменение высоты поля ввода
     */
    adjustInputHeight() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 150) + 'px';
    }

    /**
     * Обработка эффектов при вводе
     */
    handleInputEffects() {
        if (this.messageInput.value.trim() !== '') {
            this.inputWrapper.classList.add('typing');
        } else {
            this.inputWrapper.classList.remove('typing');
        }
    }

    // Метод updateSendButtonState удален - больше не нужен

    /**
     * Обработка отправки сообщения
     */
    async handleSubmit() {
        const message = this.messageInput.value.trim();
        
        if (!message || this.isProcessing) {
            return;
        }

        this.isProcessing = true;

        // Добавляем сообщение пользователя
        this.addUserMessage(message);
        
        // Очищаем поле ввода
        this.messageInput.value = '';
        this.adjustInputHeight();

        // Показываем индикатор загрузки
        this.showLoadingIndicator();

        try {
            // Симулируем задержку для более реалистичного опыта
            await this.delay(800 + Math.random() * 1200);
            
            // Ищем ответ
            const response = this.findBestAnswer(message);
            
            // Скрываем индикатор загрузки
            this.hideLoadingIndicator();
            
            // Добавляем ответ ассистента
            this.addAssistantMessage(response);

        } catch (error) {
            console.error('Ошибка при обработке сообщения:', error);
            this.hideLoadingIndicator();
            this.addAssistantMessage('Извините, произошла ошибка при обработке вашего запроса. Попробуйте еще раз.');
        } finally {
            this.isProcessing = false;
            this.messageInput.focus();
        }
    }

    /**
     * Поиск лучшего ответа в базе данных
     */
    findBestAnswer(userMessage) {
        if (!this.norwegianEngine) {
            return this.getDefaultResponse(userMessage);
        }

        const normalizedMessage = this.normalizeText(userMessage);
        
        // Определяем тип запроса
        const isTranslationRequest = this.isTranslationRequest(normalizedMessage);
        const isGrammarRequest = this.isGrammarRequest(normalizedMessage);
        const isRandomWordRequest = this.isRandomWordRequest(normalizedMessage);
        
        if (isRandomWordRequest) {
            return this.getRandomWordResponse();
        }
        
        if (isGrammarRequest) {
            return this.getGrammarResponse(normalizedMessage);
        }
        
        // Поиск в словаре
        const results = this.norwegianEngine.search(userMessage);
        
        if (results.length > 0) {
            return this.formatTranslationResponse(results[0], isTranslationRequest);
        }
        
        // Если ничего не найдено, предлагаем помощь
        return this.getHelpResponse(userMessage);
    }

    /**
     * Определение типа запроса
     */
    isTranslationRequest(message) {
        const translationKeywords = ['перевод', 'переведи', 'как сказать', 'что означает', 'как будет', 'translate'];
        return translationKeywords.some(keyword => message.includes(keyword));
    }

    isGrammarRequest(message) {
        const grammarKeywords = ['грамматика', 'правило', 'как образуется', 'множественное число', 'артикль'];
        return grammarKeywords.some(keyword => message.includes(keyword));
    }

    isRandomWordRequest(message) {
        const randomKeywords = ['случайное слово', 'дай слово', 'новое слово', 'изучить слово'];
        return randomKeywords.some(keyword => message.includes(keyword));
    }

    /**
     * Форматирование ответа с переводом
     */
    formatTranslationResponse(item, isTranslation) {
        let response = `🇳🇴 **${item.norwegian}** [${item.pronunciation}]\n`;
        response += `🇷🇺 **${item.russian}**\n\n`;
        
        if (item.examples && item.examples.length > 0) {
            response += `📝 **Пример:**\n`;
            response += `• ${item.examples[0].no}\n`;
            response += `• ${item.examples[0].ru}\n\n`;
        }
        
        response += `📚 Категория: ${NORWEGIAN_DATABASE.categories[item.category] || item.category}\n`;
        response += `📊 Уровень: ${NORWEGIAN_DATABASE.levels[item.level] || item.level}`;
        
        return response;
    }

    /**
     * Получение случайного слова
     */
    getRandomWordResponse() {
        const randomWord = this.norwegianEngine.getRandomWord();
        return this.formatTranslationResponse(randomWord, false);
    }

    /**
     * Ответ с грамматическими правилами
     */
    getGrammarResponse(message) {
        const grammarRules = this.norwegianEngine.getGrammarRules();
        if (grammarRules.length > 0) {
            const rule = grammarRules[0];
            let response = `📖 **Грамматика: ${rule.topic}**\n\n`;
            response += `🇳🇴 **Правило:** ${rule.norwegian_rule}\n\n`;
            response += `🇷🇺 **Объяснение:** ${rule.russian_explanation}\n\n`;
            response += `📝 **Примеры:**\n`;
            rule.examples.forEach(example => {
                response += `• ${example.no} — ${example.ru}\n`;
            });
            return response;
        }
        return "Извините, грамматические правила пока не найдены.";
    }

    /**
     * Помощь пользователю
     */
    getHelpResponse(userMessage) {
        return `Я помогаю изучать норвежский язык! 🇳🇴

Вы можете:
• Спросить перевод: "как сказать привет?"
• Попросить случайное слово: "дай новое слово"
• Узнать грамматику: "расскажи про артикли"
• Просто написать слово на русском или норвежском

Попробуйте написать что-то другое, и я постараюсь помочь!`;
    }

    /**
     * Нормализация текста для поиска
     */
    normalizeText(text) {
        return text.toLowerCase()
            .replace(/[^\w\sа-яё]/gi, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    /**
     * Получение ответа по умолчанию
     */
    getDefaultResponse(userMessage) {
        const defaultResponses = [
            'Извините, я не могу найти точный ответ на ваш вопрос. Попробуйте переформулировать запрос или задать вопрос о программировании, веб-разработке или технологиях.',
            'Я специализируюсь на вопросах о программировании, веб-технологиях и IT-сфере. Можете задать вопрос по этим темам?',
            'К сожалению, я не нашел подходящего ответа в своей базе знаний. Попробуйте спросить о JavaScript, HTML, CSS, React или других технологиях.',
            'Мне не удалось найти релевантную информацию по вашему запросу. Я лучше всего отвечаю на вопросы о веб-разработке, программировании и IT-технологиях.'
        ];

        // Проверяем на приветствие
        const greetings = ['привет', 'здравствуй', 'добро пожаловать', 'hello', 'hi'];
        const normalizedMessage = this.normalizeText(userMessage);
        
        if (greetings.some(greeting => normalizedMessage.includes(greeting))) {
            return 'Привет! Я ваш веб-ассистент. Я готов помочь вам с вопросами о программировании, веб-разработке, технологиях и IT-сфере. О чем хотели бы узнать?';
        }

        // Проверяем на благодарность
        const thanks = ['спасибо', 'благодарю', 'thanks', 'thank you'];
        if (thanks.some(thank => normalizedMessage.includes(thank))) {
            return 'Пожалуйста! Рад был помочь. Если у вас есть еще вопросы, не стесняйтесь спрашивать!';
        }

        // Возвращаем случайный ответ по умолчанию
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    /**
     * Добавление сообщения пользователя
     */
    addUserMessage(message) {
        const messageElement = this.createMessageElement(message, 'user');
        this.messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
        
        // Обновляем название чата при первом сообщении
        if (this.firstMessage) {
            this.updateChatTitle(message);
            this.firstMessage = false;
        }
        
        // Сохраняем в историю
        this.messageHistory.push({ type: 'user', content: message, timestamp: Date.now() });
    }

    /**
     * Добавление сообщения ассистента
     */
    addAssistantMessage(message) {
        const messageElement = this.createMessageElement(message, 'assistant');
        this.messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
        
        // Сохраняем в историю
        this.messageHistory.push({ type: 'assistant', content: message, timestamp: Date.now() });
    }

    /**
     * Создание элемента сообщения
     */
    createMessageElement(content, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;

        if (type === 'assistant') {
            // Создаем стильный блок для ответов ассистента
            const noteBlock = document.createElement('div');
            noteBlock.className = 'assistant-note-block message-content';
            
            const noteContent = document.createElement('p');
            noteContent.className = 'assistant-note-content';
            
            const noteLabel = document.createElement('span');
            noteLabel.className = 'assistant-note-label';
            noteLabel.textContent = 'Ответ:';
            
            noteContent.appendChild(noteLabel);
            noteContent.appendChild(document.createTextNode(' ' + content));
            noteBlock.appendChild(noteContent);
            
            messageDiv.appendChild(noteBlock);
        } else {
            // Обычное сообщение пользователя
            const avatarDiv = document.createElement('div');
            avatarDiv.className = 'message-avatar';
            
            const avatarIcon = document.createElement('i');
            avatarIcon.setAttribute('data-feather', 'user');
            avatarDiv.appendChild(avatarIcon);

            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';
            
            const contentP = document.createElement('p');
            contentP.textContent = content;
            contentDiv.appendChild(contentP);

            messageDiv.appendChild(avatarDiv);
            messageDiv.appendChild(contentDiv);
        }

        // Инициализируем иконки после добавления элемента
        setTimeout(() => {
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        }, 0);

        return messageDiv;
    }

    /**
     * Показать индикатор загрузки
     */
    showLoadingIndicator() {
        // Добавляем индикатор загрузки в область сообщений
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message loading-message';
        loadingDiv.id = 'currentLoading';
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'loading-message-avatar';
        
        const loader = document.createElement('span');
        loader.className = 'loader';
        avatarDiv.appendChild(loader);
        
        loadingDiv.appendChild(avatarDiv);
        
        this.messagesContainer.appendChild(loadingDiv);
        this.scrollToBottom();
    }

    /**
     * Скрыть индикатор загрузки
     */
    hideLoadingIndicator() {
        const currentLoading = document.getElementById('currentLoading');
        if (currentLoading) {
            currentLoading.remove();
        }
    }

    /**
     * Прокрутка к низу
     */
    scrollToBottom() {
        setTimeout(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }, 100);
    }

    /**
     * Задержка для асинхронных операций
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Обновление названия чата
     */
    updateChatTitle(message) {
        // Берем первые несколько слов из сообщения
        const words = message.trim().split(' ').slice(0, 3);
        const title = words.join(' ');
        
        if (this.chatTitle) {
            this.chatTitle.textContent = title.length > 30 ? title.substring(0, 30) + '...' : title;
        }
    }

    /**
     * Начать новый чат
     */
    startNewChat() {
        // Очищаем контейнер сообщений
        this.messagesContainer.innerHTML = '';
        
        // Сбрасываем состояние
        this.messageHistory = [];
        this.firstMessage = true;
        
        // Возвращаем заголовок
        if (this.chatTitle) {
            this.chatTitle.textContent = 'Новый чат';
        }
        
        // Фокус на поле ввода
        this.messageInput.focus();
        
        console.log('Новый чат начат');
    }

    /**
     * Получение статистики использования
     */
    getUsageStats() {
        return {
            totalMessages: this.messageHistory.length,
            userMessages: this.messageHistory.filter(m => m.type === 'user').length,
            assistantMessages: this.messageHistory.filter(m => m.type === 'assistant').length,
            sessionStart: this.messageHistory.length > 0 ? this.messageHistory[0].timestamp : Date.now()
        };
    }
}

/**
 * Глобальная функция для копирования текста
 */
function copyText() {
    if (window.webAssistant) {
        window.webAssistant.copySelectedText();
    }
}

/**
 * Инициализация приложения после загрузки DOM
 */
document.addEventListener('DOMContentLoaded', () => {
    // Проверяем доступность базы данных
    if (typeof DATABASE === 'undefined') {
        console.error('База данных не загружена');
        return;
    }
    
    // Создаем экземпляр ассистента
    window.webAssistant = new WebAssistant();
    
    console.log('Веб-ассистент готов к работе');
    console.log(`Загружено ${DATABASE.length} записей в базе данных`);
});

/**
 * Обработка ошибок
 */
window.addEventListener('error', (event) => {
    console.error('Глобальная ошибка:', event.error);
});

/**
 * Обработка необработанных промисов
 */
window.addEventListener('unhandledrejection', (event) => {
    console.error('Необработанный промис:', event.reason);
});
