export function serializePartForm(form) {
  return {
    manufacturer_code: form.manufacturer_code.trim(),
    name: form.name.trim(),
    category: form.category.trim(),
    equivalent_codes: form.equivalent_codes
      .split(/\r?\n/)
      .map((code) => code.trim())
      .filter(Boolean),
    technical_description: form.technical_description.trim() || null,
    physical_location: form.physical_location.trim() || null,
    photo_data: form.photo_data,
  };
}

export function validatePartForm(data) {
  const errors = {};
  for (const field of ['manufacturer_code', 'name', 'category']) {
    if (!data[field]) errors[field] = 'Preencha este campo.';
  }
  const codes = [data.manufacturer_code, ...data.equivalent_codes];
  if (codes.length !== new Set(codes).size) {
    errors.equivalent_codes = 'Não repita o código principal nem os códigos equivalentes.';
  }
  return errors;
}
