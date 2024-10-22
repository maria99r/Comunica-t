import { CommonModule, DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, Directive, Inject, Input, NgModule, ViewEncapsulation, booleanAttribute } from '@angular/core';
import { SharedModule } from 'primeng/api';
import { DomHandler } from 'primeng/dom';
import { UniqueComponentId } from 'primeng/utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
/**
 * Badge Directive is directive usage of badge component.
 * @group Components
 */
export class BadgeDirective {
    document;
    el;
    renderer;
    /**
     * When specified, disables the component.
     * @group Props
     */
    disabled;
    /**
     * Size of the badge, valid options are "large" and "xlarge".
     * @group Props
     */
    badgeSize;
    /**
     * Size of the badge, valid options are "large" and "xlarge".
     * @group Props
     * @deprecated use badgeSize instead.
     */
    set size(value) {
        this._size = value;
        console.warn('size property is deprecated and will removed in v18, use badgeSize instead.');
    }
    get size() {
        return this._size;
    }
    _size;
    /**
     * Severity type of the badge.
     * @group Props
     */
    severity;
    /**
     * Value to display inside the badge.
     * @group Props
     */
    value;
    /**
     * Inline style of the element.
     * @group Props
     */
    badgeStyle;
    /**
     * Class of the element.
     * @group Props
     */
    badgeStyleClass;
    id;
    badgeEl;
    get activeElement() {
        return this.el.nativeElement.nodeName.indexOf('-') != -1 ? this.el.nativeElement.firstChild : this.el.nativeElement;
    }
    get canUpdateBadge() {
        return this.id && !this.disabled;
    }
    constructor(document, el, renderer) {
        this.document = document;
        this.el = el;
        this.renderer = renderer;
    }
    ngOnChanges({ value, size, severity, disabled, badgeStyle, badgeStyleClass }) {
        if (disabled) {
            this.toggleDisableState();
        }
        if (!this.canUpdateBadge) {
            return;
        }
        if (severity) {
            this.setSeverity(severity.previousValue);
        }
        if (size) {
            this.setSizeClasses();
        }
        if (value) {
            this.setValue();
        }
        if (badgeStyle || badgeStyleClass) {
            this.applyStyles();
        }
    }
    ngAfterViewInit() {
        this.id = UniqueComponentId() + '_badge';
        this.renderBadgeContent();
    }
    setValue(element) {
        const badge = element ?? this.document.getElementById(this.id);
        if (!badge) {
            return;
        }
        if (this.value != null) {
            if (DomHandler.hasClass(badge, 'p-badge-dot')) {
                DomHandler.removeClass(badge, 'p-badge-dot');
            }
            if (this.value && String(this.value).length === 1) {
                DomHandler.addClass(badge, 'p-badge-no-gutter');
            }
            else {
                DomHandler.removeClass(badge, 'p-badge-no-gutter');
            }
        }
        else {
            if (!DomHandler.hasClass(badge, 'p-badge-dot')) {
                DomHandler.addClass(badge, 'p-badge-dot');
            }
            DomHandler.removeClass(badge, 'p-badge-no-gutter');
        }
        badge.innerHTML = '';
        const badgeValue = this.value != null ? String(this.value) : '';
        this.renderer.appendChild(badge, this.document.createTextNode(badgeValue));
    }
    setSizeClasses(element) {
        const badge = element ?? this.document.getElementById(this.id);
        if (!badge) {
            return;
        }
        if (this.badgeSize) {
            if (this.badgeSize === 'large') {
                DomHandler.addClass(badge, 'p-badge-lg');
                DomHandler.removeClass(badge, 'p-badge-xl');
            }
            if (this.badgeSize === 'xlarge') {
                DomHandler.addClass(badge, 'p-badge-xl');
                DomHandler.removeClass(badge, 'p-badge-lg');
            }
        }
        else if (this.size && !this.badgeSize) {
            if (this.size === 'large') {
                DomHandler.addClass(badge, 'p-badge-lg');
                DomHandler.removeClass(badge, 'p-badge-xl');
            }
            if (this.size === 'xlarge') {
                DomHandler.addClass(badge, 'p-badge-xl');
                DomHandler.removeClass(badge, 'p-badge-lg');
            }
        }
        else {
            DomHandler.removeClass(badge, 'p-badge-lg');
            DomHandler.removeClass(badge, 'p-badge-xl');
        }
    }
    renderBadgeContent() {
        if (this.disabled) {
            return null;
        }
        const el = this.activeElement;
        const badge = this.document.createElement('span');
        badge.id = this.id;
        badge.className = 'p-badge p-component';
        this.setSeverity(null, badge);
        this.setSizeClasses(badge);
        this.setValue(badge);
        DomHandler.addClass(el, 'p-overlay-badge');
        this.renderer.appendChild(el, badge);
        this.badgeEl = badge;
        this.applyStyles();
    }
    applyStyles() {
        if (this.badgeEl && this.badgeStyle && typeof this.badgeStyle === 'object') {
            for (const [key, value] of Object.entries(this.badgeStyle)) {
                this.renderer.setStyle(this.badgeEl, key, value);
            }
        }
        if (this.badgeEl && this.badgeStyleClass) {
            this.badgeEl.classList.add(...this.badgeStyleClass.split(' '));
        }
    }
    setSeverity(oldSeverity, element) {
        const badge = element ?? this.document.getElementById(this.id);
        if (!badge) {
            return;
        }
        if (this.severity) {
            DomHandler.addClass(badge, `p-badge-${this.severity}`);
        }
        if (oldSeverity) {
            DomHandler.removeClass(badge, `p-badge-${oldSeverity}`);
        }
    }
    toggleDisableState() {
        if (!this.id) {
            return;
        }
        if (this.disabled) {
            const badge = this.activeElement?.querySelector(`#${this.id}`);
            if (badge) {
                this.renderer.removeChild(this.activeElement, badge);
            }
        }
        else {
            this.renderBadgeContent();
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: BadgeDirective, deps: [{ token: DOCUMENT }, { token: i0.ElementRef }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.1", type: BadgeDirective, selector: "[pBadge]", inputs: { disabled: ["badgeDisabled", "disabled"], badgeSize: "badgeSize", size: "size", severity: "severity", value: "value", badgeStyle: "badgeStyle", badgeStyleClass: "badgeStyleClass" }, host: { classAttribute: "p-element" }, usesOnChanges: true, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: BadgeDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[pBadge]',
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: () => [{ type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.ElementRef }, { type: i0.Renderer2 }], propDecorators: { disabled: [{
                type: Input,
                args: ['badgeDisabled']
            }], badgeSize: [{
                type: Input
            }], size: [{
                type: Input
            }], severity: [{
                type: Input
            }], value: [{
                type: Input
            }], badgeStyle: [{
                type: Input
            }], badgeStyleClass: [{
                type: Input
            }] } });
/**
 * Badge is a small status indicator for another element.
 * @group Components
 */
export class Badge {
    /**
     * Class of the element.
     * @group Props
     */
    styleClass;
    /**
     * Inline style of the element.
     * @group Props
     */
    style;
    /**
     * Size of the badge, valid options are "large" and "xlarge".
     * @group Props
     */
    badgeSize;
    /**
     * Severity type of the badge.
     * @group Props
     */
    severity;
    /**
     * Value to display inside the badge.
     * @group Props
     */
    value;
    /**
     * When specified, disables the component.
     * @group Props
     */
    badgeDisabled = false;
    /**
     * Size of the badge, valid options are "large" and "xlarge".
     * @group Props
     * @deprecated use badgeSize instead.
     */
    set size(value) {
        this._size = value;
        console.warn('size property is deprecated and will removed in v18, use badgeSize instead.');
    }
    get size() {
        return this._size;
    }
    _size;
    containerClass() {
        return {
            'p-badge p-component': true,
            'p-badge-no-gutter': this.value != undefined && String(this.value).length === 1,
            'p-badge-lg': this.badgeSize === 'large' || this.size === 'large',
            'p-badge-xl': this.badgeSize === 'xlarge' || this.size === 'xlarge',
            [`p-badge-${this.severity}`]: this.severity
        };
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: Badge, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "16.1.0", version: "18.0.1", type: Badge, selector: "p-badge", inputs: { styleClass: "styleClass", style: "style", badgeSize: "badgeSize", severity: "severity", value: "value", badgeDisabled: ["badgeDisabled", "badgeDisabled", booleanAttribute], size: "size" }, host: { classAttribute: "p-element" }, ngImport: i0, template: ` <span *ngIf="!badgeDisabled" [ngClass]="containerClass()" [class]="styleClass" [ngStyle]="style">{{ value }}</span> `, isInline: true, styles: ["@layer primeng{.p-badge{display:inline-block;border-radius:10px;text-align:center;padding:0 .5rem}.p-overlay-badge{position:relative}.p-overlay-badge .p-badge{position:absolute;top:0;right:0;transform:translate(50%,-50%);transform-origin:100% 0;margin:0}.p-badge-dot{width:.5rem;min-width:.5rem;height:.5rem;border-radius:50%;padding:0}.p-badge-no-gutter{padding:0;border-radius:50%}}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: Badge, decorators: [{
            type: Component,
            args: [{ selector: 'p-badge', template: ` <span *ngIf="!badgeDisabled" [ngClass]="containerClass()" [class]="styleClass" [ngStyle]="style">{{ value }}</span> `, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: ["@layer primeng{.p-badge{display:inline-block;border-radius:10px;text-align:center;padding:0 .5rem}.p-overlay-badge{position:relative}.p-overlay-badge .p-badge{position:absolute;top:0;right:0;transform:translate(50%,-50%);transform-origin:100% 0;margin:0}.p-badge-dot{width:.5rem;min-width:.5rem;height:.5rem;border-radius:50%;padding:0}.p-badge-no-gutter{padding:0;border-radius:50%}}\n"] }]
        }], propDecorators: { styleClass: [{
                type: Input
            }], style: [{
                type: Input
            }], badgeSize: [{
                type: Input
            }], severity: [{
                type: Input
            }], value: [{
                type: Input
            }], badgeDisabled: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], size: [{
                type: Input
            }] } });
export class BadgeModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: BadgeModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: BadgeModule, declarations: [Badge, BadgeDirective], imports: [CommonModule], exports: [Badge, BadgeDirective, SharedModule] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: BadgeModule, imports: [CommonModule, SharedModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: BadgeModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [Badge, BadgeDirective, SharedModule],
                    declarations: [Badge, BadgeDirective]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFkZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvYmFkZ2UvYmFkZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN6RCxPQUFPLEVBQWlCLHVCQUF1QixFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQWMsTUFBTSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQXVDLGlCQUFpQixFQUFFLGdCQUFnQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzVNLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDM0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUN6QyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7OztBQUNsRDs7O0dBR0c7QUFPSCxNQUFNLE9BQU8sY0FBYztJQTBETztJQUNuQjtJQUNDO0lBM0RaOzs7T0FHRztJQUM0QixRQUFRLENBQVU7SUFDakQ7OztPQUdHO0lBQ2EsU0FBUyxDQUFpQztJQUMxRDs7OztPQUlHO0lBQ0gsSUFBb0IsSUFBSSxDQUFDLEtBQXlCO1FBQzlDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLE9BQU8sQ0FBQyxJQUFJLENBQUMsNkVBQTZFLENBQUMsQ0FBQztJQUNoRyxDQUFDO0lBQ0QsSUFBSSxJQUFJO1FBQ0osT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUFDRCxLQUFLLENBQXFCO0lBQzFCOzs7T0FHRztJQUNhLFFBQVEsQ0FBK0Q7SUFDdkY7OztPQUdHO0lBQ2EsS0FBSyxDQUFrQjtJQUN2Qzs7O09BR0c7SUFDTSxVQUFVLENBQThDO0lBQ2pFOzs7T0FHRztJQUNNLGVBQWUsQ0FBUztJQUV6QixFQUFFLENBQVU7SUFFcEIsT0FBTyxDQUFjO0lBRXJCLElBQVksYUFBYTtRQUNyQixPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUM7SUFDeEgsQ0FBQztJQUVELElBQVksY0FBYztRQUN0QixPQUFPLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3JDLENBQUM7SUFFRCxZQUM4QixRQUFrQixFQUNyQyxFQUFjLEVBQ2IsUUFBbUI7UUFGRCxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQ3JDLE9BQUUsR0FBRixFQUFFLENBQVk7UUFDYixhQUFRLEdBQVIsUUFBUSxDQUFXO0lBQzVCLENBQUM7SUFFRyxXQUFXLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLGVBQWUsRUFBaUI7UUFDOUYsSUFBSSxRQUFRLEVBQUUsQ0FBQztZQUNYLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQzlCLENBQUM7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3ZCLE9BQU87UUFDWCxDQUFDO1FBRUQsSUFBSSxRQUFRLEVBQUUsQ0FBQztZQUNYLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzdDLENBQUM7UUFFRCxJQUFJLElBQUksRUFBRSxDQUFDO1lBQ1AsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQzFCLENBQUM7UUFFRCxJQUFJLEtBQUssRUFBRSxDQUFDO1lBQ1IsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3BCLENBQUM7UUFFRCxJQUFJLFVBQVUsSUFBSSxlQUFlLEVBQUUsQ0FBQztZQUNoQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDdkIsQ0FBQztJQUNMLENBQUM7SUFFTSxlQUFlO1FBQ2xCLElBQUksQ0FBQyxFQUFFLEdBQUcsaUJBQWlCLEVBQUUsR0FBRyxRQUFRLENBQUM7UUFDekMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7SUFDOUIsQ0FBQztJQUVPLFFBQVEsQ0FBQyxPQUFxQjtRQUNsQyxNQUFNLEtBQUssR0FBRyxPQUFPLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRS9ELElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNULE9BQU87UUFDWCxDQUFDO1FBRUQsSUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksRUFBRSxDQUFDO1lBQ3JCLElBQUksVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsYUFBYSxDQUFDLEVBQUUsQ0FBQztnQkFDNUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFDakQsQ0FBQztZQUVELElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsQ0FBQztnQkFDaEQsVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztZQUNwRCxDQUFDO2lCQUFNLENBQUM7Z0JBQ0osVUFBVSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztZQUN2RCxDQUFDO1FBQ0wsQ0FBQzthQUFNLENBQUM7WUFDSixJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsYUFBYSxDQUFDLEVBQUUsQ0FBQztnQkFDN0MsVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFDOUMsQ0FBQztZQUVELFVBQVUsQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLG1CQUFtQixDQUFDLENBQUM7UUFDdkQsQ0FBQztRQUVELEtBQUssQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1FBQ3JCLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDaEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFDL0UsQ0FBQztJQUVPLGNBQWMsQ0FBQyxPQUFxQjtRQUN4QyxNQUFNLEtBQUssR0FBRyxPQUFPLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRS9ELElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNULE9BQU87UUFDWCxDQUFDO1FBRUQsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDakIsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLE9BQU8sRUFBRSxDQUFDO2dCQUM3QixVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsQ0FBQztnQkFDekMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDaEQsQ0FBQztZQUVELElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxRQUFRLEVBQUUsQ0FBQztnQkFDOUIsVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQUM7Z0JBQ3pDLFVBQVUsQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBQ2hELENBQUM7UUFDTCxDQUFDO2FBQU0sSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ3RDLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxPQUFPLEVBQUUsQ0FBQztnQkFDeEIsVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQUM7Z0JBQ3pDLFVBQVUsQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBQ2hELENBQUM7WUFFRCxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUFFLENBQUM7Z0JBQ3pCLFVBQVUsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDO2dCQUN6QyxVQUFVLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsQ0FBQztZQUNoRCxDQUFDO1FBQ0wsQ0FBQzthQUFNLENBQUM7WUFDSixVQUFVLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsQ0FBQztZQUM1QyxVQUFVLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsQ0FBQztRQUNoRCxDQUFDO0lBQ0wsQ0FBQztJQUVPLGtCQUFrQjtRQUN0QixJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNoQixPQUFPLElBQUksQ0FBQztRQUNoQixDQUFDO1FBRUQsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztRQUM5QixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNsRCxLQUFLLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDbkIsS0FBSyxDQUFDLFNBQVMsR0FBRyxxQkFBcUIsQ0FBQztRQUV4QyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNCLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckIsVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFDckIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFFTyxXQUFXO1FBQ2YsSUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxVQUFVLElBQUksT0FBTyxJQUFJLENBQUMsVUFBVSxLQUFLLFFBQVEsRUFBRSxDQUFDO1lBQ3pFLEtBQUssTUFBTSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDO2dCQUN6RCxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNyRCxDQUFDO1FBQ0wsQ0FBQztRQUNELElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDdkMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNuRSxDQUFDO0lBQ0wsQ0FBQztJQUVPLFdBQVcsQ0FBQyxXQUE4RCxFQUFFLE9BQXFCO1FBQ3JHLE1BQU0sS0FBSyxHQUFHLE9BQU8sSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFL0QsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ1QsT0FBTztRQUNYLENBQUM7UUFFRCxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNoQixVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxXQUFXLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQzNELENBQUM7UUFFRCxJQUFJLFdBQVcsRUFBRSxDQUFDO1lBQ2QsVUFBVSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsV0FBVyxXQUFXLEVBQUUsQ0FBQyxDQUFDO1FBQzVELENBQUM7SUFDTCxDQUFDO0lBRU8sa0JBQWtCO1FBQ3RCLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDWCxPQUFPO1FBQ1gsQ0FBQztRQUVELElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2hCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsYUFBYSxDQUFDLElBQUksSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFFL0QsSUFBSSxLQUFLLEVBQUUsQ0FBQztnQkFDUixJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3pELENBQUM7UUFDTCxDQUFDO2FBQU0sQ0FBQztZQUNKLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQzlCLENBQUM7SUFDTCxDQUFDO3VHQXpOUSxjQUFjLGtCQTBEWCxRQUFROzJGQTFEWCxjQUFjOzsyRkFBZCxjQUFjO2tCQU4xQixTQUFTO21CQUFDO29CQUNQLFFBQVEsRUFBRSxVQUFVO29CQUNwQixJQUFJLEVBQUU7d0JBQ0YsS0FBSyxFQUFFLFdBQVc7cUJBQ3JCO2lCQUNKOzswQkEyRFEsTUFBTTsyQkFBQyxRQUFROzBGQXJEVyxRQUFRO3NCQUF0QyxLQUFLO3VCQUFDLGVBQWU7Z0JBS04sU0FBUztzQkFBeEIsS0FBSztnQkFNYyxJQUFJO3NCQUF2QixLQUFLO2dCQVlVLFFBQVE7c0JBQXZCLEtBQUs7Z0JBS1UsS0FBSztzQkFBcEIsS0FBSztnQkFLRyxVQUFVO3NCQUFsQixLQUFLO2dCQUtHLGVBQWU7c0JBQXZCLEtBQUs7O0FBZ0xWOzs7R0FHRztBQVdILE1BQU0sT0FBTyxLQUFLO0lBQ2Q7OztPQUdHO0lBQ00sVUFBVSxDQUFxQjtJQUN4Qzs7O09BR0c7SUFDTSxLQUFLLENBQThDO0lBQzVEOzs7T0FHRztJQUNNLFNBQVMsQ0FBaUM7SUFDbkQ7OztPQUdHO0lBQ00sUUFBUSxDQUErRztJQUNoSTs7O09BR0c7SUFDTSxLQUFLLENBQXFDO0lBQ25EOzs7T0FHRztJQUNxQyxhQUFhLEdBQVksS0FBSyxDQUFDO0lBQ3ZFOzs7O09BSUc7SUFDSCxJQUFvQixJQUFJLENBQUMsS0FBeUI7UUFDOUMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsT0FBTyxDQUFDLElBQUksQ0FBQyw2RUFBNkUsQ0FBQyxDQUFDO0lBQ2hHLENBQUM7SUFDRCxJQUFJLElBQUk7UUFDSixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDdEIsQ0FBQztJQUNELEtBQUssQ0FBcUI7SUFFMUIsY0FBYztRQUNWLE9BQU87WUFDSCxxQkFBcUIsRUFBRSxJQUFJO1lBQzNCLG1CQUFtQixFQUFFLElBQUksQ0FBQyxLQUFLLElBQUksU0FBUyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUM7WUFDL0UsWUFBWSxFQUFFLElBQUksQ0FBQyxTQUFTLEtBQUssT0FBTyxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssT0FBTztZQUNqRSxZQUFZLEVBQUUsSUFBSSxDQUFDLFNBQVMsS0FBSyxRQUFRLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxRQUFRO1lBQ25FLENBQUMsV0FBVyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUTtTQUM5QyxDQUFDO0lBQ04sQ0FBQzt1R0FyRFEsS0FBSzsyRkFBTCxLQUFLLDJMQThCTSxnQkFBZ0Isa0ZBdEMxQix1SEFBdUg7OzJGQVF4SCxLQUFLO2tCQVZqQixTQUFTOytCQUNJLFNBQVMsWUFDVCx1SEFBdUgsbUJBQ2hILHVCQUF1QixDQUFDLE1BQU0saUJBQ2hDLGlCQUFpQixDQUFDLElBQUksUUFFL0I7d0JBQ0YsS0FBSyxFQUFFLFdBQVc7cUJBQ3JCOzhCQU9RLFVBQVU7c0JBQWxCLEtBQUs7Z0JBS0csS0FBSztzQkFBYixLQUFLO2dCQUtHLFNBQVM7c0JBQWpCLEtBQUs7Z0JBS0csUUFBUTtzQkFBaEIsS0FBSztnQkFLRyxLQUFLO3NCQUFiLEtBQUs7Z0JBS2tDLGFBQWE7c0JBQXBELEtBQUs7dUJBQUMsRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLEVBQUU7Z0JBTWxCLElBQUk7c0JBQXZCLEtBQUs7O0FBeUJWLE1BQU0sT0FBTyxXQUFXO3VHQUFYLFdBQVc7d0dBQVgsV0FBVyxpQkE3RFgsS0FBSyxFQXpPTCxjQUFjLGFBa1NiLFlBQVksYUF6RGIsS0FBSyxFQXpPTCxjQUFjLEVBbVNVLFlBQVk7d0dBR3BDLFdBQVcsWUFKVixZQUFZLEVBQ1csWUFBWTs7MkZBR3BDLFdBQVc7a0JBTHZCLFFBQVE7bUJBQUM7b0JBQ04sT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO29CQUN2QixPQUFPLEVBQUUsQ0FBQyxLQUFLLEVBQUUsY0FBYyxFQUFFLFlBQVksQ0FBQztvQkFDOUMsWUFBWSxFQUFFLENBQUMsS0FBSyxFQUFFLGNBQWMsQ0FBQztpQkFDeEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUsIERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEFmdGVyVmlld0luaXQsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSW5qZWN0LCBJbnB1dCwgTmdNb2R1bGUsIFJlbmRlcmVyMiwgT25DaGFuZ2VzLCBTaW1wbGVDaGFuZ2VzLCBWaWV3RW5jYXBzdWxhdGlvbiwgYm9vbGVhbkF0dHJpYnV0ZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU2hhcmVkTW9kdWxlIH0gZnJvbSAncHJpbWVuZy9hcGknO1xuaW1wb3J0IHsgRG9tSGFuZGxlciB9IGZyb20gJ3ByaW1lbmcvZG9tJztcbmltcG9ydCB7IFVuaXF1ZUNvbXBvbmVudElkIH0gZnJvbSAncHJpbWVuZy91dGlscyc7XG4vKipcbiAqIEJhZGdlIERpcmVjdGl2ZSBpcyBkaXJlY3RpdmUgdXNhZ2Ugb2YgYmFkZ2UgY29tcG9uZW50LlxuICogQGdyb3VwIENvbXBvbmVudHNcbiAqL1xuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6ICdbcEJhZGdlXScsXG4gICAgaG9zdDoge1xuICAgICAgICBjbGFzczogJ3AtZWxlbWVudCdcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIEJhZGdlRGlyZWN0aXZlIGltcGxlbWVudHMgT25DaGFuZ2VzLCBBZnRlclZpZXdJbml0IHtcbiAgICAvKipcbiAgICAgKiBXaGVuIHNwZWNpZmllZCwgZGlzYWJsZXMgdGhlIGNvbXBvbmVudC5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoJ2JhZGdlRGlzYWJsZWQnKSBwdWJsaWMgZGlzYWJsZWQ6IGJvb2xlYW47XG4gICAgLyoqXG4gICAgICogU2l6ZSBvZiB0aGUgYmFkZ2UsIHZhbGlkIG9wdGlvbnMgYXJlIFwibGFyZ2VcIiBhbmQgXCJ4bGFyZ2VcIi5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBwdWJsaWMgYmFkZ2VTaXplOiAnbGFyZ2UnIHwgJ3hsYXJnZScgfCB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogU2l6ZSBvZiB0aGUgYmFkZ2UsIHZhbGlkIG9wdGlvbnMgYXJlIFwibGFyZ2VcIiBhbmQgXCJ4bGFyZ2VcIi5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKiBAZGVwcmVjYXRlZCB1c2UgYmFkZ2VTaXplIGluc3RlYWQuXG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIHNldCBzaXplKHZhbHVlOiAnbGFyZ2UnIHwgJ3hsYXJnZScpIHtcbiAgICAgICAgdGhpcy5fc2l6ZSA9IHZhbHVlO1xuICAgICAgICBjb25zb2xlLndhcm4oJ3NpemUgcHJvcGVydHkgaXMgZGVwcmVjYXRlZCBhbmQgd2lsbCByZW1vdmVkIGluIHYxOCwgdXNlIGJhZGdlU2l6ZSBpbnN0ZWFkLicpO1xuICAgIH1cbiAgICBnZXQgc2l6ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NpemU7XG4gICAgfVxuICAgIF9zaXplOiAnbGFyZ2UnIHwgJ3hsYXJnZSc7XG4gICAgLyoqXG4gICAgICogU2V2ZXJpdHkgdHlwZSBvZiB0aGUgYmFkZ2UuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIHNldmVyaXR5OiAnc3VjY2VzcycgfCAnaW5mbycgfCAnd2FybmluZycgfCAnZGFuZ2VyJyB8IG51bGwgfCB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogVmFsdWUgdG8gZGlzcGxheSBpbnNpZGUgdGhlIGJhZGdlLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyB2YWx1ZTogc3RyaW5nIHwgbnVtYmVyO1xuICAgIC8qKlxuICAgICAqIElubGluZSBzdHlsZSBvZiB0aGUgZWxlbWVudC5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBiYWRnZVN0eWxlOiB7IFtrbGFzczogc3RyaW5nXTogYW55IH0gfCBudWxsIHwgdW5kZWZpbmVkO1xuICAgIC8qKlxuICAgICAqIENsYXNzIG9mIHRoZSBlbGVtZW50LlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIGJhZGdlU3R5bGVDbGFzczogc3RyaW5nO1xuXG4gICAgcHJpdmF0ZSBpZCE6IHN0cmluZztcblxuICAgIGJhZGdlRWw6IEhUTUxFbGVtZW50O1xuXG4gICAgcHJpdmF0ZSBnZXQgYWN0aXZlRWxlbWVudCgpOiBIVE1MRWxlbWVudCB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQubm9kZU5hbWUuaW5kZXhPZignLScpICE9IC0xID8gdGhpcy5lbC5uYXRpdmVFbGVtZW50LmZpcnN0Q2hpbGQgOiB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXQgY2FuVXBkYXRlQmFkZ2UoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmlkICYmICF0aGlzLmRpc2FibGVkO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIGRvY3VtZW50OiBEb2N1bWVudCxcbiAgICAgICAgcHVibGljIGVsOiBFbGVtZW50UmVmLFxuICAgICAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjJcbiAgICApIHt9XG5cbiAgICBwdWJsaWMgbmdPbkNoYW5nZXMoeyB2YWx1ZSwgc2l6ZSwgc2V2ZXJpdHksIGRpc2FibGVkLCBiYWRnZVN0eWxlLCBiYWRnZVN0eWxlQ2xhc3MgfTogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgICAgICBpZiAoZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlRGlzYWJsZVN0YXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuY2FuVXBkYXRlQmFkZ2UpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzZXZlcml0eSkge1xuICAgICAgICAgICAgdGhpcy5zZXRTZXZlcml0eShzZXZlcml0eS5wcmV2aW91c1ZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzaXplKSB7XG4gICAgICAgICAgICB0aGlzLnNldFNpemVDbGFzc2VzKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0VmFsdWUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChiYWRnZVN0eWxlIHx8IGJhZGdlU3R5bGVDbGFzcykge1xuICAgICAgICAgICAgdGhpcy5hcHBseVN0eWxlcygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5pZCA9IFVuaXF1ZUNvbXBvbmVudElkKCkgKyAnX2JhZGdlJztcbiAgICAgICAgdGhpcy5yZW5kZXJCYWRnZUNvbnRlbnQoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldFZhbHVlKGVsZW1lbnQ/OiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICAgICAgICBjb25zdCBiYWRnZSA9IGVsZW1lbnQgPz8gdGhpcy5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkKTtcblxuICAgICAgICBpZiAoIWJhZGdlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy52YWx1ZSAhPSBudWxsKSB7XG4gICAgICAgICAgICBpZiAoRG9tSGFuZGxlci5oYXNDbGFzcyhiYWRnZSwgJ3AtYmFkZ2UtZG90JykpIHtcbiAgICAgICAgICAgICAgICBEb21IYW5kbGVyLnJlbW92ZUNsYXNzKGJhZGdlLCAncC1iYWRnZS1kb3QnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMudmFsdWUgJiYgU3RyaW5nKHRoaXMudmFsdWUpLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIERvbUhhbmRsZXIuYWRkQ2xhc3MoYmFkZ2UsICdwLWJhZGdlLW5vLWd1dHRlcicpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBEb21IYW5kbGVyLnJlbW92ZUNsYXNzKGJhZGdlLCAncC1iYWRnZS1uby1ndXR0ZXInKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghRG9tSGFuZGxlci5oYXNDbGFzcyhiYWRnZSwgJ3AtYmFkZ2UtZG90JykpIHtcbiAgICAgICAgICAgICAgICBEb21IYW5kbGVyLmFkZENsYXNzKGJhZGdlLCAncC1iYWRnZS1kb3QnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgRG9tSGFuZGxlci5yZW1vdmVDbGFzcyhiYWRnZSwgJ3AtYmFkZ2Utbm8tZ3V0dGVyJyk7XG4gICAgICAgIH1cblxuICAgICAgICBiYWRnZS5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgY29uc3QgYmFkZ2VWYWx1ZSA9IHRoaXMudmFsdWUgIT0gbnVsbCA/IFN0cmluZyh0aGlzLnZhbHVlKSA6ICcnO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLmFwcGVuZENoaWxkKGJhZGdlLCB0aGlzLmRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGJhZGdlVmFsdWUpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldFNpemVDbGFzc2VzKGVsZW1lbnQ/OiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICAgICAgICBjb25zdCBiYWRnZSA9IGVsZW1lbnQgPz8gdGhpcy5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkKTtcblxuICAgICAgICBpZiAoIWJhZGdlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5iYWRnZVNpemUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmJhZGdlU2l6ZSA9PT0gJ2xhcmdlJykge1xuICAgICAgICAgICAgICAgIERvbUhhbmRsZXIuYWRkQ2xhc3MoYmFkZ2UsICdwLWJhZGdlLWxnJyk7XG4gICAgICAgICAgICAgICAgRG9tSGFuZGxlci5yZW1vdmVDbGFzcyhiYWRnZSwgJ3AtYmFkZ2UteGwnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuYmFkZ2VTaXplID09PSAneGxhcmdlJykge1xuICAgICAgICAgICAgICAgIERvbUhhbmRsZXIuYWRkQ2xhc3MoYmFkZ2UsICdwLWJhZGdlLXhsJyk7XG4gICAgICAgICAgICAgICAgRG9tSGFuZGxlci5yZW1vdmVDbGFzcyhiYWRnZSwgJ3AtYmFkZ2UtbGcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnNpemUgJiYgIXRoaXMuYmFkZ2VTaXplKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zaXplID09PSAnbGFyZ2UnKSB7XG4gICAgICAgICAgICAgICAgRG9tSGFuZGxlci5hZGRDbGFzcyhiYWRnZSwgJ3AtYmFkZ2UtbGcnKTtcbiAgICAgICAgICAgICAgICBEb21IYW5kbGVyLnJlbW92ZUNsYXNzKGJhZGdlLCAncC1iYWRnZS14bCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5zaXplID09PSAneGxhcmdlJykge1xuICAgICAgICAgICAgICAgIERvbUhhbmRsZXIuYWRkQ2xhc3MoYmFkZ2UsICdwLWJhZGdlLXhsJyk7XG4gICAgICAgICAgICAgICAgRG9tSGFuZGxlci5yZW1vdmVDbGFzcyhiYWRnZSwgJ3AtYmFkZ2UtbGcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIERvbUhhbmRsZXIucmVtb3ZlQ2xhc3MoYmFkZ2UsICdwLWJhZGdlLWxnJyk7XG4gICAgICAgICAgICBEb21IYW5kbGVyLnJlbW92ZUNsYXNzKGJhZGdlLCAncC1iYWRnZS14bCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZW5kZXJCYWRnZUNvbnRlbnQoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGVsID0gdGhpcy5hY3RpdmVFbGVtZW50O1xuICAgICAgICBjb25zdCBiYWRnZSA9IHRoaXMuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICBiYWRnZS5pZCA9IHRoaXMuaWQ7XG4gICAgICAgIGJhZGdlLmNsYXNzTmFtZSA9ICdwLWJhZGdlIHAtY29tcG9uZW50JztcblxuICAgICAgICB0aGlzLnNldFNldmVyaXR5KG51bGwsIGJhZGdlKTtcbiAgICAgICAgdGhpcy5zZXRTaXplQ2xhc3NlcyhiYWRnZSk7XG4gICAgICAgIHRoaXMuc2V0VmFsdWUoYmFkZ2UpO1xuICAgICAgICBEb21IYW5kbGVyLmFkZENsYXNzKGVsLCAncC1vdmVybGF5LWJhZGdlJyk7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuYXBwZW5kQ2hpbGQoZWwsIGJhZGdlKTtcbiAgICAgICAgdGhpcy5iYWRnZUVsID0gYmFkZ2U7XG4gICAgICAgIHRoaXMuYXBwbHlTdHlsZXMoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFwcGx5U3R5bGVzKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5iYWRnZUVsICYmIHRoaXMuYmFkZ2VTdHlsZSAmJiB0eXBlb2YgdGhpcy5iYWRnZVN0eWxlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXModGhpcy5iYWRnZVN0eWxlKSkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5iYWRnZUVsLCBrZXksIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5iYWRnZUVsICYmIHRoaXMuYmFkZ2VTdHlsZUNsYXNzKSB7XG4gICAgICAgICAgICB0aGlzLmJhZGdlRWwuY2xhc3NMaXN0LmFkZCguLi50aGlzLmJhZGdlU3R5bGVDbGFzcy5zcGxpdCgnICcpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgc2V0U2V2ZXJpdHkob2xkU2V2ZXJpdHk/OiAnc3VjY2VzcycgfCAnaW5mbycgfCAnd2FybmluZycgfCAnZGFuZ2VyJyB8IG51bGwsIGVsZW1lbnQ/OiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICAgICAgICBjb25zdCBiYWRnZSA9IGVsZW1lbnQgPz8gdGhpcy5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkKTtcblxuICAgICAgICBpZiAoIWJhZGdlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5zZXZlcml0eSkge1xuICAgICAgICAgICAgRG9tSGFuZGxlci5hZGRDbGFzcyhiYWRnZSwgYHAtYmFkZ2UtJHt0aGlzLnNldmVyaXR5fWApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9sZFNldmVyaXR5KSB7XG4gICAgICAgICAgICBEb21IYW5kbGVyLnJlbW92ZUNsYXNzKGJhZGdlLCBgcC1iYWRnZS0ke29sZFNldmVyaXR5fWApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB0b2dnbGVEaXNhYmxlU3RhdGUoKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5pZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IGJhZGdlID0gdGhpcy5hY3RpdmVFbGVtZW50Py5xdWVyeVNlbGVjdG9yKGAjJHt0aGlzLmlkfWApO1xuXG4gICAgICAgICAgICBpZiAoYmFkZ2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNoaWxkKHRoaXMuYWN0aXZlRWxlbWVudCwgYmFkZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJCYWRnZUNvbnRlbnQoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbi8qKlxuICogQmFkZ2UgaXMgYSBzbWFsbCBzdGF0dXMgaW5kaWNhdG9yIGZvciBhbm90aGVyIGVsZW1lbnQuXG4gKiBAZ3JvdXAgQ29tcG9uZW50c1xuICovXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3AtYmFkZ2UnLFxuICAgIHRlbXBsYXRlOiBgIDxzcGFuICpuZ0lmPVwiIWJhZGdlRGlzYWJsZWRcIiBbbmdDbGFzc109XCJjb250YWluZXJDbGFzcygpXCIgW2NsYXNzXT1cInN0eWxlQ2xhc3NcIiBbbmdTdHlsZV09XCJzdHlsZVwiPnt7IHZhbHVlIH19PC9zcGFuPiBgLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gICAgc3R5bGVVcmxzOiBbJy4vYmFkZ2UuY3NzJ10sXG4gICAgaG9zdDoge1xuICAgICAgICBjbGFzczogJ3AtZWxlbWVudCdcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIEJhZGdlIHtcbiAgICAvKipcbiAgICAgKiBDbGFzcyBvZiB0aGUgZWxlbWVudC5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBzdHlsZUNsYXNzOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogSW5saW5lIHN0eWxlIG9mIHRoZSBlbGVtZW50LlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIHN0eWxlOiB7IFtrbGFzczogc3RyaW5nXTogYW55IH0gfCBudWxsIHwgdW5kZWZpbmVkO1xuICAgIC8qKlxuICAgICAqIFNpemUgb2YgdGhlIGJhZGdlLCB2YWxpZCBvcHRpb25zIGFyZSBcImxhcmdlXCIgYW5kIFwieGxhcmdlXCIuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgYmFkZ2VTaXplOiAnbGFyZ2UnIHwgJ3hsYXJnZScgfCB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogU2V2ZXJpdHkgdHlwZSBvZiB0aGUgYmFkZ2UuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgc2V2ZXJpdHk6ICdzdWNjZXNzJyB8ICdpbmZvJyB8ICd3YXJuaW5nJyB8ICdkYW5nZXInIHwgJ2hlbHAnIHwgJ3ByaW1hcnknIHwgJ3NlY29uZGFyeScgfCAnY29udHJhc3QnIHwgbnVsbCB8IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBWYWx1ZSB0byBkaXNwbGF5IGluc2lkZSB0aGUgYmFkZ2UuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgdmFsdWU6IHN0cmluZyB8IG51bWJlciB8IG51bGwgfCB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogV2hlbiBzcGVjaWZpZWQsIGRpc2FibGVzIHRoZSBjb21wb25lbnQuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KHsgdHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlIH0pIGJhZGdlRGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAvKipcbiAgICAgKiBTaXplIG9mIHRoZSBiYWRnZSwgdmFsaWQgb3B0aW9ucyBhcmUgXCJsYXJnZVwiIGFuZCBcInhsYXJnZVwiLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqIEBkZXByZWNhdGVkIHVzZSBiYWRnZVNpemUgaW5zdGVhZC5cbiAgICAgKi9cbiAgICBASW5wdXQoKSBwdWJsaWMgc2V0IHNpemUodmFsdWU6ICdsYXJnZScgfCAneGxhcmdlJykge1xuICAgICAgICB0aGlzLl9zaXplID0gdmFsdWU7XG4gICAgICAgIGNvbnNvbGUud2Fybignc2l6ZSBwcm9wZXJ0eSBpcyBkZXByZWNhdGVkIGFuZCB3aWxsIHJlbW92ZWQgaW4gdjE4LCB1c2UgYmFkZ2VTaXplIGluc3RlYWQuJyk7XG4gICAgfVxuICAgIGdldCBzaXplKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2l6ZTtcbiAgICB9XG4gICAgX3NpemU6ICdsYXJnZScgfCAneGxhcmdlJztcblxuICAgIGNvbnRhaW5lckNsYXNzKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJ3AtYmFkZ2UgcC1jb21wb25lbnQnOiB0cnVlLFxuICAgICAgICAgICAgJ3AtYmFkZ2Utbm8tZ3V0dGVyJzogdGhpcy52YWx1ZSAhPSB1bmRlZmluZWQgJiYgU3RyaW5nKHRoaXMudmFsdWUpLmxlbmd0aCA9PT0gMSxcbiAgICAgICAgICAgICdwLWJhZGdlLWxnJzogdGhpcy5iYWRnZVNpemUgPT09ICdsYXJnZScgfHwgdGhpcy5zaXplID09PSAnbGFyZ2UnLFxuICAgICAgICAgICAgJ3AtYmFkZ2UteGwnOiB0aGlzLmJhZGdlU2l6ZSA9PT0gJ3hsYXJnZScgfHwgdGhpcy5zaXplID09PSAneGxhcmdlJyxcbiAgICAgICAgICAgIFtgcC1iYWRnZS0ke3RoaXMuc2V2ZXJpdHl9YF06IHRoaXMuc2V2ZXJpdHlcbiAgICAgICAgfTtcbiAgICB9XG59XG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG4gICAgZXhwb3J0czogW0JhZGdlLCBCYWRnZURpcmVjdGl2ZSwgU2hhcmVkTW9kdWxlXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtCYWRnZSwgQmFkZ2VEaXJlY3RpdmVdXG59KVxuZXhwb3J0IGNsYXNzIEJhZGdlTW9kdWxlIHt9XG4iXX0=