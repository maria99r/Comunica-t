import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChildren, EventEmitter, Inject, Input, NgModule, Output, PLATFORM_ID, ViewChild, ViewChildren, ViewEncapsulation, booleanAttribute, signal } from '@angular/core';
import { NavigationEnd, RouterModule } from '@angular/router';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import { DomHandler } from 'primeng/dom';
import { ChevronLeftIcon } from 'primeng/icons/chevronleft';
import { ChevronRightIcon } from 'primeng/icons/chevronright';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { ObjectUtils } from 'primeng/utils';
import { filter } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "@angular/common";
import * as i3 from "primeng/ripple";
import * as i4 from "primeng/tooltip";
/**
 * TabMenu is a navigation component that displays items as tab headers.
 * @group Components
 */
export class TabMenu {
    platformId;
    router;
    route;
    cd;
    /**
     * An array of menuitems.
     * @group Props
     */
    set model(value) {
        this._model = value;
        this._focusableItems = (this._model || []).reduce((result, item) => {
            result.push(item);
            return result;
        }, []);
    }
    get model() {
        return this._model;
    }
    /**
     * Defines the default active menuitem
     * @group Props
     */
    set activeItem(value) {
        this._activeItem = value;
        this.activeItemChange.emit(value);
        this.tabChanged = true;
    }
    get activeItem() {
        return this._activeItem;
    }
    /**
     * When enabled displays buttons at each side of the tab headers to scroll the tab list.
     * @group Props
     */
    scrollable;
    /**
     * Defines if popup mode enabled.
     */
    popup;
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
     * Defines a string value that labels an interactive element.
     * @group Props
     */
    ariaLabel;
    /**
     * Identifier of the underlying input element.
     * @group Props
     */
    ariaLabelledBy;
    /**
     * Event fired when a tab is selected.
     * @param {MenuItem} item - Menu item.
     * @group Emits
     */
    activeItemChange = new EventEmitter();
    content;
    navbar;
    inkbar;
    prevBtn;
    nextBtn;
    tabLink;
    tab;
    templates;
    itemTemplate;
    previousIconTemplate;
    nextIconTemplate;
    tabChanged;
    backwardIsDisabled = true;
    forwardIsDisabled = false;
    timerIdForAutoScroll = null;
    _focusableItems;
    _model;
    _activeItem;
    focusedItemInfo = signal(null);
    get focusableItems() {
        if (!this._focusableItems || !this._focusableItems.length) {
            this._focusableItems = (this.model || []).reduce((result, item) => {
                result.push(item);
                return result;
            }, []);
        }
        return this._focusableItems;
    }
    constructor(platformId, router, route, cd) {
        this.platformId = platformId;
        this.router = router;
        this.route = route;
        this.cd = cd;
        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
            this.cd.markForCheck();
        });
    }
    ngOnChanges(simpleChange) {
        if (simpleChange.activeItem) {
            this.autoScrollForActiveItem();
        }
    }
    ngAfterContentInit() {
        this.templates?.forEach((item) => {
            switch (item.getType()) {
                case 'item':
                    this.itemTemplate = item.template;
                    break;
                case 'nexticon':
                    this.nextIconTemplate = item.template;
                    break;
                case 'previousicon':
                    this.previousIconTemplate = item.template;
                    break;
                default:
                    this.itemTemplate = item.template;
                    break;
            }
        });
    }
    ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.updateInkBar();
            this.autoScrollForActiveItem();
            this.initButtonState();
        }
    }
    ngAfterViewChecked() {
        if (isPlatformBrowser(this.platformId)) {
            this.updateInkBar();
            this.tabChanged = false;
        }
    }
    ngOnDestroy() {
        this.clearAutoScrollHandler();
    }
    isActive(item) {
        if (item.routerLink) {
            const routerLink = Array.isArray(item.routerLink) ? item.routerLink : [item.routerLink];
            return this.router.isActive(this.router.createUrlTree(routerLink, { relativeTo: this.route }).toString(), item.routerLinkActiveOptions?.exact ?? item.routerLinkActiveOptions ?? false);
        }
        return item === this.activeItem;
    }
    getItemProp(item, name) {
        return item ? ObjectUtils.getItemValue(item[name]) : undefined;
    }
    visible(item) {
        return typeof item.visible === 'function' ? item.visible() : item.visible !== false;
    }
    disabled(item) {
        return typeof item.disabled === 'function' ? item.disabled() : item.disabled;
    }
    onMenuItemFocus(item) {
        this.focusedItemInfo.set(item);
    }
    itemClick(event, item) {
        if (item.disabled) {
            event.preventDefault();
            return;
        }
        if (!item.url && !item.routerLink) {
            event.preventDefault();
        }
        if (item.command) {
            item.command({
                originalEvent: event,
                item: item
            });
        }
        this.activeItem = item;
        this.tabChanged = true;
        this.cd.markForCheck();
    }
    onKeydownItem(event, index, item) {
        let i = index;
        let foundElement = {};
        const tabLinks = this.tabLink.toArray();
        const tabs = this.tab.toArray();
        switch (event.code) {
            case 'ArrowRight':
                foundElement = this.findNextItem(tabs, i);
                i = foundElement['i'];
                break;
            case 'ArrowLeft':
                foundElement = this.findPrevItem(tabs, i);
                i = foundElement['i'];
                break;
            case 'End':
                foundElement = this.findPrevItem(tabs, this.model.length);
                i = foundElement['i'];
                event.preventDefault();
                break;
            case 'Home':
                foundElement = this.findNextItem(tabs, -1);
                i = foundElement['i'];
                event.preventDefault();
                break;
            case 'Space':
            case 'Enter':
                this.itemClick(event, item);
                break;
            case 'Tab':
                this.onTabKeyDown(tabLinks);
                break;
            default:
                break;
        }
        if (tabLinks[i] && tabLinks[index]) {
            tabLinks[index].nativeElement.tabIndex = '-1';
            tabLinks[i].nativeElement.tabIndex = '0';
            tabLinks[i].nativeElement.focus();
        }
        this.cd.markForCheck();
    }
    onTabKeyDown(tabLinks) {
        tabLinks.forEach((item) => {
            item.nativeElement.tabIndex = DomHandler.getAttribute(item.nativeElement.parentElement, 'data-p-highlight') ? '0' : '-1';
        });
    }
    findNextItem(items, index) {
        let i = index + 1;
        if (i >= items.length) {
            return { nextItem: items[items.length], i: items.length };
        }
        let nextItem = items[i];
        if (nextItem)
            return DomHandler.getAttribute(nextItem.nativeElement, 'data-p-disabled') ? this.findNextItem(items, i) : { nextItem: nextItem.nativeElement, i };
        else
            return null;
    }
    findPrevItem(items, index) {
        let i = index - 1;
        if (i < 0) {
            return { prevItem: items[0], i: 0 };
        }
        let prevItem = items[i];
        if (prevItem)
            return DomHandler.getAttribute(prevItem.nativeElement, 'data-p-disabled') ? this.findPrevItem(items, i) : { prevItem: prevItem.nativeElement, i };
        else
            return null;
    }
    updateInkBar() {
        const tabHeader = DomHandler.findSingle(this.navbar?.nativeElement, 'li.p-highlight');
        if (tabHeader) {
            this.inkbar.nativeElement.style.width = DomHandler.getWidth(tabHeader) + 'px';
            this.inkbar.nativeElement.style.left = DomHandler.getOffset(tabHeader).left - DomHandler.getOffset(this.navbar?.nativeElement).left + 'px';
        }
    }
    getVisibleButtonWidths() {
        return [this.prevBtn?.nativeElement, this.nextBtn?.nativeElement].reduce((acc, el) => (el ? acc + DomHandler.getWidth(el) : acc), 0);
    }
    updateButtonState() {
        const content = this.content?.nativeElement;
        const { scrollLeft, scrollWidth } = content;
        const width = DomHandler.getWidth(content);
        this.backwardIsDisabled = scrollLeft === 0;
        this.forwardIsDisabled = parseInt(scrollLeft) === scrollWidth - width;
    }
    updateScrollBar(index) {
        const tabHeader = this.navbar?.nativeElement.children[index];
        if (!tabHeader) {
            return;
        }
        if (tabHeader && typeof tabHeader.scrollIntoView === 'function') {
            tabHeader.scrollIntoView({ block: 'nearest', inline: 'center' });
        }
    }
    onScroll(event) {
        this.scrollable && this.updateButtonState();
        event.preventDefault();
    }
    navBackward() {
        const content = this.content?.nativeElement;
        const width = DomHandler.getWidth(content) - this.getVisibleButtonWidths();
        const pos = content.scrollLeft - width;
        content.scrollLeft = pos <= 0 ? 0 : pos;
    }
    navForward() {
        const content = this.content?.nativeElement;
        const width = DomHandler.getWidth(content) - this.getVisibleButtonWidths();
        const pos = content.scrollLeft + width;
        const lastPos = content.scrollWidth - width;
        content.scrollLeft = pos >= lastPos ? lastPos : pos;
    }
    autoScrollForActiveItem() {
        if (!this.scrollable) {
            return;
        }
        this.clearAutoScrollHandler();
        // We have to wait for the rendering and then can scroll to element.
        this.timerIdForAutoScroll = setTimeout(() => {
            const activeItem = this.model.findIndex((menuItem) => this.isActive(menuItem));
            if (activeItem !== -1) {
                this.updateScrollBar(activeItem);
            }
        });
    }
    clearAutoScrollHandler() {
        if (this.timerIdForAutoScroll) {
            clearTimeout(this.timerIdForAutoScroll);
            this.timerIdForAutoScroll = null;
        }
    }
    initButtonState() {
        if (this.scrollable) {
            // We have to wait for the rendering and then retrieve the actual size element from the DOM.
            // in future `Promise.resolve` can be changed to `queueMicrotask` (if ie11 support will be dropped)
            Promise.resolve().then(() => {
                this.updateButtonState();
                this.cd.markForCheck();
            });
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: TabMenu, deps: [{ token: PLATFORM_ID }, { token: i1.Router }, { token: i1.ActivatedRoute }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "16.1.0", version: "18.0.1", type: TabMenu, selector: "p-tabMenu", inputs: { model: "model", activeItem: "activeItem", scrollable: ["scrollable", "scrollable", booleanAttribute], popup: ["popup", "popup", booleanAttribute], style: "style", styleClass: "styleClass", ariaLabel: "ariaLabel", ariaLabelledBy: "ariaLabelledBy" }, outputs: { activeItemChange: "activeItemChange" }, host: { classAttribute: "p-element" }, queries: [{ propertyName: "templates", predicate: PrimeTemplate }], viewQueries: [{ propertyName: "content", first: true, predicate: ["content"], descendants: true }, { propertyName: "navbar", first: true, predicate: ["navbar"], descendants: true }, { propertyName: "inkbar", first: true, predicate: ["inkbar"], descendants: true }, { propertyName: "prevBtn", first: true, predicate: ["prevBtn"], descendants: true }, { propertyName: "nextBtn", first: true, predicate: ["nextBtn"], descendants: true }, { propertyName: "tabLink", predicate: ["tabLink"], descendants: true }, { propertyName: "tab", predicate: ["tab"], descendants: true }], usesOnChanges: true, ngImport: i0, template: `
        <div [ngClass]="{ 'p-tabmenu p-component': true, 'p-tabmenu-scrollable': scrollable }" [ngStyle]="style" [class]="styleClass">
            <div class="p-tabmenu-nav-container">
                <button *ngIf="scrollable && !backwardIsDisabled" #prevBtn class="p-tabmenu-nav-prev p-tabmenu-nav-btn p-link" (click)="navBackward()" type="button" role="navigation" pRipple>
                    <ChevronLeftIcon *ngIf="!previousIconTemplate" [attr.aria-hidden]="true" />
                    <ng-template *ngTemplateOutlet="previousIconTemplate"></ng-template>
                </button>
                <div #content class="p-tabmenu-nav-content" (scroll)="onScroll($event)">
                    <ul #navbar class="p-tabmenu-nav p-reset" role="menubar" [attr.aria-labelledby]="ariaLabelledBy" [attr.aria-label]="ariaLabel">
                        <li
                            #tab
                            *ngFor="let item of focusableItems; let i = index"
                            role="presentation"
                            [ngStyle]="item.style"
                            [class]="item.styleClass"
                            [attr.data-p-disabled]="disabled(item)"
                            [attr.data-p-highlight]="focusedItemInfo() === item"
                            (click)="itemClick($event, item)"
                            (keydown)="onKeydownItem($event, i, item)"
                            (focus)="onMenuItemFocus(item)"
                            [ngClass]="{ 'p-tabmenuitem': true, 'p-disabled': getItemProp(item, 'disabled'), 'p-highlight': isActive(item), 'p-hidden': item.visible === false }"
                            pTooltip
                            [tooltipOptions]="item.tooltipOptions"
                        >
                            <a
                                #tabLink
                                *ngIf="!item.routerLink && !itemTemplate"
                                class="p-menuitem-link"
                                role="menuitem"
                                [attr.href]="getItemProp(item, 'url')"
                                [attr.id]="getItemProp(item, 'id')"
                                [attr.aria-disabled]="disabled(item)"
                                [attr.aria-label]="getItemProp(item, 'label')"
                                [attr.tabindex]="disabled(item) ? -1 : 0"
                                [target]="getItemProp(item, 'target')"
                                pRipple
                            >
                                <ng-container>
                                    <span class="p-menuitem-icon" [ngClass]="item.icon" *ngIf="item.icon" [ngStyle]="item.iconStyle"></span>
                                    <span class="p-menuitem-text" *ngIf="item.escape !== false; else htmlLabel">{{ getItemProp(item, 'label') }}</span>
                                    <ng-template #htmlLabel><span class="p-menuitem-text" [innerHTML]="getItemProp(item, 'label')"></span></ng-template>
                                    <span class="p-menuitem-badge" *ngIf="item.badge" [ngClass]="item.badgeStyleClass">{{ getItemProp(item, 'badge') }}</span>
                                </ng-container>
                            </a>
                            <a
                                #tabLink
                                *ngIf="item.routerLink && !itemTemplate"
                                [routerLink]="item.routerLink"
                                [queryParams]="item.queryParams"
                                [routerLinkActive]="'p-menuitem-link-active'"
                                [routerLinkActiveOptions]="item.routerLinkActiveOptions || { exact: false }"
                                role="menuitem"
                                class="p-menuitem-link"
                                [target]="item.target"
                                [attr.id]="getItemProp(item, 'id')"
                                [attr.aria-disabled]="disabled(item)"
                                [attr.aria-label]="getItemProp(item, 'label')"
                                [attr.tabindex]="disabled(item) ? -1 : 0"
                                [fragment]="item.fragment"
                                [queryParamsHandling]="item.queryParamsHandling"
                                [preserveFragment]="item.preserveFragment"
                                [skipLocationChange]="item.skipLocationChange"
                                [replaceUrl]="item.replaceUrl"
                                [state]="item.state"
                                pRipple
                            >
                                <ng-container>
                                    <span class="p-menuitem-icon" [attr.aria-hidden]="true" [ngClass]="item.icon" *ngIf="item.icon" [ngStyle]="item.iconStyle"></span>
                                    <span class="p-menuitem-text" *ngIf="item.escape !== false; else htmlRouteLabel">{{ getItemProp(item, 'label') }}</span>
                                    <ng-template #htmlRouteLabel><span class="p-menuitem-text" [innerHTML]="getItemProp(item, 'label')"></span></ng-template>
                                    <span class="p-menuitem-badge" *ngIf="item.badge" [ngClass]="item.badgeStyleClass">{{ getItemProp(item, 'badge') }}</span>
                                </ng-container>
                            </a>
                            <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item, index: i }"></ng-container>
                        </li>
                        <li #inkbar class="p-tabmenu-ink-bar" role="none"></li>
                    </ul>
                </div>
                <button *ngIf="scrollable && !forwardIsDisabled" #nextBtn class="p-tabmenu-nav-next p-tabmenu-nav-btn p-link" (click)="navForward()" type="button" role="navigation" pRipple>
                    <ChevronRightIcon *ngIf="!previousIconTemplate" [attr.aria-hidden]="true" />
                    <ng-template *ngTemplateOutlet="nextIconTemplate"></ng-template>
                </button>
            </div>
        </div>
    `, isInline: true, styles: ["@layer primeng{.p-tabmenu-nav-container{position:relative}.p-tabmenu-scrollable .p-tabmenu-nav-container{overflow:hidden}.p-tabmenu-nav-content{overflow-x:auto;overflow-y:hidden;scroll-behavior:smooth;scrollbar-width:none;overscroll-behavior:contain auto}.p-tabmenu-nav-btn{position:absolute;top:0;z-index:2;height:100%;display:flex;align-items:center;justify-content:center}.p-tabmenu-nav-prev{left:0}.p-tabmenu-nav-next{right:0}.p-tabview-nav-content::-webkit-scrollbar{display:none}.p-tabmenu-nav{display:flex;margin:0;padding:0;list-style-type:none;flex-wrap:nowrap}.p-tabmenu-nav a{cursor:pointer;-webkit-user-select:none;user-select:none;display:flex;align-items:center;position:relative;text-decoration:none;overflow:hidden}.p-tabmenu-nav a:focus{z-index:1}.p-tabmenu-nav .p-menuitem-text{line-height:1;white-space:nowrap}.p-tabmenu-ink-bar{display:none;z-index:1}.p-tabmenu-nav-content::-webkit-scrollbar{display:none}.p-tabmenuitem:not(.p-hidden){display:flex}}\n"], dependencies: [{ kind: "directive", type: i0.forwardRef(() => i2.NgClass), selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i0.forwardRef(() => i2.NgForOf), selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i0.forwardRef(() => i2.NgIf), selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i0.forwardRef(() => i2.NgTemplateOutlet), selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i0.forwardRef(() => i2.NgStyle), selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i0.forwardRef(() => i1.RouterLink), selector: "[routerLink]", inputs: ["target", "queryParams", "fragment", "queryParamsHandling", "state", "info", "relativeTo", "preserveFragment", "skipLocationChange", "replaceUrl", "routerLink"] }, { kind: "directive", type: i0.forwardRef(() => i1.RouterLinkActive), selector: "[routerLinkActive]", inputs: ["routerLinkActiveOptions", "ariaCurrentWhenActive", "routerLinkActive"], outputs: ["isActiveChange"], exportAs: ["routerLinkActive"] }, { kind: "directive", type: i0.forwardRef(() => i3.Ripple), selector: "[pRipple]" }, { kind: "directive", type: i0.forwardRef(() => i4.Tooltip), selector: "[pTooltip]", inputs: ["tooltipPosition", "tooltipEvent", "appendTo", "positionStyle", "tooltipStyleClass", "tooltipZIndex", "escape", "showDelay", "hideDelay", "life", "positionTop", "positionLeft", "autoHide", "fitContent", "hideOnEscape", "pTooltip", "tooltipDisabled", "tooltipOptions"] }, { kind: "component", type: i0.forwardRef(() => ChevronLeftIcon), selector: "ChevronLeftIcon" }, { kind: "component", type: i0.forwardRef(() => ChevronRightIcon), selector: "ChevronRightIcon" }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: TabMenu, decorators: [{
            type: Component,
            args: [{ selector: 'p-tabMenu', template: `
        <div [ngClass]="{ 'p-tabmenu p-component': true, 'p-tabmenu-scrollable': scrollable }" [ngStyle]="style" [class]="styleClass">
            <div class="p-tabmenu-nav-container">
                <button *ngIf="scrollable && !backwardIsDisabled" #prevBtn class="p-tabmenu-nav-prev p-tabmenu-nav-btn p-link" (click)="navBackward()" type="button" role="navigation" pRipple>
                    <ChevronLeftIcon *ngIf="!previousIconTemplate" [attr.aria-hidden]="true" />
                    <ng-template *ngTemplateOutlet="previousIconTemplate"></ng-template>
                </button>
                <div #content class="p-tabmenu-nav-content" (scroll)="onScroll($event)">
                    <ul #navbar class="p-tabmenu-nav p-reset" role="menubar" [attr.aria-labelledby]="ariaLabelledBy" [attr.aria-label]="ariaLabel">
                        <li
                            #tab
                            *ngFor="let item of focusableItems; let i = index"
                            role="presentation"
                            [ngStyle]="item.style"
                            [class]="item.styleClass"
                            [attr.data-p-disabled]="disabled(item)"
                            [attr.data-p-highlight]="focusedItemInfo() === item"
                            (click)="itemClick($event, item)"
                            (keydown)="onKeydownItem($event, i, item)"
                            (focus)="onMenuItemFocus(item)"
                            [ngClass]="{ 'p-tabmenuitem': true, 'p-disabled': getItemProp(item, 'disabled'), 'p-highlight': isActive(item), 'p-hidden': item.visible === false }"
                            pTooltip
                            [tooltipOptions]="item.tooltipOptions"
                        >
                            <a
                                #tabLink
                                *ngIf="!item.routerLink && !itemTemplate"
                                class="p-menuitem-link"
                                role="menuitem"
                                [attr.href]="getItemProp(item, 'url')"
                                [attr.id]="getItemProp(item, 'id')"
                                [attr.aria-disabled]="disabled(item)"
                                [attr.aria-label]="getItemProp(item, 'label')"
                                [attr.tabindex]="disabled(item) ? -1 : 0"
                                [target]="getItemProp(item, 'target')"
                                pRipple
                            >
                                <ng-container>
                                    <span class="p-menuitem-icon" [ngClass]="item.icon" *ngIf="item.icon" [ngStyle]="item.iconStyle"></span>
                                    <span class="p-menuitem-text" *ngIf="item.escape !== false; else htmlLabel">{{ getItemProp(item, 'label') }}</span>
                                    <ng-template #htmlLabel><span class="p-menuitem-text" [innerHTML]="getItemProp(item, 'label')"></span></ng-template>
                                    <span class="p-menuitem-badge" *ngIf="item.badge" [ngClass]="item.badgeStyleClass">{{ getItemProp(item, 'badge') }}</span>
                                </ng-container>
                            </a>
                            <a
                                #tabLink
                                *ngIf="item.routerLink && !itemTemplate"
                                [routerLink]="item.routerLink"
                                [queryParams]="item.queryParams"
                                [routerLinkActive]="'p-menuitem-link-active'"
                                [routerLinkActiveOptions]="item.routerLinkActiveOptions || { exact: false }"
                                role="menuitem"
                                class="p-menuitem-link"
                                [target]="item.target"
                                [attr.id]="getItemProp(item, 'id')"
                                [attr.aria-disabled]="disabled(item)"
                                [attr.aria-label]="getItemProp(item, 'label')"
                                [attr.tabindex]="disabled(item) ? -1 : 0"
                                [fragment]="item.fragment"
                                [queryParamsHandling]="item.queryParamsHandling"
                                [preserveFragment]="item.preserveFragment"
                                [skipLocationChange]="item.skipLocationChange"
                                [replaceUrl]="item.replaceUrl"
                                [state]="item.state"
                                pRipple
                            >
                                <ng-container>
                                    <span class="p-menuitem-icon" [attr.aria-hidden]="true" [ngClass]="item.icon" *ngIf="item.icon" [ngStyle]="item.iconStyle"></span>
                                    <span class="p-menuitem-text" *ngIf="item.escape !== false; else htmlRouteLabel">{{ getItemProp(item, 'label') }}</span>
                                    <ng-template #htmlRouteLabel><span class="p-menuitem-text" [innerHTML]="getItemProp(item, 'label')"></span></ng-template>
                                    <span class="p-menuitem-badge" *ngIf="item.badge" [ngClass]="item.badgeStyleClass">{{ getItemProp(item, 'badge') }}</span>
                                </ng-container>
                            </a>
                            <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item, index: i }"></ng-container>
                        </li>
                        <li #inkbar class="p-tabmenu-ink-bar" role="none"></li>
                    </ul>
                </div>
                <button *ngIf="scrollable && !forwardIsDisabled" #nextBtn class="p-tabmenu-nav-next p-tabmenu-nav-btn p-link" (click)="navForward()" type="button" role="navigation" pRipple>
                    <ChevronRightIcon *ngIf="!previousIconTemplate" [attr.aria-hidden]="true" />
                    <ng-template *ngTemplateOutlet="nextIconTemplate"></ng-template>
                </button>
            </div>
        </div>
    `, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: ["@layer primeng{.p-tabmenu-nav-container{position:relative}.p-tabmenu-scrollable .p-tabmenu-nav-container{overflow:hidden}.p-tabmenu-nav-content{overflow-x:auto;overflow-y:hidden;scroll-behavior:smooth;scrollbar-width:none;overscroll-behavior:contain auto}.p-tabmenu-nav-btn{position:absolute;top:0;z-index:2;height:100%;display:flex;align-items:center;justify-content:center}.p-tabmenu-nav-prev{left:0}.p-tabmenu-nav-next{right:0}.p-tabview-nav-content::-webkit-scrollbar{display:none}.p-tabmenu-nav{display:flex;margin:0;padding:0;list-style-type:none;flex-wrap:nowrap}.p-tabmenu-nav a{cursor:pointer;-webkit-user-select:none;user-select:none;display:flex;align-items:center;position:relative;text-decoration:none;overflow:hidden}.p-tabmenu-nav a:focus{z-index:1}.p-tabmenu-nav .p-menuitem-text{line-height:1;white-space:nowrap}.p-tabmenu-ink-bar{display:none;z-index:1}.p-tabmenu-nav-content::-webkit-scrollbar{display:none}.p-tabmenuitem:not(.p-hidden){display:flex}}\n"] }]
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i1.Router }, { type: i1.ActivatedRoute }, { type: i0.ChangeDetectorRef }], propDecorators: { model: [{
                type: Input
            }], activeItem: [{
                type: Input
            }], scrollable: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], popup: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], ariaLabel: [{
                type: Input
            }], ariaLabelledBy: [{
                type: Input
            }], activeItemChange: [{
                type: Output
            }], content: [{
                type: ViewChild,
                args: ['content']
            }], navbar: [{
                type: ViewChild,
                args: ['navbar']
            }], inkbar: [{
                type: ViewChild,
                args: ['inkbar']
            }], prevBtn: [{
                type: ViewChild,
                args: ['prevBtn']
            }], nextBtn: [{
                type: ViewChild,
                args: ['nextBtn']
            }], tabLink: [{
                type: ViewChildren,
                args: ['tabLink']
            }], tab: [{
                type: ViewChildren,
                args: ['tab']
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }] } });
export class TabMenuModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: TabMenuModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: TabMenuModule, declarations: [TabMenu], imports: [CommonModule, RouterModule, SharedModule, RippleModule, TooltipModule, ChevronLeftIcon, ChevronRightIcon], exports: [TabMenu, RouterModule, SharedModule, TooltipModule] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: TabMenuModule, imports: [CommonModule, RouterModule, SharedModule, RippleModule, TooltipModule, ChevronLeftIcon, ChevronRightIcon, RouterModule, SharedModule, TooltipModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: TabMenuModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, RouterModule, SharedModule, RippleModule, TooltipModule, ChevronLeftIcon, ChevronRightIcon],
                    exports: [TabMenu, RouterModule, SharedModule, TooltipModule],
                    declarations: [TabMenu]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibWVudS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy90YWJtZW51L3RhYm1lbnUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ2xFLE9BQU8sRUFJSCx1QkFBdUIsRUFFdkIsU0FBUyxFQUNULGVBQWUsRUFFZixZQUFZLEVBQ1osTUFBTSxFQUNOLEtBQUssRUFDTCxRQUFRLEVBRVIsTUFBTSxFQUNOLFdBQVcsRUFJWCxTQUFTLEVBQ1QsWUFBWSxFQUNaLGlCQUFpQixFQUNqQixnQkFBZ0IsRUFDaEIsTUFBTSxFQUNULE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBa0IsYUFBYSxFQUFVLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3RGLE9BQU8sRUFBWSxhQUFhLEVBQUUsWUFBWSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ3BFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDekMsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQzVELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQzlELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFaEQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM1QyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7Ozs7OztBQUV4Qzs7O0dBR0c7QUErRkgsTUFBTSxPQUFPLE9BQU87SUFtSGlCO0lBQ3JCO0lBQ0E7SUFDQTtJQXJIWjs7O09BR0c7SUFDSCxJQUFhLEtBQUssQ0FBQyxLQUE2QjtRQUM1QyxJQUFJLENBQUMsTUFBTSxHQUFHLEtB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LEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLGVBQWUsRUFBRSxnQkFBZ0IsRUFDL0YsWUFBWSxFQUFFLFlBQVksRUFBRSxhQUFhOzsyRkFHbkQsYUFBYTtrQkFMekIsUUFBUTttQkFBQztvQkFDTixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLGVBQWUsRUFBRSxnQkFBZ0IsQ0FBQztvQkFDbkgsT0FBTyxFQUFFLENBQUMsT0FBTyxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsYUFBYSxDQUFDO29CQUM3RCxZQUFZLEVBQUUsQ0FBQyxPQUFPLENBQUM7aUJBQzFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlLCBpc1BsYXRmb3JtQnJvd3NlciB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICAgIEFmdGVyQ29udGVudEluaXQsXG4gICAgQWZ0ZXJWaWV3Q2hlY2tlZCxcbiAgICBBZnRlclZpZXdJbml0LFxuICAgIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICAgIENoYW5nZURldGVjdG9yUmVmLFxuICAgIENvbXBvbmVudCxcbiAgICBDb250ZW50Q2hpbGRyZW4sXG4gICAgRWxlbWVudFJlZixcbiAgICBFdmVudEVtaXR0ZXIsXG4gICAgSW5qZWN0LFxuICAgIElucHV0LFxuICAgIE5nTW9kdWxlLFxuICAgIE9uRGVzdHJveSxcbiAgICBPdXRwdXQsXG4gICAgUExBVEZPUk1fSUQsXG4gICAgUXVlcnlMaXN0LFxuICAgIFNpbXBsZUNoYW5nZXMsXG4gICAgVGVtcGxhdGVSZWYsXG4gICAgVmlld0NoaWxkLFxuICAgIFZpZXdDaGlsZHJlbixcbiAgICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgICBib29sZWFuQXR0cmlidXRlLFxuICAgIHNpZ25hbFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlLCBOYXZpZ2F0aW9uRW5kLCBSb3V0ZXIsIFJvdXRlck1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBNZW51SXRlbSwgUHJpbWVUZW1wbGF0ZSwgU2hhcmVkTW9kdWxlIH0gZnJvbSAncHJpbWVuZy9hcGknO1xuaW1wb3J0IHsgRG9tSGFuZGxlciB9IGZyb20gJ3ByaW1lbmcvZG9tJztcbmltcG9ydCB7IENoZXZyb25MZWZ0SWNvbiB9IGZyb20gJ3ByaW1lbmcvaWNvbnMvY2hldnJvbmxlZnQnO1xuaW1wb3J0IHsgQ2hldnJvblJpZ2h0SWNvbiB9IGZyb20gJ3ByaW1lbmcvaWNvbnMvY2hldnJvbnJpZ2h0JztcbmltcG9ydCB7IFJpcHBsZU1vZHVsZSB9IGZyb20gJ3ByaW1lbmcvcmlwcGxlJztcbmltcG9ydCB7IFRvb2x0aXBNb2R1bGUgfSBmcm9tICdwcmltZW5nL3Rvb2x0aXAnO1xuaW1wb3J0IHsgTnVsbGFibGUgfSBmcm9tICdwcmltZW5nL3RzLWhlbHBlcnMnO1xuaW1wb3J0IHsgT2JqZWN0VXRpbHMgfSBmcm9tICdwcmltZW5nL3V0aWxzJztcbmltcG9ydCB7IGZpbHRlciB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuLyoqXG4gKiBUYWJNZW51IGlzIGEgbmF2aWdhdGlvbiBjb21wb25lbnQgdGhhdCBkaXNwbGF5cyBpdGVtcyBhcyB0YWIgaGVhZGVycy5cbiAqIEBncm91cCBDb21wb25lbnRzXG4gKi9cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC10YWJNZW51JyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8ZGl2IFtuZ0NsYXNzXT1cInsgJ3AtdGFibWVudSBwLWNvbXBvbmVudCc6IHRydWUsICdwLXRhYm1lbnUtc2Nyb2xsYWJsZSc6IHNjcm9sbGFibGUgfVwiIFtuZ1N0eWxlXT1cInN0eWxlXCIgW2NsYXNzXT1cInN0eWxlQ2xhc3NcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwLXRhYm1lbnUtbmF2LWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgIDxidXR0b24gKm5nSWY9XCJzY3JvbGxhYmxlICYmICFiYWNrd2FyZElzRGlzYWJsZWRcIiAjcHJldkJ0biBjbGFzcz1cInAtdGFibWVudS1uYXYtcHJldiBwLXRhYm1lbnUtbmF2LWJ0biBwLWxpbmtcIiAoY2xpY2spPVwibmF2QmFja3dhcmQoKVwiIHR5cGU9XCJidXR0b25cIiByb2xlPVwibmF2aWdhdGlvblwiIHBSaXBwbGU+XG4gICAgICAgICAgICAgICAgICAgIDxDaGV2cm9uTGVmdEljb24gKm5nSWY9XCIhcHJldmlvdXNJY29uVGVtcGxhdGVcIiBbYXR0ci5hcmlhLWhpZGRlbl09XCJ0cnVlXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlICpuZ1RlbXBsYXRlT3V0bGV0PVwicHJldmlvdXNJY29uVGVtcGxhdGVcIj48L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxkaXYgI2NvbnRlbnQgY2xhc3M9XCJwLXRhYm1lbnUtbmF2LWNvbnRlbnRcIiAoc2Nyb2xsKT1cIm9uU2Nyb2xsKCRldmVudClcIj5cbiAgICAgICAgICAgICAgICAgICAgPHVsICNuYXZiYXIgY2xhc3M9XCJwLXRhYm1lbnUtbmF2IHAtcmVzZXRcIiByb2xlPVwibWVudWJhclwiIFthdHRyLmFyaWEtbGFiZWxsZWRieV09XCJhcmlhTGFiZWxsZWRCeVwiIFthdHRyLmFyaWEtbGFiZWxdPVwiYXJpYUxhYmVsXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAjdGFiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKm5nRm9yPVwibGV0IGl0ZW0gb2YgZm9jdXNhYmxlSXRlbXM7IGxldCBpID0gaW5kZXhcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvbGU9XCJwcmVzZW50YXRpb25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtuZ1N0eWxlXT1cIml0ZW0uc3R5bGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtjbGFzc109XCJpdGVtLnN0eWxlQ2xhc3NcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFthdHRyLmRhdGEtcC1kaXNhYmxlZF09XCJkaXNhYmxlZChpdGVtKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW2F0dHIuZGF0YS1wLWhpZ2hsaWdodF09XCJmb2N1c2VkSXRlbUluZm8oKSA9PT0gaXRlbVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNsaWNrKT1cIml0ZW1DbGljaygkZXZlbnQsIGl0ZW0pXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoa2V5ZG93bik9XCJvbktleWRvd25JdGVtKCRldmVudCwgaSwgaXRlbSlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmb2N1cyk9XCJvbk1lbnVJdGVtRm9jdXMoaXRlbSlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cInsgJ3AtdGFibWVudWl0ZW0nOiB0cnVlLCAncC1kaXNhYmxlZCc6IGdldEl0ZW1Qcm9wKGl0ZW0sICdkaXNhYmxlZCcpLCAncC1oaWdobGlnaHQnOiBpc0FjdGl2ZShpdGVtKSwgJ3AtaGlkZGVuJzogaXRlbS52aXNpYmxlID09PSBmYWxzZSB9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwVG9vbHRpcFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFt0b29sdGlwT3B0aW9uc109XCJpdGVtLnRvb2x0aXBPcHRpb25zXCJcbiAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjdGFiTGlua1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqbmdJZj1cIiFpdGVtLnJvdXRlckxpbmsgJiYgIWl0ZW1UZW1wbGF0ZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwicC1tZW51aXRlbS1saW5rXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9sZT1cIm1lbnVpdGVtXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW2F0dHIuaHJlZl09XCJnZXRJdGVtUHJvcChpdGVtLCAndXJsJylcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbYXR0ci5pZF09XCJnZXRJdGVtUHJvcChpdGVtLCAnaWQnKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFthdHRyLmFyaWEtZGlzYWJsZWRdPVwiZGlzYWJsZWQoaXRlbSlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImdldEl0ZW1Qcm9wKGl0ZW0sICdsYWJlbCcpXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW2F0dHIudGFiaW5kZXhdPVwiZGlzYWJsZWQoaXRlbSkgPyAtMSA6IDBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbdGFyZ2V0XT1cImdldEl0ZW1Qcm9wKGl0ZW0sICd0YXJnZXQnKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBSaXBwbGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtbWVudWl0ZW0taWNvblwiIFtuZ0NsYXNzXT1cIml0ZW0uaWNvblwiICpuZ0lmPVwiaXRlbS5pY29uXCIgW25nU3R5bGVdPVwiaXRlbS5pY29uU3R5bGVcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtbWVudWl0ZW0tdGV4dFwiICpuZ0lmPVwiaXRlbS5lc2NhcGUgIT09IGZhbHNlOyBlbHNlIGh0bWxMYWJlbFwiPnt7IGdldEl0ZW1Qcm9wKGl0ZW0sICdsYWJlbCcpIH19PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlICNodG1sTGFiZWw+PHNwYW4gY2xhc3M9XCJwLW1lbnVpdGVtLXRleHRcIiBbaW5uZXJIVE1MXT1cImdldEl0ZW1Qcm9wKGl0ZW0sICdsYWJlbCcpXCI+PC9zcGFuPjwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtbWVudWl0ZW0tYmFkZ2VcIiAqbmdJZj1cIml0ZW0uYmFkZ2VcIiBbbmdDbGFzc109XCJpdGVtLmJhZGdlU3R5bGVDbGFzc1wiPnt7IGdldEl0ZW1Qcm9wKGl0ZW0sICdiYWRnZScpIH19PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI3RhYkxpbmtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKm5nSWY9XCJpdGVtLnJvdXRlckxpbmsgJiYgIWl0ZW1UZW1wbGF0ZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtyb3V0ZXJMaW5rXT1cIml0ZW0ucm91dGVyTGlua1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtxdWVyeVBhcmFtc109XCJpdGVtLnF1ZXJ5UGFyYW1zXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW3JvdXRlckxpbmtBY3RpdmVdPVwiJ3AtbWVudWl0ZW0tbGluay1hY3RpdmUnXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW3JvdXRlckxpbmtBY3RpdmVPcHRpb25zXT1cIml0ZW0ucm91dGVyTGlua0FjdGl2ZU9wdGlvbnMgfHwgeyBleGFjdDogZmFsc2UgfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvbGU9XCJtZW51aXRlbVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwicC1tZW51aXRlbS1saW5rXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW3RhcmdldF09XCJpdGVtLnRhcmdldFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFthdHRyLmlkXT1cImdldEl0ZW1Qcm9wKGl0ZW0sICdpZCcpXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW2F0dHIuYXJpYS1kaXNhYmxlZF09XCJkaXNhYmxlZChpdGVtKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiZ2V0SXRlbVByb3AoaXRlbSwgJ2xhYmVsJylcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbYXR0ci50YWJpbmRleF09XCJkaXNhYmxlZChpdGVtKSA/IC0xIDogMFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtmcmFnbWVudF09XCJpdGVtLmZyYWdtZW50XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW3F1ZXJ5UGFyYW1zSGFuZGxpbmddPVwiaXRlbS5xdWVyeVBhcmFtc0hhbmRsaW5nXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW3ByZXNlcnZlRnJhZ21lbnRdPVwiaXRlbS5wcmVzZXJ2ZUZyYWdtZW50XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW3NraXBMb2NhdGlvbkNoYW5nZV09XCJpdGVtLnNraXBMb2NhdGlvbkNoYW5nZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtyZXBsYWNlVXJsXT1cIml0ZW0ucmVwbGFjZVVybFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtzdGF0ZV09XCJpdGVtLnN0YXRlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcFJpcHBsZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC1tZW51aXRlbS1pY29uXCIgW2F0dHIuYXJpYS1oaWRkZW5dPVwidHJ1ZVwiIFtuZ0NsYXNzXT1cIml0ZW0uaWNvblwiICpuZ0lmPVwiaXRlbS5pY29uXCIgW25nU3R5bGVdPVwiaXRlbS5pY29uU3R5bGVcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtbWVudWl0ZW0tdGV4dFwiICpuZ0lmPVwiaXRlbS5lc2NhcGUgIT09IGZhbHNlOyBlbHNlIGh0bWxSb3V0ZUxhYmVsXCI+e3sgZ2V0SXRlbVByb3AoaXRlbSwgJ2xhYmVsJykgfX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgI2h0bWxSb3V0ZUxhYmVsPjxzcGFuIGNsYXNzPVwicC1tZW51aXRlbS10ZXh0XCIgW2lubmVySFRNTF09XCJnZXRJdGVtUHJvcChpdGVtLCAnbGFiZWwnKVwiPjwvc3Bhbj48L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwLW1lbnVpdGVtLWJhZGdlXCIgKm5nSWY9XCJpdGVtLmJhZGdlXCIgW25nQ2xhc3NdPVwiaXRlbS5iYWRnZVN0eWxlQ2xhc3NcIj57eyBnZXRJdGVtUHJvcChpdGVtLCAnYmFkZ2UnKSB9fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJpdGVtVGVtcGxhdGU7IGNvbnRleHQ6IHsgJGltcGxpY2l0OiBpdGVtLCBpbmRleDogaSB9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpICNpbmtiYXIgY2xhc3M9XCJwLXRhYm1lbnUtaW5rLWJhclwiIHJvbGU9XCJub25lXCI+PC9saT5cbiAgICAgICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uICpuZ0lmPVwic2Nyb2xsYWJsZSAmJiAhZm9yd2FyZElzRGlzYWJsZWRcIiAjbmV4dEJ0biBjbGFzcz1cInAtdGFibWVudS1uYXYtbmV4dCBwLXRhYm1lbnUtbmF2LWJ0biBwLWxpbmtcIiAoY2xpY2spPVwibmF2Rm9yd2FyZCgpXCIgdHlwZT1cImJ1dHRvblwiIHJvbGU9XCJuYXZpZ2F0aW9uXCIgcFJpcHBsZT5cbiAgICAgICAgICAgICAgICAgICAgPENoZXZyb25SaWdodEljb24gKm5nSWY9XCIhcHJldmlvdXNJY29uVGVtcGxhdGVcIiBbYXR0ci5hcmlhLWhpZGRlbl09XCJ0cnVlXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlICpuZ1RlbXBsYXRlT3V0bGV0PVwibmV4dEljb25UZW1wbGF0ZVwiPjwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgYCxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAgIHN0eWxlVXJsczogWycuL3RhYm1lbnUuY3NzJ10sXG4gICAgaG9zdDoge1xuICAgICAgICBjbGFzczogJ3AtZWxlbWVudCdcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIFRhYk1lbnUgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBBZnRlclZpZXdJbml0LCBBZnRlclZpZXdDaGVja2VkLCBPbkRlc3Ryb3kge1xuICAgIC8qKlxuICAgICAqIEFuIGFycmF5IG9mIG1lbnVpdGVtcy5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBzZXQgbW9kZWwodmFsdWU6IE1lbnVJdGVtW10gfCB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5fbW9kZWwgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5fZm9jdXNhYmxlSXRlbXMgPSAodGhpcy5fbW9kZWwgfHwgW10pLnJlZHVjZSgocmVzdWx0LCBpdGVtKSA9PiB7XG4gICAgICAgICAgICByZXN1bHQucHVzaChpdGVtKTtcblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSwgW10pO1xuICAgIH1cbiAgICBnZXQgbW9kZWwoKTogTWVudUl0ZW1bXSB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tb2RlbDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRGVmaW5lcyB0aGUgZGVmYXVsdCBhY3RpdmUgbWVudWl0ZW1cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBzZXQgYWN0aXZlSXRlbSh2YWx1ZTogTWVudUl0ZW0gfCB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5fYWN0aXZlSXRlbSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmFjdGl2ZUl0ZW1DaGFuZ2UuZW1pdCh2YWx1ZSk7XG4gICAgICAgIHRoaXMudGFiQ2hhbmdlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgZ2V0IGFjdGl2ZUl0ZW0oKTogTWVudUl0ZW0gfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWN0aXZlSXRlbTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogV2hlbiBlbmFibGVkIGRpc3BsYXlzIGJ1dHRvbnMgYXQgZWFjaCBzaWRlIG9mIHRoZSB0YWIgaGVhZGVycyB0byBzY3JvbGwgdGhlIHRhYiBsaXN0LlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCh7IHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZSB9KSBzY3JvbGxhYmxlOiBib29sZWFuIHwgdW5kZWZpbmVkO1xuICAgIC8qKlxuICAgICAqIERlZmluZXMgaWYgcG9wdXAgbW9kZSBlbmFibGVkLlxuICAgICAqL1xuICAgIEBJbnB1dCh7IHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZSB9KSBwb3B1cDogYm9vbGVhbiB8IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBJbmxpbmUgc3R5bGUgb2YgdGhlIGVsZW1lbnQuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgc3R5bGU6IHsgW2tsYXNzOiBzdHJpbmddOiBhbnkgfSB8IG51bGwgfCB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogQ2xhc3Mgb2YgdGhlIGVsZW1lbnQuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgc3R5bGVDbGFzczogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgIC8qKlxuICAgICAqIERlZmluZXMgYSBzdHJpbmcgdmFsdWUgdGhhdCBsYWJlbHMgYW4gaW50ZXJhY3RpdmUgZWxlbWVudC5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBhcmlhTGFiZWw6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBJZGVudGlmaWVyIG9mIHRoZSB1bmRlcmx5aW5nIGlucHV0IGVsZW1lbnQuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgYXJpYUxhYmVsbGVkQnk6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBFdmVudCBmaXJlZCB3aGVuIGEgdGFiIGlzIHNlbGVjdGVkLlxuICAgICAqIEBwYXJhbSB7TWVudUl0ZW19IGl0ZW0gLSBNZW51IGl0ZW0uXG4gICAgICogQGdyb3VwIEVtaXRzXG4gICAgICovXG4gICAgQE91dHB1dCgpIGFjdGl2ZUl0ZW1DaGFuZ2U6IEV2ZW50RW1pdHRlcjxNZW51SXRlbT4gPSBuZXcgRXZlbnRFbWl0dGVyPE1lbnVJdGVtPigpO1xuXG4gICAgQFZpZXdDaGlsZCgnY29udGVudCcpIGNvbnRlbnQ6IE51bGxhYmxlPEVsZW1lbnRSZWY+O1xuXG4gICAgQFZpZXdDaGlsZCgnbmF2YmFyJykgbmF2YmFyOiBOdWxsYWJsZTxFbGVtZW50UmVmPjtcblxuICAgIEBWaWV3Q2hpbGQoJ2lua2JhcicpIGlua2JhcjogTnVsbGFibGU8RWxlbWVudFJlZj47XG5cbiAgICBAVmlld0NoaWxkKCdwcmV2QnRuJykgcHJldkJ0bjogTnVsbGFibGU8RWxlbWVudFJlZj47XG5cbiAgICBAVmlld0NoaWxkKCduZXh0QnRuJykgbmV4dEJ0bjogTnVsbGFibGU8RWxlbWVudFJlZj47XG5cbiAgICBAVmlld0NoaWxkcmVuKCd0YWJMaW5rJykgdGFiTGluazogTnVsbGFibGU8UXVlcnlMaXN0PEVsZW1lbnRSZWY+PjtcblxuICAgIEBWaWV3Q2hpbGRyZW4oJ3RhYicpIHRhYjogTnVsbGFibGU8UXVlcnlMaXN0PEVsZW1lbnRSZWY+PjtcblxuICAgIEBDb250ZW50Q2hpbGRyZW4oUHJpbWVUZW1wbGF0ZSkgdGVtcGxhdGVzOiBRdWVyeUxpc3Q8UHJpbWVUZW1wbGF0ZT4gfCB1bmRlZmluZWQ7XG5cbiAgICBpdGVtVGVtcGxhdGU6IE51bGxhYmxlPFRlbXBsYXRlUmVmPGFueT4+O1xuXG4gICAgcHJldmlvdXNJY29uVGVtcGxhdGU6IE51bGxhYmxlPFRlbXBsYXRlUmVmPGFueT4+O1xuXG4gICAgbmV4dEljb25UZW1wbGF0ZTogTnVsbGFibGU8VGVtcGxhdGVSZWY8YW55Pj47XG5cbiAgICB0YWJDaGFuZ2VkOiBib29sZWFuIHwgdW5kZWZpbmVkO1xuXG4gICAgYmFja3dhcmRJc0Rpc2FibGVkOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIGZvcndhcmRJc0Rpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBwcml2YXRlIHRpbWVySWRGb3JBdXRvU2Nyb2xsOiBhbnkgPSBudWxsO1xuXG4gICAgX2ZvY3VzYWJsZUl0ZW1zOiBNZW51SXRlbVtdIHwgdW5kZWZpbmVkIHwgYW55O1xuXG4gICAgX21vZGVsOiBNZW51SXRlbVtdIHwgdW5kZWZpbmVkO1xuXG4gICAgX2FjdGl2ZUl0ZW06IE1lbnVJdGVtIHwgdW5kZWZpbmVkO1xuXG4gICAgZm9jdXNlZEl0ZW1JbmZvID0gc2lnbmFsPGFueT4obnVsbCk7XG5cbiAgICBnZXQgZm9jdXNhYmxlSXRlbXMoKSB7XG4gICAgICAgIGlmICghdGhpcy5fZm9jdXNhYmxlSXRlbXMgfHwgIXRoaXMuX2ZvY3VzYWJsZUl0ZW1zLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5fZm9jdXNhYmxlSXRlbXMgPSAodGhpcy5tb2RlbCB8fCBbXSkucmVkdWNlKChyZXN1bHQsIGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChpdGVtKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9LCBbXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZvY3VzYWJsZUl0ZW1zO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBASW5qZWN0KFBMQVRGT1JNX0lEKSBwcml2YXRlIHBsYXRmb3JtSWQ6IGFueSxcbiAgICAgICAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlcixcbiAgICAgICAgcHJpdmF0ZSByb3V0ZTogQWN0aXZhdGVkUm91dGUsXG4gICAgICAgIHByaXZhdGUgY2Q6IENoYW5nZURldGVjdG9yUmVmXG4gICAgKSB7XG4gICAgICAgIHRoaXMucm91dGVyLmV2ZW50cy5waXBlKGZpbHRlcigoZXZlbnQpID0+IGV2ZW50IGluc3RhbmNlb2YgTmF2aWdhdGlvbkVuZCkpLnN1YnNjcmliZSgoZXZlbnQ6IE5hdmlnYXRpb25FbmQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG5nT25DaGFuZ2VzKHNpbXBsZUNoYW5nZTogU2ltcGxlQ2hhbmdlcykge1xuICAgICAgICBpZiAoc2ltcGxlQ2hhbmdlLmFjdGl2ZUl0ZW0pIHtcbiAgICAgICAgICAgIHRoaXMuYXV0b1Njcm9sbEZvckFjdGl2ZUl0ZW0oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXM/LmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIHN3aXRjaCAoaXRlbS5nZXRUeXBlKCkpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdpdGVtJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtVGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ25leHRpY29uJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0SWNvblRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdwcmV2aW91c2ljb24nOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByZXZpb3VzSWNvblRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICB0aGlzLml0ZW1UZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgICAgIGlmIChpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLnBsYXRmb3JtSWQpKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUlua0JhcigpO1xuICAgICAgICAgICAgdGhpcy5hdXRvU2Nyb2xsRm9yQWN0aXZlSXRlbSgpO1xuICAgICAgICAgICAgdGhpcy5pbml0QnV0dG9uU3RhdGUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nQWZ0ZXJWaWV3Q2hlY2tlZCgpIHtcbiAgICAgICAgaWYgKGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlSW5rQmFyKCk7XG4gICAgICAgICAgICB0aGlzLnRhYkNoYW5nZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNsZWFyQXV0b1Njcm9sbEhhbmRsZXIoKTtcbiAgICB9XG5cbiAgICBpc0FjdGl2ZShpdGVtOiBNZW51SXRlbSkge1xuICAgICAgICBpZiAoaXRlbS5yb3V0ZXJMaW5rKSB7XG4gICAgICAgICAgICBjb25zdCByb3V0ZXJMaW5rID0gQXJyYXkuaXNBcnJheShpdGVtLnJvdXRlckxpbmspID8gaXRlbS5yb3V0ZXJMaW5rIDogW2l0ZW0ucm91dGVyTGlua107XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJvdXRlci5pc0FjdGl2ZSh0aGlzLnJvdXRlci5jcmVhdGVVcmxUcmVlKHJvdXRlckxpbmssIHsgcmVsYXRpdmVUbzogdGhpcy5yb3V0ZSB9KS50b1N0cmluZygpLCBpdGVtLnJvdXRlckxpbmtBY3RpdmVPcHRpb25zPy5leGFjdCA/PyBpdGVtLnJvdXRlckxpbmtBY3RpdmVPcHRpb25zID8/IGZhbHNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpdGVtID09PSB0aGlzLmFjdGl2ZUl0ZW07XG4gICAgfVxuXG4gICAgZ2V0SXRlbVByb3AoaXRlbTogYW55LCBuYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIGl0ZW0gPyBPYmplY3RVdGlscy5nZXRJdGVtVmFsdWUoaXRlbVtuYW1lXSkgOiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgdmlzaWJsZShpdGVtKSB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgaXRlbS52aXNpYmxlID09PSAnZnVuY3Rpb24nID8gaXRlbS52aXNpYmxlKCkgOiBpdGVtLnZpc2libGUgIT09IGZhbHNlO1xuICAgIH1cblxuICAgIGRpc2FibGVkKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBpdGVtLmRpc2FibGVkID09PSAnZnVuY3Rpb24nID8gaXRlbS5kaXNhYmxlZCgpIDogaXRlbS5kaXNhYmxlZDtcbiAgICB9XG5cbiAgICBvbk1lbnVJdGVtRm9jdXMoaXRlbSkge1xuICAgICAgICB0aGlzLmZvY3VzZWRJdGVtSW5mby5zZXQoaXRlbSk7XG4gICAgfVxuXG4gICAgaXRlbUNsaWNrKGV2ZW50OiBFdmVudCwgaXRlbTogTWVudUl0ZW0pIHtcbiAgICAgICAgaWYgKGl0ZW0uZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWl0ZW0udXJsICYmICFpdGVtLnJvdXRlckxpbmspIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXRlbS5jb21tYW5kKSB7XG4gICAgICAgICAgICBpdGVtLmNvbW1hbmQoe1xuICAgICAgICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2ZW50LFxuICAgICAgICAgICAgICAgIGl0ZW06IGl0ZW1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5hY3RpdmVJdGVtID0gaXRlbTtcbiAgICAgICAgdGhpcy50YWJDaGFuZ2VkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG5cbiAgICBvbktleWRvd25JdGVtKGV2ZW50LCBpbmRleCwgaXRlbSkge1xuICAgICAgICBsZXQgaSA9IGluZGV4O1xuXG4gICAgICAgIGxldCBmb3VuZEVsZW1lbnQgPSB7fTtcbiAgICAgICAgY29uc3QgdGFiTGlua3MgPSB0aGlzLnRhYkxpbmsudG9BcnJheSgpO1xuICAgICAgICBjb25zdCB0YWJzID0gdGhpcy50YWIudG9BcnJheSgpO1xuXG4gICAgICAgIHN3aXRjaCAoZXZlbnQuY29kZSkge1xuICAgICAgICAgICAgY2FzZSAnQXJyb3dSaWdodCc6XG4gICAgICAgICAgICAgICAgZm91bmRFbGVtZW50ID0gdGhpcy5maW5kTmV4dEl0ZW0odGFicywgaSk7XG4gICAgICAgICAgICAgICAgaSA9IGZvdW5kRWxlbWVudFsnaSddO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdBcnJvd0xlZnQnOlxuICAgICAgICAgICAgICAgIGZvdW5kRWxlbWVudCA9IHRoaXMuZmluZFByZXZJdGVtKHRhYnMsIGkpO1xuICAgICAgICAgICAgICAgIGkgPSBmb3VuZEVsZW1lbnRbJ2knXTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnRW5kJzpcbiAgICAgICAgICAgICAgICBmb3VuZEVsZW1lbnQgPSB0aGlzLmZpbmRQcmV2SXRlbSh0YWJzLCB0aGlzLm1vZGVsLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgaSA9IGZvdW5kRWxlbWVudFsnaSddO1xuXG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnSG9tZSc6XG4gICAgICAgICAgICAgICAgZm91bmRFbGVtZW50ID0gdGhpcy5maW5kTmV4dEl0ZW0odGFicywgLTEpO1xuICAgICAgICAgICAgICAgIGkgPSBmb3VuZEVsZW1lbnRbJ2knXTtcblxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ1NwYWNlJzpcbiAgICAgICAgICAgIGNhc2UgJ0VudGVyJzpcbiAgICAgICAgICAgICAgICB0aGlzLml0ZW1DbGljayhldmVudCwgaXRlbSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ1RhYic6XG4gICAgICAgICAgICAgICAgdGhpcy5vblRhYktleURvd24odGFiTGlua3MpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRhYkxpbmtzW2ldICYmIHRhYkxpbmtzW2luZGV4XSkge1xuICAgICAgICAgICAgdGFiTGlua3NbaW5kZXhdLm5hdGl2ZUVsZW1lbnQudGFiSW5kZXggPSAnLTEnO1xuICAgICAgICAgICAgdGFiTGlua3NbaV0ubmF0aXZlRWxlbWVudC50YWJJbmRleCA9ICcwJztcbiAgICAgICAgICAgIHRhYkxpbmtzW2ldLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cblxuICAgIG9uVGFiS2V5RG93bih0YWJMaW5rcykge1xuICAgICAgICB0YWJMaW5rcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICBpdGVtLm5hdGl2ZUVsZW1lbnQudGFiSW5kZXggPSBEb21IYW5kbGVyLmdldEF0dHJpYnV0ZShpdGVtLm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudCwgJ2RhdGEtcC1oaWdobGlnaHQnKSA/ICcwJyA6ICctMSc7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZpbmROZXh0SXRlbShpdGVtcywgaW5kZXgpIHtcbiAgICAgICAgbGV0IGkgPSBpbmRleCArIDE7XG5cbiAgICAgICAgaWYgKGkgPj0gaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4geyBuZXh0SXRlbTogaXRlbXNbaXRlbXMubGVuZ3RoXSwgaTogaXRlbXMubGVuZ3RoIH07XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbmV4dEl0ZW0gPSBpdGVtc1tpXTtcblxuICAgICAgICBpZiAobmV4dEl0ZW0pIHJldHVybiBEb21IYW5kbGVyLmdldEF0dHJpYnV0ZShuZXh0SXRlbS5uYXRpdmVFbGVtZW50LCAnZGF0YS1wLWRpc2FibGVkJykgPyB0aGlzLmZpbmROZXh0SXRlbShpdGVtcywgaSkgOiB7IG5leHRJdGVtOiBuZXh0SXRlbS5uYXRpdmVFbGVtZW50LCBpIH07XG4gICAgICAgIGVsc2UgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZmluZFByZXZJdGVtKGl0ZW1zLCBpbmRleCkge1xuICAgICAgICBsZXQgaSA9IGluZGV4IC0gMTtcblxuICAgICAgICBpZiAoaSA8IDApIHtcbiAgICAgICAgICAgIHJldHVybiB7IHByZXZJdGVtOiBpdGVtc1swXSwgaTogMCB9O1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHByZXZJdGVtID0gaXRlbXNbaV07XG5cbiAgICAgICAgaWYgKHByZXZJdGVtKSByZXR1cm4gRG9tSGFuZGxlci5nZXRBdHRyaWJ1dGUocHJldkl0ZW0ubmF0aXZlRWxlbWVudCwgJ2RhdGEtcC1kaXNhYmxlZCcpID8gdGhpcy5maW5kUHJldkl0ZW0oaXRlbXMsIGkpIDogeyBwcmV2SXRlbTogcHJldkl0ZW0ubmF0aXZlRWxlbWVudCwgaSB9O1xuICAgICAgICBlbHNlIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHVwZGF0ZUlua0JhcigpIHtcbiAgICAgICAgY29uc3QgdGFiSGVhZGVyID0gRG9tSGFuZGxlci5maW5kU2luZ2xlKHRoaXMubmF2YmFyPy5uYXRpdmVFbGVtZW50LCAnbGkucC1oaWdobGlnaHQnKTtcbiAgICAgICAgaWYgKHRhYkhlYWRlcikge1xuICAgICAgICAgICAgKHRoaXMuaW5rYmFyIGFzIEVsZW1lbnRSZWYpLm5hdGl2ZUVsZW1lbnQuc3R5bGUud2lkdGggPSBEb21IYW5kbGVyLmdldFdpZHRoKHRhYkhlYWRlcikgKyAncHgnO1xuICAgICAgICAgICAgKHRoaXMuaW5rYmFyIGFzIEVsZW1lbnRSZWYpLm5hdGl2ZUVsZW1lbnQuc3R5bGUubGVmdCA9IERvbUhhbmRsZXIuZ2V0T2Zmc2V0KHRhYkhlYWRlcikubGVmdCAtIERvbUhhbmRsZXIuZ2V0T2Zmc2V0KHRoaXMubmF2YmFyPy5uYXRpdmVFbGVtZW50KS5sZWZ0ICsgJ3B4JztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFZpc2libGVCdXR0b25XaWR0aHMoKSB7XG4gICAgICAgIHJldHVybiBbdGhpcy5wcmV2QnRuPy5uYXRpdmVFbGVtZW50LCB0aGlzLm5leHRCdG4/Lm5hdGl2ZUVsZW1lbnRdLnJlZHVjZSgoYWNjLCBlbCkgPT4gKGVsID8gYWNjICsgRG9tSGFuZGxlci5nZXRXaWR0aChlbCkgOiBhY2MpLCAwKTtcbiAgICB9XG5cbiAgICB1cGRhdGVCdXR0b25TdGF0ZSgpIHtcbiAgICAgICAgY29uc3QgY29udGVudCA9IHRoaXMuY29udGVudD8ubmF0aXZlRWxlbWVudDtcbiAgICAgICAgY29uc3QgeyBzY3JvbGxMZWZ0LCBzY3JvbGxXaWR0aCB9ID0gY29udGVudDtcbiAgICAgICAgY29uc3Qgd2lkdGggPSBEb21IYW5kbGVyLmdldFdpZHRoKGNvbnRlbnQpO1xuXG4gICAgICAgIHRoaXMuYmFja3dhcmRJc0Rpc2FibGVkID0gc2Nyb2xsTGVmdCA9PT0gMDtcbiAgICAgICAgdGhpcy5mb3J3YXJkSXNEaXNhYmxlZCA9IHBhcnNlSW50KHNjcm9sbExlZnQpID09PSBzY3JvbGxXaWR0aCAtIHdpZHRoO1xuICAgIH1cblxuICAgIHVwZGF0ZVNjcm9sbEJhcihpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHRhYkhlYWRlciA9IHRoaXMubmF2YmFyPy5uYXRpdmVFbGVtZW50LmNoaWxkcmVuW2luZGV4XTtcblxuICAgICAgICBpZiAoIXRhYkhlYWRlcikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRhYkhlYWRlciAmJiB0eXBlb2YgdGFiSGVhZGVyLnNjcm9sbEludG9WaWV3ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0YWJIZWFkZXIuc2Nyb2xsSW50b1ZpZXcoeyBibG9jazogJ25lYXJlc3QnLCBpbmxpbmU6ICdjZW50ZXInIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25TY3JvbGwoZXZlbnQ6IEV2ZW50KSB7XG4gICAgICAgIHRoaXMuc2Nyb2xsYWJsZSAmJiB0aGlzLnVwZGF0ZUJ1dHRvblN0YXRlKCk7XG5cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICBuYXZCYWNrd2FyZCgpIHtcbiAgICAgICAgY29uc3QgY29udGVudCA9IHRoaXMuY29udGVudD8ubmF0aXZlRWxlbWVudDtcbiAgICAgICAgY29uc3Qgd2lkdGggPSBEb21IYW5kbGVyLmdldFdpZHRoKGNvbnRlbnQpIC0gdGhpcy5nZXRWaXNpYmxlQnV0dG9uV2lkdGhzKCk7XG4gICAgICAgIGNvbnN0IHBvcyA9IGNvbnRlbnQuc2Nyb2xsTGVmdCAtIHdpZHRoO1xuICAgICAgICBjb250ZW50LnNjcm9sbExlZnQgPSBwb3MgPD0gMCA/IDAgOiBwb3M7XG4gICAgfVxuXG4gICAgbmF2Rm9yd2FyZCgpIHtcbiAgICAgICAgY29uc3QgY29udGVudCA9IHRoaXMuY29udGVudD8ubmF0aXZlRWxlbWVudDtcbiAgICAgICAgY29uc3Qgd2lkdGggPSBEb21IYW5kbGVyLmdldFdpZHRoKGNvbnRlbnQpIC0gdGhpcy5nZXRWaXNpYmxlQnV0dG9uV2lkdGhzKCk7XG4gICAgICAgIGNvbnN0IHBvcyA9IGNvbnRlbnQuc2Nyb2xsTGVmdCArIHdpZHRoO1xuICAgICAgICBjb25zdCBsYXN0UG9zID0gY29udGVudC5zY3JvbGxXaWR0aCAtIHdpZHRoO1xuICAgICAgICBjb250ZW50LnNjcm9sbExlZnQgPSBwb3MgPj0gbGFzdFBvcyA/IGxhc3RQb3MgOiBwb3M7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhdXRvU2Nyb2xsRm9yQWN0aXZlSXRlbSgpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLnNjcm9sbGFibGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2xlYXJBdXRvU2Nyb2xsSGFuZGxlcigpO1xuICAgICAgICAvLyBXZSBoYXZlIHRvIHdhaXQgZm9yIHRoZSByZW5kZXJpbmcgYW5kIHRoZW4gY2FuIHNjcm9sbCB0byBlbGVtZW50LlxuICAgICAgICB0aGlzLnRpbWVySWRGb3JBdXRvU2Nyb2xsID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBhY3RpdmVJdGVtID0gKHRoaXMubW9kZWwgYXMgTWVudUl0ZW1bXSkuZmluZEluZGV4KChtZW51SXRlbSkgPT4gdGhpcy5pc0FjdGl2ZShtZW51SXRlbSkpO1xuXG4gICAgICAgICAgICBpZiAoYWN0aXZlSXRlbSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVNjcm9sbEJhcihhY3RpdmVJdGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjbGVhckF1dG9TY3JvbGxIYW5kbGVyKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy50aW1lcklkRm9yQXV0b1Njcm9sbCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZXJJZEZvckF1dG9TY3JvbGwpO1xuICAgICAgICAgICAgdGhpcy50aW1lcklkRm9yQXV0b1Njcm9sbCA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGluaXRCdXR0b25TdGF0ZSgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuc2Nyb2xsYWJsZSkge1xuICAgICAgICAgICAgLy8gV2UgaGF2ZSB0byB3YWl0IGZvciB0aGUgcmVuZGVyaW5nIGFuZCB0aGVuIHJldHJpZXZlIHRoZSBhY3R1YWwgc2l6ZSBlbGVtZW50IGZyb20gdGhlIERPTS5cbiAgICAgICAgICAgIC8vIGluIGZ1dHVyZSBgUHJvbWlzZS5yZXNvbHZlYCBjYW4gYmUgY2hhbmdlZCB0byBgcXVldWVNaWNyb3Rhc2tgIChpZiBpZTExIHN1cHBvcnQgd2lsbCBiZSBkcm9wcGVkKVxuICAgICAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVCdXR0b25TdGF0ZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBSb3V0ZXJNb2R1bGUsIFNoYXJlZE1vZHVsZSwgUmlwcGxlTW9kdWxlLCBUb29sdGlwTW9kdWxlLCBDaGV2cm9uTGVmdEljb24sIENoZXZyb25SaWdodEljb25dLFxuICAgIGV4cG9ydHM6IFtUYWJNZW51LCBSb3V0ZXJNb2R1bGUsIFNoYXJlZE1vZHVsZSwgVG9vbHRpcE1vZHVsZV0sXG4gICAgZGVjbGFyYXRpb25zOiBbVGFiTWVudV1cbn0pXG5leHBvcnQgY2xhc3MgVGFiTWVudU1vZHVsZSB7fVxuIl19