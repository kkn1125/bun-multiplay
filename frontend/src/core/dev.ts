const dev = Object.fromEntries(
  Object.entries(console).map(([key, value]) =>
    key === "memory" ? [key, value] : [key, value.bind(console, "[DEV] ::")]
  )
) as Console;

export default dev;
