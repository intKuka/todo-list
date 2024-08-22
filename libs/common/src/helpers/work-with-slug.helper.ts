export function stringToSlug(str: string): string {
  return str.replace(/\s+/g, '-').toLowerCase();
}
