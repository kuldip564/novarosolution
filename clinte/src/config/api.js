const API_BASE_URL = import.meta.env.VITE_API_URL || '';
const REQUEST_TIMEOUT_MS = 12000;

function buildUrl(path) {
  if (!API_BASE_URL) return path;
  const normalizedBase = API_BASE_URL.replace(/\/+$/, '');
  const normalizedPath = String(path || '').startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

async function safeJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function request(path, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(buildUrl(path), {
      ...options,
      signal: controller.signal,
    });
    const data = await safeJson(response);
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized. Please login again.');
      }
      if (response.status === 403) {
        throw new Error('Forbidden. You do not have permission for this action.');
      }
      throw new Error(data?.message || 'Request failed.');
    }
    return data;
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new Error('Request timed out. Please check backend/network and try again.');
    }
    if (error?.message === 'Failed to fetch') {
      throw new Error('Backend is not reachable. Start server and try again.');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function fetchSiteContent() {
  const data = await request('/api/site-content');
  return data.data;
}

export async function updateSiteContent(payload, token) {
  const data = await request('/api/site-content', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(token),
    },
    body: JSON.stringify(payload),
  });
  return data.data;
}

function getAuthHeaders(token) {
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchContactSubmissions(token) {
  const data = await request('/api/contact-submissions', {
    headers: {
      ...getAuthHeaders(token),
    },
  });
  return data.data;
}

export async function registerUser(payload) {
  const data = await request('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return data.data;
}

export async function loginUser(payload) {
  const data = await request('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return data.data;
}

export async function fetchMe(token) {
  const data = await request('/api/auth/me', {
    headers: {
      ...getAuthHeaders(token),
    },
  });
  return data.data;
}

export async function submitContactForm(payload) {
  const data = await request('/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return data;
}

export async function updateProfile(payload, token) {
  const data = await request('/api/auth/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(token),
    },
    body: JSON.stringify(payload),
  });
  return data.data;
}

export async function changePassword(payload, token) {
  return request('/api/auth/password', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(token),
    },
    body: JSON.stringify(payload),
  });
}

export async function requestCreatorAccess(payload, token) {
  const data = await request('/api/auth/creator-request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(token),
    },
    body: JSON.stringify(payload || {}),
  });
  return data.data;
}

export async function fetchAdminOverview(token) {
  const data = await request('/api/admin/overview', {
    headers: {
      ...getAuthHeaders(token),
    },
  });
  return data.data;
}

export async function fetchAdminUsers(token) {
  const data = await request('/api/admin/users', {
    headers: {
      ...getAuthHeaders(token),
    },
  });
  return data.data;
}

export async function fetchAdminEmployees(token) {
  const data = await request('/api/admin/employees', {
    headers: {
      ...getAuthHeaders(token),
    },
  });
  return data.data;
}

export async function createAdminEmployee(payload, token) {
  const data = await request('/api/admin/employees', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(token),
    },
    body: JSON.stringify(payload),
  });
  return data.data;
}

export async function updateAdminEmployee(employeeId, payload, token) {
  const data = await request(`/api/admin/employees/${employeeId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(token),
    },
    body: JSON.stringify(payload),
  });
  return data.data;
}

export async function deleteAdminEmployee(employeeId, token) {
  return request(`/api/admin/employees/${employeeId}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders(token),
    },
  });
}

export async function fetchAdminEmployeeTasks(token) {
  const data = await request('/api/admin/employee-tasks', {
    headers: {
      ...getAuthHeaders(token),
    },
  });
  return data.data;
}

export async function createAdminEmployeeTask(payload, token) {
  const data = await request('/api/admin/employee-tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(token),
    },
    body: JSON.stringify(payload),
  });
  return data.data;
}

export async function updateAdminEmployeeTask(taskId, payload, token) {
  const data = await request(`/api/admin/employee-tasks/${taskId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(token),
    },
    body: JSON.stringify(payload),
  });
  return data.data;
}

export async function deleteAdminEmployeeTask(taskId, token) {
  return request(`/api/admin/employee-tasks/${taskId}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders(token),
    },
  });
}

export async function downloadAdminEmployeeMonthlyReport(employeeId, year, month, token) {
  const response = await fetch(
    buildUrl(`/api/admin/employee-tasks/monthly-report?employeeId=${employeeId}&year=${year}&month=${month}`),
    {
      headers: {
        ...getAuthHeaders(token),
      },
    },
  );

  if (!response.ok) {
    let message = 'Unable to download employee monthly report.';
    try {
      const data = await response.json();
      if (data?.message) message = data.message;
    } catch {
      // ignore parse failures
    }
    throw new Error(message);
  }

  const blob = await response.blob();
  const contentDisposition = response.headers.get('content-disposition') || '';
  const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/i);
  const filename =
    filenameMatch?.[1] || `employee-monthly-report-${employeeId}-${year}-${String(month).padStart(2, '0')}.xlsx`;

  return { blob, filename };
}

export async function fetchMyDailyTasks(token) {
  const data = await request('/api/employee/tasks', {
    headers: {
      ...getAuthHeaders(token),
    },
  });
  return data.data;
}

export async function createMyDailyTask(payload, token) {
  const data = await request('/api/employee/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(token),
    },
    body: JSON.stringify(payload),
  });
  return data.data;
}

export async function updateMyDailyTask(taskId, payload, token) {
  const data = await request(`/api/employee/tasks/${taskId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(token),
    },
    body: JSON.stringify(payload),
  });
  return data.data;
}

export async function deleteMyDailyTask(taskId, token) {
  return request(`/api/employee/tasks/${taskId}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders(token),
    },
  });
}

export async function downloadMyMonthlyTaskReport(year, month, token) {
  const response = await fetch(buildUrl(`/api/employee/tasks/monthly-report?year=${year}&month=${month}`), {
    headers: {
      ...getAuthHeaders(token),
    },
  });

  if (!response.ok) {
    let message = 'Unable to download monthly report.';
    try {
      const data = await response.json();
      if (data?.message) message = data.message;
    } catch {
      // ignore response parsing errors
    }
    throw new Error(message);
  }

  const blob = await response.blob();
  const contentDisposition = response.headers.get('content-disposition') || '';
  const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/i);
  const filename = filenameMatch?.[1] || `employee-daily-report-${year}-${String(month).padStart(2, '0')}.xlsx`;

  return { blob, filename };
}

export async function updateAdminUserRole(userId, role, token) {
  const data = await request(`/api/admin/users/${userId}/role`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(token),
    },
    body: JSON.stringify({ role }),
  });
  return data.data;
}

export async function reviewAdminCreatorRequest(userId, action, token) {
  const data = await request(`/api/admin/users/${userId}/creator-request`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(token),
    },
    body: JSON.stringify({ action }),
  });
  return data.data;
}

export async function deleteAdminUser(userId, token) {
  return request(`/api/admin/users/${userId}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders(token),
    },
  });
}

export async function updateAdminUserStatus(userId, isActive, token) {
  const data = await request(`/api/admin/users/${userId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(token),
    },
    body: JSON.stringify({ isActive }),
  });
  return data.data;
}

export async function revokeAdminUserSessions(userId, token) {
  const data = await request(`/api/admin/users/${userId}/revoke-session`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(token),
    },
  });
  return data.data;
}

export async function createServiceAppointment(payload) {
  return request('/api/appointments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export async function fetchServiceAppointments(token) {
  const data = await request('/api/appointments', {
    headers: {
      ...getAuthHeaders(token),
    },
  });
  return data.data;
}

export async function fetchMyProjectMessages(token) {
  const data = await request('/api/chat/my', {
    headers: {
      ...getAuthHeaders(token),
    },
  });
  return data.data;
}

export async function sendMyProjectMessage(payload, token) {
  const data = await request('/api/chat/my', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(token),
    },
    body: JSON.stringify(payload),
  });
  return data.data;
}

export async function requestDeleteMyProjectChat(token) {
  return request('/api/chat/my', {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders(token),
    },
  });
}

export async function fetchAdminChatThreads(token) {
  const data = await request('/api/admin/chats', {
    headers: {
      ...getAuthHeaders(token),
    },
  });
  return data.data;
}

export async function fetchAdminChatMessages(userId, token) {
  const data = await request(`/api/admin/chats/${userId}`, {
    headers: {
      ...getAuthHeaders(token),
    },
  });
  return data.data;
}

export async function sendAdminChatMessage(userId, payload, token) {
  const data = await request(`/api/admin/chats/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(token),
    },
    body: JSON.stringify(payload),
  });
  return data.data;
}

export async function deleteAdminChatThread(userId, token) {
  return request(`/api/admin/chats/${userId}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders(token),
    },
  });
}

export async function fetchMyCreatorContent(token) {
  const data = await request('/api/creator/content', {
    headers: {
      ...getAuthHeaders(token),
    },
  });
  return data.data;
}

export async function createMyCreatorContent(payload, token) {
  const data = await request('/api/creator/content', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(token),
    },
    body: JSON.stringify(payload),
  });
  return data.data;
}

export async function fetchAdminCreatorContent(token) {
  const data = await request('/api/admin/creator-content', {
    headers: {
      ...getAuthHeaders(token),
    },
  });
  return data.data;
}

