import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import {
  ArrowLeft, Package, Star, Send, MapPin, Tag, Layers,
  FlaskConical, Shield, AlertCircle, Info, ChevronRight,
  ThumbsUp, MessageSquare, Globe, Pill, CheckCircle, Phone,
} from 'lucide-react';
import { productAPI, reviewAPI, inquiryAPI } from '../services/api';
import { Product, Review } from '../types';
import { toast } from 'sonner';
import InquiryModal from '../components/InquiryModal';

// ── Star Rating Input ─────────────────────────────────────────────────────────
function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="focus:outline-none"
        >
          <Star
            className={`w-7 h-7 transition-colors ${
              star <= (hover || value) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

// ── Star Display ──────────────────────────────────────────────────────────────
function StarDisplay({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const cls = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`${cls} ${s <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  // Review form state
  const [reviewForm, setReviewForm] = useState({ name: '', email: '', rating: 0, message: '' });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [pRes, rRes]: any[] = await Promise.all([
          productAPI.getById(id),
          reviewAPI.getByProduct(id),
        ]);
        if (pRes.success) setProduct(pRes.data);
        if (rRes.success) {
          setReviews(rRes.data || []);
          setAvgRating(rRes.avgRating || 0);
          setTotalReviews(rRes.totalReviews || 0);
        }
      } catch {
        toast.error('Failed to load product.');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewForm.rating === 0) { toast.error('Please select a rating.'); return; }
    if (!product) return;
    setReviewSubmitting(true);
    try {
      const res: any = await reviewAPI.create({ product: product._id, ...reviewForm });
      if (res.success) {
        toast.success('Review submitted! Thank you.');
        setReviews((prev) => [res.data, ...prev]);
        setTotalReviews((prev) => prev + 1);
        // Recalculate avg
        const newAvg = [...reviews, res.data].reduce((s, r) => s + r.rating, 0) / (reviews.length + 1);
        setAvgRating(parseFloat(newAvg.toFixed(1)));
        setReviewForm({ name: '', email: '', rating: 0, message: '' });
        setShowReviewForm(false);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit review.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const specRows = [
    { icon: Tag, label: 'Brand', value: product.brand },
    { icon: Pill, label: 'Form', value: product.form },
    { icon: Layers, label: 'Packaging Size', value: product.packagingSize },
    { icon: Globe, label: 'Country of Origin', value: product.countryOfOrigin },
    { icon: FlaskConical, label: 'Composition', value: product.composition },
    { icon: Info, label: 'Dosage', value: product.dosage },
    { icon: Shield, label: 'Storage', value: product.storage },
    { icon: AlertCircle, label: 'Side Effects', value: product.sideEffects },
  ].filter((r) => r.value);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/products" className="hover:text-blue-600 transition-colors">Products</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium line-clamp-1">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-8 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Products
        </button>

        {/* ── Main Product Card ──────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image */}
            <div className="relative bg-gradient-to-br from-blue-50 to-gray-100 min-h-[350px] flex items-center justify-center p-8">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full max-h-[400px] object-contain rounded-xl"
                />
              ) : (
                <Package className="w-32 h-32 text-blue-200" />
              )}
              {product.isFeatured && (
                <span className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-900" /> Featured
                </span>
              )}
              {product.categoryName && (
                <span className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                  {product.categoryName}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="p-8 flex flex-col">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>

              {/* Rating summary */}
              {totalReviews > 0 && (
                <div className="flex items-center gap-3 mb-4">
                  <StarDisplay rating={avgRating} size="sm" />
                  <span className="font-semibold text-gray-800">{avgRating}</span>
                  <span className="text-gray-500 text-sm">({totalReviews} review{totalReviews !== 1 ? 's' : ''})</span>
                </div>
              )}

              {/* Price line — like indiamart style */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-4 mb-6">
                <p className="text-sm text-gray-500 mb-1">Approx. Price</p>
                <p className="text-xl font-bold text-blue-700">Get Latest Price</p>
                <p className="text-xs text-gray-400 mt-1">Price varies as per order quantity. Contact us for bulk pricing.</p>
              </div>

              <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

              {/* Quick specs */}
              {specRows.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {specRows.slice(0, 4).map((row, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <row.icon className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400">{row.label}</p>
                        <p className="text-sm font-medium text-gray-800">{row.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-auto flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => setInquiryOpen(true)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold transition-all hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" /> Send Inquiry
                </button>
                <a
                  href="tel:+918047680904"
                  className="flex-1 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-3.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" /> Call Now
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── Full Specs Table ───────────────────────────────────────────────── */}
        {specRows.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" /> Product Specifications
            </h2>
            <div className="divide-y divide-gray-100">
              {specRows.map((row, i) => (
                <div key={i} className="flex items-center py-3.5 gap-4">
                  <div className="flex items-center gap-2 w-44 flex-shrink-0">
                    <row.icon className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-gray-500">{row.label}</span>
                  </div>
                  <span className="text-gray-800 text-sm">{row.value}</span>
                </div>
              ))}
              {/* Additional dynamic fields */}
              {(product.additionalDetails || []).map((detail, i) => (
                <div key={`ad-${i}`} className="flex items-center py-3.5 gap-4">
                  <div className="flex items-center gap-2 w-44 flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-medium text-gray-500">{detail.key}</span>
                  </div>
                  <span className="text-gray-800 text-sm">{detail.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Ratings & Reviews ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" /> Ratings & Reviews
            </h2>
            {!showReviewForm && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Star className="w-4 h-4" /> Write a Review
              </button>
            )}
          </div>

          {/* Avg rating banner */}
          {totalReviews > 0 && (
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 mb-8 flex items-center gap-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-700">{avgRating}</div>
                <StarDisplay rating={avgRating} size="lg" />
                <p className="text-sm text-gray-500 mt-1">{totalReviews} review{totalReviews !== 1 ? 's' : ''}</p>
              </div>
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = reviews.filter((r) => r.rating === star).length;
                  const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-2 text-sm">
                      <span className="w-3 text-gray-600">{star}</span>
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-6 text-gray-500">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Review Form */}
          {showReviewForm && (
            <form onSubmit={handleReviewSubmit} className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-5">Write Your Review</h3>
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Rating *</label>
                <StarInput value={reviewForm.rating} onChange={(v) => setReviewForm((p) => ({ ...p, rating: v }))} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                  <input
                    required value={reviewForm.name}
                    onChange={(e) => setReviewForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Your name"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email *</label>
                  <input
                    required type="email" value={reviewForm.email}
                    onChange={(e) => setReviewForm((p) => ({ ...p, email: e.target.value }))}
                    placeholder="your@email.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                  />
                </div>
              </div>
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Review Message (optional)</label>
                <textarea
                  value={reviewForm.message}
                  onChange={(e) => setReviewForm((p) => ({ ...p, message: e.target.value }))}
                  rows={3} placeholder="Share your experience with this product..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none text-sm"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button" onClick={() => setShowReviewForm(false)}
                  className="flex-1 border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors text-sm"
                >Cancel</button>
                <button
                  type="submit" disabled={reviewSubmitting}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  {reviewSubmitting ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting...</> : <><ThumbsUp className="w-4 h-4" /> Submit Review</>}
                </button>
              </div>
            </form>
          )}

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Star className="w-12 h-12 mx-auto mb-3 text-gray-200" />
              <p className="font-medium">No reviews yet</p>
              <p className="text-sm mt-1">Be the first to review this product!</p>
            </div>
          ) : (
            <div className="space-y-5">
              {reviews.map((review) => (
                <div key={review._id} className="border border-gray-100 rounded-xl p-5 hover:border-blue-100 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {review.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{review.name}</p>
                          <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                      </div>
                    </div>
                    <StarDisplay rating={review.rating} />
                  </div>
                  {review.message && <p className="text-gray-600 text-sm leading-relaxed">{review.message}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <InquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} product={product} />
    </div>
  );
}
