/**
 *
 * Custom Search
 * Кастомный поиск с дополнительными возможностями.
 *
 * @author      Mihail Pridannikov
 * @copyright   2021, Mihail Pridannikov
 * @license MIT
 * @version     3.0.0
 * @release     November 2021
 * @link        https://github.com/mihail-174/custom_search
 *
 */

window.CustomSearch = function(customSettings) {
    this.deepMergeObjects = function (obj1, obj2) {
        const result = {};
        for (const key in obj2) {
            if (obj2.hasOwnProperty(key)) {
                if (typeof obj2[key] === "object" && obj1.hasOwnProperty(key) && typeof obj1[key] === "object") {
                    result[key] = this.deepMergeObjects(obj1[key], obj2[key]);
                } else {
                    result[key] = obj2[key];
                }
            }
        }
        for (const key in obj1) {
            if (obj1.hasOwnProperty(key) && !result.hasOwnProperty(key)) {
                if (typeof obj1[key] === "object") {
                    result[key] = this.deepMergeObjects(obj1[key], {});
                } else {
                    result[key] = obj1[key];
                }
            }
        }
        return result;
    }

    const FORM = document.querySelectorAll('.form-search');
    const DEFAULT_SETTINGS = {
        clear: true,
        placeholder: 'Поиск',
    }
    let settings = this.deepMergeObjects(DEFAULT_SETTINGS, customSettings);

    this.init = function () {
        if (FORM.length) {
            FORM.forEach(form => {
                if (form) {

                    // добавляем кнопку очистить поле
                    if (form.querySelector('.form__input').value !== '') {
                        this.addButtonClear(form);
                        this.addClassFilled(form);
                    }

                    // событие при изменении поля
                    form.querySelector('.form__input').addEventListener('input', e => this.handlerChangeOnTextField(e, form));

                    this.setPlaceholder(form);
                    // this.setSettingsSearchInHeader(form);

                }
            });
            window.addEventListener('resize', e => {
                this.handlerResizeWindow();
            }, true);
        }
    }

    // событие на изменение разрешения браузера
    this.handlerResizeWindow = function () {
        FORM.forEach(form => {
            if (form) {
                this.setPlaceholder(form);
                // this.setSettingsSearchInHeader(form);
            }
        });
    }

    // задаем плейсхолдер
    this.setPlaceholder = function (search) {
        switch (typeof settings.placeholder) {
            case 'string':
                search.querySelector('.form__input').setAttribute('placeholder', settings.placeholder);
                break;
            case 'object':
                let checkRange = Object.entries(settings.placeholder).find(item => document.body.classList.contains(`js-device-${item[0]}`));
                search.querySelector('.form__input').setAttribute('placeholder', checkRange ? checkRange[1] : 'Поиск');
                break;
            default:
                break;
        }
    }

    // событие при изменении поля
    this.handlerChangeOnTextField = function (e, form) {
        // добавляем кнопку очистить поле
        if (e.currentTarget.value !== '') {
            this.addButtonClear(form);
            this.addClassFilled(form);
        } else {
            this.removeButtonClear(form);
            this.removeClasses(form);
        }
    }

    // добавляем кнопку очистить поле
    this.addButtonClear = function (form) {
        if (settings.clear) {
            if (!form.querySelector('.form__button-clear')) {
                form.querySelector('.form__field-query').insertAdjacentHTML('beforeend',
                    `<button class="form__button-clear">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                        <path fill="gray" d="M1.793 1.796a1 1 0 000 1.414l4.793 4.793-4.793 4.793a1 1 0 001.414 1.414L8 9.417l4.793 4.793a1 1 0 001.414-1.414L9.414 8.003l4.793-4.793a1 1 0 00-1.414-1.414L8 6.589 3.207 1.796a1 1 0 00-1.414 0z" />
                    </svg>
                </button>`);
                form.classList.add('is-button-clear');
                form.querySelector('.form__button-clear').addEventListener('click', e => this.handlerClickOnButtonClear(e, form));
            }
        }
    }

    // удаляем кнопку очистить поле
    this.removeButtonClear = function (search) {
        if (search.querySelector('.form__button-clear')) {
            search.querySelector('.form__button-clear').remove();
            search.classList.remove('is-button-clear');
        }
    }

    // событие клика по кнопке очистить поле
    this.handlerClickOnButtonClear = function (e, form) {
        e.preventDefault();
        form.querySelector('.form__input').value = '';
        this.removeClasses(form);
        this.removeResult(form);
        this.removeButtonClear(form);
    }

    // удаление классов
    this.removeClasses = function (search) {
        search.classList.remove('is-results');
        search.classList.remove('is-focus');
        search.classList.remove('is-open');
        search.classList.remove('is-filled');
    }

    // добавляем класс что поле заполнено
    this.addClassFilled = function (form) {
        form.classList.add('is-filled');
    }

    // удаляем результаты поиска
    this.removeResult = function (search) {
        search.querySelector('.search-result') ? search.querySelector('.search-result').remove() : null;
    }

    if (FORM) {
        this.init();
    }
}