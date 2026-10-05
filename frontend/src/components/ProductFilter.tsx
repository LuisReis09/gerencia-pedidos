import { Check, ChevronDown, Filter, Search, X } from 'lucide-react';
import { useState } from 'react';
import type { Product } from '../api';

type Props = { products: Product[]; selected: string[]; onChange: (ids: string[]) => void };

export function ProductFilter({ products, selected, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const visibleProducts = products.filter((product) => product.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) || product.sku?.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
  const label = selected.length === 0 ? 'Todos os produtos' : `${selected.length} produto${selected.length > 1 ? 's' : ''}`;

  const toggle = (id: string) => onChange(selected.includes(id) ? selected.filter((selectedId) => selectedId !== id) : [...selected, id]);

  return <div className="product-filter">
    <button className={open ? 'filter-trigger open' : 'filter-trigger'} onClick={() => setOpen(!open)}><Filter size={15} /><span>{label}</span><ChevronDown size={15} /></button>
    {open && <div className="filter-menu">
      <div className="filter-menu-header"><strong>Filtrar produtos</strong><button className="icon-button" onClick={() => setOpen(false)} aria-label="Fechar filtro"><X size={16} /></button></div>
      <label className="filter-search"><Search size={15} /><input placeholder="Buscar produto" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
      <button className="select-all" onClick={() => onChange(selected.length === products.length ? [] : products.map((product) => product.id))}>{selected.length === products.length ? 'Limpar seleção' : 'Selecionar todos'}</button>
      <div className="filter-options">{visibleProducts.length === 0 ? <span className="muted filter-empty">Nenhum produto encontrado.</span> : visibleProducts.map((product) => <label className="filter-option" key={product.id}><input type="checkbox" checked={selected.includes(product.id)} onChange={() => toggle(product.id)} /><span className="checkbox"><Check size={12} /></span><span>{product.name}<small>{product.sku ?? 'Sem SKU'}</small></span></label>)}</div>
      <button className="button primary filter-done" onClick={() => setOpen(false)}>Concluir</button>
    </div>}
  </div>;
}
