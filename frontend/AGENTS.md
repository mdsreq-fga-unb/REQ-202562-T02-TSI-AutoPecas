# Front-end

Aplique também o [AGENTS.md geral](../AGENTS.md). Os comandos de instalação,
testes, cobertura e build ficam no [README desta área](README.md); versões e
scripts são definidos em [package.json](package.json) e `.nvmrc`.

- Mantenha React/Vite em JavaScript e o gerenciador pnpm já adotados.
- Chamadas HTTP ficam em `src/services/`; regras de saldo e vendas pertencem à API.
- Teste comportamento observável com Vitest e Testing Library: interação,
  carregamento, sucesso e erros previstos nos critérios. Use seletores acessíveis
  e isole efeitos de rede; não faça os testes dependerem do Supabase real.
- Siga ESLint/Prettier e verifique os RNFs de interface aplicáveis à US. Confira
  telas pequenas e os estados de erro quando a alteração afetar esses fluxos.
- Variáveis `VITE_` são públicas. URLs e credenciais são mantidas em seus ambientes;
  credenciais do banco pertencem ao back-end.

Para questões específicas, consulte as [orientações da Testing Library](https://testing-library.com/docs/guiding-principles/)
e as [referências React da Vercel](https://github.com/vercel-labs/agent-skills/blob/805687f34e8c10b420e3d11335a0ca2c3c90d992/skills/react-best-practices/SKILL.md).
Selecione as regras aplicáveis a React no cliente; Next.js, Server Components ou
novas dependências não passam a fazer parte do projeto por aparecerem nessa referência.
