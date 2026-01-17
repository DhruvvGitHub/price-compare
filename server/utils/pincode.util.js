function isBigBasketServiceable(pincode) {
  if (!pincode) return true; // default allow
  return /^[1-9][0-9]{5}$/.test(pincode);
}

module.exports = { isBigBasketServiceable };
