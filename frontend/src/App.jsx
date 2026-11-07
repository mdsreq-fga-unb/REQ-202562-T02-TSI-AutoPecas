import { useEffect, useState } from 'react';
import { getApiHealth } from './services/api.js';

const statusMessages = {
  checking: 'Verificando conexão com a API…',
  ready: 'API disponível',
  unavailable: 'API indisponível. Verifique se o back-end está em execução.',
};

export default function App() {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    const controller = new AbortController();
    getApiHealth({ signal: controller.signal })
      .then(() => setStatus('ready'))
      .catch(() => {
        if (!controller.signal.aborted) setStatus('unavailable');
      });
    return () => controller.abort();
  }, []);

  return (
    <main className="shell">
      <header>
        <span className="brand-mark" aria-hidden="true">
          TSI
        </span>
        <span className="environment">Desenvolvimento</span>
      </header>
      <section className="welcome" aria-labelledby="welcome-title">
        <p className="eyebrow">Catálogo e controle de estoque</p>
        <h1 id="welcome-title">TSI Peças</h1>
        <p>Base da aplicação preparada para o desenvolvimento das histórias do projeto.</p>
        <div className={`api-status api-status--${status}`} role="status">
          <span className="status-dot" aria-hidden="true" />
          {statusMessages[status]}
        </div>
      </section>
    </main>
  );
}
