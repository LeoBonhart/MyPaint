import { Injectable } from '@angular/core';

type TooltipPosition = 'top' | 'left' | 'right' | 'bottom';

interface ICreateTooltip {
  text?: string;
  position?: TooltipPosition;
  enable?: boolean;
}

interface ITooltipPosition {
  left: number;
  top: number;
  direction: string;
}

@Injectable()
export class TooltipsService {

  private readonly constructed: boolean;
  tooltipNotClose: boolean = false;
  tooltipClose: boolean = true;
  tooltipElem: HTMLElement;

  constructor() {
    if (!this.constructed) {
      this.constructed = true;
      window.addEventListener('mousemove', (e) => {
        this.init(e);
      });
    }
  }

  private init(e: MouseEvent) {
    const tooltip: HTMLElement = this.getEventElementByClass(e, 'tooltips-block'); // определяю элемент
    if (this.tooltipClose) {
      this.tooltipElem = tooltip;
    }
    if ((this.Contain(tooltip, e) && this.tooltipElem === tooltip) || this.tooltipNotClose) {
        if (this.tooltipClose) {
            this.tooltipClose = false;
            tooltip.style.cursor = 'pointer';
            const text: string = tooltip.dataset.tooltips; // текст тултипа
            // статус (1 - показывать, 0 - нет)
            const status: number = tooltip.dataset.tooltipsStatus ? parseInt(tooltip.dataset.tooltipsStatus, 10) : 1;
            if (!text || status === 0 ) { // если не надо создавать тултип
                return; // выхожу из метода
            }
            this.removeElementByClass('tooltips');
            let newTooltip = document.createElement('div'); // создаем блок для будущего тултипа
            const id: string = 'tooltips' + this.randomInt(10000, 100000); // id будущего тултипа
            tooltip.dataset.tooltipsDone = id;
            newTooltip.className = 'tooltips'; // класс создаваемого тултипа
            // this.rend.appendChild(newTooltip, text); // текст в создаваемом тултипе
            newTooltip.innerHTML = text;
            // this.rend.setAttribute(newTooltip, 'id', id); // id тултипа
            newTooltip.id = id;
            // this.rend.appendChild(document.body, newTooltip); // цепляем тултип к боди
            document.body.appendChild(newTooltip);
            newTooltip = document.getElementById(id) as HTMLDivElement; // переопределяем тултип
            const positionNewTooltip = this.getPositionTooltip(tooltip, newTooltip);
            // размещаем тултип на странице
            // this.rend.setStyle(newTooltip, 'top', positionNewTooltip.top.toString() + 'px');
            // this.rend.setStyle(newTooltip, 'left', positionNewTooltip.left.toString() + 'px');
            // this.rend.setAttribute(newTooltip, 'data-direction', positionNewTooltip.direction);
            newTooltip.style.top = positionNewTooltip.top.toString() + 'px';
            newTooltip.style.left = positionNewTooltip.left.toString() + 'px';
            newTooltip.dataset.direction = positionNewTooltip.direction;
        }
    } else {
        try {
            this.removeElementByClass('tooltips');
            this.tooltipClose = true;
        } catch (error) {
        }
    }
  }

  /**
   * Формирование случайного числа из диапазона
   * @param min минимальное значение диапазона
   * @param max максимальное значение диапазона
   */
  private randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Метод удаления элементов с заданным классом
   * @param className Класс элементов
   * @param elem Контейнер в котором нужно удалить элементы, по умолчанию поиск идет по документу
   */
  private removeElementByClass(className: string) {
    const list = document.getElementsByClassName(className);
    if (list && list !== undefined && list !== null) {
        for (let index = list.length - 1; index >= 0; index--) {
            const element: HTMLElement = list[index] as HTMLElement;
            element.parentNode.removeChild(element);
        }
    }
}

  /**
   * Метод получения элемента из события по классу
   * @param e Событие
   * @param cls Клас элемента
   */
  private getEventElementByClass(e: Event, clsOrElem: string | HTMLElement): HTMLElement {
    let el: HTMLElement = this.getEventElement(e); // получаю таргет ивента
    if (this.emptyElem(el)) {
        return undefined;
    }
    if (typeof clsOrElem === 'string') {
        if (el.classList && el.classList.contains(clsOrElem) ) { // если он содержит класс
            return el; // возвращаю этот элемент
        } else {
            // tslint:disable-next-line:no-conditional-assignment
            while ( el = el.parentNode as HTMLElement) { // иначе передаю элементу его родителя
                if ( el.classList && el.classList.contains(clsOrElem) ) { // если у родителя есть класс
                    return el; // возвращаю этот элемент
                }
            }
        }
    } else {
        if (!this.emptyElem(clsOrElem) && el === clsOrElem ) { // если это тот элемент
            return el; // возвращаю этот элемент
        } else {
            // tslint:disable-next-line:no-conditional-assignment
            while ( el = el.parentNode as HTMLElement) { // иначе передаю элементу его родителя
                if ( !this.emptyElem(clsOrElem) && el === clsOrElem ) { // если это тот элемент
                    return el; // возвращаю этот элемент
                }
            }
        }
    }
    return undefined;
  }

  private getEventElement(e: MouseEvent | Event) {
    let targ: HTMLElement;
    if (e.target) { targ = e.target as HTMLElement; }
    else if (e.srcElement) { targ = e.srcElement as HTMLElement; }
    if (targ.nodeType === 3) { // defeat Safari bug
      targ = targ.parentNode as HTMLElement;
    }
    return targ;
  }

  /**
   * Проверка на пустой элемент
   * @param elem Элемнт
   * @param no_empty_callback Колбэк если элемент не пустой
   */
  private emptyElem(elem: any, noEmptyCallback?: () => any): boolean | any {
    const status: boolean = elem === false || elem === null || elem === undefined;
    if (!status && noEmptyCallback) {
        return noEmptyCallback();
    }
    return status;
  }

  /**
   * Проверка входит ли позиция мышки в позицию элемента
   * @param element Элемент
   * @param e События мышки
   */
  private Contain(element: HTMLElement | SVGElement, e: MouseEvent | TouchEvent): boolean {
    if (element === undefined) {
        return false;
    }
    const pos = element.getBoundingClientRect(); // получаю координату элемента
    const eventPos = this.GetEventPosition(e);
    return (this.containIn_X(pos, eventPos.x) && this.containIn_Y(pos, eventPos.y));
  }

  /**
   * Проверка, входит ли позиция между диапазоном
   */
  private containIn_X(pos: DOMRect, start: number): boolean {
    return (pos.left <= start && pos.right >= start);
  }

  /**
   * Проверка, входит ли позиция между диапазоном
   */
  private containIn_Y(pos: DOMRect, start: number): boolean {
      return (pos.top <= start && pos.bottom >= start);
  }

  /**
   * Получение позиции события
   * @param e События мышки
   */
  private GetEventPosition(e: MouseEvent | TouchEvent): {x: number, y: number} {
    if (!e) {
        return;
    }
    let x: number;
    let y: number;
    if ('touches' in e) {
        x = e.targetTouches[0].clientX;
        y = e.targetTouches[0].clientY;
    } else {
        x = e.clientX;
        y = e.clientY;
    }
    return {x, y};
  }

  /**
   * Метод формирования позиции тултипа
   * @param tooltip Элемент на который навели
   * @param newTooltip Созданный тултип
   */
  private getPositionTooltip(tooltip: HTMLElement, newTooltip: HTMLElement): ITooltipPosition {
    // позиция (слева, справо, вверху, внизу)
    const position: string = tooltip.dataset.tooltipsPosition ? tooltip.dataset.tooltipsPosition : 'right';
    const _pos = tooltip.getBoundingClientRect();
    const top: number = _pos.top;  // отступ блока сверху
    const left: number = _pos.left; // отступ блока слева
    const verticalIndent = tooltip.dataset.tooltipsVerticalIndent ?  parseInt(tooltip.dataset.tooltipsVerticalIndent, 10) : 0; // отступы
    const horizontalIndent = tooltip.dataset.tooltipsHorizontalIndent ?  parseInt(tooltip.dataset.tooltipsHorizontalIndent, 10) : 0;
    const tooltipHeight: number = newTooltip.offsetHeight; // определяем высоту созданного тултипа
    const tooltipWeight: number = newTooltip.offsetWidth; // определяем ширину созданного тултипа
    const width: number = tooltip.offsetWidth || _pos.width; // ширина блока
    const height: number = tooltip.offsetHeight || _pos.height; // высота блока
    let tooltipTopPos: number;
    let tooltipLeftPos: number;
    let direction: string;
    // размещаем тултип на странице
    switch (position) {
        case 'right':
            tooltipTopPos = top + (height / 2) - (tooltipHeight / 2);
            tooltipLeftPos = left + width + (14 + horizontalIndent);
            direction = 'right';
            break;
        case 'bottom':
            tooltipTopPos = top + height + (14 + verticalIndent);
            tooltipLeftPos =  left + (width / 2) - (tooltipWeight / 2);
            direction = 'bottom';
            break;
        case 'top':
            tooltipTopPos = top - tooltipHeight - (14 + verticalIndent);
            tooltipLeftPos = left + (width / 2) - (tooltipWeight / 2);
            direction = 'top';
            break;
        case 'left':
            tooltipTopPos = top + (height / 2) - (tooltipHeight / 2);
            tooltipLeftPos = left + (width / 2) - tooltipWeight - (20 + horizontalIndent);
            direction = 'left';
            break;
        default:
            break;
    }
    const w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    const vertical: boolean = (position === 'bottom' || position === 'top');
    const horizontal: boolean = (position === 'right' || position === 'left');
    if (tooltipLeftPos < 0 && vertical) {
        tooltipLeftPos = 0;
    }
    if (w < (tooltipLeftPos + tooltipWeight) && vertical) {
        tooltipLeftPos = w - tooltipWeight;
    }
    if (tooltipTopPos < 0 && vertical) {
        tooltipTopPos = top + height + (14 + verticalIndent);
        direction = 'bottom';
    }
    if (h < (tooltipTopPos + tooltipHeight) && vertical) {
        tooltipTopPos = top - tooltipHeight - (14 + verticalIndent);
        direction = 'top';
    }
    if (tooltipLeftPos < 0 && horizontal) {
        tooltipLeftPos = left + width + (14 + horizontalIndent);
        direction = 'right';
    }
    if (w < (tooltipLeftPos + tooltipWeight) && horizontal) {
        tooltipLeftPos = left + (width / 2) - tooltipWeight - (20 + horizontalIndent);
        direction = 'left';
    }
    return {
        direction,
        left: tooltipLeftPos,
        top: tooltipTopPos
    };
  }

  /**
   * Метод смены значения тултипа, и при наведении
   * @param elem Елемент
   * @param text Тектс
   */
  changeText(text: string, elem?: HTMLElement) {
    let tooltip: HTMLElement;
    if (this.emptyElem(elem)) {
      tooltip = document.querySelector('.tooltips');
    } else {
      tooltip = document.getElementById(elem.dataset.tooltipsDone);
    }
    this.emptyElem(tooltip, () => {
      tooltip.innerHTML = text;
    });
  }

  /**
   * Обновление текущего тултипа
   */
  update() {
    const tooltip: HTMLElement = document.querySelector('.tooltips');
    const elem: HTMLElement = document.querySelector(`[data-tooltips-done="${tooltip.id}"]`);
    tooltip.innerHTML = elem.dataset.tooltips;
  }

  /**
   * Метод установки тултипа на элемент
   * @param elem Элемент
   * @param data Данные тултипа
   */
  addTooltip(elem: HTMLElement, data: ICreateTooltip) {
    elem.classList.add('tooltips-block');
    if (data.text !== undefined) {
        elem.dataset.tooltips = data.text;
    }
    if (data.enable !== undefined) {
        elem.dataset.tooltipsStatus = data.enable ? '1' : '0';
    }
    if (data.position !== undefined) {
        elem.dataset.tooltipsPosition = data.position;
    }
  }
}
