import { animate, animation, style, transition, trigger, useAnimation } from '@angular/animations';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, NgModule, Optional, PLATFORM_ID, SkipSelf, ViewChild, ViewEncapsulation } from '@angular/core';
import { SharedModule, TranslationKeys } from 'primeng/api';
import { DomHandler } from 'primeng/dom';
import { FocusTrapModule } from 'primeng/focustrap';
import { TimesIcon } from 'primeng/icons/times';
import { WindowMaximizeIcon } from 'primeng/icons/windowmaximize';
import { WindowMinimizeIcon } from 'primeng/icons/windowminimize';
import { UniqueComponentId, ZIndexUtils } from 'primeng/utils';
import { DynamicDialogContent } from './dynamicdialogcontent';
import * as i0 from "@angular/core";
import * as i1 from "./dynamicdialog-config";
import * as i2 from "./dynamicdialog-ref";
import * as i3 from "primeng/api";
import * as i4 from "@angular/common";
import * as i5 from "primeng/focustrap";
const showAnimation = animation([style({ transform: '{{transform}}', opacity: 0 }), animate('{{transition}}', style({ transform: 'none', opacity: 1 }))]);
const hideAnimation = animation([animate('{{transition}}', style({ transform: '{{transform}}', opacity: 0 }))]);
export class DynamicDialogComponent {
    document;
    platformId;
    cd;
    renderer;
    config;
    dialogRef;
    zone;
    primeNGConfig;
    parentDialog;
    visible = true;
    componentRef;
    mask;
    resizing;
    dragging;
    maximized;
    _style = {};
    originalStyle;
    lastPageX;
    lastPageY;
    ariaLabelledBy;
    id = UniqueComponentId();
    styleElement;
    insertionPoint;
    maskViewChild;
    contentViewChild;
    footerViewChild;
    headerViewChild;
    childComponentType;
    container;
    wrapper;
    documentKeydownListener;
    documentEscapeListener;
    maskClickListener;
    transformOptions = 'scale(0.7)';
    documentResizeListener;
    documentResizeEndListener;
    documentDragListener;
    documentDragEndListener;
    get minX() {
        return this.config.minX ? this.config.minX : 0;
    }
    get minY() {
        return this.config.minY ? this.config.minY : 0;
    }
    get keepInViewport() {
        return this.config.keepInViewport;
    }
    get maximizable() {
        return this.config.maximizable;
    }
    get maximizeIcon() {
        return this.config.maximizeIcon;
    }
    get minimizeIcon() {
        return this.config.minimizeIcon;
    }
    get style() {
        return this._style;
    }
    get position() {
        return this.config.position;
    }
    get closeAriaLabel() {
        return this.primeNGConfig.getTranslation(TranslationKeys.ARIA)['close'];
    }
    set style(value) {
        if (value) {
            this._style = { ...value };
            this.originalStyle = value;
        }
    }
    get parent() {
        const domElements = Array.from(this.document.getElementsByClassName('p-dialog'));
        if (domElements.length > 1) {
            return domElements.pop();
        }
    }
    get parentContent() {
        const domElements = Array.from(this.document.getElementsByClassName('p-dialog'));
        if (domElements.length > 0) {
            const contentElements = domElements[domElements.length - 1].querySelector('.p-dialog-content');
            if (contentElements)
                return Array.isArray(contentElements) ? contentElements[0] : contentElements;
        }
    }
    get header() {
        return this.config.header;
    }
    get data() {
        return this.config.data;
    }
    get breakpoints() {
        return this.config.breakpoints;
    }
    get footerTemplate() {
        return this.config?.templates?.footer;
    }
    get headerTemplate() {
        return this.config?.templates?.header;
    }
    get contentTemplate() {
        return this.config?.templates?.content;
    }
    get minimizeIconTemplate() {
        return this.config?.templates?.minimizeicon;
    }
    get maximizeIconTemplate() {
        return this.config?.templates?.maximizeicon;
    }
    get closeIconTemplate() {
        return this.config?.templates?.closeicon;
    }
    get dynamicDialogCount() {
        const dynamicDialogs = this.document.querySelectorAll('p-dynamicdialog');
        const dynamicDialogCount = dynamicDialogs?.length;
        return dynamicDialogCount;
    }
    get containerStyle() {
        return {
            ...this.config.style,
            width: this.config.width,
            height: this.config.height
        };
    }
    constructor(document, platformId, cd, renderer, config, dialogRef, zone, primeNGConfig, parentDialog) {
        this.document = document;
        this.platformId = platformId;
        this.cd = cd;
        this.renderer = renderer;
        this.config = config;
        this.dialogRef = dialogRef;
        this.zone = zone;
        this.primeNGConfig = primeNGConfig;
        this.parentDialog = parentDialog;
    }
    ngOnInit() {
        if (this.breakpoints) {
            this.createStyle();
        }
    }
    createStyle() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.styleElement) {
                this.styleElement = this.renderer.createElement('style');
                this.styleElement.type = 'text/css';
                DomHandler.setAttribute(this.styleElement, 'nonce', this.primeNGConfig?.csp()?.nonce);
                this.renderer.appendChild(this.document.head, this.styleElement);
                let innerHTML = '';
                for (let breakpoint in this.breakpoints) {
                    innerHTML += `
                        @media screen and (max-width: ${breakpoint}) {
                            .p-dialog[${this.id}]:not(.p-dialog-maximized) {
                                width: ${this.breakpoints[breakpoint]} !important;
                            }
                        }
                    `;
                }
                this.renderer.setProperty(this.styleElement, 'innerHTML', innerHTML);
            }
        }
    }
    destroyStyle() {
        if (this.styleElement) {
            this.renderer.removeChild(this.document.head, this.styleElement);
            this.styleElement = null;
        }
    }
    ngAfterViewInit() {
        this.loadChildComponent(this.childComponentType);
        this.ariaLabelledBy = this.getAriaLabelledBy();
        this.cd.detectChanges();
    }
    getAriaLabelledBy() {
        return this.header !== null ? UniqueComponentId() + '_header' : null;
    }
    loadChildComponent(componentType) {
        let viewContainerRef = this.insertionPoint?.viewContainerRef;
        viewContainerRef?.clear();
        this.componentRef = viewContainerRef?.createComponent(componentType);
        this.dialogRef.onChildComponentLoaded.next(this.componentRef.instance);
    }
    moveOnTop() {
        if (this.config.autoZIndex !== false) {
            ZIndexUtils.set('modal', this.container, (this.config.baseZIndex || 0) + this.primeNGConfig.zIndex.modal);
            this.wrapper.style.zIndex = String(parseInt(this.container.style.zIndex, 10) - 1);
        }
    }
    onAnimationStart(event) {
        switch (event.toState) {
            case 'visible':
                this.container = event.element;
                this.wrapper = this.container.parentElement;
                this.moveOnTop();
                if (this.parent) {
                    this.unbindGlobalListeners();
                }
                this.bindGlobalListeners();
                this.container?.setAttribute(this.id, '');
                if (this.config.modal !== false) {
                    this.enableModality();
                }
                if (this.config.focusOnShow !== false) {
                    this.focus();
                }
                break;
            case 'void':
                if (this.wrapper && this.config.modal !== false) {
                    DomHandler.addClass(this.wrapper, 'p-component-overlay-leave');
                }
                break;
        }
    }
    onAnimationEnd(event) {
        if (event.toState === 'void') {
            if (this.parentContent && this.config.focusOnClose !== false) {
                this.focus(this.parentContent);
            }
            this.onContainerDestroy();
            this.dialogRef.destroy();
        }
    }
    onContainerDestroy() {
        this.unbindGlobalListeners();
        if (this.container && this.config.autoZIndex !== false) {
            ZIndexUtils.clear(this.container);
        }
        if (this.config.modal !== false) {
            this.disableModality();
        }
        this.container = null;
    }
    close() {
        this.visible = false;
        this.cd.markForCheck();
    }
    hide() {
        if (this.dialogRef) {
            this.dialogRef.close();
        }
    }
    enableModality() {
        if (this.config.dismissableMask) {
            this.maskClickListener = this.renderer.listen(this.wrapper, 'mousedown', (event) => {
                if (this.wrapper && this.wrapper.isSameNode(event.target)) {
                    this.hide();
                }
            });
        }
        if (this.dynamicDialogCount === 1) {
            DomHandler.addClass(this.document.body, 'p-overflow-hidden');
        }
    }
    disableModality() {
        if (this.wrapper) {
            if (this.config.dismissableMask) {
                this.unbindMaskClickListener();
            }
            if (this.dynamicDialogCount === 1) {
                DomHandler.removeClass(this.document.body, 'p-overflow-hidden');
            }
            if (!this.cd.destroyed) {
                this.cd.detectChanges();
            }
        }
    }
    focus(focusParentElement = this.contentViewChild.nativeElement) {
        const focusableElements = DomHandler.getFocusableElements(focusParentElement);
        if (!focusableElements.length) {
            return;
        }
        let focusable = DomHandler.getFocusableElement(focusParentElement, '[autofocus]');
        if (focusable) {
            this.zone.runOutsideAngular(() => {
                setTimeout(() => focusable.focus(), 5);
            });
            return;
        }
        const focusableElement = DomHandler.getFocusableElement(focusParentElement);
        if (focusableElement) {
            this.zone.runOutsideAngular(() => {
                setTimeout(() => focusableElement.focus(), 5);
            });
        }
        else if (this.footerViewChild) {
            // If the content section is empty try to focus on footer
            this.focus(this.footerViewChild.nativeElement);
        }
        else if (!focusableElement && this.headerViewChild) {
            this.focus(this.headerViewChild.nativeElement);
        }
    }
    maximize() {
        this.maximized = !this.maximized;
        if (this.maximized) {
            DomHandler.addClass(this.document.body, 'p-overflow-hidden');
        }
        else {
            DomHandler.removeClass(this.document.body, 'p-overflow-hidden');
        }
        this.dialogRef.maximize({ maximized: this.maximized });
    }
    initResize(event) {
        if (this.config.resizable) {
            if (!this.documentResizeListener) {
                this.bindDocumentResizeListeners();
            }
            this.resizing = true;
            this.lastPageX = event.pageX;
            this.lastPageY = event.pageY;
            DomHandler.addClass(this.document.body, 'p-unselectable-text');
            this.dialogRef.resizeInit(event);
        }
    }
    onResize(event) {
        if (this.resizing) {
            let deltaX = event.pageX - this.lastPageX;
            let deltaY = event.pageY - this.lastPageY;
            let containerWidth = DomHandler.getOuterWidth(this.container);
            let containerHeight = DomHandler.getOuterHeight(this.container);
            let contentHeight = DomHandler.getOuterHeight(this.contentViewChild.nativeElement);
            let newWidth = containerWidth + deltaX;
            let newHeight = containerHeight + deltaY;
            let minWidth = this.container.style.minWidth;
            let minHeight = this.container.style.minHeight;
            let offset = this.container.getBoundingClientRect();
            let viewport = DomHandler.getViewport();
            let hasBeenDragged = !parseInt(this.container.style.top) || !parseInt(this.container.style.left);
            if (hasBeenDragged) {
                newWidth += deltaX;
                newHeight += deltaY;
            }
            if ((!minWidth || newWidth > parseInt(minWidth)) && offset.left + newWidth < viewport.width) {
                this._style.width = newWidth + 'px';
                this.container.style.width = this._style.width;
            }
            if ((!minHeight || newHeight > parseInt(minHeight)) && offset.top + newHeight < viewport.height) {
                this.contentViewChild.nativeElement.style.height = contentHeight + newHeight - containerHeight + 'px';
                if (this._style.height) {
                    this._style.height = newHeight + 'px';
                    this.container.style.height = this._style.height;
                }
            }
            this.lastPageX = event.pageX;
            this.lastPageY = event.pageY;
        }
    }
    resizeEnd(event) {
        if (this.resizing) {
            this.resizing = false;
            DomHandler.removeClass(this.document.body, 'p-unselectable-text');
            this.dialogRef.resizeEnd(event);
        }
    }
    initDrag(event) {
        if (DomHandler.hasClass(event.target, 'p-dialog-header-icon') || DomHandler.hasClass(event.target.parentElement, 'p-dialog-header-icon')) {
            return;
        }
        if (this.config.draggable) {
            this.dragging = true;
            this.lastPageX = event.pageX;
            this.lastPageY = event.pageY;
            this.container.style.margin = '0';
            DomHandler.addClass(this.document.body, 'p-unselectable-text');
            this.dialogRef.dragStart(event);
        }
    }
    onDrag(event) {
        if (this.dragging) {
            let containerWidth = DomHandler.getOuterWidth(this.container);
            let containerHeight = DomHandler.getOuterHeight(this.container);
            let deltaX = event.pageX - this.lastPageX;
            let deltaY = event.pageY - this.lastPageY;
            let offset = this.container.getBoundingClientRect();
            let leftPos = offset.left + deltaX;
            let topPos = offset.top + deltaY;
            let viewport = DomHandler.getViewport();
            this.container.style.position = 'fixed';
            if (this.keepInViewport) {
                if (leftPos >= this.minX && leftPos + containerWidth < viewport.width) {
                    this._style.left = leftPos + 'px';
                    this.lastPageX = event.pageX;
                    this.container.style.left = leftPos + 'px';
                }
                if (topPos >= this.minY && topPos + containerHeight < viewport.height) {
                    this._style.top = topPos + 'px';
                    this.lastPageY = event.pageY;
                    this.container.style.top = topPos + 'px';
                }
            }
            else {
                this.lastPageX = event.pageX;
                this.container.style.left = leftPos + 'px';
                this.lastPageY = event.pageY;
                this.container.style.top = topPos + 'px';
            }
        }
    }
    endDrag(event) {
        if (this.dragging) {
            this.dragging = false;
            DomHandler.removeClass(this.document.body, 'p-unselectable-text');
            this.dialogRef.dragEnd(event);
            this.cd.detectChanges();
        }
    }
    resetPosition() {
        this.container.style.position = '';
        this.container.style.left = '';
        this.container.style.top = '';
        this.container.style.margin = '';
    }
    bindDocumentDragListener() {
        if (isPlatformBrowser(this.platformId)) {
            this.zone.runOutsideAngular(() => {
                this.documentDragListener = this.renderer.listen(this.document, 'mousemove', this.onDrag.bind(this));
            });
        }
    }
    bindDocumentDragEndListener() {
        if (isPlatformBrowser(this.platformId)) {
            this.zone.runOutsideAngular(() => {
                this.documentDragEndListener = this.renderer.listen(this.document, 'mouseup', this.endDrag.bind(this));
            });
        }
    }
    unbindDocumentDragEndListener() {
        if (this.documentDragEndListener) {
            this.documentDragEndListener();
            this.documentDragListener = null;
        }
    }
    unbindDocumentDragListener() {
        if (this.documentDragListener) {
            this.documentDragListener();
            this.documentDragListener = null;
        }
    }
    bindDocumentResizeListeners() {
        if (isPlatformBrowser(this.platformId)) {
            this.zone.runOutsideAngular(() => {
                this.documentResizeListener = this.renderer.listen(this.document, 'mousemove', this.onResize.bind(this));
                this.documentResizeEndListener = this.renderer.listen(this.document, 'mouseup', this.resizeEnd.bind(this));
            });
        }
    }
    unbindDocumentResizeListeners() {
        if (this.documentResizeListener && this.documentResizeEndListener) {
            this.documentResizeListener();
            this.documentResizeEndListener();
            this.documentResizeListener = null;
            this.documentResizeEndListener = null;
        }
    }
    bindGlobalListeners() {
        if (this.config.closeOnEscape !== false) {
            this.bindDocumentEscapeListener();
        }
        if (this.config.resizable) {
            this.bindDocumentResizeListeners();
        }
        if (this.config.draggable) {
            this.bindDocumentDragListener();
            this.bindDocumentDragEndListener();
        }
    }
    unbindGlobalListeners() {
        this.unbindDocumentEscapeListener();
        this.unbindDocumentResizeListeners();
        this.unbindDocumentDragListener();
        this.unbindDocumentDragEndListener();
    }
    bindDocumentEscapeListener() {
        const documentTarget = this.maskViewChild ? this.maskViewChild.nativeElement.ownerDocument : 'document';
        this.documentEscapeListener = this.renderer.listen(documentTarget, 'keydown', (event) => {
            if (event.which == 27) {
                if (parseInt(this.container.style.zIndex) == ZIndexUtils.getCurrent()) {
                    this.hide();
                }
            }
        });
    }
    unbindDocumentEscapeListener() {
        if (this.documentEscapeListener) {
            this.documentEscapeListener();
            this.documentEscapeListener = null;
        }
    }
    unbindMaskClickListener() {
        if (this.maskClickListener) {
            this.maskClickListener();
            this.maskClickListener = null;
        }
    }
    ngOnDestroy() {
        this.onContainerDestroy();
        if (this.componentRef) {
            this.componentRef.destroy();
        }
        this.destroyStyle();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: DynamicDialogComponent, deps: [{ token: DOCUMENT }, { token: PLATFORM_ID }, { token: i0.ChangeDetectorRef }, { token: i0.Renderer2 }, { token: i1.DynamicDialogConfig }, { token: i2.DynamicDialogRef }, { token: i0.NgZone }, { token: i3.PrimeNGConfig }, { token: DynamicDialogComponent, optional: true, skipSelf: true }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.0.1", type: DynamicDialogComponent, selector: "p-dynamicDialog", host: { classAttribute: "p-element" }, viewQueries: [{ propertyName: "insertionPoint", first: true, predicate: DynamicDialogContent, descendants: true }, { propertyName: "maskViewChild", first: true, predicate: ["mask"], descendants: true }, { propertyName: "contentViewChild", first: true, predicate: ["content"], descendants: true }, { propertyName: "footerViewChild", first: true, predicate: ["footer"], descendants: true }, { propertyName: "headerViewChild", first: true, predicate: ["titlebar"], descendants: true }], ngImport: i0, template: `
        <div
            #mask
            [ngClass]="{
                'p-dialog-mask': true,
                'p-component-overlay p-component-overlay-enter p-dialog-mask-scrollblocker': config.modal !== false,
                'p-dialog-left': position === 'left',
                'p-dialog-right': position === 'right',
                'p-dialog-top': position === 'top',
                'p-dialog-bottom': position === 'bottom',
                'p-dialog-top-left': position === 'topleft' || position === 'top-left',
                'p-dialog-top-right': position === 'topright' || position === 'top-right',
                'p-dialog-bottom-left': position === 'bottomleft' || position === 'bottom-left',
                'p-dialog-bottom-right': position === 'bottomright' || position === 'bottom-right'
            }"
            [class]="config.maskStyleClass"
        >
            <div
                #container
                [ngClass]="{ 'p-dialog p-dynamic-dialog p-component': true, 'p-dialog-rtl': config.rtl, 'p-dialog-resizable': config.resizable, 'p-dialog-draggable': config.draggable, 'p-dialog-maximized': maximized }"
                [ngStyle]="containerStyle"
                [class]="config.styleClass"
                [@animation]="{ value: 'visible', params: { transform: transformOptions, transition: config.transitionOptions || '150ms cubic-bezier(0, 0, 0.2, 1)' } }"
                (@animation.start)="onAnimationStart($event)"
                (@animation.done)="onAnimationEnd($event)"
                role="dialog"
                *ngIf="visible"
                pFocusTrap
                [pFocusTrapDisabled]="config.focusTrap === false"
                [attr.aria-labelledby]="ariaLabelledBy"
                [attr.aria-modal]="true"
            >
                <div *ngIf="config.resizable" class="p-resizable-handle" (mousedown)="initResize($event)"></div>
                <div #titlebar class="p-dialog-header" (mousedown)="initDrag($event)" *ngIf="config.showHeader === false ? false : true">
                    <ng-container *ngComponentOutlet="headerTemplate"></ng-container>
                    <ng-container *ngIf="!headerTemplate">
                        <span class="p-dialog-title" [id]="ariaLabelledBy">{{ config.header }}</span>
                        <div class="p-dialog-header-icons">
                            <button *ngIf="config.maximizable" type="button" [ngClass]="{ 'p-dialog-header-icon p-dialog-header-maximize p-link': true }" (click)="maximize()" (keydown.enter)="maximize()" tabindex="-1" pRipple>
                                <span class="p-dialog-header-maximize-icon" *ngIf="!maximizeIconTemplate || !minimizeIconTemplate" [ngClass]="maximized ? minimizeIcon : maximizeIcon"></span>
                                <WindowMaximizeIcon *ngIf="!maximized && !maximizeIcon && !maximizeIconTemplate" [styleClass]="'p-dialog-header-maximize-icon'" />
                                <WindowMinimizeIcon *ngIf="maximized && !minimizeIcon && !minimizeIconTemplate" [styleClass]="'p-dialog-header-maximize-icon'" />
                                <ng-container *ngComponentOutlet="maximizeIconTemplate"></ng-container>
                                <ng-container *ngComponentOutlet="minimizeIconTemplate"></ng-container>
                            </button>
                            <button [ngClass]="'p-dialog-header-icon p-dialog-header-maximize p-link'" type="button" role="button" (click)="hide()" (keydown.enter)="hide()" *ngIf="config.closable !== false" [attr.aria-label]="closeAriaLabel">
                                <TimesIcon [styleClass]="'p-dialog-header-close-icon'" *ngIf="!closeIconTemplate" />
                                <ng-container *ngComponentOutlet="closeIconTemplate"></ng-container>
                            </button>
                        </div>
                    </ng-container>
                </div>
                <div #content class="p-dialog-content" [ngStyle]="config.contentStyle">
                    <ng-template pDynamicDialogContent *ngIf="!contentTemplate"></ng-template>
                    <ng-container *ngComponentOutlet="contentTemplate"></ng-container>
                </div>
                <div #footer class="p-dialog-footer" *ngIf="config.footer || footerTemplate">
                    <ng-container *ngIf="!footerTemplate">
                        {{ config.footer }}
                    </ng-container>
                    <ng-container *ngComponentOutlet="footerTemplate"></ng-container>
                </div>
            </div>
        </div>
    `, isInline: true, styles: ["@layer primeng{.p-dialog-mask{position:fixed;top:0;left:0;width:100%;height:100%;display:flex;justify-content:center;align-items:center;pointer-events:none}.p-dialog-mask.p-component-overlay{pointer-events:auto}.p-dialog{display:flex;flex-direction:column;pointer-events:auto;max-height:90%;transform:scale(1);position:relative}.p-dialog-content{overflow-y:auto;flex-grow:1}.p-dialog-header{display:flex;align-items:center;justify-content:space-between;flex-shrink:0}.p-dialog-draggable .p-dialog-header{cursor:move}.p-dialog-footer{flex-shrink:0}.p-dialog .p-dialog-header-icons{display:flex;align-items:center}.p-dialog .p-dialog-header-icon{display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative}.p-fluid .p-dialog-footer .p-button{width:auto}.p-dialog-top .p-dialog,.p-dialog-bottom .p-dialog,.p-dialog-left .p-dialog,.p-dialog-right .p-dialog,.p-dialog-top-left .p-dialog,.p-dialog-top-right .p-dialog,.p-dialog-bottom-left .p-dialog,.p-dialog-bottom-right .p-dialog{margin:.75rem;transform:translateZ(0)}.p-dialog-maximized{-webkit-transition:none;transition:none;transform:none;width:100vw!important;height:100vh!important;top:0!important;left:0!important;max-height:100%;height:100%}.p-dialog-maximized .p-dialog-content{flex-grow:1}.p-dialog-left{justify-content:flex-start}.p-dialog-right{justify-content:flex-end}.p-dialog-top{align-items:flex-start}.p-dialog-top-left{justify-content:flex-start;align-items:flex-start}.p-dialog-top-right{justify-content:flex-end;align-items:flex-start}.p-dialog-bottom{align-items:flex-end}.p-dialog-bottom-left{justify-content:flex-start;align-items:flex-end}.p-dialog-bottom-right{justify-content:flex-end;align-items:flex-end}.p-dialog .p-resizable-handle{position:absolute;font-size:.1px;display:block;cursor:se-resize;width:12px;height:12px;right:1px;bottom:1px}.p-confirm-dialog .p-dialog-content{display:flex;align-items:center}}\n"], dependencies: [{ kind: "directive", type: i0.forwardRef(() => i4.NgClass), selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i0.forwardRef(() => i4.NgComponentOutlet), selector: "[ngComponentOutlet]", inputs: ["ngComponentOutlet", "ngComponentOutletInputs", "ngComponentOutletInjector", "ngComponentOutletContent", "ngComponentOutletNgModule", "ngComponentOutletNgModuleFactory"] }, { kind: "directive", type: i0.forwardRef(() => i4.NgIf), selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i0.forwardRef(() => i4.NgStyle), selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "component", type: i0.forwardRef(() => WindowMaximizeIcon), selector: "WindowMaximizeIcon" }, { kind: "component", type: i0.forwardRef(() => WindowMinimizeIcon), selector: "WindowMinimizeIcon" }, { kind: "component", type: i0.forwardRef(() => TimesIcon), selector: "TimesIcon" }, { kind: "directive", type: i0.forwardRef(() => i5.FocusTrap), selector: "[pFocusTrap]", inputs: ["pFocusTrapDisabled"] }, { kind: "directive", type: i0.forwardRef(() => DynamicDialogContent), selector: "[pDynamicDialogContent]" }], animations: [trigger('animation', [transition('void => visible', [useAnimation(showAnimation)]), transition('visible => void', [useAnimation(hideAnimation)])])], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: DynamicDialogComponent, decorators: [{
            type: Component,
            args: [{ selector: 'p-dynamicDialog', template: `
        <div
            #mask
            [ngClass]="{
                'p-dialog-mask': true,
                'p-component-overlay p-component-overlay-enter p-dialog-mask-scrollblocker': config.modal !== false,
                'p-dialog-left': position === 'left',
                'p-dialog-right': position === 'right',
                'p-dialog-top': position === 'top',
                'p-dialog-bottom': position === 'bottom',
                'p-dialog-top-left': position === 'topleft' || position === 'top-left',
                'p-dialog-top-right': position === 'topright' || position === 'top-right',
                'p-dialog-bottom-left': position === 'bottomleft' || position === 'bottom-left',
                'p-dialog-bottom-right': position === 'bottomright' || position === 'bottom-right'
            }"
            [class]="config.maskStyleClass"
        >
            <div
                #container
                [ngClass]="{ 'p-dialog p-dynamic-dialog p-component': true, 'p-dialog-rtl': config.rtl, 'p-dialog-resizable': config.resizable, 'p-dialog-draggable': config.draggable, 'p-dialog-maximized': maximized }"
                [ngStyle]="containerStyle"
                [class]="config.styleClass"
                [@animation]="{ value: 'visible', params: { transform: transformOptions, transition: config.transitionOptions || '150ms cubic-bezier(0, 0, 0.2, 1)' } }"
                (@animation.start)="onAnimationStart($event)"
                (@animation.done)="onAnimationEnd($event)"
                role="dialog"
                *ngIf="visible"
                pFocusTrap
                [pFocusTrapDisabled]="config.focusTrap === false"
                [attr.aria-labelledby]="ariaLabelledBy"
                [attr.aria-modal]="true"
            >
                <div *ngIf="config.resizable" class="p-resizable-handle" (mousedown)="initResize($event)"></div>
                <div #titlebar class="p-dialog-header" (mousedown)="initDrag($event)" *ngIf="config.showHeader === false ? false : true">
                    <ng-container *ngComponentOutlet="headerTemplate"></ng-container>
                    <ng-container *ngIf="!headerTemplate">
                        <span class="p-dialog-title" [id]="ariaLabelledBy">{{ config.header }}</span>
                        <div class="p-dialog-header-icons">
                            <button *ngIf="config.maximizable" type="button" [ngClass]="{ 'p-dialog-header-icon p-dialog-header-maximize p-link': true }" (click)="maximize()" (keydown.enter)="maximize()" tabindex="-1" pRipple>
                                <span class="p-dialog-header-maximize-icon" *ngIf="!maximizeIconTemplate || !minimizeIconTemplate" [ngClass]="maximized ? minimizeIcon : maximizeIcon"></span>
                                <WindowMaximizeIcon *ngIf="!maximized && !maximizeIcon && !maximizeIconTemplate" [styleClass]="'p-dialog-header-maximize-icon'" />
                                <WindowMinimizeIcon *ngIf="maximized && !minimizeIcon && !minimizeIconTemplate" [styleClass]="'p-dialog-header-maximize-icon'" />
                                <ng-container *ngComponentOutlet="maximizeIconTemplate"></ng-container>
                                <ng-container *ngComponentOutlet="minimizeIconTemplate"></ng-container>
                            </button>
                            <button [ngClass]="'p-dialog-header-icon p-dialog-header-maximize p-link'" type="button" role="button" (click)="hide()" (keydown.enter)="hide()" *ngIf="config.closable !== false" [attr.aria-label]="closeAriaLabel">
                                <TimesIcon [styleClass]="'p-dialog-header-close-icon'" *ngIf="!closeIconTemplate" />
                                <ng-container *ngComponentOutlet="closeIconTemplate"></ng-container>
                            </button>
                        </div>
                    </ng-container>
                </div>
                <div #content class="p-dialog-content" [ngStyle]="config.contentStyle">
                    <ng-template pDynamicDialogContent *ngIf="!contentTemplate"></ng-template>
                    <ng-container *ngComponentOutlet="contentTemplate"></ng-container>
                </div>
                <div #footer class="p-dialog-footer" *ngIf="config.footer || footerTemplate">
                    <ng-container *ngIf="!footerTemplate">
                        {{ config.footer }}
                    </ng-container>
                    <ng-container *ngComponentOutlet="footerTemplate"></ng-container>
                </div>
            </div>
        </div>
    `, animations: [trigger('animation', [transition('void => visible', [useAnimation(showAnimation)]), transition('visible => void', [useAnimation(hideAnimation)])])], changeDetection: ChangeDetectionStrategy.Default, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: ["@layer primeng{.p-dialog-mask{position:fixed;top:0;left:0;width:100%;height:100%;display:flex;justify-content:center;align-items:center;pointer-events:none}.p-dialog-mask.p-component-overlay{pointer-events:auto}.p-dialog{display:flex;flex-direction:column;pointer-events:auto;max-height:90%;transform:scale(1);position:relative}.p-dialog-content{overflow-y:auto;flex-grow:1}.p-dialog-header{display:flex;align-items:center;justify-content:space-between;flex-shrink:0}.p-dialog-draggable .p-dialog-header{cursor:move}.p-dialog-footer{flex-shrink:0}.p-dialog .p-dialog-header-icons{display:flex;align-items:center}.p-dialog .p-dialog-header-icon{display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative}.p-fluid .p-dialog-footer .p-button{width:auto}.p-dialog-top .p-dialog,.p-dialog-bottom .p-dialog,.p-dialog-left .p-dialog,.p-dialog-right .p-dialog,.p-dialog-top-left .p-dialog,.p-dialog-top-right .p-dialog,.p-dialog-bottom-left .p-dialog,.p-dialog-bottom-right .p-dialog{margin:.75rem;transform:translateZ(0)}.p-dialog-maximized{-webkit-transition:none;transition:none;transform:none;width:100vw!important;height:100vh!important;top:0!important;left:0!important;max-height:100%;height:100%}.p-dialog-maximized .p-dialog-content{flex-grow:1}.p-dialog-left{justify-content:flex-start}.p-dialog-right{justify-content:flex-end}.p-dialog-top{align-items:flex-start}.p-dialog-top-left{justify-content:flex-start;align-items:flex-start}.p-dialog-top-right{justify-content:flex-end;align-items:flex-start}.p-dialog-bottom{align-items:flex-end}.p-dialog-bottom-left{justify-content:flex-start;align-items:flex-end}.p-dialog-bottom-right{justify-content:flex-end;align-items:flex-end}.p-dialog .p-resizable-handle{position:absolute;font-size:.1px;display:block;cursor:se-resize;width:12px;height:12px;right:1px;bottom:1px}.p-confirm-dialog .p-dialog-content{display:flex;align-items:center}}\n"] }]
        }], ctorParameters: () => [{ type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i0.ChangeDetectorRef }, { type: i0.Renderer2 }, { type: i1.DynamicDialogConfig }, { type: i2.DynamicDialogRef }, { type: i0.NgZone }, { type: i3.PrimeNGConfig }, { type: DynamicDialogComponent, decorators: [{
                    type: SkipSelf
                }, {
                    type: Optional
                }] }], propDecorators: { insertionPoint: [{
                type: ViewChild,
                args: [DynamicDialogContent]
            }], maskViewChild: [{
                type: ViewChild,
                args: ['mask']
            }], contentViewChild: [{
                type: ViewChild,
                args: ['content']
            }], footerViewChild: [{
                type: ViewChild,
                args: ['footer']
            }], headerViewChild: [{
                type: ViewChild,
                args: ['titlebar']
            }] } });
export class DynamicDialogModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: DynamicDialogModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: DynamicDialogModule, declarations: [DynamicDialogComponent, DynamicDialogContent], imports: [CommonModule, WindowMaximizeIcon, WindowMinimizeIcon, TimesIcon, SharedModule, FocusTrapModule], exports: [SharedModule] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: DynamicDialogModule, imports: [CommonModule, WindowMaximizeIcon, WindowMinimizeIcon, TimesIcon, SharedModule, FocusTrapModule, SharedModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: DynamicDialogModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, WindowMaximizeIcon, WindowMinimizeIcon, TimesIcon, SharedModule, FocusTrapModule],
                    declarations: [DynamicDialogComponent, DynamicDialogContent],
                    exports: [SharedModule]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHluYW1pY2RpYWxvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy9keW5hbWljZGlhbG9nL2R5bmFtaWNkaWFsb2cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQWtCLEtBQUssRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ25ILE9BQU8sRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLGlCQUFpQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDNUUsT0FBTyxFQUVILHVCQUF1QixFQUV2QixTQUFTLEVBR1QsTUFBTSxFQUNOLFFBQVEsRUFHUixRQUFRLEVBQ1IsV0FBVyxFQUVYLFFBQVEsRUFFUixTQUFTLEVBQ1QsaUJBQWlCLEVBRXBCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBaUIsWUFBWSxFQUFFLGVBQWUsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUMzRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNwRCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDaEQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDbEUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFFbEUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLFdBQVcsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUcvRCxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQzs7Ozs7OztBQUU5RCxNQUFNLGFBQWEsR0FBRyxTQUFTLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxTQUFTLEVBQUUsZUFBZSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUs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QyxpQkFBaUIsQ0FBQyxJQUFJLFFBRS9CO3dCQUNGLEtBQUssRUFBRSxXQUFXO3FCQUNyQjs7MEJBNEtJLE1BQU07MkJBQUMsUUFBUTs7MEJBQ2YsTUFBTTsyQkFBQyxXQUFXOzswQkFPbEIsUUFBUTs7MEJBQUksUUFBUTt5Q0F2SlEsY0FBYztzQkFBOUMsU0FBUzt1QkFBQyxvQkFBb0I7Z0JBRVosYUFBYTtzQkFBL0IsU0FBUzt1QkFBQyxNQUFNO2dCQUVLLGdCQUFnQjtzQkFBckMsU0FBUzt1QkFBQyxTQUFTO2dCQUVDLGVBQWU7c0JBQW5DLFNBQVM7dUJBQUMsUUFBUTtnQkFFSSxlQUFlO3NCQUFyQyxTQUFTO3VCQUFDLFVBQVU7O0FBK2pCekIsTUFBTSxPQUFPLG1CQUFtQjt1R0FBbkIsbUJBQW1CO3dHQUFuQixtQkFBbUIsaUJBbG1CbkIsc0JBQXNCLEVBK2xCUSxvQkFBb0IsYUFEakQsWUFBWSxFQUFFLGtCQUFrQixFQUFFLGtCQUFrQixFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsZUFBZSxhQUU5RixZQUFZO3dHQUViLG1CQUFtQixZQUpsQixZQUFZLEVBQUUsa0JBQWtCLEVBQUUsa0JBQWtCLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxlQUFlLEVBRTlGLFlBQVk7OzJGQUViLG1CQUFtQjtrQkFML0IsUUFBUTttQkFBQztvQkFDTixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsa0JBQWtCLEVBQUUsa0JBQWtCLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxlQUFlLENBQUM7b0JBQ3pHLFlBQVksRUFBRSxDQUFDLHNCQUFzQixFQUFFLG9CQUFvQixDQUFDO29CQUM1RCxPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7aUJBQzFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYW5pbWF0ZSwgYW5pbWF0aW9uLCBBbmltYXRpb25FdmVudCwgc3R5bGUsIHRyYW5zaXRpb24sIHRyaWdnZXIsIHVzZUFuaW1hdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlLCBET0NVTUVOVCwgaXNQbGF0Zm9ybUJyb3dzZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgICBBZnRlclZpZXdJbml0LFxuICAgIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICAgIENoYW5nZURldGVjdG9yUmVmLFxuICAgIENvbXBvbmVudCxcbiAgICBDb21wb25lbnRSZWYsXG4gICAgRWxlbWVudFJlZixcbiAgICBJbmplY3QsXG4gICAgTmdNb2R1bGUsXG4gICAgTmdab25lLFxuICAgIE9uRGVzdHJveSxcbiAgICBPcHRpb25hbCxcbiAgICBQTEFURk9STV9JRCxcbiAgICBSZW5kZXJlcjIsXG4gICAgU2tpcFNlbGYsXG4gICAgVHlwZSxcbiAgICBWaWV3Q2hpbGQsXG4gICAgVmlld0VuY2Fwc3VsYXRpb24sXG4gICAgVmlld1JlZlxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFByaW1lTkdDb25maWcsIFNoYXJlZE1vZHVsZSwgVHJhbnNsYXRpb25LZXlzIH0gZnJvbSAncHJpbWVuZy9hcGknO1xuaW1wb3J0IHsgRG9tSGFuZGxlciB9IGZyb20gJ3ByaW1lbmcvZG9tJztcbmltcG9ydCB7IEZvY3VzVHJhcE1vZHVsZSB9IGZyb20gJ3ByaW1lbmcvZm9jdXN0cmFwJztcbmltcG9ydCB7IFRpbWVzSWNvbiB9IGZyb20gJ3ByaW1lbmcvaWNvbnMvdGltZXMnO1xuaW1wb3J0IHsgV2luZG93TWF4aW1pemVJY29uIH0gZnJvbSAncHJpbWVuZy9pY29ucy93aW5kb3dtYXhpbWl6ZSc7XG5pbXBvcnQgeyBXaW5kb3dNaW5pbWl6ZUljb24gfSBmcm9tICdwcmltZW5nL2ljb25zL3dpbmRvd21pbmltaXplJztcbmltcG9ydCB7IE51bGxhYmxlLCBWb2lkTGlzdGVuZXIgfSBmcm9tICdwcmltZW5nL3RzLWhlbHBlcnMnO1xuaW1wb3J0IHsgVW5pcXVlQ29tcG9uZW50SWQsIFpJbmRleFV0aWxzIH0gZnJvbSAncHJpbWVuZy91dGlscyc7XG5pbXBvcnQgeyBEeW5hbWljRGlhbG9nQ29uZmlnIH0gZnJvbSAnLi9keW5hbWljZGlhbG9nLWNvbmZpZyc7XG5pbXBvcnQgeyBEeW5hbWljRGlhbG9nUmVmIH0gZnJvbSAnLi9keW5hbWljZGlhbG9nLXJlZic7XG5pbXBvcnQgeyBEeW5hbWljRGlhbG9nQ29udGVudCB9IGZyb20gJy4vZHluYW1pY2RpYWxvZ2NvbnRlbnQnO1xuXG5jb25zdCBzaG93QW5pbWF0aW9uID0gYW5pbWF0aW9uKFtzdHlsZSh7IHRyYW5zZm9ybTogJ3t7dHJhbnNmb3JtfX0nLCBvcGFjaXR5OiAwIH0pLCBhbmltYXRlKCd7e3RyYW5zaXRpb259fScsIHN0eWxlKHsgdHJhbnNmb3JtOiAnbm9uZScsIG9wYWNpdHk6IDEgfSkpXSk7XG5cbmNvbnN0IGhpZGVBbmltYXRpb24gPSBhbmltYXRpb24oW2FuaW1hdGUoJ3t7dHJhbnNpdGlvbn19Jywgc3R5bGUoeyB0cmFuc2Zvcm06ICd7e3RyYW5zZm9ybX19Jywgb3BhY2l0eTogMCB9KSldKTtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdwLWR5bmFtaWNEaWFsb2cnLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxkaXZcbiAgICAgICAgICAgICNtYXNrXG4gICAgICAgICAgICBbbmdDbGFzc109XCJ7XG4gICAgICAgICAgICAgICAgJ3AtZGlhbG9nLW1hc2snOiB0cnVlLFxuICAgICAgICAgICAgICAgICdwLWNvbXBvbmVudC1vdmVybGF5IHAtY29tcG9uZW50LW92ZXJsYXktZW50ZXIgcC1kaWFsb2ctbWFzay1zY3JvbGxibG9ja2VyJzogY29uZmlnLm1vZGFsICE9PSBmYWxzZSxcbiAgICAgICAgICAgICAgICAncC1kaWFsb2ctbGVmdCc6IHBvc2l0aW9uID09PSAnbGVmdCcsXG4gICAgICAgICAgICAgICAgJ3AtZGlhbG9nLXJpZ2h0JzogcG9zaXRpb24gPT09ICdyaWdodCcsXG4gICAgICAgICAgICAgICAgJ3AtZGlhbG9nLXRvcCc6IHBvc2l0aW9uID09PSAndG9wJyxcbiAgICAgICAgICAgICAgICAncC1kaWFsb2ctYm90dG9tJzogcG9zaXRpb24gPT09ICdib3R0b20nLFxuICAgICAgICAgICAgICAgICdwLWRpYWxvZy10b3AtbGVmdCc6IHBvc2l0aW9uID09PSAndG9wbGVmdCcgfHwgcG9zaXRpb24gPT09ICd0b3AtbGVmdCcsXG4gICAgICAgICAgICAgICAgJ3AtZGlhbG9nLXRvcC1yaWdodCc6IHBvc2l0aW9uID09PSAndG9wcmlnaHQnIHx8IHBvc2l0aW9uID09PSAndG9wLXJpZ2h0JyxcbiAgICAgICAgICAgICAgICAncC1kaWFsb2ctYm90dG9tLWxlZnQnOiBwb3NpdGlvbiA9PT0gJ2JvdHRvbWxlZnQnIHx8IHBvc2l0aW9uID09PSAnYm90dG9tLWxlZnQnLFxuICAgICAgICAgICAgICAgICdwLWRpYWxvZy1ib3R0b20tcmlnaHQnOiBwb3NpdGlvbiA9PT0gJ2JvdHRvbXJpZ2h0JyB8fCBwb3NpdGlvbiA9PT0gJ2JvdHRvbS1yaWdodCdcbiAgICAgICAgICAgIH1cIlxuICAgICAgICAgICAgW2NsYXNzXT1cImNvbmZpZy5tYXNrU3R5bGVDbGFzc1wiXG4gICAgICAgID5cbiAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAjY29udGFpbmVyXG4gICAgICAgICAgICAgICAgW25nQ2xhc3NdPVwieyAncC1kaWFsb2cgcC1keW5hbWljLWRpYWxvZyBwLWNvbXBvbmVudCc6IHRydWUsICdwLWRpYWxvZy1ydGwnOiBjb25maWcucnRsLCAncC1kaWFsb2ctcmVzaXphYmxlJzogY29uZmlnLnJlc2l6YWJsZSwgJ3AtZGlhbG9nLWRyYWdnYWJsZSc6IGNvbmZpZy5kcmFnZ2FibGUsICdwLWRpYWxvZy1tYXhpbWl6ZWQnOiBtYXhpbWl6ZWQgfVwiXG4gICAgICAgICAgICAgICAgW25nU3R5bGVdPVwiY29udGFpbmVyU3R5bGVcIlxuICAgICAgICAgICAgICAgIFtjbGFzc109XCJjb25maWcuc3R5bGVDbGFzc1wiXG4gICAgICAgICAgICAgICAgW0BhbmltYXRpb25dPVwieyB2YWx1ZTogJ3Zpc2libGUnLCBwYXJhbXM6IHsgdHJhbnNmb3JtOiB0cmFuc2Zvcm1PcHRpb25zLCB0cmFuc2l0aW9uOiBjb25maWcudHJhbnNpdGlvbk9wdGlvbnMgfHwgJzE1MG1zIGN1YmljLWJlemllcigwLCAwLCAwLjIsIDEpJyB9IH1cIlxuICAgICAgICAgICAgICAgIChAYW5pbWF0aW9uLnN0YXJ0KT1cIm9uQW5pbWF0aW9uU3RhcnQoJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgKEBhbmltYXRpb24uZG9uZSk9XCJvbkFuaW1hdGlvbkVuZCgkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICByb2xlPVwiZGlhbG9nXCJcbiAgICAgICAgICAgICAgICAqbmdJZj1cInZpc2libGVcIlxuICAgICAgICAgICAgICAgIHBGb2N1c1RyYXBcbiAgICAgICAgICAgICAgICBbcEZvY3VzVHJhcERpc2FibGVkXT1cImNvbmZpZy5mb2N1c1RyYXAgPT09IGZhbHNlXCJcbiAgICAgICAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsbGVkYnldPVwiYXJpYUxhYmVsbGVkQnlcIlxuICAgICAgICAgICAgICAgIFthdHRyLmFyaWEtbW9kYWxdPVwidHJ1ZVwiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPGRpdiAqbmdJZj1cImNvbmZpZy5yZXNpemFibGVcIiBjbGFzcz1cInAtcmVzaXphYmxlLWhhbmRsZVwiIChtb3VzZWRvd24pPVwiaW5pdFJlc2l6ZSgkZXZlbnQpXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiAjdGl0bGViYXIgY2xhc3M9XCJwLWRpYWxvZy1oZWFkZXJcIiAobW91c2Vkb3duKT1cImluaXREcmFnKCRldmVudClcIiAqbmdJZj1cImNvbmZpZy5zaG93SGVhZGVyID09PSBmYWxzZSA/IGZhbHNlIDogdHJ1ZVwiPlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0NvbXBvbmVudE91dGxldD1cImhlYWRlclRlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCIhaGVhZGVyVGVtcGxhdGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC1kaWFsb2ctdGl0bGVcIiBbaWRdPVwiYXJpYUxhYmVsbGVkQnlcIj57eyBjb25maWcuaGVhZGVyIH19PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtZGlhbG9nLWhlYWRlci1pY29uc1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gKm5nSWY9XCJjb25maWcubWF4aW1pemFibGVcIiB0eXBlPVwiYnV0dG9uXCIgW25nQ2xhc3NdPVwieyAncC1kaWFsb2ctaGVhZGVyLWljb24gcC1kaWFsb2ctaGVhZGVyLW1heGltaXplIHAtbGluayc6IHRydWUgfVwiIChjbGljayk9XCJtYXhpbWl6ZSgpXCIgKGtleWRvd24uZW50ZXIpPVwibWF4aW1pemUoKVwiIHRhYmluZGV4PVwiLTFcIiBwUmlwcGxlPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtZGlhbG9nLWhlYWRlci1tYXhpbWl6ZS1pY29uXCIgKm5nSWY9XCIhbWF4aW1pemVJY29uVGVtcGxhdGUgfHwgIW1pbmltaXplSWNvblRlbXBsYXRlXCIgW25nQ2xhc3NdPVwibWF4aW1pemVkID8gbWluaW1pemVJY29uIDogbWF4aW1pemVJY29uXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8V2luZG93TWF4aW1pemVJY29uICpuZ0lmPVwiIW1heGltaXplZCAmJiAhbWF4aW1pemVJY29uICYmICFtYXhpbWl6ZUljb25UZW1wbGF0ZVwiIFtzdHlsZUNsYXNzXT1cIidwLWRpYWxvZy1oZWFkZXItbWF4aW1pemUtaWNvbidcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8V2luZG93TWluaW1pemVJY29uICpuZ0lmPVwibWF4aW1pemVkICYmICFtaW5pbWl6ZUljb24gJiYgIW1pbmltaXplSWNvblRlbXBsYXRlXCIgW3N0eWxlQ2xhc3NdPVwiJ3AtZGlhbG9nLWhlYWRlci1tYXhpbWl6ZS1pY29uJ1wiIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nQ29tcG9uZW50T3V0bGV0PVwibWF4aW1pemVJY29uVGVtcGxhdGVcIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdDb21wb25lbnRPdXRsZXQ9XCJtaW5pbWl6ZUljb25UZW1wbGF0ZVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gW25nQ2xhc3NdPVwiJ3AtZGlhbG9nLWhlYWRlci1pY29uIHAtZGlhbG9nLWhlYWRlci1tYXhpbWl6ZSBwLWxpbmsnXCIgdHlwZT1cImJ1dHRvblwiIHJvbGU9XCJidXR0b25cIiAoY2xpY2spPVwiaGlkZSgpXCIgKGtleWRvd24uZW50ZXIpPVwiaGlkZSgpXCIgKm5nSWY9XCJjb25maWcuY2xvc2FibGUgIT09IGZhbHNlXCIgW2F0dHIuYXJpYS1sYWJlbF09XCJjbG9zZUFyaWFMYWJlbFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8VGltZXNJY29uIFtzdHlsZUNsYXNzXT1cIidwLWRpYWxvZy1oZWFkZXItY2xvc2UtaWNvbidcIiAqbmdJZj1cIiFjbG9zZUljb25UZW1wbGF0ZVwiIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nQ29tcG9uZW50T3V0bGV0PVwiY2xvc2VJY29uVGVtcGxhdGVcIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2ICNjb250ZW50IGNsYXNzPVwicC1kaWFsb2ctY29udGVudFwiIFtuZ1N0eWxlXT1cImNvbmZpZy5jb250ZW50U3R5bGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlIHBEeW5hbWljRGlhbG9nQ29udGVudCAqbmdJZj1cIiFjb250ZW50VGVtcGxhdGVcIj48L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0NvbXBvbmVudE91dGxldD1cImNvbnRlbnRUZW1wbGF0ZVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgI2Zvb3RlciBjbGFzcz1cInAtZGlhbG9nLWZvb3RlclwiICpuZ0lmPVwiY29uZmlnLmZvb3RlciB8fCBmb290ZXJUZW1wbGF0ZVwiPlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiIWZvb3RlclRlbXBsYXRlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICB7eyBjb25maWcuZm9vdGVyIH19XG4gICAgICAgICAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0NvbXBvbmVudE91dGxldD1cImZvb3RlclRlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgYCxcbiAgICBhbmltYXRpb25zOiBbdHJpZ2dlcignYW5pbWF0aW9uJywgW3RyYW5zaXRpb24oJ3ZvaWQgPT4gdmlzaWJsZScsIFt1c2VBbmltYXRpb24oc2hvd0FuaW1hdGlvbildKSwgdHJhbnNpdGlvbigndmlzaWJsZSA9PiB2b2lkJywgW3VzZUFuaW1hdGlvbihoaWRlQW5pbWF0aW9uKV0pXSldLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuRGVmYXVsdCxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAgIHN0eWxlVXJsczogWycuLi9kaWFsb2cvZGlhbG9nLmNzcyddLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgY2xhc3M6ICdwLWVsZW1lbnQnXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBEeW5hbWljRGlhbG9nQ29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcbiAgICB2aXNpYmxlOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIGNvbXBvbmVudFJlZjogTnVsbGFibGU8Q29tcG9uZW50UmVmPGFueT4+O1xuXG4gICAgbWFzazogTnVsbGFibGU8SFRNTERpdkVsZW1lbnQ+O1xuXG4gICAgcmVzaXppbmc6IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cbiAgICBkcmFnZ2luZzogYm9vbGVhbiB8IHVuZGVmaW5lZDtcblxuICAgIG1heGltaXplZDogYm9vbGVhbiB8IHVuZGVmaW5lZDtcblxuICAgIF9zdHlsZTogYW55ID0ge307XG5cbiAgICBvcmlnaW5hbFN0eWxlOiBhbnk7XG5cbiAgICBsYXN0UGFnZVg6IG51bWJlciB8IHVuZGVmaW5lZDtcblxuICAgIGxhc3RQYWdlWTogbnVtYmVyIHwgdW5kZWZpbmVkO1xuXG4gICAgYXJpYUxhYmVsbGVkQnk6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAgIGlkOiBzdHJpbmcgPSBVbmlxdWVDb21wb25lbnRJZCgpO1xuXG4gICAgc3R5bGVFbGVtZW50OiBhbnk7XG5cbiAgICBAVmlld0NoaWxkKER5bmFtaWNEaWFsb2dDb250ZW50KSBpbnNlcnRpb25Qb2ludDogTnVsbGFibGU8RHluYW1pY0RpYWxvZ0NvbnRlbnQ+O1xuXG4gICAgQFZpZXdDaGlsZCgnbWFzaycpIG1hc2tWaWV3Q2hpbGQ6IE51bGxhYmxlPEVsZW1lbnRSZWY+O1xuXG4gICAgQFZpZXdDaGlsZCgnY29udGVudCcpIGNvbnRlbnRWaWV3Q2hpbGQ6IE51bGxhYmxlPEVsZW1lbnRSZWY+O1xuXG4gICAgQFZpZXdDaGlsZCgnZm9vdGVyJykgZm9vdGVyVmlld0NoaWxkOiBOdWxsYWJsZTxFbGVtZW50UmVmPjtcblxuICAgIEBWaWV3Q2hpbGQoJ3RpdGxlYmFyJykgaGVhZGVyVmlld0NoaWxkOiBOdWxsYWJsZTxFbGVtZW50UmVmPjtcblxuICAgIGNoaWxkQ29tcG9uZW50VHlwZTogTnVsbGFibGU8VHlwZTxhbnk+PjtcblxuICAgIGNvbnRhaW5lcjogTnVsbGFibGU8SFRNTERpdkVsZW1lbnQ+O1xuXG4gICAgd3JhcHBlcjogTnVsbGFibGU8SFRNTEVsZW1lbnQ+O1xuXG4gICAgZG9jdW1lbnRLZXlkb3duTGlzdGVuZXI6IFZvaWRMaXN0ZW5lcjtcblxuICAgIGRvY3VtZW50RXNjYXBlTGlzdGVuZXI6IFZvaWRMaXN0ZW5lcjtcblxuICAgIG1hc2tDbGlja0xpc3RlbmVyOiBWb2lkTGlzdGVuZXI7XG5cbiAgICB0cmFuc2Zvcm1PcHRpb25zOiBzdHJpbmcgPSAnc2NhbGUoMC43KSc7XG5cbiAgICBkb2N1bWVudFJlc2l6ZUxpc3RlbmVyOiBWb2lkTGlzdGVuZXI7XG5cbiAgICBkb2N1bWVudFJlc2l6ZUVuZExpc3RlbmVyOiBWb2lkTGlzdGVuZXI7XG5cbiAgICBkb2N1bWVudERyYWdMaXN0ZW5lcjogVm9pZExpc3RlbmVyO1xuXG4gICAgZG9jdW1lbnREcmFnRW5kTGlzdGVuZXI6IFZvaWRMaXN0ZW5lcjtcblxuICAgIGdldCBtaW5YKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy5taW5YID8gdGhpcy5jb25maWcubWluWCA6IDA7XG4gICAgfVxuXG4gICAgZ2V0IG1pblkoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLm1pblkgPyB0aGlzLmNvbmZpZy5taW5ZIDogMDtcbiAgICB9XG5cbiAgICBnZXQga2VlcEluVmlld3BvcnQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy5rZWVwSW5WaWV3cG9ydCE7XG4gICAgfVxuXG4gICAgZ2V0IG1heGltaXphYmxlKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcubWF4aW1pemFibGUhO1xuICAgIH1cblxuICAgIGdldCBtYXhpbWl6ZUljb24oKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLm1heGltaXplSWNvbiE7XG4gICAgfVxuXG4gICAgZ2V0IG1pbmltaXplSWNvbigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcubWluaW1pemVJY29uITtcbiAgICB9XG5cbiAgICBnZXQgc3R5bGUoKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0eWxlO1xuICAgIH1cblxuICAgIGdldCBwb3NpdGlvbigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcucG9zaXRpb24hO1xuICAgIH1cblxuICAgIGdldCBjbG9zZUFyaWFMYWJlbCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5wcmltZU5HQ29uZmlnLmdldFRyYW5zbGF0aW9uKFRyYW5zbGF0aW9uS2V5cy5BUklBKVsnY2xvc2UnXTtcbiAgICB9XG5cbiAgICBzZXQgc3R5bGUodmFsdWU6IGFueSkge1xuICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX3N0eWxlID0geyAuLi52YWx1ZSB9O1xuICAgICAgICAgICAgdGhpcy5vcmlnaW5hbFN0eWxlID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgcGFyZW50KCkge1xuICAgICAgICBjb25zdCBkb21FbGVtZW50cyA9IEFycmF5LmZyb20odGhpcy5kb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdwLWRpYWxvZycpKTtcblxuICAgICAgICBpZiAoZG9tRWxlbWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgcmV0dXJuIGRvbUVsZW1lbnRzLnBvcCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IHBhcmVudENvbnRlbnQoKSB7XG4gICAgICAgIGNvbnN0IGRvbUVsZW1lbnRzID0gQXJyYXkuZnJvbSh0aGlzLmRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3AtZGlhbG9nJykpO1xuICAgICAgICBpZiAoZG9tRWxlbWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3QgY29udGVudEVsZW1lbnRzID0gZG9tRWxlbWVudHNbZG9tRWxlbWVudHMubGVuZ3RoIC0gMV0ucXVlcnlTZWxlY3RvcignLnAtZGlhbG9nLWNvbnRlbnQnKTtcbiAgICAgICAgICAgIGlmIChjb250ZW50RWxlbWVudHMpIHJldHVybiBBcnJheS5pc0FycmF5KGNvbnRlbnRFbGVtZW50cykgPyBjb250ZW50RWxlbWVudHNbMF0gOiBjb250ZW50RWxlbWVudHM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgaGVhZGVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcuaGVhZGVyO1xuICAgIH1cblxuICAgIGdldCBkYXRhKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcuZGF0YTtcbiAgICB9XG5cbiAgICBnZXQgYnJlYWtwb2ludHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy5icmVha3BvaW50cztcbiAgICB9XG5cbiAgICBnZXQgZm9vdGVyVGVtcGxhdGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZz8udGVtcGxhdGVzPy5mb290ZXI7XG4gICAgfVxuXG4gICAgZ2V0IGhlYWRlclRlbXBsYXRlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25maWc/LnRlbXBsYXRlcz8uaGVhZGVyO1xuICAgIH1cblxuICAgIGdldCBjb250ZW50VGVtcGxhdGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZz8udGVtcGxhdGVzPy5jb250ZW50O1xuICAgIH1cblxuICAgIGdldCBtaW5pbWl6ZUljb25UZW1wbGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnPy50ZW1wbGF0ZXM/Lm1pbmltaXplaWNvbjtcbiAgICB9XG5cbiAgICBnZXQgbWF4aW1pemVJY29uVGVtcGxhdGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZz8udGVtcGxhdGVzPy5tYXhpbWl6ZWljb247XG4gICAgfVxuXG4gICAgZ2V0IGNsb3NlSWNvblRlbXBsYXRlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25maWc/LnRlbXBsYXRlcz8uY2xvc2VpY29uO1xuICAgIH1cblxuICAgIGdldCBkeW5hbWljRGlhbG9nQ291bnQoKSB7XG4gICAgICAgIGNvbnN0IGR5bmFtaWNEaWFsb2dzID0gdGhpcy5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdwLWR5bmFtaWNkaWFsb2cnKTtcbiAgICAgICAgY29uc3QgZHluYW1pY0RpYWxvZ0NvdW50ID0gZHluYW1pY0RpYWxvZ3M/Lmxlbmd0aDtcblxuICAgICAgICByZXR1cm4gZHluYW1pY0RpYWxvZ0NvdW50O1xuICAgIH1cblxuICAgIGdldCBjb250YWluZXJTdHlsZSgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC4uLnRoaXMuY29uZmlnLnN0eWxlLFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMuY29uZmlnLndpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmNvbmZpZy5oZWlnaHRcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBkb2N1bWVudDogRG9jdW1lbnQsXG4gICAgICAgIEBJbmplY3QoUExBVEZPUk1fSUQpIHByaXZhdGUgcGxhdGZvcm1JZDogYW55LFxuICAgICAgICBwcml2YXRlIGNkOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgcHVibGljIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgICAgIHB1YmxpYyBjb25maWc6IER5bmFtaWNEaWFsb2dDb25maWcsXG4gICAgICAgIHByaXZhdGUgZGlhbG9nUmVmOiBEeW5hbWljRGlhbG9nUmVmLFxuICAgICAgICBwdWJsaWMgem9uZTogTmdab25lLFxuICAgICAgICBwdWJsaWMgcHJpbWVOR0NvbmZpZzogUHJpbWVOR0NvbmZpZyxcbiAgICAgICAgQFNraXBTZWxmKCkgQE9wdGlvbmFsKCkgcHJpdmF0ZSBwYXJlbnREaWFsb2c6IER5bmFtaWNEaWFsb2dDb21wb25lbnRcbiAgICApIHt9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgaWYgKHRoaXMuYnJlYWtwb2ludHMpIHtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlU3R5bGUoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjcmVhdGVTdHlsZSgpIHtcbiAgICAgICAgaWYgKGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5zdHlsZUVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0eWxlRWxlbWVudCA9IHRoaXMucmVuZGVyZXIuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgICAgICAgICAgICB0aGlzLnN0eWxlRWxlbWVudC50eXBlID0gJ3RleHQvY3NzJztcbiAgICAgICAgICAgICAgICBEb21IYW5kbGVyLnNldEF0dHJpYnV0ZSh0aGlzLnN0eWxlRWxlbWVudCwgJ25vbmNlJywgdGhpcy5wcmltZU5HQ29uZmlnPy5jc3AoKT8ubm9uY2UpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuYXBwZW5kQ2hpbGQodGhpcy5kb2N1bWVudC5oZWFkLCB0aGlzLnN0eWxlRWxlbWVudCk7XG4gICAgICAgICAgICAgICAgbGV0IGlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGJyZWFrcG9pbnQgaW4gdGhpcy5icmVha3BvaW50cykge1xuICAgICAgICAgICAgICAgICAgICBpbm5lckhUTUwgKz0gYFxuICAgICAgICAgICAgICAgICAgICAgICAgQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDogJHticmVha3BvaW50fSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5wLWRpYWxvZ1ske3RoaXMuaWR9XTpub3QoLnAtZGlhbG9nLW1heGltaXplZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogJHt0aGlzLmJyZWFrcG9pbnRzW2JyZWFrcG9pbnRdfSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFByb3BlcnR5KHRoaXMuc3R5bGVFbGVtZW50LCAnaW5uZXJIVE1MJywgaW5uZXJIVE1MKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRlc3Ryb3lTdHlsZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuc3R5bGVFbGVtZW50KSB7XG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNoaWxkKHRoaXMuZG9jdW1lbnQuaGVhZCwgdGhpcy5zdHlsZUVsZW1lbnQpO1xuICAgICAgICAgICAgdGhpcy5zdHlsZUVsZW1lbnQgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgICAgICB0aGlzLmxvYWRDaGlsZENvbXBvbmVudCh0aGlzLmNoaWxkQ29tcG9uZW50VHlwZSEpO1xuICAgICAgICB0aGlzLmFyaWFMYWJlbGxlZEJ5ID0gdGhpcy5nZXRBcmlhTGFiZWxsZWRCeSgpO1xuICAgICAgICB0aGlzLmNkLmRldGVjdENoYW5nZXMoKTtcbiAgICB9XG5cbiAgICBnZXRBcmlhTGFiZWxsZWRCeSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGVhZGVyICE9PSBudWxsID8gVW5pcXVlQ29tcG9uZW50SWQoKSArICdfaGVhZGVyJyA6IG51bGw7XG4gICAgfVxuXG4gICAgbG9hZENoaWxkQ29tcG9uZW50KGNvbXBvbmVudFR5cGU6IFR5cGU8YW55Pikge1xuICAgICAgICBsZXQgdmlld0NvbnRhaW5lclJlZiA9IHRoaXMuaW5zZXJ0aW9uUG9pbnQ/LnZpZXdDb250YWluZXJSZWY7XG4gICAgICAgIHZpZXdDb250YWluZXJSZWY/LmNsZWFyKCk7XG5cbiAgICAgICAgdGhpcy5jb21wb25lbnRSZWYgPSB2aWV3Q29udGFpbmVyUmVmPy5jcmVhdGVDb21wb25lbnQoY29tcG9uZW50VHlwZSk7XG4gICAgICAgIHRoaXMuZGlhbG9nUmVmLm9uQ2hpbGRDb21wb25lbnRMb2FkZWQubmV4dCh0aGlzLmNvbXBvbmVudFJlZiEuaW5zdGFuY2UpO1xuICAgIH1cblxuICAgIG1vdmVPblRvcCgpIHtcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLmF1dG9aSW5kZXggIT09IGZhbHNlKSB7XG4gICAgICAgICAgICBaSW5kZXhVdGlscy5zZXQoJ21vZGFsJywgdGhpcy5jb250YWluZXIsICh0aGlzLmNvbmZpZy5iYXNlWkluZGV4IHx8IDApICsgdGhpcy5wcmltZU5HQ29uZmlnLnpJbmRleC5tb2RhbCk7XG4gICAgICAgICAgICAodGhpcy53cmFwcGVyIGFzIEhUTUxFbGVtZW50KS5zdHlsZS56SW5kZXggPSBTdHJpbmcocGFyc2VJbnQoKHRoaXMuY29udGFpbmVyIGFzIEhUTUxEaXZFbGVtZW50KS5zdHlsZS56SW5kZXgsIDEwKSAtIDEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25BbmltYXRpb25TdGFydChldmVudDogQW5pbWF0aW9uRXZlbnQpIHtcbiAgICAgICAgc3dpdGNoIChldmVudC50b1N0YXRlKSB7XG4gICAgICAgICAgICBjYXNlICd2aXNpYmxlJzpcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGV2ZW50LmVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgdGhpcy53cmFwcGVyID0gKHRoaXMuY29udGFpbmVyIGFzIEhUTUxEaXZFbGVtZW50KS5wYXJlbnRFbGVtZW50O1xuICAgICAgICAgICAgICAgIHRoaXMubW92ZU9uVG9wKCk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGFyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudW5iaW5kR2xvYmFsTGlzdGVuZXJzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuYmluZEdsb2JhbExpc3RlbmVycygpO1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyPy5zZXRBdHRyaWJ1dGUodGhpcy5pZCwgJycpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY29uZmlnLm1vZGFsICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVuYWJsZU1vZGFsaXR5KCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY29uZmlnLmZvY3VzT25TaG93ICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICd2b2lkJzpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy53cmFwcGVyICYmIHRoaXMuY29uZmlnLm1vZGFsICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICBEb21IYW5kbGVyLmFkZENsYXNzKHRoaXMud3JhcHBlciwgJ3AtY29tcG9uZW50LW92ZXJsYXktbGVhdmUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkFuaW1hdGlvbkVuZChldmVudDogQW5pbWF0aW9uRXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50LnRvU3RhdGUgPT09ICd2b2lkJykge1xuICAgICAgICAgICAgaWYgKHRoaXMucGFyZW50Q29udGVudCAmJiB0aGlzLmNvbmZpZy5mb2N1c09uQ2xvc2UgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5mb2N1cyh0aGlzLnBhcmVudENvbnRlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5vbkNvbnRhaW5lckRlc3Ryb3koKTtcbiAgICAgICAgICAgIHRoaXMuZGlhbG9nUmVmLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uQ29udGFpbmVyRGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy51bmJpbmRHbG9iYWxMaXN0ZW5lcnMoKTtcblxuICAgICAgICBpZiAodGhpcy5jb250YWluZXIgJiYgdGhpcy5jb25maWcuYXV0b1pJbmRleCAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIFpJbmRleFV0aWxzLmNsZWFyKHRoaXMuY29udGFpbmVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5tb2RhbCAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRoaXMuZGlzYWJsZU1vZGFsaXR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBudWxsO1xuICAgIH1cblxuICAgIGNsb3NlKCkge1xuICAgICAgICB0aGlzLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG5cbiAgICBoaWRlKCkge1xuICAgICAgICBpZiAodGhpcy5kaWFsb2dSZWYpIHtcbiAgICAgICAgICAgIHRoaXMuZGlhbG9nUmVmLmNsb3NlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBlbmFibGVNb2RhbGl0eSgpIHtcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLmRpc21pc3NhYmxlTWFzaykge1xuICAgICAgICAgICAgdGhpcy5tYXNrQ2xpY2tMaXN0ZW5lciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMud3JhcHBlciwgJ21vdXNlZG93bicsIChldmVudDogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMud3JhcHBlciAmJiB0aGlzLndyYXBwZXIuaXNTYW1lTm9kZShldmVudC50YXJnZXQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZHluYW1pY0RpYWxvZ0NvdW50ID09PSAxKSB7XG4gICAgICAgICAgICBEb21IYW5kbGVyLmFkZENsYXNzKHRoaXMuZG9jdW1lbnQuYm9keSwgJ3Atb3ZlcmZsb3ctaGlkZGVuJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkaXNhYmxlTW9kYWxpdHkoKSB7XG4gICAgICAgIGlmICh0aGlzLndyYXBwZXIpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbmZpZy5kaXNtaXNzYWJsZU1hc2spIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVuYmluZE1hc2tDbGlja0xpc3RlbmVyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5keW5hbWljRGlhbG9nQ291bnQgPT09IDEpIHtcbiAgICAgICAgICAgICAgICBEb21IYW5kbGVyLnJlbW92ZUNsYXNzKHRoaXMuZG9jdW1lbnQuYm9keSwgJ3Atb3ZlcmZsb3ctaGlkZGVuJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghKHRoaXMuY2QgYXMgVmlld1JlZikuZGVzdHJveWVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jZC5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmb2N1cyhmb2N1c1BhcmVudEVsZW1lbnQgPSB0aGlzLmNvbnRlbnRWaWV3Q2hpbGQubmF0aXZlRWxlbWVudCkge1xuICAgICAgICBjb25zdCBmb2N1c2FibGVFbGVtZW50cyA9IERvbUhhbmRsZXIuZ2V0Rm9jdXNhYmxlRWxlbWVudHMoZm9jdXNQYXJlbnRFbGVtZW50KTtcblxuICAgICAgICBpZiAoIWZvY3VzYWJsZUVsZW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGZvY3VzYWJsZSA9IERvbUhhbmRsZXIuZ2V0Rm9jdXNhYmxlRWxlbWVudChmb2N1c1BhcmVudEVsZW1lbnQsICdbYXV0b2ZvY3VzXScpO1xuICAgICAgICBpZiAoZm9jdXNhYmxlKSB7XG4gICAgICAgICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gZm9jdXNhYmxlLmZvY3VzKCksIDUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZm9jdXNhYmxlRWxlbWVudCA9IERvbUhhbmRsZXIuZ2V0Rm9jdXNhYmxlRWxlbWVudChmb2N1c1BhcmVudEVsZW1lbnQpO1xuICAgICAgICBpZiAoZm9jdXNhYmxlRWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGZvY3VzYWJsZUVsZW1lbnQuZm9jdXMoKSwgNSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmZvb3RlclZpZXdDaGlsZCkge1xuICAgICAgICAgICAgLy8gSWYgdGhlIGNvbnRlbnQgc2VjdGlvbiBpcyBlbXB0eSB0cnkgdG8gZm9jdXMgb24gZm9vdGVyXG4gICAgICAgICAgICB0aGlzLmZvY3VzKHRoaXMuZm9vdGVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICB9IGVsc2UgaWYgKCFmb2N1c2FibGVFbGVtZW50ICYmIHRoaXMuaGVhZGVyVmlld0NoaWxkKSB7XG4gICAgICAgICAgICB0aGlzLmZvY3VzKHRoaXMuaGVhZGVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbWF4aW1pemUoKSB7XG4gICAgICAgIHRoaXMubWF4aW1pemVkID0gIXRoaXMubWF4aW1pemVkO1xuXG4gICAgICAgIGlmICh0aGlzLm1heGltaXplZCkge1xuICAgICAgICAgICAgRG9tSGFuZGxlci5hZGRDbGFzcyh0aGlzLmRvY3VtZW50LmJvZHksICdwLW92ZXJmbG93LWhpZGRlbicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgRG9tSGFuZGxlci5yZW1vdmVDbGFzcyh0aGlzLmRvY3VtZW50LmJvZHksICdwLW92ZXJmbG93LWhpZGRlbicpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kaWFsb2dSZWYubWF4aW1pemUoeyBtYXhpbWl6ZWQ6IHRoaXMubWF4aW1pemVkIH0pO1xuICAgIH1cblxuICAgIGluaXRSZXNpemUoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnJlc2l6YWJsZSkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmRvY3VtZW50UmVzaXplTGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJpbmREb2N1bWVudFJlc2l6ZUxpc3RlbmVycygpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnJlc2l6aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMubGFzdFBhZ2VYID0gZXZlbnQucGFnZVg7XG4gICAgICAgICAgICB0aGlzLmxhc3RQYWdlWSA9IGV2ZW50LnBhZ2VZO1xuICAgICAgICAgICAgRG9tSGFuZGxlci5hZGRDbGFzcyh0aGlzLmRvY3VtZW50LmJvZHksICdwLXVuc2VsZWN0YWJsZS10ZXh0Jyk7XG4gICAgICAgICAgICB0aGlzLmRpYWxvZ1JlZi5yZXNpemVJbml0KGV2ZW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uUmVzaXplKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLnJlc2l6aW5nKSB7XG4gICAgICAgICAgICBsZXQgZGVsdGFYID0gZXZlbnQucGFnZVggLSAodGhpcy5sYXN0UGFnZVggYXMgbnVtYmVyKTtcbiAgICAgICAgICAgIGxldCBkZWx0YVkgPSBldmVudC5wYWdlWSAtICh0aGlzLmxhc3RQYWdlWSBhcyBudW1iZXIpO1xuICAgICAgICAgICAgbGV0IGNvbnRhaW5lcldpZHRoID0gRG9tSGFuZGxlci5nZXRPdXRlcldpZHRoKHRoaXMuY29udGFpbmVyKTtcbiAgICAgICAgICAgIGxldCBjb250YWluZXJIZWlnaHQgPSBEb21IYW5kbGVyLmdldE91dGVySGVpZ2h0KHRoaXMuY29udGFpbmVyKTtcbiAgICAgICAgICAgIGxldCBjb250ZW50SGVpZ2h0ID0gRG9tSGFuZGxlci5nZXRPdXRlckhlaWdodCgoPEVsZW1lbnRSZWY+dGhpcy5jb250ZW50Vmlld0NoaWxkKS5uYXRpdmVFbGVtZW50KTtcbiAgICAgICAgICAgIGxldCBuZXdXaWR0aCA9IGNvbnRhaW5lcldpZHRoICsgZGVsdGFYO1xuICAgICAgICAgICAgbGV0IG5ld0hlaWdodCA9IGNvbnRhaW5lckhlaWdodCArIGRlbHRhWTtcbiAgICAgICAgICAgIGxldCBtaW5XaWR0aCA9ICh0aGlzLmNvbnRhaW5lciBhcyBIVE1MRGl2RWxlbWVudCkuc3R5bGUubWluV2lkdGg7XG4gICAgICAgICAgICBsZXQgbWluSGVpZ2h0ID0gKHRoaXMuY29udGFpbmVyIGFzIEhUTUxEaXZFbGVtZW50KS5zdHlsZS5taW5IZWlnaHQ7XG4gICAgICAgICAgICBsZXQgb2Zmc2V0ID0gKHRoaXMuY29udGFpbmVyIGFzIEhUTUxEaXZFbGVtZW50KS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIGxldCB2aWV3cG9ydCA9IERvbUhhbmRsZXIuZ2V0Vmlld3BvcnQoKTtcbiAgICAgICAgICAgIGxldCBoYXNCZWVuRHJhZ2dlZCA9ICFwYXJzZUludCgodGhpcy5jb250YWluZXIgYXMgSFRNTERpdkVsZW1lbnQpLnN0eWxlLnRvcCkgfHwgIXBhcnNlSW50KCh0aGlzLmNvbnRhaW5lciBhcyBIVE1MRGl2RWxlbWVudCkuc3R5bGUubGVmdCk7XG5cbiAgICAgICAgICAgIGlmIChoYXNCZWVuRHJhZ2dlZCkge1xuICAgICAgICAgICAgICAgIG5ld1dpZHRoICs9IGRlbHRhWDtcbiAgICAgICAgICAgICAgICBuZXdIZWlnaHQgKz0gZGVsdGFZO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoKCFtaW5XaWR0aCB8fCBuZXdXaWR0aCA+IHBhcnNlSW50KG1pbldpZHRoKSkgJiYgb2Zmc2V0LmxlZnQgKyBuZXdXaWR0aCA8IHZpZXdwb3J0LndpZHRoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3R5bGUud2lkdGggPSBuZXdXaWR0aCArICdweCc7XG4gICAgICAgICAgICAgICAgKHRoaXMuY29udGFpbmVyIGFzIEhUTUxEaXZFbGVtZW50KS5zdHlsZS53aWR0aCA9IHRoaXMuX3N0eWxlLndpZHRoO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoKCFtaW5IZWlnaHQgfHwgbmV3SGVpZ2h0ID4gcGFyc2VJbnQobWluSGVpZ2h0KSkgJiYgb2Zmc2V0LnRvcCArIG5ld0hlaWdodCA8IHZpZXdwb3J0LmhlaWdodCkge1xuICAgICAgICAgICAgICAgICg8RWxlbWVudFJlZj50aGlzLmNvbnRlbnRWaWV3Q2hpbGQpLm5hdGl2ZUVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gY29udGVudEhlaWdodCArIG5ld0hlaWdodCAtIGNvbnRhaW5lckhlaWdodCArICdweCc7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fc3R5bGUuaGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3N0eWxlLmhlaWdodCA9IG5ld0hlaWdodCArICdweCc7XG4gICAgICAgICAgICAgICAgICAgICh0aGlzLmNvbnRhaW5lciBhcyBIVE1MRGl2RWxlbWVudCkuc3R5bGUuaGVpZ2h0ID0gdGhpcy5fc3R5bGUuaGVpZ2h0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5sYXN0UGFnZVggPSBldmVudC5wYWdlWDtcbiAgICAgICAgICAgIHRoaXMubGFzdFBhZ2VZID0gZXZlbnQucGFnZVk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXNpemVFbmQoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMucmVzaXppbmcpIHtcbiAgICAgICAgICAgIHRoaXMucmVzaXppbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIERvbUhhbmRsZXIucmVtb3ZlQ2xhc3ModGhpcy5kb2N1bWVudC5ib2R5LCAncC11bnNlbGVjdGFibGUtdGV4dCcpO1xuICAgICAgICAgICAgdGhpcy5kaWFsb2dSZWYucmVzaXplRW5kKGV2ZW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGluaXREcmFnKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgICAgIGlmIChEb21IYW5kbGVyLmhhc0NsYXNzKGV2ZW50LnRhcmdldCwgJ3AtZGlhbG9nLWhlYWRlci1pY29uJykgfHwgRG9tSGFuZGxlci5oYXNDbGFzcygoPEhUTUxFbGVtZW50PmV2ZW50LnRhcmdldCkucGFyZW50RWxlbWVudCwgJ3AtZGlhbG9nLWhlYWRlci1pY29uJykpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5kcmFnZ2FibGUpIHtcbiAgICAgICAgICAgIHRoaXMuZHJhZ2dpbmcgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5sYXN0UGFnZVggPSBldmVudC5wYWdlWDtcbiAgICAgICAgICAgIHRoaXMubGFzdFBhZ2VZID0gZXZlbnQucGFnZVk7XG5cbiAgICAgICAgICAgICh0aGlzLmNvbnRhaW5lciBhcyBIVE1MRGl2RWxlbWVudCkuc3R5bGUubWFyZ2luID0gJzAnO1xuICAgICAgICAgICAgRG9tSGFuZGxlci5hZGRDbGFzcyh0aGlzLmRvY3VtZW50LmJvZHksICdwLXVuc2VsZWN0YWJsZS10ZXh0Jyk7XG4gICAgICAgICAgICB0aGlzLmRpYWxvZ1JlZi5kcmFnU3RhcnQoZXZlbnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25EcmFnKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLmRyYWdnaW5nKSB7XG4gICAgICAgICAgICBsZXQgY29udGFpbmVyV2lkdGggPSBEb21IYW5kbGVyLmdldE91dGVyV2lkdGgodGhpcy5jb250YWluZXIpO1xuICAgICAgICAgICAgbGV0IGNvbnRhaW5lckhlaWdodCA9IERvbUhhbmRsZXIuZ2V0T3V0ZXJIZWlnaHQodGhpcy5jb250YWluZXIpO1xuICAgICAgICAgICAgbGV0IGRlbHRhWCA9IGV2ZW50LnBhZ2VYIC0gKHRoaXMubGFzdFBhZ2VYIGFzIG51bWJlcik7XG4gICAgICAgICAgICBsZXQgZGVsdGFZID0gZXZlbnQucGFnZVkgLSAodGhpcy5sYXN0UGFnZVkgYXMgbnVtYmVyKTtcbiAgICAgICAgICAgIGxldCBvZmZzZXQgPSAodGhpcy5jb250YWluZXIgYXMgSFRNTERpdkVsZW1lbnQpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgbGV0IGxlZnRQb3MgPSBvZmZzZXQubGVmdCArIGRlbHRhWDtcbiAgICAgICAgICAgIGxldCB0b3BQb3MgPSBvZmZzZXQudG9wICsgZGVsdGFZO1xuICAgICAgICAgICAgbGV0IHZpZXdwb3J0ID0gRG9tSGFuZGxlci5nZXRWaWV3cG9ydCgpO1xuXG4gICAgICAgICAgICAodGhpcy5jb250YWluZXIgYXMgSFRNTERpdkVsZW1lbnQpLnN0eWxlLnBvc2l0aW9uID0gJ2ZpeGVkJztcblxuICAgICAgICAgICAgaWYgKHRoaXMua2VlcEluVmlld3BvcnQpIHtcbiAgICAgICAgICAgICAgICBpZiAobGVmdFBvcyA+PSB0aGlzLm1pblggJiYgbGVmdFBvcyArIGNvbnRhaW5lcldpZHRoIDwgdmlld3BvcnQud2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3R5bGUubGVmdCA9IGxlZnRQb3MgKyAncHgnO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RQYWdlWCA9IGV2ZW50LnBhZ2VYO1xuICAgICAgICAgICAgICAgICAgICAodGhpcy5jb250YWluZXIgYXMgSFRNTERpdkVsZW1lbnQpLnN0eWxlLmxlZnQgPSBsZWZ0UG9zICsgJ3B4JztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodG9wUG9zID49IHRoaXMubWluWSAmJiB0b3BQb3MgKyBjb250YWluZXJIZWlnaHQgPCB2aWV3cG9ydC5oZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3R5bGUudG9wID0gdG9wUG9zICsgJ3B4JztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0UGFnZVkgPSBldmVudC5wYWdlWTtcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMuY29udGFpbmVyIGFzIEhUTUxEaXZFbGVtZW50KS5zdHlsZS50b3AgPSB0b3BQb3MgKyAncHgnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0UGFnZVggPSBldmVudC5wYWdlWDtcbiAgICAgICAgICAgICAgICAodGhpcy5jb250YWluZXIgYXMgSFRNTERpdkVsZW1lbnQpLnN0eWxlLmxlZnQgPSBsZWZ0UG9zICsgJ3B4JztcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RQYWdlWSA9IGV2ZW50LnBhZ2VZO1xuICAgICAgICAgICAgICAgICh0aGlzLmNvbnRhaW5lciBhcyBIVE1MRGl2RWxlbWVudCkuc3R5bGUudG9wID0gdG9wUG9zICsgJ3B4JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGVuZERyYWcoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuZHJhZ2dpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIERvbUhhbmRsZXIucmVtb3ZlQ2xhc3ModGhpcy5kb2N1bWVudC5ib2R5LCAncC11bnNlbGVjdGFibGUtdGV4dCcpO1xuICAgICAgICAgICAgdGhpcy5kaWFsb2dSZWYuZHJhZ0VuZChldmVudCk7XG4gICAgICAgICAgICB0aGlzLmNkLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlc2V0UG9zaXRpb24oKSB7XG4gICAgICAgICh0aGlzLmNvbnRhaW5lciBhcyBIVE1MRGl2RWxlbWVudCkuc3R5bGUucG9zaXRpb24gPSAnJztcbiAgICAgICAgKHRoaXMuY29udGFpbmVyIGFzIEhUTUxEaXZFbGVtZW50KS5zdHlsZS5sZWZ0ID0gJyc7XG4gICAgICAgICh0aGlzLmNvbnRhaW5lciBhcyBIVE1MRGl2RWxlbWVudCkuc3R5bGUudG9wID0gJyc7XG4gICAgICAgICh0aGlzLmNvbnRhaW5lciBhcyBIVE1MRGl2RWxlbWVudCkuc3R5bGUubWFyZ2luID0gJyc7XG4gICAgfVxuXG4gICAgYmluZERvY3VtZW50RHJhZ0xpc3RlbmVyKCkge1xuICAgICAgICBpZiAoaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybUlkKSkge1xuICAgICAgICAgICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmRvY3VtZW50RHJhZ0xpc3RlbmVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy5kb2N1bWVudCwgJ21vdXNlbW92ZScsIHRoaXMub25EcmFnLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBiaW5kRG9jdW1lbnREcmFnRW5kTGlzdGVuZXIoKSB7XG4gICAgICAgIGlmIChpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLnBsYXRmb3JtSWQpKSB7XG4gICAgICAgICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZG9jdW1lbnREcmFnRW5kTGlzdGVuZXIgPSB0aGlzLnJlbmRlcmVyLmxpc3Rlbih0aGlzLmRvY3VtZW50LCAnbW91c2V1cCcsIHRoaXMuZW5kRHJhZy5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdW5iaW5kRG9jdW1lbnREcmFnRW5kTGlzdGVuZXIoKSB7XG4gICAgICAgIGlmICh0aGlzLmRvY3VtZW50RHJhZ0VuZExpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50RHJhZ0VuZExpc3RlbmVyKCk7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50RHJhZ0xpc3RlbmVyID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVuYmluZERvY3VtZW50RHJhZ0xpc3RlbmVyKCkge1xuICAgICAgICBpZiAodGhpcy5kb2N1bWVudERyYWdMaXN0ZW5lcikge1xuICAgICAgICAgICAgdGhpcy5kb2N1bWVudERyYWdMaXN0ZW5lcigpO1xuICAgICAgICAgICAgdGhpcy5kb2N1bWVudERyYWdMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBiaW5kRG9jdW1lbnRSZXNpemVMaXN0ZW5lcnMoKSB7XG4gICAgICAgIGlmIChpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLnBsYXRmb3JtSWQpKSB7XG4gICAgICAgICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRSZXNpemVMaXN0ZW5lciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMuZG9jdW1lbnQsICdtb3VzZW1vdmUnLCB0aGlzLm9uUmVzaXplLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRSZXNpemVFbmRMaXN0ZW5lciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMuZG9jdW1lbnQsICdtb3VzZXVwJywgdGhpcy5yZXNpemVFbmQuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVuYmluZERvY3VtZW50UmVzaXplTGlzdGVuZXJzKCkge1xuICAgICAgICBpZiAodGhpcy5kb2N1bWVudFJlc2l6ZUxpc3RlbmVyICYmIHRoaXMuZG9jdW1lbnRSZXNpemVFbmRMaXN0ZW5lcikge1xuICAgICAgICAgICAgdGhpcy5kb2N1bWVudFJlc2l6ZUxpc3RlbmVyKCk7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50UmVzaXplRW5kTGlzdGVuZXIoKTtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRSZXNpemVMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50UmVzaXplRW5kTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYmluZEdsb2JhbExpc3RlbmVycygpIHtcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLmNsb3NlT25Fc2NhcGUgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICB0aGlzLmJpbmREb2N1bWVudEVzY2FwZUxpc3RlbmVyKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5jb25maWcucmVzaXphYmxlKSB7XG4gICAgICAgICAgICB0aGlzLmJpbmREb2N1bWVudFJlc2l6ZUxpc3RlbmVycygpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLmRyYWdnYWJsZSkge1xuICAgICAgICAgICAgdGhpcy5iaW5kRG9jdW1lbnREcmFnTGlzdGVuZXIoKTtcbiAgICAgICAgICAgIHRoaXMuYmluZERvY3VtZW50RHJhZ0VuZExpc3RlbmVyKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1bmJpbmRHbG9iYWxMaXN0ZW5lcnMoKSB7XG4gICAgICAgIHRoaXMudW5iaW5kRG9jdW1lbnRFc2NhcGVMaXN0ZW5lcigpO1xuICAgICAgICB0aGlzLnVuYmluZERvY3VtZW50UmVzaXplTGlzdGVuZXJzKCk7XG4gICAgICAgIHRoaXMudW5iaW5kRG9jdW1lbnREcmFnTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy51bmJpbmREb2N1bWVudERyYWdFbmRMaXN0ZW5lcigpO1xuICAgIH1cblxuICAgIGJpbmREb2N1bWVudEVzY2FwZUxpc3RlbmVyKCkge1xuICAgICAgICBjb25zdCBkb2N1bWVudFRhcmdldDogYW55ID0gdGhpcy5tYXNrVmlld0NoaWxkID8gdGhpcy5tYXNrVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQub3duZXJEb2N1bWVudCA6ICdkb2N1bWVudCc7XG5cbiAgICAgICAgdGhpcy5kb2N1bWVudEVzY2FwZUxpc3RlbmVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oZG9jdW1lbnRUYXJnZXQsICdrZXlkb3duJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAoZXZlbnQud2hpY2ggPT0gMjcpIHtcbiAgICAgICAgICAgICAgICBpZiAocGFyc2VJbnQoKHRoaXMuY29udGFpbmVyIGFzIEhUTUxEaXZFbGVtZW50KS5zdHlsZS56SW5kZXgpID09IFpJbmRleFV0aWxzLmdldEN1cnJlbnQoKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHVuYmluZERvY3VtZW50RXNjYXBlTGlzdGVuZXIoKSB7XG4gICAgICAgIGlmICh0aGlzLmRvY3VtZW50RXNjYXBlTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRFc2NhcGVMaXN0ZW5lcigpO1xuICAgICAgICAgICAgdGhpcy5kb2N1bWVudEVzY2FwZUxpc3RlbmVyID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVuYmluZE1hc2tDbGlja0xpc3RlbmVyKCkge1xuICAgICAgICBpZiAodGhpcy5tYXNrQ2xpY2tMaXN0ZW5lcikge1xuICAgICAgICAgICAgdGhpcy5tYXNrQ2xpY2tMaXN0ZW5lcigpO1xuICAgICAgICAgICAgdGhpcy5tYXNrQ2xpY2tMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5vbkNvbnRhaW5lckRlc3Ryb3koKTtcblxuICAgICAgICBpZiAodGhpcy5jb21wb25lbnRSZWYpIHtcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50UmVmLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRlc3Ryb3lTdHlsZSgpO1xuICAgIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBXaW5kb3dNYXhpbWl6ZUljb24sIFdpbmRvd01pbmltaXplSWNvbiwgVGltZXNJY29uLCBTaGFyZWRNb2R1bGUsIEZvY3VzVHJhcE1vZHVsZV0sXG4gICAgZGVjbGFyYXRpb25zOiBbRHluYW1pY0RpYWxvZ0NvbXBvbmVudCwgRHluYW1pY0RpYWxvZ0NvbnRlbnRdLFxuICAgIGV4cG9ydHM6IFtTaGFyZWRNb2R1bGVdXG59KVxuZXhwb3J0IGNsYXNzIER5bmFtaWNEaWFsb2dNb2R1bGUge31cbiJdfQ==