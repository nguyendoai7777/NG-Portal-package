import { Directive, ElementRef, inject, Input, NgModule, OnChanges, OnDestroy, Renderer2, SimpleChanges } from '@angular/core';
import { DOCUMENT } from '@angular/common';

/**
 * This directive append to body as default.
 *
 * Use case:  modal, popup, popover, dialog, etc.
 *
 * How to use:
 *
 * <div [portal]="yourStatement"></div>
 *
 * @use use for standalone components by default, if use with module, remove `standalone: true` in @decorator declaration
 *
 * @prop portal boolean
 *
 *
 *  */

@Directive({
  selector: '[portal]',
  standalone: true,
})
export class PortalDirective implements OnChanges, OnDestroy {
  @Input() portal = true;
  dcm = inject(DOCUMENT);

  constructor(
    private readonly elr: ElementRef<HTMLDivElement>,
    private readonly rd2: Renderer2
  ) {
    this.rd2.setAttribute(elr.nativeElement, 'cpn-type', 'portal');
    this.rd2.removeChild(elr.nativeElement.parentElement, elr.nativeElement);
  }

  ngOnChanges(changes: SimpleChanges) {
    const currentState = changes?.['portal'].currentValue;
    if (currentState) {
      this.rd2.appendChild(this.dcm.body, this.elr.nativeElement);
    } else {
      const existed = this.dcm.body.querySelector('[cpn-type="portal"]');
      if (existed) {
        this.rd2.removeChild(this.dcm.body, this.elr.nativeElement || existed);
      }
    }
  }

  ngOnDestroy() {
    const existed = this.dcm.body.querySelector('[cpn-type="portal"]');
    if (existed) {
      this.rd2.removeChild(this.dcm.body, existed);
    }
  }
}


