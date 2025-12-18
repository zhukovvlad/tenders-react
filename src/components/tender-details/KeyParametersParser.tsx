import React from 'react';
import { Badge } from '@/components/ui/badge';
import { parseGoMapString } from '@/lib/goparser';

interface KeyParametersParserProps {
  keyParameters: any;
}

const PARAMETER_NAMES: { [key: string]: string } = {
    category: 'Категория',
    data: 'Данные',
    main_pile_specs: 'Характеристики основных свай',
    concrete_grade: 'Марка бетона',
    concrete_volume_m3: 'Объем бетона, м³',
    count: 'Количество',
    diameter_mm: 'Диаметр, мм',
    grouting_volume_m3: 'Объем цементации, м³',
    is_main_pile_field: 'Основное свайное поле',
    rebar_total_weight_t: 'Общий вес арматуры, т',
    rebar_type: 'Тип арматуры',
    pit_volume_m3: 'Объем котлована, м³',
    sheet_pile_wall_specs: 'Характеристики шпунтового ограждения',
    is_sheet_pile: 'Шпунтовое ограждение',
    length_m: 'Длина, м',
    type: 'Тип',
    slurry_wall_specs: 'Характеристики "стены в грунте"',
    is_slurry_wall: '"Стена в грунте"',
    thickness_mm: 'Толщина, мм',
    strut_system_weights_t: 'Вес распорной системы, т',
    testing_pile_specs: 'Характеристики испытаний свай',
    anker_pile_specs: 'Характеристики анкерных свай',
    count_test_piles: 'Количество испытуемых свай',
    is_testing_pile_field: 'Поле для испытаний свай',
    testing_piles: 'Испытуемые сваи',
    processed_at: 'Время обработки',
    source: 'Источник',
    ai: 'ИИ-анализ',
    '': '',
};

const formatKey = (key: string) => {
    return PARAMETER_NAMES[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const renderParameters = (data: any, level = 0): React.ReactNode => {
    if (data === null || data === undefined || (typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length === 0)) {
        return <Badge variant="secondary">Нет данных</Badge>;
    }

    if (typeof data !== 'object') {
        if (data === true) return <Badge variant="default">Да</Badge>;
        if (data === false) return <Badge variant="destructive">Нет</Badge>;
        return <span className="text-gray-700 dark:text-gray-300">{String(data)}</span>;
    }

    if (Array.isArray(data)) {
        if (data.length === 0) return <Badge variant="secondary">Нет данных</Badge>;
        return <span className="text-gray-700 dark:text-gray-300">{data.join(', ')}</span>;
    }

    return (
        <ul className={level > 0 ? 'pl-4 border-l border-gray-200 dark:border-gray-700' : ''}>
            {Object.entries(data).map(([key, value]) => {
                const formattedKey = formatKey(key);
                if (!formattedKey) return null;

                return (
                    <li key={key} className="mt-2">
                        <strong className="font-semibold text-gray-800 dark:text-gray-200">{formattedKey}:</strong>
                        <div className="pl-2">
                            {renderParameters(value, level + 1)}
                        </div>
                    </li>
                );
            })}
        </ul>
    );
};


export const KeyParametersParser: React.FC<KeyParametersParserProps> = ({ keyParameters }) => {
    if (!keyParameters) {
        return <div>Нет ключевых параметров.</div>;
    }

    let parsedData;
    if (typeof keyParameters.ai === 'string') {
        try {
            parsedData = parseGoMapString(keyParameters.ai);
        } catch (error) {
            console.error("Error parsing key_parameters:", error);
            return <div className="text-red-500">Ошибка при обработке ключевых параметров.</div>;
        }
    } else {
        parsedData = keyParameters;
    }

    return (
        <div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border dark:border-gray-700">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Ключевые параметры (Beta)</h3>
            {renderParameters(parsedData)}
        </div>
    );
};
