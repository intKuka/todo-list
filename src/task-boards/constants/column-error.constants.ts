const enum columnErrorMessages {
  NOT_FOUND = 'Column with this label not found',
  CONFLICT = 'Column with this label is already exists',
  SAME_COLUMN_POSITIONS = 'The current and new positions have the same values',
}

export default columnErrorMessages;
