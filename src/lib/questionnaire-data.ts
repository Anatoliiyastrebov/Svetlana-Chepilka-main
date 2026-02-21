import { Language } from './translations';

export type QuestionType = 'text' | 'number' | 'radio' | 'checkbox' | 'textarea' | 'file';

export interface QuestionOption {
  value: string;
  label: {
    ru: string;
    en: string;
  };
}

export interface Question {
  id: string;
  type: QuestionType;
  label: {
    ru: string;
    en: string;
  };
  icon: string;
  options?: QuestionOption[];
  required: boolean;
  hasAdditional: boolean;
  placeholder?: {
    ru: string;
    en: string;
  };
  unit?: 'ml' | 'liters' | 'kg' | 'cm' | 'years' | 'months';
}

export interface QuestionnaireSection {
  id: string;
  title: {
    ru: string;
    en: string;
  };
  icon: string;
  questions: Question[];
}

// Common options used across questionnaires
const yesNoOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'В порядке', en: 'No issues' } },
  { value: 'yes', label: { ru: 'Да', en: 'Yes' } },
  { value: 'no', label: { ru: 'Нет', en: 'No' } },
];

const yesNoOptionsSimple: QuestionOption[] = [
  { value: 'yes', label: { ru: 'Да', en: 'Yes' } },
  { value: 'no', label: { ru: 'Нет', en: 'No' } },
];

const digestionOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'В порядке', en: 'No issues' } },
  { value: 'stomach_pain', label: { ru: 'Боли в животе', en: 'Stomach pain' } },
  { value: 'diarrhea', label: { ru: 'Диарея', en: 'Diarrhea' } },
  { value: 'constipation', label: { ru: 'Запор', en: 'Constipation' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const digestionOptionsExtended: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'В порядке', en: 'No issues' } },
  { value: 'stomach_pain', label: { ru: 'Боли в животе', en: 'Stomach pain' } },
  { value: 'diarrhea', label: { ru: 'Диарея', en: 'Diarrhea' } },
  { value: 'constipation', label: { ru: 'Запор', en: 'Constipation' } },
  { value: 'bloating', label: { ru: 'Вздутие', en: 'Bloating' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const digestionOptionsAdult: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'В порядке', en: 'No issues' } },
  { value: 'heartburn', label: { ru: 'Изжога', en: 'Heartburn' } },
  { value: 'bloating', label: { ru: 'Вздутие', en: 'Bloating' } },
  { value: 'diarrhea', label: { ru: 'Диарея', en: 'Diarrhea' } },
  { value: 'constipation', label: { ru: 'Запор', en: 'Constipation' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const allergyOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'В порядке', en: 'No issues' } },
  { value: 'pollen', label: { ru: 'Цветение', en: 'Pollen' } },
  { value: 'animals', label: { ru: 'Животные', en: 'Animals' } },
  { value: 'dust', label: { ru: 'Пыль', en: 'Dust' } },
  { value: 'food', label: { ru: 'Еда', en: 'Food' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const allergyOptionsExtended: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'В порядке', en: 'No issues' } },
  { value: 'pollen', label: { ru: 'Цветение', en: 'Pollen' } },
  { value: 'animals', label: { ru: 'Животные', en: 'Animals' } },
  { value: 'dust', label: { ru: 'Пыль', en: 'Dust' } },
  { value: 'food', label: { ru: 'Еда', en: 'Food' } },
  { value: 'medications', label: { ru: 'Лекарства', en: 'Medications' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const skinOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'В порядке', en: 'No issues' } },
  { value: 'moles', label: { ru: 'Много родинок', en: 'Many moles' } },
  { value: 'warts', label: { ru: 'Бородавки', en: 'Warts' } },
  { value: 'rashes', label: { ru: 'Высыпания', en: 'Rashes' } },
  { value: 'eczema', label: { ru: 'Экзема', en: 'Eczema' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const sleepOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'В порядке', en: 'No issues' } },
  { value: 'good', label: { ru: 'Хорошо', en: 'Good' } },
  { value: 'bad', label: { ru: 'Плохо', en: 'Bad' } },
  { value: 'sometimes', label: { ru: 'Иногда проблемы', en: 'Sometimes problems' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const sleepOptionsSimple: QuestionOption[] = [
  { value: 'good', label: { ru: 'Хорошо', en: 'Good' } },
  { value: 'bad', label: { ru: 'Плохо', en: 'Bad' } },
  { value: 'sometimes', label: { ru: 'Иногда проблемы', en: 'Sometimes problems' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const energyOptions: QuestionOption[] = [
  { value: 'normal', label: { ru: 'Нормальная', en: 'Normal' } },
  { value: 'reduced', label: { ru: 'Сниженная', en: 'Reduced' } },
  { value: 'very_low', label: { ru: 'Очень низкая', en: 'Very low' } },
  { value: 'tired_morning', label: { ru: 'С утра уже присутствует усталость', en: 'Tired in the morning already' } },
  { value: 'no_energy_lunch', label: { ru: 'К обеду нет энергии', en: 'No energy by noon' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const birthOptions: QuestionOption[] = [
  { value: 'natural', label: { ru: 'Естественно', en: 'Natural' } },
  { value: 'cesarean', label: { ru: 'Кесарево', en: 'C-section' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const injuriesOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Все в порядке', en: 'All is well' } },
  { value: 'injuries', label: { ru: 'Травмы', en: 'Injuries' } },
  { value: 'surgeries', label: { ru: 'Операции', en: 'Surgeries' } },
  { value: 'head_trauma', label: { ru: 'Удары по голове', en: 'Head trauma' } },
  { value: 'fractures', label: { ru: 'Переломы', en: 'Fractures' } },
  { value: 'severe_falls', label: { ru: 'Сильные падения', en: 'Severe falls' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const covidOptionsWoman: QuestionOption[] = [
  { value: 'no', label: { ru: 'Нет', en: 'No' } },
  { value: 'had_covid', label: { ru: 'Болела', en: 'Had COVID' } },
  { value: 'vaccinated', label: { ru: 'Вакцинирована', en: 'Vaccinated' } },
  { value: 'both', label: { ru: 'И болела, и вакцинирована', en: 'Both had COVID and vaccinated' } },
];

const covidOptionsMan: QuestionOption[] = [
  { value: 'no', label: { ru: 'Нет', en: 'No' } },
  { value: 'had_covid', label: { ru: 'Болел', en: 'Had COVID' } },
  { value: 'vaccinated', label: { ru: 'Вакцинирован', en: 'Vaccinated' } },
  { value: 'both', label: { ru: 'И болел, и вакцинирован', en: 'Both had COVID and vaccinated' } },
];

const teethOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'В порядке', en: 'No issues' } },
  { value: 'crumble', label: { ru: 'Крошатся', en: 'Crumble' } },
  { value: 'decay_fast', label: { ru: 'Часто портятся', en: 'Decay often' } },
  { value: 'bad_breath', label: { ru: 'Запах изо рта', en: 'Bad breath' } },
  { value: 'bleeding_gums', label: { ru: 'Кровоточивость', en: 'Bleeding gums' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const jointOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'В порядке', en: 'No issues' } },
  { value: 'crunch', label: { ru: 'Хруст', en: 'Crunching' } },
  { value: 'squeak', label: { ru: 'Скрип', en: 'Squeaking' } },
  { value: 'inflammation', label: { ru: 'Воспаление', en: 'Inflammation' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const hairOptions: QuestionOption[] = [
  { value: 'falling', label: { ru: 'Выпадают', en: 'Falling out' } },
  { value: 'split', label: { ru: 'Секутся', en: 'Split ends' } },
  { value: 'dry', label: { ru: 'Сухие', en: 'Dry' } },
  { value: 'ok', label: { ru: 'В порядке', en: 'Normal' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const skinConditionOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'В порядке', en: 'No issues' } },
  { value: 'dry', label: { ru: 'Сухая', en: 'Dry' } },
  { value: 'rashes', label: { ru: 'Высыпания', en: 'Rashes' } },
  { value: 'irritation', label: { ru: 'Раздражение', en: 'Irritation' } },
  { value: 'acne', label: { ru: 'Прыщи', en: 'Acne' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const molesWartsHerpesOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'В порядке', en: 'No issues' } },
  { value: 'moles', label: { ru: 'Родинки', en: 'Moles' } },
  { value: 'warts', label: { ru: 'Бородавки', en: 'Warts' } },
  { value: 'herpes', label: { ru: 'Герпес', en: 'Herpes' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const dischargeMolesWartsHerpesOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'В порядке', en: 'No issues' } },
  { value: 'thrush', label: { ru: 'Молочница', en: 'Thrush' } },
  { value: 'moles', label: { ru: 'Много родинок', en: 'Many moles' } },
  { value: 'warts', label: { ru: 'Бородавки', en: 'Warts' } },
  { value: 'hpv_skin', label: { ru: 'Папилломавирус на коже', en: 'HPV on skin' } },
  { value: 'herpes', label: { ru: 'Герпес', en: 'Herpes' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const memoryOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'В порядке', en: 'No issues' } },
  { value: 'poor_memory', label: { ru: 'Плохая память', en: 'Poor memory' } },
  { value: 'poor_concentration', label: { ru: 'Плохая концентрация', en: 'Poor concentration' } },
  { value: 'both', label: { ru: 'И память, и концентрация', en: 'Both memory and concentration' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const illnessAntibioticsOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'В порядке', en: 'No issues' } },
  { value: 'sometimes_sick', label: { ru: 'Иногда болеет', en: 'Sometimes sick' } },
  { value: 'often_sick', label: { ru: 'Часто болеет', en: 'Often sick' } },
  { value: 'take_antibiotics', label: { ru: 'Принимал антибиотики', en: 'Take antibiotics' } },
  { value: 'both', label: { ru: 'И часто болеет, и принимал антибиотики', en: 'Both often sick and take antibiotics' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const cystsStonesOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'В порядке', en: 'No issues' } },
  { value: 'cysts', label: { ru: 'Кисты', en: 'Cysts' } },
  { value: 'fibroids', label: { ru: 'Миомы', en: 'Fibroids' } },
  { value: 'stones_kidneys', label: { ru: 'Камни в почках', en: 'Stones in kidneys' } },
  { value: 'sand_kidneys', label: { ru: 'Песок в почках', en: 'Sand in kidneys' } },
  { value: 'stones_gallbladder', label: { ru: 'Камни в желчном', en: 'Stones in gallbladder' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const cystsStonesKidneysOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'В порядке', en: 'No issues' } },
  { value: 'cysts', label: { ru: 'Кисты', en: 'Cysts' } },
  { value: 'sand', label: { ru: 'Песок', en: 'Sand' } },
  { value: 'stones_kidneys', label: { ru: 'Камни в почках', en: 'Stones in kidneys' } },
  { value: 'stones_gallbladder', label: { ru: 'Камни в желчном', en: 'Stones in gallbladder' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const menstruationOptions: QuestionOption[] = [
  { value: 'regular', label: { ru: 'Регулярные', en: 'Regular' } },
  { value: 'heavy', label: { ru: 'Обильные', en: 'Heavy' } },
  { value: 'clots', label: { ru: 'Сгустками', en: 'With clots' } },
  { value: 'painful', label: { ru: 'Болезненные', en: 'Painful' } },
  { value: 'hot_flashes', label: { ru: 'Приливы', en: 'Hot flashes' } },
  { value: 'sweating', label: { ru: 'Потливость', en: 'Sweating' } },
  { value: 'poor_sleep', label: { ru: 'Плохой сон', en: 'Poor sleep' } },
  { value: 'mood_swings', label: { ru: 'Скачки настроения', en: 'Mood swings' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const headachesOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'В порядке', en: 'No issues' } },
  { value: 'headaches', label: { ru: 'Головные боли', en: 'Headaches' } },
  { value: 'migraines', label: { ru: 'Мигрени', en: 'Migraines' } },
  { value: 'injuries', label: { ru: 'Травмы', en: 'Injuries' } },
  { value: 'concussion', label: { ru: 'Сотрясение', en: 'Concussion' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const headachesSleepOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'В порядке', en: 'No issues' } },
  { value: 'headaches', label: { ru: 'Головные боли', en: 'Headaches' } },
  { value: 'poor_sleep', label: { ru: 'Плохой сон', en: 'Poor sleep' } },
  { value: 'both', label: { ru: 'И головные боли, и плохой сон', en: 'Both headaches and poor sleep' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const hyperactiveOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'В порядке', en: 'No issues' } },
  { value: 'hyperactive', label: { ru: 'Гиперактивный', en: 'Hyperactive' } },
  { value: 'tired_often', label: { ru: 'Часто устаёт', en: 'Often tired' } },
  { value: 'normal', label: { ru: 'Нормально', en: 'Normal' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const sugarOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'В порядке', en: 'No issues' } },
  { value: 'no', label: { ru: 'Нет', en: 'No' } },
  { value: 'moderate', label: { ru: 'Умеренно', en: 'Moderate' } },
  { value: 'strong', label: { ru: 'Сильно', en: 'Strong' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const pressureOptions: QuestionOption[] = [
  { value: 'low', label: { ru: 'Низкое', en: 'Low' } },
  { value: 'high', label: { ru: 'Высокое', en: 'High' } },
  { value: 'normal', label: { ru: 'Нормальное', en: 'Normal' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const diabetesOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'В порядке', en: 'No issues' } },
  { value: 'pre_diabetes', label: { ru: 'Пред диабет', en: 'Pre-diabetes' } },
  { value: 'diabetes_stage', label: { ru: 'Да', en: 'Yes' } },
  { value: 'on_pills', label: { ru: 'На таблетках', en: 'On pills' } },
  { value: 'on_insulin', label: { ru: 'На инсулине', en: 'On insulin' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const waterOptions: QuestionOption[] = [
  { value: '1', label: { ru: '1 литр', en: '1 liter' } },
  { value: '1.5', label: { ru: '1.5 литра', en: '1.5 liters' } },
  { value: '2', label: { ru: '2 литра', en: '2 liters' } },
  { value: '2.5', label: { ru: '2.5 литра', en: '2.5 liters' } },
  { value: '3', label: { ru: '3 литра', en: '3 liters' } },
  { value: '3.5', label: { ru: '3.5 литра', en: '3.5 liters' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const sleepAdultOptions: QuestionOption[] = [
  { value: 'good', label: { ru: 'Хороший', en: 'Good' } },
  { value: 'hard_to_fall_asleep', label: { ru: 'Трудно заснуть', en: 'Hard to fall asleep' } },
  { value: 'wake_often', label: { ru: 'Часто просыпаюсь', en: 'Wake up often' } },
  { value: 'hear_every_sound', label: { ru: 'Слышу каждый звук', en: 'Hear every sound' } },
  { value: 'sensitive_sleeper', label: { ru: 'Чутко сплю', en: 'Sensitive sleeper' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const weightSatisfactionOptions: QuestionOption[] = [
  { value: 'no', label: { ru: 'Нет', en: 'No' } },
  { value: 'yes_lose', label: { ru: 'Да, хотелось бы похудеть', en: 'Yes, would like to lose weight' } },
  { value: 'yes_gain', label: { ru: 'Да, хотелось бы набрать', en: 'Yes, would like to gain weight' } },
];

// New options for adult questionnaires
const covidComplicationsOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Все в порядке', en: 'All good' } },
  { value: 'hair_loss', label: { ru: 'Выпадение волос', en: 'Hair loss' } },
  { value: 'heart_problems', label: { ru: 'Проблемы с сердцем', en: 'Heart problems' } },
  { value: 'joint_pain', label: { ru: 'Боли в суставах', en: 'Joint pain' } },
  { value: 'memory_loss', label: { ru: 'Ухудшение памяти', en: 'Memory loss' } },
  { value: 'panic_attacks', label: { ru: 'Панические атаки', en: 'Panic attacks' } },
  { value: 'sleep_disorders', label: { ru: 'Нарушение сна', en: 'Sleep disorders' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const covidQuestions: Question[] = [
  {
    id: 'covid_had',
    type: 'radio',
    label: { ru: 'Болели ли вы COVID-19?', en: 'Did you have COVID-19?' },
    icon: 'shield',
    options: [
      { value: 'yes', label: { ru: 'Да', en: 'Yes' } },
      { value: 'no', label: { ru: 'Нет', en: 'No' } },
    ],
    required: true,
    hasAdditional: false,
  },
  {
    id: 'covid_times',
    type: 'text',
    label: { ru: 'Сколько раз', en: 'How many times' },
    icon: 'shield',
    required: true,
    hasAdditional: false,
    placeholder: { ru: 'Укажите количество раз', en: 'Specify number of times' },
  },
  {
    id: 'covid_vaccinated',
    type: 'radio',
    label: { ru: 'Делали ли вакцинацию от COVID?', en: 'Did you get COVID vaccination?' },
    icon: 'shield',
    options: [
      { value: 'yes', label: { ru: 'Да', en: 'Yes' } },
      { value: 'no', label: { ru: 'Нет', en: 'No' } },
    ],
    required: true,
    hasAdditional: false,
  },
  {
    id: 'covid_doses',
    type: 'text',
    label: { ru: 'Сколько доз', en: 'How many doses' },
    icon: 'shield',
    required: true,
    hasAdditional: false,
    placeholder: { ru: 'Укажите количество доз', en: 'Specify number of doses' },
  },
  {
    id: 'covid_complications',
    type: 'checkbox',
    label: { ru: 'Были ли осложнения после ковида или вакцинации', en: 'Were there complications after COVID or vaccination' },
    icon: 'shield',
    options: covidComplicationsOptions,
    required: true,
    hasAdditional: true,
  },
];

const digestionNewOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Все в порядке', en: 'No issues' } },
  { value: 'heartburn', label: { ru: 'Изжога', en: 'Heartburn' } },
  { value: 'bitterness', label: { ru: 'Горечь во рту', en: 'Bitterness in mouth' } },
  { value: 'bloating', label: { ru: 'Вздутие', en: 'Bloating' } },
  { value: 'heaviness', label: { ru: 'Тяжесть после еды', en: 'Heaviness after eating' } },
  { value: 'gas', label: { ru: 'Газы', en: 'Gas' } },
  { value: 'diarrhea', label: { ru: 'Диарея', en: 'Diarrhea' } },
  { value: 'constipation', label: { ru: 'Запоры', en: 'Constipation' } },
  { value: 'pancreatitis', label: { ru: 'Панкреатит', en: 'Pancreatitis' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const hairNewOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Все в порядке', en: 'All good' } },
  { value: 'severe_loss', label: { ru: 'Сильное выпадение', en: 'Severe hair loss' } },
  { value: 'dryness', label: { ru: 'Сухость', en: 'Dryness' } },
  { value: 'oiliness', label: { ru: 'Жирность', en: 'Oiliness' } },
  { value: 'brittleness', label: { ru: 'Ломкость', en: 'Brittleness' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const teethGumsOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Все в порядке', en: 'All good' } },
  { value: 'teeth_decay', label: { ru: 'Быстро портятся или крошатся зубы', en: 'Teeth decay or crumble quickly' } },
  { value: 'bad_breath', label: { ru: 'Неприятный запах изо рта', en: 'Bad breath' } },
  { value: 'bleeding_gums', label: { ru: 'Кровоточат дёсны', en: 'Bleeding gums' } },
  { value: 'sensitivity', label: { ru: 'Чувствительность зубов', en: 'Tooth sensitivity' } },
  { value: 'gum_inflammation', label: { ru: 'Воспаление дёсен', en: 'Gum inflammation' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const operationsTraumasOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Нет операций и травм', en: 'No operations or injuries' } },
  { value: 'had_operations', label: { ru: 'Были операции', en: 'Had operations' } },
  { value: 'organs_removed', label: { ru: 'Удалены органы', en: 'Organs removed' } },
  { value: 'had_injuries', label: { ru: 'Были серьёзные травмы', en: 'Had serious injuries' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const chronicDiseasesOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Нет', en: 'No' } },
  { value: 'diabetes', label: { ru: 'Диабет', en: 'Diabetes' } },
  { value: 'autoimmune_thyroiditis', label: { ru: 'Аутоиммунный тиреоидит', en: 'Autoimmune thyroiditis' } },
  { value: 'psoriasis', label: { ru: 'Псориаз', en: 'Psoriasis' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const nervousSystemOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Все в порядке', en: 'No issues' } },
  { value: 'headaches', label: { ru: 'Головные боли', en: 'Headaches' } },
  { value: 'migraines', label: { ru: 'Мигрени', en: 'Migraines' } },
  { value: 'weather_dependency', label: { ru: 'Метеозависимость', en: 'Weather dependency' } },
  { value: 'dizziness', label: { ru: 'Головокружения', en: 'Dizziness' } },
  { value: 'tinnitus', label: { ru: 'Шум в ушах', en: 'Tinnitus' } },
  { value: 'floaters', label: { ru: '«Мушки» перед глазами', en: 'Floaters before eyes' } },
  { value: 'concussion', label: { ru: 'Были сотрясения или удары по голове', en: 'Had concussions or head trauma' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const circulationOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Все в порядке', en: 'All good' } },
  { value: 'numbness', label: { ru: 'Онемение пальцев рук или ног', en: 'Numbness of fingers or toes' } },
  { value: 'cold_limbs', label: { ru: 'Мёрзнут руки и ноги даже летом', en: 'Cold hands and feet even in summer' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const vesselsOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Все в порядке', en: 'All good' } },
  { value: 'varicose_mild', label: { ru: 'Сосудистые звёздочки / сетка', en: 'Spider veins / vascular network' } },
  { value: 'varicose_severe', label: { ru: 'Выраженный варикоз', en: 'Severe varicose veins' } },
  { value: 'hemorrhoids', label: { ru: 'Геморрой', en: 'Hemorrhoids' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const adultSkinOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Все в порядке', en: 'All good' } },
  { value: 'pigment_spots', label: { ru: 'Пигментные пятна', en: 'Pigment spots' } },
  { value: 'acne', label: { ru: 'Акне / высыпания', en: 'Acne / rashes' } },
  { value: 'dryness', label: { ru: 'Сухость / шелушение', en: 'Dryness / peeling' } },
  { value: 'eczema', label: { ru: 'Экзема / дерматит', en: 'Eczema / dermatitis' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const jointsSpineOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Все в порядке', en: 'All good' } },
  { value: 'crunch', label: { ru: 'Хруст / скрип в суставах', en: 'Joint crunching / squeaking' } },
  { value: 'inflammation', label: { ru: 'Воспаление суставов', en: 'Joint inflammation' } },
  { value: 'arthrosis', label: { ru: 'Артроз', en: 'Arthrosis' } },
  { value: 'back_pain', label: { ru: 'Боли в спине / пояснице', en: 'Back / lower back pain' } },
  { value: 'neck_pain', label: { ru: 'Боли в шее', en: 'Neck pain' } },
  { value: 'knee_pain', label: { ru: 'Боли в коленях', en: 'Knee pain' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const formationsOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Нет', en: 'No' } },
  { value: 'cysts', label: { ru: 'Кисты', en: 'Cysts' } },
  { value: 'polyps', label: { ru: 'Полипы', en: 'Polyps' } },
  { value: 'fibroids', label: { ru: 'Миомы', en: 'Fibroids' } },
  { value: 'tumors', label: { ru: 'Опухоли', en: 'Tumors' } },
  { value: 'hernias', label: { ru: 'Грыжи', en: 'Hernias' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const infectionsDischargeOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Все в порядке', en: 'All good' } },
  { value: 'herpes', label: { ru: 'Герпес', en: 'Herpes' } },
  { value: 'papillomas', label: { ru: 'Папилломы', en: 'Papillomas' } },
  { value: 'warts', label: { ru: 'Бородавки', en: 'Warts' } },
  { value: 'moles', label: { ru: 'Родинки', en: 'Moles' } },
  { value: 'red_spots', label: { ru: 'Красные точки на коже', en: 'Red spots on skin' } },
  { value: 'discharge_female', label: { ru: 'Выделения (по-женски)', en: 'Discharge (female)' } },
  { value: 'discharge_male', label: { ru: 'Выделения (по-мужски)', en: 'Discharge (male)' } },
  { value: 'cystitis', label: { ru: 'Цистит', en: 'Cystitis' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const menstruationNewOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Все в порядке', en: 'No issues' } },
  { value: 'regular', label: { ru: 'Регулярные', en: 'Regular' } },
  { value: 'irregular', label: { ru: 'Нерегулярные', en: 'Irregular' } },
  { value: 'painful', label: { ru: 'Болезненные', en: 'Painful' } },
  { value: 'heavy', label: { ru: 'Обильные', en: 'Heavy' } },
  { value: 'prolonged', label: { ru: 'Затяжные', en: 'Prolonged' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const skinNewOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Все в порядке', en: 'All good' } },
  { value: 'acne', label: { ru: 'Прыщи', en: 'Acne' } },
  { value: 'acne_severe', label: { ru: 'Акне', en: 'Severe acne' } },
  { value: 'furuncles', label: { ru: 'Фурункулы', en: 'Furuncles' } },
  { value: 'irritation', label: { ru: 'Раздражение', en: 'Irritation' } },
  { value: 'rosacea', label: { ru: 'Розацеа', en: 'Rosacea' } },
  { value: 'dermatitis', label: { ru: 'Дерматит', en: 'Dermatitis' } },
  { value: 'eczema', label: { ru: 'Экзема', en: 'Eczema' } },
  { value: 'psoriasis', label: { ru: 'Псориаз', en: 'Psoriasis' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const allergiesNewOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Нет', en: 'No' } },
  { value: 'pollen', label: { ru: 'Пыльца', en: 'Pollen' } },
  { value: 'food', label: { ru: 'Еда', en: 'Food' } },
  { value: 'animal_hair', label: { ru: 'Шерсть животных', en: 'Animal hair' } },
  { value: 'dust', label: { ru: 'Пыль', en: 'Dust' } },
  { value: 'medications', label: { ru: 'Лекарства', en: 'Medications' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const sleepNewOptions: QuestionOption[] = [
  { value: 'good', label: { ru: 'Хороший', en: 'Good' } },
  { value: 'hard_to_fall_asleep', label: { ru: 'Трудно заснуть', en: 'Hard to fall asleep' } },
  { value: 'frequent_waking', label: { ru: 'Частые пробуждения', en: 'Frequent waking' } },
  { value: 'light_sleep', label: { ru: 'Поверхностный сон', en: 'Light sleep' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const energyNewOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Все в порядке', en: 'No issues' } },
  { value: 'hard_to_wake', label: { ru: 'Тяжело просыпаться', en: 'Hard to wake up' } },
  { value: 'no_energy', label: { ru: 'Нет энергии', en: 'No energy' } },
  { value: 'need_coffee', label: { ru: 'Нужен кофе', en: 'Need coffee' } },
  { value: 'feel_rested', label: { ru: 'Чувствую себя отдохнувшим', en: 'Feel rested' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const memoryConcentrationOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Все в порядке', en: 'No issues' } },
  { value: 'memory_decline', label: { ru: 'Ухудшение памяти', en: 'Memory decline' } },
  { value: 'concentration_difficulties', label: { ru: 'Трудности с концентрацией', en: 'Concentration difficulties' } },
  { value: 'forgetfulness', label: { ru: 'Забывчивость', en: 'Forgetfulness' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const lifestyleOptions: QuestionOption[] = [
  { value: 'sedentary', label: { ru: 'Сидячий', en: 'Sedentary' } },
  { value: 'regular_sport', label: { ru: 'Регулярный спорт', en: 'Regular sport' } },
  { value: 'home_gymnastics', label: { ru: 'Домашняя гимнастика', en: 'Home gymnastics' } },
  { value: 'hardening', label: { ru: 'Закаливание', en: 'Hardening' } },
  { value: 'high_stress', label: { ru: 'Высокий уровень стресса', en: 'High stress level' } },
  { value: 'physical_work', label: { ru: 'Физически тяжёлая работа', en: 'Physically heavy work' } },
  { value: 'toxic_contact', label: { ru: 'Контакт с токсичными веществами', en: 'Contact with toxic substances' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

const supplementsOptions: QuestionOption[] = [
  { value: 'regularly', label: { ru: 'Принимаю регулярно', en: 'Take regularly' } },
  { value: 'periodically', label: { ru: 'Периодически', en: 'Periodically' } },
  { value: 'not_taking', label: { ru: 'Не принимаю', en: 'Not taking' } },
  { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
];

// Infant questionnaire (type = infant)
export const infantQuestionnaire: QuestionnaireSection[] = [
  {
    id: 'personal',
    title: { ru: 'Личные данные', en: 'Personal Information' },
    icon: 'user',
    questions: [
      {
        id: 'name',
        type: 'text',
        label: { ru: 'Имя', en: 'Name' },
        icon: 'user',
        required: true,
        hasAdditional: false,
        placeholder: { ru: 'Имя ребёнка', en: 'Child\'s name' },
      },
      {
        id: 'age_months',
        type: 'number',
        label: { ru: 'Возраст (в месяцах)', en: 'Age (in months)' },
        icon: 'calendar',
        required: true,
        hasAdditional: false,
        placeholder: { ru: 'Например: 6', en: 'Example: 6' },
        unit: 'months',
      },
      {
        id: 'weight',
        type: 'number',
        label: { ru: 'Вес', en: 'Weight' },
        icon: 'scale',
        required: true,
        hasAdditional: false,
        placeholder: { ru: 'В килограммах', en: 'In kilograms' },
        unit: 'kg',
      },
    ],
  },
  {
    id: 'health',
    title: { ru: 'Здоровье', en: 'Health' },
    icon: 'heart',
    questions: [
      {
        id: 'digestion',
        type: 'checkbox',
        label: { ru: 'Пищеварение', en: 'Digestion' },
        icon: 'heart',
        options: digestionOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'sweats_at_night',
        type: 'radio',
        label: { ru: 'Потеет во сне', en: 'Sweats at night' },
        icon: 'droplets',
        options: yesNoOptionsSimple,
        required: true,
        hasAdditional: false,
      },
      {
        id: 'bad_breath',
        type: 'radio',
        label: { ru: 'Есть ли неприятный запах изо рта', en: 'Is there bad breath' },
        icon: 'wind',
        options: yesNoOptionsSimple,
        required: true,
        hasAdditional: false,
      },
      {
        id: 'skin_condition',
        type: 'checkbox',
        label: { ru: 'Родинки / бородавки / высыпания / экзема', en: 'Moles / warts / rashes / eczema' },
        icon: 'sparkles',
        options: skinOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'allergies',
        type: 'checkbox',
        label: { ru: 'Аллергия', en: 'Allergies' },
        icon: 'flower',
        options: allergyOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'water_per_day',
        type: 'number',
        label: { ru: 'Сколько воды в день пьёт ребенок (мл)', en: 'How much water does the child drink per day (ml)' },
        icon: 'droplet',
        required: true,
        hasAdditional: false,
        placeholder: { ru: 'Например: 200', en: 'Example: 200' },
        unit: 'ml',
      },
      {
        id: 'injuries',
        type: 'checkbox',
        label: { ru: 'Травмы / операции / удары по голове / переломы', en: 'Injuries / surgeries / head trauma / fractures' },
        icon: 'activity',
        options: injuriesOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'sleep_quality',
        type: 'radio',
        label: { ru: 'Хорошо ли спит', en: 'Does the child sleep well' },
        icon: 'moon',
        options: sleepOptionsSimple,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'illness_antibiotics',
        type: 'checkbox',
        label: { ru: 'Часто ли болеет / принимал ли антибиотики', en: 'Is often sick / has taken antibiotics' },
        icon: 'pill',
        options: illnessAntibioticsOptions,
        required: true,
        hasAdditional: true,
      },
    ],
  },
  {
    id: 'birth_pregnancy',
    title: { ru: 'Роды и беременность', en: 'Birth and Pregnancy' },
    icon: 'baby',
    questions: [
      {
        id: 'birth_type',
        type: 'radio',
        label: { ru: 'Как прошли роды', en: 'How was the birth' },
        icon: 'baby',
        options: birthOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'mother_toxicosis',
        type: 'radio',
        label: { ru: 'Был ли у мамы сильный токсикоз при беременности', en: 'Did mother have severe toxicosis during pregnancy' },
        icon: 'alert-circle',
        options: yesNoOptionsSimple,
        required: true,
        hasAdditional: false,
      },
      {
        id: 'mother_allergy',
        type: 'radio',
        label: { ru: 'Была ли у мамы аллергия до или во время беременности', en: 'Did mother have allergies before or during pregnancy' },
        icon: 'flower',
        options: yesNoOptionsSimple,
        required: true,
        hasAdditional: false,
      },
      {
        id: 'mother_constipation',
        type: 'radio',
        label: { ru: 'Был ли у мамы запор', en: 'Did mother have constipation' },
        icon: 'alert-triangle',
        options: yesNoOptionsSimple,
        required: true,
        hasAdditional: false,
      },
      {
        id: 'mother_antibiotics',
        type: 'radio',
        label: { ru: 'Пила ли мама антибиотики во время беременности', en: 'Did mother take antibiotics during pregnancy' },
        icon: 'pill',
        options: yesNoOptionsSimple,
        required: true,
        hasAdditional: false,
      },
      {
        id: 'mother_anemia',
        type: 'radio',
        label: { ru: 'Была ли анемия у мамы', en: 'Did mother have anemia' },
        icon: 'heart',
        options: yesNoOptionsSimple,
        required: true,
        hasAdditional: false,
      },
      {
        id: 'pregnancy_problems',
        type: 'radio',
        label: { ru: 'Были ли проблемы во время беременности', en: 'Were there problems during pregnancy' },
        icon: 'file-text',
        options: yesNoOptionsSimple,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'what_else',
        type: 'textarea',
        label: { ru: 'Что ещё нужно знать о здоровье ребёнка', en: 'What else should we know about the child\'s health' },
        icon: 'info',
        required: true,
        hasAdditional: false,
        placeholder: { ru: 'Дополнительная информация', en: 'Additional information' },
      },
      {
        id: 'how_learned',
        type: 'radio',
        label: { ru: 'Как вы обо мне узнали?', en: 'How did you learn about me?' },
        icon: 'info',
        required: true,
        hasAdditional: true,
        options: [
          { value: 'instagram', label: { ru: 'Инстаграм', en: 'Instagram' } },
          { value: 'telegram_channel', label: { ru: 'Телеграмм канал', en: 'Telegram channel' } },
          { value: 'recommendation', label: { ru: 'По рекомендации', en: 'By recommendation' } },
        ],
      },
    ],
  },
];

// Child questionnaire (type = child)
export const childQuestionnaire: QuestionnaireSection[] = [
  {
    id: 'personal',
    title: { ru: 'Личные данные', en: 'Personal Information' },
    icon: 'user',
    questions: [
      {
        id: 'name',
        type: 'text',
        label: { ru: 'Имя', en: 'Name' },
        icon: 'user',
        required: true,
        hasAdditional: false,
        placeholder: { ru: 'Имя ребёнка', en: 'Child\'s name' },
      },
      {
        id: 'age',
        type: 'number',
        label: { ru: 'Возраст', en: 'Age' },
        icon: 'calendar',
        required: true,
        hasAdditional: false,
        placeholder: { ru: 'Полных лет', en: 'Years' },
        unit: 'years',
      },
      {
        id: 'weight',
        type: 'number',
        label: { ru: 'Вес', en: 'Weight' },
        icon: 'scale',
        required: true,
        hasAdditional: false,
        placeholder: { ru: 'В килограммах', en: 'In kilograms' },
        unit: 'kg',
      },
    ],
  },
  {
    id: 'health',
    title: { ru: 'Здоровье', en: 'Health' },
    icon: 'heart',
    questions: [
      {
        id: 'digestion',
        type: 'checkbox',
        label: { ru: 'Пищеварение', en: 'Digestion' },
        icon: 'heart',
        options: digestionOptionsExtended,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'teeth_decay',
        type: 'radio',
        label: { ru: 'Зубы быстро портятся', en: 'Teeth decay quickly' },
        icon: 'smile',
        options: yesNoOptions,
        required: true,
        hasAdditional: false,
      },
      {
        id: 'sweats_grinds',
        type: 'checkbox',
        label: { ru: 'Потеет во сне / скрипит зубами', en: 'Sweats at night / grinds teeth' },
        icon: 'moon',
        options: [
          { value: 'no_issues', label: { ru: 'В порядке', en: 'No issues' } },
          { value: 'sweats', label: { ru: 'Потеет во сне', en: 'Sweats at night' } },
          { value: 'grinds', label: { ru: 'Скрипит зубами', en: 'Grinds teeth' } },
          { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
        ],
        required: true,
        hasAdditional: true,
      },
      {
        id: 'bad_breath',
        type: 'radio',
        label: { ru: 'Неприятный запах изо рта', en: 'Bad breath' },
        icon: 'wind',
        options: yesNoOptionsSimple,
        required: true,
        hasAdditional: false,
      },
      {
        id: 'sugar_dependency',
        type: 'text',
        label: { ru: 'Зависимость от сладкого', en: 'Sugar dependency' },
        icon: 'candy',
        required: true,
        hasAdditional: false,
        placeholder: { ru: 'Опишите', en: 'Describe' },
      },
      {
        id: 'skin_condition',
        type: 'checkbox',
        label: { ru: 'Родинки / бородавки / высыпания / экзема', en: 'Moles / warts / rashes / eczema' },
        icon: 'sparkles',
        options: skinOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'allergies',
        type: 'checkbox',
        label: { ru: 'Аллергия', en: 'Allergies' },
        icon: 'flower',
        options: allergyOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'hyperactive',
        type: 'radio',
        label: { ru: 'Гиперактивный или часто жалуется на усталость', en: 'Hyperactive or often complains of tiredness' },
        icon: 'zap',
        options: hyperactiveOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'water_per_day',
        type: 'radio',
        label: { ru: 'Сколько воды в день', en: 'Water per day' },
        icon: 'droplet',
        options: waterOptions,
        required: true,
        hasAdditional: true,
        unit: 'liters',
      },
      {
        id: 'injuries',
        type: 'checkbox',
        label: { ru: 'Травмы / операции / удары по голове / переломы', en: 'Injuries / surgeries / head trauma / fractures' },
        icon: 'activity',
        options: injuriesOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'headaches_sleep',
        type: 'checkbox',
        label: { ru: 'Жалобы на головную боль, плохой сон', en: 'Headache complaints, poor sleep' },
        icon: 'brain',
        options: headachesSleepOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'illness_antibiotics',
        type: 'checkbox',
        label: { ru: 'Часто ли болеет, принимал ли антибиотики', en: 'Is often sick, has taken antibiotics' },
        icon: 'pill',
        options: illnessAntibioticsOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'what_else',
        type: 'textarea',
        label: { ru: 'Что ещё нужно знать', en: 'What else should we know' },
        icon: 'info',
        required: true,
        hasAdditional: false,
        placeholder: { ru: 'Дополнительная информация', en: 'Additional information' },
      },
      {
        id: 'how_learned',
        type: 'radio',
        label: { ru: 'Как вы обо мне узнали?', en: 'How did you learn about me?' },
        icon: 'info',
        required: true,
        hasAdditional: true,
        options: [
          { value: 'instagram', label: { ru: 'Инстаграм', en: 'Instagram' } },
          { value: 'telegram_channel', label: { ru: 'Телеграмм канал', en: 'Telegram channel' } },
          { value: 'recommendation', label: { ru: 'По рекомендации', en: 'By recommendation' } },
        ],
      },
    ],
  },
];

// Woman questionnaire (type = woman)
export const womanQuestionnaire: QuestionnaireSection[] = [
  // 1. Общие данные
  {
    id: 'personal',
    title: { ru: 'Общие данные', en: 'General Information' },
    icon: 'user',
    questions: [
      {
        id: 'name',
        type: 'text',
        label: { ru: 'Имя', en: 'Name' },
        icon: 'user',
        required: true,
        hasAdditional: false,
        placeholder: { ru: 'Ваше имя', en: 'Your name' },
      },
      {
        id: 'last_name',
        type: 'text',
        label: { ru: 'Фамилия', en: 'Last Name' },
        icon: 'user',
        required: true,
        hasAdditional: false,
        placeholder: { ru: 'Ваша фамилия', en: 'Your last name' },
      },
      {
        id: 'age',
        type: 'number',
        label: { ru: 'Возраст', en: 'Age' },
        icon: 'calendar',
        required: true,
        hasAdditional: false,
        placeholder: { ru: 'Полных лет', en: 'Years' },
        unit: 'years',
      },
      {
        id: 'height',
        type: 'number',
        label: { ru: 'Рост', en: 'Height' },
        icon: 'ruler',
        required: true,
        hasAdditional: false,
        placeholder: { ru: 'В сантиметрах', en: 'In centimeters' },
        unit: 'cm',
      },
      {
        id: 'weight',
        type: 'number',
        label: { ru: 'Вес', en: 'Weight' },
        icon: 'scale',
        required: true,
        hasAdditional: false,
        placeholder: { ru: 'В килограммах', en: 'In kilograms' },
        unit: 'kg',
      },
    ],
  },
  // 2. Цели по весу
  {
    id: 'weight_goals',
    title: { ru: 'Цели по весу', en: 'Weight Goals' },
    icon: 'scale',
    questions: [
      {
        id: 'weight_satisfaction',
        type: 'radio',
        label: { ru: 'Довольны ли вы своим весом?', en: 'Are you satisfied with your weight?' },
        icon: 'scale',
        options: yesNoOptionsSimple,
        required: true,
        hasAdditional: false,
      },
      {
        id: 'weight_change',
        type: 'text',
        label: { ru: 'Сколько кг хотите убрать / добавить', en: 'How many kg do you want to lose / gain' },
        icon: 'scale',
        required: true,
        hasAdditional: false,
        placeholder: { ru: 'Например: -5 или +3', en: 'Example: -5 or +3' },
        unit: 'kg',
      },
    ],
  },
  // 3. Водный режим
  {
    id: 'water',
    title: { ru: 'Водный режим', en: 'Water Intake' },
    icon: 'droplet',
    questions: [
      {
        id: 'water_per_day',
        type: 'radio',
        label: { ru: 'Сколько литров чистой воды вы пьёте в день? (не считая чай, кофе, соки и другие напитки)', en: 'How many liters of pure water do you drink per day? (not counting tea, coffee, juices and other drinks)' },
        icon: 'droplet',
        options: [
          { value: 'less_1', label: { ru: 'До 1 л', en: 'Less than 1 L' } },
          { value: '1', label: { ru: '1 л', en: '1 L' } },
          { value: '1.5', label: { ru: '1.5 л', en: '1.5 L' } },
          { value: '2', label: { ru: '2 л', en: '2 L' } },
          { value: '2.5', label: { ru: '2.5 л', en: '2.5 L' } },
          { value: '3', label: { ru: '3 л', en: '3 L' } },
          { value: '3.5', label: { ru: '3.5 л', en: '3.5 L' } },
          { value: '4_plus', label: { ru: '4 л и более', en: '4 L and more' } },
        ],
        required: true,
        hasAdditional: false,
      },
    ],
  },
  // 4. COVID / вакцинация
  {
    id: 'covid',
    title: { ru: 'COVID / вакцинация', en: 'COVID / Vaccination' },
    icon: 'shield',
    questions: covidQuestions,
  },
  // 4. Волосы
  {
    id: 'hair',
    title: { ru: 'Волосы', en: 'Hair' },
    icon: 'sparkles',
    questions: [
      {
        id: 'hair_problems',
        type: 'checkbox',
        label: { ru: 'Состояние волос', en: 'Hair condition' },
        icon: 'sparkles',
        options: hairNewOptions,
        required: true,
        hasAdditional: true,
      },
    ],
  },
  // 5. Зубы и дёсны
  {
    id: 'teeth',
    title: { ru: 'Зубы и дёсны', en: 'Teeth and Gums' },
    icon: 'smile',
    questions: [
      {
        id: 'teeth_gums_problems',
        type: 'checkbox',
        label: { ru: 'Состояние зубов', en: 'Teeth condition' },
        icon: 'smile',
        options: teethGumsOptions,
        required: true,
        hasAdditional: true,
      },
    ],
  },
  // 6. Пищеварение
  {
    id: 'digestion',
    title: { ru: 'Пищеварение', en: 'Digestion' },
    icon: 'heart',
    questions: [
      {
        id: 'digestion_problems',
        type: 'checkbox',
        label: { ru: 'Отметьте подходящее', en: 'Check what applies' },
        icon: 'heart',
        options: digestionNewOptions,
        required: true,
        hasAdditional: true,
      },
    ],
  },
  // 7. Желчный пузырь и почки
  {
    id: 'gallbladder_kidneys',
    title: { ru: 'Желчный пузырь и почки', en: 'Gallbladder and Kidneys' },
    icon: 'circle',
    questions: [
      {
        id: 'gallbladder_kidneys_status',
        type: 'checkbox',
        label: { ru: 'Желчный пузырь и почки', en: 'Gallbladder and Kidneys' },
        icon: 'circle',
        options: [
          { value: 'no_issues', label: { ru: 'Все в порядке', en: 'All good' } },
          { value: 'gallbladder_sand', label: { ru: 'Песок в желчном пузыре', en: 'Sand in gallbladder' } },
          { value: 'gallbladder_stones', label: { ru: 'Камни в желчном пузыре', en: 'Gallbladder stones' } },
          { value: 'kidney_sand', label: { ru: 'Песок в почках', en: 'Sand in kidneys' } },
          { value: 'kidney_stones', label: { ru: 'Камни в почках', en: 'Kidney stones' } },
          { value: 'gallbladder_removed', label: { ru: 'Желчный пузырь удалён', en: 'Gallbladder removed' } },
          { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
        ],
        required: true,
        hasAdditional: true,
      },
    ],
  },
  // 8. Операции и травмы
  {
    id: 'operations_traumas',
    title: { ru: 'Операции и травмы', en: 'Operations and Injuries' },
    icon: 'scissors',
    questions: [
      {
        id: 'operations_traumas_status',
        type: 'checkbox',
        label: { ru: 'Операции и травмы', en: 'Operations and Injuries' },
        icon: 'scissors',
        options: operationsTraumasOptions,
        required: true,
        hasAdditional: true,
      },
    ],
  },
  // 9. Артериальное давление
  {
    id: 'blood_pressure',
    title: { ru: 'Артериальное давление', en: 'Blood Pressure' },
    icon: 'activity',
    questions: [
      {
        id: 'pressure',
        type: 'radio',
        label: { ru: 'Давление', en: 'Blood pressure' },
        icon: 'activity',
        options: pressureOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'pressure_medication',
        type: 'text',
        label: { ru: 'Принимаете ли лекарства и как долго?', en: 'Do you take medication and for how long?' },
        icon: 'pill',
        required: true,
        hasAdditional: false,
        placeholder: { ru: 'Например: Лозартан, 2 года', en: 'Example: Losartan, 2 years' },
      },
    ],
  },
  // 10. Хронические и аутоиммунные заболевания
  {
    id: 'chronic_diseases',
    title: { ru: 'Хронические и аутоиммунные заболевания', en: 'Chronic and Autoimmune Diseases' },
    icon: 'alert-circle',
    questions: [
      {
        id: 'chronic_autoimmune',
        type: 'checkbox',
        label: { ru: 'Отметьте подходящее', en: 'Check what applies' },
        icon: 'alert-circle',
        options: chronicDiseasesOptions,
        required: true,
        hasAdditional: true,
      },
    ],
  },
  // 11. Нервная система
  {
    id: 'nervous_system',
    title: { ru: 'Нервная система', en: 'Nervous System' },
    icon: 'brain',
    questions: [
      {
        id: 'nervous_system_problems',
        type: 'checkbox',
        label: { ru: 'Отметьте подходящее', en: 'Check what applies' },
        icon: 'brain',
        options: nervousSystemOptions,
        required: true,
        hasAdditional: true,
      },
    ],
  },
  // 12. Кровообращение
  {
    id: 'circulation',
    title: { ru: 'Кровообращение', en: 'Circulation' },
    icon: 'heart',
    questions: [
      {
        id: 'circulation_problems',
        type: 'checkbox',
        label: { ru: 'Отметьте подходящее', en: 'Check what applies' },
        icon: 'heart',
        options: circulationOptions,
        required: true,
        hasAdditional: true,
      },
    ],
  },
  // 13. Сосуды и кожа
  {
    id: 'vessels_skin',
    title: { ru: 'Сосуды и кожа', en: 'Vessels and Skin' },
    icon: 'heart',
    questions: [
      {
        id: 'vessels_problems',
        type: 'checkbox',
        label: { ru: 'Состояние сосудов', en: 'Vessel condition' },
        icon: 'heart',
        options: vesselsOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'skin_condition',
        type: 'checkbox',
        label: { ru: 'Состояние кожи', en: 'Skin condition' },
        icon: 'heart',
        options: adultSkinOptions,
        required: true,
        hasAdditional: true,
      },
    ],
  },
  // 14. Суставы и позвоночник
  {
    id: 'joints_spine',
    title: { ru: 'Суставы и позвоночник', en: 'Joints and Spine' },
    icon: 'bone',
    questions: [
      {
        id: 'joints_spine_problems',
        type: 'checkbox',
        label: { ru: 'Суставы и позвоночник', en: 'Joints and Spine' },
        icon: 'bone',
        options: jointsSpineOptions,
        required: true,
        hasAdditional: true,
      },
    ],
  },
  // 15. Образования
  {
    id: 'formations',
    title: { ru: 'Образования', en: 'Formations' },
    icon: 'circle',
    questions: [
      {
        id: 'formations_present',
        type: 'checkbox',
        label: { ru: 'Отметьте подходящее', en: 'Check what applies' },
        icon: 'circle',
        options: formationsOptions,
        required: true,
        hasAdditional: true,
      },
    ],
  },
  // 16. Инфекции и выделения
  {
    id: 'infections_discharge',
    title: { ru: 'Инфекции и выделения', en: 'Infections and Discharge' },
    icon: 'alert-circle',
    questions: [
      {
        id: 'infections_discharge_problems',
        type: 'checkbox',
        label: { ru: 'Отметьте подходящее', en: 'Check what applies' },
        icon: 'alert-circle',
        options: infectionsDischargeOptions.filter(opt => opt.value !== 'discharge_male'),
        required: true,
        hasAdditional: true,
      },
    ],
  },
  // 17. Женская анкета — месячные
  {
    id: 'menstruation',
    title: { ru: 'Месячные', en: 'Menstruation' },
    icon: 'calendar',
    questions: [
      {
        id: 'menstruation_problems',
        type: 'checkbox',
        label: { ru: 'Отметьте подходящее', en: 'Check what applies' },
        icon: 'calendar',
        options: menstruationNewOptions,
        required: true,
        hasAdditional: true,
      },
    ],
  },
  // 18. Кожа
  {
    id: 'skin',
    title: { ru: 'Кожа', en: 'Skin' },
    icon: 'sparkles',
    questions: [
      {
        id: 'skin_problems',
        type: 'checkbox',
        label: { ru: 'Отметьте подходящее', en: 'Check what applies' },
        icon: 'sparkles',
        options: skinNewOptions,
        required: true,
        hasAdditional: true,
      },
    ],
  },
  // 19. Аллергии
  {
    id: 'allergies',
    title: { ru: 'Аллергии', en: 'Allergies' },
    icon: 'flower',
    questions: [
      {
        id: 'allergies_present',
        type: 'checkbox',
        label: { ru: 'Отметьте подходящее', en: 'Check what applies' },
        icon: 'flower',
        options: allergiesNewOptions,
        required: true,
        hasAdditional: true,
      },
    ],
  },
  // 20. Простуды
  {
    id: 'colds',
    title: { ru: 'Простуды', en: 'Colds' },
    icon: 'thermometer',
    questions: [
      {
        id: 'colds_frequency',
        type: 'radio',
        label: { ru: 'Как часто болеете в год', en: 'How often do you get sick per year' },
        icon: 'thermometer',
        options: [
          { value: 'rarely', label: { ru: 'Редко (0–1 раз)', en: 'Rarely (0–1 times)' } },
          { value: 'sometimes', label: { ru: 'Иногда (2–3 раза)', en: 'Sometimes (2–3 times)' } },
          { value: 'often', label: { ru: 'Часто (4+ раз)', en: 'Often (4+ times)' } },
        ],
        required: true,
        hasAdditional: false,
      },
      {
        id: 'medications_usage',
        type: 'radio',
        label: { ru: 'Используете ли антибиотики или жаропонижающие', en: 'Do you use antibiotics or antipyretics' },
        icon: 'pill',
        options: [
          { value: 'no', label: { ru: 'Нет', en: 'No' } },
          { value: 'rarely', label: { ru: 'Редко', en: 'Rarely' } },
          { value: 'sometimes', label: { ru: 'Иногда', en: 'Sometimes' } },
          { value: 'often', label: { ru: 'Часто', en: 'Often' } },
        ],
        required: true,
        hasAdditional: false,
      },
    ],
  },
  // 21. Сон
  {
    id: 'sleep',
    title: { ru: 'Сон', en: 'Sleep' },
    icon: 'moon',
    questions: [
      {
        id: 'sleep_problems',
        type: 'checkbox',
        label: { ru: 'Отметьте подходящее', en: 'Check what applies' },
        icon: 'moon',
        options: sleepNewOptions,
        required: true,
        hasAdditional: true,
      },
    ],
  },
  // 22. Энергия
  {
    id: 'energy',
    title: { ru: 'Энергия', en: 'Energy' },
    icon: 'zap',
    questions: [
      {
        id: 'energy_problems',
        type: 'checkbox',
        label: { ru: 'Отметьте подходящее', en: 'Check what applies' },
        icon: 'zap',
        options: energyNewOptions,
        required: true,
        hasAdditional: true,
      },
    ],
  },
  // 23. Память и концентрация
  {
    id: 'memory_concentration',
    title: { ru: 'Память и концентрация', en: 'Memory and Concentration' },
    icon: 'brain',
    questions: [
      {
        id: 'memory_concentration_problems',
        type: 'checkbox',
        label: { ru: 'Отметьте подходящее', en: 'Check what applies' },
        icon: 'brain',
        options: memoryConcentrationOptions,
        required: true,
        hasAdditional: true,
      },
    ],
  },
  // 24. Образ жизни
  {
    id: 'lifestyle',
    title: { ru: 'Образ жизни', en: 'Lifestyle' },
    icon: 'user',
    questions: [
      {
        id: 'lifestyle_type',
        type: 'checkbox',
        label: { ru: 'Отметьте подходящее', en: 'Check what applies' },
        icon: 'user',
        options: lifestyleOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'toxic_substances',
        type: 'text',
        label: { ru: 'Контакт с токсичными веществами (указать)', en: 'Contact with toxic substances (specify)' },
        icon: 'alert-triangle',
        required: true,
        hasAdditional: false,
        placeholder: { ru: 'Укажите токсичные вещества', en: 'Specify toxic substances' },
      },
    ],
  },
  // 25. Лекарства
  {
    id: 'medications',
    title: { ru: 'Лекарства', en: 'Medications' },
    icon: 'pill',
    questions: [
      {
        id: 'medications_regular',
        type: 'text',
        label: { ru: 'Принимаете ли лекарства на постоянной основе (указать)', en: 'Do you take medications on a regular basis (specify)' },
        icon: 'pill',
        required: true,
        hasAdditional: false,
        placeholder: { ru: 'Укажите препараты', en: 'Specify medications' },
      },
    ],
  },
  // 26. БАДы
  {
    id: 'supplements',
    title: { ru: 'БАДы', en: 'Supplements' },
    icon: 'pill',
    questions: [
      {
        id: 'supplements_usage',
        type: 'radio',
        label: { ru: 'Как принимаете?', en: 'How do you take them?' },
        icon: 'pill',
        options: supplementsOptions,
        required: true,
        hasAdditional: true,
      },
    ],
  },
  // 27. Анализы и обследования
  {
    id: 'tests_examinations',
    title: { ru: 'Анализы и обследования', en: 'Tests and Examinations' },
    icon: 'heart',
    questions: [
      {
        id: 'has_tests_or_ultrasound',
        type: 'radio',
        label: { ru: 'Есть ли анализы крови за последние 2–3 месяца или делали ли УЗИ', en: 'Do you have blood test results from the last 2–3 months or did you have ultrasound' },
        icon: 'heart',
        options: yesNoOptionsSimple,
        required: true,
        hasAdditional: false,
      },
      {
        id: 'attach_files',
        type: 'file',
        label: { ru: 'Прикрепите файлы с анализами и обследованиями', en: 'Attach files with test results and examinations' },
        icon: 'file-text',
        required: true,
        hasAdditional: false,
      },
    ],
  },
  // 28. Дополнительно
  {
    id: 'additional',
    title: { ru: 'Дополнительно', en: 'Additional' },
    icon: 'info',
    questions: [
      {
        id: 'what_else',
        type: 'textarea',
        label: { ru: 'Что ещё вы хотели бы добавить о своём здоровье', en: 'What else would you like to add about your health' },
        icon: 'info',
        required: true,
        hasAdditional: false,
        placeholder: { ru: 'Дополнительная информация', en: 'Additional information' },
      },
      {
        id: 'how_learned',
        type: 'radio',
        label: { ru: 'Как вы обо мне узнали?', en: 'How did you learn about me?' },
        icon: 'info',
        required: true,
        hasAdditional: true,
        options: [
          { value: 'instagram', label: { ru: 'Инстаграм', en: 'Instagram' } },
          { value: 'telegram_channel', label: { ru: 'Телеграмм канал', en: 'Telegram channel' } },
          { value: 'recommendation', label: { ru: 'По рекомендации', en: 'By recommendation' } },
        ],
      },
    ],
  },
];

// Man questionnaire (type = man)
export const manQuestionnaire: QuestionnaireSection[] = [
  // 1. Общие данные
  {
    id: 'personal',
    title: { ru: 'Общие данные', en: 'General Information' },
    icon: 'user',
    questions: [
      {
        id: 'name',
        type: 'text',
        label: { ru: 'Имя', en: 'Name' },
        icon: 'user',
        required: true,
        hasAdditional: false,
        placeholder: { ru: 'Ваше имя', en: 'Your name' },
      },
      {
        id: 'last_name',
        type: 'text',
        label: { ru: 'Фамилия', en: 'Last Name' },
        icon: 'user',
        required: true,
        hasAdditional: false,
        placeholder: { ru: 'Ваша фамилия', en: 'Your last name' },
      },
      {
        id: 'age',
        type: 'number',
        label: { ru: 'Возраст', en: 'Age' },
        icon: 'calendar',
        required: true,
        hasAdditional: false,
        placeholder: { ru: 'Полных лет', en: 'Years' },
        unit: 'years',
      },
      {
        id: 'height',
        type: 'number',
        label: { ru: 'Рост', en: 'Height' },
        icon: 'ruler',
        required: true,
        hasAdditional: false,
        placeholder: { ru: 'В сантиметрах', en: 'In centimeters' },
        unit: 'cm',
      },
      {
        id: 'weight',
        type: 'number',
        label: { ru: 'Вес', en: 'Weight' },
        icon: 'scale',
        required: true,
        hasAdditional: false,
        placeholder: { ru: 'В килограммах', en: 'In kilograms' },
        unit: 'kg',
      },
    ],
  },
  // 2. Цели по весу
  {
    id: 'weight_goals',
    title: { ru: 'Цели по весу', en: 'Weight Goals' },
    icon: 'scale',
    questions: [
      {
        id: 'weight_satisfaction',
        type: 'radio',
        label: { ru: 'Довольны ли вы своим весом?', en: 'Are you satisfied with your weight?' },
        icon: 'scale',
        options: yesNoOptionsSimple,
        required: true,
        hasAdditional: false,
      },
      {
        id: 'weight_change',
        type: 'text',
        label: { ru: 'Сколько кг хотите убрать / добавить', en: 'How many kg do you want to lose / gain' },
        icon: 'scale',
        required: true,
        hasAdditional: false,
        placeholder: { ru: 'Например: -5 или +3', en: 'Example: -5 or +3' },
        unit: 'kg',
      },
    ],
  },
  // 3. Водный режим
  {
    id: 'water',
    title: { ru: 'Водный режим', en: 'Water Intake' },
    icon: 'droplet',
    questions: [
      {
        id: 'water_per_day',
        type: 'radio',
        label: { ru: 'Сколько литров чистой воды вы пьёте в день? (не считая чай, кофе, соки и другие напитки)', en: 'How many liters of pure water do you drink per day? (not counting tea, coffee, juices and other drinks)' },
        icon: 'droplet',
        options: [
          { value: 'less_1', label: { ru: 'До 1 л', en: 'Less than 1 L' } },
          { value: '1', label: { ru: '1 л', en: '1 L' } },
          { value: '1.5', label: { ru: '1.5 л', en: '1.5 L' } },
          { value: '2', label: { ru: '2 л', en: '2 L' } },
          { value: '2.5', label: { ru: '2.5 л', en: '2.5 L' } },
          { value: '3', label: { ru: '3 л', en: '3 L' } },
          { value: '3.5', label: { ru: '3.5 л', en: '3.5 L' } },
          { value: '4_plus', label: { ru: '4 л и более', en: '4 L and more' } },
        ],
        required: true,
        hasAdditional: false,
      },
    ],
  },
  // 4. COVID / вакцинация
  {
    id: 'covid',
    title: { ru: 'COVID / вакцинация', en: 'COVID / Vaccination' },
    icon: 'shield',
    questions: covidQuestions,
  },
  // 4. Волосы
  {
    id: 'hair',
    title: { ru: 'Волосы', en: 'Hair' },
    icon: 'sparkles',
    questions: [
      {
        id: 'hair_problems',
        type: 'checkbox',
        label: { ru: 'Состояние волос', en: 'Hair condition' },
        icon: 'sparkles',
        options: hairNewOptions,
        required: true,
        hasAdditional: true,
      },
    ],
  },
  // 5. Зубы и дёсны
  {
    id: 'teeth',
    title: { ru: 'Зубы и дёсны', en: 'Teeth and Gums' },
    icon: 'smile',
    questions: [
      {
        id: 'teeth_gums_problems',
        type: 'checkbox',
        label: { ru: 'Состояние зубов', en: 'Teeth condition' },
        icon: 'smile',
        options: teethGumsOptions,
        required: true,
        hasAdditional: true,
      },
    ],
  },
  // 6. Пищеварение
  {
    id: 'digestion',
    title: { ru: 'Пищеварение', en: 'Digestion' },
    icon: 'heart',
    questions: [
      {
        id: 'digestion_problems',
        type: 'checkbox',
        label: { ru: 'Отметьте подходящее', en: 'Check what applies' },
        icon: 'heart',
        options: digestionNewOptions,
        required: true,
        hasAdditional: true,
      },
    ],
  },
  // 7. Желчный пузырь и почки
  {
    id: 'gallbladder_kidneys',
    title: { ru: 'Желчный пузырь и почки', en: 'Gallbladder and Kidneys' },
    icon: 'circle',
    questions: [
      {
        id: 'gallbladder_kidneys_status',
        type: 'checkbox',
        label: { ru: 'Желчный пузырь и почки', en: 'Gallbladder and Kidneys' },
        icon: 'circle',
        options: [
          { value: 'no_issues', label: { ru: 'Все в порядке', en: 'All good' } },
          { value: 'gallbladder_sand', label: { ru: 'Песок в желчном пузыре', en: 'Sand in gallbladder' } },
          { value: 'gallbladder_stones', label: { ru: 'Камни в желчном пузыре', en: 'Gallbladder stones' } },
          { value: 'kidney_sand', label: { ru: 'Песок в почках', en: 'Sand in kidneys' } },
          { value: 'kidney_stones', label: { ru: 'Камни в почках', en: 'Kidney stones' } },
          { value: 'gallbladder_removed', label: { ru: 'Желчный пузырь удалён', en: 'Gallbladder removed' } },
          { value: 'other', label: { ru: 'Свой вариант', en: 'Other' } },
        ],
        required: true,
        hasAdditional: true,
      },
    ],
  },
  // 8. Операции и травмы
  {
    id: 'operations_traumas',
    title: { ru: 'Операции и травмы', en: 'Operations and Injuries' },
    icon: 'scissors',
    questions: [
      {
        id: 'operations_traumas_status',
        type: 'checkbox',
        label: { ru: 'Операции и травмы', en: 'Operations and Injuries' },
        icon: 'scissors',
        options: operationsTraumasOptions,
        required: true,
        hasAdditional: true,
      },
    ],
  },
  // 9. Артериальное давление
  {
    id: 'blood_pressure',
    title: { ru: 'Артериальное давление', en: 'Blood Pressure' },
    icon: 'activity',
    questions: [
      {
        id: 'pressure',
        type: 'radio',
        label: { ru: 'Давление', en: 'Blood pressure' },
        icon: 'activity',
        options: pressureOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'pressure_medication',
        type: 'text',
        label: { ru: 'Принимаете ли лекарства и как долго?', en: 'Do you take medication and for how long?' },
        icon: 'pill',
        required: true,
        hasAdditional: false,
        placeholder: { ru: 'Например: Лозартан, 2 года', en: 'Example: Losartan, 2 years' },
      },
    ],
  },
  // 10. Хронические и аутоиммунные заболевания
  {
    id: 'chronic_diseases',
    title: { ru: 'Хронические и аутоиммунные заболевания', en: 'Chronic and Autoimmune Diseases' },
    icon: 'alert-circle',
    questions: [
      {
        id: 'chronic_autoimmune',
        type: 'checkbox',
        label: { ru: 'Отметьте подходящее', en: 'Check what applies' },
        icon: 'alert-circle',
        options: chronicDiseasesOptions,
        required: true,
        hasAdditional: true,
      },
    ],
  },
  // 11. Нервная система
  {
    id: 'nervous_system',
    title: { ru: 'Нервная система', en: 'Nervous System' },
    icon: 'brain',
    questions: [
      {
        id: 'nervous_system_problems',
        type: 'checkbox',
        label: { ru: 'Отметьте подходящее', en: 'Check what applies' },
        icon: 'brain',
        options: nervousSystemOptions,
        required: true,
        hasAdditional: true,
      },
    ],
  },
  // 12. Кровообращение
  {
    id: 'circulation',
    title: { ru: 'Кровообращение', en: 'Circulation' },
    icon: 'heart',
    questions: [
      {
        id: 'circulation_problems',
        type: 'checkbox',
        label: { ru: 'Отметьте подходящее', en: 'Check what applies' },
        icon: 'heart',
        options: circulationOptions,
        required: true,
        hasAdditional: true,
      },
    ],
  },
  // 13. Сосуды и кожа
  {
    id: 'vessels_skin',
    title: { ru: 'Сосуды и кожа', en: 'Vessels and Skin' },
    icon: 'heart',
    questions: [
      {
        id: 'vessels_problems',
        type: 'checkbox',
        label: { ru: 'Состояние сосудов', en: 'Vessel condition' },
        icon: 'heart',
        options: vesselsOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'skin_condition',
        type: 'checkbox',
        label: { ru: 'Состояние кожи', en: 'Skin condition' },
        icon: 'heart',
        options: adultSkinOptions,
        required: true,
        hasAdditional: true,
      },
    ],
  },
  // 14. Суставы и позвоночник
  {
    id: 'joints_spine',
    title: { ru: 'Суставы и позвоночник', en: 'Joints and Spine' },
    icon: 'bone',
    questions: [
      {
        id: 'joints_spine_problems',
        type: 'checkbox',
        label: { ru: 'Суставы и позвоночник', en: 'Joints and Spine' },
        icon: 'bone',
        options: jointsSpineOptions,
        required: true,
        hasAdditional: true,
      },
    ],
  },
  // 15. Образования
  {
    id: 'formations',
    title: { ru: 'Образования', en: 'Formations' },
    icon: 'circle',
    questions: [
      {
        id: 'formations_present',
        type: 'checkbox',
        label: { ru: 'Отметьте подходящее', en: 'Check what applies' },
        icon: 'circle',
        options: formationsOptions,
        required: true,
        hasAdditional: true,
      },
    ],
  },
  // 16. Инфекции и выделения
  {
    id: 'infections_discharge',
    title: { ru: 'Инфекции и выделения', en: 'Infections and Discharge' },
    icon: 'alert-circle',
    questions: [
      {
        id: 'infections_discharge_problems',
        type: 'checkbox',
        label: { ru: 'Отметьте подходящее', en: 'Check what applies' },
        icon: 'alert-circle',
        options: infectionsDischargeOptions.filter(opt => opt.value !== 'discharge_female'),
        required: true,
        hasAdditional: true,
      },
    ],
  },
  // 17. Мужская анкета — простатит
  {
    id: 'prostate',
    title: { ru: 'Простатит', en: 'Prostatitis' },
    icon: 'heart',
    questions: [
      {
        id: 'prostatitis_urination',
        type: 'radio',
        label: { ru: 'Есть ли простатит или проблемы с мочеиспусканием', en: 'Is there prostatitis or problems with urination' },
        icon: 'heart',
        options: yesNoOptionsSimple,
        required: true,
        hasAdditional: true,
      },
    ],
  },
  // 18. Кожа
  {
    id: 'skin',
    title: { ru: 'Кожа', en: 'Skin' },
    icon: 'sparkles',
    questions: [
      {
        id: 'skin_problems',
        type: 'checkbox',
        label: { ru: 'Отметьте подходящее', en: 'Check what applies' },
        icon: 'sparkles',
        options: skinNewOptions,
        required: true,
        hasAdditional: true,
      },
    ],
  },
  // 19. Аллергии
  {
    id: 'allergies',
    title: { ru: 'Аллергии', en: 'Allergies' },
    icon: 'flower',
    questions: [
      {
        id: 'allergies_present',
        type: 'checkbox',
        label: { ru: 'Отметьте подходящее', en: 'Check what applies' },
        icon: 'flower',
        options: allergiesNewOptions,
        required: true,
        hasAdditional: true,
      },
    ],
  },
  // 20. Простуды
  {
    id: 'colds',
    title: { ru: 'Простуды', en: 'Colds' },
    icon: 'thermometer',
    questions: [
      {
        id: 'colds_frequency',
        type: 'radio',
        label: { ru: 'Как часто болеете в год', en: 'How often do you get sick per year' },
        icon: 'thermometer',
        options: [
          { value: 'rarely', label: { ru: 'Редко (0–1 раз)', en: 'Rarely (0–1 times)' } },
          { value: 'sometimes', label: { ru: 'Иногда (2–3 раза)', en: 'Sometimes (2–3 times)' } },
          { value: 'often', label: { ru: 'Часто (4+ раз)', en: 'Often (4+ times)' } },
        ],
        required: true,
        hasAdditional: false,
      },
      {
        id: 'medications_usage',
        type: 'radio',
        label: { ru: 'Используете ли антибиотики или жаропонижающие', en: 'Do you use antibiotics or antipyretics' },
        icon: 'pill',
        options: [
          { value: 'no', label: { ru: 'Нет', en: 'No' } },
          { value: 'rarely', label: { ru: 'Редко', en: 'Rarely' } },
          { value: 'sometimes', label: { ru: 'Иногда', en: 'Sometimes' } },
          { value: 'often', label: { ru: 'Часто', en: 'Often' } },
        ],
        required: true,
        hasAdditional: false,
      },
    ],
  },
  // 21. Сон
  {
    id: 'sleep',
    title: { ru: 'Сон', en: 'Sleep' },
    icon: 'moon',
    questions: [
      {
        id: 'sleep_problems',
        type: 'checkbox',
        label: { ru: 'Отметьте подходящее', en: 'Check what applies' },
        icon: 'moon',
        options: sleepNewOptions,
        required: true,
        hasAdditional: true,
      },
    ],
  },
  // 22. Энергия
  {
    id: 'energy',
    title: { ru: 'Энергия', en: 'Energy' },
    icon: 'zap',
    questions: [
      {
        id: 'energy_problems',
        type: 'checkbox',
        label: { ru: 'Отметьте подходящее', en: 'Check what applies' },
        icon: 'zap',
        options: energyNewOptions,
        required: true,
        hasAdditional: true,
      },
    ],
  },
  // 23. Память и концентрация
  {
    id: 'memory_concentration',
    title: { ru: 'Память и концентрация', en: 'Memory and Concentration' },
    icon: 'brain',
    questions: [
      {
        id: 'memory_concentration_problems',
        type: 'checkbox',
        label: { ru: 'Отметьте подходящее', en: 'Check what applies' },
        icon: 'brain',
        options: memoryConcentrationOptions,
        required: true,
        hasAdditional: true,
      },
    ],
  },
  // 24. Образ жизни
  {
    id: 'lifestyle',
    title: { ru: 'Образ жизни', en: 'Lifestyle' },
    icon: 'user',
    questions: [
      {
        id: 'lifestyle_type',
        type: 'checkbox',
        label: { ru: 'Отметьте подходящее', en: 'Check what applies' },
        icon: 'user',
        options: lifestyleOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'toxic_substances',
        type: 'text',
        label: { ru: 'Контакт с токсичными веществами (указать)', en: 'Contact with toxic substances (specify)' },
        icon: 'alert-triangle',
        required: true,
        hasAdditional: false,
        placeholder: { ru: 'Укажите токсичные вещества', en: 'Specify toxic substances' },
      },
    ],
  },
  // 25. Лекарства
  {
    id: 'medications',
    title: { ru: 'Лекарства', en: 'Medications' },
    icon: 'pill',
    questions: [
      {
        id: 'medications_regular',
        type: 'text',
        label: { ru: 'Принимаете ли лекарства на постоянной основе (указать)', en: 'Do you take medications on a regular basis (specify)' },
        icon: 'pill',
        required: true,
        hasAdditional: false,
        placeholder: { ru: 'Укажите препараты', en: 'Specify medications' },
      },
    ],
  },
  // 26. БАДы
  {
    id: 'supplements',
    title: { ru: 'БАДы', en: 'Supplements' },
    icon: 'pill',
    questions: [
      {
        id: 'supplements_usage',
        type: 'radio',
        label: { ru: 'Как принимаете?', en: 'How do you take them?' },
        icon: 'pill',
        options: supplementsOptions,
        required: true,
        hasAdditional: true,
      },
    ],
  },
  // 27. Анализы и обследования
  {
    id: 'tests_examinations',
    title: { ru: 'Анализы и обследования', en: 'Tests and Examinations' },
    icon: 'heart',
    questions: [
      {
        id: 'has_tests_or_ultrasound',
        type: 'radio',
        label: { ru: 'Есть ли анализы крови за последние 2–3 месяца или делали ли УЗИ', en: 'Do you have blood test results from the last 2–3 months or did you have ultrasound' },
        icon: 'heart',
        options: yesNoOptionsSimple,
        required: true,
        hasAdditional: false,
      },
      {
        id: 'attach_files',
        type: 'file',
        label: { ru: 'Прикрепите файлы с анализами и обследованиями', en: 'Attach files with test results and examinations' },
        icon: 'file-text',
        required: true,
        hasAdditional: false,
      },
    ],
  },
  // 28. Дополнительно
  {
    id: 'additional',
    title: { ru: 'Дополнительно', en: 'Additional' },
    icon: 'info',
    questions: [
      {
        id: 'what_else',
        type: 'textarea',
        label: { ru: 'Что ещё вы хотели бы добавить о своём здоровье', en: 'What else would you like to add about your health' },
        icon: 'info',
        required: true,
        hasAdditional: false,
        placeholder: { ru: 'Дополнительная информация', en: 'Additional information' },
      },
      {
        id: 'how_learned',
        type: 'radio',
        label: { ru: 'Как вы обо мне узнали?', en: 'How did you learn about me?' },
        icon: 'info',
        required: true,
        hasAdditional: true,
        options: [
          { value: 'instagram', label: { ru: 'Инстаграм', en: 'Instagram' } },
          { value: 'telegram_channel', label: { ru: 'Телеграмм канал', en: 'Telegram channel' } },
          { value: 'recommendation', label: { ru: 'По рекомендации', en: 'By recommendation' } },
        ],
      },
    ],
  },
];

export type QuestionnaireType = 'infant' | 'child' | 'woman' | 'man';

export const getQuestionnaire = (type: QuestionnaireType): QuestionnaireSection[] => {
  switch (type) {
    case 'infant':
      return infantQuestionnaire;
    case 'child':
      return childQuestionnaire;
    case 'woman':
      return womanQuestionnaire;
    case 'man':
      return manQuestionnaire;
    default:
      return infantQuestionnaire;
  }
};

export const getQuestionnaireTitle = (type: QuestionnaireType, lang: Language): string => {
  const titles = {
    infant: { ru: 'Анкета для младенца', en: 'Baby' },
    child: { ru: 'Детская анкета', en: 'Child' },
    woman: { ru: 'Женская анкета', en: 'Women\'s' },
    man: { ru: 'Мужская анкета', en: 'Men\'s' },
  };
  return titles[type]?.[lang] || titles[type]?.ru || '';
};
