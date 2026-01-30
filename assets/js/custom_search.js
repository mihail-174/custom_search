/**
 *
 * Custom Search
 * Кастомный поиск с дополнительными возможностями.
 *
 * @author      Mihail Pridannikov
 * @copyright   2021-2025, Mihail Pridannikov
 * @license MIT
 * @version     3.1.0
 * @release     May 28, 2025
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
        mocks: true,
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

                }
            });
            window.addEventListener('resize', e => {
                this.handlerResizeWindow();
            }, true);
        }
    }
    this.handlerResizeWindow = function () {
        FORM.forEach(form => {
            if (form) {
                this.setPlaceholder(form);
            }
        });
    }
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
    this.handlerChangeOnTextField = function (e, form) {
        // добавляем кнопку очистить поле
        if (e.currentTarget.value !== '') {
            this.addButtonClear(form);
            this.addClassFilled(form);
            this.initSearchResult(form, e.currentTarget.value.toLowerCase());
        } else {
            this.removeButtonClear(form);
            this.removeClasses(form);
            settings.mocks ? this.closePopover(form) : this.removeResults(form);
        }

    }
    this.initSearchResult = function (form, query) {
        if (settings.mocks) {
            this.openPopover(form);
        } else {
            let words = query.split(' ');
            words.filter(word => {
                this.getData(form, word);
            });
        }
    }
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
    this.removeButtonClear = function (search) {
        if (search.querySelector('.form__button-clear')) {
            search.querySelector('.form__button-clear').remove();
            search.classList.remove('is-button-clear');
        }
    }
    this.handlerClickOnButtonClear = function (e, form) {
        e.preventDefault();
        form.querySelector('.form__input').value = '';
        this.removeClasses(form);
        settings.mocks ? this.closePopover(form) : this.removeResults(form);
        this.removeButtonClear(form);
    }
    this.removeClasses = function (search) {
        search.classList.remove('is-focus');
        search.classList.remove('is-open');
        search.classList.remove('is-filled');
    }
    this.addClassFilled = function (form) {
        form.classList.add('is-filled');
    }
    this.createPopover = function (form, data) {
        if (!form.querySelector('.form__field-result')) {
            form.querySelector('.form__fields').insertAdjacentHTML('beforeend', `
                <div class="form__field form__field-result">
                    <div class="search-result-popover">
                        <div class="search-result-popover__content"></div>
                    </div>
                </div>
            `);
        }
        const field = form.querySelector('.form__field-result');
        this.clearResults(field);
        this.insertResults(form, data);
    }
    this.openPopover = function (form) {
        form.classList.add('is-popover-opened');
    }
    this.closePopover = function (form) {
        form.classList.remove('is-popover-opened');
    }
    this.insertResults = function (form, data) {
        if (data) {
            data.map(item => {
                form.querySelector('.search-result-popover__content').insertAdjacentHTML('beforeend',
                    `
                    <div class="search-result-mini__item">
                        <div class="teaser-product-search">
                            <div class="teaser-product-search__image">
                                <img src="" alt="" width="32" height="32" loading="lazy">
                            </div>
                            <div class="teaser-product-search__name">Тестовое название товара</div>
                            <div class="teaser-product-search__price">1 000р.</div>
                        </div>
                    </div>
                `);
            });
        } else {
            form.querySelector('.search-result-popover__content').textContent = 'Результаты не найдены';
        }
        this.openPopover(form);
    }
    this.clearResults = function (field) {
        field.querySelector('.search-result-popover__content').innerHTML = '';
    }
    this.removeResults = function (form) {
        if (form.querySelector('.form__field-result')) {
            form.querySelector('.form__field-result').remove();
        }
    }
    this.getData = function (form, query) {
        fetch('/rest/search?key=' + query, {method: 'GET'})
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }
                throw new Error('Network response was not ok')
            })
            .then((data) => {
                // console.log('DATA:', data);
                this.createPopover(form, data);
            })
            .catch((error) => {
                console.log('ERROR:', error);
            })
    }

    if (FORM) {
        this.init();
    }
}