import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, ArrowUpRight, Box, CircleDollarSign, Layers3, Menu, PackagePlus, ReceiptText, Search, ShoppingBag, TrendingUp, X } from 'lucide-react';
import { api, type Cost, type Dashboard, type Order, type Product } from './api';
import { MetricCard } from './components/MetricCard';
import { Modal } from './components/Modal';
import { PeriodSelector, type Period } from './components/PeriodSelector';
import { ProductFilter } from './components/ProductFilter';
import { SectionHeader } from './components/SectionHeader';
import { TrendChart } from './components/TrendChart';

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const date = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' });

function localDate(dateValue: Date): string {
  const year = dateValue.getFullYear();
  const month = `${dateValue.getMonth() + 1}`.padStart(2, '0');
  const day = `${dateValue.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function makePeriod(days: 7 | 30 | 90): Period {
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - days + 1);
  return { startDate: localDate(start), endDate: localDate(end), preset: days };
}

const initialPeriod = makePeriod(7);

function App() {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [costs, setCosts] = useState<Cost[]>([]);
  const [period, setPeriod] = useState<Period>(initialPeriod);
  const [appliedPeriod, setAppliedPeriod] = useState<Period>(initialPeriod);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [appliedProducts, setAppliedProducts] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const load = async (nextPeriod: Period = appliedPeriod, nextProducts: string[] = appliedProducts) => {
    setLoading(true);
    setError('');
    try {
      const [nextDashboard, nextOrders, nextProductsList, nextCosts] = await Promise.all([
        api.dashboard(nextPeriod.startDate, nextPeriod.endDate, nextProducts),
        api.orders(nextProducts),
        api.products(),
        api.costs(),
      ]);
      setDashboard(nextDashboard);
      setOrders(nextOrders);
      setProducts(nextProductsList);
      setCosts(nextCosts);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível carregar os dados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(initialPeriod, []); }, []);

  const applyFilters = () => {
    setAppliedPeriod(period);
    setAppliedProducts(selectedProducts);
    void load(period, selectedProducts);
  };

  const choosePreset = (days: 7 | 30 | 90) => {
    const nextPeriod = makePeriod(days);
    setPeriod(nextPeriod);
    setAppliedPeriod(nextPeriod);
    void load(nextPeriod, selectedProducts);
  };

  const updateCost = async (productId: string, amount: number): Promise<Cost> => {
    const updated = await api.updateCost(productId, amount);
    setCosts((current) => current.map((cost) => cost.productId === productId ? { ...cost, amount: updated.amount, updatedAt: updated.updatedAt } : cost));
    const refreshedDashboard = await api.dashboard(appliedPeriod.startDate, appliedPeriod.endDate, appliedProducts);
    setDashboard(refreshedDashboard);
    setError('');
    return updated;
  };

  const visibleOrders = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    if (!query) return orders;
    return orders.filter((order) => [order.id, order.buyer.name, order.buyer.email].some((value) => value.toLocaleLowerCase().includes(query)));
  }, [orders, search]);

  return <div className="app-shell">
    <aside className={mobileMenu ? 'sidebar open' : 'sidebar'}><div className="brand"><div className="brand-mark"><Layers3 size={20} /></div><span>pulse<span className="brand-dot">.</span></span></div><nav><a className="active" href="#dashboard" onClick={() => setMobileMenu(false)}><TrendingUp size={18} /> Visão geral</a><a href="#orders" onClick={() => setMobileMenu(false)}><ShoppingBag size={18} /> Pedidos <small>{orders.length}</small></a><a href="#costs" onClick={() => setMobileMenu(false)}><CircleDollarSign size={18} /> Custos</a><a href="#products" onClick={() => setMobileMenu(false)}><Box size={18} /> Produtos</a></nav><div className="sidebar-note"><span>Período atual</span><strong>{dashboard?.orderCount ?? 0}</strong><small>pedidos encontrados</small></div></aside>
    <main className="main-content"><header className="topbar"><button className="menu-button icon-button" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Abrir menu"><Menu size={20} /></button><div><span className="eyebrow">Workspace / Operações</span><h1>Visão geral</h1></div><div className="topbar-actions"><label className="global-search"><Search size={16} /><input aria-label="Buscar pedidos" placeholder="Buscar pedidos" value={search} onChange={(event) => setSearch(event.target.value)} /></label><div className="avatar">LM</div></div></header>
      {error && <div className="alert error"><AlertCircle size={18} /><span>{error}</span><button className="icon-button" onClick={() => setError('')} aria-label="Fechar alerta"><X size={16} /></button></div>}
      <section id="dashboard" className="dashboard-section"><div className="filter-bar"><div><span className="eyebrow">Resumo financeiro</span><p>Vendas, custos e margem da sua operação</p></div><div className="filter-actions"><ProductFilter products={products} selected={selectedProducts} onChange={setSelectedProducts} /><PeriodSelector period={period} loading={loading} onChange={setPeriod} onApply={applyFilters} onPreset={choosePreset} /></div></div>{loading ? <Loading /> : <div className="metrics"><MetricCard label="Pedidos" value={String(dashboard?.orderCount ?? 0)} tone="blue" icon={<ShoppingBag size={20} />} /><MetricCard label="Faturamento" value={money.format(dashboard?.revenue ?? 0)} tone="violet" icon={<ReceiptText size={20} />} /><MetricCard label="Custo total" value={money.format(dashboard?.cost ?? 0)} tone="amber" icon={<CircleDollarSign size={20} />} /><MetricCard label="Lucro líquido" value={money.format(dashboard?.profit ?? 0)} tone="green" icon={<TrendingUp size={20} />} /></div>}</section>
      <section className="chart-card content-section"><SectionHeader eyebrow="Evolução" title="Vendas, custos e lucro" action={<span className="section-count">{periodLabel(appliedPeriod)}</span>} /><TrendChart points={dashboard?.series ?? []} loading={loading} /></section>
      <section id="orders" className="content-section"><SectionHeader eyebrow="Movimentações" title="Pedidos" action={<span className="section-count">{visibleOrders.length} pedidos</span>} />{loading ? <Loading /> : visibleOrders.length === 0 ? <Empty message={search ? 'Nenhum pedido corresponde à busca.' : 'Nenhum pedido encontrado no período.'} /> : <div className="table-card"><table><thead><tr><th>Pedido</th><th>Comprador</th><th>Data</th><th>Itens</th><th>Valor</th><th /></tr></thead><tbody>{visibleOrders.map((order) => <tr key={order.id}><td><strong className="order-id">{order.id}</strong></td><td><div className="buyer"><span>{order.buyer.name}</span><small>{order.buyer.email}</small></div></td><td>{date.format(new Date(order.createdAt))}</td><td>{order.items.reduce((total, item) => total + item.quantity, 0)} itens</td><td><strong>{money.format(order.totalAmount)}</strong></td><td><button className="text-button" onClick={() => setActiveOrder(order)}>Ver detalhes <ArrowUpRight size={15} /></button></td></tr>)}</tbody></table></div>}</section>
      <div className="two-columns"><section id="costs" className="content-section"><SectionHeader eyebrow="Margem" title="Custos por produto" />{loading ? <Loading /> : <div className="table-card"><table><thead><tr><th>Produto</th><th>Custo atual</th><th>Atualizado</th></tr></thead><tbody>{costs.map((cost) => <CostRow key={cost.productId} cost={cost} onSave={updateCost} />)}</tbody></table>{costs.length === 0 && <Empty message="Cadastre produtos para controlar custos." />}</div>}</section><section id="products" className="content-section"><SectionHeader eyebrow="Catálogo" title="Produtos" action={<button className="button primary small" onClick={() => setShowProductForm(true)}><PackagePlus size={15} /> Novo</button>} />{loading ? <Loading /> : <div className="table-card"><table><thead><tr><th>Produto</th><th>Código interno</th></tr></thead><tbody>{products.map((product) => <tr key={product.id}><td><div className="product-cell"><span className="product-icon"><Box size={16} /></span><strong>{product.name}</strong></div></td><td><span className="tag">{product.sku ?? 'Sem código'}</span></td></tr>)}</tbody></table>{products.length === 0 && <Empty message="Nenhum produto cadastrado." />}</div>}</section></div>
    </main>
    {activeOrder && <Modal title={`Detalhes do pedido ${activeOrder.id}`} onClose={() => setActiveOrder(null)}><div className="order-summary"><div><span>Comprador</span><strong>{activeOrder.buyer.name}</strong><small>{activeOrder.buyer.email}</small></div><div><span>Data</span><strong>{date.format(new Date(activeOrder.createdAt))}</strong></div></div><div className="detail-list">{activeOrder.items.map((item) => <div className="detail-row" key={item.productId}><div><strong>{item.productName}</strong><small>{item.quantity} × {money.format(item.unitPrice)}</small></div><strong>{money.format(item.total)}</strong></div>)}</div><div className="modal-total"><span>Total do pedido</span><strong>{money.format(activeOrder.totalAmount)}</strong></div></Modal>}
    {showProductForm && <ProductForm onClose={() => setShowProductForm(false)} onCreated={async () => { setShowProductForm(false); await load(period, selectedProducts); }} />}
  </div>;
}

function periodLabel(period: Period) {
  return period.preset === 'custom' ? `${period.startDate} — ${period.endDate}` : `Últimos ${period.preset} dias`;
}

function CostRow({ cost, onSave }: { cost: Cost; onSave: (id: string, amount: number) => Promise<Cost> }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(cost.amount?.toString() ?? '');
  const [saving, setSaving] = useState(false);
  const [rowError, setRowError] = useState('');

  const save = async () => {
    const amount = Number(value.replace(',', '.'));
    if (!value.trim() || !Number.isFinite(amount) || amount < 0) { setRowError('Informe um valor válido.'); return; }
    setSaving(true); setRowError('');
    try { const updated = await onSave(cost.productId, amount); setValue(updated.amount?.toString() ?? ''); setEditing(false); }
    catch (cause) { setRowError(cause instanceof Error ? cause.message : 'Não foi possível salvar.'); }
    finally { setSaving(false); }
  };

  return <tr><td><div className="buyer"><strong>{cost.productName}</strong><small>{cost.productId}</small></div></td><td>{editing ? <div className="inline-edit"><input type="text" inputMode="decimal" min="0" value={value} onChange={(event) => setValue(event.target.value)} autoFocus aria-label={`Custo de ${cost.productName}`} /><button className="icon-button success" onClick={() => void save()} disabled={saving} aria-label="Salvar custo">{saving ? <span className="mini-spinner" /> : <span>✓</span>}</button><button className="icon-button" onClick={() => { setEditing(false); setRowError(''); }} disabled={saving} aria-label="Cancelar edição">×</button></div> : <button className="cost-value" onClick={() => setEditing(true)}>{cost.amount === null ? 'Adicionar custo' : money.format(cost.amount)}</button>}{rowError && <small className="row-error">{rowError}</small>}</td><td>{cost.updatedAt ? date.format(new Date(cost.updatedAt)) : <span className="muted">Pendente</span>}</td></tr>;
}

function ProductForm({ onClose, onCreated }: { onClose: () => void; onCreated: () => Promise<void> }) {
  const [form, setForm] = useState({ name: '', sku: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  return <Modal title="Cadastrar produto" onClose={onClose}><form onSubmit={async (event) => { event.preventDefault(); setSaving(true); setError(''); try { await api.createProduct(form); await onCreated(); } catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível cadastrar o produto.'); } finally { setSaving(false); } }}><label className="form-field">Nome<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label><label className="form-field">SKU <span className="muted help-text">Código interno opcional usado para identificar o produto.</span><input aria-describedby="sku-help" value={form.sku} onChange={(event) => setForm({ ...form, sku: event.target.value })} /><small id="sku-help" className="field-help">Ex.: CAM-001</small></label><label className="form-field">Descrição <span className="muted">(opcional)</span><textarea rows={3} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>{error && <div className="form-error">{error}</div>}<div className="form-actions"><button type="button" className="button" onClick={onClose}>Cancelar</button><button className="button primary" disabled={saving}>{saving ? 'Salvando...' : 'Cadastrar produto'}</button></div></form></Modal>;
}

function Loading() { return <div className="loading"><span /><span /><span /></div>; }
function Empty({ message }: { message: string }) { return <div className="empty"><PackagePlus size={22} /><span>{message}</span></div>; }

export { App };
