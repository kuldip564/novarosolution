export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateContactPayload(payload) {
  const { name, email, subject, message } = payload ?? {};

  if (!name || !email || !subject || !message) {
    return 'All fields are required.';
  }

  if (!isValidEmail(email)) {
    return 'Please provide a valid email address.';
  }

  return '';
}
