export const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(
  /\/$/,
  '',
);

export async function getApiHealth({ signal } = {}) {
  const response = await fetch(`${apiBaseUrl}/health`, { signal });
  if (!response.ok) {
    throw new Error('Não foi possível consultar a API.');
  }
  const data = await response.json();
  if (data.status !== 'ok') {
    throw new Error('A API não confirmou seu funcionamento.');
  }
  return data;
}
