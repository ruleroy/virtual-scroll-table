export default function sortType(key, ascOrder) {
  if (key === "none") {
    return (a, b) => 1;
  }

  //grab only numbers from the string to compare
  if (key === "index") {
    return (a, b) => {
      let aDigits = a[0].match(/(\d+)/g)[0];
      let bDigits = b[0].match(/(\d+)/g)[0];
      return ascOrder ? aDigits - bDigits : bDigits - aDigits;
    };
  }

  //get the number else get max/min values for filler to deprioritize the row
  return (a, b) => {
    let aDigits = a[1][key] || (ascOrder ? Number.MAX_VALUE : Number.MIN_VALUE);
    let bDigits = b[1][key] || (ascOrder ? Number.MAX_VALUE : Number.MIN_VALUE);
    return ascOrder ? aDigits - bDigits : bDigits - aDigits;
  };
}
