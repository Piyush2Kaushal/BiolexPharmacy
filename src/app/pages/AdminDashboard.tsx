import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import {
  LogOut, Package, MessageSquare, Plus, Edit, Trash2,
  LayoutDashboard, Tag, BarChart2, X, Upload, Eye,
  Star, FileText, Settings, RefreshCw, ChevronDown, ChevronUp,
  Globe, Pill, Layers, FlaskConical, Shield, AlertCircle,
  Quote, LayoutGrid, Users, FileSpreadsheet, CheckCircle, XCircle, Download,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { productAPI, categoryAPI, inquiryAPI, statsAPI, reviewAPI, contentAPI, testimonialAPI, homeCardAPI, bulkUploadAPI } from '../services/api';
import { Product, Category, Inquiry, Stats, Review, AllContent, Testimonial, HomeCard } from '../types';
import { toast } from 'sonner';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

type Tab = 'dashboard' | 'products' | 'categories' | 'inquiries' | 'reviews' | 'content' | 'testimonials' | 'homecards';

const statusColor = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  contacted: 'bg-blue-100 text-blue-700 border-blue-200',
  resolved: 'bg-green-100 text-green-700 border-green-200',
};

// ── Confirm Dialog ─────────────────────────────────────────────────────────────
function ConfirmDialog({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Action</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 border-2 border-gray-200 text-gray-700 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-semibold hover:bg-red-700 transition-colors">Delete</button>
        </div>
      </div>
    </div>
  );
}

// ── Product Modal (Extended) ───────────────────────────────────────────────────
function ProductModal({ product, categories, onClose, onSaved }: {
  product: Product | null; categories: Category[]; onClose: () => void; onSaved: () => void;
}) {
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category || '',
    packagingSize: product?.packagingSize || '',
    brand: product?.brand || '',
    form: product?.form || '',
    countryOfOrigin: product?.countryOfOrigin || 'India',
    composition: product?.composition || '',
    dosage: product?.dosage || '',
    storage: product?.storage || '',
    sideEffects: product?.sideEffects || '',
    isFeatured: product?.isFeatured || false,
  });
  const [additionalDetails, setAdditionalDetails] = useState<{ key: string; value: string }[]>(
    product?.additionalDetails || []
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(product?.image || '');
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const addAdditionalField = () => setAdditionalDetails((p) => [...p, { key: '', value: '' }]);
  const removeAdditionalField = (i: number) => setAdditionalDetails((p) => p.filter((_, idx) => idx !== i));
  const updateAdditionalField = (i: number, field: 'key' | 'value', val: string) =>
    setAdditionalDetails((p) => p.map((item, idx) => idx === i ? { ...item, [field]: val } : item));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product && !imageFile) { toast.error('Please select a product image'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (typeof v === 'boolean') fd.append(k, String(v));
        else if (v) fd.append(k, v);
      });
      fd.append('additionalDetails', JSON.stringify(additionalDetails.filter(d => d.key && d.value)));
      if (imageFile) fd.append('image', imageFile);

      const res: any = product ? await productAPI.update(product._id, fd) : await productAPI.create(fd);
      if (res.success) {
        toast.success(product ? 'Product updated!' : 'Product added!');
        onSaved(); onClose();
      }
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally { setLoading(false); }
  };

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl sticky top-0 z-10">
          <h2 className="text-xl font-bold text-white">{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white"><X className="w-6 h-6" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Image */}
          <div onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-xl p-4 cursor-pointer hover:border-blue-400 transition-colors group">
            {preview ? (
              <div className="relative">
                <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-lg flex items-center justify-center transition-opacity">
                  <p className="text-white font-semibold flex items-center gap-2"><Upload className="w-5 h-5" /> Change</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center py-6 text-gray-400">
                <Upload className="w-10 h-10 mb-2 text-gray-300" />
                <p className="font-semibold text-sm">Click to upload image</p>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Product Name *</label>
              <input value={form.name} onChange={set('name')} required placeholder="e.g. Amoxicillin 500mg" className={inputCls} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Category *</label>
              <select value={form.category} onChange={set('category')} required className={`${inputCls} bg-white`}>
                <option value="">Select category</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Description *</label>
              <textarea value={form.description} onChange={set('description')} required rows={3}
                placeholder="Product description..." className={`${inputCls} resize-none`} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Brand</label>
              <input value={form.brand} onChange={set('brand')} placeholder="e.g. Biolex" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Form</label>
              <select value={form.form} onChange={set('form')} className={`${inputCls} bg-white`}>
                <option value="">Select form</option>
                {['Tablet', 'Capsule', 'Syrup', 'Injection', 'Drops', 'Powder', 'Cream', 'Ointment', 'Gel', 'Sachet', 'Softgel'].map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Packaging Size</label>
              <input value={form.packagingSize} onChange={set('packagingSize')} placeholder="e.g. 10x10 Blister" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Country of Origin</label>
              <input value={form.countryOfOrigin} onChange={set('countryOfOrigin')} placeholder="India" className={inputCls} />
            </div>
          </div>

          {/* Featured toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <div onClick={() => setForm(p => ({ ...p, isFeatured: !p.isFeatured }))}
              className={`w-11 h-6 rounded-full transition-colors ${form.isFeatured ? 'bg-blue-600' : 'bg-gray-300'} relative`}>
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${form.isFeatured ? 'left-5.5 translate-x-0.5' : 'left-0.5'}`} />
            </div>
            <span className="text-sm font-semibold text-gray-700">Mark as Featured Product</span>
          </label>

          {/* Advanced toggle */}
          <button type="button" onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-blue-600 text-sm font-semibold hover:underline">
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showAdvanced ? 'Hide' : 'Show'} Advanced Details
          </button>

          {showAdvanced && (
            <div className="space-y-3 border border-blue-100 rounded-xl p-4 bg-blue-50/30">
              {[
                { label: 'Composition', field: 'composition', placeholder: 'e.g. Amoxicillin 500mg' },
                { label: 'Dosage', field: 'dosage', placeholder: 'e.g. 1 tablet twice daily' },
                { label: 'Storage', field: 'storage', placeholder: 'e.g. Store below 25°C' },
                { label: 'Side Effects', field: 'sideEffects', placeholder: 'e.g. Nausea, headache' },
              ].map(({ label, field, placeholder }) => (
                <div key={field}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
                  <input value={(form as any)[field]} onChange={set(field)} placeholder={placeholder} className={inputCls} />
                </div>
              ))}

              {/* Additional dynamic fields */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-600">Additional Details</label>
                  <button type="button" onClick={addAdditionalField}
                    className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add Field
                  </button>
                </div>
                {additionalDetails.map((detail, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input value={detail.key} onChange={(e) => updateAdditionalField(i, 'key', e.target.value)}
                      placeholder="Field name" className={`${inputCls} flex-1`} />
                    <input value={detail.value} onChange={(e) => updateAdditionalField(i, 'value', e.target.value)}
                      placeholder="Value" className={`${inputCls} flex-1`} />
                    <button type="button" onClick={() => removeAdditionalField(i)} className="text-red-400 hover:text-red-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</> : (product ? 'Update Product' : 'Add Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


// ── Bulk Upload Modal ──────────────────────────────────────────────────────────
interface BulkUploadResult {
  total: number;
  inserted: number;
  failed: number;
  successList: { row: number; name: string; id: string }[];
  failedList: { row: number; name: string; reason: string }[];
}

function BulkUploadModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BulkUploadResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleUpload = async () => {
    if (!file) { toast.error('Please select an Excel or CSV file'); return; }
    setLoading(true);
    try {
      const res: any = await bulkUploadAPI.uploadProducts(file);
      if (res.success) {
        setResult(res.data);
        if (res.data.inserted > 0) onDone();
        toast.success(`${res.data.inserted} products uploaded successfully!`);
      }
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const headers = ['Product Name', 'Category', 'Description', 'Image URL', 'Packaging Size', 'Brand', 'Form', 'Country of Origin'];
    const sample = [
      ['MOXIBEX-CV Dry Syrup', 'Antibiotics', 'Amoxicillin + Clavulanate Dry Syrup', '', '30 ml', 'Biolex', 'Syrup', 'India'],
      ['NAZOLEX PLUS Tablets', 'Ortho & Pain Management', 'Naproxen + Domperidone Tablet', '', '10x10 Blister', 'Biolex', 'Tablet', 'India'],
    ];
    const csvContent = [headers, ...sample].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'biolex_bulk_product_template.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-green-600 to-green-700 rounded-t-2xl sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">Bulk Upload Products</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white"><X className="w-6 h-6" /></button>
        </div>

        <div className="p-6 space-y-6">
          {!result ? (
            <>
              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Excel / CSV Format
                </h3>
                <p className="text-blue-700 text-sm mb-3">Your file must have these columns (in any order):</p>
                <div className="grid grid-cols-2 gap-1 text-sm">
                  {['Product Name *', 'Category *', 'Description *', 'Image URL (optional)', 'Packaging Size', 'Brand', 'Form', 'Country of Origin'].map(col => (
                    <span key={col} className="bg-white border border-blue-200 rounded-lg px-2 py-1 text-blue-800 font-mono text-xs">{col}</span>
                  ))}
                </div>
                <p className="text-blue-600 text-xs mt-3">* Required fields. Category must match an existing category name exactly.</p>
              </div>

              {/* Download Template */}
              <button onClick={downloadTemplate}
                className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-green-300 text-green-700 py-3 rounded-xl font-semibold hover:bg-green-50 transition-colors">
                <Download className="w-5 h-5" /> Download Sample Template (CSV)
              </button>

              {/* File Upload */}
              <div onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-green-400 hover:bg-green-50/30 transition-colors text-center">
                <FileSpreadsheet className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                {file ? (
                  <div>
                    <p className="font-bold text-green-700">{file.name}</p>
                    <p className="text-sm text-gray-500 mt-1">{(file.size / 1024).toFixed(1)} KB — Click to change</p>
                  </div>
                ) : (
                  <div>
                    <p className="font-semibold text-gray-600">Click to select Excel (.xlsx) or CSV file</p>
                    <p className="text-sm text-gray-400 mt-1">Max file size: 10 MB</p>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleFile} className="hidden" />

              <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50">Cancel</button>
                <button onClick={handleUpload} disabled={!file || loading}
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</> : <><Upload className="w-5 h-5" /> Upload & Import</>}
                </button>
              </div>
            </>
          ) : (
            /* Results */
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-gray-800">{result.total}</p>
                  <p className="text-sm text-gray-500 mt-1">Total Rows</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-green-600">{result.inserted}</p>
                  <p className="text-sm text-green-600 mt-1">Imported</p>
                </div>
                <div className="bg-red-50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-red-500">{result.failed}</p>
                  <p className="text-sm text-red-500 mt-1">Failed</p>
                </div>
              </div>

              {result.successList.length > 0 && (
                <div>
                  <h3 className="font-bold text-green-700 flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5" /> Successfully Imported ({result.inserted})
                  </h3>
                  <div className="max-h-40 overflow-y-auto space-y-1.5">
                    {result.successList.map((item) => (
                      <div key={item.id} className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-green-800 font-medium">{item.name}</span>
                        <span className="text-green-500 ml-auto text-xs">Row {item.row}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.failedList.length > 0 && (
                <div>
                  <h3 className="font-bold text-red-600 flex items-center gap-2 mb-3">
                    <XCircle className="w-5 h-5" /> Failed Records ({result.failed})
                  </h3>
                  <div className="max-h-40 overflow-y-auto space-y-1.5">
                    {result.failedList.map((item, i) => (
                      <div key={i} className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm">
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                          <span className="text-red-800 font-medium">{item.name}</span>
                          <span className="text-red-400 ml-auto text-xs">Row {item.row}</span>
                        </div>
                        <p className="text-red-600 text-xs mt-1 ml-6">{item.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={onClose}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700">
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Bulk Upload Categories Modal ───────────────────────────────────────────────
interface BulkCategoryUploadResult {
  added: number;
  skipped: number;
  duplicates: number;
  errors: { row: number; name: string; reason: string }[];
}

function BulkUploadCategoriesModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BulkCategoryUploadResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleUpload = async () => {
    if (!file) { toast.error('Please select an Excel or CSV file'); return; }
    setLoading(true);
    try {
      const res: any = await bulkUploadAPI.uploadCategories(file);
      if (res.success) {
        setResult(res.data);
        if (res.data.added > 0) onDone();
        toast.success(`${res.data.added} categories added successfully!`);
      }
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const headers = ['Category Name'];
    const sample = [['Tablets'], ['Capsules'], ['Syrups'], ['Injections'], ['Protein Powder']];
    const csvContent = [headers, ...sample].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'bulk_category_template.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-purple-600 to-purple-700 rounded-t-2xl sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">Bulk Upload Categories</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white"><X className="w-6 h-6" /></button>
        </div>

        <div className="p-6 space-y-6">
          {!result ? (
            <>
              {/* Instructions */}
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <h3 className="font-bold text-purple-800 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Excel / CSV Format
                </h3>
                <p className="text-purple-700 text-sm mb-3">Your file must have a single column:</p>
                <span className="bg-white border border-purple-200 rounded-lg px-3 py-1.5 text-purple-800 font-mono text-sm inline-block">
                  Category Name
                </span>
                <div className="mt-3 text-xs text-purple-600 space-y-1">
                  <p>• Empty rows are skipped automatically</p>
                  <p>• Duplicate categories are skipped (existing + within file)</p>
                  <p>• Names are converted to Proper Case</p>
                </div>
              </div>

              {/* Download Template */}
              <button onClick={downloadTemplate}
                className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-purple-300 text-purple-700 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-colors">
                <Download className="w-5 h-5" /> Download Sample Template (CSV)
              </button>

              {/* File Upload */}
              <div onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-purple-400 hover:bg-purple-50/30 transition-colors text-center">
                <FileSpreadsheet className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                {file ? (
                  <div>
                    <p className="font-bold text-purple-700">{file.name}</p>
                    <p className="text-sm text-gray-500 mt-1">{(file.size / 1024).toFixed(1)} KB — Click to change</p>
                  </div>
                ) : (
                  <div>
                    <p className="font-semibold text-gray-600">Click to select Excel (.xlsx) or CSV file</p>
                    <p className="text-sm text-gray-400 mt-1">Max file size: 10 MB</p>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleFile} className="hidden" />

              <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50">Cancel</button>
                <button onClick={handleUpload} disabled={!file || loading}
                  className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</> : <><Upload className="w-5 h-5" /> Upload & Import</>}
                </button>
              </div>
            </>
          ) : (
            /* Results */
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-green-600">{result.added}</p>
                  <p className="text-sm text-green-600 mt-1">Added</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-yellow-600">{result.duplicates}</p>
                  <p className="text-sm text-yellow-600 mt-1">Duplicates</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-gray-600">{result.skipped}</p>
                  <p className="text-sm text-gray-500 mt-1">Skipped</p>
                </div>
              </div>

              {result.errors.length > 0 && (
                <div>
                  <h3 className="font-bold text-red-600 flex items-center gap-2 mb-3">
                    <XCircle className="w-5 h-5" /> Errors ({result.errors.length})
                  </h3>
                  <div className="max-h-40 overflow-y-auto space-y-1.5">
                    {result.errors.map((item, i) => (
                      <div key={i} className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm">
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                          <span className="text-red-800 font-medium">{item.name}</span>
                          <span className="text-red-400 ml-auto text-xs">Row {item.row}</span>
                        </div>
                        <p className="text-red-600 text-xs mt-1 ml-6">{item.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={onClose}
                className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700">
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Category Modal ─────────────────────────────────────────────────────────────
function CategoryModal({ category, onClose, onSaved }: { category: Category | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ name: category?.name || '', description: category?.description || '' });
  const [loading, setLoading] = useState(false);
  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const res: any = category ? await categoryAPI.update(category._id, form) : await categoryAPI.create(form);
      if (res.success) { toast.success(category ? 'Category updated!' : 'Category added!'); onSaved(); onClose(); }
    } catch (err: any) { toast.error(err.message || 'Something went wrong'); }
    finally { setLoading(false); }
  };
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl">
          <h2 className="text-xl font-bold text-white">{category ? 'Edit Category' : 'Add New Category'}</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white"><X className="w-6 h-6" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category Name *</label>
            <input value={form.name} onChange={set('name')} required placeholder="e.g. Antibiotics"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
            <textarea value={form.description} onChange={set('description')} rows={3}
              placeholder="Brief description..." className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (category ? 'Update' : 'Add Category')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Reviews Tab ────────────────────────────────────────────────────────────────
function ReviewsTab() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    reviewAPI.getAll().then((res: any) => {
      if (res.success) setReviews(res.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res: any = await reviewAPI.delete(id);
      if (res.success) { setReviews((p) => p.filter((r) => r._id !== id)); toast.success('Review deleted.'); }
    } catch (err: any) { toast.error(err.message || 'Failed to delete review'); }
    setConfirmId(null);
  };

  const handleToggle = async (id: string) => {
    try {
      const res: any = await reviewAPI.toggleVisibility(id);
      if (res.success) {
        setReviews((p) => p.map((r) => r._id === id ? { ...r, isVisible: res.data.isVisible } : r));
        toast.success(res.message);
      }
    } catch (err: any) { toast.error(err.message || 'Failed'); }
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} className={`w-4 h-4 ${s <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
      ))}
    </div>
  );

  if (loading) return <div className="space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-24 animate-pulse" />)}</div>;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Product Reviews</h2>
        <p className="text-gray-500 mt-1">{reviews.length} total reviews</p>
      </div>
      {reviews.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
          <Star className="w-20 h-20 text-gray-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700">No reviews yet</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const prod = typeof review.product === 'object' ? review.product : null;
            return (
              <div key={review._id} className={`bg-white rounded-2xl border p-5 shadow-sm transition-all ${review.isVisible ? 'border-gray-100' : 'border-red-100 bg-red-50/30'}`}>
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  {prod && (
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {prod.image && <img src={prod.image} alt="" className="w-14 h-14 rounded-xl object-cover border border-gray-100" />}
                      <div>
                        <p className="text-xs text-gray-400">Product</p>
                        <p className="text-sm font-semibold text-gray-800 max-w-[140px] line-clamp-2">{prod.name}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900">{review.name}</span>
                      {renderStars(review.rating)}
                      {!review.isVisible && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Hidden</span>}
                    </div>
                    <p className="text-xs text-gray-400 mb-2">{review.email} · {new Date(review.createdAt).toLocaleDateString()}</p>
                    {review.message && <p className="text-gray-600 text-sm">{review.message}</p>}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => handleToggle(review._id)}
                      className={`text-xs px-3 py-2 rounded-xl font-semibold border-2 transition-colors ${review.isVisible ? 'border-gray-200 text-gray-600 hover:border-yellow-300 hover:text-yellow-600' : 'border-green-200 text-green-600 hover:bg-green-50'}`}>
                      {review.isVisible ? 'Hide' : 'Show'}
                    </button>
                    <button onClick={() => setConfirmId(review._id)}
                      className="text-xs px-3 py-2 rounded-xl font-semibold border-2 border-gray-200 text-red-500 hover:border-red-300 hover:bg-red-50 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {confirmId && (
        <ConfirmDialog
          message="Delete this review permanently? This cannot be undone."
          onConfirm={() => handleDelete(confirmId)}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  );
}

// ── Content Management Tab ─────────────────────────────────────────────────────
function ContentTab() {
  const [allContent, setAllContent] = useState<AllContent | null>(null);
  const [activeSection, setActiveSection] = useState<'home' | 'about' | 'contact'>('home');
  const [editedContent, setEditedContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    contentAPI.getAll().then((res: any) => {
      if (res.success) {
        setAllContent(res.data);
        setEditedContent(res.data[activeSection] || {});
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (allContent) setEditedContent(allContent[activeSection] || {});
  }, [activeSection, allContent]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res: any = await contentAPI.update(activeSection, editedContent);
      if (res.success) {
        setAllContent((prev) => prev ? { ...prev, [activeSection]: res.data } : null);
        toast.success(`${activeSection} content updated!`);
      }
    } catch (err: any) { toast.error(err.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleReset = async () => {
    setResetting(true);
    try {
      const res: any = await contentAPI.reset(activeSection);
      if (res.success) {
        setEditedContent(res.data);
        setAllContent((prev) => prev ? { ...prev, [activeSection]: res.data } : null);
        toast.success('Content reset to defaults!');
      }
    } catch (err: any) { toast.error(err.message || 'Reset failed'); }
    finally { setResetting(false); }
  };

  const sectionLabels: Record<string, string> = {
    home: '🏠 Home Page', about: '🏢 About Page', contact: '📞 Contact Page',
  };

  const fieldLabels: Record<string, string> = {
    heroTitle: 'Hero Title', heroSubtitle: 'Hero Subtitle', heroBadge: 'Hero Badge Text',
    heroCta1: 'CTA Button 1', heroCta2: 'CTA Button 2', featuresTitle: 'Features Section Title',
    featuresSubtitle: 'Features Subtitle', statsYears: 'Years Experience Stat',
    statsProducts: 'Products Stat', statsPartners: 'Partners Stat', statsSupport: 'Support Stat',
    testimonialTitle: 'Testimonials Title', faqTitle: 'FAQ Title', ctaTitle: 'CTA Section Title',
    ctaSubtitle: 'CTA Subtitle', whyUsTitle: 'Why Choose Us Title',
    heroSubtitle2: 'Hero Subtitle 2', overviewTitle: 'Overview Title',
    overviewPara1: 'Overview Paragraph 1', overviewPara2: 'Overview Paragraph 2',
    overviewPara3: 'Overview Paragraph 3', missionTitle: 'Mission Title', missionText: 'Mission Text',
    visionTitle: 'Vision Title', visionText: 'Vision Text',
    ceoName: 'CEO Name', location: 'Location', businessType: 'Business Type',
    established: 'Established Year', employees: 'Employees', certification: 'Certification', gstNo: 'GST No.',
    address: 'Full Address', phone: 'Phone Number', email: 'Email Address',
    businessHours: 'Business Hours', mapUrl: 'Google Maps URL',
    formTitle: 'Form Title', infoTitle: 'Info Title', infoSubtitle: 'Info Subtitle',
  };

  const isLongField = (key: string) => ['overviewPara1', 'overviewPara2', 'overviewPara3', 'missionText', 'visionText', 'heroSubtitle', 'ctaSubtitle', 'infoSubtitle'].includes(key);

  if (loading) return <div className="space-y-4">{[...Array(6)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-20 animate-pulse" />)}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Content Management</h2>
          <p className="text-gray-500 mt-1">Edit text content for public-facing pages</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 bg-gray-100 p-1.5 rounded-2xl w-fit">
        {(['home', 'about', 'contact'] as const).map((s) => (
          <button key={s} onClick={() => setActiveSection(s)}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${activeSection === s ? 'bg-white shadow-sm text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}>
            {sectionLabels[s]}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="space-y-4">
          {Object.entries(editedContent).map(([key, value]) => (
            <div key={key}>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                {fieldLabels[key] || key}
              </label>
              {isLongField(key) ? (
                <textarea value={value} onChange={(e) => setEditedContent(p => ({ ...p, [key]: e.target.value }))}
                  rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none" />
              ) : (
                <input value={value} onChange={(e) => setEditedContent(p => ({ ...p, [key]: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
          <button onClick={handleReset} disabled={resetting}
            className="flex items-center gap-2 border-2 border-gray-200 text-gray-600 px-5 py-3 rounded-xl font-semibold hover:border-red-300 hover:text-red-600 transition-colors text-sm disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${resetting ? 'animate-spin' : ''}`} /> Reset to Defaults
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
            {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}


// ── Testimonials Tab ───────────────────────────────────────────────────────────
function TestimonialModal({ testimonial, onClose, onSaved }: {
  testimonial: Testimonial | null; onClose: () => void; onSaved: () => void;
}) {
  const [form, setForm] = useState({
    text: testimonial?.text || '',
    name: testimonial?.name || '',
    designation: testimonial?.designation || '',
    rating: testimonial?.rating || 5,
    order: testimonial?.order || 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(testimonial?.image || '');
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [field]: e.target.value }));

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('text', form.text);
      fd.append('name', form.name);
      fd.append('designation', form.designation);
      fd.append('rating', String(form.rating));
      fd.append('order', String(form.order));
      if (imageFile) fd.append('image', imageFile);
      const res: any = testimonial
        ? await testimonialAPI.update(testimonial._id, fd)
        : await testimonialAPI.create(fd);
      if (res.success) { toast.success(testimonial ? 'Testimonial updated!' : 'Testimonial added!'); onSaved(); onClose(); }
    } catch (err: any) { toast.error(err.message || 'Something went wrong'); }
    finally { setLoading(false); }
  };

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[95vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl sticky top-0 z-10">
          <h2 className="text-xl font-bold text-white">{testimonial ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white"><X className="w-6 h-6" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Image */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Profile Photo (Optional)</label>
            <div onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-xl p-4 cursor-pointer hover:border-blue-400 transition-colors group">
              {preview ? (
                <div className="flex items-center gap-3">
                  <img src={preview} alt="Preview" className="w-16 h-16 rounded-full object-cover" />
                  <p className="text-sm text-gray-500 group-hover:text-blue-500">Click to change photo</p>
                </div>
              ) : (
                <div className="flex items-center gap-3 py-2 text-gray-400">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-sm">Click to upload profile photo</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Review Text *</label>
            <textarea value={form.text} onChange={set('text')} required rows={4}
              placeholder="What did the customer say about your service..."
              className={`${inputCls} resize-none`} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Customer Name *</label>
              <input value={form.name} onChange={set('name')} required placeholder="e.g. Rajesh Sharma" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Designation</label>
              <input value={form.designation} onChange={set('designation')} placeholder="e.g. Distributor, Mumbai" className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Star Rating</label>
              <div className="flex gap-1 mt-1">
                {[1,2,3,4,5].map(s => (
                  <button key={s} type="button" onClick={() => setForm(p => ({ ...p, rating: s }))}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${s <= form.rating ? 'text-yellow-400' : 'text-gray-200 hover:text-yellow-300'}`}>
                    <Star className={`w-6 h-6 ${s <= form.rating ? 'fill-yellow-400' : ''}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Display Order</label>
              <input type="number" value={form.order} onChange={(e) => setForm(p => ({ ...p, order: Number(e.target.value) }))}
                min="0" className={inputCls} />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {loading ? 'Saving...' : testimonial ? 'Update' : 'Add Testimonial'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TestimonialsTab() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Testimonial | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const fetchAll = () => {
    testimonialAPI.getAllAdmin().then((res: any) => {
      if (res.success) setTestimonials(res.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const handleDelete = async (id: string) => {
    try {
      const res: any = await testimonialAPI.delete(id);
      if (res.success) { setTestimonials(p => p.filter(t => t._id !== id)); toast.success('Deleted.'); }
    } catch (err: any) { toast.error(err.message || 'Delete failed'); }
    setConfirmId(null);
  };

  const handleToggle = async (id: string) => {
    try {
      const res: any = await testimonialAPI.toggleVisibility(id);
      if (res.success) setTestimonials(p => p.map(t => t._id === id ? { ...t, isVisible: res.data.isVisible } : t));
    } catch (err: any) { toast.error('Failed to toggle visibility'); }
  };

  if (loading) return <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-28 animate-pulse" />)}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Testimonials</h2>
          <p className="text-gray-500 mt-1">{testimonials.length} total — shown dynamically on homepage</p>
        </div>
        <button onClick={() => { setEditItem(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-md">
          <Plus className="w-5 h-5" /> Add Testimonial
        </button>
      </div>

      {testimonials.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
          <Quote className="w-20 h-20 text-gray-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">No testimonials yet</h3>
          <button onClick={() => { setEditItem(null); setModalOpen(true); }}
            className="mt-2 inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700">
            <Plus className="w-5 h-5" /> Add First Testimonial
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div key={t._id} className={`bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-shadow ${!t.isVisible ? 'opacity-60 border-dashed border-gray-300' : 'border-gray-100'}`}>
              {!t.isVisible && (
                <span className="inline-block text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full mb-3">Hidden</span>
              )}
              <div className="flex gap-1 mb-3">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={`w-3.5 h-3.5 ${s <= (t.rating||5) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                ))}
              </div>
              <p className="text-gray-600 text-sm italic mb-4 line-clamp-3">"{t.text}"</p>
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-4">
                {t.image ? (
                  <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {t.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                  {t.designation && <p className="text-gray-400 text-xs">{t.designation}</p>}
                </div>
                <span className="ml-auto text-xs text-gray-400">Order: {t.order}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleToggle(t._id)}
                  className={`flex-1 text-xs py-2 rounded-xl font-semibold border-2 transition-colors ${t.isVisible ? 'border-gray-200 text-gray-600 hover:border-yellow-300 hover:text-yellow-600' : 'border-green-200 text-green-600 hover:bg-green-50'}`}>
                  {t.isVisible ? 'Hide' : 'Show'}
                </button>
                <button onClick={() => { setEditItem(t); setModalOpen(true); }}
                  className="flex-1 flex items-center justify-center gap-1 border-2 border-gray-200 text-gray-700 py-2 rounded-xl font-semibold hover:border-blue-300 hover:text-blue-600 transition-colors text-xs">
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={() => setConfirmId(t._id)}
                  className="flex-1 flex items-center justify-center gap-1 border-2 border-gray-200 text-gray-700 py-2 rounded-xl font-semibold hover:border-red-300 hover:text-red-600 transition-colors text-xs">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <TestimonialModal
          testimonial={editItem}
          onClose={() => { setModalOpen(false); setEditItem(null); }}
          onSaved={fetchAll}
        />
      )}
      {confirmId && (
        <ConfirmDialog
          message="Delete this testimonial? This cannot be undone."
          onConfirm={() => handleDelete(confirmId)}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  );
}

// ── Home Cards Tab ─────────────────────────────────────────────────────────────
const AVAILABLE_ICONS = [
  'Shield', 'Award', 'Clock', 'Users', 'Package', 'Globe', 'TrendingUp',
  'Microscope', 'HeartPulse', 'Star', 'BadgeCheck', 'Truck', 'ThumbsUp',
  'CheckCircle', 'Phone',
];
const AVAILABLE_COLORS = [
  { value: 'blue', label: 'Blue', cls: 'bg-blue-100 text-blue-700' },
  { value: 'emerald', label: 'Green', cls: 'bg-emerald-100 text-emerald-700' },
  { value: 'orange', label: 'Orange', cls: 'bg-orange-100 text-orange-700' },
  { value: 'purple', label: 'Purple', cls: 'bg-purple-100 text-purple-700' },
  { value: 'teal', label: 'Teal', cls: 'bg-teal-100 text-teal-700' },
  { value: 'green', label: 'Green-2', cls: 'bg-green-100 text-green-700' },
  { value: 'red', label: 'Red', cls: 'bg-red-100 text-red-700' },
  { value: 'cyan', label: 'Cyan', cls: 'bg-cyan-100 text-cyan-700' },
];

function HomeCardModal({ card, section, onClose, onSaved }: {
  card: HomeCard | null; section: string; onClose: () => void; onSaved: () => void;
}) {
  const [form, setForm] = useState({
    icon: card?.icon || 'Shield',
    title: card?.title || '',
    description: card?.description || '',
    color: card?.color || 'blue',
    order: card?.order || 0,
  });
  const [loading, setLoading] = useState(false);
  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res: any = card
        ? await homeCardAPI.update(card._id, form)
        : await homeCardAPI.create(section as any, form);
      if (res.success) { toast.success(card ? 'Card updated!' : 'Card added!'); onSaved(); onClose(); }
    } catch (err: any) { toast.error(err.message || 'Something went wrong'); }
    finally { setLoading(false); }
  };

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl">
          <h2 className="text-xl font-bold text-white">{card ? 'Edit Card' : 'Add New Card'}</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white"><X className="w-6 h-6" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Title *</label>
            <input value={form.title} onChange={set('title')} required placeholder="Card title" className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description *</label>
            <textarea value={form.description} onChange={set('description')} required rows={3}
              placeholder="Brief description..." className={`${inputCls} resize-none`} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Icon</label>
              <select value={form.icon} onChange={set('icon')} className={`${inputCls} bg-white`}>
                {AVAILABLE_ICONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Color Theme</label>
              <select value={form.color} onChange={set('color')} className={`${inputCls} bg-white`}>
                {AVAILABLE_COLORS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>
          {/* Color preview */}
          <div className="flex gap-2 flex-wrap">
            {AVAILABLE_COLORS.map(c => (
              <button key={c.value} type="button"
                onClick={() => setForm(p => ({ ...p, color: c.value }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all ${c.cls} ${form.color === c.value ? 'border-current scale-110' : 'border-transparent'}`}>
                {c.label}
              </button>
            ))}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Display Order</label>
            <input type="number" value={form.order} onChange={(e) => setForm(p => ({ ...p, order: Number(e.target.value) }))}
              min="0" className={inputCls} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {loading ? 'Saving...' : card ? 'Update Card' : 'Add Card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function HomeCardsTab() {
  const [activeSection, setActiveSection] = useState<'features' | 'why_us' | 'highlights'>('features');
  const [cards, setCards] = useState<HomeCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editCard, setEditCard] = useState<HomeCard | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);

  const fetchCards = async (section: 'features' | 'why_us' | 'highlights') => {
    setLoading(true);
    try {
      const res: any = await homeCardAPI.getAllAdmin(section);
      if (res.success) setCards(res.data || []);
    } catch (_) {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCards(activeSection); }, [activeSection]);

  const handleDelete = async (id: string) => {
    try {
      const res: any = await homeCardAPI.delete(id);
      if (res.success) { setCards(p => p.filter(c => c._id !== id)); toast.success('Card deleted.'); }
    } catch (err: any) { toast.error(err.message || 'Delete failed'); }
    setConfirmId(null);
  };

  const handleReset = async () => {
    setResetting(true);
    try {
      const res: any = await homeCardAPI.reset(activeSection);
      if (res.success) { setCards(res.data || []); toast.success('Cards reset to defaults!'); }
    } catch (err: any) { toast.error(err.message || 'Reset failed'); }
    finally { setResetting(false); }
  };

  const sectionLabels = { features: '⚡ Features', why_us: '✅ Why Choose Us', highlights: '🏆 Certifications' };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Home Page Cards</h2>
          <p className="text-gray-500 mt-1">Manage dynamic cards shown on the homepage</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleReset} disabled={resetting}
            className="flex items-center gap-2 border-2 border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl font-semibold hover:border-red-300 hover:text-red-600 transition-colors text-sm disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${resetting ? 'animate-spin' : ''}`} /> Reset
          </button>
          <button onClick={() => { setEditCard(null); setModalOpen(true); }}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-md text-sm">
            <Plus className="w-4 h-4" /> Add Card
          </button>
        </div>
      </div>

      {/* Section switcher */}
      <div className="flex gap-2 mb-6 bg-gray-100 p-1.5 rounded-2xl w-fit">
        {(['features', 'why_us', 'highlights'] as const).map(s => (
          <button key={s} onClick={() => setActiveSection(s)}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${activeSection === s ? 'bg-white shadow-sm text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}>
            {sectionLabels[s]}
          </button>
        ))}
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-6 text-sm text-blue-700 flex items-start gap-2">
        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>Cards are rendered in order on the homepage. Hidden cards are not shown to visitors. Use Reset to restore defaults.</span>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-36 animate-pulse" />)}
        </div>
      ) : cards.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <LayoutGrid className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-700 mb-2">No cards in this section</h3>
          <button onClick={() => { setEditCard(null); setModalOpen(true); }}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 text-sm">
            <Plus className="w-4 h-4" /> Add First Card
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((card) => (
            <div key={card._id} className={`bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-shadow ${!card.isVisible ? 'opacity-60 border-dashed' : 'border-gray-100'}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold bg-${card.color}-100 text-${card.color}-700`}>
                    {card.icon.charAt(0)}
                  </span>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Icon: {card.icon}</p>
                    <p className="text-xs text-gray-400">Color: {card.color} · Order: {card.order}</p>
                  </div>
                </div>
                {!card.isVisible && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Hidden</span>}
              </div>
              <h3 className="font-bold text-gray-900 mb-1 text-sm">{card.title}</h3>
              <p className="text-gray-500 text-xs line-clamp-2 mb-4">{card.description}</p>
              <div className="flex gap-2">
                <button onClick={() => { setEditCard(card); setModalOpen(true); }}
                  className="flex-1 flex items-center justify-center gap-1 border-2 border-gray-200 text-gray-700 py-2 rounded-xl text-xs font-semibold hover:border-blue-300 hover:text-blue-600 transition-colors">
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={() => setConfirmId(card._id)}
                  className="flex-1 flex items-center justify-center gap-1 border-2 border-gray-200 text-gray-700 py-2 rounded-xl text-xs font-semibold hover:border-red-300 hover:text-red-600 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <HomeCardModal
          card={editCard}
          section={activeSection}
          onClose={() => { setModalOpen(false); setEditCard(null); }}
          onSaved={() => fetchCards(activeSection)}
        />
      )}
      {confirmId && (
        <ConfirmDialog
          message="Delete this card? This cannot be undone."
          onConfirm={() => handleDelete(confirmId)}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  );
}


// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);

  const [productModal, setProductModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [bulkUploadModal, setBulkUploadModal] = useState(false);
  const [bulkCategoryUploadModal, setBulkCategoryUploadModal] = useState(false);
  const [categoryModal, setCategoryModal] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ type: 'product' | 'category'; id: string } | null>(null);
  const [viewInquiry, setViewInquiry] = useState<Inquiry | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [pRes, cRes, iRes, sRes]: any[] = await Promise.all([
        productAPI.getAll(), categoryAPI.getAll(), inquiryAPI.getAll(), statsAPI.get(),
      ]);
      if (pRes.success) setProducts(pRes.data || []);
      if (cRes.success) setCategories(cRes.data || []);
      if (iRes.success) setInquiries(iRes.data || []);
      if (sRes.success) setStats(sRes.data);
    } catch (err: any) { toast.error(err.message || 'Failed to load data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleDeleteProduct = async (id: string) => {
    try {
      const res: any = await productAPI.delete(id);
      if (res.success) { setProducts((p) => p.filter((x) => x._id !== id)); toast.success('Product deleted.'); }
    } catch (err: any) { toast.error(err.message || 'Delete failed'); }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const res: any = await categoryAPI.delete(id);
      if (res.success) { setCategories((p) => p.filter((x) => x._id !== id)); toast.success('Category deleted.'); }
    } catch (err: any) { toast.error(err.message || 'Delete failed'); }
  };

  const handleStatusChange = async (id: string, status: 'pending' | 'contacted' | 'resolved') => {
    try {
      const res: any = await inquiryAPI.updateStatus(id, status);
      if (res.success) setInquiries((p) => p.map((x) => x._id === id ? { ...x, status } : x));
    } catch (err: any) { toast.error(err.message || 'Update failed'); }
  };

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'products', label: 'Products', icon: Package },
    { key: 'categories', label: 'Categories', icon: Tag },
    { key: 'inquiries', label: 'Inquiries', icon: MessageSquare },
    { key: 'reviews', label: 'Reviews', icon: Star },
    { key: 'testimonials', label: 'Testimonials', icon: Quote },
    { key: 'homecards', label: 'Home Cards', icon: LayoutGrid },
    { key: 'content', label: 'Content', icon: FileText },
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50 ">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col shadow-sm hidden lg:flex h-screen sticky top-0 flex-shrink-0 overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <BarChart2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Biolex Admin</p>
              <p className="text-xs text-gray-500">{admin?.email}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${activeTab === key ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}>
              <Icon className="w-5 h-5" /> {label}
              {key === 'inquiries' && inquiries.filter(i => i.status === 'pending').length > 0 && (
                <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === key ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'}`}>
                  {inquiries.filter(i => i.status === 'pending').length}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button onClick={() => { logout(); navigate('/admin/login'); }}
            className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 font-semibold text-sm transition-colors">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-40 px-4 py-3 flex items-center justify-between shadow-sm">
        <span className="font-bold text-gray-900">Biolex Admin</span>
        <button onClick={() => { logout(); navigate('/admin/login'); }} className="text-red-500">
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile tabs */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40 flex">
        {tabs.slice(0, 6).map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`flex-1 flex flex-col items-center py-2 text-xs font-semibold transition-colors ${activeTab === key ? 'text-blue-600' : 'text-gray-400'}`}>
            <Icon className="w-5 h-5 mb-0.5" /> {label}
          </button>
        ))}
      </div>

      {/* Main content */}
      <main className="flex-1 p-6 lg:p-8 mt-14 lg:mt-0 mb-16 lg:mb-0 overflow-y-auto h-screen">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
              <p className="text-gray-500 mt-1">Welcome back, {admin?.name || 'Admin'}!</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Products', value: stats?.totalProducts || 0, icon: Package, color: 'bg-blue-500' },
                { label: 'Categories', value: stats?.totalCategories || 0, icon: Tag, color: 'bg-purple-500' },
                { label: 'Total Inquiries', value: stats?.totalInquiries || 0, icon: MessageSquare, color: 'bg-emerald-500' },
                { label: 'Pending', value: stats?.pendingInquiries || 0, icon: Eye, color: 'bg-orange-500' },
              ].map((card, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className={`w-10 h-10 ${card.color} rounded-xl flex items-center justify-center mb-3`}>
                    <card.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{card.value}</div>
                  <div className="text-sm text-gray-500">{card.label}</div>
                </div>
              ))}
            </div>
            {stats && (
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4">Products by Category</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={stats.productsByCategory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#2563eb" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4">Inquiry Status</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={stats.inquiriesByStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>
                        {stats.inquiriesByStatus.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                      </Pie>
                      <Tooltip /><Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Products</h2>
                <p className="text-gray-500 mt-1">{products.length} total products</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setBulkUploadModal(true)}
                  className="flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-md">
                  <FileSpreadsheet className="w-5 h-5" /> Bulk Upload
                </button>
                <button onClick={() => { setEditProduct(null); setProductModal(true); }}
                  className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-md">
                  <Plus className="w-5 h-5" /> Add Product
                </button>
              </div>
            </div>
            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-64 animate-pulse" />)}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
                <Package className="w-20 h-20 text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">No products yet</h3>
                <button onClick={() => { setEditProduct(null); setProductModal(true); }}
                  className="mt-2 inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700">
                  <Plus className="w-5 h-5" /> Add First Product
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map((product) => (
                  <div key={product._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="h-44 bg-gradient-to-br from-blue-50 to-gray-100 relative">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-16 h-16 text-blue-200" />
                        </div>
                      )}
                      {product.isFeatured && (
                        <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-900" /> Featured
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-xs font-semibold text-blue-600 mb-1">{product.categoryName || 'Uncategorized'}</p>
                      <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                      {product.form && <p className="text-xs text-gray-400 mb-2">Form: {product.form}</p>}
                      <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditProduct(product); setProductModal(true); }}
                          className="flex-1 flex items-center justify-center gap-1.5 border-2 border-gray-200 text-gray-700 py-2 rounded-xl font-semibold hover:border-blue-300 hover:text-blue-600 transition-colors text-sm">
                          <Edit className="w-4 h-4" /> Edit
                        </button>
                        <button onClick={() => setConfirmDelete({ type: 'product', id: product._id })}
                          className="flex-1 flex items-center justify-center gap-1.5 border-2 border-gray-200 text-gray-700 py-2 rounded-xl font-semibold hover:border-red-300 hover:text-red-600 transition-colors text-sm">
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
                <p className="text-gray-500 mt-1">{categories.length} total categories</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setBulkCategoryUploadModal(true)}
                  className="flex items-center gap-2 bg-purple-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors shadow-md">
                  <FileSpreadsheet className="w-5 h-5" /> Bulk Upload
                </button>
                <button onClick={() => { setEditCategory(null); setCategoryModal(true); }}
                  className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-md">
                  <Plus className="w-5 h-5" /> Add Category
                </button>
              </div>
            </div>
            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-32 animate-pulse" />)}
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
                <Tag className="w-20 h-20 text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">No categories yet</h3>
                <div className="flex items-center justify-center gap-3 mt-4">
                  <button onClick={() => setBulkCategoryUploadModal(true)}
                    className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700">
                    <FileSpreadsheet className="w-5 h-5" /> Bulk Upload
                  </button>
                  <button onClick={() => { setEditCategory(null); setCategoryModal(true); }}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700">
                    <Plus className="w-5 h-5" /> Add First Category
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {categories.map((cat) => {
                  const productCount = products.filter((p) => p.category === cat._id).length;
                  return (
                    <div key={cat._id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center">
                          <Tag className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                          {productCount} product{productCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1">{cat.name}</h3>
                      <p className="text-gray-500 text-sm mb-4 line-clamp-2">{cat.description || 'No description'}</p>
                      <p className="text-xs text-gray-400 mb-4">Created {new Date(cat.createdAt).toLocaleDateString()}</p>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditCategory(cat); setCategoryModal(true); }}
                          className="flex-1 flex items-center justify-center gap-1.5 border-2 border-gray-200 text-gray-700 py-2 rounded-xl font-semibold hover:border-blue-300 hover:text-blue-600 transition-colors text-sm">
                          <Edit className="w-4 h-4" /> Edit
                        </button>
                        <button onClick={() => setConfirmDelete({ type: 'category', id: cat._id })}
                          className="flex-1 flex items-center justify-center gap-1.5 border-2 border-gray-200 text-gray-700 py-2 rounded-xl font-semibold hover:border-red-300 hover:text-red-600 transition-colors text-sm">
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Inquiries Tab */}
        {activeTab === 'inquiries' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Customer Inquiries</h2>
              <p className="text-gray-500 mt-1">{inquiries.length} total — {inquiries.filter(i => i.status === 'pending').length} pending</p>
            </div>
            {loading ? (
              <div className="space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-24 animate-pulse" />)}</div>
            ) : inquiries.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
                <MessageSquare className="w-20 h-20 text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700">No inquiries yet</h3>
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inq) => {
                  const prod = products.find((p) => p._id === inq.productId);
                  return (
                    <div key={inq._id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        {prod?.image && (
                          <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-blue-50 border border-blue-100">
                            <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-900">{inq.name}</h3>
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusColor[inq.status]}`}>{inq.status}</span>
                          </div>
                          <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-2">
                            <span>{inq.email}</span><span>•</span><span>{inq.phone}</span>
                            {inq.company && <><span>•</span><span>{inq.company}</span></>}
                          </div>
                          {inq.productName && (
                            <span className="inline-block text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium mb-2">📦 {inq.productName}</span>
                          )}
                          <p className="text-gray-600 text-sm line-clamp-2">{inq.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{new Date(inq.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="flex flex-row md:flex-col gap-2 flex-shrink-0">
                          <button onClick={() => setViewInquiry(inq)}
                            className="flex items-center gap-1.5 border-2 border-gray-200 text-gray-600 px-3 py-2 rounded-xl text-sm font-semibold hover:border-blue-300 hover:text-blue-600 transition-colors">
                            <Eye className="w-4 h-4" /> View
                          </button>
                          <select value={inq.status} onChange={(e) => handleStatusChange(inq._id, e.target.value as any)}
                            className="border-2 border-gray-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-blue-400 bg-white cursor-pointer">
                            <option value="pending">Pending</option>
                            <option value="contacted">Contacted</option>
                            <option value="resolved">Resolved</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && <ReviewsTab />}
        {activeTab === 'content' && <ContentTab />}
        {activeTab === 'testimonials' && <TestimonialsTab />}
        {activeTab === 'homecards' && <HomeCardsTab />}
      </main>

      {/* Modals */}
      {bulkUploadModal && (
        <BulkUploadModal onClose={() => setBulkUploadModal(false)} onDone={fetchAll} />
      )}
      {bulkCategoryUploadModal && (
        <BulkUploadCategoriesModal onClose={() => setBulkCategoryUploadModal(false)} onDone={fetchAll} />
      )}
      {productModal && (
        <ProductModal product={editProduct} categories={categories}
          onClose={() => { setProductModal(false); setEditProduct(null); }} onSaved={fetchAll} />
      )}
      {categoryModal && (
        <CategoryModal category={editCategory}
          onClose={() => { setCategoryModal(false); setEditCategory(null); }} onSaved={fetchAll} />
      )}
      {confirmDelete && (
        <ConfirmDialog
          message={`Delete this ${confirmDelete.type}? This cannot be undone.`}
          onConfirm={() => {
            if (confirmDelete.type === 'product') handleDeleteProduct(confirmDelete.id);
            else handleDeleteCategory(confirmDelete.id);
            setConfirmDelete(null);
          }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
      {viewInquiry && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl">
              <h2 className="text-xl font-bold text-white">Inquiry Details</h2>
              <button onClick={() => setViewInquiry(null)} className="text-white/80 hover:text-white"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-6 space-y-4">
              {(() => { const prod = products.find((p) => p._id === viewInquiry.productId); return prod ? (
                <div className="flex gap-4 bg-blue-50 rounded-xl p-4">
                  {prod.image && <img src={prod.image} alt="" className="w-20 h-20 object-cover rounded-lg" />}
                  <div>
                    <p className="text-xs text-blue-500 font-semibold mb-1">PRODUCT INQUIRY</p>
                    <p className="font-bold text-gray-900">{viewInquiry.productName}</p>
                  </div>
                </div>
              ) : null; })()}
              {[
                { label: 'Name', value: viewInquiry.name }, { label: 'Email', value: viewInquiry.email },
                { label: 'Phone', value: viewInquiry.phone }, { label: 'Company', value: viewInquiry.company || '—' },
                { label: 'Quantity', value: viewInquiry.quantity || '—' }, { label: 'Status', value: viewInquiry.status },
                { label: 'Date', value: new Date(viewInquiry.createdAt).toLocaleString() },
              ].map((row, i) => (
                <div key={i} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-gray-500 text-sm">{row.label}</span>
                  <span className="font-semibold text-gray-900 text-sm text-right max-w-xs">{row.value}</span>
                </div>
              ))}
              <div>
                <p className="text-gray-500 text-sm mb-2">Message</p>
                <p className="bg-gray-50 rounded-xl p-4 text-gray-800 text-sm whitespace-pre-wrap">{viewInquiry.message}</p>
              </div>
              <div className="pt-2">
                <p className="text-sm font-semibold text-gray-700 mb-2">Update Status</p>
                <div className="flex gap-2">
                  {(['pending', 'contacted', 'resolved'] as const).map((s) => (
                    <button key={s} onClick={() => { handleStatusChange(viewInquiry._id, s); setViewInquiry({ ...viewInquiry, status: s }); }}
                      className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-colors capitalize ${viewInquiry.status === s ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-200 text-gray-600 hover:border-blue-300'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}