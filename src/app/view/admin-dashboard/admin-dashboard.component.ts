// ===== TYPES & INTERFACES =====

interface Drink {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  icon: string;
  sales?: number;
  badge?: 'HOT' | 'NEW';
}

interface Manager {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar: string;
}

interface Cave {
  id: string;
  name: string;
  location: string;
  bottles: number;
  managers: number;
  employees: number;
  productivity: number;
  icon: string;
  managersList: Manager[];
  monthlyStats: MonthlyStats[];
}

interface MonthlyStats {
  month: string;
  sales: number;
  orders: number;
  avgProductivity: number;
}

interface Action {
  id: string;
  type: 'success' | 'warning' | 'info';
  icon: string;
  title: string;
  details: string;
  time: string;
}

interface StatCard {
  icon: string;
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral' | 'warning';
  colorClass: string;
}

// ===== DATA =====

const drinks: Drink[] = [
  { id: '1', name: 'Moët & Chandon', category: 'CHAMPAGNE', price: 15000, stock: 15, icon: '🥂' },
  { id: '2', name: 'Château Margaux', category: 'VIN ROUGE', price: 25000, stock: 20, icon: '🍷' },
  { id: '3', name: 'Dom Pérignon', category: 'CHAMPAGNE', price: 45000, stock: 8, icon: '🥂' },
  { id: '4', name: 'Hennessy VSOP', category: 'LIQUEUR', price: 35000, stock: 12, icon: '🥃' },
  { id: '5', name: 'Heineken Premium', category: 'BIÈRE', price: 1500, stock: 150, icon: '🍺' }
];

const popularProducts: Drink[] = [
  { id: '1', name: 'Château Margaux', category: 'Vin Rouge', price: 25000, stock: 20, icon: '🍷', sales: 156, badge: 'HOT' },
  { id: '2', name: 'Heineken Premium', category: 'Bière', price: 1500, stock: 150, icon: '🍺', sales: 89, badge: 'NEW' },
  { id: '3', name: 'Hennessy VSOP', category: 'Liqueur', price: 35000, stock: 12, icon: '🥃', sales: 134 },
  { id: '4', name: 'Dom Pérignon', category: 'Champagne', price: 45000, stock: 8, icon: '🥂', sales: 201, badge: 'HOT' },
  { id: '5', name: 'Red Bull Energy', category: 'Boisson Énergisante', price: 800, stock: 300, icon: '⚡', sales: 312 },
  { id: '6', name: 'Bissap Délice', category: 'Boisson Locale', price: 500, stock: 100, icon: '🍹', sales: 67, badge: 'NEW' }
];

const caves: Cave[] = [
  {
    id: 'principale',
    name: '🍷 Cave Principale',
    location: '📍 Lekki Phase 1, Lagos',
    bottles: 450,
    managers: 3,
    employees: 12,
    productivity: 87,
    icon: '🍷',
    managersList: [
      { id: '1', name: 'Jean Dupont', role: 'Manager Principal', email: 'jean.dupont@drinkstore.com', phone: '+225 07 12 34 56 78', avatar: '👨‍💼' },
      { id: '2', name: 'Sophie Martin', role: 'Manager Adjoint', email: 'sophie.martin@drinkstore.com', phone: '+225 07 23 45 67 89', avatar: '👩‍💼' },
      { id: '3', name: 'Pierre Kouassi', role: 'Manager Stock', email: 'pierre.kouassi@drinkstore.com', phone: '+225 07 34 56 78 90', avatar: '👨‍💼' }
    ],
    monthlyStats: [
      { month: 'Janvier', sales: 1250000, orders: 45, avgProductivity: 85 },
      { month: 'Février', sales: 1380000, orders: 52, avgProductivity: 87 },
      { month: 'Mars', sales: 1420000, orders: 48, avgProductivity: 89 }
    ]
  },
  {
    id: 'secondaire',
    name: '🥂 Cave Secondaire',
    location: '📍 Victoria Island, Lagos',
    bottles: 320,
    managers: 2,
    employees: 8,
    productivity: 92,
    icon: '🥂',
    managersList: [
      { id: '4', name: 'Marie Touré', role: 'Manager Principal', email: 'marie.toure@drinkstore.com', phone: '+225 07 45 67 89 01', avatar: '👩‍💼' },
      { id: '5', name: 'Amadou Diallo', role: 'Manager Adjoint', email: 'amadou.diallo@drinkstore.com', phone: '+225 07 56 78 90 12', avatar: '👨‍💼' }
    ],
    monthlyStats: [
      { month: 'Janvier', sales: 980000, orders: 38, avgProductivity: 90 },
      { month: 'Février', sales: 1050000, orders: 42, avgProductivity: 92 },
      { month: 'Mars', sales: 1120000, orders: 45, avgProductivity: 94 }
    ]
  },
  {
    id: 'premium',
    name: '✨ Cave Premium',
    location: '📍 Ikoyi, Lagos',
    bottles: 180,
    managers: 1,
    employees: 5,
    productivity: 95,
    icon: '✨',
    managersList: [
      { id: '6', name: 'Fatou Ndiaye', role: 'Manager Premium', email: 'fatou.ndiaye@drinkstore.com', phone: '+225 07 67 89 01 23', avatar: '👩‍💼' }
    ],
    monthlyStats: [
      { month: 'Janvier', sales: 2100000, orders: 28, avgProductivity: 93 },
      { month: 'Février', sales: 2250000, orders: 32, avgProductivity: 95 },
      { month: 'Mars', sales: 2400000, orders: 35, avgProductivity: 97 }
    ]
  }
];

const recentActions: Action[] = [
  { id: '1', type: 'success', icon: '📥', title: 'Nouvelle entrée de stock', details: '50 bouteilles de Château Margaux • Cave Principale • +1 250 000 FCFA', time: 'Il y a 2h' },
  { id: '2', type: 'warning', icon: '📤', title: 'Sortie de stock importante', details: '30 bouteilles de Dom Pérignon • Cave Premium • -1 350 000 FCFA', time: 'Il y a 5h' },
  { id: '3', type: 'info', icon: '👤', title: 'Nouvel employé ajouté', details: 'Marie Dubois • Caissière • Cave Secondaire', time: 'Hier' },
  { id: '4', type: 'success', icon: '💰', title: 'Vente exceptionnelle', details: 'Commande de 100 bouteilles • Client VIP • +2 500 000 FCFA', time: 'Hier' },
  { id: '5', type: 'info', icon: '🔧', title: 'Maintenance effectuée', details: 'Système de refroidissement • Cave Premium • Opération réussie', time: 'Il y a 2 jours' }
];

const statsCards: StatCard[] = [
  { icon: '🔥', label: 'Ventes du jour', value: '1 250 000 FCFA', change: '+18,5% ce mois', changeType: 'positive', colorClass: 'stat-card-orange' },
  { icon: '🛒', label: 'Commandes Aujourd\'hui', value: '45', change: '+8 depuis hier', changeType: 'positive', colorClass: 'stat-card-green' },
  { icon: '🍷', label: 'Stock de Vin', value: '350', change: 'Stable', changeType: 'neutral', colorClass: 'stat-card-purple' },
  { icon: '⚠️', label: 'Stock Faible', value: '12', change: 'Attention requise', changeType: 'warning', colorClass: 'stat-card-warning' },
  { icon: '👥', label: 'Clients Actifs', value: '892', change: '+35 ce mois', changeType: 'positive', colorClass: 'stat-card-blue' },
  { icon: '🍾', label: 'Commandes en Attente', value: '8', change: 'À traiter', changeType: 'neutral', colorClass: 'stat-card-yellow' }
];

// ===== APP STATE =====

class AppState {
  private currentPage: 'home' | 'caves' = 'home';
  private currentDrinkIndex: number = 4;
  private currentCave: Cave | null = null;
  private currentTab: 'managers' | 'productivity' = 'managers';

  getCurrentPage(): string {
    return this.currentPage;
  }

  setCurrentPage(page: 'home' | 'caves'): void {
    this.currentPage = page;
  }

  getCurrentDrinkIndex(): number {
    return this.currentDrinkIndex;
  }

  setCurrentDrinkIndex(index: number): void {
    this.currentDrinkIndex = index;
  }

  getCurrentCave(): Cave | null {
    return this.currentCave;
  }

  setCurrentCave(cave: Cave | null): void {
    this.currentCave = cave;
  }

  getCurrentTab(): string {
    return this.currentTab;
  }

  setCurrentTab(tab: 'managers' | 'productivity'): void {
    this.currentTab = tab;
  }
}

const appState = new AppState();

// ===== DOM UTILITIES =====

function $(selector: string): HTMLElement | null {
  return document.querySelector(selector);
}

function $$(selector: string): NodeListOf<Element> {
  return document.querySelectorAll(selector);
}

function createElement(tag: string, className?: string, innerHTML?: string): HTMLElement {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (innerHTML) el.innerHTML = innerHTML;
  return el;
}

// ===== NAVIGATION =====

function navigateTo(page: 'home' | 'caves'): void {
  appState.setCurrentPage(page);

  // Update nav items
  $$('.nav-item').forEach(item => item.classList.remove('active'));
  const navItem = Array.from($$('.nav-item')).find(item => {
    const text = item.querySelector('.nav-text')?.textContent?.toLowerCase();
    return (page === 'home' && text === 'accueil') ||
           (page === 'caves' && text === 'mes caves');
  });
  navItem?.classList.add('active');

  // Update pages
  $$('.page-section').forEach(section => section.classList.remove('active'));
  $(`#${page}Page`)?.classList.add('active');
}

function toggleSubmenu(element: HTMLElement, event: Event): void {
  event.stopPropagation();
  const submenu = element.nextElementSibling as HTMLElement;
  const arrow = element.querySelector('.submenu-arrow') as HTMLElement;

  if (submenu?.classList.contains('submenu')) {
    submenu.classList.toggle('open');
    arrow.style.transform = submenu.classList.contains('open') ? 'rotate(90deg)' : 'rotate(0deg)';
  }
}

function toggleUserDropdown(): void {
  const dropdown = $('#userDropdown') as HTMLElement;
  dropdown.classList.toggle('show');
}

// ===== CAROUSEL =====

function updateCarousel(): void {
  const index = appState.getCurrentDrinkIndex();
  const drink = drinks[index];

  const drinkIcon = $('#drinkIcon');
  const drinkName = $('#drinkName');
  const drinkCategory = $('#drinkCategory');
  const drinkPrice = $('#drinkPrice');
  const drinkStock = $('#drinkStock');

  if (drinkIcon) drinkIcon.textContent = drink.icon;
  if (drinkName) drinkName.textContent = drink.name;
  if (drinkCategory) drinkCategory.textContent = drink.category;
  if (drinkPrice) drinkPrice.textContent = `${drink.price.toLocaleString()} FCFA`;
  if (drinkStock) drinkStock.textContent = `Stock: ${drink.stock} unités`;

  // Update indicators
  $$('.indicator').forEach((indicator, i) => {
    indicator.classList.toggle('active', i === index);
  });
}

function nextDrink(): void {
  const newIndex = (appState.getCurrentDrinkIndex() + 1) % drinks.length;
  appState.setCurrentDrinkIndex(newIndex);
  updateCarousel();
}

function previousDrink(): void {
  const newIndex = (appState.getCurrentDrinkIndex() - 1 + drinks.length) % drinks.length;
  appState.setCurrentDrinkIndex(newIndex);
  updateCarousel();
}

function goToDrink(index: number): void {
  appState.setCurrentDrinkIndex(index);
  updateCarousel();
}

// ===== CAVES MODAL =====

function openCaveModal(caveId: string): void {
  const cave = caves.find(c => c.id === caveId);
  if (!cave) return;

  appState.setCurrentCave(cave);
  const modal = $('#caveModal');
  const modalTitle = $('#caveModalTitle');

  if (modalTitle) modalTitle.textContent = cave.name;
  if (modal) modal.classList.add('show');

  renderManagersList(cave);
  renderProductivityStats(cave);
}

function closeCaveModal(): void {
  const modal = $('#caveModal');
  if (modal) modal.classList.remove('show');
  appState.setCurrentCave(null);
}

function switchTab(tab: 'managers' | 'productivity'): void {
  appState.setCurrentTab(tab);

  $$('.modal-tab').forEach(tabEl => tabEl.classList.remove('active'));
  $$('.tab-content').forEach(content => content.classList.remove('active'));

  const activeTab = Array.from($$('.modal-tab')).find(t =>
    t.textContent?.includes(tab === 'managers' ? 'Managers' : 'Productivité')
  );
  activeTab?.classList.add('active');

  $(`#${tab}Tab`)?.classList.add('active');
}

function renderManagersList(cave: Cave): void {
  const container = $('#managersList');
  if (!container) return;

  container.innerHTML = '';

  cave.managersList.forEach(manager => {
    const card = createElement('div', 'manager-card');
    card.innerHTML = `
      <div class="manager-avatar">${manager.avatar}</div>
      <div class="manager-info">
        <div class="manager-name">${manager.name}</div>
        <div class="manager-role">${manager.role}</div>
        <div class="manager-contact">
          <div>📧 ${manager.email}</div>
          <div>📱 ${manager.phone}</div>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderProductivityStats(cave: Cave): void {
  const container = $('#productivityGrid');
  if (!container) return;

  container.innerHTML = '';

  cave.monthlyStats.forEach(stat => {
    const card = createElement('div', 'productivity-card');
    card.innerHTML = `
      <h4>${stat.month}</h4>
      <div class="productivity-stat">
        <span>Ventes:</span>
        <span>${stat.sales.toLocaleString()} FCFA</span>
      </div>
      <div class="productivity-stat">
        <span>Commandes:</span>
        <span>${stat.orders}</span>
      </div>
      <div class="productivity-stat">
        <span>Productivité:</span>
        <span>${stat.avgProductivity}%</span>
      </div>
    `;
    container.appendChild(card);
  });

  // Global stats
  const globalContainer = $('#globalStatsGrid');
  if (!globalContainer) return;

  const avgSales = cave.monthlyStats.reduce((sum, s) => sum + s.sales, 0) / cave.monthlyStats.length;
  const avgOrders = cave.monthlyStats.reduce((sum, s) => sum + s.orders, 0) / cave.monthlyStats.length;
  const avgProd = cave.monthlyStats.reduce((sum, s) => sum + s.avgProductivity, 0) / cave.monthlyStats.length;

  globalContainer.innerHTML = `
    <div class="global-stat-item">
      <div class="global-stat-label">Ventes moyennes</div>
      <div class="global-stat-value">${avgSales.toLocaleString()} FCFA</div>
    </div>
    <div class="global-stat-item">
      <div class="global-stat-label">Commandes moyennes</div>
      <div class="global-stat-value">${Math.round(avgOrders)}</div>
    </div>
    <div class="global-stat-item">
      <div class="global-stat-label">Productivité moyenne</div>
      <div class="global-stat-value">${avgProd.toFixed(1)}%</div>
    </div>
  `;
}

// ===== ADD CAVE MODAL =====

function openAddCaveModal(): void {
  const modal = $('#addCaveModal');
  if (modal) modal.classList.add('show');
}

function closeAddCaveModal(): void {
  const modal = $('#addCaveModal');
  if (modal) modal.classList.remove('show');

  const form = $('#addCaveForm') as HTMLFormElement;
  if (form) form.reset();
}

function addNewCave(): void {
  const form = $('#addCaveForm') as HTMLFormElement;
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  alert('Nouvelle cave créée avec succès!');
  closeAddCaveModal();
}

// ===== INITIALIZATION =====

document.addEventListener('DOMContentLoaded', () => {
  updateCarousel();

  // Auto-rotate carousel every 5 seconds
  setInterval(nextDrink, 5000);

  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.user-profile')) {
      const dropdown = $('#userDropdown');
      if (dropdown) dropdown.classList.remove('show');
    }
  });

  // Close modals when clicking outside
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('modal')) {
      target.classList.remove('show');
    }
  });

  console.log('DrinkStore Pro TypeScript initialized ✓');
});

// ===== EXPORTS (for module usage) =====

export {
  navigateTo,
  toggleSubmenu,
  toggleUserDropdown,
  nextDrink,
  previousDrink,
  goToDrink,
  openCaveModal,
  closeCaveModal,
  switchTab,
  openAddCaveModal,
  closeAddCaveModal,
  addNewCave
};
