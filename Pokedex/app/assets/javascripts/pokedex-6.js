Pokedex.Router = Backbone.Router.extend({
  routes: {
    "": "pokemonIndex",
    "pokemon/:pokemonId/toys/:toyId": "toyDetail",
    "pokemon/:id": "pokemonDetail"
  },

  pokemonDetail: function (id, callback) {
    if (!this._pokemonIndex) {
      this.pokemonIndex(this.pokemonDetail.bind(this, id, callback));
    } else {
      var pokemon = this._pokemonIndex.collection.get(id);
      this._pokemonDetail = new Pokedex.Views.PokemonDetail({ model: pokemon });
      $("#pokedex .pokemon-detail").html(this._pokemonDetail.$el);
      this._pokemonDetail.refreshPokemon({ success: callback });
    }
  },

  pokemonIndex: function (callback) {
    this._pokemonIndex = new Pokedex.Views.PokemonIndex();
    $("#pokedex .pokemon-list").html(this._pokemonIndex.$el);
    this._pokemonIndex.refreshPokemon({ success: callback });
    this.pokemonForm();
  },

  toyDetail: function (pokemonId, toyId) {
    if (!this._pokemonDetail) {
      this.pokemonDetail(pokemonId,
                         this.toyDetail.bind(this, pokemonId, toyId));
    } else {
      var toy = this._pokemonDetail.model.toys().get(toyId);
      var pokes = this._pokemonIndex.collection;
      var toyDetail = new Pokedex.Views.ToyDetail({
        model: toy,
        collection: pokes
      });
      $("#pokedex .toy-detail").html(toyDetail.$el);
      toyDetail.render();
    }
  },

  pokemonForm: function () {
    var pokeForm = new Pokedex.Views.PokemonForm({
      model: new Pokedex.Models.Pokemon(),
      collection: this._pokemonIndex.collection
    });

    $('#pokedex .pokemon-form').html(pokeForm.$el)
    pokeForm.render();
  }
});


$(function () {
  new Pokedex.Router();
  Backbone.history.start();
});
