import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, fromEvent, merge } from 'rxjs';
import { filter, map, pairwise, switchMap, takeUntil, withLatestFrom } from 'rxjs/operators';
import { Color } from '@angular-material-components/color-picker';

interface ISetSize {
  width: string | number;
  height: string | number;
}

interface IOptions {
  size: number;
  color: Color;
}

interface IDrowPosition {
  x: number;
  y: number;
  options: IOptions;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas') _canvas: ElementRef<HTMLCanvasElement>;
  canvas: HTMLCanvasElement;

  title = 'Paint';

  style: any = {};

  private context: CanvasRenderingContext2D;

  private scale: number;

  private size: number;

  private color: Color;

  private options$: BehaviorSubject<IOptions>;

  constructor() {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setsetDefaultSizes();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.canvas = this._canvas.nativeElement;
    this.scale = window.devicePixelRatio;
    this.context = this.canvas.getContext('2d');
    this.setsetDefaultSizes();
    this.context.scale(this.scale, this.scale);
    this.setEvents();
  }

  onSize(size: number) {
    this.size = size;
    this.updateOptions();
  }

  onColor(color: Color) {
    this.color = color;
    this.updateOptions();
  }

  private updateOptions() {
    const options: IOptions = { size: this.size, color: this.color};
    if (!this.options$) {
      this.options$ = new BehaviorSubject<IOptions>(options);
    } else {
      this.options$.next(options);
    }
  }

  private setsetDefaultSizes() {
    this.setDefaultSize('width');
    this.setDefaultSize('height');
  }

  private setDefaultSize<K extends keyof ISetSize>(prop: K) {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas[prop] = (rect[prop] * this.scale);
  }

  private setEvents() {
    //#region Cтримы событий
    const mouseMove$ = fromEvent<MouseEvent>(this.canvas, 'mousemove');
    const mouseDown$ = fromEvent<MouseEvent>(this.canvas, 'mousedown');
    const mouseUp$ = fromEvent<MouseEvent>(this.canvas, 'mouseup');
    const mouseOut$ = fromEvent<MouseEvent>(this.canvas, 'mouseout');
    const mouseEnter$ = fromEvent<MouseEvent>(this.canvas, 'mouseenter');
    //#endregion

    /** Стрим движения мышки по канвасу */
    const move$ = mouseMove$.pipe(
      /** Передаю значение опций */
      withLatestFrom(this.options$, (e, options) => ({e, options})),
      /** Формирую нужный объект */
      map(merg => (
        {
          x: merg.e.offsetX,
          y: merg.e.offsetY,
          options: merg.options
        }
      )),
      /** Объеденяю с передыдущим значением - делаю парыный массив с двумя точками */
      pairwise(),
      /** Беру данные пока не отпустится кнопка */
      takeUntil(mouseUp$),
      /** Беру данные пока не курсор не уйдет за границы */
      takeUntil(mouseOut$),
    );

    /** Стрим нажатия мышки по конвасу */
    const down$ = mouseDown$.pipe(
      /** Только если нажата левая кнопка мыши */
      filter(e => e.button === 0 && e.buttons > 0),
      /** Переключаюсь на событие движения мышки */
      switchMap(e => move$)
    );

    /**
     * ## Стрим входа курсора мышки на конвас
     *
     * Создан для того чтобы пользователь мог продолжать рисунок даже
     * если его курсор вышел за границы канваса
     */
    const enter$ = mouseEnter$.pipe(
      /** Только если нажата левая кнопка мыши */
      filter(e => e.button === 0 && e.buttons > 0),
      switchMap(e => {
        return  move$;
      })
    );

    /**
     * ## Главный стрим
     *
     * Объеденяю стримы нажатия и входа, для уменьшения подписок
     */
    const stream$ = merge(down$, enter$);

    stream$.subscribe(([from, to]) => {
      this.drowLine(from, to);
    });
  }

  private drowLine(from: IDrowPosition, to: IDrowPosition) {
    this.context.lineWidth = from.options.size;
    this.context.lineCap = 'round';
    this.context.lineJoin = 'round';
    this.context.strokeStyle = from.options.color.toRgba();
    this.context.beginPath();
    this.context.moveTo(from.x, from.y);
    this.context.lineTo(to.x, to.y);
    this.context.stroke();
  }

  clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

}
