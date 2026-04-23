/**
 * ============================================================
 *  FARMCORE — Frontend API Integration
 *  Base URL: http://localhost:3000
 *  All protected routes require a JWT token from login.
 * ============================================================
 */

const BASE_URL = 'http://localhost:3000';

// ─── TOKEN HELPERS ───────────────────────────────────────────

function saveToken(token) {
  localStorage.setItem('farmcore_token', token);
}

function getToken() {
  return localStorage.getItem('farmcore_token');
}

function removeToken() {
  localStorage.removeItem('farmcore_token');
}

// ─── BASE FETCH WRAPPER ──────────────────────────────────────
// Automatically attaches the JWT token to every request.

async function apiFetch(endpoint, options = {}) {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Error ${response.status}`);
  }

  return data;
}


// ════════════════════════════════════════════════════════════
//  1. AUTH  —  /api/auth
// ════════════════════════════════════════════════════════════

const Auth = {

  /** Login with email + password. Saves token automatically. */
  async login(email, password) {
    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) saveToken(data.token);
    return data;
  },

  /** Register a new user (admin only). */
  async register(name, email, password, role) {
    return apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });
  },

  /** Get currently logged-in user info. */
  async getMe() {
    return apiFetch('/api/auth/me');
  },

  /** Logout — clears local token. */
  async logout() {
    await apiFetch('/api/auth/logout', { method: 'POST' });
    removeToken();
  },

  /** Send a password reset email. */
  async resetPassword(email) {
    return apiFetch('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
};

/*
  USAGE EXAMPLES — Auth
  ─────────────────────
  // Login
  const result = await Auth.login('admin@farmcore.com', 'Admin@1234');
  console.log(result.user); // { id, name, email, role }

  // Get current user
  const me = await Auth.getMe();
  console.log(me.name);

  // Logout
  await Auth.logout();
*/


// ════════════════════════════════════════════════════════════
//  2. LIVESTOCK  —  /api/livestock
// ════════════════════════════════════════════════════════════

const Livestock = {

  /** Get all animals. Optional filters: { type, status } */
  async getAll(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    return apiFetch(`/api/livestock${query ? '?' + query : ''}`);
  },

  /** Add a new animal. */
  async create(animalData) {
    return apiFetch('/api/livestock', {
      method: 'POST',
      body: JSON.stringify(animalData),
    });
  },

  /** Get a single animal by ID. */
  async getById(id) {
    return apiFetch(`/api/livestock/${id}`);
  },

  /** Update an animal record. */
  async update(id, updates) {
    return apiFetch(`/api/livestock/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  /** Delete an animal (admin only). */
  async delete(id) {
    return apiFetch(`/api/livestock/${id}`, { method: 'DELETE' });
  },

  /** Get livestock stats: count by category, health summary. */
  async getStats() {
    return apiFetch('/api/livestock/stats');
  },
};

/*
  USAGE EXAMPLES — Livestock
  ───────────────────────────
  // Get all cattle
  const cattle = await Livestock.getAll({ type: 'Cattle' });

  // Get only healthy animals
  const healthy = await Livestock.getAll({ status: 'healthy' });

  // Add a new animal
  await Livestock.create({
    tag_id: 'GVF-049',
    type: 'Goat',
    breed: 'Boer',
    gender: 'Female',
    age_months: 8,
    weight_kg: 22.5,
    acquisition_cost: 45000,
    acquired_date: '2025-01-10',
    pen_location: 'Pen B',
  });

  // Update an animal
  await Livestock.update(5, { weight_kg: 25.0, status: 'healthy' });

  // Get stats for dashboard
  const stats = await Livestock.getStats();
  console.log(stats.total, stats.byType, stats.healthSummary);
*/


// ════════════════════════════════════════════════════════════
//  3. MARKETPLACE  —  /api/marketplace
// ════════════════════════════════════════════════════════════

const Marketplace = {

  /** Get all active listings (public — no token needed). */
  async getListings() {
    return apiFetch('/api/marketplace/listings');
  },

  /** Create a new listing. */
  async createListing(listingData) {
    return apiFetch('/api/marketplace/listings', {
      method: 'POST',
      body: JSON.stringify(listingData),
    });
  },

  /** Update an existing listing. */
  async updateListing(id, updates) {
    return apiFetch(`/api/marketplace/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  /** Remove a listing. */
  async deleteListing(id) {
    return apiFetch(`/api/marketplace/listings/${id}`, { method: 'DELETE' });
  },

  /** Submit a buyer enquiry (public — no token needed). */
  async submitEnquiry(enquiryData) {
    return apiFetch('/api/marketplace/enquire', {
      method: 'POST',
      body: JSON.stringify(enquiryData),
    });
  },
};

/*
  USAGE EXAMPLES — Marketplace
  ──────────────────────────────
  // Load all active listings (public page)
  const listings = await Marketplace.getListings();

  // Create a new listing
  await Marketplace.createListing({
    livestock_id: 12,
    title: '3 Boer Goats for Sale',
    description: 'Healthy, vaccinated, ready for immediate pickup',
    price: 180000,
    quantity: 3,
    delivery_available: true,
    location: 'Ibadan, Oyo State',
  });

  // Buyer submits enquiry from listing page
  await Marketplace.submitEnquiry({
    listing_id: 7,
    buyer_name: 'Chukwuemeka Obi',
    buyer_phone: '08012345678',
    buyer_email: 'emeka@email.com',
    message: 'I am interested. Is the price negotiable?',
  });
*/


// ════════════════════════════════════════════════════════════
//  4. ORDERS  —  /api/orders
// ════════════════════════════════════════════════════════════

const Orders = {

  /** Get all orders. */
  async getAll() {
    return apiFetch('/api/orders');
  },

  /** Create a new order. */
  async create(orderData) {
    return apiFetch('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  /** Get a single order by ID. */
  async getById(id) {
    return apiFetch(`/api/orders/${id}`);
  },

  /** Update order status (e.g. confirmed, transit, completed). */
  async updateStatus(id, status) {
    return apiFetch(`/api/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};

/*
  USAGE EXAMPLES — Orders
  ────────────────────────
  // List all orders
  const orders = await Orders.getAll();

  // Place a new order
  await Orders.create({
    listing_id: 7,
    buyer_name: 'Chukwuemeka Obi',
    buyer_phone: '08012345678',
    buyer_email: 'emeka@email.com',
    quantity: 2,
    total_amount: 120000,
    delivery_address: '45 Awolowo Road, Lagos',
    notes: 'Call before delivery',
  });

  // Mark order as completed
  await Orders.updateStatus(3, 'completed');
*/


// ════════════════════════════════════════════════════════════
//  5. INVESTMENTS  —  /api/investments
// ════════════════════════════════════════════════════════════

const Investments = {

  /** Get all investors with ROI status. */
  async getAll() {
    return apiFetch('/api/investments');
  },

  /** Add a new investor. */
  async create(investorData) {
    return apiFetch('/api/investments', {
      method: 'POST',
      body: JSON.stringify(investorData),
    });
  },

  /** Get investor details + payout history. */
  async getById(id) {
    return apiFetch(`/api/investments/${id}`);
  },

  /** Record a payout to an investor. */
  async recordPayout(id, amount) {
    return apiFetch(`/api/investments/${id}/payout`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  },

  /** Get summary: total capital, avg ROI, total returns paid. */
  async getSummary() {
    return apiFetch('/api/investments/summary');
  },
};

/*
  USAGE EXAMPLES — Investments
  ──────────────────────────────
  // Load all investors for dashboard
  const investors = await Investments.getAll();

  // Add a new investor
  await Investments.create({
    name: 'Fatima Bello',
    email: 'fatima@email.com',
    phone: '08098765432',
    investment_amount: 5000000,
    agreed_roi_percent: 20,
    investment_date: '2025-01-01',
    return_date: '2026-01-01',
    category: 'Livestock Fund',
  });

  // Record partial payout
  await Investments.recordPayout(2, 500000);

  // Dashboard summary card
  const summary = await Investments.getSummary();
  console.log(summary.total_capital, summary.avg_roi, summary.total_paid);
*/


// ════════════════════════════════════════════════════════════
//  6. CRM  —  /api/crm
// ════════════════════════════════════════════════════════════

const CRM = {

  /** Get all CRM contacts. */
  async getAll() {
    return apiFetch('/api/crm');
  },

  /** Add a new contact. */
  async create(contactData) {
    return apiFetch('/api/crm', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  },

  /** Get a contact by ID with interaction history. */
  async getById(id) {
    return apiFetch(`/api/crm/${id}`);
  },

  /** Update contact info or pipeline stage. */
  async update(id, updates) {
    return apiFetch(`/api/crm/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  /** Delete a contact. */
  async delete(id) {
    return apiFetch(`/api/crm/${id}`, { method: 'DELETE' });
  },
};

/*
  USAGE EXAMPLES — CRM
  ─────────────────────
  // Load all contacts for Kanban board
  const contacts = await CRM.getAll();

  // Create a new lead from marketplace enquiry
  await CRM.create({
    name: 'Tunde Adeyemi',
    type: 'Lead',
    email: 'tunde@email.com',
    phone: '08011112222',
    city: 'Abuja',
    pipeline_stage: 'New Lead',
    deal_value: 250000,
    notes: 'Interested in 5 bulls',
  });

  // Move a lead to the next pipeline stage
  await CRM.update(4, { pipeline_stage: 'Negotiating' });

  // Mark as Closed Won after sale
  await CRM.update(4, { pipeline_stage: 'Closed Won' });
*/


// ════════════════════════════════════════════════════════════
//  7. FINANCE  —  /api/finance
// ════════════════════════════════════════════════════════════

const Finance = {

  /** Get all transactions. */
  async getAll() {
    return apiFetch('/api/finance');
  },

  /** Log a new income or expense transaction. */
  async create(transactionData) {
    return apiFetch('/api/finance', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
  },

  /** Get P&L summary / dashboard stats. */
  async getSummary() {
    return apiFetch('/api/finance/summary');
  },
};

/*
  USAGE EXAMPLES — Finance
  ─────────────────────────
  // Load all transactions
  const transactions = await Finance.getAll();

  // Log a feed purchase (expense)
  await Finance.create({
    description: 'Purchased 50 bags of maize feed',
    category: 'Feed',
    amount: 125000,
    type: 'expense',
    transaction_date: '2025-04-01',
  });

  // Log income from an animal sale
  await Finance.create({
    description: 'Sold 3 Boer Goats - Order #FC-0021',
    category: 'Animal Sale',
    amount: 180000,
    type: 'income',
    reference_id: 21,
    reference_type: 'order',
  });

  // Load P&L for dashboard
  const summary = await Finance.getSummary();
  console.log(summary.total_income, summary.total_expenses, summary.net_profit);
*/


// ════════════════════════════════════════════════════════════
//  8. ADMIN  —  /api/admin
// ════════════════════════════════════════════════════════════

const Admin = {

  /** Get all users. */
  async getUsers() {
    return apiFetch('/api/admin/users');
  },

  /** Create a new user (admin only). */
  async createUser(userData) {
    return apiFetch('/api/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  /** Update a user's role or status. */
  async updateUser(id, updates) {
    return apiFetch(`/api/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  /** Deactivate/delete a user. */
  async deleteUser(id) {
    return apiFetch(`/api/admin/users/${id}`, { method: 'DELETE' });
  },

  /** Get audit logs. */
  async getAuditLog() {
    return apiFetch('/api/admin/audit-log');
  },
};

/*
  USAGE EXAMPLES — Admin
  ──────────────────────
  // View all users
  const users = await Admin.getUsers();

  // Create a farm manager account
  await Admin.createUser({
    name: 'Ibrahim Musa',
    email: 'ibrahim@farmcore.com',
    password: 'SecurePass@2025',
    role: 'farm_manager',
  });

  // Change a user's role
  await Admin.updateUser(3, { role: 'accountant' });

  // Deactivate a user
  await Admin.updateUser(3, { status: 'inactive' });

  // View audit log
  const logs = await Admin.getAuditLog();
*/


// ════════════════════════════════════════════════════════════
//  HEALTH CHECK
// ════════════════════════════════════════════════════════════

async function checkHealth() {
  return apiFetch('/api/health');
}

/*
  USAGE:
  const health = await checkHealth();
  console.log(health); // { status: 'ok', platform: 'FarmCore', version: '1.0.0' }
*/


// ════════════════════════════════════════════════════════════
//  ERROR HANDLING — wrap any call in try/catch
// ════════════════════════════════════════════════════════════

/*
  EXAMPLE with error handling:

  try {
    const animals = await Livestock.getAll({ type: 'Cattle' });
    renderLivestockTable(animals);
  } catch (error) {
    if (error.message.includes('401')) {
      // Token expired — redirect to login
      window.location.href = '/login.html';
    } else {
      alert('Failed to load livestock: ' + error.message);
    }
  }
*/


// ─── EXPORT ALL MODULES ──────────────────────────────────────
// If using modules (React / bundler), export like this:
// export { Auth, Livestock, Marketplace, Orders, Investments, CRM, Finance, Admin, checkHealth };

// If using plain HTML <script> tags, everything is already global above.
