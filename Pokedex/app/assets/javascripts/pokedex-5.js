Pokedex.Views = {}

Pokedex.Views.PokemonIndex = Backbone.View.extend({
  events: {
    "click li": "selectPokemonFromList"
  },

  initialize: function (options) {
    this.collection = new Pokedex.Collections.Pokemon();
    this.collection.fetch();
    this.listenTo(this.collection, "sync", this.render);
    this.listenTo(this.collection, "add", this.addPokemonToList);
  },

  addPokemonToList: function (pokemon) {
    var content = JST['pokemonListItem']({ pokemon: pokemon });
    this.$el.append(content);
  },

  refreshPokemon: function (options) {
    this.collection.fetch({
      success: function () {
        options.success && options.success();
      }
    });
  },

  render: function () {
    this.$el.empty();
    this.collection.each(this.addPokemonToList.bind(this));
    return this;
  },

  selectPokemonFromList: function (event) {
    var pokeId = $(event.currentTarget).data('id');
    Backbone.history.navigate("/pokemon/" + pokeId,
                              { trigger: true}
                             );
  }
});

Pokedex.Views.PokemonDetail = Backbone.View.extend({
  events: {
    "click .toy-list-item": "selectToyFromList"
  },

  refreshPokemon: function (options) {
    this.model.fetch({
      success: function () {
        this.render();
        options.success && options.success();
      }.bind(this)
    });
  },

  render: function () {
    this.$el.empty();

    var content = JST['pokemonDetail']({ pokemon: this.model });
    this.$el.html(content);

    var $toys = this.$el.find('.toys');
    this.model.toys().each((function (toy) {
      $toys.append(JST['toyListItem']({ toy: toy }));
    }).bind(this));

    return this;
  },

  selectToyFromList: function (event) {
    var pokeId = this.model.id;
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
