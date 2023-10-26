export default (number) => {
  if (!number) return 0;
  if (number < 1000) {
    return number;
  }
  return Math.round(number / 1000);
};
