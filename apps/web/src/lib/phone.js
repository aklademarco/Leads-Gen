/**
 * Convert a Ghanaian phone number into the international digits WhatsApp
 * expects, e.g. "024 222 6555" -> "233242226555". Returns null when the
 * number can't be interpreted.
 */
export function toWhatsAppNumber(phone) {
  if (!phone) return null;
  let digits = String(phone).replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("233")) return digits.length >= 12 ? digits : null;
  if (digits.startsWith("0")) digits = digits.slice(1);
  if (digits.length < 9) return null;
  return `233${digits}`;
}

export function whatsAppUrl(phone) {
  const n = toWhatsAppNumber(phone);
  return n ? `https://wa.me/${n}` : null;
}

export function telUrl(phone) {
  if (!phone) return null;
  return `tel:${String(phone).replace(/[^\d+]/g, "")}`;
}
