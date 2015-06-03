Pokedex.Router = Backbone.Router.extend({
  routes: {
    "": "pokemonIndex",
    "pokemon/:pokemonId/toys/:toyId": "toyDetail",
    "pokemon/:id": "pokemonDetail"
  },

  pokemonDetail: function (id, callback) {
    if (!this._pokemonIndex) {
      this.pokemonIndex(function () {
        this.pokemonDetail(id, callback);
      }.bind(this));
    } else {
      var pokemon = this._pokemonIndex.collections.get(id);
      var pokemonDetail = new Pokedex.Views.PokemonDetail({
        model: pokemon
      });
      $("#pokedex .pokemon-detail").html(pokemonDetail.$el);
      pokemonDetail.refreshPokemon();

      this._pokemonDetail = pokemonDetail;
    }
  },

  pokemonIndex: function (callback) {
    var pokemonIndex = new Pokedex.Views.PokemonIndex();
    pokemonIndex.refreshPokemon(callback);
    $("#pokedex .pokemon-list").html(pokemonIndex.$el);
    this._pokemonIndex = pokemonIndex;
  },

  toyDetail: function (pokemonId, toyId) {
    if (!this._pokemonDetail) {
      this.pokemonDetail(function () {
        this.toyDetail(pokemonId, toyId);
      }.bind(this));
    } else {
      var toy = this._pokemonDetail.model.toys().get(toyId);
      var pokes = this._pokemonIndex.collections;
      var toyDetail = new Pokedex.Views.ToyDetail({
        model: toy,
        collection: pokes
      });
      $("#pokedex .toy-detail").html(toyDetail.$el);
      toyDetail.render();
    }

  },

  pokemonForm: function () {
  }
});


$(function () {
  new Pokedex.Router();
  Backbone.history.start();
});
