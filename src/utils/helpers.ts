export function addSpaceEveryCharacter(string: string | number) {
  if (!string) return

  return string.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}
