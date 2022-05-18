// Custom Scripts
// Custom scripts
// Мобильное меню бургер
function burgerMenu() {
    const burger = document.querySelector('.burger')
    const menu = document.querySelector('.menu')
    const body = document.querySelector('body')
    burger.addEventListener('click', () => {
      if (!menu.classList.contains('active')) {
        menu.classList.add('active')
        burger.classList.add('active-burger')
        body.classList.add('locked')
      } else {
        menu.classList.remove('active')
        burger.classList.remove('active-burger')
        body.classList.remove('locked')
      }
    })
    // Вот тут мы ставим брейкпоинт навбара
    window.addEventListener('resize', () => {
      if (window.innerWidth > 767.98) {
        menu.classList.remove('active')
        burger.classList.remove('active-burger')
        body.classList.remove('locked')
      }
    })
  }
  burgerMenu()


  // Вызываем эту функцию, если нам нужно зафиксировать меню при скролле.
  function fixedNav() {
    const nav = document.querySelector('nav')

    // тут указываем в пикселях, сколько нужно проскроллить что бы наше меню стало фиксированным
    const breakpoint = 1
    if (window.scrollY >= breakpoint) {
      nav.classList.add('fixed__nav')
    } else {
      nav.classList.remove('fixed__nav')
    }
  }
  window.addEventListener('scroll', fixedNav)


  // Аккордеон
function accordion() {
  const items = document.querySelectorAll('.accordion__item-trigger')
  items.forEach(item => {
      item.addEventListener('click', () => {
          const parent = item.parentNode
          if (parent.classList.contains('accordion__item-active')) {
              parent.classList.remove('accordion__item-active')
          } else {
              document
                  .querySelectorAll('.accordion__item')
                  .forEach(child => child.classList.remove('accordion__item-active'))
              parent.classList.add('accordion__item-active')
          }
      })
  })
}
accordion()


// Filter
const list = document.querySelector('.list'),
      items = document.querySelectorAll('.blocks__item')
      listItems = document.querySelectorAll('.list__item')

function filter() {
    list.addEventListener('click', event => {
        const targetId = event.target.dataset.id
        const target = event.target

        if(target.classList.contains('list__item')) {
            listItems.forEach(listItem => listItem.classList.remove('active'))
            target.classList.add('active')
        }


        switch(targetId) {
            case 'all':
                getItems('blocks__item')
                break
            case 'winter':
                getItems(targetId)
                break
            case 'spring':
                getItems(targetId)
                break
            case 'autumn':
                getItems(targetId)
                break
            case 'summer':
                getItems(targetId)
                break
        }
    })
}
filter()

function getItems(className) {
    items.forEach(item => {
        if (item.classList.contains(className)) {
            item.style.display = 'block'
        } else {
            item.style.display = 'none'
        }
    })
}


// Модальное окно
function bindModal(trigger, modal, close) {
  trigger = document.querySelector(trigger),
    modal = document.querySelector(modal),
    close = document.querySelector(close)

  const body = document.body

  trigger.addEventListener('click', e => {
    e.preventDefault()
    modal.style.display = 'flex'
    body.classList.add('locked')
  });
  close.addEventListener('click', () => {
    modal.style.display = 'none'
     body.classList.remove('locked')
  });
  modal.addEventListener('click', e => {
    if (e.target === modal) {
      modal.style.display = 'none'
       body.classList.remove('locked')
    }
  })
}

// ПЕРВЫЙ аргумент - класс кнопки, при клике на которую будет открываться модальное окно.
// ВТОРОЙ аргумент - класс самого модального окна.
// ТРЕТИЙ аргумент - класс кнопки, при клике на которую будет закрываться модальное окно.
bindModal('.modal__btn', '.modal__wrapper', '.modal__close')


// tabs
function tabs(headerSelector, tabSelector, contentSelector, activeClass, display='flex') {
  const header = document.querySelector(headerSelector),
        tab = document.querySelectorAll(tabSelector),
        content = document.querySelectorAll(contentSelector)
  function hideTabContent() {
      content.forEach(item => {
          item.style.display = 'none'
      });
      tab.forEach(item => {
          item.classList.remove(activeClass)
      });
  }
  function showTabContent(i = 0) {
     content[i].style.display = display
     tab[i].classList.add(activeClass)
  }
  hideTabContent()
  showTabContent()
  header.addEventListener('click', e => {
      const target = e.target
      if (target.classList.contains(tabSelector.replace(/\./, '')) ||
      target.parentNode.classList.contains(tabSelector.replace(/\./, ''))) {
          tab.forEach((item, i) => {
              if ( target == item || target.parentNode == item ) {
                  hideTabContent()
                  showTabContent(i)
              }
          });
      }
  })
}

// ПЕРВЫЙ аргумент - класс всего нашего хедера табов.
// ВТОРОЙ аргумент - класс конкретного элемента, при клике на который будет переключатся таб.
// ТРЕТИЙ аргумент - класс того блока, который будет переключаться.
// ЧЕТВЕРТЫЙ аргумент - класс активности, который будет добавлятся для таба, который сейчас активен.
tabs( '.tabs__header' ,'.tabs__header-item', '.tabs__content-item', 'active')


// select

const getTemplate = (data = [], placeholder, selectedId) => {
  let text = placeholder ?? 'placeholder не указан'

  const items = data.map(item => {
      let cls = ''
      if (item.id === selectedId) {
          text = item.value
          cls = 'selected'
      }
      return `
          <li class="select__item ${cls}" data-type="item" data-id="${item.id}">${item.value}</li>
      `
  })
  return `
      <input type="hidden" class="hidden__input">
      <div class="select__backdrop" data-type="backdrop"></div>
      <div class="select__input" data-type="input">
          <span data-type="value">${text}</span>
          <img src="./img/down-arrow.svg" alt="arrow" data-type="arrow" class="select__arrow">
      </div>
      <div class="select__dropdown">
          <ul class="select__list">
              ${items.join('')}
          </ul>
      </div>
  `
}
class Select {
  constructor(selector, options) {
      this.$el = document.querySelector(selector)
      this.options = options
      this.selectedId = options.selectedId

      this.render()
      this.setup()
  }

  render() {
      const { placeholder, data } = this.options
      this.$el.classList.add('select')
      this.$el.innerHTML = getTemplate(data, placeholder, this.selectedId)
  }
  setup() {
      this.clickHandler = this.clickHandler.bind(this)
      this.$el.addEventListener('click', this.clickHandler)
      this.$arrow = this.$el.querySelector('[data-type="arrow"]')
      this.$value = this.$el.querySelector('[data-type="value"]')
  }

  clickHandler(event) {
      const { type } = event.target.dataset
      if (type === 'input') {
          this.toggle()
      } else if (type === 'item') {
          const id = event.target.dataset.id
          this.select(id)
      }  else if (type === 'backdrop') {
          this.close()
      }
  }

  get isOpen() {
      return this.$el.classList.contains('open')
  }

  get current() {
      return this.options.data.find(item => item.id === this.selectedId)
  }

  select(id) {
      this.selectedId = id
      this.$value.textContent = this.current.value

      this.$el.querySelectorAll(`[data-type="item"]`).forEach( el => el.classList.remove('selected'))
      this.$el.querySelector(`[data-id="${id}"]`).classList.add('selected')

      this.options.onSelect ? this.options.onSelect(this.current) : null
      this.close()
  }

  toggle() {
      this.isOpen ? this.close() : this.open()
  }

  open() {
      this.$el.classList.add('open')
      this.$arrow.classList.add('open')
  }

  close() {
      this.$el.classList.remove('open')
      this.$arrow.classList.remove('open')
  }

  destroy() {
      this.$el.removeEventListener('click', this.clickHandler)
      this.$el.innerHTML = ''
  }
}


// Инициализация плагина
const select = new Select('#select', {
  placeholder: 'Выберите элемент',
  selectedId: '1',
  data: [
      {id: '1', value: 'Элемент списка 1'},
      {id: '2', value: 'Элемент списка 2'},
      {id: '3', value: 'Элемент списка 3'},
      {id: '4', value: 'Элемент списка 4'},
      {id: '5', value: 'Элемент списка 5'},
  ],
  onSelect(item) {
      const input = document.querySelector('.hidden__input')
      input.value = item.value
  }
})


// phone mask

const element = document.querySelector('.phone__input')
const maskOptions = {
  mask: '+{38}(000)000-00-00'
}
const mask = IMask(element, maskOptions)

