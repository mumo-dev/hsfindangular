import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appDnd]'
})
export class DndDirective {
  @Output() fileDropped = new EventEmitter<any>();

  constructor() { }

  // Dragover listener
  // tslint:disable-next-line: typedef
  @HostListener('dragover', ['$event']) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  // Dragleave listener
  // tslint:disable-next-line: typedef
  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  // Drop listener
  // tslint:disable-next-line: typedef
  @HostListener('drop', ['$event']) public ondrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    const files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.fileDropped.emit(files);
    }
  }

}
