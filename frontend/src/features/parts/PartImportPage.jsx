import {
  Alert,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { importTemplateUrl } from '../../services/partImports.js';
import usePartImport from './usePartImport.js';

export default function PartImportPage({ onDone }) {
  const { data, error, result, isReading, isSaving, isLocked, selectFile, submit } =
    usePartImport();
  return (
    <Stack spacing={3} sx={{ maxWidth: 860 }}>
      <Typography variant="h1">Importar peças</Typography>
      <Typography color="text.secondary">
        Cadastre as peças da sua planilha de uma só vez. Se houver erro em qualquer linha, o lote
        inteiro será rejeitado.
      </Typography>
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={2}>
          <Typography variant="h2">Prepare a planilha</Typography>
          <Typography>Use uma única aba preenchida, com o cabeçalho na primeira linha.</Typography>
          <Typography>
            Obrigatórios: Código do fabricante, Nome e Categoria. Opcionais: Descrição técnica e
            Localização física.
          </Typography>
          <Typography>
            Preencha os códigos como texto para preservar zeros iniciais e separadores. Não use
            fórmulas.
          </Typography>
          <Typography color="text.secondary">
            Este modelo não importa equivalentes, fotos, aplicações por veículo, saldos, dados
            fiscais ou históricos. As peças começam com saldo zero; registre o estoque por entrada
            ou ajuste.
          </Typography>
          <Button
            component="a"
            href={importTemplateUrl}
            download="modelo-pecas.xlsx"
            variant="outlined"
            sx={{ alignSelf: 'flex-start', minHeight: 44 }}
          >
            Baixar modelo .xlsx
          </Button>
        </Stack>
      </Paper>
      {result && (
        <Alert severity="success" role="status">
          {result.imported_count} peças importadas com sucesso.
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ overflowWrap: 'anywhere' }}>
          {error.message}
          {Array.isArray(error.issues) && (
            <Stack component="ul" spacing={1} sx={{ pl: 2, mb: 0 }}>
              {error.issues.map((issue, index) => (
                <Typography
                  component="li"
                  variant="body2"
                  key={index}
                >{`Linha ${issue.row}: ${issue.message}`}</Typography>
              ))}
            </Stack>
          )}
        </Alert>
      )}
      {!result && (
        <Paper component="form" onSubmit={submit} variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack spacing={2}>
            <TextField
              type="file"
              label="Planilha .xlsx"
              onChange={selectFile}
              disabled={isLocked || isReading}
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: { accept: '.xlsx', 'aria-describedby': 'import-limits' },
              }}
              sx={{ '& input': { minHeight: 44, minWidth: 0, boxSizing: 'border-box' } }}
            />
            <Typography id="import-limits" variant="body2" color="text.secondary">
              Limites por arquivo: 2 MiB, 32 MiB descompactados e 200.000 células. Remova linhas e
              colunas excedentes.
            </Typography>
            {data && <Typography sx={{ overflowWrap: 'anywhere' }}>{data.filename}</Typography>}
            {isReading && <CircularProgress aria-label="Lendo planilha" />}
            <Button
              type="submit"
              variant="contained"
              disabled={!data || isReading || isSaving}
              sx={{ alignSelf: { sm: 'flex-start' }, minHeight: 44 }}
            >
              {isSaving
                ? 'Importando…'
                : error?.isUncertain
                  ? 'Tentar novamente'
                  : 'Importar peças'}
            </Button>
          </Stack>
        </Paper>
      )}
      <Button
        onClick={onDone}
        disabled={isLocked || isReading}
        sx={{ alignSelf: 'flex-start', minHeight: 44 }}
      >
        Voltar ao catálogo
      </Button>
    </Stack>
  );
}
