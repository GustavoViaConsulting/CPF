consultarPedido.controller("consultarPedido", [
  "$scope",
  "vtexService",
  function ($scope, vtexService) {
    var cliente = ZAFClient.init();
    var itensPorPagina = 10;
    var pedidos = [];
    var urlCPF;
    var urlPedido;
    var errors = {
      consultarCPF: "Erro ao consultar CPF",
      consultarCPFInvalido: "CPF inválido",
      consultarPedidos: "Erro ao consultar pedidos",
    };
    var traducao = {
      IN_PROGRESS: "Em Progresso",
      PENDING: "Pendente",
      CLOSED: "Fechado",
      CANCELLED: "Cancelado",
      ACTIVE: "Ativo",
      RESOLVED: "Resolvido",
    };

    $scope.dadosCliente = "";
    $scope.valorDeBusca = "";
    $scope.pedidoSelecionado = {};
    $scope.mensagem = "";
    $scope.paginaAtual = 1;
    $scope.mostrarCard = false;

    cliente.metadata().then(function (parameters) {
      urlCPF = parameters.settings.urlCpf;
      urlPedido = parameters.settings.urlPedido;
    });

    // Função para obter a lista de números das páginas
    $scope.getPaginas = function () {
      var totalPaginas = $scope.getTotalPaginas();
      var paginas = [];
      for (var i = 1; i <= totalPaginas; i++) {
        paginas.push(i);
      }
      return paginas;
    };

    // Função para obter os itens da página atual
    $scope.getItensPagina = function () {
      var indiceInicio = ($scope.paginaAtual - 1) * itensPorPagina;
      var indiceFim = indiceInicio + itensPorPagina;
      return pedidos.slice(indiceInicio, indiceFim);
    };

    // Função para avançar para a próxima página
    $scope.proximaPagina = function () {
      if ($scope.paginaAtual < $scope.getTotalPaginas()) {
        $scope.paginaAtual++;
      }
    };

    // Função para alterar a página atual com base no número clicado
    $scope.mudarPagina = function (numeroPagina) {
      $scope.paginaAtual = numeroPagina;
    };

    // Função para voltar para a página anterior
    $scope.paginaAnterior = function () {
      if ($scope.paginaAtual > 1) {
        $scope.paginaAtual--;
      }
    };

    // Função para calcular o número total de páginas
    $scope.getTotalPaginas = function () {
      return Math.ceil(pedidos.length / itensPorPagina);
    };

    // Função para formatar a data
    $scope.formatarData = function (data) {
      if (!data) return "";
      var dataFormatada = new Date(data);
      return dataFormatada.toISOString().slice(0, 10);
    };

    // Função para validar o CPF
    function validarCPF() {
      var cpf = $scope.valorDeBusca.replace(/[^\d]+/g, ""); // Remove caracteres não numéricos

      if (cpf.length !== 11) {
        return false;
      }

      // Verifica se todos os dígitos são iguais (caso contrário, o CPF é inválido)
      if (/^(\d)\1+$/.test(cpf)) {
        return false;
      }

      // Calcula o primeiro dígito verificador
      let soma = 0;
      for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
      }
      let resto = 11 - (soma % 11);
      if (resto === 10 || resto === 11) {
        resto = 0;
      }
      if (resto !== parseInt(cpf.charAt(9))) {
        return false;
      }

      // Calcula o segundo dígito verificador
      soma = 0;
      for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
      }
      resto = 11 - (soma % 11);
      if (resto === 10 || resto === 11) {
        resto = 0;
      }
      if (resto !== parseInt(cpf.charAt(10))) {
        return false;
      }

      return true;
    }

    // Função para consultar o CPF
    $scope.consultarCPF = function () {
      if (validarCPF($scope.valorDeBusca)) {
        $scope.mensagem = "";
        vtexService
          .consultarCPF(urlCPF, $scope.valorDeBusca.replace(/[^\d]+/g, ""))
          .then(function (dados) {
            // Chamada da função recursiva
            pedidos = [];
            consultarPedidos(dados, 0, []);
            $scope.dadosCliente = dados;
          })
          .catch(function (error) {
            console.log(error);
            mensagem(errors.consultarCPF, "error");
          });
      } else {
        $scope.mensagem = "";
        mensagem(errors.consultarCPFInvalido, "error");
      }
    };

    // Função para consultar os pedidos
    function consultarPedidos(dados, indice) {
      if (indice < dados.pedidos.length) {
        vtexService
          .consultarPedidos(urlPedido, dados.pedidos[indice])
          .then(function (dadosPedido) {
            dadosPedido.status = traduzirStatus(dadosPedido.status);
            pedidos.push(dadosPedido);

            consultarPedidos(dados, indice + 1);
          })
          .catch(function (error) {
            console.log(error);
            mensagem(errors.consultarPedidos, "error");
            consultarPedidos(dados, indice + 1);
          });
      } else {
      }
    }

    $scope.mostrarPedido = function (pedido) {
      $scope.pedidoSelecionado = pedido;
      $scope.mostrarCard = true;
    };

    $scope.FecharPedido = function () {
      $scope.mostrarCard = false;
    };

    $scope.cancelarPedido = function (pedido) {
      var index = pedidos.indexOf(pedido);
      if (index !== -1) {
        pedidos.splice(index, 1);
      }
      $scope.mostrarCard = false;
    };

    function mensagem(mensagem, tipo) {
      cliente.invoke("notify", "<b>" + mensagem + "</b>", tipo, 3000);
    }

    function traduzirStatus(statusOriginal) {
      return traducao[statusOriginal] || statusOriginal;
    }
  },
]);
