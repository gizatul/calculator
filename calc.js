function calc() {
    // Калькулятор
    const result = document.querySelector('.calculating__result span');
    let sex, height, weight, age, ratio; //объ-е переменных и установка некоторым знач-я по умолчанию

    //Условие для localStorage
    if (localStorage.getItem('sex')) { //если в localStorage присутствует значение sex
        sex = localStorage.getItem('sex');//
    } else {
        sex = 'female';
        localStorage.setItem('sex', 'female'); 

    }
    if (localStorage.getItem('ratio')) { //если в localStorage присутствует значение ratio
        ratio = localStorage.getItem('ratio');//
    } else {
        ratio = 1.375;
        localStorage.setItem('ratio', 1.375); 

    }
    //Ф-я установки класса активности в зависимости от localStorage
    function initLocalSettings(selector, activeClass) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(item => {
            item.classList.remove(activeClass);
            if (item.getAttribute('id') === localStorage.getItem('sex')) {
                item.classList.add(activeClass);
            }
            if (item.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                item.classList.add(activeClass);
            }
        });
    }
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');
    initLocalSettings('#gender div', 'calculating__choose-item_active');

    //Ф-я для расчета итогового рез-та
    function calcTotal () {
        if (!sex || !height || !weight || !age || !ratio) { //проверка на заполненность
            result.textContent = '____';
            return;
        }
        if (sex === 'female') { //если женщина, то формула ниже
            result.textContent = parseInt((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else { // иначе если мужчина, то формула ниже
            result.textContent = parseInt((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }
    calcTotal();
    //Ф-я для выбора кнопки
    function getStaticInformation (selector, activeClass) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(item => { //в данном случае лучше использовать forEach, а не делегирование событий, для избежания багов с щелком не на кнопку
            item.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute('data-ratio'); //вытаскиваем коэф. физ активности из data-ratio
                    localStorage.setItem('ratio', +e.target.getAttribute('data-ratio'));
                } else {
                    sex = e.target.getAttribute('id'); //выбор пола
                    localStorage.setItem('sex', e.target.getAttribute('id'));
                }
            
                elements.forEach(item => {//убираем у всех класс активности
                    item.classList.remove(activeClass);
                });
                e.target.classList.add(activeClass); //добавляем класс активности щелкнутому элементу
                calcTotal(); //вызов ф-ии, для моментального изменения итога
            });
        });  
    }
    getStaticInformation('#gender div', 'calculating__choose-item_active'); //вызов ф-ии для выбора муж/жен
    getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active'); //вызов ф-ии для выбора физ. активности

    //Ф-я получения инфы из инпутов (рост, вес, возраст)
    function getDynamicInformation(selector) { 
        const input = document.querySelector(selector);
        input.addEventListener('input', () => { // 
            if (input.value.match(/\D/g)) { // проверка введенных данных на число
                input.style.border = '1px solid red'; //красная обводка
            } else {
                input.style.border = 'none'; //отсутствие обводки
            }
            switch (input.getAttribute('id')) { //ОС, исп-е метода switch
                case 'height': 
                    height = +input.value;
                    break;
                case 'weight': 
                    weight = +input.value;
                    break;
                case 'age': 
                    age = +input.value;
                    break;
            }
            calcTotal(); //вызов функции в инпуте, для моментального изменения итога при вводе цифр
        });
        
    }
    getDynamicInformation('#height'); //вызов ф-ии для каждого инпута
    getDynamicInformation('#weight'); 
    getDynamicInformation('#age'); 
}
export default calc;