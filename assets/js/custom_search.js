/**
 *
 * Custom Search
 * Кастомный поиск с дополнительными возможностями.
 *
 * @author      Mihail Pridannikov
 * @copyright   2021, Mihail Pridannikov
 * @license MIT
 * @version     1.0.0
 * @release     November 2021
 * @link        https://github.com/mihail-174/custom_search
 *
 */

window.CustomSearch = function(settings) {
    const FORM = document.querySelectorAll('.form-search');
    const SETTINGS = {
        clear: true,
        placeholder: {
            desktop: 'Введите артикул или наименование',
            mobile: 'Поиск',
        }
    }

    this.init = function () {
        if (FORM.length) {
            FORM.forEach(form => {
                if (form) {
                    if ((typeof settings.clear === 'undefined' && SETTINGS.clear) || settings.clear) {
                        this.clickOnChangeText(form);
                        if (form.querySelector('.form__input').value !== '') {
                            this.addButtonClear(form);
                        }
                    }
                    this.setPlaceholder(form);
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
            this.setPlaceholder(form);
        });
    }

    // задаем плейсхолдер
    this.setPlaceholder = function (form) {
        let text = form.querySelector('.form__input');
        if (document.body.getBoundingClientRect().width <= 767) {
            if (text.getAttribute('placeholder') !== ((settings.placeholder && settings.placeholder.mobile) || SETTINGS.placeholder.mobile)) {
                text.setAttribute('placeholder', (settings.placeholder && settings.placeholder.mobile) || SETTINGS.placeholder.mobile);
            }
        } else {
            if (text.getAttribute('placeholder') !== ((settings.placeholder && settings.placeholder.desktop) || SETTINGS.placeholder.desktop)) {
                text.setAttribute('placeholder', (settings.placeholder && settings.placeholder.desktop) || SETTINGS.placeholder.desktop);
            }
        }
    }

    // событие при изменении поля
    this.clickOnChangeText = function (form) {
        form.querySelector('.form__input').addEventListener('input', e => {
            if (e.currentTarget.value !== '') {
                this.addButtonClear(form);
            } else {
                this.removeButtonClear(form);
            }
        });
    }

    // добавляем кнопку очистить поле
    this.addButtonClear = function (form) {
        if (!form.querySelector('.form__button-clear')) {
            form.querySelector('.form__field-query').insertAdjacentHTML('beforeend', '<button class="form__button-clear">Очистить</button>');
            form.classList.add('is-button-clear');
            this.clickOnButtonClear(form);
        }
    }

    // удаляем кнопку очистить поле
    this.removeButtonClear = function (search) {
        search.querySelector('.form__button-clear').remove();
        search.classList.remove('is-button-clear');
    }

    // событие клика по кнопке очистить поле
    this.clickOnButtonClear = function (search) {
        search.querySelector('.form__button-clear').addEventListener('click', e => {
            e.preventDefault();
            search.querySelector('.form__input').value = '';
            this.removeClasses(search);
            this.removeButtonClear(search);
        });
    }

    // удаление классов
    this.removeClasses = function (search) {
        search.classList.remove('is-results');
        search.classList.remove('is-focus');
        search.classList.remove('is-open');
    }

    if (FORM) {
        this.init();
    }
}
