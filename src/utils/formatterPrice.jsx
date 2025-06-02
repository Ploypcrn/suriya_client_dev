const formatterPrice = (price) => {
  // return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return Intl.NumberFormat("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

export { formatterPrice };
