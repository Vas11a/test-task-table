// Определение таблицы
const table = document.querySelector('.table');

// Списки городов и типов
let typeList = [];
let cityList = [];

// Функция добавления новой строки
const addNewRow = () => {
    // Генерация опций для городов
    let cityOptions = `<option>None</option>`;
    cityList.forEach(city => {
        cityOptions += `<option>${city}</option>`;
    });

    // Генерация опций для типов
    let typeOptions = `<option>None</option>`;
    typeList.forEach(type => {
        typeOptions += `<option>${type}</option>`;
    });

    // Создание новой строки и ее заполнение
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <th class="numbers" scope="row">1</th>
        <td>
            <input class="id" type="text">
        </td>
        <td>
            <input class="price" type="text">
        </td>
        <td>
            <select class="js-example-basic-single w-100 c" name="state">
                ${cityOptions}
            </select>
        </td>
        <td>
            <select class="js-example-basic-single w-100 t" name="state">
                ${typeOptions}
            </select>
        </td>
        <td class="d-flex" style="gap: 20px">
            <button type="button" class="btn btn-primary btn-sm deleteButton">Delete</button>
            <button type="button" class="btn btn-primary btn-sm copyButton">Copy</button>
        </td>
    `;

    // Добавление новой строки в тело таблицы
    table.querySelector('tbody').append(newRow);
    // Инициализация select2
    $('.js-example-basic-single').select2();
    // Обновление номеров строк
    render();
};

// Функция обновления номеров строк
const render = () => {
    const numberFields = document.querySelectorAll('.numbers');
    
    let firstNum = 1; 
    numberFields.forEach(elem => {
       elem.textContent = firstNum;
       firstNum += 1;
    });
};

// Функция, вызываемая при загрузке страницы
const onPageLoad = async () => {
    // Получение элементов главных селектов
    const cityMain = document.querySelector('.cMain');
    const typeMain = document.querySelector('.tMain');

    // Загрузка данных с сервера
    const response = await fetch('http://localhost:3001/data');
    const data = await response.json();
    cityList = data.cities;
    typeList = data.types;

    // Генерация опций для главного селекта городов
    let cityMainOptions = `<option onclick={alert('hello')} >None</option>`;
    cityList.forEach(city => {
        cityMainOptions += `<option onclick={alert('hello')} class='cityOption' >${city}</option>`;
    });
    
    // Заполнение главного селекта городов
    cityMain.innerHTML = cityMainOptions;

    // Генерация опций для главного селекта типов
    let typeMainOptions = `<option>None</option>`;
    typeList.forEach(type => {
        typeMainOptions += `<option>${type}</option>`;
    });

    // Заполнение главного селекта типов
    typeMain.innerHTML = typeMainOptions;

    // Обновление номеров строк
    render();
};

// Переменные-флаги для предотвращения бесконечного цикла событий
let cityHelper = false;
let typeHelper = false;

// Функция изменения всех городов в таблице
const changeCityMain = () => {
    if (cityHelper) {
        cityHelper = false;
        return;
    }

    // Получение всех селектов городов в таблице
    const allCities = $('.c');
    // Запрос подтверждения действия
    let isConfirmed = confirm('Чи впевнені ви, що хочете відредагувати всі міста стовбця');

    if (isConfirmed) {
        // Установка значения главного селекта для всех селектов городов в таблице
        const msinCityVal = $('.cMain').val();
        allCities.each(function() {
            $(this).val(msinCityVal).trigger('change');
        });
    }

    // Сброс значения главного селекта
    cityHelper = true;
    $('.cMain').val('None').trigger('change');
};

// Функция изменения всех типов в таблице
const changeTypeMain = () => {
    if (typeHelper) {
        typeHelper = false;
        return;
    }

    // Получение всех селектов типов в таблице
    const allTypes = $('.t');
    // Запрос подтверждения действия
    let isConfirmed = confirm('Чи впевнені ви, що хочете відредагувати всі типи стовбця');

    if (isConfirmed) {
        // Установка значения главного селекта для всех селектов типов в таблице
        const msinTypeVal = $('.tMain').val();
        allTypes.each(function() {
            $(this).val(msinTypeVal).trigger('change');
        });
    }

    // Сброс значения главного селекта
    typeHelper = true;
    $('.tMain').val('None').trigger('change');
};

// Функция изменения всех цен в таблице
const changeAllPrice = () => {
    // Запрос подтверждения действия
    let isConfirmed = confirm('Чи впевнені ви, що хочете відредагувати всі ціни стовбця');
    const allPrice = document.querySelectorAll('.price');
    const priceMain = document.querySelector('.priceMain');

    if (isConfirmed) {
        // Установка значения главной цены для всех цен в таблице
        allPrice.forEach(element => {
            element.value = priceMain.value;
        });
    }

    // Сброс значения главной цены
    priceMain.value = '';
};

// Функция удаления строки
const deleteRow = (button) => {
    const row = button.closest('tr');
    row.remove();
    // Обновление номеров строк
    render();
};

// Функция копирования строки
const copyRow = (button) => {
    const row = button.closest('tr');
    const newRow = row.cloneNode(true);
    table.querySelector('tbody').appendChild(newRow);
    // Обновление номеров строк
    render();
};

// Событие клика на таблице
table.addEventListener('click', (event) => {
    if (event.target.classList.contains('deleteButton')) {
        deleteRow(event.target);
    } else if (event.target.classList.contains('copyButton')) {
        copyRow(event.target);
    }
});

// Функция поиска дубликатов в массиве
function findDuplicates(array) {
    let uniqueValues = new Set();
    let duplicates = [];

    array.forEach((value, index) => {
        if (uniqueValues.has(value)) {
            duplicates.push(index);
        } else {
            uniqueValues.add(value);
        }
    });

    return duplicates;
}

// Функция сохранения таблицы
const saveTable = () => {
    const ids = document.querySelectorAll('.id');
    let values = [];
    let isEmpty = false;

    ids.forEach(elem => {
        values.push(elem.value);
        if (elem.value === '') {
            isEmpty = true;
            elem.style.border = '2px solid red';
        }
    });

    if (isEmpty) {
        alert('Ви не ввели поле id');
        return;
    }

    const dubl = findDuplicates(values);

    if (dubl.length === 0) {
        alert('Таблиця збережена');

        ids.forEach(elem => {
            elem.style.border = 'none';
        });
    } else {
        ids.forEach(elem => {
            elem.style.border = 'none';
        });

        dubl.forEach(element => {
            ids[element].style.border = '2px solid red';
        });

        alert('ID повторюються');
    }
};

// Событие загрузки страницы
document.addEventListener('DOMContentLoaded', onPageLoad);
