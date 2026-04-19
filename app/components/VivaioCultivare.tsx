'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Edit2, CheckCircle2, Clock, AlertCircle, ChevronLeft } from 'lucide-react';

export default function VivaioCultivare() {
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Frantoio', type: 'ulivo', stock: 45 },
    { id: 2, name: 'Koroneiki', type: 'ulivo', stock: 32 },
    { id: 3, name: 'Moraiolo', type: 'ulivo', stock: 28 },
    { id: 4, name: 'Leccino', type: 'ulivo', stock: 38 },
    { id: 5, name: 'Tarocco', type: 'agrumi', stock: 25 },
    { id: 6, name: 'Sanguinello', type: 'agrumi', stock: 19 },
    { id: 7, name: 'Limone Liscia', type: 'agrumi', stock: 42 },
    { id: 8, name: 'Clementina', type: 'agrumi', stock: 31 },
  ]);

  const [orders, setOrders] = useState([
    {
      id: 101,
      client: 'Azienda Agricola Mura',
      date: '2024-01-15',
      status: 'pending',
      payment: 'pending',
      items: [{ plantId: 1, plantName: 'Frantoio', qty: 10 }],
      totalPrice: 150
    }
  ]);

  const [expenses, setExpenses] = useState([
    { id: 1, description: 'Acquisto fertilizzante', amount: 85, date: '2024-01-10' },
    { id: 2, description: 'Irrigazione gennaio', amount: 120, date: '2024-01-12' }
  ]);

  const [activeTab, setActiveTab] = useState('inventory');
  const [inventoryCategory, setInventoryCategory] = useState(null);
  const [showNewOrder, setShowNewOrder] = useState(false);
  const [showNewPlant, setShowNewPlant] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editingPlant, setEditingPlant] = useState(null);
  const [editPlantValue, setEditPlantValue] = useState('');
  const [showNewExpense, setShowNewExpense] = useState(false);

  const [newPlantForm, setNewPlantForm] = useState({ name: '', type: 'ulivo', stock: '' });
  const [newOrderForm, setNewOrderForm] = useState({
    client: '', status: 'pending', payment: 'pending',
    items: [{ plantId: '', qty: '' }], totalPrice: ''
  });
  const [newExpenseForm, setNewExpenseForm] = useState({ description: '', amount: '' });

  const handleAddPlant = () => {
    if (newPlantForm.name && newPlantForm.stock) {
      setInventory([...inventory, {
        id: Math.max(...inventory.map(p => p.id), 0) + 1,
        name: newPlantForm.name,
        type: newPlantForm.type,
        stock: parseInt(newPlantForm.stock)
      }]);
      setNewPlantForm({ name: '', type: inventoryCategory || 'ulivo', stock: '' });
      setShowNewPlant(false);
    }
  };

  const handleAddOrder = () => {
    if (newOrderForm.client && newOrderForm.items[0].plantId && newOrderForm.items[0].qty) {
      const newOrder = {
        id: Math.max(...orders.map(o => o.id), 0) + 1,
        client: newOrderForm.client,
        date: new Date().toISOString().split('T')[0],
        status: newOrderForm.status,
        payment: newOrderForm.payment,
        items: newOrderForm.items
          .filter(item => item.plantId && item.qty)
          .map(item => ({
            plantId: parseInt(item.plantId),
            plantName: inventory.find(p => p.id === parseInt(item.plantId))?.name,
            qty: parseInt(item.qty)
          })),
        totalPrice: parseFloat(newOrderForm.totalPrice) || 0
      };
      const updatedInventory = inventory.map(plant => {
        const reduction = newOrder.items.filter(item => item.plantId === plant.id).reduce((sum, item) => sum + item.qty, 0);
        return { ...plant, stock: plant.stock - reduction };
      });
      setInventory(updatedInventory);
      setOrders([...orders, newOrder]);
      setNewOrderForm({ client: '', status: 'pending', payment: 'pending', items: [{ plantId: '', qty: '' }], totalPrice: '' });
      setShowNewOrder(false);
    }
  };

  const handleUpdateOrder = (orderId, updates) => {
    setOrders(orders.map(order => order.id === orderId ? { ...order, ...updates } : order));
    setEditingOrder(null);
  };

  const handleCancelOrder = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (order && window.confirm("Annullare ordine? L'inventario sarà ripristinato.")) {
      const updatedInventory = inventory.map(plant => {
        const restoration = order.items.filter(item => item.plantId === plant.id).reduce((sum, item) => sum + item.qty, 0);
        return { ...plant, stock: plant.stock + restoration };
      });
      setInventory(updatedInventory);
      setOrders(orders.filter(o => o.id !== orderId));
    }
  };

  const handleAddOrderItem = () => {
    setNewOrderForm({ ...newOrderForm, items: [...newOrderForm.items, { plantId: '', qty: '' }] });
  };

  const handleRemoveOrderItem = (index) => {
    setNewOrderForm({ ...newOrderForm, items: newOrderForm.items.filter((_, i) => i !== index) });
  };

  const handleUpdateOrderItem = (index, field, value) => {
    const newItems = [...newOrderForm.items];
    newItems[index][field] = value;
    setNewOrderForm({ ...newOrderForm, items: newItems });
  };

  const handleStartEditPlant = (plant) => {
    setEditingPlant(plant.id);
    setEditPlantValue('');
  };

  const handleConfirmEditPlant = (plantId, oldStock) => {
    const change = parseInt(editPlantValue);
    if (isNaN(change)) { alert('Inserisci un numero valido'); return; }
    const newStock = oldStock + change;
    if (newStock < 0) { alert('Non puoi ridurre la giacenza sotto zero'); return; }
    if (window.confirm(`Sei sicuro? Giacenza: ${oldStock} ${change > 0 ? '+' : ''}${change} = ${newStock}`)) {
      setInventory(inventory.map(plant => plant.id === plantId ? { ...plant, stock: newStock } : plant));
      setEditingPlant(null);
      setEditPlantValue('');
    }
  };

  const handleCancelEditPlant = () => { setEditingPlant(null); setEditPlantValue(''); };

  const handleAddExpense = () => {
    if (newExpenseForm.description && newExpenseForm.amount) {
      setExpenses([...expenses, {
        id: Math.max(...expenses.map(e => e.id), 0) + 1,
        description: newExpenseForm.description,
        amount: parseFloat(newExpenseForm.amount),
        date: new Date().toISOString().split('T')[0]
      }]);
      setNewExpenseForm({ description: '', amount: '' });
      setShowNewExpense(false);
    }
  };

  const handleDeleteExpense = (expenseId) => {
    if (window.confirm('Elimina questa spesa?')) setExpenses(expenses.filter(e => e.id !== expenseId));
  };

  const totalRevenue = orders.filter(o => o.payment === 'paid').reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const pendingRevenue = orders.filter(o => o.payment !== 'paid').reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalProfit = totalRevenue - totalExpenses;
  const activeOrders = orders.filter(o => o.status !== 'delivered').length;
  const totalInventory = inventory.reduce((sum, item) => sum + item.stock, 0);

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'In sospeso' },
      confirmed: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', label: 'Confermato' },
      shipped: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: 'Spedito' },
      delivered: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Consegnato' }
    };
    return badges[status] || badges.pending;
  };

  const getPaymentBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'In sospeso' },
      partial: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', label: 'Parziale' },
      paid: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: 'Pagato' }
    };
    return badges[status] || badges.pending;
  };

  const lowStockItems = inventory.filter(item => item.stock < 15);

  // Categorie inventario
  const categories = [
    {
      key: 'ulivo',
      label: 'Ulivi',
      emoji: '🫒',
      bg: 'bg-green-50',
      border: 'border-green-200',
      hover: 'hover:bg-green-100',
      text: 'text-green-800',
      badge: 'bg-green-100 text-green-700',
      description: 'Cultivar di olivo'
    },
    {
      key: 'agrumi',
      label: 'Agrumi',
      emoji: '🍊',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      hover: 'hover:bg-orange-100',
      text: 'text-orange-800',
      badge: 'bg-orange-100 text-orange-700',
      description: 'Arance, limoni, mandarini'
    },
    {
      key: 'altro',
      label: 'Altro',
      emoji: '🌿',
      bg: 'bg-stone-50',
      border: 'border-stone-200',
      hover: 'hover:bg-stone-100',
      text: 'text-stone-800',
      badge: 'bg-stone-100 text-stone-700',
      description: 'Altre varietà'
    },
  ];

  const filteredInventory = inventoryCategory
    ? inventory.filter(p => p.type === inventoryCategory)
    : [];

  const currentCategory = categories.find(c => c.key === inventoryCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-stone-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between flex-wrap gap-2">
            <div>
              <h1 className="text-3xl font-light tracking-tight text-stone-900" style={{ fontFamily: 'Georgia, serif' }}>
                Vivaio Olivicolo
              </h1>
              <p className="mt-1 text-sm text-stone-600">Gestione inventario e ordinazioni</p>
            </div>
            <div className="flex gap-1 sm:gap-3">
              {['inventory', 'orders', 'dashboard'].map(tab => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setInventoryCategory(null); }}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? 'text-amber-900 border-b-2 border-amber-700'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {tab === 'inventory' ? 'Inventario' : tab === 'orders' ? 'Ordinazioni' : 'Dashboard'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* INVENTORY TAB */}
        {activeTab === 'inventory' && (
          <div className="space-y-8">

            {/* Alert giacenze basse */}
            {lowStockItems.length > 0 && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-700 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-amber-900">Giacenza bassa</h3>
                    <p className="mt-1 text-sm text-amber-800">
                      {lowStockItems.map(item => `${item.name} (${item.stock})`).join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Selezione categoria */}
            {!inventoryCategory ? (
              <div className="space-y-6">
                <h2 className="text-xl font-light text-stone-900">Seleziona categoria</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  {categories.map(cat => {
                    const count = inventory.filter(p => p.type === cat.key).length;
                    const total = inventory.filter(p => p.type === cat.key).reduce((s, p) => s + p.stock, 0);
                    return (
                      <button
                        key={cat.key}
                        onClick={() => setInventoryCategory(cat.key)}
                        className={`rounded-2xl border-2 ${cat.border} ${cat.bg} ${cat.hover} p-8 text-center transition-all hover:shadow-lg hover:-translate-y-1 group`}
                      >
                        <div className="text-6xl mb-4">{cat.emoji}</div>
                        <h3 className={`text-2xl font-semibold ${cat.text} mb-1`}>{cat.label}</h3>
                        <p className="text-sm text-stone-500 mb-4">{cat.description}</p>
                        <div className="flex justify-center gap-3">
                          <span className={`rounded-full px-3 py-1 text-xs font-medium ${cat.badge}`}>
                            {count} varietà
                          </span>
                          <span className={`rounded-full px-3 py-1 text-xs font-medium ${cat.badge}`}>
                            {total} piante
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Vista categoria selezionata */
              <div className="space-y-6">
                {/* Header categoria */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => { setInventoryCategory(null); setShowNewPlant(false); }}
                      className="flex items-center gap-1 text-stone-500 hover:text-stone-900 transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                      <span className="text-sm">Categorie</span>
                    </button>
                    <span className="text-stone-300">|</span>
                    <span className="text-2xl">{currentCategory?.emoji}</span>
                    <h2 className="text-xl font-light text-stone-900">{currentCategory?.label}</h2>
                  </div>
                  <button
                    onClick={() => setShowNewPlant(!showNewPlant)}
                    className="flex items-center gap-2 rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Nuova pianta
                  </button>
                </div>

                {/* Form nuova pianta */}
                {showNewPlant && (
                  <div className="rounded-lg border border-stone-200 bg-white p-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <input
                        type="text"
                        placeholder="Nome cultivar"
                        value={newPlantForm.name}
                        onChange={(e) => setNewPlantForm({ ...newPlantForm, name: e.target.value })}
                        className="rounded border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <input
                        type="number"
                        placeholder="Giacenza iniziale"
                        value={newPlantForm.stock}
                        onChange={(e) => setNewPlantForm({ ...newPlantForm, stock: e.target.value })}
                        className="rounded border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => {
                          setNewPlantForm({ ...newPlantForm, type: inventoryCategory });
                          handleAddPlant();
                        }}
                        className="rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800"
                      >
                        Aggiungi
                      </button>
                      <button
                        onClick={() => setShowNewPlant(false)}
                        className="rounded-lg border border-stone-300 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
                      >
                        Annulla
                      </button>
                    </div>
                  </div>
                )}

                {/* Griglia piante */}
                {filteredInventory.length === 0 ? (
                  <div className="rounded-lg border-2 border-dashed border-stone-200 p-12 text-center">
                    <div className="text-4xl mb-3">{currentCategory?.emoji}</div>
                    <p className="text-stone-500">Nessuna pianta in questa categoria.</p>
                    <button
                      onClick={() => setShowNewPlant(true)}
                      className="mt-4 text-sm text-amber-700 font-medium hover:text-amber-800"
                    >
                      + Aggiungi la prima pianta
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {filteredInventory.map((plant) => (
                      <div
                        key={plant.id}
                        className="rounded-lg border border-stone-200 bg-white p-4 transition-all hover:shadow-md hover:border-stone-300"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="font-medium text-stone-900">{plant.name}</h3>
                          </div>
                        </div>

                        {editingPlant === plant.id ? (
                          <div className="space-y-3 bg-stone-50 rounded p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-stone-600">Attuale</span>
                              <span className="text-lg font-semibold text-stone-900">{plant.stock}</span>
                            </div>
                            <div className="h-px bg-stone-200"></div>
                            <div>
                              <label className="text-xs font-medium text-stone-600">Modifica (+/-)</label>
                              <input
                                type="number"
                                value={editPlantValue}
                                onChange={(e) => setEditPlantValue(e.target.value)}
                                autoFocus
                                placeholder="Es: +5 o -3"
                                className="mt-1 w-full rounded border-2 border-amber-400 px-3 py-2 text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                              />
                            </div>
                            {editPlantValue && editPlantValue !== '0' && !isNaN(parseInt(editPlantValue)) && (
                              <div className="bg-white rounded p-2 border border-stone-200 text-sm">
                                <div className="flex items-center justify-between">
                                  <span className="text-stone-600">Nuova giacenza</span>
                                  <span className={`font-semibold text-base ${parseInt(editPlantValue) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {plant.stock + parseInt(editPlantValue)}
                                  </span>
                                </div>
                                <div className="text-xs text-stone-400 mt-1 border-t pt-1">
                                  {plant.stock} {parseInt(editPlantValue) > 0 ? '+' : ''}{editPlantValue} = {plant.stock + parseInt(editPlantValue)}
                                </div>
                              </div>
                            )}
                            <div className="flex gap-2">
                              <button onClick={() => handleConfirmEditPlant(plant.id, plant.stock)} className="flex-1 text-sm bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 font-medium">✓</button>
                              <button onClick={handleCancelEditPlant} className="flex-1 text-sm bg-stone-300 text-stone-700 px-3 py-2 rounded hover:bg-stone-400 font-medium">✕</button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div
                              onClick={() => handleStartEditPlant(plant)}
                              className={`rounded-full px-3 py-1 text-sm font-semibold text-center cursor-pointer transition-colors ${
                                plant.stock < 15 ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : plant.stock < 25 ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                              }`}
                            >
                              {plant.stock}
                            </div>
                            <p className="text-xs text-stone-400 text-center">Clicca per modificare</p>
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

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-light text-stone-900">Ordinazioni</h2>
              <button
                onClick={() => setShowNewOrder(!showNewOrder)}
                className="flex items-center gap-2 rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Nuova ordinazione
              </button>
            </div>

            {showNewOrder && (
              <div className="rounded-lg border border-stone-200 bg-white p-6">
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Nome cliente"
                    value={newOrderForm.client}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, client: e.target.value })}
                    className="w-full rounded border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <div className="border-t border-stone-200 pt-4">
                    <h4 className="text-sm font-medium text-stone-900 mb-3">Articoli</h4>
                    <div className="space-y-3">
                      {newOrderForm.items.map((item, idx) => (
                        <div key={idx} className="flex gap-2">
                          <select
                            value={item.plantId}
                            onChange={(e) => handleUpdateOrderItem(idx, 'plantId', e.target.value)}
                            className="flex-1 rounded border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                          >
                            <option value="">Seleziona pianta</option>
                            {inventory.map(plant => (
                              <option key={plant.id} value={plant.id}>
                                {plant.name} ({plant.stock} disp.)
                              </option>
                            ))}
                          </select>
                          <input
                            type="number" placeholder="Qty" min="1"
                            value={item.qty}
                            onChange={(e) => handleUpdateOrderItem(idx, 'qty', e.target.value)}
                            className="w-20 rounded border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                          {newOrderForm.items.length > 1 && (
                            <button onClick={() => handleRemoveOrderItem(idx)} className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button onClick={handleAddOrderItem} className="mt-3 text-sm text-amber-700 hover:text-amber-800 font-medium">
                      + Aggiungi articolo
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-t border-stone-200 pt-4">
                    <select value={newOrderForm.status} onChange={(e) => setNewOrderForm({ ...newOrderForm, status: e.target.value })} className="rounded border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                      <option value="pending">In sospeso</option>
                      <option value="confirmed">Confermato</option>
                      <option value="shipped">Spedito</option>
                      <option value="delivered">Consegnato</option>
                    </select>
                    <select value={newOrderForm.payment} onChange={(e) => setNewOrderForm({ ...newOrderForm, payment: e.target.value })} className="rounded border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                      <option value="pending">Pagamento in sospeso</option>
                      <option value="partial">Parziale</option>
                      <option value="paid">Pagato</option>
                    </select>
                  </div>
                  <input
                    type="number" placeholder="Importo totale (€)" step="0.01"
                    value={newOrderForm.totalPrice}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, totalPrice: e.target.value })}
                    className="w-full rounded border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <div className="flex gap-2">
                    <button onClick={handleAddOrder} className="rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800">Crea ordinazione</button>
                    <button onClick={() => setShowNewOrder(false)} className="rounded-lg border border-stone-300 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50">Annulla</button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="rounded-lg border border-stone-200 bg-stone-50 p-8 text-center">
                  <p className="text-stone-600">Nessuna ordinazione.</p>
                </div>
              ) : (
                orders.map((order) => {
                  const statusBadge = getStatusBadge(order.status);
                  const paymentBadge = getPaymentBadge(order.payment);
                  return (
                    <div key={order.id} className="rounded-lg border border-stone-200 bg-white p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                        <div>
                          <h3 className="font-medium text-stone-900">{order.client}</h3>
                          <p className="text-sm text-stone-500">Ord. #{order.id} • {new Date(order.date).toLocaleDateString('it-IT')}</p>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}>{statusBadge.label}</span>
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium border ${paymentBadge.bg} ${paymentBadge.text} ${paymentBadge.border}`}>{paymentBadge.label}</span>
                        </div>
                      </div>
                      <div className="mb-4 space-y-2 bg-stone-50 rounded p-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-stone-900">{item.plantName}</span>
                            <span className="text-stone-600 font-medium">{item.qty} piante</span>
                          </div>
                        ))}
                        {order.totalPrice > 0 && (
                          <div className="border-t border-stone-200 pt-2 mt-2 flex justify-between font-semibold text-stone-900">
                            <span>Totale</span>
                            <span>€ {order.totalPrice.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                      {editingOrder === order.id ? (
                        <div className="space-y-3 border-t border-stone-200 pt-4">
                          <div className="grid grid-cols-2 gap-3">
                            <select value={order.status} onChange={(e) => handleUpdateOrder(order.id, { status: e.target.value })} className="rounded border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                              <option value="pending">In sospeso</option>
                              <option value="confirmed">Confermato</option>
                              <option value="shipped">Spedito</option>
                              <option value="delivered">Consegnato</option>
                            </select>
                            <select value={order.payment} onChange={(e) => handleUpdateOrder(order.id, { payment: e.target.value })} className="rounded border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                              <option value="pending">In sospeso</option>
                              <option value="partial">Parziale</option>
                              <option value="paid">Pagato</option>
                            </select>
                          </div>
                          <button onClick={() => setEditingOrder(null)} className="w-full rounded-lg bg-stone-700 px-3 py-2 text-sm font-medium text-white hover:bg-stone-800">Chiudi</button>
                        </div>
                      ) : (
                        <div className="flex gap-2 border-t border-stone-200 pt-4">
                          <button onClick={() => setEditingOrder(order.id)} className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-amber-700 px-3 py-2 text-sm font-medium text-amber-700 hover:bg-amber-50">
                            <Edit2 className="h-4 w-4" />Modifica stato
                          </button>
                          <button onClick={() => handleCancelOrder(order.id)} className="flex items-center justify-center rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <h2 className="text-xl font-light text-stone-900">Panoramica finanziaria</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-stone-200 bg-white p-6">
                <p className="text-xs font-medium text-stone-600 uppercase">Ricavi incassati</p>
                <p className="mt-2 text-3xl font-light text-emerald-600">€ {totalRevenue.toFixed(2)}</p>
                <p className="mt-1 text-xs text-stone-500">{orders.filter(o => o.payment === 'paid').length} ordini pagati</p>
              </div>
              <div className="rounded-lg border border-stone-200 bg-white p-6">
                <p className="text-xs font-medium text-stone-600 uppercase">Ricavi in sospeso</p>
                <p className="mt-2 text-3xl font-light text-amber-600">€ {pendingRevenue.toFixed(2)}</p>
                <p className="mt-1 text-xs text-stone-500">{orders.filter(o => o.payment !== 'paid').length} ordini aperti</p>
              </div>
              <div className="rounded-lg border border-stone-200 bg-white p-6">
                <p className="text-xs font-medium text-stone-600 uppercase">Spese totali</p>
                <p className="mt-2 text-3xl font-light text-red-600">€ {totalExpenses.toFixed(2)}</p>
                <p className="mt-1 text-xs text-stone-500">{expenses.length} transazioni</p>
              </div>
              <div className={`rounded-lg border ${totalProfit >= 0 ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'} p-6`}>
                <p className="text-xs font-medium text-stone-600 uppercase">Utile/Perdita</p>
                <p className={`mt-2 text-3xl font-light ${totalProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>€ {totalProfit.toFixed(2)}</p>
                <p className="mt-1 text-xs text-stone-500">{orders.length} ordini totali</p>
              </div>
            </div>

            <div className="rounded-lg border border-stone-200 bg-white p-6">
              <h3 className="font-medium text-stone-900 mb-4">Stato inventario</h3>
              <div className="grid grid-cols-3 gap-4">
                <div><p className="text-sm text-stone-600">Piante totali</p><p className="mt-1 text-2xl font-light text-stone-900">{totalInventory}</p></div>
                <div><p className="text-sm text-stone-600">Varietà</p><p className="mt-1 text-2xl font-light text-stone-900">{inventory.length}</p></div>
                <div><p className="text-sm text-stone-600">Ordini attivi</p><p className="mt-1 text-2xl font-light text-stone-900">{activeOrders}</p></div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-light text-stone-900">Spese</h3>
                <button onClick={() => setShowNewExpense(!showNewExpense)} className="flex items-center gap-2 rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800 transition-colors">
                  <Plus className="h-4 w-4" />Nuova spesa
                </button>
              </div>
              {showNewExpense && (
                <div className="rounded-lg border border-stone-200 bg-white p-6 space-y-4">
                  <input type="text" placeholder="Descrizione spesa" value={newExpenseForm.description} onChange={(e) => setNewExpenseForm({ ...newExpenseForm, description: e.target.value })} className="w-full rounded border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                  <input type="number" placeholder="Importo (€)" step="0.01" value={newExpenseForm.amount} onChange={(e) => setNewExpenseForm({ ...newExpenseForm, amount: e.target.value })} className="w-full rounded border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                  <div className="flex gap-2">
                    <button onClick={handleAddExpense} className="flex-1 rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800">Registra</button>
                    <button onClick={() => setShowNewExpense(false)} className="flex-1 rounded-lg border border-stone-300 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50">Annulla</button>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                {expenses.length === 0 ? (
                  <div className="rounded-lg border border-stone-200 bg-stone-50 p-6 text-center"><p className="text-stone-600">Nessuna spesa registrata</p></div>
                ) : (
                  expenses.map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between rounded-lg border border-stone-200 bg-white p-4">
                      <div>
                        <p className="font-medium text-stone-900">{expense.description}</p>
                        <p className="text-xs text-stone-500">{new Date(expense.date).toLocaleDateString('it-IT')}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-semibold text-red-600">€ {expense.amount.toFixed(2)}</span>
                        <button onClick={() => handleDeleteExpense(expense.id)} className="text-red-600 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
