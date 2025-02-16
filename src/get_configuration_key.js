export function getConfigKey() {
  return new Promise((resolve) => {
    resolve("74486418");
    // first try from local storage chrome.
    // if not there try reading cookie on mellowtel.com
    // worst case, fall back to default one
  });
}
