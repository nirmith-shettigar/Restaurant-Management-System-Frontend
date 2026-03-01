export function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return regex.test(email);
}

export function isValidPhoneNumber(phone) {
  return /^\d{10}$/.test(phone);
}
