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

        this.query = query;
        this.limit = limit || $('#gif-limit').val();
        this.rating = rating || 'pg';

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

          li += '<li><img src="'+response.data[i].images.fixed_height_still.url+'" data-still="'+response.data[i].images.fixed_height_still.url+'" data-animated="'+response.data[i].images.fixed_height.url+'" class="gif-image gif-paused" /><p>Rating: '+response.data[i].rating+'</p></li>';

        }

        $output.html(li);

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
        console.log(this.items, value);

        if(index > -1) {


          this.items.splice(index, 1);
          this.save();
          console.log(this.items);

        } else {

          console.log('Button not in local storage.');

        }

      },

      save: function() {

        this.reset();
        localStorage.setItem(this.key, JSON.stringify(this.items));
        console.log(this.items);

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
    giphyApi.search('cats');


    // Event Listeners
    $('#gif-add').on('click', function() {

      var label = $('#gif-input').val().trim();

      if(label.length > 0 && storage.check(label) === -1) {

        addButton(label);
        storage.add(label);
        $('#gif-input').val('');

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

    $('#gif-output').on('click', 'img', function(event) {

      toggleAnimate(event.target);

    });

    function toggleAnimate(img) {

      var $gif = $(img);
      var url = '';

      if($gif.hasClass('gif-paused')) {

        url = $gif.data('animated');
        $gif.removeClass('gif-paused');

      } else {

        url = $gif.data('still');
        $gif.addClass('gif-paused');

      }

      $gif.attr('src', url);

    }

    function addButton(label) {

      var $buttons = $('#gif-categories');

      $buttons.append('<button type="button" class="btn btn-default">'+label+' <span class="glyphicon glyphicon-remove gif-btn-remove"></span></button>');

    }

  });
})(jQuery);
