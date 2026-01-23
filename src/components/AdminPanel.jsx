import { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from './Loader';

function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [productData, setProductData] = useState({
    name: '', price: '', stock: '', category_id: '', description: ''
  });
  const [editingProduct, setEditingProduct] = useState(null);

  // O Vite exige o prefixo VITE_ para variáveis de ambiente
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        axios.get(`${API_URL}/products`),
        axios.get(`${API_URL}/categories`)
      ]);
      setProducts(prodRes.data.data);
      setCategories(catRes.data.data);
    } catch (err) {
      console.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Ativa o loader
    try {
      if (editingCategory) {
        await axios.put(`${API_URL}/categories/${editingCategory.id}`, { name: newCategory });
        setEditingCategory(null);
      } else {
        await axios.post(`${API_URL}/categories`, { name: newCategory });
      }
      setNewCategory('');
      await fetchData();
    } catch (err) {
      alert("Erro na operação");
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Ativa o loader
    try {
      if (editingProduct) {
        await axios.put(`${API_URL}/products/${editingProduct.id}`, productData);
        setEditingProduct(null);
      } else {
        await axios.post(`${API_URL}/products`, productData);
      }
      setProductData({ name: '', price: '', stock: '', category_id: '', description: '' });
      await fetchData();
    } catch (err) {
      alert("Erro ao salvar produto");
      setLoading(false);
    }
  };

  const startEditProduct = (product) => {
    setEditingProduct(product);
    setProductData({
      name: product.name,
      price: product.price,
      stock: product.stock,
      category_id: product.category_id,
      description: product.description || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Eliminar este produto?")) {
      setLoading(true); // Ativa o loader
      try {
        await axios.delete(`${API_URL}/products/${id}`);
        await fetchData();
      } catch (err) {
        alert("Erro ao eliminar");
        setLoading(false);
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50 p-4 md:p-12 font-sans text-gray-900">

      {/* --- APLICAÇÃO DO LOADER (OVERLAY) --- */}
      {loading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-[9999] flex items-center justify-center">
          <Loader />
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-indigo-950 tracking-tight">
            Smart Stock <span className="text-indigo-500 text-lg font-medium italic">Gestao Completa</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* FORMULÁRIOS */}
          <div className="space-y-6">
            <section className="bg-white p-6 rounded-2xl shadow-sm border-2 border-indigo-50">
              <h2 className="text-lg font-bold mb-4">{editingCategory ? '📝 Editar Categoria' : '📂 Nova Categoria'}</h2>
              <form onSubmit={handleCategorySubmit} className="flex gap-2">
                <input
                  className="flex-1 bg-gray-50 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500 rounded-lg p-2.5 outline-none"
                  placeholder="Nome da Categoria"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <button className={`px-4 py-2 rounded-lg font-bold text-white cursor-pointer transition-all ${editingCategory ? 'bg-orange-500' : 'bg-indigo-600'}`}>
                  {editingCategory ? 'OK' : '＋'}
                </button>
              </form>
              {editingCategory && (
                <button onClick={() => { setEditingCategory(null); setNewCategory(''); }} className="text-xs text-red-500 mt-2 underline">Cancelar edição</button>
              )}
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-sm border-2 border-indigo-50">
              <h2 className="text-lg font-bold mb-4">{editingProduct ? '📝 Editando Produto' : 'Novo Produto'}</h2>
              <form onSubmit={handleProductSubmit} className="space-y-4">
                <select
                  className="w-full bg-gray-50 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500 rounded-lg p-2.5 outline-none"
                  value={productData.category_id}
                  onChange={(e) => setProductData({ ...productData, category_id: e.target.value })}
                  required
                >
                  <option value="">Selecione a Categoria</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>

                <input
                  className="w-full bg-gray-50 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500 rounded-lg p-2.5 outline-none"
                  placeholder="Nome do Produto"
                  onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                  value={productData.name} required
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number" step="0.01" className="bg-gray-50 border-none ring-1 ring-gray-200 rounded-lg p-2.5 outline-none"
                    placeholder="Preço €"
                    onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                    value={productData.price} required
                  />
                  <input
                    type="number" className="bg-gray-50 border-none ring-1 ring-gray-200 rounded-lg p-2.5 outline-none"
                    placeholder="Stock"
                    onChange={(e) => setProductData({ ...productData, stock: e.target.value })}
                    value={productData.stock} required
                  />
                </div>

                <button className={`w-full font-bold py-3.5 rounded-xl shadow-lg transition-all active:scale-95 text-white ${editingProduct ? 'bg-orange-500 shadow-orange-100' : 'bg-indigo-600 shadow-indigo-100'}`}>
                  {editingProduct ? 'Salvar Alterações' : 'Cadastrar em Stock'}
                </button>
                {editingProduct && (
                  <button type="button" onClick={() => { setEditingProduct(null); setProductData({ name: '', price: '', stock: '', category_id: '', description: '' }) }} className="w-full text-sm text-gray-500">Cancelar</button>
                )}
              </form>
            </section>

            <div className="bg-white p-4 rounded-xl border border-gray-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 text-center">Categorias Ativas</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map(cat => (
                  <div key={cat.id} className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                    <span className="text-sm font-medium">{cat.name}</span>
                    <button onClick={() => { setEditingCategory(cat); setNewCategory(cat.name) }} className="text-[10px] hover:text-blue-500">✏️</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* TABELA */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-black">
                  <tr>
                    <th className="px-6 py-4">Item</th>
                    <th className="px-6 py-4">Categoria</th>
                    <th className="px-6 py-4">Qtd</th>
                    <th className="px-6 py-4">Preço</th>
                    <th className="px-6 py-4 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map(product => (
                    <tr key={product.id} className="group hover:bg-indigo-50/20 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-800">{product.name}</td>
                      <td className="px-6 py-4"><span className="bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full text-[10px] font-black">{product.category?.name}</span></td>
                      <td className="px-6 py-4 text-sm font-medium">{product.stock}</td>
                      <td className="px-6 py-4 font-black">€{product.price}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => startEditProduct(product)} className="hover:bg-blue-100 text-blue-600 p-2 rounded-lg">✏️</button>
                          <button onClick={() => deleteProduct(product.id)} className="hover:bg-red-100 text-red-500 p-2 rounded-lg">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AdminPanel;  