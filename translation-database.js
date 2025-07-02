/**
 * База данных переводов с русского на норвежский язык
 * Содержит популярные фразы и выражения для перевода
 */

const TRANSLATION_DATABASE = {
    // Приветствия и вежливость
    'привет': 'hei [хай]',
    'здравствуй': 'hei [хай]',
    'здравствуйте': 'hei [хай]',
    'доброе утро': 'god morgen [гу морген]',
    'добрый день': 'god dag [гу да]',
    'добрый вечер': 'god kveld [гу квель]',
    'пока': 'ha det [ха дэ]',
    'до свидания': 'ha det [ха дэ]',
    'увидимся': 'vi sees [ви сэс]',
    'спасибо': 'takk [так]',
    'большое спасибо': 'tusen takk [тусен так]',
    'пожалуйста': 'værsnil [вэршниль]',
    'извините': 'unnskyld [унщюль]',
    'простите': 'beklager [беклагер]',

    // Знакомство
    'меня зовут': 'jeg heter [яй хэтер]',
    'как тебя зовут': 'hva heter du [ва хэтер ду]',
    'как вас зовут': 'hva heter du [ва хэтер ду]',
    'приятно познакомиться': 'hyggelig å møte deg [хюгели о мёте дай]',
    'откуда ты': 'hvor kommer du fra [вор коммер ду фра]',
    'я из россии': 'jeg kommer fra russland [яй коммер фра руслан]',
    'я из москвы': 'jeg kommer fra moskva [яй коммер фра москва]',

    // Основные фразы
    'да': 'ja [я]',
    'нет': 'nei [най]',
    'не знаю': 'jeg vet ikke [яй вэ ике]',
    'понимаю': 'jeg forstår [яй форшор]',
    'не понимаю': 'jeg forstår ikke [яй форшор ике]',
    'говорите медленнее': 'snakk saktere [снак сактере]',
    'повторите пожалуйста': 'kan du gjenta det [кан ду йента дэ]',
    'помогите': 'hjelp [ельп]',
    'я не говорю по-норвежски': 'jeg snakker ikke norsk [яй снакер ике ношк]',
    'говорите по-английски': 'snakker du engelsk [снакер ду энгельск]',

    // Чувства и состояния
    'как дела': 'hvordan har du det [ворден хар ду дэ]',
    'хорошо': 'bra [бра]',
    'плохо': 'dårlig [дорли]',
    'отлично': 'utmerket [утмеркет]',
    'устал': 'jeg er trøtt [яй эр трёт]',
    'голоден': 'jeg er sulten [яй эр султен]',
    'хочу пить': 'jeg er tørst [яй эр тёшт]',
    'мне холодно': 'jeg fryser [яй фрюсер]',
    'мне жарко': 'jeg er varm [яй эр варм]',

    // Время
    'сколько времени': 'hvor mye er klokka [вор мюе эр клока]',
    'который час': 'hva er tida [ва эр тида]',
    'сегодня': 'i dag [и да]',
    'вчера': 'i går [и гор]',
    'завтра': 'i morgen [и морген]',
    'сейчас': 'nå [но]',
    'позже': 'senere [сэнере]',
    'утром': 'om morgenen [ом моргенен]',
    'днем': 'om dagen [ом дагенен]',
    'вечером': 'om kvelden [ом квелден]',
    'ночью': 'om natta [ом ната]',

    // Еда и напитки
    'я хочу есть': 'jeg vil gjerne spise [яй виль йэрне списе]',
    'я хочу пить': 'jeg vil gjerne drikke [яй виль йэрне дрике]',
    'я хочу кофе': 'jeg vil gjerne ha kaffe [яй виль йэрне ха кафе]',
    'я хочу чай': 'jeg vil gjerne ha te [яй виль йэрне ха тэ]',
    'я хочу воду': 'jeg vil gjerne ha vann [яй виль йэрне ха ван]',
    'счет пожалуйста': 'regningen takk [рэгнинген так]',
    'это вкусно': 'det er deilig [дэ эр дайли]',
    'мне не нравится': 'jeg liker det ikke [яй ликер дэ ике]',

    // Покупки
    'сколько это стоит': 'hvor mye koster det [вор мюе костер дэ]',
    'это дорого': 'det er dyrt [дэ эр дюрт]',
    'это дешево': 'det er billig [дэ эр билли]',
    'я хочу купить': 'jeg vil gjerne kjøpe [яй виль йэрне шёпе]',
    'где касса': 'hvor er kassa [вор эр каса]',
    'можно карточкой': 'kan jeg betale med kort [кан яй бетале мэ корт]',

    // Направления
    'где': 'hvor [вор]',
    'как добраться': 'hvordan kommer jeg dit [ворден коммер яй дит]',
    'направо': 'til høyre [тиль хёйре]',
    'налево': 'til venstre [тиль венстре]',
    'прямо': 'rett frem [рет фрем]',
    'рядом': 'i nærheten [и нэрхетен]',
    'далеко': 'langt unna [лант уна]',
    'близко': 'nært [нэрт]',

    // Транспорт
    'где автобус': 'hvor er bussen [вор эр бусен]',
    'где метро': 'hvor er t-banen [вор эр тэ-банен]',
    'где такси': 'hvor er drosjen [вор эр дрошен]',
    'сколько стоит билет': 'hvor mye koster billetten [вор мюе костер билетен]',
    'когда отправляется': 'når går det [нор гор дэ]',

    // Гостиница
    'у вас есть свободные номера': 'har dere ledige rom [хар дэре ледие ром]',
    'я забронировал номер': 'jeg har bestilt rom [яй хар бестильт ром]',
    'где мой номер': 'hvor er rommet mitt [вор эр ромет мит]',
    'можно ключ': 'kan jeg få nøkkelen [кан яй фо нёкелен]',

    // Экстренные ситуации
    'помогите': 'hjelp [ельп]',
    'вызовите врача': 'ring til legen [ринг тиль лэген]',
    'вызовите полицию': 'ring til politiet [ринг тиль политиет]',
    'я потерялся': 'jeg har gått meg vill [яй хар гот мэй виль]',
    'где больница': 'hvor er sykehuset [вор эр сюкехусет]',
    'где аптека': 'hvor er apoteket [вор эр апотэкет]',

    // Семья
    'моя семья': 'min familie [мин фамилье]',
    'мой муж': 'min mann [мин ман]',
    'моя жена': 'min kone [мин коне]',
    'мой сын': 'min sønn [мин сён]',
    'моя дочь': 'min datter [мин датер]',
    'мои родители': 'mine foreldre [мине форэльдре]',
    'моя мама': 'min mor [мин мор]',
    'мой папа': 'min far [мин фар]',

    // Работа
    'где ты работаешь': 'hvor jobber du [вор йобер ду]',
    'я работаю в': 'jeg jobber i [яй йобер и]',
    'я учитель': 'jeg er lærer [яй эр лэрер]',
    'я врач': 'jeg er lege [яй эр лэге]',
    'я студент': 'jeg er student [яй эр студент]',

    // Хобби и интересы
    'что ты любишь делать': 'hva liker du å gjøre [ва ликер ду о йёре]',
    'я люблю читать': 'jeg liker å lese [яй ликер о лэзе]',
    'я люблю музыку': 'jeg liker musikk [яй ликер мусик]',
    'я люблю спорт': 'jeg liker sport [яй ликер спорт]',
    'я люблю путешествовать': 'jeg liker å reise [яй ликер о райзе]',

    // Погода
    'какая погода': 'hvordan er været [ворден эр вэрет]',
    'хорошая погода': 'fint vær [финт вэр]',
    'плохая погода': 'dårlig vær [дорли вэр]',
    'идет дождь': 'det regner [дэ рэгнер]',
    'идет снег': 'det snør [дэ снёр]',
    'солнечно': 'det er sol [дэ эр соль]',
    'холодно': 'det er kaldt [дэ эр кальт]',
    'тепло': 'det er varmt [дэ эр вармт]'
};

/**
 * Функция для поиска перевода
 */
function findTranslation(text) {
    const normalizedText = text.toLowerCase().trim();
    
    // Прямое совпадение
    if (TRANSLATION_DATABASE[normalizedText]) {
        return TRANSLATION_DATABASE[normalizedText];
    }
    
    // Поиск частичного совпадения
    for (const [key, value] of Object.entries(TRANSLATION_DATABASE)) {
        if (normalizedText.includes(key) || key.includes(normalizedText)) {
            return value;
        }
    }
    
    return null;
}

/**
 * Функция для получения случайного перевода для изучения
 */
function getRandomTranslation() {
    const keys = Object.keys(TRANSLATION_DATABASE);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return {
        russian: randomKey,
        norwegian: TRANSLATION_DATABASE[randomKey]
    };
}

/**
 * Экспорт для использования в основном скрипте
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TRANSLATION_DATABASE, findTranslation, getRandomTranslation };
} else if (typeof window !== 'undefined') {
    window.TRANSLATION_DATABASE = TRANSLATION_DATABASE;
    window.findTranslation = findTranslation;
    window.getRandomTranslation = getRandomTranslation;
}
