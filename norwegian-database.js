/**
 * Оптимизированная база данных для изучения норвежского языка
 * Поддерживает большие объемы данных с эффективным поиском
 */

// Индексы для быстрого поиска
const SEARCH_INDEX = new Map();
const NORWEGIAN_INDEX = new Map();
const RUSSIAN_INDEX = new Map();

// Основная база данных норвежского языка
const NORWEGIAN_DATABASE = {
    // Базовые слова и фразы
    vocabulary: [
        {
            id: 1,
            norwegian: "hei",
            russian: "привет",
            category: "greetings",
            level: "beginner",
            type: "word",
            pronunciation: "хай",
            examples: [
                { no: "Hei! Hvordan har du det?", ru: "Привет! Как дела?" }
            ]
        },
        {
            id: 2,
            norwegian: "takk",
            russian: "спасибо",
            category: "greetings",
            level: "beginner", 
            type: "word",
            pronunciation: "так",
            examples: [
                { no: "Takk for hjelpen!", ru: "Спасибо за помощь!" }
            ]
        },
        {
            id: 3,
            norwegian: "god morgen",
            russian: "доброе утро",
            category: "greetings",
            level: "beginner",
            type: "phrase",
            pronunciation: "гу морген",
            examples: [
                { no: "God morgen! Har du sovet godt?", ru: "Доброе утро! Хорошо спал?" }
            ]
        },
        {
            id: 4,
            norwegian: "beklager",
            russian: "извините",
            category: "greetings",
            level: "beginner",
            type: "word",
            pronunciation: "беклагер",
            examples: [
                { no: "Beklager, jeg forstår ikke.", ru: "Извините, я не понимаю." }
            ]
        },
        {
            id: 5,
            norwegian: "hvor mye koster det?",
            russian: "сколько это стоит?",
            category: "shopping",
            level: "beginner",
            type: "phrase",
            pronunciation: "вор мюе костер де",
            examples: [
                { no: "Unnskyld, hvor mye koster dette?", ru: "Извините, сколько это стоит?" }
            ]
        },
        {
            id: 6,
            norwegian: "jeg forstår ikke",
            russian: "я не понимаю",
            category: "communication",
            level: "beginner",
            type: "phrase",
            pronunciation: "яй форшор икке",
            examples: [
                { no: "Beklager, jeg forstår ikke norsk så godt.", ru: "Извините, я не очень хорошо понимаю норвежский." }
            ]
        },
        {
            id: 7,
            norwegian: "kan du hjelpe meg?",
            russian: "можете ли вы мне помочь?",
            category: "communication",
            level: "beginner",
            type: "phrase",
            pronunciation: "кан ду ельпе май",
            examples: [
                { no: "Unnskyld, kan du hjelpe meg med veien?", ru: "Извините, можете помочь мне с дорогой?" }
            ]
        },
        {
            id: 8,
            norwegian: "jeg kommer fra Russland",
            russian: "я из России",
            category: "personal_info",
            level: "beginner",
            type: "phrase",
            pronunciation: "яй коммер фра руссланн",
            examples: [
                { no: "Hei, jeg kommer fra Russland.", ru: "Привет, я из России." }
            ]
        }
    ],

    // Грамматические правила
    grammar: [
        {
            id: 1,
            topic: "артикли",
            norwegian_rule: "en/et + noun, den/det + adjective + noun",
            russian_explanation: "В норвежском есть два неопределенных артикля: 'en' (мужской/женский род) и 'et' (средний род)",
            examples: [
                { no: "en bil (машина)", ru: "неопределенный артикль мужского рода" },
                { no: "et hus (дом)", ru: "неопределенный артикль среднего рода" },
                { no: "den røde bilen (красная машина)", ru: "определенный артикль + прилагательное" }
            ],
            level: "beginner"
        },
        {
            id: 2,
            topic: "множественное число",
            norwegian_rule: "добавление -er, -e, или изменение корня",
            russian_explanation: "Множественное число в норвежском образуется несколькими способами",
            examples: [
                { no: "bil → biler (машина → машины)", ru: "добавление -er" },
                { no: "hus → hus (дом → дома)", ru: "без изменений" },
                { no: "mann → menn (мужчина → мужчины)", ru: "изменение корня" }
            ],
            level: "beginner"
        }
    ],

    // Категории для организации
    categories: {
        greetings: "приветствие",
        shopping: "покупки", 
        communication: "общение",
        personal_info: "личная информация",
        food: "еда",
        transport: "транспорт",
        time: "время",
        weather: "погода"
    },

    // Уровни сложности
    levels: {
        beginner: "начинающий",
        intermediate: "средний", 
        advanced: "продвинутый"
    }
};

/**
 * Класс для оптимизированного поиска в базе данных
 */
class NorwegianSearchEngine {
    constructor() {
        this.buildIndexes();
    }

    /**
     * Построение индексов для быстрого поиска
     */
    buildIndexes() {
        NORWEGIAN_DATABASE.vocabulary.forEach(item => {
            // Индекс норвежских слов
            const norwegianWords = item.norwegian.toLowerCase().split(' ');
            norwegianWords.forEach(word => {
                if (!NORWEGIAN_INDEX.has(word)) {
                    NORWEGIAN_INDEX.set(word, []);
                }
                NORWEGIAN_INDEX.get(word).push(item);
            });

            // Индекс русских слов
            const russianWords = item.russian.toLowerCase().split(' ');
            russianWords.forEach(word => {
                if (!RUSSIAN_INDEX.has(word)) {
                    RUSSIAN_INDEX.set(word, []);
                }
                RUSSIAN_INDEX.get(word).push(item);
            });

            // Общий поисковый индекс
            const allWords = [...norwegianWords, ...russianWords, item.category];
            allWords.forEach(word => {
                if (!SEARCH_INDEX.has(word)) {
                    SEARCH_INDEX.set(word, []);
                }
                SEARCH_INDEX.get(word).push(item);
            });
        });
    }

    /**
     * Поиск по запросу пользователя
     */
    search(query) {
        const normalizedQuery = this.normalizeText(query);
        const words = normalizedQuery.split(' ');
        const results = new Map();

        words.forEach(word => {
            // Поиск точных совпадений
            if (SEARCH_INDEX.has(word)) {
                SEARCH_INDEX.get(word).forEach(item => {
                    results.set(item.id, item);
                });
            }

            // Поиск частичных совпадений
            SEARCH_INDEX.forEach((items, indexWord) => {
                if (indexWord.includes(word) || word.includes(indexWord)) {
                    items.forEach(item => {
                        results.set(item.id, item);
                    });
                }
            });
        });

        return Array.from(results.values());
    }

    /**
     * Нормализация текста для поиска
     */
    normalizeText(text) {
        return text.toLowerCase()
            .replace(/[её]/g, 'е')
            .replace(/[ъь]/g, '')
            .replace(/[^\w\s]/g, ' ')
            .trim();
    }

    /**
     * Получение случайного слова для изучения
     */
    getRandomWord(level = null, category = null) {
        let filtered = NORWEGIAN_DATABASE.vocabulary;
        
        if (level) {
            filtered = filtered.filter(item => item.level === level);
        }
        
        if (category) {
            filtered = filtered.filter(item => item.category === category);
        }

        return filtered[Math.floor(Math.random() * filtered.length)];
    }

    /**
     * Получение слов по категории
     */
    getByCategory(category) {
        return NORWEGIAN_DATABASE.vocabulary.filter(item => item.category === category);
    }

    /**
     * Получение грамматических правил
     */
    getGrammarRules(level = null) {
        let rules = NORWEGIAN_DATABASE.grammar;
        
        if (level) {
            rules = rules.filter(rule => rule.level === level);
        }
        
        return rules;
    }
}

// Экспорт для использования в основном приложении
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NORWEGIAN_DATABASE, NorwegianSearchEngine };
} else {
    window.NORWEGIAN_DATABASE = NORWEGIAN_DATABASE;
    window.NorwegianSearchEngine = NorwegianSearchEngine;
}