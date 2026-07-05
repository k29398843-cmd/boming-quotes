/* ==============================
   博鸣报价单自动化 - 共享工具
   ============================== */

function showToast(msg, duration) {
  duration = duration || 2000;
  var el = document.getElementById('toast-el');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast-el';
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._timer);
  el._timer = setTimeout(function(){ el.classList.remove('show'); }, duration);
}

function fmtMoney(n) {
  var v = parseFloat(n) || 0;
  return v.toFixed(2);
}

function saveData(key, data) {
  try { localStorage.setItem('boming_' + key, JSON.stringify(data)); } catch(e) {}
}

function loadData(key, def) {
  try { var raw = localStorage.getItem('boming_' + key); return raw ? JSON.parse(raw) : def; }
  catch(e) { return def; }
}

function clearData(key) { localStorage.removeItem('boming_' + key); }

var autoSaveTimer = null;
function scheduleAutoSave(key, getDataFn) {
  clearTimeout(autoSaveTimer);
  autoSaveTimer = setTimeout(function(){ saveData(key, getDataFn()); }, 500);
}

function printPage() { window.print(); }

function exportAllData() {
  var data = {};
  for (var i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    if (key.startsWith('boming_')) { data[key] = localStorage.getItem(key); }
  }
  var blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
  var link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'boming_data_backup.json';
  link.click();
  URL.revokeObjectURL(link.href);
}

function importAllData(file) {
  var reader = new FileReader();
  reader.onload = function(e){
    try {
      var data = JSON.parse(e.target.result);
      Object.keys(data).forEach(function(key){ localStorage.setItem(key, data[key]); });
      showToast('数据导入成功，请刷新页面查看');
      setTimeout(function(){ location.reload(); }, 1000);
    } catch(err) { showToast('数据导入失败：' + err.message); }
  };
  reader.readAsText(file);
}
