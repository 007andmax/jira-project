'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">migrated documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="dependencies.html" data-type="chapter-link">
                                <span class="icon ion-ios-list"></span>Dependencies
                            </a>
                        </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse" ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-55eb807ef02d67c1551fc02869a0eee4"' : 'data-target="#xs-components-links-module-AppModule-55eb807ef02d67c1551fc02869a0eee4"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-55eb807ef02d67c1551fc02869a0eee4"' :
                                            'id="xs-components-links-module-AppModule-55eb807ef02d67c1551fc02869a0eee4"' }>
                                            <li class="link">
                                                <a href="components/AddItemComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AddItemComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LeftPanelBillingComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LeftPanelBillingComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LeftPanelComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LeftPanelComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LeftPanelPasswordManagerComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LeftPanelPasswordManagerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MainComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MainComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ModalQuoteComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ModalQuoteComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MultiDatepickerComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MultiDatepickerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PasswoordManagerHeaderComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PasswoordManagerHeaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PasswordManagerComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PasswordManagerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PasswordManagerEditAsideComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PasswordManagerEditAsideComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PasswordManagerTableComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PasswordManagerTableComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PasswordRecordsTypesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PasswordRecordsTypesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProductListComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProductListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProductTableComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProductTableComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/QuoteCreateComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">QuoteCreateComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/QuoteCreateContentBottomComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">QuoteCreateContentBottomComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/QuoteCreateContentComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">QuoteCreateContentComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/QuoteCreateContentNotesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">QuoteCreateContentNotesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/QuoteCreateContentTopComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">QuoteCreateContentTopComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/QuoteCreateHeaderComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">QuoteCreateHeaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/QuotePreviewComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">QuotePreviewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/QuotesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">QuotesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SelectClientCompanyComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SelectClientCompanyComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ServicesListComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ServicesListComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-55eb807ef02d67c1551fc02869a0eee4"' : 'data-target="#xs-injectables-links-module-AppModule-55eb807ef02d67c1551fc02869a0eee4"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-55eb807ef02d67c1551fc02869a0eee4"' :
                                        'id="xs-injectables-links-module-AppModule-55eb807ef02d67c1551fc02869a0eee4"' }>
                                        <li class="link">
                                            <a href="injectables/ApiPasswordManagerService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ApiPasswordManagerService</a>
                                        </li>
                                    </ul>
                                </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-AppModule-55eb807ef02d67c1551fc02869a0eee4"' : 'data-target="#xs-pipes-links-module-AppModule-55eb807ef02d67c1551fc02869a0eee4"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-AppModule-55eb807ef02d67c1551fc02869a0eee4"' :
                                            'id="xs-pipes-links-module-AppModule-55eb807ef02d67c1551fc02869a0eee4"' }>
                                            <li class="link">
                                                <a href="pipes/CompanyPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CompanyPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/DateFormatPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DateFormatPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/DeviceUserPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DeviceUserPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/PasswordCategoryPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PasswordCategoryPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/ToNumerPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ToNumerPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/UserPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UserPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link">AppRoutingModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/CustomHandlingStrategy.html" data-type="entity-link">CustomHandlingStrategy</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/ApiPasswordManagerService.html" data-type="entity-link">ApiPasswordManagerService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CompaniesService.html" data-type="entity-link">CompaniesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DateService.html" data-type="entity-link">DateService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DevicesService.html" data-type="entity-link">DevicesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GadgetsService.html" data-type="entity-link">GadgetsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NoteService.html" data-type="entity-link">NoteService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PasswordManagerService.html" data-type="entity-link">PasswordManagerService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PermissionsService.html" data-type="entity-link">PermissionsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProductService.html" data-type="entity-link">ProductService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/QuoteRealTimeService.html" data-type="entity-link">QuoteRealTimeService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/QuoteService.html" data-type="entity-link">QuoteService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/QuoteStateService.html" data-type="entity-link">QuoteStateService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsersService.html" data-type="entity-link">UsersService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/WebsocketService.html" data-type="entity-link">WebsocketService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Company.html" data-type="entity-link">Company</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/reqCreateQuote.html" data-type="entity-link">reqCreateQuote</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Tag.html" data-type="entity-link">Tag</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Ticket.html" data-type="entity-link">Ticket</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});