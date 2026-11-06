# Mentor

Aplicativo mobile de gestão de estudos, desenvolvido em React Native com Expo para a trilha de Mobile da Comp Júnior (UFLA), 2026.2.

O Mentor reúne em um só lugar as disciplinas do semestre, as atividades com data de entrega e um cronômetro para registrar o tempo estudado. Os dados ficam em um back-end Supabase, e cada usuário só enxerga os próprios registros.

## Funcionalidades

- Cadastro, login com e-mail e senha, sessão mantida entre aberturas do app e logout.
- Todas as telas do app ficam atrás do login. Quem não está autenticado só vê as telas de login e cadastro.
- CRUD completo de disciplinas: nome, professor, semestre e cor.
- CRUD completo de atividades: título, descrição, tipo, prioridade, status, data de entrega e disciplina.
- Busca por título e filtro por status na lista de atividades.
- Marcar uma atividade como concluída (ou reabri-la) direto pela lista.
- Painel inicial com contadores (pendentes, em andamento, atrasadas e concluídas) e as próximas entregas.
- Tela de foco: cronômetro de estudo por disciplina que salva a sessão ao terminar, com o total da semana e as sessões recentes.
- Feedback visual: indicador de carregamento, estados vazios, mensagens de sucesso e mensagens de erro em português.
- Layout responsivo: menu lateral em forma de gaveta no celular e fixo em telas largas, e listas em duas colunas quando há espaço.

## Tecnologias

| Tecnologia | Uso |
| --- | --- |
| React Native 0.88 e Expo SDK 58 | Base do aplicativo |
| TypeScript | Tipagem do código |
| Expo Router | Rotas baseadas em arquivos, menu lateral (`Drawer`) e rotas protegidas (`Stack.Protected`) |
| Supabase (Auth, PostgreSQL e RLS) | Login, banco de dados e API |
| `@supabase/supabase-js` | Cliente do Supabase |
| `@react-native-async-storage/async-storage` | Guarda a sessão do usuário no aparelho |
| `@expo/ui` | Seletor de data (calendário) |
| React Native Gesture Handler e Reanimated | Animações e gestos do menu lateral |

## Justificativas técnicas

- **Expo com React Native.** É a combinação recomendada pelo documento do desafio. O Expo Go permite testar no celular sem instalar emuladores.
- **Expo Router.** As rotas seguem a estrutura de pastas, e as telas protegidas por login são declaradas com `Stack.Protected` no layout raiz. Ele é construído sobre o React Navigation.
- **Supabase no lugar das opções de back-end sugeridas.** O documento permite outro back-end à escolha, e o uso do Supabase foi confirmado por mensagem com a organização da trilha. Ele cobre os requisitos de autenticação (e-mail e senha, sessão e logout) e de CRUD sem exigir um servidor próprio. A segurança por linha (RLS) garante que cada usuário acesse só os próprios dados, e o esquema do banco fica versionado em `supabase/schema.sql`. Também diferencia este projeto do da trilha de front-end, que usa a opção recomendada.
- **Context API e hooks.** A sessão do usuário fica em um contexto (`AuthContext`), e o carregamento de cada lista fica em hooks (`useDisciplinas`, `useAtividades`, `useSessoes`). Todos os componentes são de função.
- **Camadas separadas.** As telas não conhecem o Supabase: elas usam hooks, e os hooks usam os serviços da pasta `services`. Os componentes visuais são reaproveitados entre as telas (botão, campo de texto, cartões, seletor de opções, estados vazio e de carregamento).
- **Tratamento de erros centralizado.** `utils/errorMessages.ts` traduz os erros da API em mensagens claras: falha de conexão, servidor indisponível, dados inválidos, falha de autenticação, sessão expirada, falta de permissão e resposta inesperada. Os serviços validam o formato das respostas antes de entregá-las às telas, e uma tela de erro própria cobre falhas inesperadas.
- **Responsividade por largura de tela.** O hook `useLayoutResponsivo` decide o layout pela largura da janela, então vale para celular em pé, em paisagem e para tablets.
- **`.npmrc` com `legacy-peer-deps`.** Durante a atualização para o SDK 58, o npm acusou um conflito entre dependências opcionais do Expo Router. O arquivo faz o `npm install` funcionar do mesmo jeito em qualquer máquina.

## Como executar

### Pré-requisitos

- Node.js 22.13 ou mais novo (ou 24.3 ou mais novo). O projeto foi desenvolvido com o Node 24.
- npm (vem com o Node) e Git.
- O aplicativo **Expo Go** no celular, na versão que acompanha o SDK 58 (atualize pela loja se necessário).
- Celular e computador na **mesma rede Wi-Fi**.

### Instalação

```bash
git clone https://github.com/guilhermeoliveirabrito/trainee-mobile-comp-jr.git
cd trainee-mobile-comp-jr
npm install
```

### Configuração do ambiente

O arquivo `.env.example` já traz a URL e a chave publishable do projeto Supabase do autor. Essa chave é pública por natureza, e os dados são protegidos pela segurança por linha do banco. Crie o seu `.env` a partir dele:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# macOS ou Linux
cp .env.example .env
```

Se o app mostrar "Sem conexão" ou "servidor indisponível" mesmo com internet, o projeto Supabase do autor pode estar pausado (o plano gratuito pausa projetos ociosos). Nesse caso, use o seu próprio projeto, como descrito na seção abaixo.

### Iniciando o app

```bash
npx expo start
```

Leia o QR code que aparece no terminal: no iPhone, com a câmera do aparelho; no Android, pelo próprio Expo Go. Na tela inicial, toque em **Criar conta** e cadastre-se. Não há confirmação por e-mail.

Para ver as telas com dados, cadastre primeiro uma disciplina (menu **Disciplinas**) e depois atividades. Na tela **Foco**, a duração de 1 minuto serve para testar o cronômetro rapidamente.

### Usando o seu próprio projeto Supabase (opcional)

1. Crie uma conta e um projeto em [supabase.com](https://supabase.com).
2. No **SQL Editor**, cole o conteúdo de `supabase/schema.sql` e execute. Isso cria as tabelas, as regras de segurança e o gatilho que cria o perfil no cadastro.
3. Em **Authentication**, **Sign In / Providers**, **Email**, desligue a opção **Confirm email** e salve.
4. Em **Project Settings**, **API Keys**, copie a chave publishable (`sb_publishable_...`). A URL do projeto aparece na página **Home**.
5. Coloque os dois valores no `.env`:

   ```
   EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_sua_chave
   ```

6. Reinicie o servidor com `npx expo start --clear`.

Nunca coloque no app, nem no repositório, a chave secreta (`sb_secret_...` ou `service_role`).

## Estrutura do projeto

```
src/
  app/              Rotas (Expo Router)
    _layout.tsx       Layout raiz: sessão, rotas protegidas e tela de erro
    (auth)/           Login e cadastro
    (app)/            Área logada, com o menu lateral
    atividade/        Cadastro e edição de atividade
    disciplina/       Cadastro e edição de disciplina
  components/       Componentes reutilizáveis
  constants/        Opções fixas (tipos, prioridades e status)
  contexts/         Contexto de autenticação
  hooks/            Carregamento de dados, cronômetro e layout responsivo
  screens/          Conteúdo de cada tela
  services/         Acesso ao Supabase e tratamento das respostas
  styles/           Cores, espaçamentos e tamanhos
  types/            Tipos do TypeScript
  utils/            Datas, tempo e mensagens de erro
supabase/
  schema.sql        Esquema do banco, regras de segurança e gatilho
assets/             Ícones e imagens do aplicativo
```

As rotas ficam em `src/app` porque o Expo Router usa a estrutura de pastas para definir as telas. Os arquivos ali são curtos e apenas apontam para as telas de `src/screens`.

## Requisitos do desafio

| Requisito | Situação |
| --- | --- |
| Responsivo para mobile e tablet | Atendido pela largura da tela. Validado em iPhone (retrato e paisagem). Não foi testado em um tablet físico |
| Consumo de dados de uma API, sem dados fixos no código | Atendido (Supabase) |
| Pastas organizadas | Atendido, veja a estrutura acima |
| CRUD completo | Atendido para disciplinas e atividades |
| Login por e-mail e senha, sessão e logout | Atendido |
| Ao menos uma tela restrita a usuários autenticados | Atendido: todo o app, exceto login e cadastro |
| Tratamento de erros da API com mensagens amigáveis | Atendido |
| Feedback visual: carregamento, sucesso, erro e estado vazio | Atendido |
| Componentização e reaproveitamento | Atendido |
| Navegação intuitiva e sidebar funcional | Atendido |

## Limitações conhecidas e melhorias futuras

- A recuperação de senha, presente no design de referência, não foi implementada.
- A tela de foco não tem meta semanal de horas, e o painel inicial não tem gráfico.
- Não há testes automatizados.
- O app foi desenvolvido e validado no Expo Go em iPhone. O Android não foi testado.
- A confirmação de e-mail está desligada para facilitar os testes. Em produção, convém ligá-la.
- No design de referência, o campo de senha usa um ícone de olho. Aqui ele usa o texto "Mostrar/Ocultar".

## Licença

MIT