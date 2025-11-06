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
                    <a href="index.html" data-type="index-link">cave-master-frontend documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                                <li class="link">
                                    <a href="index.html" data-type="chapter-link">
                                        <span class="icon ion-ios-keypad"></span>Overview
                                    </a>
                                </li>

                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>

                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AdminModule.html" data-type="entity-link" >AdminModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AdminRoutingModule.html" data-type="entity-link" >AdminRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AuthRoutingModule.html" data-type="entity-link" >AuthRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ClientModule.html" data-type="entity-link" >ClientModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ClientRoutingModule.html" data-type="entity-link" >ClientRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ManagerModule.html" data-type="entity-link" >ManagerModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ManagerRoutingModule.html" data-type="entity-link" >ManagerRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/WaitressModule.html" data-type="entity-link" >WaitressModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/WaitressRoutingModule.html" data-type="entity-link" >WaitressRoutingModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/AboutComponent.html" data-type="entity-link" >AboutComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AdminDashboardComponent.html" data-type="entity-link" >AdminDashboardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AlertsComponent.html" data-type="entity-link" >AlertsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/App.html" data-type="entity-link" >App</a>
                            </li>
                            <li class="link">
                                <a href="components/CaisseComponent.html" data-type="entity-link" >CaisseComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CaveCreateComponent.html" data-type="entity-link" >CaveCreateComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CaveListComponent.html" data-type="entity-link" >CaveListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ClientDashboardComponent.html" data-type="entity-link" >ClientDashboardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ClientsComponent.html" data-type="entity-link" >ClientsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ContactComponent.html" data-type="entity-link" >ContactComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DrinksComponent.html" data-type="entity-link" >DrinksComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EmployeesComponent.html" data-type="entity-link" >EmployeesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EntriesComponent.html" data-type="entity-link" >EntriesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ExitsComponent.html" data-type="entity-link" >ExitsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ExpenseComponent.html" data-type="entity-link" >ExpenseComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FaqComponent.html" data-type="entity-link" >FaqComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FournisseursComponent.html" data-type="entity-link" >FournisseursComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/HomeComponent.html" data-type="entity-link" >HomeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ImprovementsComponent.html" data-type="entity-link" >ImprovementsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LoginComponent.html" data-type="entity-link" >LoginComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ManagerDashboardComponent.html" data-type="entity-link" >ManagerDashboardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ManagersComponent.html" data-type="entity-link" >ManagersComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MaterialComponent.html" data-type="entity-link" >MaterialComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NotFoundComponent.html" data-type="entity-link" >NotFoundComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/OrdersComponent.html" data-type="entity-link" >OrdersComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ProfileComponent.html" data-type="entity-link" >ProfileComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ProfitComponent.html" data-type="entity-link" >ProfitComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/RecentActionsComponent.html" data-type="entity-link" >RecentActionsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ReportsComponent.html" data-type="entity-link" >ReportsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SalesComponent.html" data-type="entity-link" >SalesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ScanComponent.html" data-type="entity-link" >ScanComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SettingsComponent.html" data-type="entity-link" >SettingsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SettingsComponent-1.html" data-type="entity-link" >SettingsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StockComponent.html" data-type="entity-link" >StockComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StockComponent-1.html" data-type="entity-link" >StockComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TeamComponent.html" data-type="entity-link" >TeamComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ThemeToggleComponent.html" data-type="entity-link" >ThemeToggleComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UserCreateComponent.html" data-type="entity-link" >UserCreateComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UserListComponent.html" data-type="entity-link" >UserListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UserProfileComponent.html" data-type="entity-link" >UserProfileComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/WaitressDashboardComponent.html" data-type="entity-link" >WaitressDashboardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/WinePairingComponent.html" data-type="entity-link" >WinePairingComponent</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/ApiResponseData.html" data-type="entity-link" >ApiResponseData</a>
                            </li>
                            <li class="link">
                                <a href="classes/ChangePasswordRequest.html" data-type="entity-link" >ChangePasswordRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/ForgotPassword.html" data-type="entity-link" >ForgotPassword</a>
                            </li>
                            <li class="link">
                                <a href="classes/ForgotPasswordRequest.html" data-type="entity-link" >ForgotPasswordRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/Login.html" data-type="entity-link" >Login</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResetPasswordRequest.html" data-type="entity-link" >ResetPasswordRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/Roles.html" data-type="entity-link" >Roles</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateProfileRequest.html" data-type="entity-link" >UpdateProfileRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserEditableFields.html" data-type="entity-link" >UserEditableFields</a>
                            </li>
                            <li class="link">
                                <a href="classes/Users.html" data-type="entity-link" >Users</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ModalService.html" data-type="entity-link" >ModalService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ThemeService.html" data-type="entity-link" >ThemeService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TokenService.html" data-type="entity-link" >TokenService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interceptors-links"' :
                            'data-bs-target="#xs-interceptors-links"' }>
                            <span class="icon ion-ios-swap"></span>
                            <span>Interceptors</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="interceptors-links"' : 'id="xs-interceptors-links"' }>
                            <li class="link">
                                <a href="interceptors/AuthInterceptor.html" data-type="entity-link" >AuthInterceptor</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Activity.html" data-type="entity-link" >Activity</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AlertCategory.html" data-type="entity-link" >AlertCategory</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AlertItem.html" data-type="entity-link" >AlertItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AppSettings.html" data-type="entity-link" >AppSettings</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Availability.html" data-type="entity-link" >Availability</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Availability-1.html" data-type="entity-link" >Availability</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AvailabilityHistory.html" data-type="entity-link" >AvailabilityHistory</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AvailabilityHistory-1.html" data-type="entity-link" >AvailabilityHistory</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Boisson.html" data-type="entity-link" >Boisson</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Boisson-1.html" data-type="entity-link" >Boisson</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CategoryTotal.html" data-type="entity-link" >CategoryTotal</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Cave.html" data-type="entity-link" >Cave</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Cave-1.html" data-type="entity-link" >Cave</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Cave-2.html" data-type="entity-link" >Cave</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Cave-3.html" data-type="entity-link" >Cave</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Cave-4.html" data-type="entity-link" >Cave</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Cave-5.html" data-type="entity-link" >Cave</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Cave-6.html" data-type="entity-link" >Cave</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Cave-7.html" data-type="entity-link" >Cave</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Cave-8.html" data-type="entity-link" >Cave</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Client.html" data-type="entity-link" >Client</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ClientStats.html" data-type="entity-link" >ClientStats</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ContactForm.html" data-type="entity-link" >ContactForm</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DashboardStats.html" data-type="entity-link" >DashboardStats</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Drink.html" data-type="entity-link" >Drink</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Drink-1.html" data-type="entity-link" >Drink</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Drink-2.html" data-type="entity-link" >Drink</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Drink-3.html" data-type="entity-link" >Drink</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DrinkForm.html" data-type="entity-link" >DrinkForm</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Employee.html" data-type="entity-link" >Employee</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Employee-1.html" data-type="entity-link" >Employee</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Employee-2.html" data-type="entity-link" >Employee</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Expense.html" data-type="entity-link" >Expense</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Expense-1.html" data-type="entity-link" >Expense</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ExpenseForm.html" data-type="entity-link" >ExpenseForm</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FAQItem.html" data-type="entity-link" >FAQItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Feature.html" data-type="entity-link" >Feature</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FeaturedDrink.html" data-type="entity-link" >FeaturedDrink</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FeaturedDrink-1.html" data-type="entity-link" >FeaturedDrink</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FilterOptions.html" data-type="entity-link" >FilterOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FilterOptions-1.html" data-type="entity-link" >FilterOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Fournisseur.html" data-type="entity-link" >Fournisseur</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GlobalStats.html" data-type="entity-link" >GlobalStats</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HistorySale.html" data-type="entity-link" >HistorySale</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Improvement.html" data-type="entity-link" >Improvement</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Invoice.html" data-type="entity-link" >Invoice</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ItemStats.html" data-type="entity-link" >ItemStats</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Manager.html" data-type="entity-link" >Manager</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Manager-1.html" data-type="entity-link" >Manager</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Manager-2.html" data-type="entity-link" >Manager</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Material.html" data-type="entity-link" >Material</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MenuItem.html" data-type="entity-link" >MenuItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ModalState.html" data-type="entity-link" >ModalState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Mouvement.html" data-type="entity-link" >Mouvement</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MouvementStock.html" data-type="entity-link" >MouvementStock</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NewEmployeeForm.html" data-type="entity-link" >NewEmployeeForm</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NewManagerForm.html" data-type="entity-link" >NewManagerForm</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Order.html" data-type="entity-link" >Order</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Order-1.html" data-type="entity-link" >Order</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Order-2.html" data-type="entity-link" >Order</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Order-3.html" data-type="entity-link" >Order</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/OrderItem.html" data-type="entity-link" >OrderItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PasswordForm.html" data-type="entity-link" >PasswordForm</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PopularProduct.html" data-type="entity-link" >PopularProduct</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Product.html" data-type="entity-link" >Product</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Product-1.html" data-type="entity-link" >Product</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProductivityStat.html" data-type="entity-link" >ProductivityStat</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RapportTemplate.html" data-type="entity-link" >RapportTemplate</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RecentAction.html" data-type="entity-link" >RecentAction</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RecentAction-1.html" data-type="entity-link" >RecentAction</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RecentAction-2.html" data-type="entity-link" >RecentAction</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ScanHistory.html" data-type="entity-link" >ScanHistory</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ScanResult.html" data-type="entity-link" >ScanResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Stat.html" data-type="entity-link" >Stat</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Stat-1.html" data-type="entity-link" >Stat</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StatistiqueCaisse.html" data-type="entity-link" >StatistiqueCaisse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StockAlert.html" data-type="entity-link" >StockAlert</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StockEntry.html" data-type="entity-link" >StockEntry</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StockEntry-1.html" data-type="entity-link" >StockEntry</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StockEntryForm.html" data-type="entity-link" >StockEntryForm</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StockExit.html" data-type="entity-link" >StockExit</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StockExit-1.html" data-type="entity-link" >StockExit</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StockExitForm.html" data-type="entity-link" >StockExitForm</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StockItem.html" data-type="entity-link" >StockItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StockMovement.html" data-type="entity-link" >StockMovement</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Table.html" data-type="entity-link" >Table</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TeamMember.html" data-type="entity-link" >TeamMember</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TeamMember-1.html" data-type="entity-link" >TeamMember</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TeamMember-2.html" data-type="entity-link" >TeamMember</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Tip.html" data-type="entity-link" >Tip</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Toast.html" data-type="entity-link" >Toast</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Transaction.html" data-type="entity-link" >Transaction</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Transaction-1.html" data-type="entity-link" >Transaction</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/User.html" data-type="entity-link" >User</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/User-1.html" data-type="entity-link" >User</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserProfile.html" data-type="entity-link" >UserProfile</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserProfile-1.html" data-type="entity-link" >UserProfile</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserProfile-2.html" data-type="entity-link" >UserProfile</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserStatistics.html" data-type="entity-link" >UserStatistics</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/VenteParPeriode.html" data-type="entity-link" >VenteParPeriode</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/VenteProduit.html" data-type="entity-link" >VenteProduit</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WinePairing.html" data-type="entity-link" >WinePairing</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WinePairing-1.html" data-type="entity-link" >WinePairing</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WinePairingForm.html" data-type="entity-link" >WinePairingForm</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WinePairingSuggestion.html" data-type="entity-link" >WinePairingSuggestion</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WinePairingSuggestion-1.html" data-type="entity-link" >WinePairingSuggestion</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
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
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});