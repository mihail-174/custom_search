/**
 *
 * Custom Search
 * Кастомный поиск с дополнительными возможностями.
 *
 * @author      Mihail Pridannikov
 * @copyright   2021, Mihail Pridannikov
 * @license MIT
 * @version     2.0.0
 * @release     November 2021
 * @link        https://github.com/mihail-174/custom_search
 *
 */

window.CustomSearch = function(settings) {
    const FORM = document.querySelectorAll('.form-search');
    const SETTINGS = {
        clear: true,
        placeholderDesktop: 'Введите наименование',
        placeholderMobile: 'Поиск',
        placeholderBreakpoint: 767,
        headerType: 'full',
        headerSlideDirection: null,
    }

    // начало
    this.init = function () {
        if (FORM.length) {
            FORM.forEach(form => {
                if (form) {

                    // добавляем кнопку очистить поле
                    if (this.getParameter('clear')) {
                        if (form.querySelector('.form__input').value !== '') {
                            this.addButtonClear(form);
                        }
                    }

                    // событие при изменении поля
                    form.querySelector('.form__input').addEventListener('input', e => this.handlerChangeOnTextField(e, form));

                    this.setPlaceholder(form);
                    this.setSettingsSearchInHeader(form);
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
                this.setSettingsSearchInHeader(form);
            }
        });
    }

    // задаем настройки поиску находящийся в шапке
    this.setSettingsSearchInHeader = function (form) {
        if (this.getParameter('headerType') && !this.getParameter('headerBreakpoint')) {
            this.setTypeSearch(form);
            this.setSlideDirection(form);
        } else {
            let widthWindow = document.body.getBoundingClientRect().width;
            this.removeClassTypeSearch(form);
            this.removeClassSlideDirection(form);
            this.getParameter('headerBreakpoint').map(item => {
                let min = typeof item.breakpoint[0] === 'number' ? item.breakpoint[0] : rangeDevices[item.breakpoint[0]].value;
                let max = typeof item.breakpoint[1] === 'number' ? item.breakpoint[1] : rangeDevices[item.breakpoint[1]].value;
                if (min === 0 && widthWindow <= max) {
                    this.setTypeSearch(form, item);
                    item.type === 'short' && this.setSlideDirection(form, item);
                } else if (max === 0 && widthWindow > min) {
                    this.setTypeSearch(form, item);
                    item.type === 'short' && this.setSlideDirection(form, item);
                } else if (widthWindow > min && widthWindow <= max) {
                    this.setTypeSearch(form, item);
                    item.type === 'short' && this.setSlideDirection(form, item);
                }
            })
        }
    }

    // устанавливаем тип поиска
    this.setTypeSearch = function (form, item) {
        if (this.getParameter('headerType') && !this.getParameter('headerBreakpoint')) {
            form.classList.add(`form-search_type_${this.getParameter('headerType')}`)
        } else {
            form.classList.add(`form-search_type_${item.type}`)
        }
    }

    // устанавливаем направление поиска если он "short"
    this.setSlideDirection = function (form, item) {
        if (this.getParameter('headerType') && !this.getParameter('headerBreakpoint')) {
            this.getParameter('headerType') === 'short' ? form.classList.add(`form-search_slide-direction_${this.getParameter('headerSlideDirection')}`) : null;
        } else {
            form.classList.add(`form-search_slide-direction_${item.slideDirection}`)
        }
    }

    this.removeClassTypeSearch = function (form) {
        form.classList.remove(...[...form.classList].filter(n => n.startsWith('form-search_type_')));
    }
    this.removeClassSlideDirection = function (form) {
        form.classList.remove(...[...form.classList].filter(n => n.startsWith('form-search_slide-direction_')));
    }

    // проверка на наличие кастомных настроек
    this.checkingSettings = function () {
        // return typeof settings !== 'undefined' || (typeof settings === 'object' && Object.keys(settings).length > 0);
        return (typeof settings === 'object' && Object.keys(settings).length > 0);
    }

    // проверка на наличе параметра в кастомных настройках
    this.checkingParameter = function (value) {
        return typeof settings[value] !== 'undefined'
    }
    // получаем параметр из кастомных настроек, если там нету, то из значений по умолчанию
    this.getParameter = function (value) {
        // console.log(value, this.checkingSettings() && this.checkingParameter(value) ? settings[value] : SETTINGS[value])
        return this.checkingSettings() && this.checkingParameter(value) ? settings[value] : SETTINGS[value];
    }

    // задаем плейсхолдер
    this.setPlaceholder = function (search) {
        switch (typeof this.getParameter('placeholderBreakpoint')) {
            case 'number':
                search.querySelector('.form__input').setAttribute('placeholder', document.body.getBoundingClientRect().width <= this.getParameter('placeholderBreakpoint') ? this.getParameter('placeholderMobile') : this.getParameter('placeholderDesktop'));
                break;
            case 'string':
                search.querySelector('.form__input').setAttribute('placeholder', document.body.getBoundingClientRect().width <= rangeDevices[this.getParameter('placeholderBreakpoint')].value ? this.getParameter('placeholderMobile') : this.getParameter('placeholderDesktop'));
                break;
            case 'object':
                let checkRange = this.getParameter('placeholderBreakpoint').some(function (item) {
                    return typeof item === 'string' ? document.body.classList.contains(`js-device-${item}`) : null;
                });
                search.querySelector('.form__input').setAttribute('placeholder', checkRange ? this.getParameter('placeholderMobile') : this.getParameter('placeholderDesktop'));
                break;
            default:
                break;
        }
    }

    // событие при изменении поля
    this.handlerChangeOnTextField = function (e, form) {
        // добавляем кнопку очистить поле
        if (this.getParameter('clear')) {
            e.currentTarget.value !== '' ? this.addButtonClear(form) : this.removeButtonClear(form);
        }
    }

    // добавляем кнопку очистить поле
    this.addButtonClear = function (form) {
        if (!form.querySelector('.form__button-clear')) {
            form.querySelector('.form__field-query').insertAdjacentHTML('beforeend', '<button class="form__button-clear">Очистить</button>');
            form.classList.add('is-button-clear');
            form.querySelector('.form__button-clear').addEventListener('click', e => this.handlerClickOnButtonClear(e, form));
        }
    }

    // удаляем кнопку очистить поле
    this.removeButtonClear = function (search) {
        search.querySelector('.form__button-clear').remove();
        search.classList.remove('is-button-clear');
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
    }

    // удаляем результаты поиска
    this.removeResult = function (search) {
        search.querySelector('.search-result') ? search.querySelector('.search-result').remove() : null;
    }

    if (FORM) {
        this.init();
    }
}
