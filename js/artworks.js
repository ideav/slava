// Данные о картинах Вячеслава Пешкина
const artworks = [
    {
        id: 1,
        filename: "Достопримечательность Владимира..jpg",
        title: "Достопримечательность Владимира",
        style: "Реализм, живопись, Владимирский пейзаж",
        material: "Холст, масло",
        size: "92 × 120 см",
        year: 2018,
        price: 700000,
        category: "пейзаж"
    },
    {
        id: 2,
        filename: "DSC_6659.jpg",
        title: "Снежная зима на Владимирском спуске",
        style: "Реализм, живопись, зимний русский пейзаж",
        material: "Холст, масло",
        size: "75 × 92 см",
        year: 2023,
        price: 400000,
        category: "пейзаж"
    },
    {
        id: 3,
        filename: "DSC_6688.jpg",
        title: "Октябрь. Золотой день",
        style: "Реализм, живопись, пейзаж",
        material: "Холст, масло",
        size: "50 × 70 см",
        year: 2018,
        price: 200000,
        category: "пейзаж"
    },
    {
        id: 4,
        filename: "DSC_6707.jpg",
        title: "Возвращение",
        style: "Реализм, живопись, пейзаж",
        material: "Холст, масло",
        size: "105 × 105 см",
        year: 1993,
        price: 700000,
        category: "пейзаж"
    },
    {
        id: 5,
        filename: "DSC_6716.jpg",
        title: "Тополя в Муромцево",
        style: "Реализм, живопись, пейзаж Муромцево",
        material: "Холст, масло",
        size: "80 × 60 см",
        year: 2015,
        price: 250000,
        category: "пейзаж"
    },
    {
        id: 6,
        filename: "DSC_6675.jpg",
        title: "У Черного моря",
        style: "Реализм, живопись, морской пейзаж",
        material: "Холст, масло",
        size: "30 × 60 см",
        year: 2018,
        price: 120000,
        category: "морской пейзаж"
    },
    {
        id: 7,
        filename: "DSC_6674.jpg",
        title: "Рассвет на речке Колокша",
        style: "Реализм, живопись, пейзаж",
        material: "Холст, масло",
        size: "45 × 55 см",
        year: 2024,
        price: 150000,
        category: "пейзаж"
    },
    {
        id: 8,
        filename: "DSC_6727.jpg",
        title: "Муромцево. Серебристый день на Барских прудах",
        style: "Реализм, живопись, пейзаж Муромцево",
        material: "Холст, масло",
        size: "50 × 100 см",
        year: 2015,
        price: 350000,
        category: "пейзаж"
    },
    {
        id: 9,
        filename: "DSC_6713.jpg",
        title: "Март. Весенняя мимоза",
        style: "Реализм, живопись, пейзаж",
        material: "Холст, масло",
        size: "80 × 60 см",
        year: 2023,
        price: 200000,
        category: "пейзаж"
    },
    {
        id: 10,
        filename: "DSC_6719.jpg",
        title: "Закат у Черного моря",
        style: "Реализм, живопись, морской пейзаж",
        material: "Холст, масло",
        size: "48 × 60 см",
        year: 2018,
        price: 150000,
        category: "морской пейзаж"
    },
    {
        id: 11,
        filename: "DSC_6672.jpg",
        title: "Церковная старина",
        style: "Реализм, живопись, натюрморт",
        material: "Холст, масло",
        size: "82 × 82 см",
        year: 1994,
        price: 500000,
        category: "натюрморт"
    },
    {
        id: 12,
        filename: "DSC_6652.jpg",
        title: "Сентябрь. Пойма Клязьмы",
        style: "Реализм, живопись, пейзаж",
        material: "Холст, масло",
        size: "60 × 90 см",
        year: 2016,
        price: 200000,
        category: "пейзаж"
    },
    {
        id: 13,
        filename: "DSC_6650.jpg",
        title: "Первый снег на заброшенной усадьбе",
        style: "Реализм, живопись, пейзаж",
        material: "Холст, масло",
        size: "54 × 85 см",
        year: 2023,
        price: 200000,
        category: "пейзаж"
    },
    {
        id: 14,
        filename: "DSC_6729.jpg",
        title: "Усадьба Храповицкого",
        style: "Реализм, живопись, пейзаж Муромцево",
        material: "Холст, масло",
        size: "77 × 97 см",
        year: 2015,
        price: 350000,
        category: "пейзаж"
    },
    {
        id: 15,
        filename: "DSC_6691.jpg",
        title: "Владимирские задворки",
        style: "Реализм, живопись, Владимирский пейзаж",
        material: "Холст, масло",
        size: "80 × 100 см",
        year: 2020,
        price: 350000,
        category: "пейзаж"
    },
    {
        id: 16,
        filename: "DSC_6686.jpg",
        title: "Весна на Георгиевской",
        style: "Реализм, живопись, пейзаж",
        material: "Холст, масло",
        size: "54 × 79 см",
        year: 2013,
        price: 150000,
        category: "пейзаж"
    }
];
