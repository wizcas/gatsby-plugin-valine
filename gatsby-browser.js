exports.onRouteUpdate = (_, options) => {
  if (typeof window !== 'undefined') {
    window.valineOptions = { ...options }
  }
}
