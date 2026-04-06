const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthToken = (): string | null => localStorage.getItem('authToken');

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'An error occurred');
  return data;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },
  verifyToken: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return handleResponse(response);
  },
};

// ── Categories ────────────────────────────────────────────────────────────────
export const categoryAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/categories`);
    return handleResponse(response);
  },
  create: async (data: { name: string; description?: string }) => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAuthToken()}` },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  update: async (id: string, data: { name: string; description?: string }) => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAuthToken()}` },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return handleResponse(response);
  },
};

// ── Products ──────────────────────────────────────────────────────────────────
export const productAPI = {
  getAll: async (categoryId?: string, featured?: boolean) => {
    let url = `${API_BASE_URL}/products`;
    const params = new URLSearchParams();
    if (categoryId) params.set('category', categoryId);
    if (featured) params.set('featured', 'true');
    if (params.toString()) url += `?${params.toString()}`;
    const response = await fetch(url);
    return handleResponse(response);
  },
  getByCategory: async (categoryId: string) => {
    const response = await fetch(`${API_BASE_URL}/products?category=${categoryId}`);
    return handleResponse(response);
  },
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    return handleResponse(response);
  },
  create: async (formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getAuthToken()}` },
      body: formData,
    });
    return handleResponse(response);
  },
  update: async (id: string, formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${getAuthToken()}` },
      body: formData,
    });
    return handleResponse(response);
  },
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return handleResponse(response);
  },
};

// ── Inquiries ─────────────────────────────────────────────────────────────────
export const inquiryAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/inquiries`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return handleResponse(response);
  },
  create: async (data: {
    name: string; email: string; phone: string;
    company?: string; quantity?: string; message: string; productId?: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  updateStatus: async (id: string, status: 'pending' | 'contacted' | 'resolved') => {
    const response = await fetch(`${API_BASE_URL}/inquiries/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAuthToken()}` },
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  },
};

// ── Stats ─────────────────────────────────────────────────────────────────────
export const statsAPI = {
  get: async () => {
    const response = await fetch(`${API_BASE_URL}/stats`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return handleResponse(response);
  },
};

// ── Reviews ───────────────────────────────────────────────────────────────────
export const reviewAPI = {
  getByProduct: async (productId: string) => {
    const response = await fetch(`${API_BASE_URL}/reviews?product=${productId}`);
    return handleResponse(response);
  },
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/reviews/all`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return handleResponse(response);
  },
  create: async (data: {
    product: string; name: string; email: string; rating: number; message?: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return handleResponse(response);
  },
  toggleVisibility: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/reviews/${id}/visibility`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return handleResponse(response);
  },
};

// ── Content ───────────────────────────────────────────────────────────────────
export const contentAPI = {
  getSection: async (section: 'home' | 'about' | 'contact') => {
    const response = await fetch(`${API_BASE_URL}/content/${section}`);
    return handleResponse(response);
  },
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/content`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return handleResponse(response);
  },
  update: async (section: 'home' | 'about' | 'contact', content: Record<string, string>) => {
    const response = await fetch(`${API_BASE_URL}/content/${section}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAuthToken()}` },
      body: JSON.stringify({ content }),
    });
    return handleResponse(response);
  },
  reset: async (section: 'home' | 'about' | 'contact') => {
    const response = await fetch(`${API_BASE_URL}/content/${section}/reset`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return handleResponse(response);
  },
};

// ── Testimonials ──────────────────────────────────────────────────────────────
export const testimonialAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/testimonials`);
    return handleResponse(response);
  },
  getAllAdmin: async () => {
    const response = await fetch(`${API_BASE_URL}/testimonials/all`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return handleResponse(response);
  },
  create: async (formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/testimonials`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getAuthToken()}` },
      body: formData,
    });
    return handleResponse(response);
  },
  update: async (id: string, formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${getAuthToken()}` },
      body: formData,
    });
    return handleResponse(response);
  },
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return handleResponse(response);
  },
  toggleVisibility: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/testimonials/${id}/visibility`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return handleResponse(response);
  },
};

// ── Home Cards ────────────────────────────────────────────────────────────────
export const homeCardAPI = {
  getSection: async (section: 'features' | 'why_us' | 'highlights') => {
    const response = await fetch(`${API_BASE_URL}/homecards/${section}`);
    return handleResponse(response);
  },
  getAllAdmin: async (section: 'features' | 'why_us' | 'highlights') => {
    const response = await fetch(`${API_BASE_URL}/homecards/${section}/all`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return handleResponse(response);
  },
  create: async (section: 'features' | 'why_us' | 'highlights', data: object) => {
    const response = await fetch(`${API_BASE_URL}/homecards/${section}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAuthToken()}` },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  update: async (id: string, data: object) => {
    const response = await fetch(`${API_BASE_URL}/homecards/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAuthToken()}` },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/homecards/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return handleResponse(response);
  },
  reset: async (section: 'features' | 'why_us' | 'highlights') => {
    const response = await fetch(`${API_BASE_URL}/homecards/${section}/reset`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return handleResponse(response);
  },
};

// ── Bulk Upload ───────────────────────────────────────────────────────────────
export const bulkUploadAPI = {
  uploadProducts: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/bulk-upload/products`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getAuthToken()}` },
      body: formData,
    });
    return handleResponse(response);
  },

  uploadCategories: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/bulk-upload/categories`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getAuthToken()}` },
      body: formData,
    });
    return handleResponse(response);
  },
};