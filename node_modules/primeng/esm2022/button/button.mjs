import { DOCUMENT, NgClass, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChildren, Directive, EventEmitter, Inject, Input, NgModule, Output, ViewEncapsulation, booleanAttribute, numberAttribute } from '@angular/core';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import { AutoFocus } from 'primeng/autofocus';
import { DomHandler } from 'primeng/dom';
import { SpinnerIcon } from 'primeng/icons/spinner';
import { Ripple } from 'primeng/ripple';
import { ObjectUtils } from 'primeng/utils';
import * as i0 from "@angular/core";
const INTERNAL_BUTTON_CLASSES = {
    button: 'p-button',
    component: 'p-component',
    iconOnly: 'p-button-icon-only',
    disabled: 'p-disabled',
    loading: 'p-button-loading',
    labelOnly: 'p-button-loading-label-only'
};
/**
 * Button directive is an extension to button component.
 * @group Components
 */
export class ButtonDirective {
    el;
    document;
    /**
     * Position of the icon.
     * @group Props
     */
    iconPos = 'left';
    /**
     * Uses to pass attributes to the loading icon's DOM element.
     * @group Props
     */
    loadingIcon;
    /**
     * Text of the button.
     * @group Props
     */
    get label() {
        return this._label;
    }
    set label(val) {
        this._label = val;
        if (this.initialized) {
            this.updateLabel();
            this.updateIcon();
            this.setStyleClass();
        }
    }
    /**
     * Name of the icon.
     * @group Props
     */
    get icon() {
        return this._icon;
    }
    set icon(val) {
        this._icon = val;
        if (this.initialized) {
            this.updateIcon();
            this.setStyleClass();
        }
    }
    /**
     * Whether the button is in loading state.
     * @group Props
     */
    get loading() {
        return this._loading;
    }
    set loading(val) {
        this._loading = val;
        if (this.initialized) {
            this.updateIcon();
            this.setStyleClass();
        }
    }
    /**
     * Defines the style of the button.
     * @group Props
     */
    severity;
    /**
     * Add a shadow to indicate elevation.
     * @group Props
     */
    raised = false;
    /**
     * Add a circular border radius to the button.
     * @group Props
     */
    rounded = false;
    /**
     * Add a textual class to the button without a background initially.
     * @group Props
     */
    text = false;
    /**
     * Add a border class without a background initially.
     * @group Props
     */
    outlined = false;
    /**
     * Defines the size of the button.
     * @group Props
     */
    size = null;
    /**
     * Add a plain textual class to the button without a background initially.
     * @group Props
     */
    plain = false;
    _label;
    _icon;
    _loading = false;
    initialized;
    get htmlElement() {
        return this.el.nativeElement;
    }
    _internalClasses = Object.values(INTERNAL_BUTTON_CLASSES);
    constructor(el, document) {
        this.el = el;
        this.document = document;
    }
    ngAfterViewInit() {
        DomHandler.addMultipleClasses(this.htmlElement, this.getStyleClass().join(' '));
        this.createIcon();
        this.createLabel();
        this.initialized = true;
    }
    getStyleClass() {
        const styleClass = [INTERNAL_BUTTON_CLASSES.button, INTERNAL_BUTTON_CLASSES.component];
        if (this.icon && !this.label && ObjectUtils.isEmpty(this.htmlElement.textContent)) {
            styleClass.push(INTERNAL_BUTTON_CLASSES.iconOnly);
        }
        if (this.loading) {
            styleClass.push(INTERNAL_BUTTON_CLASSES.disabled, INTERNAL_BUTTON_CLASSES.loading);
            if (!this.icon && this.label) {
                styleClass.push(INTERNAL_BUTTON_CLASSES.labelOnly);
            }
            if (this.icon && !this.label && !ObjectUtils.isEmpty(this.htmlElement.textContent)) {
                styleClass.push(INTERNAL_BUTTON_CLASSES.iconOnly);
            }
        }
        if (this.text) {
            styleClass.push('p-button-text');
        }
        if (this.severity) {
            styleClass.push(`p-button-${this.severity}`);
        }
        if (this.plain) {
            styleClass.push('p-button-plain');
        }
        if (this.raised) {
            styleClass.push('p-button-raised');
        }
        if (this.size) {
            styleClass.push(`p-button-${this.size}`);
        }
        if (this.outlined) {
            styleClass.push('p-button-outlined');
        }
        if (this.rounded) {
            styleClass.push('p-button-rounded');
        }
        if (this.size === 'small') {
            styleClass.push('p-button-sm');
        }
        if (this.size === 'large') {
            styleClass.push('p-button-lg');
        }
        return styleClass;
    }
    setStyleClass() {
        const styleClass = this.getStyleClass();
        this.htmlElement.classList.remove(...this._internalClasses);
        this.htmlElement.classList.add(...styleClass);
    }
    createLabel() {
        const created = DomHandler.findSingle(this.htmlElement, '.p-button-label');
        if (!created && this.label) {
            let labelElement = this.document.createElement('span');
            if (this.icon && !this.label) {
                labelElement.setAttribute('aria-hidden', 'true');
            }
            labelElement.className = 'p-button-label';
            labelElement.appendChild(this.document.createTextNode(this.label));
            this.htmlElement.appendChild(labelElement);
        }
    }
    createIcon() {
        const created = DomHandler.findSingle(this.htmlElement, '.p-button-icon');
        if (!created && (this.icon || this.loading)) {
            let iconElement = this.document.createElement('span');
            iconElement.className = 'p-button-icon';
            iconElement.setAttribute('aria-hidden', 'true');
            let iconPosClass = this.label ? 'p-button-icon-' + this.iconPos : null;
            if (iconPosClass) {
                DomHandler.addClass(iconElement, iconPosClass);
            }
            let iconClass = this.getIconClass();
            if (iconClass) {
                DomHandler.addMultipleClasses(iconElement, iconClass);
            }
            this.htmlElement.insertBefore(iconElement, this.htmlElement.firstChild);
        }
    }
    updateLabel() {
        let labelElement = DomHandler.findSingle(this.htmlElement, '.p-button-label');
        if (!this.label) {
            labelElement && this.htmlElement.removeChild(labelElement);
            return;
        }
        labelElement ? (labelElement.textContent = this.label) : this.createLabel();
    }
    updateIcon() {
        let iconElement = DomHandler.findSingle(this.htmlElement, '.p-button-icon');
        let labelElement = DomHandler.findSingle(this.htmlElement, '.p-button-label');
        if (iconElement) {
            if (this.iconPos) {
                iconElement.className = 'p-button-icon ' + (labelElement ? 'p-button-icon-' + this.iconPos : '') + ' ' + this.getIconClass();
            }
            else {
                iconElement.className = 'p-button-icon ' + this.getIconClass();
            }
        }
        else {
            this.createIcon();
        }
    }
    getIconClass() {
        return this.loading ? 'p-button-loading-icon pi-spin ' + (this.loadingIcon ?? 'pi pi-spinner') : this.icon || 'p-hidden';
    }
    ngOnDestroy() {
        this.initialized = false;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: ButtonDirective, deps: [{ token: i0.ElementRef }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "16.1.0", version: "18.0.1", type: ButtonDirective, isStandalone: true, selector: "[pButton]", inputs: { iconPos: "iconPos", loadingIcon: "loadingIcon", label: "label", icon: "icon", loading: "loading", severity: "severity", raised: ["raised", "raised", booleanAttribute], rounded: ["rounded", "rounded", booleanAttribute], text: ["text", "text", booleanAttribute], outlined: ["outlined", "outlined", booleanAttribute], size: "size", plain: ["plain", "plain", booleanAttribute] }, host: { classAttribute: "p-element" }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: ButtonDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[pButton]',
                    standalone: true,
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }], propDecorators: { iconPos: [{
                type: Input
            }], loadingIcon: [{
                type: Input
            }], label: [{
                type: Input
            }], icon: [{
                type: Input
            }], loading: [{
                type: Input
            }], severity: [{
                type: Input
            }], raised: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], rounded: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], text: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], outlined: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], size: [{
                type: Input
            }], plain: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }] } });
/**
 * Button is an extension to standard button element with icons and theming.
 * @group Components
 */
export class Button {
    el;
    /**
     * Type of the button.
     * @group Props
     */
    type = 'button';
    /**
     * Position of the icon.
     * @group Props
     */
    iconPos = 'left';
    /**
     * Name of the icon.
     * @group Props
     */
    icon;
    /**
     * Value of the badge.
     * @group Props
     */
    badge;
    /**
     * Uses to pass attributes to the label's DOM element.
     * @group Props
     */
    label;
    /**
     * When present, it specifies that the component should be disabled.
     * @group Props
     */
    disabled;
    /**
     * Whether the button is in loading state.
     * @group Props
     */
    loading = false;
    /**
     * Icon to display in loading state.
     * @group Props
     */
    loadingIcon;
    /**
     * Add a shadow to indicate elevation.
     * @group Props
     */
    raised = false;
    /**
     * Add a circular border radius to the button.
     * @group Props
     */
    rounded = false;
    /**
     * Add a textual class to the button without a background initially.
     * @group Props
     */
    text = false;
    /**
     * Add a plain textual class to the button without a background initially.
     * @group Props
     */
    plain = false;
    /**
     * Defines the style of the button.
     * @group Props
     */
    severity;
    /**
     * Add a border class without a background initially.
     * @group Props
     */
    outlined = false;
    /**
     * Add a link style to the button.
     * @group Props
     */
    link = false;
    /**
     * Add a tabindex to the button.
     * @group Props
     */
    tabindex;
    /**
     * Defines the size of the button.
     * @group Props
     */
    size;
    /**
     * Inline style of the element.
     * @group Props
     */
    style;
    /**
     * Class of the element.
     * @group Props
     */
    styleClass;
    /**
     * Style class of the badge.
     * @group Props
     */
    badgeClass;
    /**
     * Used to define a string that autocomplete attribute the current element.
     * @group Props
     */
    ariaLabel;
    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    autofocus;
    /**
     * Callback to execute when button is clicked.
     * This event is intended to be used with the <p-button> component. Using a regular <button> element, use (click).
     * @param {MouseEvent} event - Mouse event.
     * @group Emits
     */
    onClick = new EventEmitter();
    /**
     * Callback to execute when button is focused.
     * This event is intended to be used with the <p-button> component. Using a regular <button> element, use (focus).
     * @param {FocusEvent} event - Focus event.
     * @group Emits
     */
    onFocus = new EventEmitter();
    /**
     * Callback to execute when button loses focus.
     * This event is intended to be used with the <p-button> component. Using a regular <button> element, use (blur).
     * @param {FocusEvent} event - Focus event.
     * @group Emits
     */
    onBlur = new EventEmitter();
    contentTemplate;
    loadingIconTemplate;
    iconTemplate;
    templates;
    constructor(el) {
        this.el = el;
    }
    spinnerIconClass() {
        return Object.entries(this.iconClass())
            .filter(([, value]) => !!value)
            .reduce((acc, [key]) => acc + ` ${key}`, 'p-button-loading-icon');
    }
    iconClass() {
        const iconClasses = {
            'p-button-icon': true,
            'p-button-icon-left': this.iconPos === 'left' && this.label,
            'p-button-icon-right': this.iconPos === 'right' && this.label,
            'p-button-icon-top': this.iconPos === 'top' && this.label,
            'p-button-icon-bottom': this.iconPos === 'bottom' && this.label
        };
        if (this.loading) {
            iconClasses[`p-button-loading-icon pi-spin ${this.loadingIcon ?? ''}`] = true;
        }
        else if (this.icon) {
            iconClasses[this.icon] = true;
        }
        return iconClasses;
    }
    get buttonClass() {
        return {
            'p-button p-component': true,
            'p-button-icon-only': (this.icon || this.iconTemplate || this.loadingIcon || this.loadingIconTemplate) && !this.label,
            'p-button-vertical': (this.iconPos === 'top' || this.iconPos === 'bottom') && this.label,
            'p-button-loading': this.loading,
            'p-button-loading-label-only': this.loading && !this.icon && this.label && !this.loadingIcon && this.iconPos === 'left',
            'p-button-link': this.link,
            [`p-button-${this.severity}`]: this.severity,
            'p-button-raised': this.raised,
            'p-button-rounded': this.rounded,
            'p-button-text': this.text,
            'p-button-outlined': this.outlined,
            'p-button-sm': this.size === 'small',
            'p-button-lg': this.size === 'large',
            'p-button-plain': this.plain,
            [`${this.styleClass}`]: this.styleClass
        };
    }
    ngAfterContentInit() {
        this.templates?.forEach((item) => {
            switch (item.getType()) {
                case 'content':
                    this.contentTemplate = item.template;
                    break;
                case 'icon':
                    this.iconTemplate = item.template;
                    break;
                case 'loadingicon':
                    this.loadingIconTemplate = item.template;
                    break;
                default:
                    this.contentTemplate = item.template;
                    break;
            }
        });
    }
    badgeStyleClass() {
        return {
            'p-badge p-component': true,
            'p-badge-no-gutter': this.badge && String(this.badge).length === 1
        };
    }
    /**
     * Applies focus.
     * @group Method
     */
    focus() {
        this.el.nativeElement.firstChild.focus();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: Button, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "16.1.0", version: "18.0.1", type: Button, isStandalone: true, selector: "p-button", inputs: { type: "type", iconPos: "iconPos", icon: "icon", badge: "badge", label: "label", disabled: ["disabled", "disabled", booleanAttribute], loading: ["loading", "loading", booleanAttribute], loadingIcon: "loadingIcon", raised: ["raised", "raised", booleanAttribute], rounded: ["rounded", "rounded", booleanAttribute], text: ["text", "text", booleanAttribute], plain: ["plain", "plain", booleanAttribute], severity: "severity", outlined: ["outlined", "outlined", booleanAttribute], link: ["link", "link", booleanAttribute], tabindex: ["tabindex", "tabindex", numberAttribute], size: "size", style: "style", styleClass: "styleClass", badgeClass: "badgeClass", ariaLabel: "ariaLabel", autofocus: ["autofocus", "autofocus", booleanAttribute] }, outputs: { onClick: "onClick", onFocus: "onFocus", onBlur: "onBlur" }, host: { properties: { "class.p-disabled": "disabled" }, classAttribute: "p-element" }, queries: [{ propertyName: "templates", predicate: PrimeTemplate }], ngImport: i0, template: `
        <button
            [attr.type]="type"
            [attr.aria-label]="ariaLabel"
            [ngStyle]="style"
            [disabled]="disabled || loading"
            [ngClass]="buttonClass"
            (click)="onClick.emit($event)"
            (focus)="onFocus.emit($event)"
            (blur)="onBlur.emit($event)"
            pRipple
            [attr.data-pc-name]="'button'"
            [attr.data-pc-section]="'root'"
            [attr.tabindex]="tabindex"
            pAutoFocus
            [autofocus]="autofocus"
        >
            <ng-content></ng-content>
            <ng-container *ngTemplateOutlet="contentTemplate"></ng-container>
            <ng-container *ngIf="loading">
                <ng-container *ngIf="!loadingIconTemplate">
                    <span *ngIf="loadingIcon" [ngClass]="iconClass()" [attr.aria-hidden]="true" [attr.data-pc-section]="'loadingicon'"></span>
                    <SpinnerIcon *ngIf="!loadingIcon" [styleClass]="spinnerIconClass()" [spin]="true" [attr.aria-hidden]="true" [attr.data-pc-section]="'loadingicon'" />
                </ng-container>
                <ng-template [ngIf]="loadingIconTemplate" *ngTemplateOutlet="loadingIconTemplate; context: { class: iconClass() }"></ng-template>
            </ng-container>
            <ng-container *ngIf="!loading">
                <span *ngIf="icon && !iconTemplate" [ngClass]="iconClass()" [attr.data-pc-section]="'icon'"></span>
                <ng-template [ngIf]="!icon && iconTemplate" *ngTemplateOutlet="iconTemplate; context: { class: iconClass() }"></ng-template>
            </ng-container>
            <span class="p-button-label" [attr.aria-hidden]="icon && !label" *ngIf="!contentTemplate && label" [attr.data-pc-section]="'label'">{{ label }}</span>
            <span [ngClass]="badgeStyleClass()" [class]="badgeClass" *ngIf="!contentTemplate && badge" [attr.data-pc-section]="'badge'">{{ badge }}</span>
        </button>
    `, isInline: true, dependencies: [{ kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: Ripple, selector: "[pRipple]" }, { kind: "directive", type: AutoFocus, selector: "[pAutoFocus]", inputs: ["autofocus"] }, { kind: "component", type: SpinnerIcon, selector: "SpinnerIcon" }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: Button, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-button',
                    standalone: true,
                    imports: [NgIf, NgTemplateOutlet, NgStyle, NgClass, Ripple, AutoFocus, SpinnerIcon],
                    template: `
        <button
            [attr.type]="type"
            [attr.aria-label]="ariaLabel"
            [ngStyle]="style"
            [disabled]="disabled || loading"
            [ngClass]="buttonClass"
            (click)="onClick.emit($event)"
            (focus)="onFocus.emit($event)"
            (blur)="onBlur.emit($event)"
            pRipple
            [attr.data-pc-name]="'button'"
            [attr.data-pc-section]="'root'"
            [attr.tabindex]="tabindex"
            pAutoFocus
            [autofocus]="autofocus"
        >
            <ng-content></ng-content>
            <ng-container *ngTemplateOutlet="contentTemplate"></ng-container>
            <ng-container *ngIf="loading">
                <ng-container *ngIf="!loadingIconTemplate">
                    <span *ngIf="loadingIcon" [ngClass]="iconClass()" [attr.aria-hidden]="true" [attr.data-pc-section]="'loadingicon'"></span>
                    <SpinnerIcon *ngIf="!loadingIcon" [styleClass]="spinnerIconClass()" [spin]="true" [attr.aria-hidden]="true" [attr.data-pc-section]="'loadingicon'" />
                </ng-container>
                <ng-template [ngIf]="loadingIconTemplate" *ngTemplateOutlet="loadingIconTemplate; context: { class: iconClass() }"></ng-template>
            </ng-container>
            <ng-container *ngIf="!loading">
                <span *ngIf="icon && !iconTemplate" [ngClass]="iconClass()" [attr.data-pc-section]="'icon'"></span>
                <ng-template [ngIf]="!icon && iconTemplate" *ngTemplateOutlet="iconTemplate; context: { class: iconClass() }"></ng-template>
            </ng-container>
            <span class="p-button-label" [attr.aria-hidden]="icon && !label" *ngIf="!contentTemplate && label" [attr.data-pc-section]="'label'">{{ label }}</span>
            <span [ngClass]="badgeStyleClass()" [class]="badgeClass" *ngIf="!contentTemplate && badge" [attr.data-pc-section]="'badge'">{{ badge }}</span>
        </button>
    `,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        class: 'p-element',
                        '[class.p-disabled]': 'disabled' || 'loading'
                    }
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }], propDecorators: { type: [{
                type: Input
            }], iconPos: [{
                type: Input
            }], icon: [{
                type: Input
            }], badge: [{
                type: Input
            }], label: [{
                type: Input
            }], disabled: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], loading: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], loadingIcon: [{
                type: Input
            }], raised: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], rounded: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], text: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], plain: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], severity: [{
                type: Input
            }], outlined: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], link: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], tabindex: [{
                type: Input,
                args: [{ transform: numberAttribute }]
            }], size: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], badgeClass: [{
                type: Input
            }], ariaLabel: [{
                type: Input
            }], autofocus: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], onClick: [{
                type: Output
            }], onFocus: [{
                type: Output
            }], onBlur: [{
                type: Output
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }] } });
export class ButtonModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: ButtonModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: ButtonModule, imports: [ButtonDirective, Button], exports: [ButtonDirective, Button, SharedModule] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: ButtonModule, imports: [Button, SharedModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: ButtonModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [ButtonDirective, Button],
                    exports: [ButtonDirective, Button, SharedModule]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9jb21wb25lbnRzL2J1dHRvbi9idXR0b24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3JGLE9BQU8sRUFHSCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULGVBQWUsRUFDZixTQUFTLEVBRVQsWUFBWSxFQUNaLE1BQU0sRUFDTixLQUFLLEVBQ0wsUUFBUSxFQUVSLE1BQU0sRUFHTixpQkFBaUIsRUFDakIsZ0JBQWdCLEVBQ2hCLGVBQWUsRUFDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGFBQWEsRUFBRSxZQUFZLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDMUQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDekMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3BELE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN4QyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQUk1QyxNQUFNLHVCQUF1QixHQUFHO0lBQzVCLE1BQU0sRUFBRSxVQUFVO0lBQ2xCLFNBQVMsRUFBRSxhQUFhO0lBQ3hCLFFBQVEsRUFBRSxvQkFBb0I7SUFDOUIsUUFBUSxFQUFFLFlBQVk7SUFDdEIsT0FBTyxFQUFFLGtCQUFrQjtJQUMzQixTQUFTLEVBQUUsNkJBQTZCO0NBQ2xDLENBQUM7QUFFWDs7O0dBR0c7QUFRSCxNQUFNLE9BQU8sZUFBZTtJQTRHYjtJQUNtQjtJQTVHOUI7OztPQUdHO0lBQ00sT0FBTyxHQUF1QixNQUFNLENBQUM7SUFDOUM7OztPQUdH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RCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERPQ1VNRU5ULCBOZ0NsYXNzLCBOZ0lmLCBOZ1N0eWxlLCBOZ1RlbXBsYXRlT3V0bGV0IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gICAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgICBBZnRlclZpZXdJbml0LFxuICAgIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICAgIENvbXBvbmVudCxcbiAgICBDb250ZW50Q2hpbGRyZW4sXG4gICAgRGlyZWN0aXZlLFxuICAgIEVsZW1lbnRSZWYsXG4gICAgRXZlbnRFbWl0dGVyLFxuICAgIEluamVjdCxcbiAgICBJbnB1dCxcbiAgICBOZ01vZHVsZSxcbiAgICBPbkRlc3Ryb3ksXG4gICAgT3V0cHV0LFxuICAgIFF1ZXJ5TGlzdCxcbiAgICBUZW1wbGF0ZVJlZixcbiAgICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgICBib29sZWFuQXR0cmlidXRlLFxuICAgIG51bWJlckF0dHJpYnV0ZVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFByaW1lVGVtcGxhdGUsIFNoYXJlZE1vZHVsZSB9IGZyb20gJ3ByaW1lbmcvYXBpJztcbmltcG9ydCB7IEF1dG9Gb2N1cyB9IGZyb20gJ3ByaW1lbmcvYXV0b2ZvY3VzJztcbmltcG9ydCB7IERvbUhhbmRsZXIgfSBmcm9tICdwcmltZW5nL2RvbSc7XG5pbXBvcnQgeyBTcGlubmVySWNvbiB9IGZyb20gJ3ByaW1lbmcvaWNvbnMvc3Bpbm5lcic7XG5pbXBvcnQgeyBSaXBwbGUgfSBmcm9tICdwcmltZW5nL3JpcHBsZSc7XG5pbXBvcnQgeyBPYmplY3RVdGlscyB9IGZyb20gJ3ByaW1lbmcvdXRpbHMnO1xuXG50eXBlIEJ1dHRvbkljb25Qb3NpdGlvbiA9ICdsZWZ0JyB8ICdyaWdodCcgfCAndG9wJyB8ICdib3R0b20nO1xuXG5jb25zdCBJTlRFUk5BTF9CVVRUT05fQ0xBU1NFUyA9IHtcbiAgICBidXR0b246ICdwLWJ1dHRvbicsXG4gICAgY29tcG9uZW50OiAncC1jb21wb25lbnQnLFxuICAgIGljb25Pbmx5OiAncC1idXR0b24taWNvbi1vbmx5JyxcbiAgICBkaXNhYmxlZDogJ3AtZGlzYWJsZWQnLFxuICAgIGxvYWRpbmc6ICdwLWJ1dHRvbi1sb2FkaW5nJyxcbiAgICBsYWJlbE9ubHk6ICdwLWJ1dHRvbi1sb2FkaW5nLWxhYmVsLW9ubHknXG59IGFzIGNvbnN0O1xuXG4vKipcbiAqIEJ1dHRvbiBkaXJlY3RpdmUgaXMgYW4gZXh0ZW5zaW9uIHRvIGJ1dHRvbiBjb21wb25lbnQuXG4gKiBAZ3JvdXAgQ29tcG9uZW50c1xuICovXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogJ1twQnV0dG9uXScsXG4gICAgc3RhbmRhbG9uZTogdHJ1ZSxcbiAgICBob3N0OiB7XG4gICAgICAgIGNsYXNzOiAncC1lbGVtZW50J1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgQnV0dG9uRGlyZWN0aXZlIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcbiAgICAvKipcbiAgICAgKiBQb3NpdGlvbiBvZiB0aGUgaWNvbi5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBpY29uUG9zOiBCdXR0b25JY29uUG9zaXRpb24gPSAnbGVmdCc7XG4gICAgLyoqXG4gICAgICogVXNlcyB0byBwYXNzIGF0dHJpYnV0ZXMgdG8gdGhlIGxvYWRpbmcgaWNvbidzIERPTSBlbGVtZW50LlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIGxvYWRpbmdJY29uOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogVGV4dCBvZiB0aGUgYnV0dG9uLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIGdldCBsYWJlbCgpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGFiZWwgYXMgc3RyaW5nO1xuICAgIH1cbiAgICBzZXQgbGFiZWwodmFsOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fbGFiZWwgPSB2YWw7XG5cbiAgICAgICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlTGFiZWwoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlSWNvbigpO1xuICAgICAgICAgICAgdGhpcy5zZXRTdHlsZUNsYXNzKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogTmFtZSBvZiB0aGUgaWNvbi5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBnZXQgaWNvbigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5faWNvbiBhcyBzdHJpbmc7XG4gICAgfVxuICAgIHNldCBpY29uKHZhbDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX2ljb24gPSB2YWw7XG5cbiAgICAgICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlSWNvbigpO1xuICAgICAgICAgICAgdGhpcy5zZXRTdHlsZUNsYXNzKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogV2hldGhlciB0aGUgYnV0dG9uIGlzIGluIGxvYWRpbmcgc3RhdGUuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgZ2V0IGxvYWRpbmcoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sb2FkaW5nO1xuICAgIH1cbiAgICBzZXQgbG9hZGluZyh2YWw6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5fbG9hZGluZyA9IHZhbDtcblxuICAgICAgICBpZiAodGhpcy5pbml0aWFsaXplZCkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVJY29uKCk7XG4gICAgICAgICAgICB0aGlzLnNldFN0eWxlQ2xhc3MoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBEZWZpbmVzIHRoZSBzdHlsZSBvZiB0aGUgYnV0dG9uLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIHNldmVyaXR5OiAnc3VjY2VzcycgfCAnaW5mbycgfCAnd2FybmluZycgfCAnZGFuZ2VyJyB8ICdoZWxwJyB8ICdwcmltYXJ5JyB8ICdzZWNvbmRhcnknIHwgJ2NvbnRyYXN0JyB8IG51bGwgfCB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogQWRkIGEgc2hhZG93IHRvIGluZGljYXRlIGVsZXZhdGlvbi5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoeyB0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGUgfSkgcmFpc2VkOiBib29sZWFuID0gZmFsc2U7XG4gICAgLyoqXG4gICAgICogQWRkIGEgY2lyY3VsYXIgYm9yZGVyIHJhZGl1cyB0byB0aGUgYnV0dG9uLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCh7IHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZSB9KSByb3VuZGVkOiBib29sZWFuID0gZmFsc2U7XG4gICAgLyoqXG4gICAgICogQWRkIGEgdGV4dHVhbCBjbGFzcyB0byB0aGUgYnV0dG9uIHdpdGhvdXQgYSBiYWNrZ3JvdW5kIGluaXRpYWxseS5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoeyB0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGUgfSkgdGV4dDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIC8qKlxuICAgICAqIEFkZCBhIGJvcmRlciBjbGFzcyB3aXRob3V0IGEgYmFja2dyb3VuZCBpbml0aWFsbHkuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KHsgdHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlIH0pIG91dGxpbmVkOiBib29sZWFuID0gZmFsc2U7XG4gICAgLyoqXG4gICAgICogRGVmaW5lcyB0aGUgc2l6ZSBvZiB0aGUgYnV0dG9uLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIHNpemU6ICdzbWFsbCcgfCAnbGFyZ2UnIHwgdW5kZWZpbmVkIHwgbnVsbCA9IG51bGw7XG4gICAgLyoqXG4gICAgICogQWRkIGEgcGxhaW4gdGV4dHVhbCBjbGFzcyB0byB0aGUgYnV0dG9uIHdpdGhvdXQgYSBiYWNrZ3JvdW5kIGluaXRpYWxseS5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoeyB0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGUgfSkgcGxhaW46IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIHB1YmxpYyBfbGFiZWw6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAgIHB1YmxpYyBfaWNvbjogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG4gICAgcHVibGljIF9sb2FkaW5nOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBwdWJsaWMgaW5pdGlhbGl6ZWQ6IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cbiAgICBwcml2YXRlIGdldCBodG1sRWxlbWVudCgpOiBIVE1MRWxlbWVudCB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfaW50ZXJuYWxDbGFzc2VzOiBzdHJpbmdbXSA9IE9iamVjdC52YWx1ZXMoSU5URVJOQUxfQlVUVE9OX0NMQVNTRVMpO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHB1YmxpYyBlbDogRWxlbWVudFJlZixcbiAgICAgICAgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBkb2N1bWVudDogRG9jdW1lbnRcbiAgICApIHt9XG5cbiAgICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgICAgIERvbUhhbmRsZXIuYWRkTXVsdGlwbGVDbGFzc2VzKHRoaXMuaHRtbEVsZW1lbnQsIHRoaXMuZ2V0U3R5bGVDbGFzcygpLmpvaW4oJyAnKSk7XG5cbiAgICAgICAgdGhpcy5jcmVhdGVJY29uKCk7XG4gICAgICAgIHRoaXMuY3JlYXRlTGFiZWwoKTtcblxuICAgICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBnZXRTdHlsZUNsYXNzKCk6IHN0cmluZ1tdIHtcbiAgICAgICAgY29uc3Qgc3R5bGVDbGFzczogc3RyaW5nW10gPSBbSU5URVJOQUxfQlVUVE9OX0NMQVNTRVMuYnV0dG9uLCBJTlRFUk5BTF9CVVRUT05fQ0xBU1NFUy5jb21wb25lbnRdO1xuXG4gICAgICAgIGlmICh0aGlzLmljb24gJiYgIXRoaXMubGFiZWwgJiYgT2JqZWN0VXRpbHMuaXNFbXB0eSh0aGlzLmh0bWxFbGVtZW50LnRleHRDb250ZW50KSkge1xuICAgICAgICAgICAgc3R5bGVDbGFzcy5wdXNoKElOVEVSTkFMX0JVVFRPTl9DTEFTU0VTLmljb25Pbmx5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmxvYWRpbmcpIHtcbiAgICAgICAgICAgIHN0eWxlQ2xhc3MucHVzaChJTlRFUk5BTF9CVVRUT05fQ0xBU1NFUy5kaXNhYmxlZCwgSU5URVJOQUxfQlVUVE9OX0NMQVNTRVMubG9hZGluZyk7XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5pY29uICYmIHRoaXMubGFiZWwpIHtcbiAgICAgICAgICAgICAgICBzdHlsZUNsYXNzLnB1c2goSU5URVJOQUxfQlVUVE9OX0NMQVNTRVMubGFiZWxPbmx5KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuaWNvbiAmJiAhdGhpcy5sYWJlbCAmJiAhT2JqZWN0VXRpbHMuaXNFbXB0eSh0aGlzLmh0bWxFbGVtZW50LnRleHRDb250ZW50KSkge1xuICAgICAgICAgICAgICAgIHN0eWxlQ2xhc3MucHVzaChJTlRFUk5BTF9CVVRUT05fQ0xBU1NFUy5pY29uT25seSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy50ZXh0KSB7XG4gICAgICAgICAgICBzdHlsZUNsYXNzLnB1c2goJ3AtYnV0dG9uLXRleHQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnNldmVyaXR5KSB7XG4gICAgICAgICAgICBzdHlsZUNsYXNzLnB1c2goYHAtYnV0dG9uLSR7dGhpcy5zZXZlcml0eX1gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnBsYWluKSB7XG4gICAgICAgICAgICBzdHlsZUNsYXNzLnB1c2goJ3AtYnV0dG9uLXBsYWluJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5yYWlzZWQpIHtcbiAgICAgICAgICAgIHN0eWxlQ2xhc3MucHVzaCgncC1idXR0b24tcmFpc2VkJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5zaXplKSB7XG4gICAgICAgICAgICBzdHlsZUNsYXNzLnB1c2goYHAtYnV0dG9uLSR7dGhpcy5zaXplfWApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMub3V0bGluZWQpIHtcbiAgICAgICAgICAgIHN0eWxlQ2xhc3MucHVzaCgncC1idXR0b24tb3V0bGluZWQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnJvdW5kZWQpIHtcbiAgICAgICAgICAgIHN0eWxlQ2xhc3MucHVzaCgncC1idXR0b24tcm91bmRlZCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuc2l6ZSA9PT0gJ3NtYWxsJykge1xuICAgICAgICAgICAgc3R5bGVDbGFzcy5wdXNoKCdwLWJ1dHRvbi1zbScpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuc2l6ZSA9PT0gJ2xhcmdlJykge1xuICAgICAgICAgICAgc3R5bGVDbGFzcy5wdXNoKCdwLWJ1dHRvbi1sZycpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHN0eWxlQ2xhc3M7XG4gICAgfVxuXG4gICAgc2V0U3R5bGVDbGFzcygpIHtcbiAgICAgICAgY29uc3Qgc3R5bGVDbGFzcyA9IHRoaXMuZ2V0U3R5bGVDbGFzcygpO1xuICAgICAgICB0aGlzLmh0bWxFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoLi4udGhpcy5faW50ZXJuYWxDbGFzc2VzKTtcbiAgICAgICAgdGhpcy5odG1sRWxlbWVudC5jbGFzc0xpc3QuYWRkKC4uLnN0eWxlQ2xhc3MpO1xuICAgIH1cblxuICAgIGNyZWF0ZUxhYmVsKCkge1xuICAgICAgICBjb25zdCBjcmVhdGVkID0gRG9tSGFuZGxlci5maW5kU2luZ2xlKHRoaXMuaHRtbEVsZW1lbnQsICcucC1idXR0b24tbGFiZWwnKTtcbiAgICAgICAgaWYgKCFjcmVhdGVkICYmIHRoaXMubGFiZWwpIHtcbiAgICAgICAgICAgIGxldCBsYWJlbEVsZW1lbnQgPSB0aGlzLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmljb24gJiYgIXRoaXMubGFiZWwpIHtcbiAgICAgICAgICAgICAgICBsYWJlbEVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxhYmVsRWxlbWVudC5jbGFzc05hbWUgPSAncC1idXR0b24tbGFiZWwnO1xuICAgICAgICAgICAgbGFiZWxFbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGhpcy5sYWJlbCkpO1xuXG4gICAgICAgICAgICB0aGlzLmh0bWxFbGVtZW50LmFwcGVuZENoaWxkKGxhYmVsRWxlbWVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjcmVhdGVJY29uKCkge1xuICAgICAgICBjb25zdCBjcmVhdGVkID0gRG9tSGFuZGxlci5maW5kU2luZ2xlKHRoaXMuaHRtbEVsZW1lbnQsICcucC1idXR0b24taWNvbicpO1xuICAgICAgICBpZiAoIWNyZWF0ZWQgJiYgKHRoaXMuaWNvbiB8fCB0aGlzLmxvYWRpbmcpKSB7XG4gICAgICAgICAgICBsZXQgaWNvbkVsZW1lbnQgPSB0aGlzLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgICAgIGljb25FbGVtZW50LmNsYXNzTmFtZSA9ICdwLWJ1dHRvbi1pY29uJztcbiAgICAgICAgICAgIGljb25FbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICAgICAgICAgICAgbGV0IGljb25Qb3NDbGFzcyA9IHRoaXMubGFiZWwgPyAncC1idXR0b24taWNvbi0nICsgdGhpcy5pY29uUG9zIDogbnVsbDtcblxuICAgICAgICAgICAgaWYgKGljb25Qb3NDbGFzcykge1xuICAgICAgICAgICAgICAgIERvbUhhbmRsZXIuYWRkQ2xhc3MoaWNvbkVsZW1lbnQsIGljb25Qb3NDbGFzcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBpY29uQ2xhc3MgPSB0aGlzLmdldEljb25DbGFzcygpO1xuXG4gICAgICAgICAgICBpZiAoaWNvbkNsYXNzKSB7XG4gICAgICAgICAgICAgICAgRG9tSGFuZGxlci5hZGRNdWx0aXBsZUNsYXNzZXMoaWNvbkVsZW1lbnQsIGljb25DbGFzcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuaHRtbEVsZW1lbnQuaW5zZXJ0QmVmb3JlKGljb25FbGVtZW50LCB0aGlzLmh0bWxFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlTGFiZWwoKSB7XG4gICAgICAgIGxldCBsYWJlbEVsZW1lbnQgPSBEb21IYW5kbGVyLmZpbmRTaW5nbGUodGhpcy5odG1sRWxlbWVudCwgJy5wLWJ1dHRvbi1sYWJlbCcpO1xuXG4gICAgICAgIGlmICghdGhpcy5sYWJlbCkge1xuICAgICAgICAgICAgbGFiZWxFbGVtZW50ICYmIHRoaXMuaHRtbEVsZW1lbnQucmVtb3ZlQ2hpbGQobGFiZWxFbGVtZW50KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxhYmVsRWxlbWVudCA/IChsYWJlbEVsZW1lbnQudGV4dENvbnRlbnQgPSB0aGlzLmxhYmVsKSA6IHRoaXMuY3JlYXRlTGFiZWwoKTtcbiAgICB9XG5cbiAgICB1cGRhdGVJY29uKCkge1xuICAgICAgICBsZXQgaWNvbkVsZW1lbnQgPSBEb21IYW5kbGVyLmZpbmRTaW5nbGUodGhpcy5odG1sRWxlbWVudCwgJy5wLWJ1dHRvbi1pY29uJyk7XG4gICAgICAgIGxldCBsYWJlbEVsZW1lbnQgPSBEb21IYW5kbGVyLmZpbmRTaW5nbGUodGhpcy5odG1sRWxlbWVudCwgJy5wLWJ1dHRvbi1sYWJlbCcpO1xuXG4gICAgICAgIGlmIChpY29uRWxlbWVudCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaWNvblBvcykge1xuICAgICAgICAgICAgICAgIGljb25FbGVtZW50LmNsYXNzTmFtZSA9ICdwLWJ1dHRvbi1pY29uICcgKyAobGFiZWxFbGVtZW50ID8gJ3AtYnV0dG9uLWljb24tJyArIHRoaXMuaWNvblBvcyA6ICcnKSArICcgJyArIHRoaXMuZ2V0SWNvbkNsYXNzKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGljb25FbGVtZW50LmNsYXNzTmFtZSA9ICdwLWJ1dHRvbi1pY29uICcgKyB0aGlzLmdldEljb25DbGFzcygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVJY29uKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRJY29uQ2xhc3MoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvYWRpbmcgPyAncC1idXR0b24tbG9hZGluZy1pY29uIHBpLXNwaW4gJyArICh0aGlzLmxvYWRpbmdJY29uID8/ICdwaSBwaS1zcGlubmVyJykgOiB0aGlzLmljb24gfHwgJ3AtaGlkZGVuJztcbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplZCA9IGZhbHNlO1xuICAgIH1cbn1cbi8qKlxuICogQnV0dG9uIGlzIGFuIGV4dGVuc2lvbiB0byBzdGFuZGFyZCBidXR0b24gZWxlbWVudCB3aXRoIGljb25zIGFuZCB0aGVtaW5nLlxuICogQGdyb3VwIENvbXBvbmVudHNcbiAqL1xuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdwLWJ1dHRvbicsXG4gICAgc3RhbmRhbG9uZTogdHJ1ZSxcbiAgICBpbXBvcnRzOiBbTmdJZiwgTmdUZW1wbGF0ZU91dGxldCwgTmdTdHlsZSwgTmdDbGFzcywgUmlwcGxlLCBBdXRvRm9jdXMsIFNwaW5uZXJJY29uXSxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICBbYXR0ci50eXBlXT1cInR5cGVcIlxuICAgICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJhcmlhTGFiZWxcIlxuICAgICAgICAgICAgW25nU3R5bGVdPVwic3R5bGVcIlxuICAgICAgICAgICAgW2Rpc2FibGVkXT1cImRpc2FibGVkIHx8IGxvYWRpbmdcIlxuICAgICAgICAgICAgW25nQ2xhc3NdPVwiYnV0dG9uQ2xhc3NcIlxuICAgICAgICAgICAgKGNsaWNrKT1cIm9uQ2xpY2suZW1pdCgkZXZlbnQpXCJcbiAgICAgICAgICAgIChmb2N1cyk9XCJvbkZvY3VzLmVtaXQoJGV2ZW50KVwiXG4gICAgICAgICAgICAoYmx1cik9XCJvbkJsdXIuZW1pdCgkZXZlbnQpXCJcbiAgICAgICAgICAgIHBSaXBwbGVcbiAgICAgICAgICAgIFthdHRyLmRhdGEtcGMtbmFtZV09XCInYnV0dG9uJ1wiXG4gICAgICAgICAgICBbYXR0ci5kYXRhLXBjLXNlY3Rpb25dPVwiJ3Jvb3QnXCJcbiAgICAgICAgICAgIFthdHRyLnRhYmluZGV4XT1cInRhYmluZGV4XCJcbiAgICAgICAgICAgIHBBdXRvRm9jdXNcbiAgICAgICAgICAgIFthdXRvZm9jdXNdPVwiYXV0b2ZvY3VzXCJcbiAgICAgICAgPlxuICAgICAgICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImNvbnRlbnRUZW1wbGF0ZVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImxvYWRpbmdcIj5cbiAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiIWxvYWRpbmdJY29uVGVtcGxhdGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gKm5nSWY9XCJsb2FkaW5nSWNvblwiIFtuZ0NsYXNzXT1cImljb25DbGFzcygpXCIgW2F0dHIuYXJpYS1oaWRkZW5dPVwidHJ1ZVwiIFthdHRyLmRhdGEtcGMtc2VjdGlvbl09XCInbG9hZGluZ2ljb24nXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8U3Bpbm5lckljb24gKm5nSWY9XCIhbG9hZGluZ0ljb25cIiBbc3R5bGVDbGFzc109XCJzcGlubmVySWNvbkNsYXNzKClcIiBbc3Bpbl09XCJ0cnVlXCIgW2F0dHIuYXJpYS1oaWRkZW5dPVwidHJ1ZVwiIFthdHRyLmRhdGEtcGMtc2VjdGlvbl09XCInbG9hZGluZ2ljb24nXCIgLz5cbiAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgW25nSWZdPVwibG9hZGluZ0ljb25UZW1wbGF0ZVwiICpuZ1RlbXBsYXRlT3V0bGV0PVwibG9hZGluZ0ljb25UZW1wbGF0ZTsgY29udGV4dDogeyBjbGFzczogaWNvbkNsYXNzKCkgfVwiPjwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCIhbG9hZGluZ1wiPlxuICAgICAgICAgICAgICAgIDxzcGFuICpuZ0lmPVwiaWNvbiAmJiAhaWNvblRlbXBsYXRlXCIgW25nQ2xhc3NdPVwiaWNvbkNsYXNzKClcIiBbYXR0ci5kYXRhLXBjLXNlY3Rpb25dPVwiJ2ljb24nXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSBbbmdJZl09XCIhaWNvbiAmJiBpY29uVGVtcGxhdGVcIiAqbmdUZW1wbGF0ZU91dGxldD1cImljb25UZW1wbGF0ZTsgY29udGV4dDogeyBjbGFzczogaWNvbkNsYXNzKCkgfVwiPjwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC1idXR0b24tbGFiZWxcIiBbYXR0ci5hcmlhLWhpZGRlbl09XCJpY29uICYmICFsYWJlbFwiICpuZ0lmPVwiIWNvbnRlbnRUZW1wbGF0ZSAmJiBsYWJlbFwiIFthdHRyLmRhdGEtcGMtc2VjdGlvbl09XCInbGFiZWwnXCI+e3sgbGFiZWwgfX08L3NwYW4+XG4gICAgICAgICAgICA8c3BhbiBbbmdDbGFzc109XCJiYWRnZVN0eWxlQ2xhc3MoKVwiIFtjbGFzc109XCJiYWRnZUNsYXNzXCIgKm5nSWY9XCIhY29udGVudFRlbXBsYXRlICYmIGJhZGdlXCIgW2F0dHIuZGF0YS1wYy1zZWN0aW9uXT1cIidiYWRnZSdcIj57eyBiYWRnZSB9fTwvc3Bhbj5cbiAgICAgICAgPC9idXR0b24+XG4gICAgYCxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgY2xhc3M6ICdwLWVsZW1lbnQnLFxuICAgICAgICAnW2NsYXNzLnAtZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyB8fCAnbG9hZGluZydcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIEJ1dHRvbiBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQge1xuICAgIC8qKlxuICAgICAqIFR5cGUgb2YgdGhlIGJ1dHRvbi5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSB0eXBlOiBzdHJpbmcgPSAnYnV0dG9uJztcbiAgICAvKipcbiAgICAgKiBQb3NpdGlvbiBvZiB0aGUgaWNvbi5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBpY29uUG9zOiBCdXR0b25JY29uUG9zaXRpb24gPSAnbGVmdCc7XG4gICAgLyoqXG4gICAgICogTmFtZSBvZiB0aGUgaWNvbi5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBpY29uOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogVmFsdWUgb2YgdGhlIGJhZGdlLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIGJhZGdlOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogVXNlcyB0byBwYXNzIGF0dHJpYnV0ZXMgdG8gdGhlIGxhYmVsJ3MgRE9NIGVsZW1lbnQuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgbGFiZWw6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBXaGVuIHByZXNlbnQsIGl0IHNwZWNpZmllcyB0aGF0IHRoZSBjb21wb25lbnQgc2hvdWxkIGJlIGRpc2FibGVkLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCh7IHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZSB9KSBkaXNhYmxlZDogYm9vbGVhbiB8IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHRoZSBidXR0b24gaXMgaW4gbG9hZGluZyBzdGF0ZS5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoeyB0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGUgfSkgbG9hZGluZzogYm9vbGVhbiA9IGZhbHNlO1xuICAgIC8qKlxuICAgICAqIEljb24gdG8gZGlzcGxheSBpbiBsb2FkaW5nIHN0YXRlLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIGxvYWRpbmdJY29uOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogQWRkIGEgc2hhZG93IHRvIGluZGljYXRlIGVsZXZhdGlvbi5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoeyB0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGUgfSkgcmFpc2VkOiBib29sZWFuID0gZmFsc2U7XG4gICAgLyoqXG4gICAgICogQWRkIGEgY2lyY3VsYXIgYm9yZGVyIHJhZGl1cyB0byB0aGUgYnV0dG9uLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCh7IHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZSB9KSByb3VuZGVkOiBib29sZWFuID0gZmFsc2U7XG4gICAgLyoqXG4gICAgICogQWRkIGEgdGV4dHVhbCBjbGFzcyB0byB0aGUgYnV0dG9uIHdpdGhvdXQgYSBiYWNrZ3JvdW5kIGluaXRpYWxseS5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoeyB0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGUgfSkgdGV4dDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIC8qKlxuICAgICAqIEFkZCBhIHBsYWluIHRleHR1YWwgY2xhc3MgdG8gdGhlIGJ1dHRvbiB3aXRob3V0IGEgYmFja2dyb3VuZCBpbml0aWFsbHkuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KHsgdHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlIH0pIHBsYWluOiBib29sZWFuID0gZmFsc2U7XG4gICAgLyoqXG4gICAgICogRGVmaW5lcyB0aGUgc3R5bGUgb2YgdGhlIGJ1dHRvbi5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBzZXZlcml0eTogJ3N1Y2Nlc3MnIHwgJ2luZm8nIHwgJ3dhcm5pbmcnIHwgJ2RhbmdlcicgfCAnaGVscCcgfCAncHJpbWFyeScgfCAnc2Vjb25kYXJ5JyB8ICdjb250cmFzdCcgfCBudWxsIHwgdW5kZWZpbmVkO1xuICAgIC8qKlxuICAgICAqIEFkZCBhIGJvcmRlciBjbGFzcyB3aXRob3V0IGEgYmFja2dyb3VuZCBpbml0aWFsbHkuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KHsgdHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlIH0pIG91dGxpbmVkOiBib29sZWFuID0gZmFsc2U7XG4gICAgLyoqXG4gICAgICogQWRkIGEgbGluayBzdHlsZSB0byB0aGUgYnV0dG9uLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCh7IHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZSB9KSBsaW5rOiBib29sZWFuID0gZmFsc2U7XG4gICAgLyoqXG4gICAgICogQWRkIGEgdGFiaW5kZXggdG8gdGhlIGJ1dHRvbi5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoeyB0cmFuc2Zvcm06IG51bWJlckF0dHJpYnV0ZSB9KSB0YWJpbmRleDogbnVtYmVyIHwgdW5kZWZpbmVkO1xuICAgIC8qKlxuICAgICAqIERlZmluZXMgdGhlIHNpemUgb2YgdGhlIGJ1dHRvbi5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBzaXplOiAnc21hbGwnIHwgJ2xhcmdlJyB8IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBJbmxpbmUgc3R5bGUgb2YgdGhlIGVsZW1lbnQuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgc3R5bGU6IHsgW2tsYXNzOiBzdHJpbmddOiBhbnkgfSB8IG51bGwgfCB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogQ2xhc3Mgb2YgdGhlIGVsZW1lbnQuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgc3R5bGVDbGFzczogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgIC8qKlxuICAgICAqIFN0eWxlIGNsYXNzIG9mIHRoZSBiYWRnZS5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBiYWRnZUNsYXNzOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogVXNlZCB0byBkZWZpbmUgYSBzdHJpbmcgdGhhdCBhdXRvY29tcGxldGUgYXR0cmlidXRlIHRoZSBjdXJyZW50IGVsZW1lbnQuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgYXJpYUxhYmVsOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogV2hlbiBwcmVzZW50LCBpdCBzcGVjaWZpZXMgdGhhdCB0aGUgY29tcG9uZW50IHNob3VsZCBhdXRvbWF0aWNhbGx5IGdldCBmb2N1cyBvbiBsb2FkLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCh7IHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZSB9KSBhdXRvZm9jdXM6IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogQ2FsbGJhY2sgdG8gZXhlY3V0ZSB3aGVuIGJ1dHRvbiBpcyBjbGlja2VkLlxuICAgICAqIFRoaXMgZXZlbnQgaXMgaW50ZW5kZWQgdG8gYmUgdXNlZCB3aXRoIHRoZSA8cC1idXR0b24+IGNvbXBvbmVudC4gVXNpbmcgYSByZWd1bGFyIDxidXR0b24+IGVsZW1lbnQsIHVzZSAoY2xpY2spLlxuICAgICAqIEBwYXJhbSB7TW91c2VFdmVudH0gZXZlbnQgLSBNb3VzZSBldmVudC5cbiAgICAgKiBAZ3JvdXAgRW1pdHNcbiAgICAgKi9cbiAgICBAT3V0cHV0KCkgb25DbGljazogRXZlbnRFbWl0dGVyPE1vdXNlRXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgIC8qKlxuICAgICAqIENhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiBidXR0b24gaXMgZm9jdXNlZC5cbiAgICAgKiBUaGlzIGV2ZW50IGlzIGludGVuZGVkIHRvIGJlIHVzZWQgd2l0aCB0aGUgPHAtYnV0dG9uPiBjb21wb25lbnQuIFVzaW5nIGEgcmVndWxhciA8YnV0dG9uPiBlbGVtZW50LCB1c2UgKGZvY3VzKS5cbiAgICAgKiBAcGFyYW0ge0ZvY3VzRXZlbnR9IGV2ZW50IC0gRm9jdXMgZXZlbnQuXG4gICAgICogQGdyb3VwIEVtaXRzXG4gICAgICovXG4gICAgQE91dHB1dCgpIG9uRm9jdXM6IEV2ZW50RW1pdHRlcjxGb2N1c0V2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8Rm9jdXNFdmVudD4oKTtcbiAgICAvKipcbiAgICAgKiBDYWxsYmFjayB0byBleGVjdXRlIHdoZW4gYnV0dG9uIGxvc2VzIGZvY3VzLlxuICAgICAqIFRoaXMgZXZlbnQgaXMgaW50ZW5kZWQgdG8gYmUgdXNlZCB3aXRoIHRoZSA8cC1idXR0b24+IGNvbXBvbmVudC4gVXNpbmcgYSByZWd1bGFyIDxidXR0b24+IGVsZW1lbnQsIHVzZSAoYmx1cikuXG4gICAgICogQHBhcmFtIHtGb2N1c0V2ZW50fSBldmVudCAtIEZvY3VzIGV2ZW50LlxuICAgICAqIEBncm91cCBFbWl0c1xuICAgICAqL1xuICAgIEBPdXRwdXQoKSBvbkJsdXI6IEV2ZW50RW1pdHRlcjxGb2N1c0V2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8Rm9jdXNFdmVudD4oKTtcblxuICAgIGNvbnRlbnRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PiB8IHVuZGVmaW5lZDtcblxuICAgIGxvYWRpbmdJY29uVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT4gfCB1bmRlZmluZWQ7XG5cbiAgICBpY29uVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT4gfCB1bmRlZmluZWQ7XG5cbiAgICBAQ29udGVudENoaWxkcmVuKFByaW1lVGVtcGxhdGUpIHRlbXBsYXRlczogUXVlcnlMaXN0PFByaW1lVGVtcGxhdGU+IHwgdW5kZWZpbmVkO1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIGVsOiBFbGVtZW50UmVmKSB7fVxuXG4gICAgc3Bpbm5lckljb25DbGFzcygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmVudHJpZXModGhpcy5pY29uQ2xhc3MoKSlcbiAgICAgICAgICAgIC5maWx0ZXIoKFssIHZhbHVlXSkgPT4gISF2YWx1ZSlcbiAgICAgICAgICAgIC5yZWR1Y2UoKGFjYywgW2tleV0pID0+IGFjYyArIGAgJHtrZXl9YCwgJ3AtYnV0dG9uLWxvYWRpbmctaWNvbicpO1xuICAgIH1cblxuICAgIGljb25DbGFzcygpIHtcbiAgICAgICAgY29uc3QgaWNvbkNsYXNzZXMgPSB7XG4gICAgICAgICAgICAncC1idXR0b24taWNvbic6IHRydWUsXG4gICAgICAgICAgICAncC1idXR0b24taWNvbi1sZWZ0JzogdGhpcy5pY29uUG9zID09PSAnbGVmdCcgJiYgdGhpcy5sYWJlbCxcbiAgICAgICAgICAgICdwLWJ1dHRvbi1pY29uLXJpZ2h0JzogdGhpcy5pY29uUG9zID09PSAncmlnaHQnICYmIHRoaXMubGFiZWwsXG4gICAgICAgICAgICAncC1idXR0b24taWNvbi10b3AnOiB0aGlzLmljb25Qb3MgPT09ICd0b3AnICYmIHRoaXMubGFiZWwsXG4gICAgICAgICAgICAncC1idXR0b24taWNvbi1ib3R0b20nOiB0aGlzLmljb25Qb3MgPT09ICdib3R0b20nICYmIHRoaXMubGFiZWxcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAodGhpcy5sb2FkaW5nKSB7XG4gICAgICAgICAgICBpY29uQ2xhc3Nlc1tgcC1idXR0b24tbG9hZGluZy1pY29uIHBpLXNwaW4gJHt0aGlzLmxvYWRpbmdJY29uID8/ICcnfWBdID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmljb24pIHtcbiAgICAgICAgICAgIGljb25DbGFzc2VzW3RoaXMuaWNvbl0gPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGljb25DbGFzc2VzO1xuICAgIH1cblxuICAgIGdldCBidXR0b25DbGFzcygpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICdwLWJ1dHRvbiBwLWNvbXBvbmVudCc6IHRydWUsXG4gICAgICAgICAgICAncC1idXR0b24taWNvbi1vbmx5JzogKHRoaXMuaWNvbiB8fCB0aGlzLmljb25UZW1wbGF0ZSB8fCB0aGlzLmxvYWRpbmdJY29uIHx8IHRoaXMubG9hZGluZ0ljb25UZW1wbGF0ZSkgJiYgIXRoaXMubGFiZWwsXG4gICAgICAgICAgICAncC1idXR0b24tdmVydGljYWwnOiAodGhpcy5pY29uUG9zID09PSAndG9wJyB8fCB0aGlzLmljb25Qb3MgPT09ICdib3R0b20nKSAmJiB0aGlzLmxhYmVsLFxuICAgICAgICAgICAgJ3AtYnV0dG9uLWxvYWRpbmcnOiB0aGlzLmxvYWRpbmcsXG4gICAgICAgICAgICAncC1idXR0b24tbG9hZGluZy1sYWJlbC1vbmx5JzogdGhpcy5sb2FkaW5nICYmICF0aGlzLmljb24gJiYgdGhpcy5sYWJlbCAmJiAhdGhpcy5sb2FkaW5nSWNvbiAmJiB0aGlzLmljb25Qb3MgPT09ICdsZWZ0JyxcbiAgICAgICAgICAgICdwLWJ1dHRvbi1saW5rJzogdGhpcy5saW5rLFxuICAgICAgICAgICAgW2BwLWJ1dHRvbi0ke3RoaXMuc2V2ZXJpdHl9YF06IHRoaXMuc2V2ZXJpdHksXG4gICAgICAgICAgICAncC1idXR0b24tcmFpc2VkJzogdGhpcy5yYWlzZWQsXG4gICAgICAgICAgICAncC1idXR0b24tcm91bmRlZCc6IHRoaXMucm91bmRlZCxcbiAgICAgICAgICAgICdwLWJ1dHRvbi10ZXh0JzogdGhpcy50ZXh0LFxuICAgICAgICAgICAgJ3AtYnV0dG9uLW91dGxpbmVkJzogdGhpcy5vdXRsaW5lZCxcbiAgICAgICAgICAgICdwLWJ1dHRvbi1zbSc6IHRoaXMuc2l6ZSA9PT0gJ3NtYWxsJyxcbiAgICAgICAgICAgICdwLWJ1dHRvbi1sZyc6IHRoaXMuc2l6ZSA9PT0gJ2xhcmdlJyxcbiAgICAgICAgICAgICdwLWJ1dHRvbi1wbGFpbic6IHRoaXMucGxhaW4sXG4gICAgICAgICAgICBbYCR7dGhpcy5zdHlsZUNsYXNzfWBdOiB0aGlzLnN0eWxlQ2xhc3NcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgICAgIHRoaXMudGVtcGxhdGVzPy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2ggKGl0ZW0uZ2V0VHlwZSgpKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnY29udGVudCc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudFRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdpY29uJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pY29uVGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2xvYWRpbmdpY29uJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkaW5nSWNvblRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnRUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBiYWRnZVN0eWxlQ2xhc3MoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAncC1iYWRnZSBwLWNvbXBvbmVudCc6IHRydWUsXG4gICAgICAgICAgICAncC1iYWRnZS1uby1ndXR0ZXInOiB0aGlzLmJhZGdlICYmIFN0cmluZyh0aGlzLmJhZGdlKS5sZW5ndGggPT09IDFcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBcHBsaWVzIGZvY3VzLlxuICAgICAqIEBncm91cCBNZXRob2RcbiAgICAgKi9cbiAgICBwdWJsaWMgZm9jdXMoKSB7XG4gICAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5maXJzdENoaWxkLmZvY3VzKCk7XG4gICAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtCdXR0b25EaXJlY3RpdmUsIEJ1dHRvbl0sXG4gICAgZXhwb3J0czogW0J1dHRvbkRpcmVjdGl2ZSwgQnV0dG9uLCBTaGFyZWRNb2R1bGVdXG59KVxuZXhwb3J0IGNsYXNzIEJ1dHRvbk1vZHVsZSB7fVxuIl19