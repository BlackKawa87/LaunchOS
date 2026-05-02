import type { Phase, Task } from '../types'
import type { ProductType } from '../types'

type RawTask = Omit<Task, 'status' | 'phaseId' | 'notes'> & { status?: Task['status']; phaseId?: string; notes?: string }
type RawPhase = Omit<Phase, 'tasks'> & { tasks: RawTask[] }

function fillPhases(phases: RawPhase[]): Phase[] {
  return phases.map(phase => ({
    ...phase,
    tasks: phase.tasks.map(task => ({
      status: 'pendente' as const,
      phaseId: phase.id,
      notes: '',
      ...task,
    })) as Task[]
  }))
}

export const blankTemplate: Phase[] = []

export const infoProdutoTemplate = fillPhases([
  {
    id: 'ip-fase-1',
    title: 'Validação da ideia',
    description: 'Antes de criar qualquer coisa, validar que existe demanda real',
    order: 1,
    tasks: [
      {
        id: 'ip-t1',
        title: 'Pesquisar a demanda no mercado',
        description: 'Confirmar que as pessoas já procuram e pagam por soluções similares',
        priority: 'critica',
        difficulty: 'facil',
        estimatedTime: '2 horas',
        steps: [
          { id: 's1', title: 'Pesquise no Google Trends', description: 'Digite o tema do seu produto e veja se o interesse está crescendo, estável ou caindo nos últimos 12 meses' },
          { id: 's2', title: 'Pesquise concorrentes na Hotmart e Kiwify', description: 'Busque produtos similares — se existem vários concorrentes é sinal de mercado, não problema' },
          { id: 's3', title: 'Pesquise grupos no Facebook e Reddit', description: 'Procure grupos do nicho e veja as perguntas mais frequentes — cada pergunta recorrente é uma dor do avatar' },
          { id: 's4', title: 'Pesquise no Amazon e Mercado Livre', description: 'Busque livros/produtos físicos sobre o tema — reviews negativos revelam o que o mercado quer mas não tem' },
          { id: 's5', title: 'Documente as 5 principais dores encontradas', description: 'Liste as dores mais frequentes em ordem de intensidade — seu produto deve resolver a dor #1 ou #2' },
        ]
      },
      {
        id: 'ip-t2',
        title: 'Definir o avatar do cliente ideal',
        description: 'Saber exatamente quem vai comprar determina o produto, o preço e a comunicação',
        priority: 'critica',
        difficulty: 'facil',
        estimatedTime: '1 hora',
        steps: [
          { id: 's1', title: 'Defina dados demográficos', description: 'Idade, gênero, localização, renda aproximada, escolaridade, situação familiar' },
          { id: 's2', title: 'Defina a situação atual (antes)', description: 'Qual é o problema que esse avatar vive hoje? O que ele tenta mas não consegue? O que o frustra?' },
          { id: 's3', title: 'Defina a situação desejada (depois)', description: 'Como seria a vida ideal desse avatar após resolver o problema? O que ele ganha: tempo, dinheiro, status, paz?' },
          { id: 's4', title: 'Defina as objeções principais', description: 'Por que ele hesitaria em comprar? Preço? Ceticismo? Já tentou antes? Falta de tempo?' },
          { id: 's5', title: 'Escreva uma frase-avatar', description: 'Ex: "Mãe de 30-40 anos com gato ou cachorro, ama o pet mas não tem tempo para pesquisar e tem medo de que o animal esteja sofrendo sem que ela perceba"' },
        ]
      },
      {
        id: 'ip-t3',
        title: 'Validar o preço antes de criar o produto',
        description: 'Não existe preço certo sem testar — validar antes poupa semanas de trabalho',
        priority: 'alta',
        difficulty: 'medio',
        estimatedTime: '3 dias',
        steps: [
          { id: 's1', title: 'Defina 3 faixas de preço para testar', description: 'Low ticket: $7–$27 | Mid ticket: $37–$97 | High ticket: $197+ — escolha a faixa que faz sentido para o nicho' },
          { id: 's2', title: 'Crie uma página de pré-venda simples', description: 'Uma landing page de 1 seção com headline, descrição do produto e botão de compra — pode usar Carrd ou Notion público' },
          { id: 's3', title: 'Ofereça ao preço escolhido para sua audiência ou grupos', description: 'Poste em grupos do nicho, sua lista de e-mail ou stories — veja se alguém compra antes de criar o produto' },
          { id: 's4', title: 'Analise o resultado', description: 'Se 1–3% comprou = preço validado. Se 0% = ou o produto não ressoa ou o preço está errado. Ajuste e repita.' },
        ]
      },
    ]
  },
  {
    id: 'ip-fase-2',
    title: 'Criação do produto',
    description: 'Criar o produto digital com qualidade profissional',
    order: 2,
    tasks: [
      {
        id: 'ip-t4',
        title: 'Estruturar o conteúdo do produto',
        description: 'Definir o índice completo antes de criar qualquer coisa — o esqueleto guia tudo',
        priority: 'critica',
        difficulty: 'medio',
        estimatedTime: '3 horas',
        steps: [
          { id: 's1', title: 'Liste os resultados que o cliente vai ter', description: 'Comece pelo resultado final — o que o cliente consegue fazer/ter/ser depois de consumir o produto?' },
          { id: 's2', title: 'Mapeie os módulos/seções necessários', description: 'Cada seção deve levar o cliente um passo mais perto do resultado final — pense em sequência lógica' },
          { id: 's3', title: 'Defina a profundidade de cada seção', description: 'Quantas páginas/slides/palavras cada seção precisa? Produtos low ticket: 20–50 páginas. Mid ticket: 50–100 páginas.' },
          { id: 's4', title: 'Crie o índice detalhado', description: 'Escreva título + 2–3 linhas de descrição para cada seção — esse índice vira a estrutura do produto e da página de vendas' },
        ]
      },
      {
        id: 'ip-t5',
        title: 'Produzir o conteúdo',
        description: 'Escrever ou gerar o conteúdo de cada seção com qualidade e profundidade',
        priority: 'critica',
        difficulty: 'dificil',
        estimatedTime: '3–7 dias',
        steps: [
          { id: 's1', title: 'Use IA para acelerar (Claude, ChatGPT)', description: 'Passe o índice para a IA e peça para desenvolver cada seção — depois edite, adicione experiência real e ajuste o tom' },
          { id: 's2', title: 'Escreva em blocos de 2–3 seções por dia', description: 'Não tente fazer tudo de uma vez — escreva de manhã quando o foco está alto e revise à tarde' },
          { id: 's3', title: 'Adicione exemplos reais e casos de uso', description: 'Conteúdo genérico não convence. Exemplos específicos e resultados reais criam percepção de valor' },
          { id: 's4', title: 'Revise com o olhar do avatar', description: 'Ao revisar, pergunte: "um iniciante consegue aplicar isso?" — se tiver jargão ou passos pulados, simplifique' },
        ]
      },
      {
        id: 'ip-t6',
        title: 'Design e produção do PDF',
        description: 'Transformar o conteúdo em um PDF visualmente profissional',
        priority: 'alta',
        difficulty: 'medio',
        estimatedTime: '1–2 dias',
        steps: [
          { id: 's1', title: 'Escolha um template no Canva', description: 'Busque "ebook" ou "report" no Canva — escolha um template limpo e profissional compatível com o tom do produto' },
          { id: 's2', title: 'Configure a identidade visual', description: 'Adapte as cores, fontes e logo do produto ao template — consistência visual = percepção de qualidade' },
          { id: 's3', title: 'Importe e formate o conteúdo', description: 'Cole o conteúdo seção por seção, ajuste tamanhos de fonte, espaçamentos e quebras de página' },
          { id: 's4', title: 'Adicione elementos visuais', description: 'Ícones, caixas de destaque, checklists visuais, tabelas — elementos gráficos aumentam percepção de valor' },
          { id: 's5', title: 'Exporte em PDF alta qualidade', description: 'Canva: Compartilhar > Baixar > PDF para impressão | Tamanho recomendado: A4 ou Letter' },
          { id: 's6', title: 'Teste em múltiplos dispositivos', description: 'Abra o PDF no celular, tablet e desktop — verifique se o texto está legível e as imagens não pixelaram' },
        ]
      },
      {
        id: 'ip-t7',
        title: 'Criar bônus para aumentar percepção de valor',
        description: 'Bônus bem pensados podem valer mais que o produto principal na mente do cliente',
        priority: 'media',
        difficulty: 'medio',
        estimatedTime: '1 dia',
        steps: [
          { id: 's1', title: 'Defina 2–3 bônus complementares', description: 'Bônus deve complementar o produto principal, não repetir. Ex: produto = plano de saúde, bônus = checklist de emergências veterinárias' },
          { id: 's2', title: 'Crie cada bônus rapidamente', description: 'Bônus não precisam ser longos — uma checklist de 1 página bem feita vale mais que um PDF de 50 páginas genérico' },
          { id: 's3', title: 'Atribua valor percebido a cada bônus', description: 'Na página de vendas: "Bônus 1: Checklist de Emergências (valor: $19) — GRÁTIS com seu pedido hoje"' },
        ]
      },
    ]
  },
  {
    id: 'ip-fase-3',
    title: 'Plataforma & entrega',
    description: 'Configurar onde e como o produto será vendido e entregue',
    order: 3,
    tasks: [
      {
        id: 'ip-t8',
        title: 'Cadastrar o produto na plataforma de vendas',
        description: 'Configurar o produto na Hotmart, Kiwify, Gumroad ou similar',
        priority: 'critica',
        difficulty: 'medio',
        estimatedTime: '1 hora',
        steps: [
          { id: 's1', title: 'Escolha a plataforma', description: 'Hotmart: melhor para Brasil, mais recursos | Kiwify: mais simples, taxa menor | Gumroad: melhor para mercado internacional' },
          { id: 's2', title: 'Crie o produto na plataforma', description: 'Nome, descrição, categoria, idioma, moeda e preço — use a descrição do produto como base para o copy' },
          { id: 's3', title: 'Faça upload do PDF e dos bônus', description: 'Suba todos os arquivos na seção de materiais do produto' },
          { id: 's4', title: 'Configure o e-mail automático de entrega', description: 'E-mail pós-compra com: saudação + o que o cliente recebeu + links de acesso + próximo passo claro' },
          { id: 's5', title: 'Configure a página de checkout', description: 'Adicione: logo, cores da marca, banner, descrição dos benefícios, selos de confiança e garantia' },
        ]
      },
      {
        id: 'ip-t9',
        title: 'Configurar order bump e upsell',
        description: 'Maximizar a receita por cliente sem aumentar o custo de aquisição',
        priority: 'critica',
        difficulty: 'medio',
        estimatedTime: '1 hora',
        steps: [
          { id: 's1', title: 'Defina o produto de order bump', description: 'Deve ser complementar e de preço baixo (adicional de $7–$17) — ex: versão PRO, suporte extra, template adicional' },
          { id: 's2', title: 'Configure o bump no checkout', description: 'Plataforma > Funil de Vendas > Order Bump | Copy: 1 linha de benefício + preço | Checkbox pré-marcado (se a plataforma permitir)' },
          { id: 's3', title: 'Crie a página de OTO pós-compra', description: 'Para quem não pegou o bump: oferta de 1 clique com benefício exclusivo e urgência real' },
          { id: 's4', title: 'Configure o downsell', description: 'Para quem recusa o OTO: oferta ainda menor (ex: só um dos componentes do PRO por preço ainda menor)' },
          { id: 's5', title: 'Teste o funil completo', description: 'Compra de teste com cupom 100% — verifique bump, OTO e downsell funcionando corretamente' },
        ]
      },
    ]
  },
  {
    id: 'ip-fase-4',
    title: 'Página de vendas',
    description: 'Criar a landing page de alta conversão',
    order: 4,
    tasks: [
      {
        id: 'ip-t10',
        title: 'Escrever o copy da página de vendas',
        description: 'O copy é o elemento mais importante da conversão — antes de qualquer design',
        priority: 'critica',
        difficulty: 'dificil',
        estimatedTime: '1 dia',
        steps: [
          { id: 's1', title: 'Escreva a headline principal', description: 'Fórmula: [resultado desejado] + [tempo/facilidade] + [para quem]. Ex: "O plano de saúde que seu pet nunca teve — feito especificamente para ele, em 2 minutos"' },
          { id: 's2', title: 'Escreva o subtítulo (amplifica a headline)', description: 'Expanda a proposta de valor: quem é, o que resolve, como é diferente. Máximo 2 linhas.' },
          { id: 's3', title: 'Escreva a seção de problema (emocional)', description: 'Agite a dor sem exagerar. Mostre que você entende a frustração do avatar melhor do que ele mesmo.' },
          { id: 's4', title: 'Escreva a seção de solução', description: 'Apresente o produto como a resposta óbvia ao problema. Liste os benefícios (não features) em bullets.' },
          { id: 's5', title: 'Escreva os depoimentos', description: 'Se não tem reais: colete de beta testers ou escreva baseado em resultados esperados com disclaimer. 3–5 depoimentos com foto/avatar.' },
          { id: 's6', title: 'Escreva a seção de garantia', description: '"Se em X dias você não ficar satisfeito, devolvemos 100% — sem perguntas." Coloque perto do CTA principal.' },
          { id: 's7', title: 'Escreva o FAQ (quebra objeções)', description: '6–8 perguntas respondendo as principais objeções do avatar. Cada resposta deve reforçar valor, não só responder.' },
        ]
      },
      {
        id: 'ip-t11',
        title: 'Construir a landing page',
        description: 'Transformar o copy em uma página funcional e visualmente profissional',
        priority: 'critica',
        difficulty: 'medio',
        estimatedTime: '1–2 dias',
        steps: [
          { id: 's1', title: 'Escolha o page builder', description: 'Lovable (React gerado por IA, melhor resultado visual) | Carrd ($19/ano, mais simples) | Webflow (mais controle)' },
          { id: 's2', title: 'Monte a estrutura das seções', description: 'Ordem: Hero > Problema > Solução/Benefícios > Como funciona (3 passos) > Prova social > Pricing > Garantia > FAQ > CTA final' },
          { id: 's3', title: 'Configure o sticky header com CTA', description: 'Header fixo com logo + botão de compra visível o tempo todo — aumenta cliques em 20–30%' },
          { id: 's4', title: 'Adicione selos de confiança', description: 'Garantia + Pagamento seguro + número de clientes — preferencialmente perto do botão de compra' },
          { id: 's5', title: 'Otimize para mobile', description: 'Mais de 70% do tráfego de info produto vem de celular — teste cada seção no iPhone e Android antes de publicar' },
          { id: 's6', title: 'Configure os links de CTA', description: 'Todos os botões devem apontar para a URL do checkout — use UTMs para rastrear de qual seção veio o clique' },
        ]
      },
    ]
  },
  {
    id: 'ip-fase-5',
    title: 'Legal & técnico',
    description: 'Configurações obrigatórias antes de subir tráfego',
    order: 5,
    tasks: [
      {
        id: 'ip-t12',
        title: 'Criar Política de Privacidade e Termos de Uso',
        description: 'Obrigatório para Meta Ads, Google Ads e pela própria plataforma de vendas',
        priority: 'alta',
        difficulty: 'facil',
        estimatedTime: '1 hora',
        steps: [
          { id: 's1', title: 'Use um gerador gratuito', description: 'privacypolicies.com, termsfeed.com ou iubenda.com — preencha os dados e gere os documentos em português' },
          { id: 's2', title: 'Inclua cláusulas do produto digital', description: 'Coleta de dados, política de reembolso (período da garantia), contato de suporte, uso da IA se aplicável' },
          { id: 's3', title: 'Crie as páginas no site', description: '/politica-privacidade e /termos-de-uso — páginas simples com o texto' },
          { id: 's4', title: 'Adicione links no footer e checkout', description: 'Footer da landing + seção de política no checkout (obrigatório na Hotmart para publicar o produto)' },
        ]
      },
      {
        id: 'ip-t13',
        title: 'Instalar Meta Pixel e configurar eventos',
        description: 'Sem Pixel instalado e eventos configurados, as campanhas do Meta não conseguem otimizar para compras',
        priority: 'critica',
        difficulty: 'medio',
        estimatedTime: '1 hora',
        steps: [
          { id: 's1', title: 'Crie o Pixel no Meta Business Manager', description: 'business.facebook.com > Gerenciador de Eventos > Pixel > Criar > copie o código base' },
          { id: 's2', title: 'Instale o código na landing page', description: 'Cole no <head> da landing, da página de obrigado e de qualquer página do funil' },
          { id: 's3', title: 'Configure os 3 eventos principais', description: 'ViewContent (landing carregou) | InitiateCheckout (clicou em comprar) | Purchase (página de obrigado carregou)' },
          { id: 's4', title: 'Verifique com Meta Pixel Helper', description: 'Instale a extensão no Chrome e acesse cada página para confirmar que os eventos disparam corretamente' },
          { id: 's5', title: 'Verifique e valide o domínio', description: 'Business Manager > Configurações > Domínios > adicione e verifique via metatag — obrigatório para rastrear compras' },
        ]
      },
      {
        id: 'ip-t14',
        title: 'Fazer compra de teste completa',
        description: 'Simular um cliente real do início ao fim antes de gastar qualquer dinheiro em tráfego',
        priority: 'critica',
        difficulty: 'facil',
        estimatedTime: '30 min',
        steps: [
          { id: 's1', title: 'Crie cupom de 100% desconto', description: 'Plataforma > Cupons > Criar > 100% de desconto > uso único > nome: TESTE-LANCAMENTO' },
          { id: 's2', title: 'Acesse a landing em aba anônima', description: 'Simule um visitante frio — verifique carregamento, design, textos e CTAs' },
          { id: 's3', title: 'Complete o fluxo completo', description: 'Clique em comprar > checkout > verifique bump > aplique cupom > finalize a compra' },
          { id: 's4', title: 'Verifique a entrega', description: 'O e-mail de confirmação chegou? O produto foi entregue? Os links funcionam? O PDF abre corretamente?' },
          { id: 's5', title: 'Verifique o Pixel', description: 'Com Pixel Helper aberto, confirme evento Purchase disparou na página de obrigado' },
        ]
      },
    ]
  },
  {
    id: 'ip-fase-6',
    title: 'Lançamento inicial',
    description: 'Primeiras vendas antes de investir em tráfego pago',
    order: 6,
    tasks: [
      {
        id: 'ip-t15',
        title: 'Lançamento para audiência própria (lista, stories, grupo)',
        description: 'Antes de pagar tráfego, extraia vendas da sua audiência orgânica — é de graça e valida o produto',
        priority: 'critica',
        difficulty: 'facil',
        estimatedTime: '1 dia',
        steps: [
          { id: 's1', title: 'Envie e-mail para sua lista (se tiver)', description: 'Assunto curiosidade + problema | Corpo: apresentação do produto + benefícios + CTA com link direto' },
          { id: 's2', title: 'Poste nos stories por 3–5 dias', description: 'Sequência: dia 1 = problema | dia 2 = solução | dia 3 = produto | dia 4 = prova social | dia 5 = CTA final' },
          { id: 's3', title: 'Poste em grupos do nicho', description: 'Não faça spam — contribua primeiro com valor, depois mencione o produto organicamente' },
          { id: 's4', title: 'Mensagem direta para contatos quentes', description: 'Identifique 10–20 pessoas que têm o problema que seu produto resolve e envie mensagem personalizada' },
          { id: 's5', title: 'Meta: 5–10 vendas no lançamento orgânico', description: 'Se não chegou em 5 vendas com audiência: revisar copy, preço ou posicionamento antes de ir para tráfego pago' },
        ]
      },
      {
        id: 'ip-t16',
        title: 'Coletar primeiros depoimentos',
        description: 'Prova social real é o ativo mais valioso para escalar com tráfego pago',
        priority: 'alta',
        difficulty: 'facil',
        estimatedTime: '1 semana',
        steps: [
          { id: 's1', title: 'Envie o produto para 3–5 beta testers grátis', description: 'Pessoas que têm o problema e dariam feedback honesto — ofereça acesso grátis em troca de depoimento' },
          { id: 's2', title: 'Envie e-mail de follow-up 3 dias após a compra', description: '"Como está sendo sua experiência com [produto]? Seu feedback é muito importante para nós"' },
          { id: 's3', title: 'Peça depoimento em formato específico', description: '"Pode nos contar: qual era sua situação antes, o que mais te surpreendeu no produto e qual resultado você está tendo?"' },
          { id: 's4', title: 'Adicione os depoimentos na landing page', description: 'Foto/avatar + nome + cidade + 2–3 linhas de depoimento — adicione na seção de prova social' },
        ]
      },
    ]
  },
  {
    id: 'ip-fase-7',
    title: 'Tráfego pago',
    description: 'Escalar as vendas com Meta Ads e TikTok Ads',
    order: 7,
    tasks: [
      {
        id: 'ip-t17',
        title: 'Criar os criativos para Meta Ads (3 ângulos)',
        description: 'Nunca suba um único criativo — testar ângulos diferentes é o que descobre o que converte',
        priority: 'critica',
        difficulty: 'medio',
        estimatedTime: '1 dia',
        steps: [
          { id: 's1', title: 'Criativo Ângulo 1 — Medo/Problema', description: 'Headline focada na dor + estatística + CTA urgente | Fundo escuro | Tom sério' },
          { id: 's2', title: 'Criativo Ângulo 2 — Desejo/Transformação', description: 'Headline focada no resultado desejado + visualização da transformação | Tom inspirador' },
          { id: 's3', title: 'Criativo Ângulo 3 — Praticidade/Velocidade', description: 'Headline focada na facilidade + 3 passos visuais + preço em destaque | Tom direto' },
          { id: 's4', title: 'Produza nos formatos corretos', description: '1080×1080px (feed) + 1080×1920px (stories/reels) para cada ângulo = 6 arquivos' },
          { id: 's5', title: 'Crie 1 vídeo UGC-style de 15–30s para TikTok', description: 'Hook nos primeiros 2s + problema + solução + CTA | Deve parecer orgânico, não anúncio' },
        ]
      },
      {
        id: 'ip-t18',
        title: 'Configurar e subir campanha de validação no Meta Ads',
        description: 'Campanha inicial para descobrir qual ângulo e público converte melhor',
        priority: 'critica',
        difficulty: 'medio',
        estimatedTime: '2 horas',
        steps: [
          { id: 's1', title: 'Crie a campanha com objetivo Vendas', description: 'Ads Manager > Criar > Vendas > Conversões do site > Evento: Purchase' },
          { id: 's2', title: 'Configure o público frio baseado no avatar', description: 'Interesses relacionados ao nicho | Idade do avatar | Brasil | Excluir: já compraram (lista de clientes)' },
          { id: 's3', title: 'Defina o orçamento de validação', description: '$20–30/dia por conjunto. Orçamento total de validação: $300–$500 (o suficiente para dados confiáveis)' },
          { id: 's4', title: 'Suba os 3 ângulos como anúncios separados', description: '1 campanha > 1 conjunto > 3 anúncios (1 por ângulo). O Meta otimiza automaticamente para o melhor.' },
          { id: 's5', title: 'Defina os benchmarks de decisão', description: 'CTR < 1%: trocar criativo | CPA > 3x o preço do produto: revisar landing | Conv. < 1%: revisar copy da landing' },
          { id: 's6', title: 'Não edite por 5–7 dias', description: 'O algoritmo precisa de 50 eventos para sair da fase de aprendizado — editar antes reinicia o processo' },
        ]
      },
      {
        id: 'ip-t19',
        title: 'Otimizar e escalar campanha vencedora',
        description: 'Após dados suficientes, escalar o que funciona e matar o que não funciona',
        priority: 'alta',
        difficulty: 'dificil',
        estimatedTime: '1–2 semanas',
        steps: [
          { id: 's1', title: 'Identifique o criativo vencedor', description: 'O de menor CPA com maior volume de conversões — esse é o que você vai escalar' },
          { id: 's2', title: 'Duplique o conjunto vencedor e aumente o orçamento em 20%', description: 'Nunca aumente mais de 20–30% por vez — aumentos bruscos reiniciam o aprendizado do algoritmo' },
          { id: 's3', title: 'Crie lookalike da lista de compradores', description: 'Suba a lista de clientes no Meta > crie público Lookalike 1% > duplique a campanha para esse público' },
          { id: 's4', title: 'Configure remarketing de abandono de checkout', description: 'Público: visitou a página de checkout mas não comprou nos últimos 7 dias > anúncio com urgência ou garantia' },
          { id: 's5', title: 'Crie variações do criativo vencedor', description: 'Mantenha o ângulo que funcionou mas teste: nova headline, nova imagem, novo CTA — otimização contínua' },
        ]
      },
    ]
  },
  {
    id: 'ip-fase-8',
    title: 'Escala & otimização',
    description: 'Aumentar receita sem aumentar proporcionalmente os custos',
    order: 8,
    tasks: [
      {
        id: 'ip-t20',
        title: 'Otimizar o funil com base nos dados reais',
        description: 'Com dados reais de 50–100 vendas, otimizar cada etapa do funil',
        priority: 'alta',
        difficulty: 'medio',
        estimatedTime: '1 semana',
        steps: [
          { id: 's1', title: 'Analise a taxa de conversão da landing', description: 'Se < 2%: testar nova headline, novo hero, novo CTA. Use Google Optimize ou Hotjar para heatmap.' },
          { id: 's2', title: 'Analise a taxa do order bump', description: 'Meta: >25%. Se < 15%: reescrever o copy do bump, mudar o preço ou o produto oferecido.' },
          { id: 's3', title: 'Analise a taxa do OTO', description: 'Meta: >20%. Se < 10%: revisar a oferta, o preço ou o timing de exibição.' },
          { id: 's4', title: 'Calcule o LTV médio por cliente', description: 'LTV = valor médio do pedido (com bump/OTO) × recompra estimada. Com esse número, saberá quanto pode pagar de CPA.' },
          { id: 's5', title: 'Adicione novos depoimentos mensalmente', description: 'Prova social é ativo crescente — cada novo depoimento real aumenta a taxa de conversão da landing' },
        ]
      },
      {
        id: 'ip-t21',
        title: 'Criar sequência de e-mail de reativação e upsell',
        description: 'A lista de clientes é o ativo mais valioso — monetize sem custo de aquisição extra',
        priority: 'alta',
        difficulty: 'medio',
        estimatedTime: '2 dias',
        steps: [
          { id: 's1', title: 'Crie e-mail de resultado (30 dias pós-compra)', description: '"Você está tendo resultados com [produto]?" + dica bônus + convite para depoimento' },
          { id: 's2', title: 'Crie oferta de produto complementar para clientes', description: 'Lança o próximo produto para sua base de clientes com desconto exclusivo — taxa de conversão 5–10x maior que público frio' },
          { id: 's3', title: 'Configure automação de carrinho abandonado', description: 'Quem iniciou checkout mas não completou: e-mail em 1h + e-mail em 24h com urgência ou desconto' },
          { id: 's4', title: 'Crie programa de afiliados', description: 'Hotmart/Kiwify: configure comissão de 30–50% para afiliados. Alcance sem custo fixo de mídia.' },
        ]
      },
    ]
  },
])

export const saasTemplate = fillPhases([
  {
    id: 'saas-fase-1',
    title: 'Descoberta & validação',
    description: 'Validar o problema e a disposição de pagar antes de escrever código',
    order: 1,
    tasks: [
      {
        id: 'saas-t1',
        title: 'Definir o problema central a resolver',
        description: 'SaaS que tenta resolver tudo não resolve nada — foco em 1 problema específico',
        priority: 'critica',
        difficulty: 'medio',
        estimatedTime: '1 dia',
        steps: [
          { id: 's1', title: 'Escreva o problema em 1 frase', description: 'Formato: "[Quem] precisa de [o quê] quando [situação] mas [obstáculo atual]". Ex: "Freelancers precisam proposta em minutos quando ganham um lead mas perdem tempo com templates genéricos"' },
          { id: 's2', title: 'Valide que o problema é frequente', description: 'O problema acontece diariamente (melhor) ou semanalmente (ok) com o avatar? Problemas mensais raramente justificam assinatura.' },
          { id: 's3', title: 'Valide que o problema é caro de não resolver', description: 'Quanto tempo, dinheiro ou oportunidade o avatar perde por não ter sua solução? Quanto maior o custo da dor, maior o preço que pagará.' },
          { id: 's4', title: 'Pesquise soluções existentes', description: 'Liste os 5 maiores concorrentes diretos e indiretos. Qual é o "trabalho" que o cliente está tentando fazer com eles?' },
          { id: 's5', title: 'Identifique o gap de mercado', description: 'O que os concorrentes fazem mal, ignoram ou cobram caro demais? Esse gap é onde você entra.' },
        ]
      },
      {
        id: 'saas-t2',
        title: 'Realizar 10 entrevistas com clientes potenciais',
        description: 'Conversas reais revelam verdades que nenhuma pesquisa de mercado consegue',
        priority: 'critica',
        difficulty: 'medio',
        estimatedTime: '1–2 semanas',
        steps: [
          { id: 's1', title: 'Encontre 10 pessoas que têm o problema', description: 'LinkedIn, grupos do Facebook/Slack, comunidades do nicho, sua rede pessoal — foco em quem já tenta resolver o problema de alguma forma' },
          { id: 's2', title: 'Faça entrevistas de 20–30 minutos', description: 'NÃO apresente seu produto — faça perguntas sobre o problema: "Como você resolve hoje?" "Quanto tempo gasta?" "O que é mais frustrante?"' },
          { id: 's3', title: 'Documente as respostas', description: 'Grave (com permissão) ou anote literalmente o que disseram — as palavras exatas dos entrevistados viram o copy da sua landing page' },
          { id: 's4', title: 'Identifique padrões', description: 'Quais frustrações apareceram em 5+ entrevistas? Esses são os problemas reais, não os que você assumiu' },
          { id: 's5', title: 'Pergunte sobre disposição de pagar', description: '"Se existisse uma ferramenta que resolvesse X em Y tempo, quanto você pagaria por mês?" — anote o número sem sugerir' },
        ]
      },
      {
        id: 'saas-t3',
        title: 'Definir o modelo de precificação',
        description: 'SaaS tem nuances de pricing que impactam diretamente a conversão e o churn',
        priority: 'critica',
        difficulty: 'medio',
        estimatedTime: '1 dia',
        steps: [
          { id: 's1', title: 'Escolha a métrica de valor (value metric)', description: 'O que cresce junto com o valor que o cliente extrai? Ex: número de usuários, projetos, contatos, chamadas, GB armazenados' },
          { id: 's2', title: 'Defina os planos (tipicamente 3)', description: 'Starter: para testar | Growth: para crescer (plano âncora) | Pro/Business: para escalar. Plano do meio deve ter o melhor custo-benefício.' },
          { id: 's3', title: 'Considere plano freemium ou trial', description: 'Freemium: traz volume, converte menos. Trial de 14 dias: converte melhor, exige mais do onboarding. Escolha baseado no CAC que consegue sustentar.' },
          { id: 's4', title: 'Defina pricing anual com desconto', description: 'Ofereça 20–30% de desconto no plano anual — melhora o fluxo de caixa e reduz o churn dramatically' },
        ]
      },
    ]
  },
  {
    id: 'saas-fase-2',
    title: 'MVP — Produto Mínimo Viável',
    description: 'Construir o mínimo que entrega o valor central',
    order: 2,
    tasks: [
      {
        id: 'saas-t4',
        title: 'Definir o escopo do MVP (o que NÃO fazer)',
        description: 'MVP é sobre cortar, não sobre adicionar — a maioria falha por construir demais',
        priority: 'critica',
        difficulty: 'medio',
        estimatedTime: '1 dia',
        steps: [
          { id: 's1', title: 'Liste todas as features que imaginou', description: 'Brain dump completo — tudo que você quer que o produto faça no futuro' },
          { id: 's2', title: 'Identifique o "core job" — a 1 coisa que resolve o problema central', description: 'Se o usuário só pudesse fazer UMA coisa na sua ferramenta, qual seria a que resolve o problema principal?' },
          { id: 's3', title: 'Classifique cada feature: Must/Should/Could/Wont', description: 'Must: sem isso não funciona | Should: importante mas não crítico | Could: nice-to-have | Wont: cortar do MVP' },
          { id: 's4', title: 'Defina o escopo final do MVP', description: 'Apenas os "Must" — o MVP deve ser lançável em 4–8 semanas. Se demorar mais, está grande demais.' },
          { id: 's5', title: 'Documente o roadmap pós-MVP', description: 'Tudo que cortou vai para o roadmap — isso vira o argumento de venda do plano Pro e da assinatura anual' },
        ]
      },
      {
        id: 'saas-t5',
        title: 'Definir a stack tecnológica',
        description: 'A escolha da stack impacta velocidade de desenvolvimento, custos de infra e capacidade de contratar',
        priority: 'critica',
        difficulty: 'dificil',
        estimatedTime: '1 dia',
        steps: [
          { id: 's1', title: 'Frontend', description: 'React + Next.js (mais comum, melhor ecossistema) | Vue + Nuxt (mais simples) | Escolha o que você ou seu dev já conhece' },
          { id: 's2', title: 'Backend / BaaS', description: 'Supabase (PostgreSQL + Auth + Storage, open source, gratuito para iniciar) | Firebase (Google, mais simples) | PlanetScale + Vercel (serverless)' },
          { id: 's3', title: 'Autenticação', description: 'Clerk (melhor DX, $25/mês depois de 10k MAU) | NextAuth (open source, mais configuração) | Supabase Auth (grátis, integrado)' },
          { id: 's4', title: 'Pagamentos', description: 'Stripe (padrão global, 2.9%+$0.30) | Hotmart/Kiwify (se mercado BR, mais fácil) | LemonSqueezy (Stripe mas simplificado)' },
          { id: 's5', title: 'Hospedagem', description: 'Vercel (frontend Next.js, DX excelente) + Railway/Render (backend, mais barato que AWS) | Começar aqui, migrar para AWS quando escalar' },
        ]
      },
      {
        id: 'saas-t6',
        title: 'Desenvolver o MVP',
        description: 'Construir as features essenciais com qualidade suficiente para vender',
        priority: 'critica',
        difficulty: 'dificil',
        estimatedTime: '4–8 semanas',
        steps: [
          { id: 's1', title: 'Configure o repositório e ambiente de desenvolvimento', description: 'GitHub > criar repo > configurar branches (main, develop) > README com setup instructions' },
          { id: 's2', title: 'Implemente autenticação primeiro', description: 'Login/signup/forgot password + proteção de rotas — nada mais funciona sem isso. Use Clerk ou Supabase Auth.' },
          { id: 's3', title: 'Construa o core feature', description: 'A feature principal que resolve o problema central — foque aqui, não se perca em detalhes de UI ainda' },
          { id: 's4', title: 'Implemente o onboarding básico', description: 'O usuário que acabou de criar conta precisa chegar ao "momento aha" em menos de 5 minutos. Projete esse caminho.' },
          { id: 's5', title: 'Integre o sistema de pagamento', description: 'Stripe: webhook de pagamento confirmado > ativa o plano do usuário no banco de dados > e-mail de confirmação' },
          { id: 's6', title: 'Deploy em produção', description: 'Configure CI/CD básico: push para main = deploy automático. Sem isso, cada deploy é estressante e lento.' },
        ]
      },
    ]
  },
  {
    id: 'saas-fase-3',
    title: 'Primeiros usuários & produto-market fit',
    description: 'Encontrar os primeiros 10 clientes pagantes e iterar rapidamente',
    order: 3,
    tasks: [
      {
        id: 'saas-t7',
        title: 'Conseguir os primeiros 10 clientes manualmente',
        description: 'Não existe atalho para os primeiros 10 — é trabalho manual e direto',
        priority: 'critica',
        difficulty: 'medio',
        estimatedTime: '2–4 semanas',
        steps: [
          { id: 's1', title: 'Ofereça acesso beta gratuito por 30 dias', description: 'Para os entrevistados e sua rede — troca: usar e dar feedback honesto. NÃO ofereça grátis para sempre.' },
          { id: 's2', title: 'Onboarde cada cliente manualmente', description: 'Ligação ou videochamada de 30 minutos com cada beta user — configure junto, explique, entenda as dúvidas' },
          { id: 's3', title: 'Faça check-in semanal com cada um', description: '"Como está indo? O que está funcionando? O que travou? O que mudaria?" — esse feedback é ouro' },
          { id: 's4', title: 'Converta para pago após 30 dias', description: '"Seu período beta encerrou. Estamos lançando o plano pago — para você que foi beta, temos um desconto de X%"' },
          { id: 's5', title: 'Meta: 5 de 10 convertidos para pago', description: 'Se < 50% quiseram pagar após usar: o produto ou o preço precisam de revisão antes de escalar' },
        ]
      },
      {
        id: 'saas-t8',
        title: 'Medir e reduzir o churn',
        description: 'Churn alto mata SaaS — descobrir por que pessoas cancelam é tão importante quanto adquirir novos',
        priority: 'critica',
        difficulty: 'medio',
        estimatedTime: 'contínuo',
        steps: [
          { id: 's1', title: 'Configure tracking de uso com Mixpanel ou Amplitude', description: 'Quais features são mais usadas? Quem usa mais (clientes que ficam) vs. menos (clientes que cancelam)?' },
          { id: 's2', title: 'Envie e-mail de cancelamento com pesquisa', description: 'Quando alguém cancela: e-mail automático perguntando o motivo — 4 opções + campo aberto. Leia todos.' },
          { id: 's3', title: 'Identifique o "momento aha" do produto', description: 'Qual ação/resultado faz o usuário perceber o valor? Quantos dias leva para chegar lá? Otimize o onboarding para esse momento.' },
          { id: 's4', title: 'Implemente e-mails de ativação', description: 'Usuário não usou em 3 dias: e-mail de "aqui está o que você pode fazer" | Não usou em 7 dias: e-mail de suporte proativo' },
        ]
      },
    ]
  },
  {
    id: 'saas-fase-4',
    title: 'Aquisição & crescimento',
    description: 'Criar canais de aquisição previsíveis e escaláveis',
    order: 4,
    tasks: [
      {
        id: 'saas-t9',
        title: 'Construir a landing page de alta conversão',
        description: 'A landing page é a porta de entrada — cada elemento deve reduzir objeções e aumentar desejo',
        priority: 'critica',
        difficulty: 'dificil',
        estimatedTime: '1 semana',
        steps: [
          { id: 's1', title: 'Headline: resultado específico em tempo específico', description: 'Ex: "Crie propostas comerciais profissionais em 3 minutos — sem templates genéricos"' },
          { id: 's2', title: 'Subheadline: para quem é e o que resolve', description: 'Ex: "Para freelancers e agências que perdem tempo com propostas e querem fechar mais contratos"' },
          { id: 's3', title: 'Hero com demo/screenshot real do produto', description: 'GIF ou screenshot do produto em uso — o visitante precisa ver o produto funcionando acima da dobra' },
          { id: 's4', title: 'Social proof imediato', description: 'Logos de empresas clientes | número de usuários | estrelas de avaliação — logo abaixo do hero' },
          { id: 's5', title: 'Pricing transparente', description: 'Nunca esconda o preço — usuários que veem o preço e ficam convertem melhor. Destaque o plano do meio.' },
          { id: 's6', title: 'Trial ou freemium sem cartão', description: 'Se possível: "Comece grátis — sem cartão de crédito". Reduz a barreira de entrada drasticamente.' },
        ]
      },
      {
        id: 'saas-t10',
        title: 'Definir e executar o canal de aquisição principal',
        description: 'Foco em 1 canal até dominar — tentar tudo ao mesmo tempo não funciona para SaaS early stage',
        priority: 'critica',
        difficulty: 'dificil',
        estimatedTime: '1–3 meses',
        steps: [
          { id: 's1', title: 'SEO (melhor para B2B com ciclo de compra longo)', description: 'Identifique keywords de intenção de compra ("melhor software para X", "alternativa ao Y") | Crie páginas de comparação e landing pages por keyword' },
          { id: 's2', title: 'Content Marketing (melhor para construir autoridade)', description: 'Blog com conteúdo que resolve problemas do avatar | SEO de cauda longa | Cada post captura e-mails com lead magnet' },
          { id: 's3', title: 'LinkedIn Outbound (melhor para B2B)', description: 'Perfil otimizado + conexões com ICP + sequência de mensagens de valor (não spam) + convite para trial' },
          { id: 's4', title: 'Product Hunt / Hacker News (melhor para lançamento)', description: 'Lançamento na Product Hunt: preparar com antecedência, conseguir upvoters, post às 00:01 PST' },
          { id: 's5', title: 'Google Ads (search intent, mais caro mas qualificado)', description: 'Keywords de alta intenção: "software para X", "ferramenta de Y" | Menor volume que Meta Ads mas conversão muito maior' },
        ]
      },
    ]
  },
  {
    id: 'saas-fase-5',
    title: 'Escala & operações',
    description: 'Escalar de forma sustentável sem quebrar o produto ou o time',
    order: 5,
    tasks: [
      {
        id: 'saas-t11',
        title: 'Construir o funil de customer success',
        description: 'Em SaaS, reter é mais barato que adquirir — investir em CS reduz churn e aumenta expansão',
        priority: 'alta',
        difficulty: 'dificil',
        estimatedTime: '1 mês',
        steps: [
          { id: 's1', title: 'Defina o onboarding automatizado', description: 'Sequência de e-mails de ativação nos primeiros 14 dias guiando o usuário para o "momento aha"' },
          { id: 's2', title: 'Implemente NPS periódico', description: 'A cada 90 dias: "De 0 a 10, você recomendaria?" | Score < 7: e-mail de resgate imediato' },
          { id: 's3', title: 'Crie base de conhecimento (help center)', description: 'Intercom, Notion público ou GitBook — documentação reduz tickets de suporte em 40–60%' },
          { id: 's4', title: 'Configure alertas de churn risk', description: 'Usuário que não loga há 7 dias: alerta interno + e-mail automático de reengajamento' },
          { id: 's5', title: 'Implemente expansion revenue', description: 'Ofereça upgrades no momento de valor: "Você atingiu o limite do plano Starter — faça upgrade para continuar"' },
        ]
      },
      {
        id: 'saas-t12',
        title: 'Atingir e monitorar as métricas de saúde do SaaS',
        description: 'SaaS saudável tem métricas específicas — monitorar semanalmente é obrigatório',
        priority: 'critica',
        difficulty: 'medio',
        estimatedTime: 'contínuo',
        steps: [
          { id: 's1', title: 'MRR (Monthly Recurring Revenue)', description: 'Meta: crescer 10–15% ao mês no early stage. Calcule: soma de todas as assinaturas mensais ativas' },
          { id: 's2', title: 'Churn Rate mensal', description: 'Meta: < 2% ao mês (< 5% é aceitável no início). Churn > 5% = problema de produto ou de fit.' },
          { id: 's3', title: 'CAC (Customer Acquisition Cost)', description: 'Total gasto em marketing e vendas / novos clientes. Para ser saudável: CAC < LTV / 3' },
          { id: 's4', title: 'LTV (Lifetime Value)', description: 'ARPU mensal / Churn Rate. Ex: $50/mês / 3% churn = LTV de $1.667' },
          { id: 's5', title: 'NRR (Net Revenue Retention)', description: 'Meta: > 100%. Significa que receita de clientes existentes cresce mesmo sem novos clientes — o sinal de product-market fit.' },
        ]
      },
    ]
  },
])

export const cursoTemplate = fillPhases([
  {
    id: 'curso-fase-1',
    title: 'Posicionamento & validação',
    description: 'Definir o curso com clareza e validar antes de gravar qualquer aula',
    order: 1,
    tasks: [
      {
        id: 'curso-t1',
        title: 'Definir a transformação prometida pelo curso',
        description: 'Cursos vendem transformação, não conteúdo — a promessa define tudo',
        priority: 'critica',
        difficulty: 'facil',
        estimatedTime: '2 horas',
        steps: [
          { id: 's1', title: 'Complete a frase: "No final deste curso, o aluno conseguirá..."', description: 'Seja específico: "criar e subir campanhas de Meta Ads que geram ROI positivo" (não "aprender marketing digital")' },
          { id: 's2', title: 'Defina o ponto de partida do aluno ideal', description: 'Iniciante completo? Intermediário que quer avançar? Profissional que quer nichar? Quanto mais específico, mais fácil vender.' },
          { id: 's3', title: 'Valide a promessa com 10 pessoas do nicho', description: '"Se existisse um curso que te levasse de X para Y em Z semanas, você compraria? Quanto pagaria?" — respostas honestas antes de criar.' },
          { id: 's4', title: 'Verifique a concorrência', description: 'Quais cursos similares existem? Qual o preço médio? Qual a reclamação mais comum nos reviews negativos? Seu curso resolve essa reclamação?' },
        ]
      },
      {
        id: 'curso-t2',
        title: 'Fazer pré-venda antes de gravar',
        description: 'A pré-venda valida a demanda E financia a produção — venda primeiro, grave depois',
        priority: 'critica',
        difficulty: 'medio',
        estimatedTime: '1–2 semanas',
        steps: [
          { id: 's1', title: 'Crie uma página de pré-venda simples', description: 'Landing page com: promessa + módulos planejados + bônus + preço de early bird (20–30% desconto) + data de lançamento' },
          { id: 's2', title: 'Defina a meta mínima de pré-venda', description: 'Ex: 30 alunos a $197 = $5.910. Se atingir em 7 dias: produz o curso. Se não: refina ou pivota.' },
          { id: 's3', title: 'Lance para audiência própria primeiro', description: 'E-mail, stories, posts — explique que é pré-venda, seja transparente sobre o cronograma de entrega' },
          { id: 's4', title: 'Abra para tráfego pago se necessário', description: 'Se audiência própria não atingiu a meta: campanha de Meta Ads para a landing de pré-venda' },
          { id: 's5', title: 'Entregue um módulo ao vivo antes de gravar', description: 'Live com os alunos da pré-venda — valida o conteúdo, coleta dúvidas reais e gera testemunhos antes do lançamento oficial' },
        ]
      },
    ]
  },
  {
    id: 'curso-fase-2',
    title: 'Produção do conteúdo',
    description: 'Roteirizar, gravar e editar o curso com qualidade profissional',
    order: 2,
    tasks: [
      {
        id: 'curso-t3',
        title: 'Criar o currículo completo do curso',
        description: 'Estrutura pedagógica que leva o aluno do ponto A ao ponto B de forma lógica',
        priority: 'critica',
        difficulty: 'medio',
        estimatedTime: '2 dias',
        steps: [
          { id: 's1', title: 'Liste todos os tópicos necessários para a transformação', description: 'Brain dump de tudo que o aluno precisa aprender — sem filtrar ainda' },
          { id: 's2', title: 'Organize em módulos sequenciais', description: 'Cada módulo = 1 habilidade ou conceito. O aluno deve conseguir aplicar algo após cada módulo.' },
          { id: 's3', title: 'Defina as aulas de cada módulo (5–10 min cada)', description: 'Aulas curtas convertem melhor em resultados — preferível 10 aulas de 8min que 4 aulas de 20min' },
          { id: 's4', title: 'Adicione exercícios práticos', description: 'Cada módulo deve ter 1 exercício aplicável — o que o aluno faz com o que aprendeu? Isso gera o resultado.' },
          { id: 's5', title: 'Planeje os materiais complementares', description: 'Worksheets, templates, checklists, swipe files — materiais práticos aumentam percepção de valor e conclusão do curso' },
        ]
      },
      {
        id: 'curso-t4',
        title: 'Configurar o setup de gravação',
        description: 'Qualidade de áudio > qualidade de vídeo. Aluno tolera vídeo ruim mas não tolera áudio ruim.',
        priority: 'alta',
        difficulty: 'medio',
        estimatedTime: '1 dia',
        steps: [
          { id: 's1', title: 'Microfone (prioridade #1)', description: 'Mínimo: Blue Snowball ($70) | Bom: Rode NT-USB ($170) | Profissional: Shure SM7B + interface ($400+). NÃO use fone de ouvido.' },
          { id: 's2', title: 'Câmera (prioridade #2)', description: 'iPhone/Android recente filmando em 1080p já é suficiente | Sony ZV-E10 ($750) para um nível acima | Logitech C920 para webcam' },
          { id: 's3', title: 'Iluminação', description: 'Ring light de 18" ($50–100) posicionada na frente do rosto | Ou luz natural de janela lateral — elimina sombras duras' },
          { id: 's4', title: 'Fundo', description: 'Fundo liso e simples (parede, bookshelf organizado) | Fundo virtual só se câmera e iluminação forem boas — fundo virtual ruim = amador' },
          { id: 's5', title: 'Software de gravação', description: 'Screencasts: Loom (grátis, prático) ou OBS (grátis, mais controle) | Edição: DaVinci Resolve (grátis) ou CapCut' },
        ]
      },
      {
        id: 'curso-t5',
        title: 'Gravar e editar todas as aulas',
        description: 'Produção consistente: gravar em blocos, editar em blocos',
        priority: 'critica',
        difficulty: 'dificil',
        estimatedTime: '2–4 semanas',
        steps: [
          { id: 's1', title: 'Escreva roteiros ou tópicos para cada aula', description: 'Não precisa ser script palavra por palavra — tópicos principais são suficientes para quem fala bem. Scripts para quem trava na câmera.' },
          { id: 's2', title: 'Grave em blocos (2–4 horas por sessão)', description: 'Grave um módulo inteiro por sessão — consistência de energia e iluminação. Aqueça a voz antes de começar.' },
          { id: 's3', title: 'Faça edição mínima e funcional', description: 'Corte silêncios longos, erros óbvios e vícios de linguagem. Adicione: intro/outro do módulo, lower thirds com seu nome, slides quando necessário.' },
          { id: 's4', title: 'Exporte nas configurações corretas', description: 'H.264, 1080p, 24fps, bitrate ~8Mbps — equilíbrio entre qualidade e tamanho de arquivo para upload' },
        ]
      },
    ]
  },
  {
    id: 'curso-fase-3',
    title: 'Plataforma & hospedagem',
    description: 'Escolher e configurar onde o curso ficará disponível',
    order: 3,
    tasks: [
      {
        id: 'curso-t6',
        title: 'Escolher e configurar a plataforma de cursos',
        description: 'A plataforma determina a experiência do aluno e suas taxas e controle',
        priority: 'critica',
        difficulty: 'medio',
        estimatedTime: '1–2 dias',
        steps: [
          { id: 's1', title: 'Avalie as opções principais', description: 'Hotmart: melhor para BR, integrado com afiliados | Teachable/Thinkific: mais profissional, melhor UX | Kajabi: all-in-one caro | Kiwify: simples e barato' },
          { id: 's2', title: 'Configure a área de membros', description: 'Upload de todas as aulas, organize por módulos, adicione materiais complementares em cada aula' },
          { id: 's3', title: 'Configure acesso e progressão', description: 'Acesso liberado de uma vez ou por semana (drip content)? Para iniciantes: liberado aos poucos reduz sobrecarga' },
          { id: 's4', title: 'Configure certificado de conclusão', description: 'Adicione certificate de conclusão automático — alunos amam e compartilham nas redes, gerando tráfego orgânico' },
          { id: 's5', title: 'Configure a comunidade (opcional)', description: 'Grupo no Discord, Telegram ou Circle para alunos — comunidade ativa reduz churn e aumenta o LTV' },
        ]
      },
    ]
  },
  {
    id: 'curso-fase-4',
    title: 'Lançamento & vendas',
    description: 'Estratégia de lançamento para máximo impacto nas primeiras semanas',
    order: 4,
    tasks: [
      {
        id: 'curso-t7',
        title: 'Executar o lançamento (PLF ou lançamento semente)',
        description: 'Lançamento estruturado gera 10x mais vendas que simplesmente "abrir o carrinho"',
        priority: 'critica',
        difficulty: 'dificil',
        estimatedTime: '2 semanas',
        steps: [
          { id: 's1', title: 'Semana -2: Aquecimento (CPL)', description: 'Conteúdo gratuito de valor sobre o tema do curso — posts, reels, lives. Objetivo: crescer a lista de interessados.' },
          { id: 's2', title: 'Semana -1: Série de conteúdo (3 peças)', description: 'Peça 1: o problema (a maior dor do avatar) | Peça 2: a solução (a framework do curso) | Peça 3: prova (resultados possíveis)' },
          { id: 's3', title: 'Dia do lançamento: abrir o carrinho', description: 'E-mail para lista + posts em todas as redes + stories de 24h + lives de lançamento se possível' },
          { id: 's4', title: 'Carrinho aberto por 5–7 dias', description: 'E-mail diário durante o carrinho: dia 1 = abertura | dia 3 = prova social | dia 5 = FAQ | dia 7 = urgência (últimas horas)' },
          { id: 's5', title: 'Fechamento com urgência real', description: 'Preço sobe após a data | Bônus saem | Vagas encerram — urgência artificial destrói credibilidade. Use urgência real.' },
        ]
      },
      {
        id: 'curso-t8',
        title: 'Criar máquina de vendas evergreen',
        description: 'Após o lançamento, criar funil automático que vende o curso continuamente',
        priority: 'alta',
        difficulty: 'dificil',
        estimatedTime: '1 semana',
        steps: [
          { id: 's1', title: 'Crie um webinar ou aula gratuita gravada', description: '60–90 minutos entregando valor real + apresentação do curso no final — converte 5–15% dos participantes' },
          { id: 's2', title: 'Configure funil de e-mail para o webinar', description: 'Inscrição > e-mail de confirmação > lembrete 1 hora antes > replay por 48h > sequência de vendas de 5 e-mails' },
          { id: 's3', title: 'Suba tráfego pago para o webinar', description: 'Meta Ads para inscrição no webinar grátis — CAC menor que para compra direta, qualifica melhor o lead' },
          { id: 's4', title: 'Adicione deadline artificial (Deadline Funnel)', description: 'Cada pessoa que se inscreve tem 7 dias de acesso ao preço especial — urgência personalizada e real' },
        ]
      },
    ]
  },
])

export const mentoriaTemplate = fillPhases([
  {
    id: 'ment-fase-1',
    title: 'Posicionamento & oferta',
    description: 'Definir exatamente o que você entrega, para quem e por quanto',
    order: 1,
    tasks: [
      {
        id: 'ment-t1',
        title: 'Definir o nicho e o resultado entregue',
        description: 'Mentoria genérica não vende — quanto mais específico o resultado, mais alto o preço',
        priority: 'critica',
        difficulty: 'medio',
        estimatedTime: '1 dia',
        steps: [
          { id: 's1', title: 'Defina seu posicionamento em 1 frase', description: 'Formato: "Eu ajudo [quem específico] a [resultado específico] em [tempo/condição]". Ex: "Ajudo nutricionistas a faturar $10k/mês com atendimentos online em 90 dias"' },
          { id: 's2', title: 'Valide que você tem credenciais para entregar o resultado', description: 'Você mesmo já fez o que promete? Tem cases de quem você ajudou? Credibilidade é pré-requisito em mentoria.' },
          { id: 's3', title: 'Defina o formato', description: 'Individual (maior preço, mais intenso) | Grupo de 5–15 pessoas (escalável, mais acessível) | Mastermind (peer-to-peer, você facilita)' },
          { id: 's4', title: 'Defina a duração e frequência', description: '3 meses: suficiente para resultado tangível | 1 sessão/semana de 60–90min: frequência ideal para acompanhamento | Suporte via WhatsApp entre sessões: diferencial importante' },
        ]
      },
      {
        id: 'ment-t2',
        title: 'Definir o preço da mentoria',
        description: 'Mentoria é high ticket — precificar corretamente define a qualidade dos alunos',
        priority: 'critica',
        difficulty: 'medio',
        estimatedTime: '2 horas',
        steps: [
          { id: 's1', title: 'Calcule o valor entregue (ROI do cliente)', description: 'Se a mentoria ajuda o cliente a faturar $5k/mês a mais, cobrar $3k pelo programa de 3 meses é ROI óbvio.' },
          { id: 's2', title: 'Pesquise o mercado', description: 'Quanto cobram mentorias similares no seu nicho? Você pode cobrar mais se tiver mais resultados ou autoridade.' },
          { id: 's3', title: 'Defina o preço e as condições', description: 'À vista com desconto + parcelado em cartão. Ex: $3.000 à vista ou 6x $550. O parcelado deve custar mais.' },
          { id: 's4', title: 'Não comece baixo demais', description: 'Preço baixo atrai clientes que não valorizam e geram mais trabalho. Melhor 5 clientes a $3k que 15 a $500.' },
        ]
      },
    ]
  },
  {
    id: 'ment-fase-2',
    title: 'Estrutura do programa',
    description: 'Criar o programa de mentoria com metodologia clara',
    order: 2,
    tasks: [
      {
        id: 'ment-t3',
        title: 'Criar a metodologia do programa',
        description: 'Mentoria sem metodologia é consultoria cara — estrutura é o que justifica o preço',
        priority: 'critica',
        difficulty: 'dificil',
        estimatedTime: '2–3 dias',
        steps: [
          { id: 's1', title: 'Mapeie o caminho do resultado (framework)', description: 'Quais são os 5–8 passos que levam o cliente do ponto A ao resultado? Esse framework deve ter nome — se torna sua propriedade intelectual.' },
          { id: 's2', title: 'Defina o que acontece em cada sessão', description: 'Semana 1: diagnóstico e metas | Semana 2–4: fundação | Semana 5–8: implementação | Semana 9–12: escala e sustentação' },
          { id: 's3', title: 'Crie materiais de suporte', description: 'Worksheets de cada sessão | Templates | Gravações de sessões anteriores (anonimizadas) | Recursos complementares' },
          { id: 's4', title: 'Defina as regras de engajamento', description: 'Horários disponíveis | Como funciona o suporte entre sessões | Política de faltas | O que esperar do cliente (homework)' },
        ]
      },
    ]
  },
  {
    id: 'ment-fase-3',
    title: 'Aquisição de clientes',
    description: 'Encontrar e fechar os primeiros clientes de mentoria',
    order: 3,
    tasks: [
      {
        id: 'ment-t4',
        title: 'Construir autoridade e presença digital',
        description: 'Clientes de mentoria high ticket compram do especialista, não de desconhecidos',
        priority: 'critica',
        difficulty: 'dificil',
        estimatedTime: '1–3 meses',
        steps: [
          { id: 's1', title: 'Escolha 1–2 canais de conteúdo e seja consistente', description: 'LinkedIn (B2B) | Instagram (B2C) | YouTube (longo prazo, mais conversão) — qualidade > quantidade. 3 posts/semana > 1 post/dia ruim.' },
          { id: 's2', title: 'Compartilhe cases de resultados regularmente', description: 'Antes e depois de clientes (com permissão) | Resultados específicos e mensuráveis | Stories de acompanhamento em tempo real' },
          { id: 's3', title: 'Produza conteúdo que demonstra a metodologia', description: 'Aulas gratuitas sobre os passos do seu framework — quem aplica e tem resultado vira cliente' },
          { id: 's4', title: 'Apareça em podcasts e eventos do nicho', description: 'Pedido de participação em podcasts do nicho — maior credibilidade e alcance de audiência qualificada' },
        ]
      },
      {
        id: 'ment-t5',
        title: 'Criar e otimizar o processo de vendas',
        description: 'Mentoria high ticket vende por conversa, não por página de vendas',
        priority: 'critica',
        difficulty: 'medio',
        estimatedTime: '1 semana',
        steps: [
          { id: 's1', title: 'Crie uma call de diagnóstico (30–45 min)', description: 'Chamada gratuita onde você diagnostica o problema do prospecto e apresenta sua solução — taxa de conversão: 20–40%' },
          { id: 's2', title: 'Crie uma página de aplicação', description: 'Formulário de pré-qualificação: situação atual, objetivo, faturamento, disponibilidade de investimento — filtra quem não está pronto' },
          { id: 's3', title: 'Escreva o script da call de vendas', description: 'Estrutura: rapport (5min) > diagnóstico (15min) > apresentação da solução (10min) > oferta (5min) > objeções (10min) > fechamento' },
          { id: 's4', title: 'Configure o follow-up automatizado', description: 'Quem não fechou na call: e-mail em 24h + e-mail em 3 dias + e-mail em 7 dias com case study relevante' },
        ]
      },
    ]
  },
  {
    id: 'ment-fase-4',
    title: 'Entrega & resultados',
    description: 'Entregar resultados excepcionais que geram cases e indicações',
    order: 4,
    tasks: [
      {
        id: 'ment-t6',
        title: 'Onboarding do cliente',
        description: 'Os primeiros 7 dias determinam o engajamento e o resultado final do cliente',
        priority: 'critica',
        difficulty: 'medio',
        estimatedTime: '1 dia por cliente',
        steps: [
          { id: 's1', title: 'Envie o kit de boas-vindas', description: 'E-mail ou mensagem com: próximos passos, link do calendário para agendar a 1ª sessão, formulário de diagnóstico inicial, acesso aos materiais' },
          { id: 's2', title: 'Realize a sessão de diagnóstico profundo', description: 'Sessão 1: entender onde o cliente está, o que já tentou, quais são os bloqueios reais — sem pressa para resolver, só diagnosticar' },
          { id: 's3', title: 'Defina metas claras e mensuráveis para os 3 meses', description: 'Com o cliente: "Ao final dos 3 meses, consideraremos sucesso se você tiver atingido X, Y e Z"' },
          { id: 's4', title: 'Configure o canal de comunicação entre sessões', description: 'WhatsApp Business, Voxer ou Slack — defina as regras: horário de resposta, tipo de dúvida, formato das mensagens' },
        ]
      },
      {
        id: 'ment-t7',
        title: 'Coletar resultados e cases',
        description: 'Cases documentados são o principal ativo de vendas de qualquer mentoria',
        priority: 'alta',
        difficulty: 'facil',
        estimatedTime: 'contínuo',
        steps: [
          { id: 's1', title: 'Documente os resultados a cada 30 dias', description: 'Print de métricas, fotos do antes/depois, números específicos — sempre com permissão do cliente' },
          { id: 's2', title: 'Solicite depoimento em vídeo ao final', description: '"Você se importa de gravar um vídeo de 2–3 minutos contando sua jornada e resultado?" — vídeo converte 10x mais que texto' },
          { id: 's3', title: 'Peça indicações ativamente', description: '"Você conhece mais alguém que esteja na mesma situação que você estava há 3 meses?" — indicação é o canal de menor CAC' },
          { id: 's4', title: 'Ofereça extensão ou próximo programa', description: 'Cliente que obteve resultado quer continuar — ofereça extensão ou nível avançado antes do encerramento' },
        ]
      },
    ]
  },
])

export const softwareTemplate = fillPhases([
  {
    id: 'soft-fase-1',
    title: 'Descoberta & planejamento',
    order: 1,
    description: 'Definir o produto, o mercado e o modelo de negócio',
    tasks: [
      {
        id: 'soft-t1',
        title: 'Definir o problema central e a proposta de valor única',
        priority: 'critica', difficulty: 'medio', estimatedTime: '1 dia',
        description: 'Software que resolve tudo resolve nada — foco em 1 problema específico',
        steps: [
          { id: 's1', title: 'Escreva o Problem Statement', description: 'Qual o problema específico? Quem tem esse problema? Com que frequência? Qual o custo atual de não resolver?' },
          { id: 's2', title: 'Defina a Unique Value Proposition', description: 'Por que seu software e não o concorrente? O que você faz que eles não fazem ou fazem mal?' },
          { id: 's3', title: 'Defina o modelo de monetização', description: 'One-time purchase | Assinatura | Freemium | Pay-per-use | Marketplace fee — o modelo deve combinar com o comportamento do usuário' },
          { id: 's4', title: 'Pesquise o mercado e os concorrentes', description: 'Product Hunt, App Store, G2, Capterra — quais concorrentes existem? Qual o sentimento dos reviews? Onde está o gap?' },
        ]
      },
      {
        id: 'soft-t2',
        title: 'Criar wireframes e protótipo do MVP',
        priority: 'critica', difficulty: 'dificil', estimatedTime: '1 semana',
        description: 'Protótipo clicável valida o UX antes de escrever uma linha de código',
        steps: [
          { id: 's1', title: 'Mapeie os user flows principais', description: 'Quais são as 3 ações mais importantes que o usuário fará? Mapeie cada passo de cada flow.' },
          { id: 's2', title: 'Crie wireframes de baixa fidelidade', description: 'Figma ou papel — layout básico das telas sem design final. Foco em fluxo e hierarquia de informação.' },
          { id: 's3', title: 'Crie protótipo clicável no Figma', description: 'Connect os frames para criar um protótipo navegável — teste com 5 usuários antes de desenvolver' },
          { id: 's4', title: 'Valide o protótipo com usuários reais', description: '"Me mostre como você faria X" — observe onde travam, onde ficam confusos, o que esperam encontrar' },
          { id: 's5', title: 'Itere o protótipo com base no feedback', description: '2–3 rodadas de teste e iteração antes de passar para desenvolvimento — muito mais barato corrigir em Figma' },
        ]
      },
    ]
  },
  {
    id: 'soft-fase-2',
    title: 'Desenvolvimento',
    order: 2,
    description: 'Construir o MVP com qualidade e velocidade',
    tasks: [
      {
        id: 'soft-t3',
        title: 'Configurar ambiente de desenvolvimento e CI/CD',
        priority: 'alta', difficulty: 'dificil', estimatedTime: '2 dias',
        description: 'Configuração inicial que economiza horas no futuro',
        steps: [
          { id: 's1', title: 'Configure o repositório Git', description: 'GitHub/GitLab > criar repo > branching strategy (main + develop + feature branches) > .gitignore' },
          { id: 's2', title: 'Configure o ambiente de desenvolvimento local', description: 'Docker Compose para serviços locais | variáveis de ambiente (.env) | linting e formatação automática' },
          { id: 's3', title: 'Configure CI/CD básico', description: 'GitHub Actions: rodar testes em cada PR | Deploy automático para staging em merge para develop | Deploy para prod em merge para main' },
          { id: 's4', title: 'Configure monitoramento e error tracking', description: 'Sentry (erros) + Datadog ou Grafana (métricas) — saber quando algo quebra antes do usuário reportar' },
        ]
      },
      {
        id: 'soft-t4',
        title: 'Desenvolver e lançar o MVP',
        priority: 'critica', difficulty: 'dificil', estimatedTime: '4–12 semanas',
        description: 'Construir apenas o suficiente para validar com usuários reais',
        steps: [
          { id: 's1', title: 'Sprint 1: Core feature + Auth', description: 'A feature mais importante + autenticação básica. Sem core feature funcionando, nada mais importa.' },
          { id: 's2', title: 'Sprint 2: Onboarding + Pagamentos', description: 'Fluxo de primeiro uso + integração de pagamento. Usuário deve chegar ao "momento aha" em < 5 minutos.' },
          { id: 's3', title: 'Sprint 3: Polimento + Testes', description: 'Corrigir os principais bugs, melhorar o UX do core flow, adicionar error handling básico' },
          { id: 's4', title: 'Beta fechado: 20–50 usuários', description: 'Acesso manual a usuários selecionados. Onboarding assistido. Coleta intensiva de feedback.' },
          { id: 's5', title: 'Lançamento público', description: 'Product Hunt, HackerNews, comunidades do nicho, press release — preparar o lançamento com 2 semanas de antecedência' },
        ]
      },
    ]
  },
  {
    id: 'soft-fase-3',
    title: 'Crescimento & escala',
    order: 3,
    description: 'Escalar aquisição e melhorar retenção',
    tasks: [
      {
        id: 'soft-t5',
        title: 'Implementar growth loops',
        priority: 'alta', difficulty: 'dificil', estimatedTime: '1 mês',
        description: 'Growth loops são mecanismos que fazem o produto crescer por conta própria',
        steps: [
          { id: 's1', title: 'Identifique o growth loop natural do produto', description: 'Viral: usuário convida outros | SEO: usuário gera conteúdo indexável | Paid: receita financia mais aquisição' },
          { id: 's2', title: 'Implemente o loop viral (se aplicável)', description: '"Compartilhe seu resultado" | "Convide um amigo e ganhe X" | "Feito com [produto]" watermark — todos geram aquisição orgânica' },
          { id: 's3', title: 'Implemente o loop de SEO (se aplicável)', description: 'Conteúdo gerado pelo usuário indexado | Landing pages por keyword | Comparativos e alternativas' },
          { id: 's4', title: 'Meça o coeficiente viral (K-factor)', description: 'K-factor = convites enviados × taxa de aceitação. K > 1 = crescimento exponencial. K > 0.5 = loop saudável.' },
        ]
      },
    ]
  },
])

export const marketplaceTemplate = fillPhases([
  {
    id: 'mkt-fase-1',
    title: 'Definição do modelo',
    order: 1,
    description: 'Resolver o problema do ovo e da galinha — o maior desafio de marketplaces',
    tasks: [
      {
        id: 'mkt-t1',
        title: 'Definir os dois lados e o modelo de monetização',
        priority: 'critica', difficulty: 'medio', estimatedTime: '1 dia',
        description: 'Marketplace precisa de oferta E demanda — qual lado resolver primeiro?',
        steps: [
          { id: 's1', title: 'Defina claramente os dois lados', description: 'Lado da oferta (quem vende/oferece) + Lado da demanda (quem compra/contrata). Cada lado tem necessidades diferentes.' },
          { id: 's2', title: 'Decida qual lado construir primeiro', description: 'Regra geral: comece pelo lado da oferta — mais fácil recrutar prestadores antes de ter clientes. Ou pelo lado mais escasso.' },
          { id: 's3', title: 'Defina o modelo de monetização', description: 'Take rate (% de cada transação) | Listing fee | Assinatura do vendedor | Freemium para compradores | Publicidade — o take rate de 10–20% é o mais comum' },
          { id: 's4', title: 'Defina o mecanismo de confiança', description: 'O que garante que compradores e vendedores confiam um no outro? Reviews, verificação de identidade, escrow, garantia da plataforma?' },
        ]
      },
      {
        id: 'mkt-t2',
        title: 'Resolver o problema do ovo e da galinha',
        priority: 'critica', difficulty: 'dificil', estimatedTime: '1–3 meses',
        description: 'Marketplaces sem oferta não têm demanda. Sem demanda, não atraem oferta. Como resolver?',
        steps: [
          { id: 's1', title: 'Estratégia 1: Faça a curadoria manualmente no início', description: 'Recruit vendedores/prestadores manualmente (cold outreach, LinkedIn, grupos). Monte a oferta antes de abrir para compradores.' },
          { id: 's2', title: 'Estratégia 2: Comece com um nicho geográfico específico', description: 'Não lance para o Brasil todo — comece em 1 cidade. Concentrar oferta e demanda em área pequena cria liquidez mais rápido.' },
          { id: 's3', title: 'Estratégia 3: Subsidie um dos lados', description: 'Ofereça listing gratuito para vendedores no início | Ou crédito para primeiros compradores | Quem subsidiar: o lado mais difícil de atrair.' },
          { id: 's4', title: 'Estratégia 4: Seja a sua própria oferta', description: 'Preste o serviço você mesmo no início (Airbnb fez isso) — garante qualidade, aprende o negócio, cria os primeiros reviews.' },
        ]
      },
    ]
  },
  {
    id: 'mkt-fase-2',
    title: 'Tecnologia & UX',
    order: 2,
    description: 'Construir a plataforma com foco em confiança e transação',
    tasks: [
      {
        id: 'mkt-t3',
        title: 'Desenvolver o MVP do marketplace',
        priority: 'critica', difficulty: 'dificil', estimatedTime: '2–4 meses',
        description: 'Marketplace MVP mínimo: listings, busca, perfis, pagamento e reviews',
        steps: [
          { id: 's1', title: 'Features obrigatórias do lado da oferta', description: 'Criar perfil | Listar produtos/serviços | Receber pagamentos | Ver reviews | Dashboard de pedidos' },
          { id: 's2', title: 'Features obrigatórias do lado da demanda', description: 'Buscar e filtrar | Ver perfis/listings | Fazer pedido/reserva | Pagar com segurança | Deixar review' },
          { id: 's3', title: 'Sistema de pagamentos com escrow', description: 'Dinheiro fica retido até entrega confirmada — Stripe Connect é o padrão para marketplaces. Crucial para confiança.' },
          { id: 's4', title: 'Sistema de reviews e ratings', description: 'Reviews bilaterais (comprador avalia vendedor E vice-versa) | Verificação de compra real | Política de review falso' },
          { id: 's5', title: 'Sistema de resolução de disputas', description: 'O que acontece quando dá errado? Quem paga? Quem decide? Processo claro = mais confiança para transacionar.' },
        ]
      },
    ]
  },
  {
    id: 'mkt-fase-3',
    title: 'Crescimento & liquidez',
    order: 3,
    description: 'Atingir massa crítica de transações para o marketplace se auto-sustentar',
    tasks: [
      {
        id: 'mkt-t4',
        title: 'Atingir liquidez no nicho inicial',
        priority: 'critica', difficulty: 'dificil', estimatedTime: '3–6 meses',
        description: 'Liquidez = compradores encontram o que querem + vendedores encontram clientes = marketplace cresce sozinho',
        steps: [
          { id: 's1', title: 'Defina a métrica de liquidez do seu marketplace', description: 'Ex: % de buscas que retornam resultado relevante | % de pedidos completados em < 24h | Taxa de matching' },
          { id: 's2', title: 'Foque em 1 categoria/nicho até ter liquidez', description: 'Não tente ser o marketplace de tudo — domine 1 nicho, depois expanda. Amazon começou com livros.' },
          { id: 's3', title: 'Implemente notificações de matching', description: '"Novo projeto na sua especialidade apareceu" | "Alguém está procurando o que você oferece" — notificações ativas aumentam transações' },
          { id: 's4', title: 'Meça e reduza o time-to-first-transaction', description: 'Quanto tempo leva do cadastro do comprador até a primeira transação? Reduza cada etapa de fricção.' },
        ]
      },
    ]
  },
])

export const outroTemplate = fillPhases([
  {
    id: 'outro-fase-1',
    title: 'Definição & validação',
    order: 1,
    description: 'Definir o produto e validar que existe mercado',
    tasks: [
      {
        id: 'outro-t1',
        title: 'Definir claramente o produto e o cliente ideal',
        priority: 'critica', difficulty: 'medio', estimatedTime: '1 dia',
        description: 'Sem clareza de produto e avatar, nenhuma outra etapa funciona',
        steps: [
          { id: 's1', title: 'Escreva a descrição do produto em 3 frases', description: 'O que é, para quem é, e qual problema resolve — se não cabe em 3 frases, não está claro o suficiente' },
          { id: 's2', title: 'Defina o cliente ideal (avatar)', description: 'Dados demográficos + situação atual (dor) + situação desejada (resultado) + objeções principais' },
          { id: 's3', title: 'Pesquise a concorrência', description: 'Quem mais resolve esse problema? Qual o preço? Qual a maior reclamação? Como seu produto é diferente?' },
          { id: 's4', title: 'Valide a disposição de pagar', description: 'Converse com 5–10 pessoas do avatar: elas realmente pagariam pelo que você propõe? Qual preço?' },
        ]
      },
    ]
  },
  {
    id: 'outro-fase-2',
    title: 'Criação do produto',
    order: 2,
    description: 'Construir o produto com o mínimo necessário para vender',
    tasks: [
      {
        id: 'outro-t2',
        title: 'Definir e construir o MVP',
        priority: 'critica', difficulty: 'dificil', estimatedTime: '2–8 semanas',
        description: 'Mínimo que entrega o valor central — sem features desnecessárias',
        steps: [
          { id: 's1', title: 'Liste as features/componentes necessários', description: 'Tudo que o produto precisa ter para entregar o resultado prometido ao cliente' },
          { id: 's2', title: 'Corte tudo que não é obrigatório para a 1ª versão', description: 'Se o cliente pode obter o resultado sem a feature: corte para a v2. MVP = mínimo, não versão ruim.' },
          { id: 's3', title: 'Execute a produção do MVP', description: 'Siga o plano com prazo definido — sem deadline, o MVP nunca fica pronto. Defina uma data de lançamento e comprometa-se.' },
          { id: 's4', title: 'Teste com 3–5 pessoas antes de lançar', description: 'Feedback real antes do lançamento público — corrija os problemas críticos, ignore os menores por enquanto' },
        ]
      },
    ]
  },
  {
    id: 'outro-fase-3',
    title: 'Vendas & distribuição',
    order: 3,
    description: 'Encontrar os primeiros clientes e criar o processo de venda',
    tasks: [
      {
        id: 'outro-t3',
        title: 'Definir a estratégia de distribuição',
        priority: 'critica', difficulty: 'medio', estimatedTime: '1 dia',
        description: 'O melhor produto com distribuição ruim perde para um produto médio com ótima distribuição',
        steps: [
          { id: 's1', title: 'Identifique onde seu avatar já está', description: 'Grupos, plataformas, eventos, comunidades — onde o avatar passa o tempo quando tem o problema?' },
          { id: 's2', title: 'Escolha 1–2 canais de distribuição para começar', description: 'Venda direta | Marketplace | Tráfego pago | Conteúdo orgânico | Parceiros | Cold outreach — foco, não tudo ao mesmo tempo' },
          { id: 's3', title: 'Execute por 30 dias no canal escolhido', description: 'Consistência por 30 dias antes de julgar se o canal funciona — a maioria desiste muito cedo' },
          { id: 's4', title: 'Analise e ajuste', description: 'O canal trouxe vendas? Qual o custo de aquisição? Vale escalar ou mudar de canal?' },
        ]
      },
    ]
  },
  {
    id: 'outro-fase-4',
    title: 'Crescimento',
    order: 4,
    description: 'Escalar o que funciona',
    tasks: [
      {
        id: 'outro-t4',
        title: 'Escalar o canal de aquisição principal',
        priority: 'alta', difficulty: 'medio', estimatedTime: 'contínuo',
        description: 'Depois de validar que um canal funciona, aumentar o investimento',
        steps: [
          { id: 's1', title: 'Documente o processo de venda que funcionou', description: 'Escreva o passo a passo de como chegou nas primeiras vendas — o processo documentado é escalável, o processo na cabeça não é' },
          { id: 's2', title: 'Aumente o investimento no canal vencedor gradualmente', description: 'Dobre o orçamento/esforço a cada 2–4 semanas se o ROAS/conversão se mantiver' },
          { id: 's3', title: 'Adicione um segundo canal depois de dominar o primeiro', description: 'Só adicione novo canal quando o primeiro estiver sistematizado e rentável — não antes' },
          { id: 's4', title: 'Meça as métricas de saúde do negócio mensalmente', description: 'CAC, LTV, margem bruta, churn (se recorrente) — negócio saudável tem LTV > 3x CAC' },
        ]
      },
    ]
  },
])

export const templatesByType: Record<ProductType, Phase[]> = {
  'info-produto': infoProdutoTemplate,
  'saas': saasTemplate,
  'curso': cursoTemplate,
  'mentoria': mentoriaTemplate,
  'software': softwareTemplate,
  'marketplace': marketplaceTemplate,
  'outro': outroTemplate,
}
