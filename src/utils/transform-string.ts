export function transformString(inputString: string): string {
  const sanitizedString = inputString.replace(/[^\w\s-]/gi, '');
  const transformedString = sanitizedString.replace(/\s+/g, '_').replace(/-/g, '_');

  return transformedString;
}
