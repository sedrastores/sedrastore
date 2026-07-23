/**
 * SEDRA STORE – Admin Panel Script
 * Password • CRUD Buttons • Drag & Drop • LocalStorage
 */

/* ══════════════════════════════
   CONSTANTS & STATE
══════════════════════════════ */
const STORAGE_KEY = 'sedra_buttons';
let buttons = [];
let dragSrc  = null;

/* ══════════════════════════════
   LOGIN
══════════════════════════════ */
const loginScreen = document.getElementById('login-screen');
const adminPanel  = document.getElementById('admin-panel');
const passwordInput = document.getElementById('password-input');
const loginBtn      = document.getElementById('login-btn');
const loginError    = document.getElementById('login-error');

// Auto-login if session active
if (sessionStorage.getItem('sedra_admin') === 'true') showPanel();

loginBtn.addEventListener('click', attemptLogin);
passwordInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') attemptLogin();
});

function attemptLogin() {
  const val = passwordInput.value.trim();
  if (val === SEDRA_CONFIG.adminPassword) {
    sessionStorage.setItem('sedra_admin', 'true');
    loginError.textContent = '';
    showPanel();
  } else {
    loginError.textContent = 'كلمة المرور غير صحيحة. حاول مرة أخرى.';
    passwordInput.value = '';
    passwordInput.focus();
    passwordInput.classList.add('shake');
    setTimeout(() => passwordInput.classList.remove('shake'), 500);
  }
}

function showPanel() {
  loginScreen.style.display = 'none';
  adminPanel.hidden = false;
  loadData();
}

document.getElementById('logout-btn').addEventListener('click', () => {
  sessionStorage.removeItem('sedra_admin');
  location.reload();
});

/* ══════════════════════════════
   LOAD DATA
══════════════════════════════ */
function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    buttons = saved ? JSON.parse(saved) : [...SEDRA_CONFIG.defaultButtons];
  } catch {
    buttons = [...SEDRA_CONFIG.defaultButtons];
  }

  // Pre-fill link fields from first 3 default buttons
  const b = buttons;
  const byId = id => b.find(btn => btn.id === id);
  const ws = byId('btn-website');
  const wa = byId('btn-whatsapp');
  const fb = byId('btn-facebook');
  if (ws) document.getElementById('link-website').value   = ws.url;
  if (wa) document.getElementById('link-whatsapp').value  = wa.url;
  if (fb) document.getElementById('link-facebook').value  = fb.url;

  renderList();
}

/* ══════════════════════════════
   SAVE
══════════════════════════════ */
function saveButtons() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(buttons));
  showToast('تم الحفظ بنجاح ✓');
}

/* ══════════════════════════════
   SAVE LINKS BUTTON
══════════════════════════════ */
document.getElementById('save-links-btn').addEventListener('click', () => {
  const wsUrl = document.getElementById('link-website').value.trim();
  const waUrl = document.getElementById('link-whatsapp').value.trim();
  const fbUrl = document.getElementById('link-facebook').value.trim();

  const update = (id, url) => {
    const idx = buttons.findIndex(b => b.id === id);
    if (idx > -1) buttons[idx].url = url;
  };
  update('btn-website',   wsUrl);
  update('btn-whatsapp',  waUrl);
  update('btn-facebook',  fbUrl);

  saveButtons();
  renderList();
});

/* ══════════════════════════════
   ADD BUTTON
══════════════════════════════ */
document.getElementById('add-btn').addEventListener('click', () => {
  openModal(null);
});

/* ══════════════════════════════
   RENDER LIST
══════════════════════════════ */
function renderList() {
  const list = document.getElementById('buttons-list');
  list.innerHTML = '';

  if (buttons.length === 0) {
    list.innerHTML = '<p style="color:var(--text2);text-align:center;padding:24px;opacity:.6;">لا توجد أزرار. أضف زرًا جديدًا.</p>';
    return;
  }

  buttons.forEach((btn, index) => {
    const item = document.createElement('div');
    item.className = 'btn-item';
    item.setAttribute('draggable', 'true');
    item.setAttribute('data-index', index);
    item.setAttribute('role', 'listitem');

    item.innerHTML = `
      <span class="drag-handle" title="اسحب للترتيب" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="9" cy="6"  r="1.5" fill="currentColor"/>
          <circle cx="9" cy="12" r="1.5" fill="currentColor"/>
          <circle cx="9" cy="18" r="1.5" fill="currentColor"/>
          <circle cx="15" cy="6"  r="1.5" fill="currentColor"/>
          <circle cx="15" cy="12" r="1.5" fill="currentColor"/>
          <circle cx="15" cy="18" r="1.5" fill="currentColor"/>
        </svg>
      </span>
      <div class="btn-item-icon">${btn.icon || ''}</div>
      <div class="btn-item-info">
        <div class="btn-item-label">${btn.label}</div>
        <div class="btn-item-url">${btn.url || '—'}</div>
      </div>
      <div class="btn-item-actions">
        <button class="btn btn-edit" data-edit="${index}" aria-label="تعديل">تعديل</button>
        <button class="btn btn-danger" data-delete="${index}" aria-label="حذف">حذف</button>
      </div>
    `;

    // Drag & Drop
    item.addEventListener('dragstart', onDragStart);
    item.addEventListener('dragover',  onDragOver);
    item.addEventListener('drop',      onDrop);
    item.addEventListener('dragend',   onDragEnd);

    // Edit / Delete
    item.querySelector('[data-edit]').addEventListener('click', () => openModal(index));
    item.querySelector('[data-delete]').addEventListener('click', () => deleteButton(index));

    list.appendChild(item);
  });
}

/* ══════════════════════════════
   DRAG & DROP
══════════════════════════════ */
function onDragStart(e) {
  dragSrc = this;
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
}

function onDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  document.querySelectorAll('.btn-item').forEach(el => el.classList.remove('drag-over'));
  this.classList.add('drag-over');
}

function onDrop(e) {
  e.stopPropagation();
  if (dragSrc === this) return;

  const srcIdx  = parseInt(dragSrc.getAttribute('data-index'));
  const destIdx = parseInt(this.getAttribute('data-index'));

  const moved = buttons.splice(srcIdx, 1)[0];
  buttons.splice(destIdx, 0, moved);

  saveButtons();
  renderList();
}

function onDragEnd() {
  document.querySelectorAll('.btn-item').forEach(el => {
    el.classList.remove('dragging', 'drag-over');
  });
  dragSrc = null;
}

/* ══════════════════════════════
   DELETE
══════════════════════════════ */
function deleteButton(index) {
  if (!confirm(`هل تريد حذف "${buttons[index].label}"؟`)) return;
  buttons.splice(index, 1);
  saveButtons();
  renderList();
}

/* ══════════════════════════════
   MODAL (ADD / EDIT)
══════════════════════════════ */
const modalOverlay = document.getElementById('modal-overlay');
const modalId      = document.getElementById('modal-id');
const modalLabel   = document.getElementById('modal-label');
const modalDesc    = document.getElementById('modal-description');
const modalUrl     = document.getElementById('modal-url');
const modalIcon    = document.getElementById('modal-icon');

function openModal(index) {
  const isEdit = index !== null && index !== undefined;

  if (isEdit) {
    const btn = buttons[index];
    modalId.value          = index;
    modalLabel.value       = btn.label       || '';
    modalDesc.value        = btn.description || '';
    modalUrl.value         = btn.url         || '';
    modalIcon.value        = btn.icon        || '';
    document.getElementById('modal-title').textContent = 'تعديل الزر';
  } else {
    modalId.value    = '';
    modalLabel.value = '';
    modalDesc.value  = '';
    modalUrl.value   = '';
    modalIcon.value  = '';
    document.getElementById('modal-title').textContent = 'إضافة زر جديد';
  }

  modalOverlay.hidden = false;
  modalLabel.focus();
}

function closeModal() {
  modalOverlay.hidden = true;
}

document.getElementById('modal-cancel').addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

document.getElementById('modal-save').addEventListener('click', () => {
  const label = modalLabel.value.trim();
  if (!label) { alert('يرجى إدخال عنوان الزر.'); return; }

  const newBtn = {
    id:          'btn-' + Date.now(),
    label:       label,
    description: modalDesc.value.trim(),
    url:         modalUrl.value.trim(),
    icon:        modalIcon.value.trim(),
  };

  const editIndex = modalId.value !== '' ? parseInt(modalId.value) : null;

  if (editIndex !== null) {
    newBtn.id = buttons[editIndex].id; // keep original id
    buttons[editIndex] = newBtn;
  } else {
    buttons.push(newBtn);
  }

  saveButtons();
  renderList();
  closeModal();
});

/* ══════════════════════════════
   TOAST
══════════════════════════════ */
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}
