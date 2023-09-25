(function () {
  "use strict";

  consultarPedido.service("vtexService", [
    "$q",
    function ($q) {
      var client = ZAFClient.init();
      return {
        consultarCPF: function (url, token, cpf) {
          var deferred = $q.defer();
          let options = {
            url: url + cpf,
            type: "GET",
            contentType: "application/json",
            headers: {
              "x-api-key": token,
            },
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

        consultarPedidos: function (url, token, idPedido) {
          var deferred = $q.defer();
          let options = {
            url: url + idPedido,
            type: "GET",
            contentType: "application/json",
            headers: {
              "x-api-key": token,
            },
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
