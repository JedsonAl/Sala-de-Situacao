export const INDICATORS = {
  categories: {
    "good-practices": {
      name: "Boas Práticas",
      description: "Indicadores de qualidade do cuidado na APS",
      icon: "CheckCircle",
      color: "blue"
    },
    "oral-health": {
      name: "Saúde Bucal",
      description: "Indicadores de saúde bucal",
      icon: "Heart",
      color: "green"
    },
    "emulti": {
      name: "eMulti",
      description: "Indicadores de equipes multiprofissionais",
      icon: "Users",
      color: "purple"
    }
  },
  
  details: {
    "C1": {
      code: "C1",
      name: "Acesso",
      description: "Proporção de pessoas que tiveram acesso à APS nos últimos 12 meses.",
      objective: "Monitorar o acesso da população à Atenção Primária à Saúde.",
      criteria: [
        "Ter realizado pelo menos 01 consulta presencial ou remota na APS nos últimos 12 meses",
        "Consulta realizada por profissional de nível superior da equipe",
        "Registro válido no sistema e-SUS APS"
      ],
      tips: [
        "Aumentar oferta de consultas programadas",
        "Implementar telemedicina quando apropriado",
        "Melhorar busca ativa de usuários"
      ]
    },
    
    "C2": {
      code: "C2",
      name: "Cuidado da Criança",
      description: "Acompanhamento integral da criança de 0 a 5 anos.",
      objective: "Garantir o cuidado integral das crianças na primeira infância.",
      criteria: [
        "Consulta de puericultura nos últimos 6 meses",
        "Vacinação em dia conforme calendário",
        "Acompanhamento do crescimento e desenvolvimento",
        "Orientações sobre alimentação saudável"
      ],
      tips: [
        "Organizar agenda específica para puericultura",
        "Implementar busca ativa de crianças faltosas",
        "Capacitar equipe em desenvolvimento infantil"
      ]
    },
    
    "C3": {
      code: "C3",
      name: "Cuidado da Gestante",
      description: "Acompanhamento pré-natal e puerperal adequado.",
      objective: "Garantir assistência de qualidade durante a gravidez e puerpério.",
      criteria: [
        "Início do pré-natal até 16 semanas",
        "Realização de pelo menos 6 consultas de pré-natal",
        "Exames laboratoriais obrigatórios realizados",
        "Consulta puerperal até 42 dias pós-parto"
      ],
      tips: [
        "Captação precoce de gestantes",
        "Organizar grupo de gestantes",
        "Garantir acesso aos exames"
      ]
    },
    
    "C4": {
      code: "C4",
      name: "Cuidado do Diabético",
      description: "Acompanhamento longitudinal da pessoa com diabetes.",
      objective: "Monitorar e controlar o diabetes mellitus na APS.",
      criteria: [
        "Consulta médica ou de enfermagem nos últimos 6 meses",
        "Solicitação de hemoglobina glicada nos últimos 12 meses",
        "Exame de fundo de olho nos últimos 12 meses",
        "Orientação sobre alimentação e exercício físico"
      ],
      tips: [
        "Implementar consultas programadas",
        "Criar grupos de diabetes",
        "Garantir acesso aos exames"
      ]
    },
    
    "C5": {
      code: "C5",
      name: "Cuidado do Hipertenso",
      description: "Acompanhamento longitudinal da pessoa com hipertensão arterial.",
      objective: "Monitorar e controlar a hipertensão arterial na APS.",
      criteria: [
        "Ter realizado pelo menos 01 consulta presencial ou remota por profissional médico ou enfermeiro, nos últimos 6 meses",
        "Ter pelo menos 01 registro de aferição da pressão arterial, realizado nos últimos 6 meses",
        "Ter pelo menos 02 visitas domiciliares por ACS/Tacs, com intervalo mínimo de 30 dias, realizadas nos últimos 12 meses",
        "Ter realizado pelo menos 01 registro de peso e altura, nos últimos 12 meses"
      ],
      tips: [
        "Agendar consultas regulares para hipertensos",
        "Orientar ACS para visitas domiciliares frequentes",
        "Registrar adequadamente aferições de PA",
        "Manter dados antropométricos atualizados"
      ]
    },
    
    "C6": {
      code: "C6",
      name: "Cuidado da Pessoa Idosa",
      description: "Acompanhamento integral da pessoa idosa.",
      objective: "Garantir cuidado integral à pessoa idosa na APS.",
      criteria: [
        "Consulta nos últimos 6 meses",
        "Avaliação multidimensional da pessoa idosa",
        "Vacinação em dia (influenza, pneumocócica)",
        "Acompanhamento de condições crônicas"
      ],
      tips: [
        "Implementar caderneta do idoso",
        "Organizar grupos de idosos",
        "Capacitar equipe em geriatria"
      ]
    },
    
    "C7": {
      code: "C7",
      name: "Cuidado da Mulher",
      description: "Rastreamento do câncer de colo de útero e mama.",
      objective: "Garantir prevenção do câncer na mulher.",
      criteria: [
        "Coleta de citopatológico nos últimos 3 anos",
        "Mamografia nos últimos 2 anos (50-69 anos)",
        "Exame clínico das mamas anual",
        "Orientações sobre prevenção"
      ],
      tips: [
        "Organizar mutirões de prevenção",
        "Implementar busca ativa",
        "Garantir acesso aos exames"
      ]
    },
    
    "B1": {
      code: "B1",
      name: "Primeira Consulta",
      description: "Proporção de pessoas que tiveram primeira consulta odontológica programática.",
      objective: "Aumentar o acesso à primeira consulta odontológica.",
      criteria: [
        "Primeira consulta odontológica programática",
        "Registro válido no sistema",
        "Procedimento realizado por cirurgião-dentista"
      ],
      tips: [
        "Ampliar horários de atendimento",
        "Implementar agendamento online",
        "Melhorar divulgação dos serviços"
      ]
    },
    
    "B2": {
      code: "B2",
      name: "Tratamento Concluído",
      description: "Proporção de pessoas que concluíram o tratamento odontológico.",
      objective: "Garantir a conclusão do tratamento odontológico iniciado.",
      criteria: [
        "Tratamento odontológico concluído",
        "Registro de conclusão no sistema",
        "Acompanhamento pós-tratamento"
      ],
      tips: [
        "Melhorar organização da agenda",
        "Implementar busca ativa de faltosos",
        "Estabelecer metas de conclusão"
      ]
    },
    
    "B3": {
      code: "B3",
      name: "Razão de Exodontias",
      description: "Razão entre exodontias e procedimentos odontológicos.",
      objective: "Reduzir a proporção de exodontias em relação aos procedimentos preventivos e curativos.",
      criteria: [
        "Procedimentos preventivos realizados",
        "Procedimentos curativos realizados",
        "Exodontias quando necessárias"
      ],
      tips: [
        "Fortalecer ações preventivas",
        "Melhorar acesso a procedimentos curativos",
        "Capacitar equipe em prevenção"
      ]
    },
    
    "B4": {
      code: "B4",
      name: "Escovação Dental",
      description: "Ações coletivas de escovação dental supervisionada.",
      objective: "Promover práticas de higiene bucal na população.",
      criteria: [
        "Escovação dental supervisionada",
        "Ações coletivas em grupos",
        "Orientações de higiene bucal"
      ],
      tips: [
        "Organizar grupos de escovação",
        "Capacitar ACS em saúde bucal",
        "Parcerias com escolas"
      ]
    },
    
    "B5": {
      code: "B5",
      name: "Preventivos",
      description: "Procedimentos preventivos em saúde bucal.",
      objective: "Aumentar a cobertura de procedimentos preventivos.",
      criteria: [
        "Aplicação de flúor",
        "Procedimentos preventivos individuais",
        "Orientações de prevenção"
      ],
      tips: [
        "Fortalecer ações preventivas",
        "Organizar grupos educativos",
        "Melhorar registro de procedimentos"
      ]
    },
    
    "B6": {
      code: "B6",
      name: "ART",
      description: "Tratamento Restaurador Atraumático.",
      objective: "Promover tratamento restaurador atraumático.",
      criteria: [
        "Procedimentos ART realizados",
        "Técnica adequada aplicada",
        "Registro correto no sistema"
      ],
      tips: [
        "Capacitar equipe em ART",
        "Garantir material adequado",
        "Melhorar técnica"
      ]
    },
    
    "M1": {
      code: "M1",
      name: "Média de Atendimentos",
      description: "Média de atendimentos individuais da equipe multiprofissional.",
      objective: "Monitorar a produtividade da equipe multiprofissional.",
      criteria: [
        "Atendimentos individuais realizados",
        "Registro adequado no sistema",
        "Equipe multiprofissional ativa"
      ],
      tips: [
        "Organizar agenda multiprofissional",
        "Capacitar equipe em registro",
        "Melhorar fluxo de atendimento"
      ]
    },
    
    "M2": {
      code: "M2",
      name: "Ações Interprofissionais",
      description: "Ações interprofissionais realizadas pela equipe multiprofissional.",
      objective: "Promover ações interprofissionais na APS.",
      criteria: [
        "Ações interprofissionais realizadas",
        "Participação de múltiplas categorias",
        "Registro adequado"
      ],
      tips: [
        "Organizar reuniões de equipe",
        "Implementar projetos terapêuticos",
        "Melhorar integração profissional"
      ]
    }
  }
};
