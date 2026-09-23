const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text = value => typeof value === 'string' && value.trim().length > 0;
const officialOrigin = value => {
  try { const u = new URL(value); return u.protocol === 'https:' && u.hostname.endsWith('.gov.vn') && u.origin === value && !u.username && !u.password; }
  catch { return false; }
};

export function destinationUrl(value, system) {
  try {
    if (!text(value)) return null;
    const u = new URL(value);
    if (u.protocol !== 'https:' || u.username || u.password || !system?.origins?.some(origin => officialOrigin(origin) && origin === u.origin)) return null;
    // Các liên kết cấu hình không được chứa trạng thái hoặc mã xác thực phiên.
    const query = [...u.searchParams.keys(), ...new URLSearchParams(u.hash.split('?')[1] || '').keys()];
    if (query.some(key => /^(state|code|token|access_token|id_token|refresh_token|password|otp|client_secret)$/i.test(key))) return null;
    return u.href;
  } catch { return null; }
}

export function connectionErrors(registry, id) {
  const errors = [], c = registry?.connections?.[id];
  if (registry?.version !== 1 || !c || typeof c !== 'object') return ['Không tìm thấy cấu hình nơi nộp.'];
  for (const key of ['systemId','title','destinationLabel','buttonLabel','localityNote','verifiedAt']) if (!text(c[key])) errors.push(`Thiếu ${key}.`);
  if (!['portal-link','locality-link'].includes(c.mode)) errors.push('Chế độ kết nối chưa được hỗ trợ.');
  const system = registry.systems?.[c.systemId];
  if (!text(system?.name)) errors.push('Thiếu tên hệ thống.');
  if (!destinationUrl(c.entryUrl, system)) errors.push('Đường dẫn nơi nộp không hợp lệ.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(c.verifiedAt || '') || Number.isNaN(Date.parse(c.verifiedAt))) errors.push('Ngày kiểm tra không hợp lệ.');
  if (!Object.values(registry.systems || {}).some(s => destinationUrl(c.evidenceUrl, s))) errors.push('Thiếu nguồn đối chiếu hợp lệ.');
  if (!Array.isArray(c.nextSteps) || !c.nextSteps.length || c.nextSteps.some(s => !text(s?.title) || !text(s?.text))) errors.push('Thiếu các bước sau khi mở cổng.');
  for (const key of ['fallback','tracking']) {
    const target = c[key];
    if (!text(target?.label) || !text(target?.instruction) || !destinationUrl(target?.url, registry.systems?.[target?.systemId])) errors.push(`Cấu hình ${key} chưa hợp lệ.`);
  }
  if (c.mode === 'locality-link' && (!text(c.selectedLocality?.province) || !text(c.selectedLocality?.ward))) errors.push('Thiếu địa bàn đã chọn.');
  if (c.mode === 'portal-link' && c.selectedLocality) errors.push('Liên kết cổng không được hiển thị địa bàn đã chọn sẵn.');
  if (c.shortcut && !text(c.description)) errors.push('Thiếu mô tả lối vào dịch vụ.');
  return errors;
}

export function getConnection(registry, id) {
  return connectionErrors(registry, id).length ? null : registry.connections[id];
}

function external(url, label, cls = 'text-link', entry = false) {
  return `<a class="${cls}" href="${esc(url)}" target="_blank" rel="noopener noreferrer" ${entry ? 'data-open-destination' : ''}>${esc(label)} <span aria-hidden="true">↗</span><span class="sr-only"> (mở tab mới)</span></a>`;
}

export function renderConnection(registry, id) {
  const c = getConnection(registry, id);
  if (!c) return `<div class="connection-unavailable"><h3>Chưa tải được nơi nộp hồ sơ</h3><p>Bạn vẫn có thể xem hướng dẫn chuẩn bị. Hãy tải lại trang hoặc liên hệ đầu mối phường để được chỉ đúng nơi nộp.</p><button type="button" class="secondary-button" data-retry-destination>Tải lại trang</button> <a class="text-link" href="#ho-tro">Xem đầu mối hỗ trợ</a></div>`;
  const system = registry.systems[c.systemId];
  return `<section class="connection-card" aria-label="Nơi thực hiện trên cổng chính thức">
    <div class="connection-kicker">NƠI BẠN SẮP TRUY CẬP</div>
    <h3>${esc(c.destinationLabel)}</h3><p class="connection-system">${esc(system.name)}<span>${esc(new URL(c.entryUrl).hostname)}</span></p>
    ${c.selectedLocality ? `<div class="connection-locality">Đã chọn trên đường dẫn: <strong>${esc(c.selectedLocality.province)} · ${esc(c.selectedLocality.ward)}</strong></div>` : ''}
    <p class="connection-locality-note">${esc(c.localityNote)}</p>
    <h4>Sang cổng, bạn làm lần lượt:</h4><ol class="connection-steps">${c.nextSteps.map((s,i)=>`<li><span aria-hidden="true">${i+1}</span><div><strong>${esc(s.title)}</strong><p>${esc(s.text)}</p></div></li>`).join('')}</ol>
    ${external(c.entryUrl,c.buttonLabel,'primary-button connection-open',true)}
    <p class="connection-tab-tip">Cổng mở trong tab mới. Giữ tab Cẩm Nang Số để xem lại hướng dẫn.</p>
    <p class="connection-status" role="status" data-destination-status></p>
    <details class="connection-fallback"><summary>Tôi không mở được hoặc không thấy đúng thủ tục</summary><p>${esc(c.fallback.instruction)}</p>${external(c.fallback.url,c.fallback.label)}<p>Nếu vẫn gặp khó khăn, ghi lại tên thủ tục và nội dung lỗi để hỏi đầu mối hỗ trợ.</p><a class="text-link" href="#ho-tro">Liên hệ hỗ trợ tại phường</a></details>
    <details class="connection-verification"><summary>Thông tin đường dẫn</summary><p>Kiểm tra ngày ${esc(c.verifiedAt.split('-').reverse().join('/'))}. Trang đích có thể được cập nhật; hãy đối chiếu tên dịch vụ và cơ quan trước khi gửi.</p>${external(c.evidenceUrl,'Xem trang chính thức để đối chiếu')}</details>
  </section>`;
}

export function renderTracking(registry, id) {
  const c = getConnection(registry,id);
  if (!c) return `<p>Chưa tải được liên kết tra cứu. Xem hướng dẫn trên thông báo tiếp nhận hoặc <a href="#ho-tro">liên hệ đầu mối hỗ trợ</a>.</p>`;
  return `<div class="connection-tracking"><p>${esc(c.tracking.instruction)}</p>${external(c.tracking.url,c.tracking.label,'primary-button')}</div>`;
}

export function shortcutEntries(registry, term = '') {
  const normalize = value => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d');
  const words = normalize(term).trim().split(/\s+/);
  return Object.entries(registry?.connections || {}).filter(([id,c]) => c?.shortcut && getConnection(registry,id) && words.every(word => normalize(`${c.title} ${c.description} ${c.procedureCode || ''}`).includes(word)));
}

export function renderShortcuts(registry, term = '') {
  const entries = shortcutEntries(registry, term);
  if (!entries.length) return '';
  return `<section class="service-shortcuts" aria-label="Lối vào dịch vụ khác"><h2>Dịch vụ khác tại Pleiku</h2><p>Mở nhanh nơi thực hiện trên cổng chính thức.</p>${entries.map(([id,c])=>`<a class="service-shortcut" href="#noi-nop/${encodeURIComponent(id)}"><span><span class="shortcut-scope">Mở cổng · Chưa có hướng dẫn từng bước</span><strong>${esc(c.title)}</strong><small>${esc(c.description)}</small></span><span aria-hidden="true">→</span></a>`).join('')}</section>`;
}

export function bindConnections(root) {
  root.querySelectorAll('[data-open-destination]').forEach(link => link.addEventListener('click', () => {
    root.querySelector('[data-destination-status]').textContent = 'Bạn vừa chọn mở cổng. Nếu có tab mới, chuyển sang tab đó để tiếp tục. Chỉ khi cổng xác nhận gửi thành công mới có căn cứ kiểm tra hồ sơ đã gửi; thao tác mở đường dẫn chưa phải nộp hồ sơ.';
  }));
  root.querySelectorAll('[data-retry-destination]').forEach(button => button.addEventListener('click', () => location.reload()));
}
