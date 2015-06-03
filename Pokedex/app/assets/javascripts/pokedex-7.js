Pokedex.Views = (Pokedex.Views || {});

Pokedex.Views.PokemonForm = Backbone.View.extend({
  events: {
    "submit": "savePokemon"
  },

  render: function () {
    var content = JST['pokemonForm']
    this.$el.html(content);

    return this;
  },

  savePokemon: function (event) {
    event.preventDefault();
    this.model.save($(event.target).serializeJSON().pokemon, {
      success: function () {
        this.collection.add(this.model);
        Backbone.history.navigate("/pokemon/" + this.model.get('id'),
                                  { trigger: true });
      }.bind(this)
    });
  }
});
