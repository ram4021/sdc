/* ============================================================
   SDC ISP — Billing Management System
   Self-contained web app using localStorage for persistence.
   ============================================================ */

const STORAGE_KEY = 'sdc_isp_data_v1';
const AUTH_KEY = 'sdc_isp_auth_v1';
const SESSION_KEY = 'sdc_isp_session_v1';

/* ---------- Authentication ---------- */
function getAuth() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  // Default admin account
  const def = { username: 'admin', password: 'admin123' };
  localStorage.setItem(AUTH_KEY, JSON.stringify(def));
  return def;
}
function saveAuth(a) { localStorage.setItem(AUTH_KEY, JSON.stringify(a)); }

function isLoggedIn() { return sessionStorage.getItem(SESSION_KEY) === '1'; }
function setLoggedIn(v) { v ? sessionStorage.setItem(SESSION_KEY, '1') : sessionStorage.removeItem(SESSION_KEY); }

function doLogin(e) {
  e.preventDefault();
  const u = $('#loginUsername').value.trim();
  const p = $('#loginPass').value;
  const auth = getAuth();
  const err = $('#loginError');
  if (u === auth.username && p === auth.password) {
    setLoggedIn(true);
    $('#loginScreen').classList.add('hidden');
    $('#userName').textContent = auth.username;
    $('#userAvatar').textContent = (auth.username[0] || 'A').toUpperCase();
    $('#loginPass').value = '';
    err.classList.remove('show');
    toast('Welcome back, ' + auth.username);
    switchView('dashboard');
  } else {
    err.textContent = 'Invalid username or password. Please try again.';
    err.classList.add('show');
    $('#loginPass').value = '';
  }
  return false;
}

function doLogout() {
  setLoggedIn(false);
  $('#loginScreen').classList.remove('hidden');
  $('#loginError').classList.remove('show');
  toast('You have been logged out');
}

function changePassword() {
  const auth = getAuth();
  openModal('Change Password', `
    <form class="form-grid" onsubmit="return submitPassword(event)">
      <div class="form-group full"><label>Current Password *</label><input class="input" id="cp_current" type="password" required /></div>
      <div class="form-group"><label>New Password *</label><input class="input" id="cp_new" type="password" minlength="4" required /></div>
      <div class="form-group"><label>Confirm New Password *</label><input class="input" id="cp_confirm" type="password" minlength="4" required /></div>
      <div class="form-actions full">
        <button type="button" class="btn btn-ghost" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary">Update Password</button>
      </div>
    </form>`);
}

function submitPassword(e) {
  e.preventDefault();
  const auth = getAuth();
  const cur = $('#cp_current').value;
  const nw = $('#cp_new').value;
  const cf = $('#cp_confirm').value;
  if (cur !== auth.password) { toast('Current password is incorrect', 'error'); return false; }
  if (nw.length < 4) { toast('New password must be at least 4 characters', 'error'); return false; }
  if (nw !== cf) { toast('New passwords do not match', 'error'); return false; }
  auth.password = nw;
  saveAuth(auth);
  closeModal();
  toast('Password updated successfully');
  return false;
}

/* ---------- Seed Data ---------- */
function seedData() {
  const today = new Date();
  const fmt = (d) => d.toISOString().slice(0, 10);
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

  const plans = [
    { id: 'p1', name: 'Starter', speed: '20 Mbps', price: 500, validity: 30, description: 'Basic home internet' },
    { id: 'p2', name: 'Family', speed: '50 Mbps', price: 900, validity: 30, description: 'Popular family plan' },
    { id: 'p3', name: 'Pro', speed: '100 Mbps', price: 1500, validity: 30, description: 'High-speed streaming & gaming' },
    { id: 'p4', name: 'Business', speed: '250 Mbps', price: 3000, validity: 30, description: 'Dedicated business line' },
  ];

  const customers = [
    { id: 'c1', name: 'Aarav Sharma', phone: '9801000001', address: 'Baneshwor, Kathmandu', email: 'aarav@example.com', connectionType: 'Fiber', planId: 'p2', joinDate: fmt(addDays(today, -120)), status: 'active' },
    { id: 'c2', name: 'Priya Gurung', phone: '9801000002', address: 'Lakeside, Pokhara', email: 'priya@example.com', connectionType: 'Fiber', planId: 'p3', joinDate: fmt(addDays(today, -90)), status: 'active' },
    { id: 'c3', name: 'Ramesh Thapa', phone: '9801000003', address: 'Biratnagar', email: 'ramesh@example.com', connectionType: 'DSL', planId: 'p1', joinDate: fmt(addDays(today, -200)), status: 'active' },
    { id: 'c4', name: 'Sita Rai', phone: '9801000004', address: 'Boudha, Kathmandu', email: 'sita@example.com', connectionType: 'Fiber', planId: 'p4', joinDate: fmt(addDays(today, -60)), status: 'active' },
    { id: 'c5', name: 'Kiran Maharjan', phone: '9801000005', address: 'Patan, Lalitpur', email: 'kiran@example.com', connectionType: 'Wireless', planId: 'p2', joinDate: fmt(addDays(today, -30)), status: 'active' },
  ];

  // Renewal dates: some expired, some upcoming
  const renewals = [
    { id: 'r1', customerId: 'c1', planId: 'p2', startDate: fmt(addDays(today, -5)), endDate: fmt(addDays(today, 25)), status: 'active' },
    { id: 'r2', customerId: 'c2', planId: 'p3', startDate: fmt(addDays(today, -10)), endDate: fmt(addDays(today, 20)), status: 'active' },
    { id: 'r3', customerId: 'c3', planId: 'p1', startDate: fmt(addDays(today, -40)), endDate: fmt(addDays(today, -10)), status: 'expired' },
    { id: 'r4', customerId: 'c4', planId: 'p4', startDate: fmt(addDays(today, -2)), endDate: fmt(addDays(today, 28)), status: 'active' },
    { id: 'r5', customerId: 'c5', planId: 'p2', startDate: fmt(addDays(today, -35)), endDate: fmt(addDays(today, -5)), status: 'expired' },
  ];

  const bills = [
    { id: 'b1', customerId: 'c1', month: '2026-08', amount: 900, status: 'paid', dueDate: fmt(addDays(today, -5)), paidDate: fmt(addDays(today, -6)) },
    { id: 'b2', customerId: 'c2', month: '2026-08', amount: 1500, status: 'pending', dueDate: fmt(addDays(today, 5)), paidDate: null },
    { id: 'b3', customerId: 'c3', month: '2026-08', amount: 500, status: 'overdue', dueDate: fmt(addDays(today, -15)), paidDate: null },
    { id: 'b4', customerId: 'c4', month: '2026-08', amount: 3000, status: 'paid', dueDate: fmt(addDays(today, -3)), paidDate: fmt(addDays(today, -4)) },
    { id: 'b5', customerId: 'c5', month: '2026-08', amount: 900, status: 'overdue', dueDate: fmt(addDays(today, -8)), paidDate: null },
  ];

  return { plans, customers, renewals, bills, nextIds: { c: 6, p: 5, r: 6, b: 6 } };
}

/* ---------- State ---------- */
let db = load();
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return seedData();
}
function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(db)); }
function uid(prefix) { return prefix + (db.nextIds[prefix]++); }

/* ---------- Helpers ---------- */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const money = (n) => 'Rs ' + Number(n).toLocaleString('en-IN');
const todayStr = () => new Date().toISOString().slice(0, 10);

function customerById(id) { return db.customers.find(c => c.id === id); }
function planById(id) { return db.plans.find(p => p.id === id); }
function renewalByCustomer(cid) { return db.renewals.find(r => r.customerId === cid); }

function billStatus(bill) {
  if (bill.status === 'paid') return 'paid';
  if (bill.dueDate < todayStr()) return 'overdue';
  return 'pending';
}
function renewalStatus(r) {
  if (r.endDate < todayStr()) return 'expired';
  if (r.endDate <= addDaysStr(7)) return 'upcoming';
  return 'active';
}
function addDaysStr(n) { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); }

function toast(msg, type = 'success') {
  const t = $('#toast');
  t.textContent = msg;
  t.className = 'toast show ' + type;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2600);
}

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

/* ---------- Navigation ---------- */
const viewTitles = {
  dashboard: 'Dashboard', customers: 'Customers', billing: 'Billing',
  plans: 'Plans', renewals: 'Renewals'
};

function switchView(view) {
  $$('.view').forEach(v => v.classList.remove('active'));
  $$('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.view === view));
  $('#view-' + view).classList.add('active');
  $('#pageTitle').textContent = viewTitles[view];
  $('#sidebar').classList.remove('open');
  render(view);
}

/* ---------- Modal ---------- */
function openModal(title, bodyHtml) {
  $('#modalTitle').textContent = title;
  $('#modalBody').innerHTML = bodyHtml;
  $('#modalOverlay').classList.add('open');
}
function closeModal() { $('#modalOverlay').classList.remove('open'); }

/* ---------- Render ---------- */
function render(view) {
  if (!view) view = document.querySelector('.nav-item.active').dataset.view;
  if (view === 'dashboard') renderDashboard();
  else if (view === 'customers') renderCustomers();
  else if (view === 'billing') renderBilling();
  else if (view === 'plans') renderPlans();
  else if (view === 'renewals') renderRenewals();
}

const empty = (msg) => `<tr><td colspan="5"><div class="empty"><div class="empty-icon">📭</div>${msg}</div></td></tr>`;

/* ============ DASHBOARD ============ */
function renderDashboard() {
  const totalCustomers = db.customers.length;
  const activePlans = db.renewals.filter(r => r.status === 'active').length;
  const pendingBills = db.bills.filter(b => billStatus(b) !== 'paid');
  const pendingAmount = pendingBills.reduce((s, b) => s + b.amount, 0);
  const revenue = db.bills.filter(b => b.status === 'paid').reduce((s, b) => s + b.amount, 0);

  const stats = [
    { icon: '👥', label: 'Total Customers', value: totalCustomers, sub: 'registered', color: '#dbeafe', text: '#1d4ed8' },
    { icon: '📡', label: 'Active Plans', value: activePlans, sub: 'currently active', color: '#dcfce7', text: '#15803d' },
    { icon: '⏳', label: 'Pending Payments', value: pendingBills.length, sub: money(pendingAmount) + ' due', color: '#fef3c7', text: '#b45309' },
    { icon: '💰', label: 'Revenue (Paid)', value: money(revenue), sub: 'collected', color: '#e0e7ff', text: '#4338ca' },
  ];

  $('#statsGrid').innerHTML = stats.map(s => `
    <div class="stat-card">
      <div class="stat-icon" style="background:${s.color};color:${s.text}">${s.icon}</div>
      <div class="stat-info">
        <div class="stat-label">${s.label}</div>
        <div class="stat-value">${s.value}</div>
        <div class="stat-sub">${s.sub}</div>
      </div>
    </div>`).join('');

  // Recent bills
  const recentBills = [...db.bills].sort((a, b) => b.dueDate.localeCompare(a.dueDate)).slice(0, 5);
  $('#recentBillsTable').innerHTML = recentBills.length ? `
    <thead><tr><th>Customer</th><th>Month</th><th>Amount</th><th>Status</th></tr></thead>
    <tbody>${recentBills.map(b => {
      const c = customerById(b.customerId);
      return `<tr>
        <td>${esc(c ? c.name : '—')}</td>
        <td>${b.month}</td>
        <td>${money(b.amount)}</td>
        <td><span class="badge badge-${billStatus(b)}">${billStatus(b)}</span></td>
      </tr>`;
    }).join('')}</tbody>` : empty('No bills yet');

  // Upcoming renewals
  const upcoming = db.renewals
    .map(r => ({ ...r, status: renewalStatus(r) }))
    .filter(r => r.status === 'upcoming' || r.status === 'expired')
    .sort((a, b) => a.endDate.localeCompare(b.endDate)).slice(0, 5);
  $('#upcomingRenewalsTable').innerHTML = upcoming.length ? `
    <thead><tr><th>Customer</th><th>Plan</th><th>Expires</th><th>Status</th></tr></thead>
    <tbody>${upcoming.map(r => {
      const c = customerById(r.customerId); const p = planById(r.planId);
      return `<tr>
        <td>${esc(c ? c.name : '—')}</td>
        <td>${esc(p ? p.name : '—')}</td>
        <td>${r.endDate}</td>
        <td><span class="badge badge-${r.status}">${r.status}</span></td>
      </tr>`;
    }).join('')}</tbody>` : empty('No upcoming renewals');
}

/* ============ CUSTOMERS ============ */
function renderCustomers() {
  const q = ($('#customerSearch').value || '').toLowerCase();
  const list = db.customers.filter(c =>
    !q || c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.email.toLowerCase().includes(q)
  );
  $('#customersTable').innerHTML = list.length ? `
    <thead><tr>
      <th>Name</th><th>Phone</th><th>Address</th><th>Connection</th><th>Plan</th><th>Status</th><th>Actions</th>
    </tr></thead>
    <tbody>${list.map(c => {
      const p = planById(c.planId);
      return `<tr>
        <td><strong>${esc(c.name)}</strong><br><small style="color:var(--text-muted)">${esc(c.email)}</small></td>
        <td>${esc(c.phone)}</td>
        <td>${esc(c.address)}</td>
        <td>${esc(c.connectionType)}</td>
        <td>${esc(p ? p.name : '—')}</td>
        <td><span class="badge badge-${c.status === 'active' ? 'active' : 'inactive'}">${c.status}</span></td>
        <td class="actions">
          <button class="btn btn-ghost btn-sm" onclick="viewCustomer('${c.id}')">View</button>
          <button class="btn btn-ghost btn-sm" onclick="editCustomer('${c.id}')">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteCustomer('${c.id}')">Del</button>
        </td>
      </tr>`;
    }).join('')}</tbody>` : empty('No customers found');
}

function customerForm(c) {
  const planOptions = db.plans.map(p => `<option value="${p.id}" ${c && c.planId === p.id ? 'selected' : ''}>${esc(p.name)} — ${money(p.price)}</option>`).join('');
  return `
  <form id="customerForm" class="form-grid" onsubmit="returnCustomer(event)">
    <input type="hidden" id="cf_id" value="${c ? c.id : ''}" />
    <div class="form-group"><label>Full Name *</label><input class="input" id="cf_name" required value="${esc(c ? c.name : '')}" /></div>
    <div class="form-group"><label>Phone *</label><input class="input" id="cf_phone" required value="${esc(c ? c.phone : '')}" /></div>
    <div class="form-group full"><label>Address</label><input class="input" id="cf_address" value="${esc(c ? c.address : '')}" /></div>
    <div class="form-group"><label>Email</label><input class="input" type="email" id="cf_email" value="${esc(c ? c.email : '')}" /></div>
    <div class="form-group"><label>Connection Type</label>
      <select class="input" id="cf_conn">
        ${['Fiber', 'DSL', 'Wireless', 'Cable'].map(t => `<option ${c && c.connectionType === t ? 'selected' : ''}>${t}</option>`).join('')}
      </select>
    </div>
    <div class="form-group"><label>Plan</label><select class="input" id="cf_plan">${planOptions}</select></div>
    <div class="form-group"><label>Status</label>
      <select class="input" id="cf_status">
        <option value="active" ${c && c.status === 'active' ? 'selected' : ''}>Active</option>
        <option value="inactive" ${c && c.status === 'inactive' ? 'selected' : ''}>Inactive</option>
      </select>
    </div>
    <div class="form-actions full">
      <button type="button" class="btn btn-ghost" onclick="closeModal()">Cancel</button>
      <button type="submit" class="btn btn-primary">${c ? 'Save Changes' : 'Add Customer'}</button>
    </div>
  </form>`;
}

function addCustomer() { openModal('Add New Customer', customerForm(null)); }
function editCustomer(id) { openModal('Edit Customer', customerForm(customerById(id))); }

function returnCustomer(e) {
  e.preventDefault();
  const id = $('#cf_id').value;
  const data = {
    name: $('#cf_name').value.trim(),
    phone: $('#cf_phone').value.trim(),
    address: $('#cf_address').value.trim(),
    email: $('#cf_email').value.trim(),
    connectionType: $('#cf_conn').value,
    planId: $('#cf_plan').value,
    status: $('#cf_status').value,
  };
  if (id) {
    Object.assign(customerById(id), data);
    toast('Customer updated');
  } else {
    const c = { id: uid('c'), ...data, joinDate: todayStr() };
    db.customers.push(c);
    // auto-create renewal
    const p = planById(c.planId);
    db.renewals.push({ id: uid('r'), customerId: c.id, planId: c.planId, startDate: todayStr(), endDate: addDaysStr(p ? p.validity : 30), status: 'active' });
    toast('Customer added');
  }
  save(); closeModal(); render();
}

function viewCustomer(id) {
  const c = customerById(id); const p = planById(c.planId);
  const r = renewalByCustomer(id);
  const custBills = db.bills.filter(b => b.customerId === id);
  const paid = custBills.filter(b => b.status === 'paid').reduce((s, b) => s + b.amount, 0);
  const due = custBills.filter(b => b.status !== 'paid').reduce((s, b) => s + b.amount, 0);
  openModal('Customer Details', `
    <div class="detail-list">
      <div class="detail-row"><span class="k">Name</span><span class="v">${esc(c.name)}</span></div>
      <div class="detail-row"><span class="k">Phone</span><span class="v">${esc(c.phone)}</span></div>
      <div class="detail-row"><span class="k">Email</span><span class="v">${esc(c.email)}</span></div>
      <div class="detail-row"><span class="k">Address</span><span class="v">${esc(c.address)}</span></div>
      <div class="detail-row"><span class="k">Connection</span><span class="v">${esc(c.connectionType)}</span></div>
      <div class="detail-row"><span class="k">Plan</span><span class="v">${esc(p ? p.name + ' (' + p.speed + ')' : '—')}</span></div>
      <div class="detail-row"><span class="k">Joined</span><span class="v">${c.joinDate}</span></div>
      <div class="detail-row"><span class="k">Renewal</span><span class="v">${r ? r.endDate + ' <span class="badge badge-' + renewalStatus(r) + '">' + renewalStatus(r) + '</span>' : '—'}</span></div>
      <div class="detail-row"><span class="k">Total Paid</span><span class="v" style="color:var(--green)">${money(paid)}</span></div>
      <div class="detail-row"><span class="k">Amount Due</span><span class="v" style="color:var(--red)">${money(due)}</span></div>
    </div>
    <div class="form-actions">
      <button class="btn btn-ghost" onclick="closeModal()">Close</button>
      <button class="btn btn-primary" onclick="editCustomer('${c.id}')">Edit</button>
    </div>`);
}

function deleteCustomer(id) {
  if (!confirm('Delete this customer and their records?')) return;
  db.customers = db.customers.filter(c => c.id !== id);
  db.renewals = db.renewals.filter(r => r.customerId !== id);
  db.bills = db.bills.filter(b => b.customerId !== id);
  save(); render(); toast('Customer deleted');
}

/* ============ BILLING ============ */
function renderBilling() {
  const filter = $('#billingStatusFilter').value;
  let list = db.bills.map(b => ({ ...b, status: billStatus(b) }));
  if (filter !== 'all') list = list.filter(b => b.status === filter);
  list.sort((a, b) => b.dueDate.localeCompare(a.dueDate));

  $('#billsTable').innerHTML = list.length ? `
    <thead><tr>
      <th>Customer</th><th>Month</th><th>Amount</th><th>Due Date</th><th>Status</th><th>Actions</th>
    </tr></thead>
    <tbody>${list.map(b => {
      const c = customerById(b.customerId);
      return `<tr>
        <td>${esc(c ? c.name : '—')}</td>
        <td>${b.month}</td>
        <td>${money(b.amount)}</td>
        <td>${b.dueDate}</td>
        <td><span class="badge badge-${b.status}">${b.status}</span></td>
        <td class="actions">
          ${b.status !== 'paid' ? `<button class="btn btn-success btn-sm" onclick="markPaid('${b.id}')">Mark Paid</button>` : ''}
          <button class="btn btn-ghost btn-sm" onclick="viewBill('${b.id}')">History</button>
        </td>
      </tr>`;
    }).join('')}</tbody>` : empty('No bills');
}

function generateBills() {
  const month = todayStr().slice(0, 7);
  let created = 0;
  db.customers.forEach(c => {
    const exists = db.bills.some(b => b.customerId === c.id && b.month === month);
    if (!exists) {
      const p = planById(c.planId);
      db.bills.push({ id: uid('b'), customerId: c.id, month, amount: p ? p.price : 0, status: 'pending', dueDate: addDaysStr(7), paidDate: null });
      created++;
    }
  });
  save(); render(); toast(created ? `Generated ${created} bill(s) for ${month}` : 'Bills already generated for this month');
}

function markPaid(id) {
  const b = db.bills.find(x => x.id === id);
  if (!b) return;
  b.status = 'paid'; b.paidDate = todayStr();
  save(); render(); toast('Payment recorded');
}

function viewBill(id) {
  const b = db.bills.find(x => x.id === id);
  const c = customerById(b.customerId);
  const history = db.bills.filter(x => x.customerId === b.customerId).sort((a, x) => x.month.localeCompare(a.month));
  openModal('Payment History — ' + esc(c ? c.name : ''), `
    <div class="detail-list">
      <div class="detail-row"><span class="k">Current Bill</span><span class="v">${money(b.amount)}</span></div>
      <div class="detail-row"><span class="k">Month</span><span class="v">${b.month}</span></div>
      <div class="detail-row"><span class="k">Status</span><span class="v"><span class="badge badge-${b.status}">${b.status}</span></span></div>
      ${b.paidDate ? `<div class="detail-row"><span class="k">Paid On</span><span class="v">${b.paidDate}</span></div>` : ''}
    </div>
    <h4 style="margin:18px 0 10px;font-size:14px">Payment History</h4>
    <div class="table-wrap"><table class="table">
      <thead><tr><th>Month</th><th>Amount</th><th>Status</th><th>Paid</th></tr></thead>
      <tbody>${history.map(h => `<tr>
        <td>${h.month}</td><td>${money(h.amount)}</td>
        <td><span class="badge badge-${h.status}">${h.status}</span></td>
        <td>${h.paidDate || '—'}</td>
      </tr>`).join('')}</tbody>
    </table></div>
    <div class="form-actions"><button class="btn btn-ghost" onclick="closeModal()">Close</button></div>`);
}

/* ============ PLANS ============ */
function renderPlans() {
  $('#plansTable').innerHTML = db.plans.length ? `
    <thead><tr>
      <th>Plan</th><th>Speed</th><th>Price</th><th>Validity (days)</th><th>Description</th><th>Subscribers</th><th>Actions</th>
    </tr></thead>
    <tbody>${db.plans.map(p => {
      const subs = db.customers.filter(c => c.planId === p.id).length;
      return `<tr>
        <td><strong>${esc(p.name)}</strong></td>
        <td>${esc(p.speed)}</td>
        <td>${money(p.price)}</td>
        <td>${p.validity}</td>
        <td>${esc(p.description || '—')}</td>
        <td><span class="badge badge-active">${subs}</span></td>
        <td class="actions">
          <button class="btn btn-ghost btn-sm" onclick="editPlan('${p.id}')">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deletePlan('${p.id}')">Del</button>
        </td>
      </tr>`;
    }).join('')}</tbody>` : empty('No plans');
}

function planForm(p) {
  return `
  <form class="form-grid" onsubmit="returnPlan(event)">
    <input type="hidden" id="pf_id" value="${p ? p.id : ''}" />
    <div class="form-group"><label>Plan Name *</label><input class="input" id="pf_name" required value="${esc(p ? p.name : '')}" /></div>
    <div class="form-group"><label>Speed</label><input class="input" id="pf_speed" value="${esc(p ? p.speed : '')}" placeholder="e.g. 50 Mbps" /></div>
    <div class="form-group"><label>Price (Rs) *</label><input class="input" id="pf_price" type="number" min="0" required value="${p ? p.price : ''}" /></div>
    <div class="form-group"><label>Validity (days) *</label><input class="input" id="pf_validity" type="number" min="1" required value="${p ? p.validity : 30}" /></div>
    <div class="form-group full"><label>Description</label><input class="input" id="pf_desc" value="${esc(p ? p.description : '')}" /></div>
    <div class="form-actions full">
      <button type="button" class="btn btn-ghost" onclick="closeModal()">Cancel</button>
      <button type="submit" class="btn btn-primary">${p ? 'Save Plan' : 'Add Plan'}</button>
    </div>
  </form>`;
}
function addPlan() { openModal('Add New Plan', planForm(null)); }
function editPlan(id) { openModal('Edit Plan', planForm(planById(id))); }
function returnPlan(e) {
  e.preventDefault();
  const id = $('#pf_id').value;
  const data = {
    name: $('#pf_name').value.trim(),
    speed: $('#pf_speed').value.trim(),
    price: Number($('#pf_price').value),
    validity: Number($('#pf_validity').value),
    description: $('#pf_desc').value.trim(),
  };
  if (id) { Object.assign(planById(id), data); toast('Plan updated'); }
  else { db.plans.push({ id: uid('p'), ...data }); toast('Plan added'); }
  save(); closeModal(); render();
}
function deletePlan(id) {
  if (db.customers.some(c => c.planId === id)) { toast('Cannot delete: plan has subscribers', 'error'); return; }
  if (!confirm('Delete this plan?')) return;
  db.plans = db.plans.filter(p => p.id !== id);
  save(); render(); toast('Plan deleted');
}

/* ============ RENEWALS ============ */
function renderRenewals() {
  const filter = $('#renewalFilter').value;
  let list = db.renewals.map(r => ({ ...r, status: renewalStatus(r) }));
  if (filter !== 'all') list = list.filter(r => r.status === filter);
  list.sort((a, b) => a.endDate.localeCompare(b.endDate));

  $('#renewalsTable').innerHTML = list.length ? `
    <thead><tr>
      <th>Customer</th><th>Plan</th><th>Start</th><th>Expires</th><th>Status</th><th>Actions</th>
    </tr></thead>
    <tbody>${list.map(r => {
      const c = customerById(r.customerId); const p = planById(r.planId);
      return `<tr>
        <td>${esc(c ? c.name : '—')}</td>
        <td>${esc(p ? p.name : '—')}</td>
        <td>${r.startDate}</td>
        <td>${r.endDate}</td>
        <td><span class="badge badge-${r.status}">${r.status}</span></td>
        <td class="actions">
          <button class="btn btn-success btn-sm" onclick="renewPlan('${r.id}')">Renew</button>
          <button class="btn btn-ghost btn-sm" onclick="extendPlan('${r.id}')">Extend</button>
        </td>
      </tr>`;
    }).join('')}</tbody>` : empty('No renewals');
}

function renewPlan(id) {
  const r = db.renewals.find(x => x.id === id);
  const p = planById(r.planId);
  const days = p ? p.validity : 30;
  r.startDate = todayStr();
  r.endDate = addDaysStr(days);
  r.status = 'active';
  save(); render(); toast(`Renewed for ${days} days`);
}

function extendPlan(id) {
  const r = db.renewals.find(x => x.id === id);
  const c = customerById(r.customerId);
  openModal('Extend Validity — ' + esc(c ? c.name : ''), `
    <form class="form-grid" onsubmit="return extend(event, '${r.id}')">
      <div class="form-group full"><label>Current expiry</label><input class="input" value="${r.endDate}" disabled /></div>
      <div class="form-group full"><label>Extend by (days) *</label><input class="input" id="extend_days" type="number" min="1" value="30" required /></div>
      <div class="form-actions full">
        <button type="button" class="btn btn-ghost" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary">Extend</button>
      </div>
    </form>`);
}
function extend(e, id) {
  e.preventDefault();
  const r = db.renewals.find(x => x.id === id);
  const days = Number($('#extend_days').value);
  const d = new Date(r.endDate); d.setDate(d.getDate() + days);
  r.endDate = d.toISOString().slice(0, 10);
  r.status = 'active';
  save(); closeModal(); render(); toast(`Extended by ${days} days`);
}

/* ---------- Event wiring ---------- */
function init() {
  $$('.nav-item').forEach(n => n.addEventListener('click', () => switchView(n.dataset.view)));
  $$('[data-goto]').forEach(b => b.addEventListener('click', () => switchView(b.dataset.goto)));
  $('#menuToggle').addEventListener('click', () => $('#sidebar').classList.toggle('open'));
  $('#modalClose').addEventListener('click', closeModal);
  $('#modalOverlay').addEventListener('click', (e) => { if (e.target === e.currentTarget) closeModal(); });
  $('#addCustomerBtn').addEventListener('click', addCustomer);
  $('#quickAddBtn').addEventListener('click', addCustomer);
  $('#addPlanBtn').addEventListener('click', addPlan);
  $('#generateBillsBtn').addEventListener('click', generateBills);
  $('#customerSearch').addEventListener('input', renderCustomers);
  $('#billingStatusFilter').addEventListener('change', renderBilling);
  $('#renewalFilter').addEventListener('change', renderRenewals);
  $('#logoutBtn').addEventListener('click', doLogout);
  $('#changePassBtn').addEventListener('click', changePassword);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  // Gate the app behind login
  if (isLoggedIn()) {
    const auth = getAuth();
    $('#loginScreen').classList.add('hidden');
    $('#userName').textContent = auth.username;
    $('#userAvatar').textContent = (auth.username[0] || 'A').toUpperCase();
    switchView('dashboard');
  } else {
    $('#loginScreen').classList.remove('hidden');
  }
}

// expose for inline onclick handlers
window.addCustomer = addCustomer;
window.editCustomer = editCustomer;
window.deleteCustomer = deleteCustomer;
window.viewCustomer = viewCustomer;
window.returnCustomer = returnCustomer;
window.addPlan = addPlan;
window.editPlan = editPlan;
window.deletePlan = deletePlan;
window.returnPlan = returnPlan;
window.renewPlan = renewPlan;
window.extendPlan = extendPlan;
window.extend = extend;
window.markPaid = markPaid;
window.viewBill = viewBill;
window.closeModal = closeModal;
window.doLogin = doLogin;
window.doLogout = doLogout;
window.changePassword = changePassword;
window.submitPassword = submitPassword;

document.addEventListener('DOMContentLoaded', init);