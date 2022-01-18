export function addSpaceEveryCharacter(string: string | number) {
  if (!string) return

  return string.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export function daysInMonth(month: number | null, year: number | null) {
  if (!month || !year) return 0

  return new Date(year, month, 0).getDate()
}
