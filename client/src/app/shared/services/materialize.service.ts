import { Injectable, ElementRef } from '@angular/core';
declare var M;

@Injectable({
  providedIn: 'root'
})
export class MaterializeService {
  constructor() {}

  toast(message: string) {
    M.toast({ html: message });
  }

  initializeFloatingButton(ref: ElementRef) {
    M.FloatingActionButton.init(ref.nativeElement);
  }

  initializeModal(ref: ElementRef) {
    return M.Modal.init(ref.nativeElement);
  }

  updateTextInput() {
    M.updateTextFields();
  }
}
