import { useState } from 'react';
import { X, Package } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { inquiryAPI } from '../services/api';
import { toast } from 'sonner';
import { Product } from '../types';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export default function InquiryModal({ isOpen, onClose, product }: InquiryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    quantity: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        productId: product?._id,
        message: product
          ? `Inquiry for: ${product.name}\n\n${formData.message}`
          : formData.message,
      };
      const response: any = await inquiryAPI.create(payload);
      if (response.success) {
        toast.success('Inquiry sent! We will contact you within 24 hours.');
        setFormData({ name: '', email: '', phone: '', company: '', quantity: '', message: '' });
        onClose();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to send inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[95vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl">
          <h2 className="text-xl font-bold text-white">Send Product Inquiry</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Product Info */}
          {product && (
            <div className="flex gap-4 bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6">
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-white border border-blue-100">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-8 h-8 text-blue-300" />
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs text-blue-500 font-medium uppercase tracking-wide mb-1">
                  Inquiring About
                </p>
                <p className="font-bold text-gray-900">{product.name}</p>
                {product.categoryName && (
                  <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    {product.categoryName}
                  </span>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="inq-name">Full Name *</Label>
                <Input id="inq-name" value={formData.name} onChange={set('name')} required placeholder="Your full name" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="inq-email">Email *</Label>
                <Input id="inq-email" type="email" value={formData.email} onChange={set('email')} required placeholder="email@example.com" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="inq-phone">Phone *</Label>
                <Input id="inq-phone" type="tel" value={formData.phone} onChange={set('phone')} required placeholder="+91 9876543210" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="inq-company">Company Name</Label>
                <Input id="inq-company" value={formData.company} onChange={set('company')} placeholder="Your company (optional)" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="inq-qty">Quantity Required</Label>
                <Input id="inq-qty" value={formData.quantity} onChange={set('quantity')} placeholder="e.g. 500 units" className="mt-1" />
              </div>
              <div className="col-span-2">
                <Label htmlFor="inq-msg">Message *</Label>
                <Textarea
                  id="inq-msg"
                  value={formData.message}
                  onChange={set('message')}
                  required
                  placeholder="Describe your requirements, expected price, delivery location..."
                  rows={4}
                  className="mt-1 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  'Send Inquiry'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
