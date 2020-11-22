const random = {
  direction(opts = {}) {
    let n = Math.round((Math.random() -0.5) * 3);
    if (n === -0) { n = 0 };
    if (opts.zero === false & n === 0) {
      return random.direction(opts);
    }
    return n;
  },
  calcDirection(n, [min, max]) {
    const newN = n + random.direction();
    if (newN > max) {
      return max;
    } else if (newN < min) {
      return min;
    }
    return newN;
  },
  number([min, max] = [0, 1000000]) {
    return min + (Math.random() * (max - min));
  },
  integer(extent) {
    return Math.round(random.number(extent));
  },
  item(arr) {
    return arr[random.integer([0, arr.length-1])];
  },
  order(sourceArray) {
    const arr = [...sourceArray];
    for(let i = arr.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * i)
      const temp = arr[i]
      arr[i] = arr[j]
      arr[j] = temp
    }
    return arr;
  },
  selection(arr, length) {
    return random.order(arr).slice(0, length);
  },
}

export default random;