'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, Edit2, AlertCircle, ChevronLeft, Search, FileText, Clock } from 'lucide-react';

type Plant = { id: number; name: string; type: string; stock: number; price: number; log: { date: string; change: number; newStock: number }[] };
type OrderItem = { plantId: number; plantName: string; qty: number; unitPrice: number };
type Order = { id: number; client: string; date: string; status: string; payment: string; items: OrderItem[]; totalPrice: number; notes: string };
type Expense = { id: number; description: string; amount: number; date: string };

const defaultInventory: Plant[] = [
  { id: 1, name: 'Frantoio', type: 'ulivo', stock: 45, price: 12, log: [] },
  { id: 2, name: 'Koroneiki', type: 'ulivo', stock: 32, price: 10, log: [] },
  { id: 3, name: 'Moraiolo', type: 'ulivo', stock: 28, price: 11, log: [] },
  { id: 4, name: 'Leccino', type: 'ulivo', stock: 38, price: 10, log: [] },
  { id: 5, name: 'Tarocco', type: 'agrumi', stock: 25, price: 15, log: [] },
  { id: 6, name: 'Sanguinello', type: 'agrumi', stock: 0, price: 15, log: [] },
  { id: 7, name: 'Limone Liscia', type: 'agrumi', stock: 42, price: 8, log: [] },
  { id: 8, name: 'Clementina', type: 'agrumi', stock: 3, price: 9, log: [] },
];
const defaultOrders: Order[] = [
  { id: 101, client: 'Azienda Agricola Mura', date: '2024-01-15', status: 'confirmed', payment: 'paid', items: [{ plantId: 1, plantName: 'Frantoio', qty: 10, unitPrice: 12 }], totalPrice: 120, notes: '' }
];
const defaultExpenses: Expense[] = [
  { id: 1, description: 'Acquisto fertilizzante', amount: 85, date: '2024-01-10' },
  { id: 2, description: 'Irrigazione gennaio', amount: 120, date: '2024-01-12' }
];

function load<T>(key: string, fallback: T): T {
  try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : fallback; } catch { return fallback; }
}
function save(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export default function VivaioCultivare() {
  const [inventory, setInventory] = useState<Plant[]>(() => load('vivaio_inventory', defaultInventory));
  const [orders, setOrders] = useState<Order[]>(() => load('vivaio_orders', defaultOrders));
  const [expenses, setExpenses] = useState<Expense[]>(() => load('vivaio_expenses', defaultExpenses));

  useEffect(() => { save('vivaio_inventory', inventory); }, [inventory]);
  useEffect(() => { save('vivaio_orders', orders); }, [orders]);
  useEffect(() => { save('vivaio_expenses', expenses); }, [expenses]);

  const [activeTab, setActiveTab] = useState('inventory');
  const [inventoryCategory, setInventoryCategory] = useState<string | null>(null);
  const [showNewPlant, setShowNewPlant] = useState(false);
  const [showNewOrder, setShowNewOrder] = useState(false);
  const [showNewExpense, setShowNewExpense] = useState(false);
  const [editingOrder, setEditingOrder] = useState<number | null>(null);
  const [editingPlant, setEditingPlant] = useState<number | null>(null);
  const [editPlantValue, setEditPlantValue] = useState('');
  const [showLogPlant, setShowLogPlant] = useState<number | null>(null);
  const [orderFilter, setOrderFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [newPlantForm, setNewPlantForm] = useState({ name: '', stock: '', price: '' });
  const [newOrderForm, setNewOrderForm] = useState({ client: '', status: 'pending', payment: 'pending', items: [{ plantId: '', qty: '' }], notes: '' });
  const [newExpenseForm, setNewExpenseForm] = useState({ description: '', amount: '' });

  // Totale automatico ordine
  const computedTotal = useMemo(() =>
    newOrderForm.items.reduce((sum, item) => {
      const plant = inventory.find(p => p.id === parseInt(item.plantId));
      return sum + (plant ? plant.price * (parseInt(item.qty) || 0) : 0);
    }, 0), [newOrderForm.items, inventory]);

  // Handlers inventario
  const handleAddPlant = (type: string) => {
    if (!newPlantForm.name || !newPlantForm.stock) return;
    setInventory([...inventory, { id: Math.max(...inventory.map(p => p.id), 0) + 1, name: newPlantForm.name, type, stock: parseInt(newPlantForm.stock), price: parseFloat(newPlantForm.price) || 0, log: [] }]);
    setNewPlantForm({ name: '', stock: '', price: '' });
    setShowNewPlant(false);
  };

  const handleDeletePlant = (id: number, name: string) => {
    if (window.confirm(`Eliminare "${name}"? Non può essere annullato.`))
      setInventory(inventory.filter(p => p.id !== id));
  };

  const handleConfirmEditPlant = (plantId: number, oldStock: number) => {
    const change = parseInt(editPlantValue);
    if (isNaN(change) || editPlantValue === '') { alert('Inserisci un numero valido (es: +5 o -3)'); return; }
    const newStock = oldStock + change;
    if (newStock < 0) { alert(`Non puoi ridurre sotto zero. Massimo: -${oldStock}`); return; }
    if (window.confirm(`Confermi?\n${oldStock} ${change >= 0 ? '+' : ''}${change} = ${newStock} piante`)) {
      setInventory(inventory.map(p => p.id === plantId ? { ...p, stock: newStock, log: [...(p.log || []), { date: new Date().toLocaleDateString('it-IT'), change, newStock }] } : p));
      setEditingPlant(null);
      setEditPlantValue('');
    }
  };

  // Handlers ordini
  const handleAddOrder = () => {
    if (!newOrderForm.client || !newOrderForm.items[0].plantId || !newOrderForm.items[0].qty) return;
    const newOrder: Order = {
      id: Math.max(...orders.map(o => o.id), 0) + 1,
      client: newOrderForm.client, date: new Date().toISOString().split('T')[0],
      status: newOrderForm.status, payment: newOrderForm.payment, notes: newOrderForm.notes,
      items: newOrderForm.items.filter(i => i.plantId && i.qty).map(item => {
        const plant = inventory.find(p => p.id === parseInt(item.plantId));
        return { plantId: parseInt(item.plantId), plantName: plant?.name || '', qty: parseInt(item.qty), unitPrice: plant?.price || 0 };
      }),
      totalPrice: computedTotal
    };
    setInventory(inventory.map(p => { const r = newOrder.items.filter(i => i.plantId === p.id).reduce((s, i) => s + i.qty, 0); return r > 0 ? { ...p, stock: p.stock - r } : p; }));
    setOrders([...orders, newOrder]);
    setNewOrderForm({ client: '', status: 'pending', payment: 'pending', items: [{ plantId: '', qty: '' }], notes: '' });
    setShowNewOrder(false);
  };

  const handleUpdateOrder = (orderId: number, updates: Partial<Order>) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, ...updates } : o));
    setEditingOrder(null);
  };

  const handleCancelOrder = (orderId: number) => {
    const order = orders.find(o => o.id === orderId);
    if (!order || !window.confirm("Annullare ordine? L'inventario sarà ripristinato.")) return;
    setInventory(inventory.map(p => { const r = order.items.filter(i => i.plantId === p.id).reduce((s, i) => s + i.qty, 0); return r > 0 ? { ...p, stock: p.stock + r } : p; }));
    setOrders(orders.filter(o => o.id !== orderId));
  };

  // Filtri
  const filteredOrders = useMemo(() => {
    let r = [...orders];
    if (orderFilter === 'pending') r = r.filter(o => o.status === 'pending');
    else if (orderFilter === 'confirmed') r = r.filter(o => o.status === 'confirmed');
    else if (orderFilter === 'delivered') r = r.filter(o => o.status === 'delivered');
    else if (orderFilter === 'unpaid') r = r.filter(o => o.payment !== 'paid');
    if (searchQuery) r = r.filter(o => o.client.toLowerCase().includes(searchQuery.toLowerCase()));
    return r.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [orders, orderFilter, searchQuery]);

  const filteredInventory = useMemo(() => {
    let r = inventoryCategory ? inventory.filter(p => p.type === inventoryCategory) : [];
    if (searchQuery) r = r.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return r;
  }, [inventory, inventoryCategory, searchQuery]);

  // Ordini in scadenza (confermati da >5 giorni non ancora spediti)
  const overdueOrders = useMemo(() => orders.filter(o => {
    if (o.status !== 'confirmed') return false;
    return (Date.now() - new Date(o.date).getTime()) / 86400000 > 5;
  }), [orders]);

  // Dati grafico mensile
  const monthlyData = useMemo(() => {
    const map: Record<string, { revenue: number; expenses: number }> = {};
    orders.filter(o => o.payment === 'paid').forEach(o => { const m = o.date.slice(0, 7); if (!map[m]) map[m] = { revenue: 0, expenses: 0 }; map[m].revenue += o.totalPrice; });
    expenses.forEach(e => { const m = e.date.slice(0, 7); if (!map[m]) map[m] = { revenue: 0, expenses: 0 }; map[m].expenses += e.amount; });
    return Object.entries(map).sort().slice(-6).map(([month, data]) => ({ month: new Date(month + '-01').toLocaleDateString('it-IT', { month: 'short', year: '2-digit' }), ...data }));
  }, [orders, expenses]);
  const maxMonthly = Math.max(...monthlyData.flatMap(d => [d.revenue, d.expenses]), 1);

  // KPI
  const totalRevenue = orders.filter(o => o.payment === 'paid').reduce((s, o) => s + o.totalPrice, 0);
  const pendingRevenue = orders.filter(o => o.payment !== 'paid').reduce((s, o) => s + o.totalPrice, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const totalProfit = totalRevenue - totalExpenses;
  const lowStockItems = inventory.filter(i => i.stock < 15);

  // Badge helpers
  const getStatusBadge = (s: string) => ({ pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'In sospeso' }, confirmed: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', label: 'Confermato' }, shipped: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: 'Spedito' }, delivered: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Consegnato' } }[s] || { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'In sospeso' });
  const getPaymentBadge = (s: string) => ({ pending: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'In sospeso' }, partial: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', label: 'Parziale' }, paid: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: 'Pagato' } }[s] || { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'In sospeso' });
  const getStockStyle = (stock: number) => stock === 0 ? 'bg-red-100 text-red-700 border-2 border-red-300' : stock < 15 ? 'bg-amber-100 text-amber-700 border-2 border-amber-300' : 'bg-emerald-100 text-emerald-700 border border-emerald-200';

  const categories = [
    { key: 'ulivo', label: 'Ulivi', emoji: '🫒', bg: 'bg-green-50', border: 'border-green-200', hover: 'hover:bg-green-100', text: 'text-green-800', badge: 'bg-green-100 text-green-700', description: 'Cultivar di olivo' },
    { key: 'agrumi', label: 'Agrumi', emoji: '🍊', bg: 'bg-orange-50', border: 'border-orange-200', hover: 'hover:bg-orange-100', text: 'text-orange-800', badge: 'bg-orange-100 text-orange-700', description: 'Arance, limoni, mandarini' },
    { key: 'altro', label: 'Altro', emoji: '🌿', bg: 'bg-stone-50', border: 'border-stone-200', hover: 'hover:bg-stone-100', text: 'text-stone-800', badge: 'bg-stone-100 text-stone-700', description: 'Altre varietà' },
  ];
  const currentCategory = categories.find(c => c.key === inventoryCategory);

  // Print ordine
  const handlePrint = (order: Order) => {
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`<html><head><title>Ordine #${order.id}</title>
    <style>body{font-family:Georgia,serif;padding:40px;max-width:600px;margin:0 auto}h1{font-size:22px;font-weight:300;border-bottom:1px solid #ccc;padding-bottom:10px}table{width:100%;border-collapse:collapse;margin:16px 0}td,th{padding:8px 12px;text-align:left;border-bottom:1px solid #eee}th{font-weight:600;font-size:13px;color:#666}.meta{color:#666;font-size:14px;margin:4px 0}.notes{background:#f9f9f9;padding:10px;border-radius:6px;margin:12px 0;font-size:13px}.total{font-weight:bold}</style>
    </head><body>
    <h1>🫒 Vivaio Santa Maria - Uta</h1>
    <p class="meta">Ordine #${order.id} &mdash; ${new Date(order.date).toLocaleDateString('it-IT')}</p>
    <p class="meta"><strong>Cliente:</strong> ${order.client}</p>
    <table><tr><th>Pianta</th><th>Qty</th><th>Prezzo unitario</th><th>Subtotale</th></tr>
    ${order.items.map(i => `<tr><td>${i.plantName}</td><td>${i.qty}</td><td>€ ${(i.unitPrice||0).toFixed(2)}</td><td>€ ${((i.unitPrice||0)*i.qty).toFixed(2)}</td></tr>`).join('')}
    <tr class="total"><td colspan="3">Totale</td><td>€ ${order.totalPrice.toFixed(2)}</td></tr></table>
    ${order.notes ? `<div class="notes"><strong>Note:</strong> ${order.notes}</div>` : ''}
    <p class="meta">Stato: ${getStatusBadge(order.status).label} &nbsp;|&nbsp; Pagamento: ${getPaymentBadge(order.payment).label}</p>
    </body></html>`);
    w.document.close();
    w.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-stone-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-stone-900" style={{ fontFamily: 'Georgia, serif' }}>
                🫒 Vivaio Santa Maria - Uta
              </h1>
              <p className="mt-0.5 text-sm text-stone-500">Gestione inventario e ordinazioni</p>
            </div>
            <div className="flex gap-1 sm:gap-2">
              {['inventory', 'orders', 'dashboard'].map(tab => (
                <button key={tab} onClick={() => { setActiveTab(tab); setInventoryCategory(null); setSearchQuery(''); }}
                  className={`px-3 py-2 text-sm font-medium transition-colors rounded-t ${activeTab === tab ? 'text-amber-900 border-b-2 border-amber-700' : 'text-stone-500 hover:text-stone-900'}`}>
                  {tab === 'inventory' ? '📦 Inventario' : tab === 'orders' ? '📋 Ordini' : '📊 Dashboard'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ── INVENTARIO ─────────────────────────────────────────────────────── */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            {lowStockItems.length > 0 && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 flex gap-3">
                <AlertCircle className="h-5 w-5 text-amber-700 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-900">Giacenza bassa o esaurita</p>
                  <p className="text-sm text-amber-800 mt-0.5">{lowStockItems.map(i => `${i.name} (${i.stock === 0 ? 'ESAURITO' : i.stock})`).join(', ')}</p>
                </div>
              </div>
            )}

            {!inventoryCategory ? (
              <div className="space-y-4">
                <h2 className="text-xl font-light text-stone-900">Seleziona categoria</h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  {categories.map(cat => {
                    const items = inventory.filter(p => p.type === cat.key);
                    const total = items.reduce((s, p) => s + p.stock, 0);
                    const esaurite = items.filter(p => p.stock === 0).length;
                    return (
                      <button key={cat.key} onClick={() => { setInventoryCategory(cat.key); setSearchQuery(''); }}
                        className={`rounded-2xl border-2 ${cat.border} ${cat.bg} ${cat.hover} p-8 text-center transition-all hover:shadow-lg hover:-translate-y-1`}>
                        <div className="text-6xl mb-3">{cat.emoji}</div>
                        <h3 className={`text-2xl font-semibold ${cat.text} mb-1`}>{cat.label}</h3>
                        <p className="text-sm text-stone-500 mb-4">{cat.description}</p>
                        <div className="flex justify-center gap-2 flex-wrap">
                          <span className={`rounded-full px-3 py-1 text-xs font-medium ${cat.badge}`}>{items.length} varietà</span>
                          <span className={`rounded-full px-3 py-1 text-xs font-medium ${cat.badge}`}>{total} piante</span>
                          {esaurite > 0 && <span className="rounded-full px-3 py-1 text-xs font-medium bg-red-100 text-red-700">{esaurite} esaurite</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Header categoria */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button onClick={() => { setInventoryCategory(null); setShowNewPlant(false); setEditingPlant(null); setSearchQuery(''); }}
                      className="flex items-center gap-1 text-stone-500 hover:text-stone-900">
                      <ChevronLeft className="h-5 w-5" /><span className="text-sm">Categorie</span>
                    </button>
                    <span className="text-stone-300">|</span>
                    <span className="text-2xl">{currentCategory?.emoji}</span>
                    <h2 className="text-xl font-light text-stone-900">{currentCategory?.label}</h2>
                  </div>
                  <button onClick={() => setShowNewPlant(!showNewPlant)}
                    className="flex items-center gap-2 rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800">
                    <Plus className="h-4 w-4" />Nuova pianta
                  </button>
                </div>

                {/* Ricerca */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                  <input type="text" placeholder="Cerca cultivar..." value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>

                {/* Form nuova pianta */}
                {showNewPlant && (
                  <div className="rounded-lg border border-stone-200 bg-white p-5">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <input type="text" placeholder="Nome cultivar" value={newPlantForm.name}
                        onChange={e => setNewPlantForm({ ...newPlantForm, name: e.target.value })}
                        className="rounded border border-stone-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-amber-500" />
                      <input type="number" placeholder="Giacenza iniziale" value={newPlantForm.stock}
                        onChange={e => setNewPlantForm({ ...newPlantForm, stock: e.target.value })}
                        className="rounded border border-stone-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-amber-500" />
                      <input type="number" placeholder="Prezzo unitario (€)" step="0.01" value={newPlantForm.price}
                        onChange={e => setNewPlantForm({ ...newPlantForm, price: e.target.value })}
                        className="rounded border border-stone-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-amber-500" />
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button onClick={() => handleAddPlant(inventoryCategory)} className="rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800">Aggiungi</button>
                      <button onClick={() => setShowNewPlant(false)} className="rounded-lg border border-stone-300 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50">Annulla</button>
                    </div>
                  </div>
                )}

                {/* Griglia piante */}
                {filteredInventory.length === 0 ? (
                  <div className="rounded-lg border-2 border-dashed border-stone-200 p-12 text-center">
                    <div className="text-4xl mb-3">{currentCategory?.emoji}</div>
                    <p className="text-stone-500">Nessuna pianta trovata.</p>
                    <button onClick={() => setShowNewPlant(true)} className="mt-3 text-sm text-amber-700 font-medium hover:text-amber-800">+ Aggiungi la prima pianta</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredInventory.map(plant => (
                      <div key={plant.id} className="rounded-xl border border-stone-200 bg-white p-5 space-y-3">
                        {/* Nome + prezzo + elimina */}
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-semibold text-stone-900">{plant.name}</h3>
                            {plant.price > 0 && <p className="text-sm text-stone-500 mt-0.5">€ {plant.price.toFixed(2)} / pianta</p>}
                          </div>
                          <button onClick={() => handleDeletePlant(plant.id, plant.name)}
                            className="rounded-lg p-2 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>

                        {/* Badge stock / form modifica */}
                        {editingPlant === plant.id ? (
                          <div className="space-y-3 bg-stone-50 rounded-lg p-4 border border-stone-200">
                            <div className="flex justify-between items-center">
                              <span className="text-base font-medium text-stone-600">Attuale</span>
                              <span className="text-2xl font-bold text-stone-900">{plant.stock}</span>
                            </div>
                            <div className="h-px bg-stone-200" />
                            <input type="number" value={editPlantValue}
                              onChange={e => setEditPlantValue(e.target.value)}
                              autoFocus placeholder="Es: +10 o -5"
                              className="w-full rounded-lg border-2 border-amber-400 px-4 py-3 text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white" />
                            {editPlantValue !== '' && !isNaN(parseInt(editPlantValue)) && (
                              <div className="bg-white rounded-lg p-3 border border-stone-200">
                                <div className="flex justify-between items-center">
                                  <span className="text-base text-stone-600">Risultato</span>
                                  <span className={`text-2xl font-bold ${parseInt(editPlantValue) >= 0 ? 'text-green-600' : 'text-red-600'}`}>{plant.stock + parseInt(editPlantValue)}</span>
                                </div>
                                <p className="text-xs text-stone-400 mt-1">{plant.stock} {parseInt(editPlantValue) >= 0 ? '+' : ''}{editPlantValue} = {plant.stock + parseInt(editPlantValue)} piante</p>
                              </div>
                            )}
                            <div className="flex gap-2">
                              <button onClick={() => handleConfirmEditPlant(plant.id, plant.stock)} className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg text-base font-semibold hover:bg-green-700">✓ Conferma</button>
                              <button onClick={() => { setEditingPlant(null); setEditPlantValue(''); }} className="flex-1 bg-stone-200 text-stone-700 px-4 py-3 rounded-lg text-base font-semibold hover:bg-stone-300">✕ Annulla</button>
                            </div>
                          </div>
                        ) : (
                          <button onClick={() => setEditingPlant(plant.id)}
                            className={`w-full rounded-lg px-4 py-3 text-base font-semibold transition-all hover:opacity-80 ${getStockStyle(plant.stock)}`}>
                            {plant.stock === 0 ? '⚠️ Esaurito — tocca per aggiornare' : `${plant.stock} disponibili — modifica`}
                          </button>
                        )}

                        {/* Storico */}
                        {(plant.log || []).length > 0 && (
                          <div>
                            <button onClick={() => setShowLogPlant(showLogPlant === plant.id ? null : plant.id)}
                              className="text-xs text-stone-500 hover:text-stone-700 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {showLogPlant === plant.id ? 'Nascondi storico' : `Storico (${plant.log.length} modifiche)`}
                            </button>
                            {showLogPlant === plant.id && (
                              <div className="mt-2 space-y-1 bg-stone-50 rounded p-2">
                                {[...(plant.log || [])].reverse().slice(0, 5).map((entry, i) => (
                                  <div key={i} className="flex justify-between text-xs text-stone-600">
                                    <span>{entry.date}</span>
                                    <span className={entry.change >= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                                      {entry.change >= 0 ? '+' : ''}{entry.change} → {entry.newStock}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── ORDINI ─────────────────────────────────────────────────────────── */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Alert ordini in scadenza */}
            {overdueOrders.length > 0 && (
              <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 flex gap-3">
                <Clock className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-orange-900">Ordini confermati da più di 5 giorni — da spedire!</p>
                  <p className="text-sm text-orange-800 mt-0.5">{overdueOrders.map(o => o.client).join(', ')}</p>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center">
              <h2 className="text-xl font-light text-stone-900">Ordinazioni</h2>
              <button onClick={() => setShowNewOrder(!showNewOrder)}
                className="flex items-center gap-2 rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800">
                <Plus className="h-4 w-4" />Nuovo ordine
              </button>
            </div>

            {/* Ricerca + filtri */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <input type="text" placeholder="Cerca cliente..." value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <select value={orderFilter} onChange={e => setOrderFilter(e.target.value)}
                className="rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                <option value="all">Tutti gli ordini</option>
                <option value="pending">In sospeso</option>
                <option value="confirmed">Confermati</option>
                <option value="delivered">Consegnati</option>
                <option value="unpaid">Non pagati</option>
              </select>
            </div>

            {/* Form nuovo ordine */}
            {showNewOrder && (
              <div className="rounded-lg border border-stone-200 bg-white p-6 space-y-4">
                <input type="text" placeholder="Nome cliente" value={newOrderForm.client}
                  onChange={e => setNewOrderForm({ ...newOrderForm, client: e.target.value })}
                  className="w-full rounded border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                <div className="border-t border-stone-200 pt-4">
                  <h4 className="text-sm font-medium text-stone-900 mb-3">Articoli</h4>
                  <div className="space-y-3">
                    {newOrderForm.items.map((item, idx) => {
                      const plant = inventory.find(p => p.id === parseInt(item.plantId));
                      return (
                        <div key={idx} className="flex gap-2 items-center">
                          <select value={item.plantId} onChange={e => { const ni = [...newOrderForm.items]; ni[idx].plantId = e.target.value; setNewOrderForm({ ...newOrderForm, items: ni }); }}
                            className="flex-1 rounded border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                            <option value="">Seleziona pianta</option>
                            {inventory.map(p => <option key={p.id} value={p.id}>{p.name} ({p.stock} disp.) — € {p.price.toFixed(2)}</option>)}
                          </select>
                          <input type="number" placeholder="Qty" min="1" value={item.qty}
                            onChange={e => { const ni = [...newOrderForm.items]; ni[idx].qty = e.target.value; setNewOrderForm({ ...newOrderForm, items: ni }); }}
                            className="w-20 rounded border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                          {plant && item.qty && <span className="text-sm text-stone-500 whitespace-nowrap">€ {(plant.price * parseInt(item.qty)).toFixed(2)}</span>}
                          {newOrderForm.items.length > 1 && (
                            <button onClick={() => setNewOrderForm({ ...newOrderForm, items: newOrderForm.items.filter((_, i) => i !== idx) })} className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <button onClick={() => setNewOrderForm({ ...newOrderForm, items: [...newOrderForm.items, { plantId: '', qty: '' }] })}
                    className="mt-2 text-sm text-amber-700 hover:text-amber-800 font-medium">+ Aggiungi articolo</button>
                </div>
                {computedTotal > 0 && (
                  <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 flex justify-between font-semibold text-amber-900">
                    <span>Totale calcolato</span>
                    <span>€ {computedTotal.toFixed(2)}</span>
                  </div>
                )}
                <textarea placeholder="Note ordine (opzionale)" value={newOrderForm.notes}
                  onChange={e => setNewOrderForm({ ...newOrderForm, notes: e.target.value })}
                  rows={2}
                  className="w-full rounded border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                <div className="grid grid-cols-2 gap-3">
                  <select value={newOrderForm.status} onChange={e => setNewOrderForm({ ...newOrderForm, status: e.target.value })}
                    className="rounded border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                    <option value="pending">In sospeso</option>
                    <option value="confirmed">Confermato</option>
                    <option value="shipped">Spedito</option>
                    <option value="delivered">Consegnato</option>
                  </select>
                  <select value={newOrderForm.payment} onChange={e => setNewOrderForm({ ...newOrderForm, payment: e.target.value })}
                    className="rounded border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                    <option value="pending">Pagamento in sospeso</option>
                    <option value="partial">Parziale</option>
                    <option value="paid">Pagato</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleAddOrder} className="rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800">Crea ordine</button>
                  <button onClick={() => setShowNewOrder(false)} className="rounded-lg border border-stone-300 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50">Annulla</button>
                </div>
              </div>
            )}

            {/* Lista ordini */}
            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="rounded-lg border border-stone-200 bg-stone-50 p-8 text-center"><p className="text-stone-500">Nessun ordine trovato.</p></div>
              ) : filteredOrders.map(order => {
                const sb = getStatusBadge(order.status);
                const pb = getPaymentBadge(order.payment);
                const isOverdue = overdueOrders.some(o => o.id === order.id);
                return (
                  <div key={order.id} className={`rounded-lg border bg-white p-4 sm:p-6 ${isOverdue ? 'border-orange-300' : 'border-stone-200'}`}>
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
                      <div>
                        <h3 className="font-semibold text-stone-900 text-lg">{order.client}</h3>
                        <p className="text-sm text-stone-500">Ord. #{order.id} &nbsp;•&nbsp; {new Date(order.date).toLocaleDateString('it-IT')}</p>
                        {isOverdue && <p className="text-xs text-orange-600 font-medium mt-1">⏰ In attesa di spedizione</p>}
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <span className={`rounded-full px-3 py-1 text-sm font-medium border ${sb.bg} ${sb.text} ${sb.border}`}>{sb.label}</span>
                        <span className={`rounded-full px-3 py-1 text-sm font-medium border ${pb.bg} ${pb.text} ${pb.border}`}>{pb.label}</span>
                      </div>
                    </div>
                    <div className="bg-stone-50 rounded p-3 mb-4 space-y-1">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-stone-900">{item.plantName} × {item.qty}</span>
                          <span className="text-stone-600 font-medium">€ {((item.unitPrice || 0) * item.qty).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="border-t border-stone-200 pt-2 mt-2 flex justify-between font-semibold text-stone-900">
                        <span>Totale</span><span>€ {order.totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                    {order.notes && <p className="text-sm text-stone-500 italic mb-4 px-1">📝 {order.notes}</p>}
                    {editingOrder === order.id ? (
                      <div className="space-y-3 border-t border-stone-200 pt-4">
                        <div className="grid grid-cols-2 gap-3">
                          <select value={order.status} onChange={e => handleUpdateOrder(order.id, { status: e.target.value })}
                            className="rounded border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                            <option value="pending">In sospeso</option><option value="confirmed">Confermato</option>
                            <option value="shipped">Spedito</option><option value="delivered">Consegnato</option>
                          </select>
                          <select value={order.payment} onChange={e => handleUpdateOrder(order.id, { payment: e.target.value })}
                            className="rounded border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                            <option value="pending">In sospeso</option><option value="partial">Parziale</option><option value="paid">Pagato</option>
                          </select>
                        </div>
                        <button onClick={() => setEditingOrder(null)} className="w-full rounded-lg bg-stone-700 px-3 py-2 text-sm font-medium text-white hover:bg-stone-800">Chiudi</button>
                      </div>
                    ) : (
                      <div className="flex gap-2 border-t border-stone-200 pt-4">
                        <button onClick={() => setEditingOrder(order.id)} className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-amber-700 px-3 py-2 text-sm font-medium text-amber-700 hover:bg-amber-50">
                          <Edit2 className="h-4 w-4" />Modifica stato
                        </button>
                        <button onClick={() => handlePrint(order)} className="flex items-center justify-center gap-1 rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50">
                          <FileText className="h-4 w-4" />PDF
                        </button>
                        <button onClick={() => handleCancelOrder(order.id)} className="flex items-center justify-center rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── DASHBOARD ──────────────────────────────────────────────────────── */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <h2 className="text-xl font-light text-stone-900">Panoramica finanziaria</h2>

            {/* KPI */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-stone-200 bg-white p-6">
                <p className="text-xs font-medium text-stone-500 uppercase">Ricavi incassati</p>
                <p className="mt-2 text-3xl font-light text-emerald-600">€ {totalRevenue.toFixed(2)}</p>
                <p className="mt-1 text-xs text-stone-400">{orders.filter(o => o.payment === 'paid').length} ordini pagati</p>
              </div>
              <div className="rounded-lg border border-stone-200 bg-white p-6">
                <p className="text-xs font-medium text-stone-500 uppercase">Ricavi in sospeso</p>
                <p className="mt-2 text-3xl font-light text-amber-600">€ {pendingRevenue.toFixed(2)}</p>
                <p className="mt-1 text-xs text-stone-400">{orders.filter(o => o.payment !== 'paid').length} ordini aperti</p>
              </div>
              <div className="rounded-lg border border-stone-200 bg-white p-6">
                <p className="text-xs font-medium text-stone-500 uppercase">Spese totali</p>
                <p className="mt-2 text-3xl font-light text-red-600">€ {totalExpenses.toFixed(2)}</p>
                <p className="mt-1 text-xs text-stone-400">{expenses.length} voci</p>
              </div>
              <div className={`rounded-lg border p-6 ${totalProfit >= 0 ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`}>
                <p className="text-xs font-medium text-stone-500 uppercase">Utile netto</p>
                <p className={`mt-2 text-3xl font-light ${totalProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>€ {totalProfit.toFixed(2)}</p>
                <p className="mt-1 text-xs text-stone-400">{orders.length} ordini totali</p>
              </div>
            </div>

            {/* Grafico mensile */}
            {monthlyData.length > 0 && (
              <div className="rounded-lg border border-stone-200 bg-white p-6">
                <h3 className="font-medium text-stone-900 mb-6">Andamento mensile</h3>
                <div className="flex items-end gap-4 h-40">
                  {monthlyData.map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex gap-1 items-end" style={{ height: '120px' }}>
                        <div className="flex-1 bg-emerald-400 rounded-t transition-all" style={{ height: `${(d.revenue / maxMonthly) * 100}%`, minHeight: d.revenue > 0 ? '4px' : '0' }} title={`Ricavi: € ${d.revenue.toFixed(2)}`} />
                        <div className="flex-1 bg-red-300 rounded-t transition-all" style={{ height: `${(d.expenses / maxMonthly) * 100}%`, minHeight: d.expenses > 0 ? '4px' : '0' }} title={`Spese: € ${d.expenses.toFixed(2)}`} />
                      </div>
                      <span className="text-xs text-stone-500">{d.month}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 mt-4">
                  <span className="flex items-center gap-1 text-xs text-stone-500"><span className="w-3 h-3 rounded bg-emerald-400 inline-block"></span>Ricavi</span>
                  <span className="flex items-center gap-1 text-xs text-stone-500"><span className="w-3 h-3 rounded bg-red-300 inline-block"></span>Spese</span>
                </div>
              </div>
            )}

            {/* Stato inventario */}
            <div className="rounded-lg border border-stone-200 bg-white p-6">
              <h3 className="font-medium text-stone-900 mb-4">Stato inventario</h3>
              <div className="grid grid-cols-3 gap-4">
                <div><p className="text-sm text-stone-500">Piante totali</p><p className="mt-1 text-2xl font-light">{inventory.reduce((s, p) => s + p.stock, 0)}</p></div>
                <div><p className="text-sm text-stone-500">Varietà</p><p className="mt-1 text-2xl font-light">{inventory.length}</p></div>
                <div><p className="text-sm text-stone-500">Ordini attivi</p><p className="mt-1 text-2xl font-light">{orders.filter(o => o.status !== 'delivered').length}</p></div>
              </div>
            </div>

            {/* Spese */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-light text-stone-900">Spese</h3>
                <button onClick={() => setShowNewExpense(!showNewExpense)}
                  className="flex items-center gap-2 rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800">
                  <Plus className="h-4 w-4" />Nuova spesa
                </button>
              </div>
              {showNewExpense && (
                <div className="rounded-lg border border-stone-200 bg-white p-5 space-y-3">
                  <input type="text" placeholder="Descrizione" value={newExpenseForm.description}
                    onChange={e => setNewExpenseForm({ ...newExpenseForm, description: e.target.value })}
                    className="w-full rounded border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                  <input type="number" placeholder="Importo (€)" step="0.01" value={newExpenseForm.amount}
                    onChange={e => setNewExpenseForm({ ...newExpenseForm, amount: e.target.value })}
                    className="w-full rounded border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                  <div className="flex gap-2">
                    <button onClick={handleAddExpense} className="flex-1 rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800">Registra</button>
                    <button onClick={() => setShowNewExpense(false)} className="flex-1 rounded-lg border border-stone-300 px-4 py-2 text-sm text-stone-700">Annulla</button>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                {expenses.length === 0 ? (
                  <div className="rounded-lg border border-stone-200 bg-stone-50 p-6 text-center text-stone-500">Nessuna spesa registrata</div>
                ) : expenses.map(e => (
                  <div key={e.id} className="flex items-center justify-between rounded-lg border border-stone-200 bg-white p-4">
                    <div>
                      <p className="font-medium text-stone-900">{e.description}</p>
                      <p className="text-xs text-stone-400">{new Date(e.date).toLocaleDateString('it-IT')}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-semibold text-red-600">€ {e.amount.toFixed(2)}</span>
                      <button onClick={() => { if (window.confirm('Eliminare questa spesa?')) setExpenses(expenses.filter(x => x.id !== e.id)); }} className="text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
