import { useState } from 'react';
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';

import { searchFieldLabels } from './partSearchState.js';

export default function PartSearchForm({ draft, onDraftChange, onSearch, onClear }) {
  const [error, setError] = useState('');
  const [yearError, setYearError] = useState('');
  function submit(event) {
    event.preventDefault();
    const filters = Object.fromEntries(
      Object.entries(draft)
        .map(([name, value]) => [name, value.trim()])
        .filter(([, value]) => value),
    );
    setError('');
    setYearError('');
    if (!Object.keys(filters).length) {
      setError('Informe ao menos um filtro para buscar peças.');
      event.currentTarget.querySelector('[name="code"]')?.focus();
      return;
    }
    if (filters.year && !/^[0-9]{4}$/.test(filters.year)) {
      setYearError('Informe um único ano com quatro dígitos.');
      event.currentTarget.querySelector('[name="year"]')?.focus();
      return;
    }
    onSearch(filters);
  }
  return (
    <Paper
      component="form"
      aria-label="Buscar peças"
      noValidate
      onSubmit={submit}
      variant="outlined"
      sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}
    >
      <Stack spacing={2}>
        <Typography variant="h2">Buscar peças</Typography>
        <Typography color="text.secondary">
          Combine os filtros para encontrar a peça adequada.
        </Typography>
        {error && <Alert severity="warning">{error}</Alert>}
        {[
          ['Identificação', ['code', 'name', 'category']],
          ['Aplicação por veículo', ['brand', 'model', 'year']],
        ].map(([title, names]) => (
          <Box key={title}>
            <Typography variant="overline" color="text.secondary">
              {title}
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
                gap: 2,
                mt: 1,
              }}
            >
              {names.map((name) => (
                <TextField
                  key={name}
                  name={name}
                  label={searchFieldLabels[name]}
                  value={draft[name]}
                  error={name === 'year' && Boolean(yearError)}
                  helperText={
                    name === 'year' ? yearError || 'Um ano de quatro dígitos.' : undefined
                  }
                  slotProps={{
                    htmlInput:
                      name === 'year'
                        ? { inputMode: 'numeric' }
                        : { maxLength: ['name', 'model'].includes(name) ? 200 : 100 },
                  }}
                  onChange={(event) => {
                    onDraftChange({ ...draft, [name]: event.target.value });
                    setError('');
                    if (name === 'year') setYearError('');
                  }}
                  sx={{ '& .MuiInputBase-input': { minHeight: 44, boxSizing: 'border-box' } }}
                />
              ))}
            </Box>
          </Box>
        ))}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Button type="submit" variant="contained">
            Buscar
          </Button>
          <Button
            onClick={() => {
              setError('');
              setYearError('');
              onClear();
            }}
          >
            Limpar filtros
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
