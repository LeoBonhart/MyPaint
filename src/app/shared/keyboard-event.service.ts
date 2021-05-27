import { Injectable } from '@angular/core';

interface IKeyboardData {
  keyCode: number;
  keyString: string;
}

@Injectable({
  providedIn: 'root'
})
export class KeyboardEventService {

  constructor() { }

  /**
   * Метод нажатия клавишы (вешается один раз)
   * @param elem Элемент по которому кликнули
   * @param listener Событие которое будет выплнятся
   * @param options опции
   */
  getKeyboardData(e: KeyboardEvent, callback?: (data: IKeyboardData) => void): IKeyboardData {
    const keyCode: number = e.keyCode || e.charCode || e.which || parseInt(e.code, 10); // получаю код нажатой клавиши
    let keyString: string = e.key; // устанавливаю введенный символ
    if (!keyString) {
      keyString = String.fromCharCode(+keyCode);
    }
    const result: IKeyboardData = {
        keyCode,
        keyString
    };
    if (callback) {
        callback(result);
    }
    return result;
  }

}
