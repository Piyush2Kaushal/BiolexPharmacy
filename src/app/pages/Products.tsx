import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Search, Package, Filter, X, Star, ArrowRight, Eye } from 'lucide-react';
import { productAPI, categoryAPI } from '../services/api';
import { Product, Category } from '../types';
import InquiryModal from '../components/InquiryModal';

export default function Products() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [pRes, cRes]: any[] = await Promise.all([productAPI.getAll(), categoryAPI.getAll()]);
        if (pRes.success) setProducts(pRes.data || []);
        if (cRes.success) setCategories(cRes.data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const openInquiry = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedProduct(product);
    setInquiryOpen(true);
  };

  const filtered = products.filter((p) => {
    const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch = p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <div>
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Products</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Browse our comprehensive range of quality pharmaceutical products
          </p>
        </div>
      </section>

      <section className="py-12 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text" value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products by name or description..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex items-center text-sm text-gray-500 whitespace-nowrap">
                <Filter className="w-4 h-4 mr-2" />
                {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
              </div>
            </div>
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                <button onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${selectedCategory === 'all' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  All Products
                </button>
                {categories.map((cat) => (
                  <button key={cat._id} onClick={() => setSelectedCategory(cat._id)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${selectedCategory === cat._id ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                  <div className="h-52 bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-10 bg-gray-200 rounded-xl mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
              <Package className="w-20 h-20 text-gray-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">No products found</h3>
              <p className="text-gray-400 mb-6">
                {searchQuery ? `No results for "${searchQuery}"` : 'No products in this category yet.'}
              </p>
              {(searchQuery || selectedCategory !== 'all') && (
                <button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700">
                  <X className="w-4 h-4" /> Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product) => (
                <Link key={product._id} to={`/products/${product._id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 block">
                  <div className="relative h-52 bg-gradient-to-br from-blue-50 to-gray-100 overflow-hidden">
                    {product.image ? (
                      <img src={product.image} alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-20 h-20 text-blue-200" />
                      </div>
                    )}
                    {product.categoryName && (
                      <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {product.categoryName}
                      </span>
                    )}
                    {product.isFeatured && (
                      <span className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-900" /> Featured
                      </span>
                    )}
                    <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/10 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-blue-700 font-semibold text-sm px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg">
                        <Eye className="w-4 h-4" /> View Details
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    {product.form && <p className="text-xs text-blue-500 font-semibold mb-1">{product.form}</p>}
                    <h3 className="font-bold text-gray-900 text-base mb-2 line-clamp-1">{product.name}</h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">{product.description}</p>
                    <div className="flex gap-2">
                      <button onClick={(e) => openInquiry(e, product)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold transition-colors text-sm flex items-center justify-center gap-1.5">
                        Send Inquiry
                      </button>
                      <span className="border-2 border-gray-200 px-3 py-2.5 rounded-xl text-gray-500 hover:border-blue-300 hover:text-blue-600 transition-colors flex items-center">
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <InquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} product={selectedProduct} />
    </div>
  );
}
