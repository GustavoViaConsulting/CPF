(function () {
  "use strict";

  consultarPedido.service("vtexService", [
    "$q",
    function ($q) {
      var client = ZAFClient.init();

      return {
        consultarCPF: function (url, cpf) {
          var deferred = $q.defer();
          var options = {
            url: url + cpf,
            type: "GET",
            cors: false,
            headers: {
              "x-api-key": "{{setting.tokenCpf}}",
              "Content-Type": "application/json",
            },
            // secure: true
          };
          client
            .request(options)
            .then(function (data) {
              deferred.resolve(JSON.parse(data));
            })
            .catch(function (error) {
              deferred.reject(error);
            });
          return deferred.promise;
        },

        consultarPedidos: function (url, idPedido) {
          var deferred = $q.defer();
          let options = {
            url: url + idPedido,
            type: "GET",
            cors: false,
            headers: {
              "x-api-key": "{{setting.tokenPedido}}",
              "Content-Type": "application/json",
            },
            // secure: true
          };
          client
            .request(options)
            .then(function (data) {
              deferred.resolve(data);
            })
            .catch(function (error) {
              deferred.reject(error);
            });
          return deferred.promise;
        },
      };
    },
  ]);
})();
