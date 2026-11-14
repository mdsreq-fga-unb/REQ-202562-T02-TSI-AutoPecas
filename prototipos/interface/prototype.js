/* Artefato de representação: estado efêmero e cenários fictícios, sem API. */
'use strict';

const groups = {
  catalog: ['Grupo 01 · US01, US03, US05 e US06', 'Cadastro e manutenção', 'Organize a identificação da peça e suas aplicações.', 'Código duplicado no cadastro manual, formato do ano, edição das aplicações e efeito do status inativo ainda exigem refinamento.'],
  import: ['Grupo 02 · US02', 'Importação de peças', 'Explore a validação de uma planilha antes do cadastro em lote.', 'O modelo da planilha, códigos repetidos no arquivo e a política para lotes com erros estão em aberto. A demonstração não lê arquivos reais.'],
  search: ['Grupo 03 · US04 e US12', 'Busca e disponibilidade', 'Encontre a peça e confira a quantidade física disponível.', 'A demonstração usa um filtro por vez e correspondência parcial, como proposta de interação. A regra definitiva de busca e o saldo inicial precisam de validação.'],
  stock: ['Grupo 04 · US08, US09 e US10', 'Movimentação de estoque', 'Registre entradas, saídas manuais e diferenças de inventário.', 'Fornecedor é uma opção fictícia pré-carregada: a dependência do cadastro de fornecedores permanece aberta. Limites dos campos, ajustes zero e saldo negativo precisam de decisão.'],
  sales: ['Grupo 05 · US15 e US16', 'Vendas e cancelamento', 'Registre os itens vendidos e confira o efeito no estoque.', 'Preço unitário e os três canais apresentados são propostas de interface, ainda a validar. Saldo insuficiente leva a um aviso de refinamento. A confirmação do cancelamento também é uma proposta de interação.'],
};
const seedParts = [
  { id: 1, code: 'FLT-100', name: 'Filtro de óleo', category: 'Filtros', location: 'Estante A · 02', description: 'Peça de exemplo para avaliação.', active: true, balance: 10, applications: [{ brand: 'Fiat', model: 'Palio', year: '2012' }] },
  { id: 2, code: 'PST-200', name: 'Pastilha de freio', category: 'Freios', location: 'Estante B · 01', description: '', active: true, balance: 5, applications: [{ brand: 'Volkswagen', model: 'Gol', year: '2015' }] },
  { id: 3, code: 'COR-300', name: 'Correia dentada', category: 'Motor', location: 'Estante C · 03', description: '', active: true, balance: 0, applications: [{ brand: 'Chevrolet', model: 'Corsa', year: '2010' }] },
];
let parts = structuredClone(seedParts);
let sales = [];
let cart = [];
let page = 'catalog';
let selectedId = 1;
let movementType = 'entry';
let importScenario = 'valid';
let importDone = false;
let searchField = 'name';
let searchTerm = '';
const photoUrls = [];
const content = document.querySelector('#content');
const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const money = (value) => (value / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const getPart = (id = selectedId) => parts.find((part) => part.id === Number(id));
const button = (label, action, id = '', className = '') => `<button type="button" class="${className}" data-action="${action}" data-id="${id}">${label}</button>`;
const input = (label, name, value = '', options = '') => `<label>${label}<input name="${name}" value="${escapeHtml(value)}" ${options}></label>`;
const partOptions = () => parts.map((part) => `<option value="${part.id}" ${part.id === selectedId ? 'selected' : ''}>${escapeHtml(part.code)} · ${escapeHtml(part.name)} (${part.balance} un.)</option>`).join('');
const partSelect = () => `<label>Peça<select name="part" id="part-select">${partOptions()}</select></label>`;

function notice(message) {
  document.querySelector('#notice').textContent = message;
}

function navigate(next, focus = true) {
  if (!groups[next]) next = 'catalog';
  page = next;
  notice('');
  const [group, title, subtitle, review] = groups[page];
  document.querySelector('#group').textContent = group;
  document.querySelector('#title').textContent = title;
  document.querySelector('#subtitle').textContent = subtitle;
  document.querySelector('#review').textContent = review;
  document.querySelectorAll('nav button').forEach((item) => {
    if (item.dataset.page === page) item.setAttribute('aria-current', 'page');
    else item.removeAttribute('aria-current');
  });
  ({ catalog: renderCatalog, import: renderImport, search: renderSearch, stock: renderStock, sales: renderSales })[page]();
  if (focus) document.querySelector('#main').focus();
}

function partTable(list) {
  if (!list.length) return '<div class="empty"><h2>Nenhuma peça encontrada</h2><p>Confira o filtro ou tente outro termo.</p></div>';
  return `<div class="table-wrap"><table><thead><tr><th>Peça</th><th>Categoria</th><th>Saldo</th><th>Status</th><th>Ação</th></tr></thead><tbody>${list.map((part) => `<tr><td><strong>${escapeHtml(part.name)}</strong><small>${escapeHtml(part.code)}</small></td><td>${escapeHtml(part.category)}</td><td>${part.balance} un.</td><td><span class="tag ${part.active ? 'active' : 'inactive'}">${part.active ? 'Ativa' : 'Inativa'}</span></td><td>${button('Ver peça', 'detail', part.id)}</td></tr>`).join('')}</tbody></table></div>`;
}

function renderCatalog() {
  content.innerHTML = `<section class="card"><div class="toolbar"><div><h2>Catálogo de peças</h2><span class="muted">${parts.length} peças nesta demonstração</span></div>${button('+ Cadastrar peça', 'new', '', 'primary')}</div>${partTable(parts)}</section>`;
}

function renderPartForm(id) {
  const part = id ? getPart(id) : { code: '', name: '', category: '', description: '', location: '' };
  content.innerHTML = `<section class="card"><h2>${id ? 'Editar peça · US05' : 'Cadastrar peça · US01'}</h2><p class="muted">Os campos com * são obrigatórios.</p><form id="part-form" data-id="${id || ''}"><div class="grid">${input('Código do fabricante *', 'code', part.code, id ? 'readonly required' : 'required')}${input('Nome *', 'name', part.name, 'required')}${input('Categoria *', 'category', part.category, 'required')}${input('Localização física', 'location', part.location)}<label class="full">Descrição técnica<textarea name="description">${escapeHtml(part.description)}</textarea></label><label class="full">Foto (opcional)<input type="file" name="photo" accept="image/*"><small>A imagem fica apenas nesta sessão. Na edição, deixar vazio preserva a foto atual.</small></label></div>${id ? '<p class="muted">O código do fabricante identifica a peça e não pode ser alterado.</p>' : ''}<div class="actions"><button class="primary" type="submit">${id ? 'Salvar alterações' : 'Cadastrar peça'}</button>${button('Voltar sem salvar', id ? 'detail' : 'catalog', id || '')}</div></form></section>`;
}

function renderDetail(id) {
  selectedId = Number(id);
  const part = getPart();
  content.innerHTML = `<div class="toolbar">${button('← Voltar ao catálogo', 'catalog')}<span class="tag ${part.active ? 'active' : 'inactive'}">${part.active ? 'Peça ativa' : 'Peça inativa'}</span></div><section class="card"><div class="grid"><div><p class="eyebrow">${escapeHtml(part.code)}</p><h2>${escapeHtml(part.name)}</h2><p>${escapeHtml(part.category)} · ${escapeHtml(part.location || 'Localização não informada')}</p><p>${escapeHtml(part.description)}</p>${part.photo ? `<img class="part-photo" src="${escapeHtml(part.photo)}" alt="Foto da peça cadastrada nesta demonstração">` : ''}</div><div><p class="eyebrow">Saldo físico · US12</p><p class="balance">${part.balance} <small>unidades</small></p><p class="muted">${part.balance === 0 ? 'Sem unidades disponíveis.' : 'Saldo desta simulação.'}</p></div></div><div class="actions">${button('Editar peça', 'edit', part.id)}${button(part.active ? 'Inativar peça' : 'Ativar peça', 'status', part.id)}${button('Movimentar estoque', 'stock')}${button('Registrar venda', 'sales', '', 'primary')}</div></section><section class="card"><div class="toolbar"><h2>Aplicações por veículo · US03</h2>${button('+ Associar veículo', 'application', part.id)}</div>${part.applications.length ? `<ul>${part.applications.map((application) => `<li>${escapeHtml(application.brand)} · ${escapeHtml(application.model)} · ${escapeHtml(application.year)}</li>`).join('')}</ul>` : '<p class="muted">Nenhuma aplicação associada.</p>'}</section>`;
}

function renderApplication() {
  content.innerHTML = `<section class="card"><h2>Associar veículo · US03</h2><p>Peça: <strong>${escapeHtml(getPart().name)}</strong></p><form id="application-form"><div class="grid three">${input('Marca *', 'brand', '', 'required')}${input('Modelo *', 'model', '', 'required')}${input('Ano *', 'year', '', 'required placeholder="Ex.: 2012"')}</div><p class="muted">O formato do ano e os intervalos serão definidos no refinamento.</p><div class="actions"><button class="primary" type="submit">Associar veículo</button>${button('Voltar sem associar', 'detail', selectedId)}</div></form></section>`;
}

function renderImport(stage = 'select') {
  const steps = `<ol class="steps"><li class="${stage === 'select' ? 'current' : ''}">1 · Escolher exemplo</li><li class="${stage === 'review' ? 'current' : ''}">2 · Conferir validação</li><li class="${stage === 'done' ? 'current' : ''}">3 · Ver resultado</li></ol>`;
  if (stage === 'select') {
    content.innerHTML = `<section class="card">${steps}<h2>Planilha de demonstração</h2><p>Escolha um cenário fictício. Nenhum arquivo será enviado ou lido.</p><label>Cenário<select id="import-scenario"><option value="valid">pecas-validas.xlsx · 2 registros novos</option><option value="mixed">pecas-com-pendencias.xlsx · válida, duplicada e incompleta</option><option value="format">pecas.csv · formato incompatível</option></select></label><div class="actions">${button('Simular validação da planilha', 'validate-import', '', 'primary')}</div></section>`;
    document.querySelector('#import-scenario').value = importScenario;
    return;
  }
  if (stage === 'done') {
    content.innerHTML = `<section class="card">${steps}<h2>Importação simulada concluída</h2><p>2 peças adicionadas: Vela de ignição (VEL-400) e Amortecedor (AMO-500).</p><p>Os saldos de exemplo começam em zero. Nenhum cadastro anterior foi sobrescrito.</p><div class="actions">${button('Ver catálogo', 'catalog', '', 'primary')}${button('Explorar outro cenário', 'import')}</div></section>`;
    return;
  }
  const mixed = importScenario === 'mixed';
  const invalid = importScenario === 'format';
  const rows = mixed ? '<tr><td>2</td><td>VEL-400</td><td>Vela de ignição</td><td>Dados preenchidos</td></tr><tr><td>3</td><td>FLT-100</td><td>Filtro de óleo</td><td>Código existente · não sobrescrever</td></tr><tr><td>4</td><td>SEM-600</td><td>—</td><td>Nome obrigatório ausente</td></tr>' : '<tr><td>2</td><td>VEL-400</td><td>Vela de ignição</td><td>Válida</td></tr><tr><td>3</td><td>AMO-500</td><td>Amortecedor</td><td>Válida</td></tr>';
  content.innerHTML = `<section class="card">${steps}<h2>Resultado da validação simulada</h2>${invalid ? '<div class="warning">Formato incompatível. A US02 prevê uma planilha .xlsx.</div>' : `<div class="table-wrap"><table><thead><tr><th>Linha</th><th>Código</th><th>Nome</th><th>Resultado</th></tr></thead><tbody>${rows}</tbody></table></div>`}${mixed ? '<div class="warning">Ponto para decidir com o proprietário: rejeitar todo o lote ou importar somente as linhas válidas? Este cenário para aqui, sem escolher uma política.</div>' : ''}${importDone && !mixed && !invalid ? '<div class="warning">Estas duas peças já foram importadas nesta sessão. Os registros existentes serão preservados. Reinicie a demonstração para repetir o lote válido.</div>' : ''}<div class="actions">${!mixed && !invalid && !importDone ? button('Simular importação das 2 peças', 'finish-import', '', 'primary') : ''}${button('Escolher outro exemplo', 'import')}</div></section>`;
}

function renderSearch() {
  const names = { code: 'Código do fabricante', name: 'Nome', category: 'Categoria', brand: 'Marca do veículo', model: 'Modelo do veículo', year: 'Ano do veículo' };
  const query = searchTerm.toLocaleLowerCase('pt-BR');
  const filtered = parts.filter((part) => {
    const values = ['brand', 'model', 'year'].includes(searchField) ? part.applications.map((item) => item[searchField]) : [part[searchField]];
    return !query || values.some((value) => value.toLocaleLowerCase('pt-BR').includes(query));
  });
  content.innerHTML = `<section class="card"><h2>Localizar uma peça</h2><form id="search-form"><div class="grid"><label>Buscar por<select name="field">${Object.entries(names).map(([key, label]) => `<option value="${key}" ${key === searchField ? 'selected' : ''}>${label}</option>`).join('')}</select></label>${input('Termo de busca', 'term', searchTerm, 'required placeholder="Ex.: filtro, FLT-100 ou Palio"')}</div><div class="actions"><button class="primary" type="submit">Buscar peça</button>${button('Limpar busca', 'clear-search')}</div></form></section><section class="card"><div class="toolbar"><h2>${searchTerm ? 'Resultado da busca' : 'Peças de exemplo'}</h2><span class="muted">${filtered.length} resultado(s)</span></div>${partTable(filtered)}</section>`;
}

function renderStock() {
  const labels = { entry: 'Entrada de peças · US08', exit: 'Saída manual · US09', adjustment: 'Ajuste de inventário · US10' };
  content.innerHTML = `<section class="card"><h2>Nova movimentação</h2><form id="stock-form"><div class="grid">${partSelect()}<label>Operação<select name="type" id="movement-type">${Object.entries(labels).map(([value, label]) => `<option value="${value}" ${value === movementType ? 'selected' : ''}>${label}</option>`).join('')}</select></label>${input(movementType === 'adjustment' ? 'Diferença de quantidade (+ ou −)' : 'Quantidade', 'quantity', '', 'type="number" step="1" required')}${movementType !== 'adjustment' ? input('Data da movimentação', 'date', '2026-11-10', 'type="date" required') : ''}${movementType === 'entry' ? `<label>Fornecedor de exemplo<select name="supplier"><option>Distribuidora exemplo</option></select><small>Opção fictícia para avaliar o fluxo; cadastro de fornecedores fora deste protótipo.</small></label>${input('Preço de custo unitário (R$)', 'cost', '', 'type="number" step="0.01" min="0" required')}` : `<label class="full">${movementType === 'adjustment' ? 'Justificativa' : 'Motivo'}<textarea name="reason" required></textarea></label>`}</div><p class="balance">${getPart().balance} <small>unidades antes da operação</small></p>${movementType === 'adjustment' ? '<p class="muted">Informe a diferença, não o saldo final. Exemplo: saldo 10 e diferença −3 resultam em 7.</p>' : ''}<div class="actions"><button class="primary" type="submit">Simular movimentação</button></div></form></section>`;
}

function renderMovementResult(part, before, quantity, fields) {
  const labels = { entry: 'Entrada', exit: 'Saída manual', adjustment: 'Ajuste de inventário' };
  const detail = movementType === 'entry' ? `${escapeHtml(fields.date)} · ${escapeHtml(fields.supplier)} · Custo unitário ${money(Math.round(Number(fields.cost) * 100))}` : `${movementType === 'exit' ? `${escapeHtml(fields.date)} · ` : ''}${escapeHtml(fields.reason)}`;
  content.innerHTML = `<section class="card"><span class="tag active">Movimentação simulada</span><h2>${labels[movementType]} de ${escapeHtml(part.name)}</h2><p>${detail}</p><div class="grid three"><div><p>Saldo anterior</p><p class="balance">${before}</p></div><div><p>Variação</p><p class="balance">${quantity > 0 ? '+' : ''}${quantity}</p></div><div><p>Saldo atualizado</p><p class="balance">${part.balance}</p></div></div><p class="muted">As demais peças mantêm seus saldos.</p><div class="actions">${button('Nova movimentação', 'stock')}${button('Consultar peça', 'detail', part.id, 'primary')}</div></section>`;
}

function renderSales() {
  const total = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
  content.innerHTML = `<section class="card"><h2>Registrar venda · US15</h2><form id="sale-item-form"><div class="grid three">${partSelect()}${input('Quantidade', 'quantity', 1, 'type="number" min="1" step="1" required')}${input('Preço unitário proposto (R$)', 'price', '', 'type="number" min="0" step="0.01" required')}</div><div class="actions"><button type="submit">Adicionar item à venda</button></div></form><p class="muted">A inclusão no resumo ainda não altera o saldo.</p>${cart.length ? `<div class="table-wrap"><table><thead><tr><th>Peça</th><th>Quantidade</th><th>Subtotal</th><th>Ação</th></tr></thead><tbody>${cart.map((item, index) => `<tr><td>${escapeHtml(getPart(item.id).name)}</td><td>${item.quantity}</td><td>${money(item.quantity * item.price)}</td><td>${button('Remover', 'remove-item', index)}</td></tr>`).join('')}</tbody></table></div>` : '<p class="empty">Adicione uma ou mais peças para compor a venda.</p>'}<form id="sale-form"><label>Canal de origem (opções propostas)<select name="channel"><option>Balcão</option><option>Mercado Livre</option><option>Contato direto</option></select></label><div class="toolbar"><p class="balance">${money(total)}</p><button class="primary" type="submit" ${cart.length ? '' : 'disabled'}>Registrar venda simulada</button></div></form></section><section class="card"><h2>Vendas desta demonstração</h2><p class="muted">Selecione um registro para conferir os itens e avaliar o cancelamento.</p>${sales.length ? `<div class="table-wrap"><table><thead><tr><th>Venda</th><th>Canal</th><th>Total</th><th>Situação</th><th>Ação</th></tr></thead><tbody>${sales.map((sale) => `<tr><td>#${sale.id}</td><td>${escapeHtml(sale.channel)}</td><td>${money(sale.items.reduce((sum, item) => sum + item.quantity * item.price, 0))}</td><td>${sale.cancelled ? 'Cancelada' : 'Registrada'}</td><td>${button('Ver venda', 'sale-detail', sale.id)}</td></tr>`).join('')}</tbody></table></div>` : '<p class="empty">Nenhuma venda registrada nesta sessão.</p>'}</section>`;
}

function renderSale(id, confirming = false) {
  const sale = sales.find((item) => item.id === Number(id));
  const total = sale.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  content.innerHTML = `<section class="card"><span class="tag">${sale.cancelled ? 'Cancelada' : 'Registrada'}</span><h2>Venda #${sale.id} · ${escapeHtml(sale.channel)}</h2><div class="table-wrap"><table><thead><tr><th>Peça</th><th>Quantidade vendida</th><th>Preço unitário</th><th>Saldo atual</th>${confirming ? '<th>Após cancelamento</th>' : ''}</tr></thead><tbody>${sale.items.map((item) => `<tr><td>${escapeHtml(getPart(item.id).name)}</td><td>${item.quantity}</td><td>${money(item.price)}</td><td>${getPart(item.id).balance}</td>${confirming ? `<td>${getPart(item.id).balance + item.quantity}</td>` : ''}</tr>`).join('')}</tbody></table></div><p><strong>Total da venda: ${money(total)}</strong></p>${confirming ? '<div class="warning">Confirmar o cancelamento desta venda? Apenas suas quantidades serão devolvidas ao saldo atual.</div>' : ''}${sale.cancelled ? '<p>As quantidades já foram restabelecidas. Esta venda não pode ser cancelada novamente.</p>' : ''}<div class="actions">${!sale.cancelled ? button(confirming ? 'Confirmar cancelamento' : 'Cancelar venda · US16', confirming ? 'confirm-cancel' : 'cancel-sale', sale.id, 'danger') : ''}${button(confirming ? 'Manter venda' : 'Voltar às vendas', confirming ? 'sale-detail' : 'sales', sale.id)}</div></section>`;
}

document.addEventListener('click', (event) => {
  const target = event.target.closest('button');
  if (!target) return;
  if (target.dataset.page) return navigate(target.dataset.page);
  const action = target.dataset.action;
  const id = target.dataset.id;
  if (groups[action]) return navigate(action);
  notice('');
  switch (action) {
    case 'new': renderPartForm(); break;
    case 'edit': renderPartForm(Number(id)); break;
    case 'detail': renderDetail(id); break;
    case 'application': selectedId = Number(id); renderApplication(); break;
    case 'status': {
      const part = getPart(id);
      part.active = !part.active;
      renderDetail(id);
      notice(`Status alterado para ${part.active ? 'ativa' : 'inativa'}. Os dados e o saldo foram preservados. O efeito desse status nas demais operações está em refinamento.`);
      break;
    }
    case 'validate-import': importScenario = document.querySelector('#import-scenario').value; renderImport('review'); break;
    case 'finish-import': {
      if (importDone || importScenario !== 'valid') break;
      if (parts.some((part) => ['VEL-400', 'AMO-500'].includes(part.code))) {
        notice('Um código do lote já existe. Nada foi sobrescrito. Use outro cenário ou reinicie a demonstração.');
        break;
      }
      for (const [code, name, category] of [['VEL-400', 'Vela de ignição', 'Ignição'], ['AMO-500', 'Amortecedor', 'Suspensão']]) {
        parts.push({ id: Math.max(...parts.map((part) => part.id)) + 1, code, name, category, description: '', location: '', active: true, balance: 0, applications: [] });
      }
      importDone = true;
      renderImport('done');
      break;
    }
    case 'clear-search': searchTerm = ''; renderSearch(); break;
    case 'remove-item': cart.splice(Number(id), 1); renderSales(); break;
    case 'sale-detail': renderSale(id); break;
    case 'cancel-sale': renderSale(id, true); break;
    case 'confirm-cancel': {
      const sale = sales.find((item) => item.id === Number(id));
      if (!sale.cancelled) {
        sale.items.forEach((item) => { getPart(item.id).balance += item.quantity; });
        sale.cancelled = true;
      }
      renderSale(id);
      notice('Venda cancelada na simulação. As quantidades foram devolvidas uma única vez ao saldo atual.');
      break;
    }
  }
});

document.addEventListener('change', (event) => {
  if (event.target.id === 'part-select') {
    selectedId = Number(event.target.value);
    if (page === 'stock') renderStock();
  }
  if (event.target.id === 'movement-type') {
    movementType = event.target.value;
    renderStock();
  }
});

document.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.target;
  const data = new FormData(form);
  const fields = Object.fromEntries(data.entries());
  notice('');
  // Evita que espaços sejam apresentados como preenchimento válido na avaliação.
  const blank = [...form.querySelectorAll('[required]')].find((field) => !field.value.trim());
  if (blank) { blank.focus(); notice('Preencha o campo obrigatório indicado.'); return; }
  if (form.id === 'part-form') {
    const id = Number(form.dataset.id);
    if (!id && parts.some((part) => part.code === fields.code.trim())) {
      notice('Este código já existe no exemplo. O comportamento para duplicidade manual precisa de decisão na US01; este cenário para aqui sem alterar os dados.');
      return;
    }
    if (fields.photo.size && !fields.photo.type.startsWith('image/')) {
      notice('Escolha uma imagem para visualizar a foto neste protótipo.');
      return;
    }
    const part = id ? getPart(id) : { id: Math.max(...parts.map((item) => item.id)) + 1, code: fields.code.trim(), active: true, balance: 0, applications: [] };
    for (const key of ['name', 'category', 'location', 'description']) part[key] = fields[key].trim();
    if (fields.photo.size) {
      part.photo = URL.createObjectURL(fields.photo);
      photoUrls.push(part.photo);
    }
    if (!id) parts.push(part);
    renderDetail(part.id);
    notice(id ? 'Alterações salvas nesta sessão.' : 'Peça cadastrada nesta sessão. O saldo zero inicial é apenas uma convenção do exemplo, ainda a validar.');
  } else if (form.id === 'application-form') {
    getPart().applications.push({ brand: fields.brand.trim(), model: fields.model.trim(), year: fields.year.trim() });
    renderDetail(selectedId);
    notice('Aplicação associada. As aplicações anteriores foram preservadas.');
  } else if (form.id === 'search-form') {
    searchField = fields.field;
    searchTerm = fields.term.trim();
    renderSearch();
    notice('Busca realizada no catálogo desta demonstração.');
  } else if (form.id === 'stock-form') {
    const part = getPart(fields.part);
    const quantity = Number(fields.quantity);
    if (!Number.isSafeInteger(quantity) || quantity === 0 || (movementType !== 'adjustment' && quantity < 0)) {
      notice('Use uma quantidade inteira diferente de zero neste cenário. Para entrada e saída, use um valor positivo. Limites definitivos permanecem em refinamento.'); return;
    }
    const difference = movementType === 'exit' ? -quantity : quantity;
    if (part.balance + difference < 0) {
      notice('O resultado seria um saldo negativo. A regra está em refinamento; este cenário para aqui sem alterar o saldo.'); return;
    }
    const before = part.balance;
    part.balance += difference;
    renderMovementResult(part, before, difference, fields);
    notice('Movimentação concluída somente na demonstração.');
  } else if (form.id === 'sale-item-form') {
    const part = getPart(fields.part);
    const quantity = Number(fields.quantity);
    const price = Math.round(Number(fields.price) * 100);
    if (!Number.isSafeInteger(quantity) || quantity < 1 || !Number.isSafeInteger(price) || price < 0) { notice('Use quantidade inteira positiva e preço válido neste exemplo.'); return; }
    if (cart.some((item) => item.id === part.id)) { notice('A peça já está no resumo. Remova o item para informar outra quantidade neste protótipo.'); return; }
    cart.push({ id: part.id, quantity, price });
    renderSales();
    notice('Item adicionado ao resumo. O estoque ainda não mudou.');
  } else if (form.id === 'sale-form') {
    if (!cart.length) return;
    if (cart.some((item) => item.quantity > getPart(item.id).balance)) { notice('Há item com quantidade superior ao saldo. A política está em refinamento; a demonstração mantém a venda sem registro e preserva os saldos.'); return; }
    cart.forEach((item) => { getPart(item.id).balance -= item.quantity; });
    const sale = { id: sales.length + 1, channel: fields.channel, items: structuredClone(cart), cancelled: false };
    sales.push(sale);
    cart = [];
    renderSale(sale.id);
    notice('Venda registrada na simulação. O saldo foi atualizado para cada item.');
  }
});

document.querySelector('#reset').addEventListener('click', () => {
  photoUrls.splice(0).forEach((url) => URL.revokeObjectURL(url));
  parts = structuredClone(seedParts);
  sales = [];
  cart = [];
  selectedId = 1;
  movementType = 'entry';
  importScenario = 'valid';
  importDone = false;
  searchField = 'name';
  searchTerm = '';
  navigate(page);
  notice('Demonstração reiniciada. Os dados fictícios originais foram restaurados.');
});

navigate(new URLSearchParams(location.search).get('grupo') || 'catalog', false);
