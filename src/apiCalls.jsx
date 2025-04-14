const memoize = (fn) => {
  const cache = new Map();
  return async (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = await fn(...args);
    cache.set(key, result);
    return result;
  };
};

export const fetchUsers = memoize(async (skip = 0, limit = 10) => {
  let baseURL = new URL("https://dummyjson.com/users");
  const urlSearchParams = new URLSearchParams({
    limit,
    skip,
  });
  baseURL.search = urlSearchParams.toString();

  const response = await fetch(baseURL);
  if (response.status !== 200) {
    console.error("Error fetching users:", response.statusText);
    return null;
  }
  const data = await response.json();
  return { users: data?.users, total: data?.total };
});

export const fetchProjects = memoize(async (skip = 0, limit = 10) => {
  let baseURL = new URL("https://dummyjson.com/products");
  const urlSearchParams = new URLSearchParams({
    limit,
    skip,
  });
  baseURL.search = urlSearchParams.toString();

  const response = await fetch(baseURL);
  if (response.status !== 200) {
    console.error("Error fetching projects:", response.statusText);
    return null;
  }
  const data = await response.json();
  return { products: data?.products, total: data?.total };
});
