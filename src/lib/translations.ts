export type Language = 'ru' | 'en';

export const translations = {
  ru: {
    // Header & Navigation
    siteTitle: 'Анкета по здоровью',
    selectLanguage: 'Язык',
    
    // Home page
    welcome: 'Добро пожаловать',
    welcomeDescription: 'Это бесплатная анкета по здоровью. Заполните форму, и мы свяжемся с вами для консультации.',
    selectCategory: 'Выберите категорию анкеты',
    
    // Categories
    infantTitle: 'Для младенца',
    infantDescription: 'До 1 года',
    childTitle: 'Детская анкета',
    childDescription: 'от 1 - 12 лет',
    womanTitle: 'Женская анкета',
    womanDescription: 'Для взрослых женщин',
    manTitle: 'Мужская анкета',
    manDescription: 'Для взрослых мужчин',
    
    // Form labels
    name: 'Имя',
    lastName: 'Фамилия',
    age: 'Возраст',
    ageMonths: 'Возраст (в месяцах)',
    weight: 'Вес (кг)',
    waterPerDay: 'Сколько воды в день (литров)',
    additionalInfo: 'Укажите свой вариант',
    whatElseToKnow: 'Что ещё нужно знать о здоровье',
    
    // Common options
    yes: 'Да',
    no: 'Нет',
    sometimes: 'Иногда',
    good: 'Хорошо',
    bad: 'Плохо',
    sometimesProblems: 'Иногда проблемы',
    normal: 'Нормальное',
    reduced: 'Сниженная',
    veryLow: 'Очень низкая',
    moderate: 'Умеренно',
    strong: 'Сильно',
    
    // Digestion
    digestion: 'Пищеварение',
    stomachPain: 'Боли в животе',
    diarrhea: 'Диарея',
    constipation: 'Запор',
    bloating: 'Вздутие',
    heartburn: 'Изжога',
    
    // Sleep & Energy
    sleep: 'Сон',
    sleepQuality: 'Качество сна',
    sleepsWell: 'Хорошо ли спит',
    sweatsAtNight: 'Потеет во сне',
    grindTeeth: 'Скрипит зубами',
    energy: 'Энергия',
    energyLevel: 'Уровень энергии',
    
    // Allergies
    allergies: 'Аллергии',
    flowering: 'Цветение',
    animals: 'Животные',
    dust: 'Пыль',
    food: 'Еда',
    medications: 'Лекарства',
    
    // Skin & Appearance
    skinCondition: 'Состояние кожи',
    moles: 'Родинки',
    warts: 'Бородавки',
    rashes: 'Высыпания',
    eczema: 'Экзема',
    drySkin: 'Сухая кожа',
    acne: 'Прыщи',
    irritation: 'Раздражение',
    
    // Teeth
    teeth: 'Зубы',
    teethDecayFast: 'Зубы быстро портятся',
    teethCrumble: 'Зубы крошатся',
    badBreath: 'Неприятный запах изо рта',
    bleedingGums: 'Кровоточивость дёсен',
    
    // Joints
    joints: 'Суставы',
    crunch: 'Хруст',
    squeak: 'Скрип',
    inflammation: 'Воспаление',
    
    // Medical history
    injuries: 'Травмы / операции / удары по голове / переломы',
    operations: 'Операции',
    headaches: 'Головные боли / мигрени',
    illnessFrequency: 'Часто ли болеет / принимал ли антибиотики',
    cystsStones: 'Кисты / миомы / камни',
    pressure: 'Давление',
    pressureLow: 'Низкое',
    pressureHigh: 'Высокое',
    pressureNormal: 'Нормальное',
    takesMedication: 'Принимаете ли таблетки',
    
    // Women specific
    menstruation: 'Месячные или менопауза',
    discharge: 'Выделения',
    hairCondition: 'Состояние волос',
    hairFalling: 'Выпадают',
    hairSplit: 'Секутся',
    hairDry: 'Сухие',
    hairOk: 'В порядке',
    
    // Cold extremities
    coldHands: 'Холодные руки/ноги',
    coldEvenInSummer: 'Руки-ноги холодные даже летом',
    
    // Varicose & Hemorrhoids
    varicoseHemorrhoids: 'Варикоз или геморрой',
    bleeding: 'Кровоточит',
    
    // COVID
    covidStatus: 'Был ли ковид или вакцина',
    hadCovid: 'Болела',
    vaccinated: 'Вакцинирована',
    noCovid: 'Нет',
    
    // Infant specific
    birthType: 'Как прошли роды',
    natural: 'Естественно',
    cesarean: 'Кесарево',
    other: 'Другое',
    motherToxicosis: 'Был ли у мамы сильный токсикоз',
    motherAllergy: 'Была ли у мамы аллергия до или во время беременности',
    motherConstipation: 'Был ли у мамы запор',
    motherAntibiotics: 'Пила ли мама антибиотики во время беременности',
    motherAnemia: 'Была ли анемия у мамы',
    pregnancyProblems: 'Какие проблемы были в беременности',
    
    // Child specific
    hyperactive: 'Гиперактивный или часто жалуется на усталость',
    hyperactiveYes: 'Гиперактивный',
    tiredOften: 'Часто устаёт',
    sugarDependency: 'Зависимость от сладкого',
    
    // Memory
    memoryConcentration: 'Память и концентрация',
    tiredInMorning: 'С утра устал',
    hardToFallAsleep: 'Трудно заснуть',
    wakeUpOften: 'Часто просыпаюсь',
    
    // Viruses
    hpvHerpes: 'ПВЧ / Герпес',
    
    // Contact
    contactMethod: 'Способ связи',
    telegram: 'Telegram',
    instagram: 'Instagram',
    phone: 'Телефон',
    username: 'Имя пользователя',
    usernameHint: 'Введите без @ или с @',
    phoneHint: '+7 (999) 123-45-67',
    contactLink: 'Ваша ссылка для связи',
    
    // DSGVO
    dsgvoConsent: 'Даю согласие на обработку персональных данных.',
    
    // Buttons
    submit: 'Отправить анкету',
    submitting: 'Отправка...',
    clearForm: 'Очистить форму',
    previewMarkdown: 'Предпросмотр',
    close: 'Закрыть',
    backToHome: 'Вернуться на главную',
    sendAnother: 'Отправить ещё одну анкету',
    
    // Success page
    thankYou: 'Спасибо!',
    successMessage: 'Ваша анкета успешно отправлена. С вами скоро свяжутся.',
    
    // Errors
    required: 'Это поле обязательно',
    invalidNumber: 'Введите корректное число',
    selectAtLeastOne: 'Выберите хотя бы один вариант',
    submitError: 'Ошибка при отправке. Попробуйте позже.',
    
    // Markdown headers (Telegram message layout)
    mdInfant: '👶 Анкета для младенца',
    mdChild: '🧒 Детская анкета',
    mdWoman: '🌸 Женская анкета',
    mdMan: '👨 Мужская анкета',
    mdContacts: '📞 Контакты',
    mdInfantPlain: 'Анкета для младенца',
    mdChildPlain: 'Детская анкета',
    mdWomanPlain: 'Женская анкета',
    mdManPlain: 'Мужская анкета',
    mdNewQuestionnaire: '📋 Новая анкета:',
    mdDateLabel: '📅 Дата:',
    mdMainInfo: '👤 Основная информация:',
    mdContactsDetailed: '📞 Контактные данные для связи:',
    mdFilledViaWebsite: 'Анкета заполнена через сайт',
    
    // File upload
    selectFiles: 'Выбрать файлы',
    selectedFiles: 'Выбранные файлы:',
    fileUploadHint: 'Можно загрузить несколько файлов. Поддерживаемые форматы: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX',
    filesToQuestionnaire: 'Файлы к анкете',
  },
  
  en: {
    // Header & Navigation
    siteTitle: 'Health Questionnaire',
    selectLanguage: 'Language',
    
    // Home page
    welcome: 'Welcome',
    welcomeDescription: 'This is a free health questionnaire. Fill out the form and we will contact you for a consultation.',
    selectCategory: 'Select questionnaire category',
    
    // Categories
    infantTitle: 'Baby',
    infantDescription: 'Under 1 year',
    childTitle: 'Child',
    childDescription: '1–12 years',
    womanTitle: 'Women\'s',
    womanDescription: 'For adult women',
    manTitle: 'Men\'s',
    manDescription: 'For adult men',
    
    // Form labels
    name: 'Name',
    lastName: 'Last Name',
    age: 'Age',
    ageMonths: 'Age (in months)',
    weight: 'Weight (lb)',
    waterPerDay: 'Water per day (liters)',
    additionalInfo: 'Specify your option',
    whatElseToKnow: 'What else should we know about health',
    
    // Common options
    yes: 'Yes',
    no: 'No',
    sometimes: 'Sometimes',
    good: 'Good',
    bad: 'Bad',
    sometimesProblems: 'Sometimes problems',
    normal: 'Normal',
    reduced: 'Reduced',
    veryLow: 'Very low',
    moderate: 'Moderate',
    strong: 'Strong',
    
    // Digestion
    digestion: 'Digestion',
    stomachPain: 'Stomach pain',
    diarrhea: 'Diarrhea',
    constipation: 'Constipation',
    bloating: 'Bloating',
    heartburn: 'Heartburn',
    
    // Sleep & Energy
    sleep: 'Sleep',
    sleepQuality: 'Sleep quality',
    sleepsWell: 'Sleeps well',
    sweatsAtNight: 'Sweats at night',
    grindTeeth: 'Grinds teeth',
    energy: 'Energy',
    energyLevel: 'Energy level',
    
    // Allergies
    allergies: 'Allergies',
    flowering: 'Pollen',
    animals: 'Animals',
    dust: 'Dust',
    food: 'Food',
    medications: 'Medications',
    
    // Skin & Appearance
    skinCondition: 'Skin condition',
    moles: 'Moles',
    warts: 'Warts',
    rashes: 'Rashes',
    eczema: 'Eczema',
    drySkin: 'Dry skin',
    acne: 'Acne',
    irritation: 'Irritation',
    
    // Teeth
    teeth: 'Teeth',
    teethDecayFast: 'Teeth decay quickly',
    teethCrumble: 'Teeth crumble',
    badBreath: 'Bad breath',
    bleedingGums: 'Bleeding gums',
    
    // Joints
    joints: 'Joints',
    crunch: 'Crunching',
    squeak: 'Squeaking',
    inflammation: 'Inflammation',
    
    // Medical history
    injuries: 'Injuries / surgeries / head trauma / fractures',
    operations: 'Operations',
    headaches: 'Headaches / migraines',
    illnessFrequency: 'How often ill / antibiotics taken',
    cystsStones: 'Cysts / fibroids / stones',
    pressure: 'Blood pressure',
    pressureLow: 'Low',
    pressureHigh: 'High',
    pressureNormal: 'Normal',
    takesMedication: 'Do you take medication',
    
    // Women specific
    menstruation: 'Menstruation or menopause',
    discharge: 'Discharge',
    hairCondition: 'Hair condition',
    hairFalling: 'Falling out',
    hairSplit: 'Split ends',
    hairDry: 'Dry',
    hairOk: 'Normal',
    
    // Cold extremities
    coldHands: 'Cold hands/feet',
    coldEvenInSummer: 'Cold hands/feet even in summer',
    
    // Varicose & Hemorrhoids
    varicoseHemorrhoids: 'Varicose veins or hemorrhoids',
    bleeding: 'Bleeding',
    
    // COVID
    covidStatus: 'COVID or vaccination status',
    hadCovid: 'Had COVID',
    vaccinated: 'Vaccinated',
    noCovid: 'No',
    
    // Infant specific
    birthType: 'How was the birth',
    natural: 'Natural',
    cesarean: 'C-section',
    other: 'Other',
    motherToxicosis: 'Did mother have severe toxicosis',
    motherAllergy: 'Did mother have allergies before/during pregnancy',
    motherConstipation: 'Did mother have constipation',
    motherAntibiotics: 'Did mother take antibiotics during pregnancy',
    motherAnemia: 'Did mother have anemia',
    pregnancyProblems: 'What problems were there during pregnancy',
    
    // Child specific
    hyperactive: 'Hyperactive or often complains of tiredness',
    hyperactiveYes: 'Hyperactive',
    tiredOften: 'Often tired',
    sugarDependency: 'Sugar dependency',
    
    // Memory
    memoryConcentration: 'Memory and concentration',
    tiredInMorning: 'Tired in the morning',
    hardToFallAsleep: 'Hard to fall asleep',
    wakeUpOften: 'Wake up often',
    
    // Viruses
    hpvHerpes: 'HPV / Herpes',
    
    // Contact
    contactMethod: 'Contact method',
    telegram: 'Telegram',
    instagram: 'Instagram',
    phone: 'Phone',
    username: 'Username',
    usernameHint: 'Enter with or without @',
    phoneHint: '+1 (555) 123-4567',
    contactLink: 'Your contact link',
    
    // DSGVO
    dsgvoConsent: 'I consent to the processing of my personal data.',
    
    // Buttons
    submit: 'Submit questionnaire',
    submitting: 'Submitting...',
    clearForm: 'Clear form',
    previewMarkdown: 'Preview',
    close: 'Close',
    backToHome: 'Back to home',
    sendAnother: 'Submit another questionnaire',
    
    // Success page
    thankYou: 'Thank you!',
    successMessage: 'Your questionnaire has been successfully submitted. We will contact you soon.',
    
    // Errors
    required: 'This field is required',
    invalidNumber: 'Enter a valid number',
    selectAtLeastOne: 'Select at least one option',
    submitError: 'Error submitting. Please try again later.',
    
    // Markdown headers (Telegram message layout)
    mdInfant: '👶 Infant',
    mdChild: '🧒 Child',
    mdWoman: '🌸 Women\'s',
    mdMan: '👨 Men\'s',
    mdContacts: '📞 Contacts',
    mdInfantPlain: 'Infant questionnaire',
    mdChildPlain: 'Child questionnaire',
    mdWomanPlain: 'Women\'s questionnaire',
    mdManPlain: 'Men\'s questionnaire',
    mdNewQuestionnaire: '📋 New questionnaire:',
    mdDateLabel: '📅 Date:',
    mdMainInfo: '👤 Main information:',
    mdContactsDetailed: '📞 Contact details:',
    mdFilledViaWebsite: 'Questionnaire submitted via website',
    
    // File upload
    selectFiles: 'Select files',
    selectedFiles: 'Selected files:',
    fileUploadHint: 'You can upload multiple files. Supported formats: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX',
    filesToQuestionnaire: 'Files to questionnaire',
  }
};

export const getTranslation = (lang: Language, key: keyof typeof translations['ru']): string => {
  return translations[lang]?.[key] || translations['ru'][key] || key;
};
