import { Color } from '@angular-material-components/color-picker';
import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TooltipsService } from 'src/app/tooltips/tooltips.service';
import { KeyboardEventService } from '../../shared/keyboard-event.service';

@Component({
  selector: 'app-setting-bottom',
  templateUrl: './setting-bottom.component.html',
  styleUrls: ['./setting-bottom.component.scss']
})
export class SettingBottomComponent implements OnInit {

  @Output() color = new EventEmitter<Color>();
  @Output() size = new EventEmitter<number>();

  myForm: FormGroup;
  defaultColor: Color;

  constructor(private keboardEvent: KeyboardEventService, private tooltips: TooltipsService) {
    this.defaultColor = new Color(0, 0, 0, 1);
    this.myForm = new FormGroup({
      color: new FormControl(this.defaultColor),
      size: new FormControl('1')
    });
  }

  @HostListener('window:keydown', ['$event'])
  keyDown(event: KeyboardEvent) {
    this.keboardEvent.getKeyboardData(event, x => {
      let size = parseFloat(this.myForm.controls.size.value);
      switch (x.keyCode) {
        case 219:
          size--;
          break;
        case 221:
          size++;
          break;
        default:
          break;
      }
      this.myForm.controls.size.setValue(size.toString());
      console.log(x.keyString);
      if (x.keyString === 'Control') {
        this.tooltips.changeText('new text');
      }
    });
  }

  onColorChange() {
    this.color.emit(this.myForm.controls.color.value);
  }

  onSizeChange() {
    this.size.emit(parseInt(this.myForm.controls.size.value, 10));
  }

  ngOnInit(): void {
    this.onColorChange();
    this.onSizeChange();
  }

}
