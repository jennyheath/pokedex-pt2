Pokedex.Views = {}

Pokedex.Views.PokemonIndex = Backbone.View.extend({
  events: {
    "click li": "selectPokemonFromList"
  },

  initialize: function (options) {
    this.collections = new Pokedex.Collections.Pokemon();
    this.collections.fetch();
    this.listenTo(this.collections, "sync", this.render);
    this.listenTo(this.collections, "add", this.addPokemonToList);
  },

  addPokemonToList: function (pokemon) {
    var content = JST['pokemonListItem']({ pokemon: pokemon });
    this.$el.append(content);
  },

  refreshPokemon: function (callback) {
    this.collections.fetch({
      success: function () {
        callback();
      }
    });
  },

  render: function () {
    this.$el.empty();
    this.collections.each(function (pokemon) {
      this.addPokemonToList(pokemon);
    }.bind(this))

    return this;
  },

  selectPokemonFromList: function (event) {
    var pokeId = $(event.currentTarget).data('id');
    Backbone.history.navigate("/pokemon/" + pokeId, { trigger: true});
  }
});

Pokedex.Views.PokemonDetail = Backbone.View.extend({
  events: {
    "click .toy-list-item": "selectToyFromList"
  },

  refreshPokemon: function (options) {
    this.model.fetch({
      success: this.render.bind(this)
    });
  },

  render: function () {
    this.$el.empty();
    var content = JST['pokemonDetail']({ pokemon: this.model });
    this.$el.append(content);
    this.model.toys().each(function(toy) {
      var toyContent = JST['toyListItem']({ toy: toy });
      $('.pokemon-detail .toys').append(toyContent);
    });

    return this;
  },

  selectToyFromList: function (event) {
    var pokeId = $(event.currentTarget).data('pokemon-id');
    var toyId = $(event.currentTarget).data('id');
    Backbone.history.navigate('/pokemon/' + pokeId + '/toys/' + toyId,
                              { trigger: true })

  }
});

Pokedex.Views.ToyDetail = Backbone.View.extend({
  initialize: function () {
    this.listenTo(this.collection, "sync", this.render)
  },

  render: function () {
    var toy = this.model;
    var pokes = this.collection;
    var content = JST['toyDetail']({ toy: toy, pokes: pokes });
    this.$el.html(content);

    return this;
  }
});

// $(function () {
//   var pokemonIndex = new Pokedex.Views.PokemonIndex();
//   pokemonIndex.refreshPokemon();
//   $("#pokedex .pokemon-list").html(pokemonIndex.$el);
// });
