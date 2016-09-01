(function($) {
  $(function() {

    var giphyApi = {

      init: function() {

        this.host = 'http://api.giphy.com/v1/gifs/search';
        this.apiKey = 'dc6zaTOxFJmzC';

      },
      search: function(query, limit, rating) {

        if(query === undefined) {
          return;
        }

        this.query = query || this.query;
        this.limit = limit || $('#gif-limit').val();
        this.rating = rating || $('#gif-rating').val();

        $.ajax({
          url: this.host,
          method: 'GET',
          data: {
            q: query,
            limit: this.limit,
            rating: this.rating,
            api_key: this.apiKey
          }
        }).done(this.publish);

      },
      publish: function(response) {

        var $output = $('#gif-output');
        var li = '';

        for(var i=0; i < response.data.length; i++) {

          li += '<li><div class="panel panel-default pull-left"><div class="panel-body glyphicon gif-paused"><img src="'+response.data[i].images.fixed_height_still.url+'" data-still="'+response.data[i].images.fixed_height_still.url+'" data-animated="'+response.data[i].images.fixed_height.url+'" class="gif-image" /></div><div class="panel-footer">Rating: <span>'+response.data[i].rating+'</span><div class="pull-right"><a href="'+response.data[i].source+'" target="_blank" data-toggle="tooltip" data-placement="top" title="source: '+response.data[i].source+'"><span class="glyphicon glyphicon-link gif-source"></span></a></div></div></div></li>';

        }

        $output.html(li);
        $('[data-toggle="tooltip"]').tooltip();

      }
    };
    /* End Object */

    var storage = {

      init: function() {

        this.key = 'giphyButtons';
        this.items = this.get();

      },

      get: function() {

        var items = localStorage.getItem(this.key);

        if(items !== null) {
          return JSON.parse(items);

        } else {
          return [];

        }

      },

      check: function(value) {

        return this.items.indexOf(value);

      },

      add: function(value) {

        if(this.check(value) === -1) {

          this.items.push(value);
          this.save();

        } else {

          console.log('Button already exists');

        }

      },

      remove: function(value) {

        var index = this.check(value);

        if(index > -1) {


          this.items.splice(index, 1);
          this.save();

        } else {

          console.log('Button not in local storage.');

        }

      },

      save: function() {

        this.reset();
        localStorage.setItem(this.key, JSON.stringify(this.items));

      },

      reset: function() {

        localStorage.clear();

      }

    };

    function init() {

      var buttons = storage.get();

      for(var i=0; i < buttons.length; i++) {

        addButton(buttons[i]);

      }

    }



    giphyApi.init();
    storage.init();
    init();

    // Event Listeners
    $('#gif-add').on('click', function() {

      var label = $('#gif-input').val().trim();

      if(label.length > 0) {

        if(storage.check(label) === -1) {

          addButton(label);
          storage.add(label);
          $('#gif-input').val('');

        }

        giphyApi.search(label);

      }

    });

    $('#gif-input').on('keypress', function(e) {

      if(e.which === 13) {
        $('#gif-add').trigger('click');
      }

    });

    $('#gif-categories').on('click', 'button', function(event) {

      giphyApi.search($(event.target).text());

    });

    $('#gif-categories').on('click', '.gif-btn-remove', function(event) {

      var label = $(event.target).closest('button').text().trim();
      $(event.target).closest('button').remove();

      storage.remove(label);

    });

    $('#gif-output').on('click', '.panel-body', function(event) {

      toggleAnimate($(this).find('img'));

    });

    function toggleAnimate(img) {

      var $gif = $(img);
      var url = '';

      if($gif.parent().hasClass('gif-paused')) {

        url = $gif.data('animated');
        $gif.parent().removeClass('gif-paused');

      } else {

        url = $gif.data('still');
        $gif.parent().addClass('gif-paused');

      }

      $gif.attr('src', url);

    }

    function addButton(label) {

      var $buttons = $('#gif-categories');

      $buttons.append('<button type="button" class="btn btn-default">'+label+' <span class="glyphicon glyphicon-remove gif-btn-remove"></span></button>');

    }

  });
})(jQuery);
