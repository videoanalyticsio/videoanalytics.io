module.exports = (percent = 100, amount) => {
  const percentOff = (percent / 100) * amount;
  return percentOff;
}
