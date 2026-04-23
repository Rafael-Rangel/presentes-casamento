-- Mock realista para desenvolvimento / demonstração.
-- Executar no SQL Editor do Supabase (como postgres / service role).
--
-- Remove apenas linhas criadas por este script (identificadas por slug
-- `seedpc-*` em convidados e `store_url` em presentes).
-- Pode voltar a correr o ficheiro inteiro para repor os dados.

BEGIN;

DELETE FROM public.gifts
WHERE store_url LIKE 'https://seed-presentes.example/%';

DELETE FROM public.guests
WHERE slug LIKE 'seedpc-%';

INSERT INTO public.guests (slug, display_name, email, phone, notes) VALUES
  ('seedpc-ines-martins', 'Inês Martins', 'ines.martins@exemplo.pt', '+351 913 204 881', 'Amiga da noiva — universidade'),
  ('seedpc-ricardo-oliveira', 'Ricardo Oliveira', 'ricardo.oliveira@exemplo.pt', '+351 914 552 019', 'Colega do noivo'),
  ('seedpc-sofia-costa', 'Sofia Costa', 'sofia.costa@exemplo.pt', '+351 915 778 334', 'Prima da noiva'),
  ('seedpc-miguel-santos', 'Miguel Santos', NULL, '+351 916 901 445', 'Padrinho'),
  ('seedpc-joana-ferreira', 'Joana Ferreira', 'joana.ferreira@exemplo.pt', NULL, 'Chá de panela'),
  ('seedpc-tiago-almeida', 'Tiago Almeida', 'tiago.almeida@exemplo.pt', '+351 917 223 667', 'Futebol aos domingos'),
  ('seedpc-catarina-lopes', 'Catarina Lopes', 'c.lopes@exemplo.pt', '+351 918 334 778', 'Vizinha do casal'),
  ('seedpc-pedro-rocha', 'Pedro Rocha', NULL, '+351 919 445 889', 'Irmão do noivo'),
  ('seedpc-ana-batista', 'Ana Batista', 'ana.batista@exemplo.pt', '+351 920 556 990', 'Trabalho — equipa design'),
  ('seedpc-luis-carvalho', 'Luís Carvalho', 'luis.carvalho@exemplo.pt', NULL, 'Amigo de infância'),
  ('seedpc-mariana-pinto', 'Mariana Pinto', 'mariana.pinto@exemplo.pt', '+351 921 667 001', 'Dama de honor'),
  ('seedpc-goncalo-miranda', 'Gonçalo Miranda', NULL, '+351 922 778 112', 'Surf'),
  ('seedpc-rita-nunes', 'Rita Nunes', 'rita.nunes@exemplo.pt', '+351 923 889 223', 'Ioga — grupo semanal'),
  ('seedpc-andre-correia', 'André Correia', 'andre.correia@exemplo.pt', NULL, 'Cunhado'),
  ('seedpc-paula-matos', 'Paula Matos', 'paula.matos@exemplo.pt', '+351 924 990 334', 'Madrinha de batizado'),
  ('seedpc-filipe-azevedo', 'Filipe Azevedo', 'filipe.azevedo@exemplo.pt', '+351 925 001 445', 'Startup weekend'),
  ('seedpc-laura-teixeira', 'Laura Teixeira', NULL, '+351 926 112 556', 'Vinho e jantares'),
  ('seedpc-hugo-barbosa', 'Hugo Barbosa', 'hugo.barbosa@exemplo.pt', '+351 927 223 667', 'Ginásio'),
  ('seedpc-beatriz-moura', 'Beatriz Moura', 'beatriz.moura@exemplo.pt', NULL, 'Família noiva — avó'),
  ('seedpc-daniel-freitas', 'Daniel Freitas', 'daniel.freitas@exemplo.pt', '+351 928 334 778', 'Música ao vivo'),
  ('seedpc-teresa-gomes', 'Teresa Gomes', 'teresa.gomes@exemplo.pt', '+351 929 445 889', 'Professora primária'),
  ('seedpc-nuno-ramos', 'Nuno Ramos', NULL, '+351 930 556 990', 'Pesca'),
  ('seedpc-carla-vieira', 'Carla Vieira', 'carla.vieira@exemplo.pt', '+351 931 667 001', 'Book club'),
  ('seedpc-joao-sequeira', 'João Sequeira', 'joao.sequeira@exemplo.pt', '+351 932 778 112', 'Best man');

INSERT INTO public.gifts (
  title,
  description,
  estimated_price,
  category,
  priority,
  status,
  release_month,
  image_url,
  store_url,
  accent_color
) VALUES
  (
    'Conjunto de tachos em inox (5 peças)',
    'Para cozinhar juntos sem colar às paredes. Referência tipo IKEA / WMF; ideal para o dia a dia.',
    189.90,
    'Cozinha',
    'essential',
    'available',
    NULL,
    'https://images.unsplash.com/photo-1556911220-e15b29be8de0?auto=format&w=900&q=80',
    'https://seed-presentes.example/cozinha/tachos-inox',
    '#2d5a75'
  ),
  (
    'Robot de cozinha multifunções',
    'Massas, sopas e purés — poupa tempo nas semanas de trabalho intenso.',
    349.00,
    'Cozinha',
    'essential',
    'available',
    '2026-01',
    'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&w=900&q=80',
    'https://seed-presentes.example/cozinha/robot',
    '#8b4513'
  ),
  (
    'Máquina de café expresso com moinho',
    'Sonho de manhãs lentos ao fim de semana. Moagem fresca, dois chávenas.',
    429.00,
    'Cozinha',
    'high',
    'available',
    '2026-03',
    'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e7?auto=format&w=900&q=80',
    'https://seed-presentes.example/cozinha/cafe',
    '#4a3728'
  ),
  (
    'Conjunto de facas com bloco em madeira',
    'Chef em casa: pão, legumes e peixe com segurança.',
    95.00,
    'Cozinha',
    'normal',
    'available',
    '2026-04',
    'https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&w=900&q=80',
    'https://seed-presentes.example/cozinha/facas',
    '#1e3a2f'
  ),
  (
    'Aspirador vertical sem fios',
    'Leve, para apartamento e escadas — sem drama com cabos.',
    249.00,
    'Casa',
    'high',
    'available',
    NULL,
    'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&w=900&q=80',
    'https://seed-presentes.example/casa/aspirador',
    '#5c6bc0'
  ),
  (
    'Jogo de lençóis em algodão egípcio',
    'Cama queen, branco natural, 300 fios — dormir como em hotel.',
    120.00,
    'Quarto',
    'normal',
    'available',
    '2026-02',
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&w=900&q=80',
    'https://seed-presentes.example/quarto/lencois',
    '#c4a77d'
  ),
  (
    'Toalhas de banho (conjunto 6)',
    'Gramagem alta, cores neutras — casa de banho pronta para visitas.',
    78.00,
    'Casa de banho',
    'normal',
    'available',
    NULL,
    'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&w=900&q=80',
    'https://seed-presentes.example/banho/toalhas',
    '#7eb6c8'
  ),
  (
    'Luzes de mesa LED reguláveis (par)',
    'Ambiente para jantar e filmes — intensidade e temperatura de cor.',
    65.00,
    'Decoração',
    'normal',
    'available',
    '2026-04',
    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&w=900&q=80',
    'https://seed-presentes.example/decor/luzes',
    '#d4a574'
  ),
  (
    'Mala de viagem média (4 rodas)',
    'Para a lua de mel e escapadinhas — rígida, TSA lock.',
    159.00,
    'Lua de mel',
    'high',
    'available',
    NULL,
    'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&w=900&q=80',
    'https://seed-presentes.example/viagem/mala',
    '#2d5a75'
  ),
  (
    'Experiência gastronómica para dois',
    'Menu degustação num restaurante com estrela — data a combinar.',
    220.00,
    'Experiências',
    'normal',
    'reserved',
    NULL,
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&w=900&q=80',
    'https://seed-presentes.example/experiencias/menu-degustacao',
    '#8b4513'
  ),
  (
    'Apoio ao fundo de lua de mel (contribuição)',
    'Qualquer valor ajuda — voos, alojamento e aventuras.',
    NULL,
    'Lua de mel',
    'essential',
    'confirmed',
    NULL,
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&w=900&q=80',
    'https://seed-presentes.example/viagem/fundo-lua',
    '#c45c26'
  ),
  (
    'Conjunto de copos de vinho (crystal)',
    'Para brindar com amigos — 12 unidades.',
    89.00,
    'Mesa',
    'normal',
    'reserved',
    '2026-04',
    'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&w=900&q=80',
    'https://seed-presentes.example/mesa/copos-vinho',
    '#722f37'
  ),
  (
    'Grelhador de contacto / sanduicheira premium',
    'Pequenos almoços e jantares rápidos com resultado crocante.',
    119.00,
    'Cozinha',
    'normal',
    'available',
    '2026-04',
    'https://images.unsplash.com/photo-1585516000269-afa883bee6d7?auto=format&w=900&q=80',
    'https://seed-presentes.example/cozinha/grelhador',
    '#e07b39'
  ),
  (
    'Mesa extensível em carvalho (voucher loja)',
    'Móvel principal da sala — escolhemos o acabamento na loja parceira.',
    890.00,
    'Sala',
    'essential',
    'available',
    NULL,
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&w=900&q=80',
    'https://seed-presentes.example/sala/mesa-extensivel',
    '#6b4f3b'
  ),
  (
    'Televisão 55" OLED (voucher)',
    'Noites de cinema em casa — modelo a definir na altura da compra.',
    999.00,
    'Sala',
    'high',
    'coming_soon',
    '2026-07',
    'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&w=900&q=80',
    'https://seed-presentes.example/sala/tv-oled',
    '#1a1a2e'
  ),
  (
    'Som portátil à prova de água',
    'Para praia, piqueniques e varanda — som limpo e bateria longa.',
    139.00,
    'Lazer',
    'normal',
    'coming_soon',
    '2026-08',
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&w=900&q=80',
    'https://seed-presentes.example/lazer/som-portatil',
    '#0f766e'
  ),
  (
    'Bicicletas urbanas (par) — reserva futura',
    'Deslocações e passeios — liberta quando tivermos garagem confirmada.',
    1100.00,
    'Lazer',
    'normal',
    'available',
    '2026-09',
    'https://images.unsplash.com/photo-1485965120184-e220f971d3f1?auto=format&w=900&q=80',
    'https://seed-presentes.example/lazer/bicicletas',
    '#166534'
  ),
  (
    'Ar condicionado portátil 12k BTU',
    'Para o primeiro verão na nova casa — só depois da obra na sala.',
    399.00,
    'Casa',
    'high',
    'available',
    '2026-10',
    'https://images.unsplash.com/photo-1585338447937-7082f8fc763d?auto=format&w=900&q=80',
    'https://seed-presentes.example/casa/ar-portatil',
    '#0369a1'
  ),
  (
    'Conjunto de panelas em ferro fundido',
    'Bolonhesa e stew ao forno — peças que duram décadas.',
    265.00,
    'Cozinha',
    'normal',
    'available',
    '2026-11',
    'https://images.unsplash.com/photo-1584990347449-a8fcfbc02c84?auto=format&w=900&q=80',
    'https://seed-presentes.example/cozinha/ferro-fundido',
    '#7f1d1d'
  ),
  (
    'Cadeiras de jardim em teca (conjunto 4)',
    'Varanda grande — combinamos entrega para depois da mudança.',
    520.00,
    'Exterior',
    'normal',
    'available',
    '2027-02',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&w=900&q=80',
    'https://seed-presentes.example/exterior/cadeiras-teca',
    '#3d2c1e'
  ),
  (
    'Spa e massagens para dois',
    'Dia completo em hotel — bloqueado até libertarmos a lista de luxo.',
    280.00,
    'Experiências',
    'normal',
    'coming_soon',
    '2026-12',
    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&w=900&q=80',
    'https://seed-presentes.example/experiencias/spa',
    '#9d174d'
  ),
  (
    'Máquina de lavar roupa (carga frontal 9 kg)',
    'Eficiência A — só faz sentido depois de instalarmos a coluna na lavandaria.',
    549.00,
    'Casa',
    'essential',
    'coming_soon',
    '2027-01',
    'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&w=900&q=80',
    'https://seed-presentes.example/casa/maquina-lavar',
    '#475569'
  ),
  (
    'Serviço de fotografia pós-casamento',
    'Sessão ao pôr do sol — reservamos o fotógrafo para mais tarde no ano.',
    350.00,
    'Casamento',
    'normal',
    'coming_soon',
    NULL,
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&w=900&q=80',
    'https://seed-presentes.example/casamento/fotos-pos',
    '#4c1d95'
  ),
  (
    'Curso de culinária para casal (6 sessões)',
    'Italiano e pastelaria — inscrição aberta quando a agenda permitir.',
    240.00,
    'Experiências',
    'normal',
    'coming_soon',
    '2026-06',
    'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&w=900&q=80',
    'https://seed-presentes.example/experiencias/curso-culinaria',
    '#b45309'
  ),
  (
    'Frigorífico combi no frost',
    'Grande eletrodoméstico — só depois de medições finais da cozinha nova.',
    799.00,
    'Cozinha',
    'high',
    'available',
    '2027-03',
    'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&w=900&q=80',
    'https://seed-presentes.example/cozinha/frigorifico',
    '#1e40af'
  ),
  (
    'Tapete persa vintage (medida sob consulta)',
    'Peça de investimento para a sala — compra coordenada com o decorador.',
    1850.00,
    'Decoração',
    'normal',
    'available',
    '2027-06',
    'https://images.unsplash.com/photo-1600166898405-6e16aa60fe6e?auto=format&w=900&q=80',
    'https://seed-presentes.example/decor/tapete',
    '#92400e'
  );

COMMIT;
