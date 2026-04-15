const DISCOUNT_CODES = {
  FIRSTLESSON: 10,
  SUMMER25: 25,
  LOYAL: 15,
};

function validateDiscount(code) {
  if (!code) return null;
  return DISCOUNT_CODES[code.toUpperCase()] ?? null;
}

module.exports = { DISCOUNT_CODES, validateDiscount };
