import { Directive, ElementRef, inject, Input, OnChanges, OnDestroy, Renderer2, SimpleChanges } from '@angular/core';
import { DOCUMENT } from '@angular/common';

/**
 * This directive append to body and use for standalone components as default.
 * Use case:  modal, popup, dialog, etc.
 *
 * How to use:
 *
 * <div [portal]="yourStatement"></div>
 *
 * If you want to use animation, class [`component-mount`] will be attached when component show, opposite class [`component-destroy`] will be attached when component destroy.
 * You can use `destroyDelay` to control animation duration, ex:
 *
 * <div [portal]="yourStatement" [destroyDelay]="1000">...</div>
 *
 * css ex:
 * ```
 * @keyframes mount {
 *   from {
 *     opacity: 0;
 *   }
 *   to {
 *     opacity: 1;
 *   }
 * }
 * @keyframes destroy {
 *   from {
 *     opacity: 1;
 *   }
 *   to {
 *     opacity: 0;
 *   }
 * }
 *
 * .component-destroy {
 *   animation: destroy 1s linear forwards;
 * }
 *
 * .component-mount {
 *   animation: mount 1s linear forwards;
 * }
 *```
 *
 * @prop portal boolean
 * @prop  destroyDelay number [ms];
 */

@Directive({
  selector: '[portal]',
  standalone: true,
})
export class PortalDirective implements OnChanges, OnDestroy {
  @Input() portal = true;
  @Input() destroyDelay = 0;
  dcm = inject(DOCUMENT);
  timer?: NodeJS.Timeout;

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
      this.elr.nativeElement.classList.add('component-mount');
      this.elr.nativeElement.classList.contains('destroy') && this.elr.nativeElement.classList.remove('component-destroy');
      this.rd2.appendChild(this.dcm.body, this.elr.nativeElement);
    } else {
      this.timer = undefined;
      const existed = this.dcm.body.querySelector('[cpn-type="portal"]');
      if (existed) {
        if (this.destroyDelay > 0) {
          this.elr.nativeElement.classList.remove('component-mount');
          this.elr.nativeElement.classList.add('component-destroy');
          this.timer = setTimeout(() => {
            this.rd2.removeChild(this.dcm.body, this.elr.nativeElement || existed);
          }, this.destroyDelay);
        } else {
          this.rd2.removeChild(this.dcm.body, this.elr.nativeElement || existed);
        }
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


