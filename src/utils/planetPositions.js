const store = (globalThis.__planetPositions ||= new Map());

export function setPlanetPosition(id, x, y, z) {
  const current = store.get(id);
  if (current) {
    current[0] = x;
    current[1] = y;
    current[2] = z;
    return current;
  }

  const next = [x, y, z];
  store.set(id, next);
  return next;
}

export function getPlanetPosition(id) {
  const current = store.get(id);
  return current ? [current[0], current[1], current[2]] : null;
}
