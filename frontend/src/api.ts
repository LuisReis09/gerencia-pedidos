const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api';

export type Product = { id: string; name: string; sku: string | null; description: string | null; createdAt: string };
export type Cost = { productId: string; productName: string; amount: number | null; updatedAt: string | null };
export type OrderItem = { productId: string; productName: string; quantity: number; unitPrice: number; total: number };
export type Order = { id: string; buyer: { name: string; email: string }; items: OrderItem[]; totalAmount: number; createdAt: string };
export type DashboardPoint = { date: string; revenue: number; cost: number; profit: number; orderCount: number };
export type Dashboard = { orderCount: number; revenue: number; cost: number; profit: number; series: DashboardPoint[] };

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBase}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options?.headers ?? {}) },
    ...options,
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? 'Não foi possível concluir a operação.');
  }
  return response.json() as Promise<T>;
}

export const api = {
  products: () => request<Product[]>('/products'),
  createProduct: (body: { name: string; sku?: string; description?: string }) => request<Product>('/products', { method: 'POST', body: JSON.stringify(body) }),
  costs: () => request<Cost[]>('/products/costs'),
  updateCost: (id: string, amount: number) => request<Cost>(`/products/${id}/cost`, { method: 'PUT', body: JSON.stringify({ amount }) }),
  orders: (productIds: string[] = []) => request<Order[]>(`/orders${productIds.length ? `?${new URLSearchParams({ productIds: productIds.join(',') })}` : ''}`),
  dashboard: (startDate: string, endDate: string, productIds: string[] = []) => {
    const query = new URLSearchParams();
    if (startDate) query.set('startDate', startDate);
    if (endDate) query.set('endDate', endDate);
    if (productIds.length) query.set('productIds', productIds.join(','));
    return request<Dashboard>(`/dashboard${query.toString() ? `?${query}` : ''}`);
  },
};
