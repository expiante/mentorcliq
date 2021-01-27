export const duplicate = json => JSON.parse(JSON.stringify(json));

export const addClass = (condition, name) =>
  condition && condition !== 'undefined' ? ` ${name}` : '';
