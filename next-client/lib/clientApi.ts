'use client';

import { createClient } from '@sanity/client';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001').replace(/\/+$/, '');
const REQUEST_TIMEOUT_MS = 12000;
const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '2a50o6hm';
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const SANITY_API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-01';

const sanityClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  useCdn: false
});

type RequestOptions = RequestInit & { token?: string };

function withBase(path: string) {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${API_URL}${normalized}`;
}

async function safeJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function request<T = any>(path: string, options: RequestOptions = {}) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const { token, headers, ...rest } = options;
  try {
    const response = await fetch(withBase(path), {
      ...rest,
      headers: {
        ...(headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      signal: controller.signal
    });
    const payload = await safeJson(response);
    if (!response.ok) {
      throw new Error(payload?.message || 'Request failed.');
    }
    return payload as T;
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    if (error?.message === 'Failed to fetch') {
      throw new Error('Backend is not reachable. Start server and try again.');
    }
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee' | 'creator' | 'user';
  avatarUrl?: string;
  createdAt?: string;
  creatorRequestStatus?: 'none' | 'pending' | 'approved' | 'rejected';
};

export async function loginUser(payload: { email: string; password: string }) {
  const data = await request<{ data: { token: string; user: AuthUser } }>('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return data.data;
}

export async function registerUser(payload: { name: string; email: string; password: string }) {
  const data = await request<{ data: { token: string; user: AuthUser } }>('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return data.data;
}

export async function fetchMe(token: string) {
  const data = await request<{ data: AuthUser }>('/api/auth/me', { token });
  return data.data;
}

export async function updateProfile(payload: Record<string, unknown>, token: string) {
  const data = await request<{ data: AuthUser }>('/api/auth/profile', {
    method: 'PUT',
    token,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return data.data;
}

export async function changePassword(payload: { currentPassword: string; newPassword: string }, token: string) {
  return request('/api/auth/password', {
    method: 'PUT',
    token,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

export async function requestCreatorAccess(token: string, message = '') {
  const data = await request<{ data: AuthUser }>('/api/auth/creator-request', {
    method: 'POST',
    token,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: String(message || '').trim() })
  });
  return data.data;
}

export type CreatorItem = {
  id: string;
  title: string;
  caption?: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  likesCount?: number;
  likedBy?: string[];
  likedByMe?: boolean;
  commentsCount?: number;
  commentsPreview?: Array<{ id: string; userName?: string; text: string; createdAt?: string }>;
  comments?: Array<{ id: string; userName?: string; text: string }>;
  creatorName?: string;
  createdAt?: string;
};

export type CreatorFeedPagination = {
  page: number;
  limit: number | null;
  total: number;
  totalPages: number;
  hasMore?: boolean;
};

export type FetchCreatorFeedParams = {
  page?: number;
  limit?: number;
  sort?: 'latest' | 'popular' | 'discussed';
  view?: 'summary' | 'full';
  commentsPreviewLimit?: number;
};

export type AdminBlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImageUrl?: string;
  authorName?: string;
  status: 'draft' | 'published';
  publishedAt?: string | null;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type SanityAdminBlogPost = {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published';
  publishedAt?: string | null;
  updatedAt?: string;
};

export async function fetchCreatorFeed(params: FetchCreatorFeedParams = {}, token?: string) {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.sort) query.set('sort', params.sort);
  query.set('view', params.view || 'summary');
  if (params.commentsPreviewLimit !== undefined) {
    query.set('commentsPreviewLimit', String(params.commentsPreviewLimit));
  }
  const path = `/api/creator/feed${query.toString() ? `?${query.toString()}` : ''}`;
  const data = await request<{ data: CreatorItem[]; pagination?: CreatorFeedPagination }>(path, { token });
  return {
    items: Array.isArray(data?.data) ? data.data : [],
    pagination: data?.pagination || null
  };
}

export async function likeCreatorFeedContent(contentId: string, token: string) {
  const data = await request<{ data: Partial<CreatorItem> }>(`/api/creator/feed/${contentId}/like`, {
    method: 'POST',
    token
  });
  return data.data;
}

export async function commentCreatorFeedContent(contentId: string, text: string, token: string) {
  const data = await request<{ data: Partial<CreatorItem> }>(`/api/creator/feed/${contentId}/comment`, {
    method: 'POST',
    token,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  return data.data;
}

export async function fetchMyCreatorContent(token: string) {
  const data = await request<{ data: CreatorItem[] }>('/api/creator/content', { token });
  return Array.isArray(data?.data) ? data.data : [];
}

export async function createMyCreatorContent(payload: Record<string, unknown>, token: string) {
  const data = await request<{ data: CreatorItem }>('/api/creator/content', {
    method: 'POST',
    token,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return data.data;
}

export async function updateMyCreatorContent(contentId: string, payload: Record<string, unknown>, token: string) {
  const data = await request<{ data: CreatorItem }>(`/api/creator/content/${contentId}`, {
    method: 'PATCH',
    token,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return data.data;
}

export async function deleteMyCreatorContent(contentId: string, token: string) {
  return request(`/api/creator/content/${contentId}`, { method: 'DELETE', token });
}

export type ProjectChatMessage = {
  id: string;
  senderId: string;
  senderRole: 'admin' | 'user';
  message: string;
  createdAt: string;
  userDeleteRequested?: boolean;
};

export async function fetchMyProjectMessages(token: string) {
  const data = await request<{ data: ProjectChatMessage[] }>('/api/chat/my', { token });
  return Array.isArray(data?.data) ? data.data : [];
}

export async function sendMyProjectMessage(payload: { message: string }, token: string) {
  const data = await request<{ data: ProjectChatMessage }>('/api/chat/my', {
    method: 'POST',
    token,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return data.data;
}

export async function requestDeleteMyProjectChat(token: string) {
  return request('/api/chat/my', { method: 'DELETE', token });
}

export type AdminChatThread = {
  userId: string;
  userName: string;
  userEmail: string;
  lastMessage: string;
  lastMessageAt: string;
  lastSenderRole: 'admin' | 'user';
  userDeleteRequested?: boolean;
};

export async function fetchAdminChatThreads(token: string) {
  const data = await request<{ data: AdminChatThread[] }>('/api/admin/chats', { token });
  return Array.isArray(data?.data) ? data.data : [];
}

export async function fetchAdminChatMessages(userId: string, token: string) {
  const data = await request<{ data: ProjectChatMessage[] }>(`/api/admin/chats/${userId}`, { token });
  return Array.isArray(data?.data) ? data.data : [];
}

export async function sendAdminChatMessage(userId: string, payload: { message: string }, token: string) {
  const data = await request<{ data: ProjectChatMessage }>(`/api/admin/chats/${userId}`, {
    method: 'POST',
    token,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return data.data;
}

export async function deleteAdminChatThread(userId: string, token: string) {
  return request(`/api/admin/chats/${userId}`, { method: 'DELETE', token });
}

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
};

export async function fetchContactSubmissions(token: string) {
  const data = await request<{ data: ContactSubmission[] }>('/api/contact-submissions', { token });
  return Array.isArray(data?.data) ? data.data : [];
}

export type AdminOverview = {
  totalUsers: number;
  totalAdmins: number;
  totalMembers: number;
  totalEmployees: number;
  totalCreators: number;
  pendingCreatorRequests: number;
  totalSubmissions: number;
  totalAppointments: number;
};

export type AdminUser = AuthUser & {
  isActive?: boolean;
  creatorRequestMessage?: string;
};

export type AdminEmployee = {
  id: string;
  userId: string;
  name: string;
  email: string;
  role?: string;
  department?: string;
  phone?: string;
  joinedAt?: string;
  notes?: string;
  isActive?: boolean;
};

export type AdminEmployeeTask = {
  id: string;
  employeeId: string;
  employeeName?: string;
  title: string;
  plannedTask?: string;
  adminNote?: string;
  workDate?: string;
  status: 'pending' | 'in_progress' | 'completed';
  workUpdate?: string;
  proofLink?: string;
  approvalRequested?: boolean;
  jobStartAt?: string;
  jobEndAt?: string;
  completedAt?: string;
  updatedAt?: string;
  createdAt?: string;
};

export async function fetchAdminOverview(token: string) {
  const data = await request<{ data: AdminOverview }>('/api/admin/overview', { token });
  return data?.data;
}

export async function fetchAdminUsers(token: string) {
  const data = await request<{ data: AdminUser[] }>('/api/admin/users', { token });
  return Array.isArray(data?.data) ? data.data : [];
}

export async function updateAdminUserRole(userId: string, role: string, token: string) {
  const data = await request<{ data: AdminUser }>(`/api/admin/users/${userId}/role`, {
    method: 'PATCH',
    token,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role })
  });
  return data.data;
}

export async function reviewAdminCreatorRequest(userId: string, action: 'approve' | 'reject', token: string) {
  const data = await request<{ data: AdminUser }>(`/api/admin/users/${userId}/creator-request`, {
    method: 'PATCH',
    token,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action })
  });
  return data.data;
}

export async function updateAdminUserStatus(userId: string, isActive: boolean, token: string) {
  const data = await request<{ data: AdminUser }>(`/api/admin/users/${userId}/status`, {
    method: 'PATCH',
    token,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isActive })
  });
  return data.data;
}

export async function revokeAdminUserSessions(userId: string, token: string) {
  const data = await request<{ data: { message: string } }>(`/api/admin/users/${userId}/revoke-session`, {
    method: 'POST',
    token
  });
  return data.data;
}

export async function deleteAdminUser(userId: string, token: string) {
  return request(`/api/admin/users/${userId}`, { method: 'DELETE', token });
}

export async function fetchAdminEmployees(token: string) {
  const data = await request<{ data: AdminEmployee[] }>('/api/admin/employees', { token });
  return Array.isArray(data?.data) ? data.data : [];
}

export async function fetchAdminEmployeeTasks(token: string) {
  const data = await request<{ data: AdminEmployeeTask[] }>('/api/admin/employee-tasks', { token });
  return Array.isArray(data?.data) ? data.data : [];
}

export async function createAdminEmployee(payload: Record<string, unknown>, token: string) {
  const data = await request<{ data: AdminEmployee }>('/api/admin/employees', {
    method: 'POST',
    token,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return data.data;
}

export async function updateAdminEmployee(employeeId: string, payload: Record<string, unknown>, token: string) {
  const data = await request<{ data: AdminEmployee }>(`/api/admin/employees/${employeeId}`, {
    method: 'PATCH',
    token,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return data.data;
}

export async function deleteAdminEmployee(employeeId: string, token: string) {
  return request(`/api/admin/employees/${employeeId}`, {
    method: 'DELETE',
    token
  });
}

export async function createAdminEmployeeTask(payload: Record<string, unknown>, token: string) {
  const data = await request<{ data: AdminEmployeeTask }>('/api/admin/employee-tasks', {
    method: 'POST',
    token,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return data.data;
}

export async function updateAdminEmployeeTask(taskId: string, payload: Record<string, unknown>, token: string) {
  const data = await request<{ data: AdminEmployeeTask }>(`/api/admin/employee-tasks/${taskId}`, {
    method: 'PATCH',
    token,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return data.data;
}

export async function deleteAdminEmployeeTask(taskId: string, token: string) {
  return request(`/api/admin/employee-tasks/${taskId}`, {
    method: 'DELETE',
    token
  });
}

export async function fetchServiceAppointments(token: string) {
  const data = await request<{ data: Array<Record<string, unknown>> }>('/api/appointments', { token });
  return Array.isArray(data?.data) ? data.data : [];
}

export async function fetchAdminCreatorContent(token: string) {
  const data = await request<{ data: CreatorItem[] }>('/api/admin/creator-content', { token });
  return Array.isArray(data?.data) ? data.data : [];
}

export async function fetchAdminBlogPosts(token: string) {
  const data = await request<{ data: AdminBlogPost[] }>('/api/admin/blog', { token });
  return Array.isArray(data?.data) ? data.data : [];
}

export async function fetchSanityAdminBlogPosts() {
  const rows = await sanityClient.fetch<Array<Record<string, any>>>(
    `*[_type == "blogPost" && !(_id in path("drafts.**"))] | order(coalesce(publishedAt, _updatedAt) desc) {
      _id,
      _updatedAt,
      title,
      slug,
      status,
      publishedAt
    }`
  );
  if (!Array.isArray(rows)) return [];
  return rows.map((item): SanityAdminBlogPost => ({
    id: String(item?._id || ''),
    title: String(item?.title || 'Untitled'),
    slug: String(item?.slug?.current || item?.slug || '').trim(),
    status: item?.status === 'published' ? 'published' : 'draft',
    publishedAt: item?.publishedAt || null,
    updatedAt: item?._updatedAt || ''
  }));
}

export async function createAdminBlogPost(payload: Record<string, unknown>, token: string) {
  const data = await request<{ data: AdminBlogPost }>('/api/admin/blog', {
    method: 'POST',
    token,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return data.data;
}

export async function updateAdminBlogPost(blogId: string, payload: Record<string, unknown>, token: string) {
  const data = await request<{ data: AdminBlogPost }>(`/api/admin/blog/${blogId}`, {
    method: 'PATCH',
    token,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return data.data;
}

export async function deleteAdminBlogPost(blogId: string, token: string) {
  return request(`/api/admin/blog/${blogId}`, { method: 'DELETE', token });
}

export async function fetchSiteContentClient() {
  const data = await request<{ data: Record<string, any> }>('/api/site-content');
  return data?.data || {};
}

export async function updateSiteContent(payload: Record<string, unknown>, token: string) {
  const data = await request<{ data: Record<string, any> }>('/api/site-content', {
    method: 'PUT',
    token,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return data?.data || {};
}

export type EmployeeDailyTask = {
  id: string;
  title: string;
  plannedTask?: string;
  workDate?: string;
  workUpdate?: string;
  proofLink?: string;
  status: 'pending' | 'in_progress' | 'completed';
  approvalRejected?: boolean;
  approvalRequested?: boolean;
  adminNote?: string;
  jobStartAt?: string;
  jobEndAt?: string;
  updatedAt?: string;
};

export async function fetchMyDailyTasks(token: string) {
  const data = await request<{ data: EmployeeDailyTask[] }>('/api/employee/tasks', { token });
  return Array.isArray(data?.data) ? data.data : [];
}

export async function createMyDailyTask(payload: Record<string, unknown>, token: string) {
  const data = await request<{ data: EmployeeDailyTask }>('/api/employee/tasks', {
    method: 'POST',
    token,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return data.data;
}

export async function updateMyDailyTask(taskId: string, payload: Record<string, unknown>, token: string) {
  const data = await request<{ data: EmployeeDailyTask }>(`/api/employee/tasks/${taskId}`, {
    method: 'PATCH',
    token,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return data.data;
}

export async function deleteMyDailyTask(taskId: string, token: string) {
  return request(`/api/employee/tasks/${taskId}`, { method: 'DELETE', token });
}

export async function downloadMyMonthlyTaskReport(year: number, month: number, token: string) {
  const response = await fetch(withBase(`/api/employee/tasks/monthly-report?year=${year}&month=${month}`), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) {
    let message = 'Unable to download monthly report.';
    try {
      const data = await response.json();
      message = data?.message || message;
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }
  const blob = await response.blob();
  const disposition = response.headers.get('content-disposition') || '';
  const match = disposition.match(/filename="?([^"]+)"?/i);
  const filename = match?.[1] || `employee-task-report-${year}-${String(month).padStart(2, '0')}.xlsx`;
  return { blob, filename };
}

export async function downloadAdminEmployeeMonthlyReport(
  employeeId: string,
  year: number,
  month: number,
  token: string
) {
  const response = await fetch(
    withBase(
      `/api/admin/employee-tasks/monthly-report?employeeId=${encodeURIComponent(employeeId)}&year=${year}&month=${month}`
    ),
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  if (!response.ok) {
    let message = 'Unable to download monthly report.';
    try {
      const data = await response.json();
      message = data?.message || message;
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }
  const blob = await response.blob();
  const disposition = response.headers.get('content-disposition') || '';
  const match = disposition.match(/filename="?([^"]+)"?/i);
  const filename = match?.[1] || `employee-task-report-${year}-${String(month).padStart(2, '0')}.xlsx`;
  return { blob, filename };
}
