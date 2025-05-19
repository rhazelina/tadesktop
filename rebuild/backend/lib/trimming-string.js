function trimStrings(obj) {
  if (Array.isArray(obj)) {
    return obj.map(trimStrings);
  } else if (typeof obj === "object" && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, trimStrings(value)])
    )
  } else if (typeof obj === "string") {
    return obj.trim()
  }
  return obj
}

export default trimStrings