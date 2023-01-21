function findLastIndex<T>(arr: T[], filter: (item: T) => boolean): number {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (filter(arr[i])) {
      return i;
    }
  }
  return -1
}

export { findLastIndex }