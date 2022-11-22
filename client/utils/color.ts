export const getRandomColorCode = () => {
  const colors = [
    '#ea580c',
    '#4d7c0f',
    '#0284c7',
    '#1d4ed8',
    '#4338ca',
    '#6d28d9',
    '#a21caf',
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}
