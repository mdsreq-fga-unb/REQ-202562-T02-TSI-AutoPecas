export const searchFieldLabels = {
  code: 'Código principal ou equivalente',
  name: 'Nome',
  category: 'Categoria',
  brand: 'Marca',
  model: 'Modelo',
  year: 'Ano',
};

export function createCatalogSearchState() {
  return {
    draft: { code: '', name: '', category: '', brand: '', model: '', year: '' },
    filters: null,
    offset: 0,
  };
}
