export function getRolePath(code: string): string {
  return `/occupations/${code}`;
}

export function getRoleFactoryPath(code: string): string {
  return `/factory/${code}`;
}

export function getRoleShareImagePath(code: string): string {
  return `${getRolePath(code)}/opengraph-image`;
}
