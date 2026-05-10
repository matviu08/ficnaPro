// ============================================================
//  users.js — Mock user store (localStorage)
//  У реальному проєкті замінити на API-запити
// ============================================================

const USERS_KEY   = 'viknapro_users';
const SESSION_KEY = 'viknapro_session';

// ── Helpers ───────────────────────────────────────────────
function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
  catch { return []; }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// ── Session ───────────────────────────────────────────────
export function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)) || null; }
  catch { return null; }
}

export function setSession(user) {
  // Не зберігаємо пароль у сесії
  const { password: _, ...safe } = user;
  localStorage.setItem(SESSION_KEY, JSON.stringify(safe));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

// ── Auth operations ───────────────────────────────────────
export function loginUser(email, password) {
  const users = getUsers();
  const user  = users.find(
    u => u.email.toLowerCase() === email.toLowerCase()
  );
  if (!user)                return { ok: false, error: 'Користувача з таким email не знайдено' };
  if (user.password !== hashPassword(password))
    return { ok: false, error: 'Невірний пароль' };

  setSession(user);
  return { ok: true, user };
}

export function registerUser({ name, email, phone, password }) {
  const users = getUsers();
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase()))
    return { ok: false, error: 'Користувач з таким email вже існує' };

  const newUser = {
    id:       Date.now(),
    name:     name.trim(),
    email:    email.toLowerCase().trim(),
    phone:    phone?.trim() || '',
    password: hashPassword(password),
    avatar:   getInitials(name.trim()),
    joinedAt: new Date().toISOString(),
    orders:   [],
  };

  users.push(newUser);
  saveUsers(users);
  setSession(newUser);
  return { ok: true, user: newUser };
}

export function requestPasswordReset(email) {
  const users = getUsers();
  const user  = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return { ok: false, error: 'Email не знайдено' };
  // У реальному проєкті — надсилаємо лист
  return { ok: true, message: `Інструкції надіслано на ${email}` };
}

// ── Utils ─────────────────────────────────────────────────
function hashPassword(pwd) {
  // Проста контрольна сума (не для production!)
  let h = 0;
  for (let i = 0; i < pwd.length; i++) {
    h = (Math.imul(31, h) + pwd.charCodeAt(i)) | 0;
  }
  return String(h);
}

export function getInitials(name) {
  return name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase()).join('');
}

export function getAvatarColor(name) {
  const colors = ['#1a56db','#16a34a','#f97316','#7c3aed','#0891b2','#e63946'];
  let h = 0;
  for (let c of name) h = (h * 31 + c.charCodeAt(0)) | 0;
  return colors[Math.abs(h) % colors.length];
}

// ── Demo seed ─────────────────────────────────────────────
// Створює тестового користувача якщо localStorage порожній
export function seedDemoUser() {
  const users = getUsers();
  if (users.length > 0) return; // вже є
  const demo = {
    id:       1,
    name:     'Олексій Демо',
    email:    'demo@viknapro.ua',
    phone:    '+380991234567',
    password: hashPassword('demo123'),
    avatar:   'ОД',
    joinedAt: new Date().toISOString(),
    orders:   [],
  };
  saveUsers([demo]);
}