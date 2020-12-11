import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-dialogo-yes-no',
  templateUrl: './dialogo-yes-no.component.html'
})
export class DialogoYesNoComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data:any) {}
  ngOnInit() {}
}
