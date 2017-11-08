$(function() {
  var $search = $('.p-search_inner'),
      $regionList = $('.p-search_region_list'),
      $refineList = $('.p-search_refine_list');

  $('.p-search_btn').on('click', function() {
    $search.slideToggle(100);
  });

  $('.p-search_close').on('click', function() {
    $search.slideUp(100);
  });

  $('.p-search_select_list li').on('click', function() {
    var condition = $(this).val() == 0 ? 'region' : 'refine';

    $(this).find('p')
    .addClass('is-select');

    $(this).siblings()
    .find('p')
    .removeClass('is-select');

    $('.p-search_'+ condition +'_list')
    .slideDown(100)
    .siblings()
    .slideUp(50);
  });

  $regionList.on('click', 'li p', function() {
    $(this).parent()
    .siblings()
    .find('ul')
    .slideUp(50);

    $(this).parent()
    .siblings()
    .find('span')
    .removeClass('is-open');

    $(this).children()
    .toggleClass('is-open');

    $(this).next()
    .slideToggle(100);
  });

  $refineList.on('click', 'li p', function() {
    $(this).parent()
    .siblings()
    .find('ul')
    .slideUp(50);

    $(this).parent()
    .siblings()
    .find('span')
    .removeClass('is-open');

    $(this).children()
    .toggleClass('is-open');

    $(this).next('ul')
    .slideToggle(100);
  });

  $refineList.on('change', 'input', function() {
    var checked = $refineList.find('input:checked'),
        txt = checked.length === 0 ? '(条件未設定)' : '';

    $(this).next()
    .children('.p-search_checkbox')
    .toggleClass('is-checked');

    $('.js-refine')
    .text(txt);

    checked.each(function() {
      var item =
        $(this).next()
        .children('.p-search_refine_name')
        .text()+',';

      $('.js-refine').append(item);
    });

    if ($('.p-search_inner').find('input:checked').length === 0) {
      restaurantInit(restaurant);
    } else if(checked.length != 0) {
      restaurantSortRefine(checked);
    } else if ($regionList.find('input:checked').length != 0) {
      countName();
    } else {
      restaurantInit(restaurant);
    }
  });

  $('.js-region-reset').on('click', function() {
    $regionList.find('input:checked')
    .prop('checked', false)
    .next()
    .find('.is-checked')
    .removeClass('is-checked');

    $('.js-cities').text('(条件未設定)');
  });

  $('.js-refine-reset').on('click', function() {
    $refineList.find('input:checked')
    .prop('checked', false)
    .next()
    .find('.is-checked')
    .removeClass('is-checked');

    $('.js-refine').text('(条件未設定)');
  });

  $.ajax({
    url: '../../api/cities.json',
    dataType: 'json',
  })
  .done(function(data) {
    appregion = data;
    setRegion(data);
  })
  .fail(function() {
    console.log("error");
  })
  .always(function() {
    console.log("complete");
  });

  $.ajax({
    url: '../../api/genre.json',
    dataType: 'json',
  })
  .done(function(data) {
    appgenre = data;
    setRefine(data, "genre");
  })
  .fail(function() {
    console.log("error");
  })
  .always(function() {
    console.log("complete");
  });

  $.ajax({
    url: '../../api/atmosphere.json',
    dataType: 'json',
  })
  .done(function(data) {
    appatmosphere = data;
    setRefine(data, "atmosphere");
  })
  .fail(function() {
    console.log("error");
  })
  .always(function() {
    console.log("complete");
  });

  $.ajax({
    url: '../../api/hotword.json',
    dataType: 'json',
  })
  .done(function(data) {
    Apphotword = data;
    setRefine(data, "hotword");
  })
  .fail(function() {
    console.log("error");
  })
  .always(function() {
    console.log("complete");
  });

  $.ajax({
    url: '../../api/restaurant.json',
    dataType: 'json',
  })
  .done(function(data) {
    restaurant = data;
    restaurantInit(data);

  })
  .fail(function() {
    console.log("error");
  })
  .always(function() {
    console.log("complete");
  });

  function setRegion(data) {
    data.places.forEach(function(places) {
      var item =
        '<li>'+
          '<p class="p-search_region u-cf">'+ places.region +'<span class="p-search_select_arr u-fr"></span></p>'+
          '<ul class="p-search_cities_list js-region_'+ places.id +'">'+
          '</ul>'+
        '</li>';

      $regionList.append(item);
      setCities(places);
    });

    $('.p-search_cities_list').on('change', 'input', function() {
      var checked = $regionList.find('input:checked'),
          txt = checked.length === 0 ? '(条件未設定)' : '';

      $(this).next()
      .children('.p-search_checkbox')
      .toggleClass('is-checked');

      $('.js-cities')
      .text(txt);

      checked.each(function() {
        var item = $(this).val()+',';

        $('.js-cities').append(item);
      });


      if ($('.p-search_inner').find('input:checked').length === 0) {
        restaurantInit(restaurant);
      } else if(checked.length != 0) {
        restaurantSortCities(checked);
      } else if ($refineList.find('input:checked').length != 0) {
        countId();
      } else {
        restaurantInit(restaurant);
      }
    });
  }

  function setCities(place) {
    place.cities.forEach(function(cities, i) {
      var num = i + place.id + 1,
          item =
            '<li>'+
              '<input type="checkbox" id="'+ num +'" value="'+ cities +'">'+
              '<label for="'+ num +'" class="p-search_label">'+
                '<span class="p-search_checkbox"></span><span class="p-search_cities_name">'+ cities +'</span><span class="js-count"></span>'+
              '</label>'+
            '</li>';

      $('.js-region_' + place.id).append(item);
    });
  }

  function setRefine(data, val) {
    data[val].forEach(function(value) {
      var item =
          '<li>'+
            '<input type="checkbox" id="'+ value.id +'" value="'+ value.id +'"><label for="'+ value.id +'" class="p-search_label">'+
              '<span class="p-search_checkbox"></span><span class="p-search_refine_name">'+ value.name +'</span><span class="js-count"></span>'+
            '</label>'+
          '</li>';

      $('.p-search_'+ val +'_list').append(item);
    })
  }


  function restaurantInit(data) {
    var count;

    $('.p-search_cities_name').each(function() {
      count = countNameInit(data, $(this).text());

      $(this).next('.js-count')
      .text('('+ count +')');
    });

    $('.p-search_refine_name').each(function() {
      count = countIdInit(data, $(this).parent().prev().val());

      $(this).next('.js-count')
      .text('('+ count +')');
    });
  }

  function countNameInit(data, txt) {
    var count = 0;
    data.restaurant.forEach(function(restaurant) {
      if (txt == restaurant.cityName) count++;
    });

    return count;
  }

  function countIdInit(data, val) {
    var count = 0;
    data.restaurant.forEach(function(restaurant) {
      if(restaurant.refineId.indexOf(+val) >= 0) count++;
    });

    return count;
  }

  function restaurantSortCities(checked) {
    var count,
        item = [];

    checked.each(function() {
      var txt =
        $(this).next()
        .children('.p-search_cities_name')
        .text();

        item = sortName(item, txt);
    });

    $('.p-search_refine_name').each(function() {
      count = sortedIdCounter(item, $(this).parent().prev().val());

      $(this).next('.js-count')
      .text('('+ count +')');
    });
  }

  function sortName(v, txt) {

    restaurant.restaurant.forEach(function(restaurant) {
      if (restaurant.cityName == txt) {
        v.push(restaurant);
      }
    });
    return v;
  }

  function sortedIdCounter(data, val) {
    var count = 0;
    data.forEach(function(restaurant) {
      if(restaurant.refineId.indexOf(+val) >= 0) count++;
    });

    return count;
  }

  function restaurantSortRefine(checked) {
        var count,
        item = [];

    checked.each(function() {
      var val = $(this).val();

      item = sortId(item, +val);
    });

    $('.p-search_cities_name').each(function() {
      count = sortedNameCounter(item, $(this).text());

      $(this).next('.js-count')
      .text('('+ count +')');
    });

    $('.p-search_refine_name').each(function() {
      count = sortedIdCounter(item, $(this).parent().prev().val());

      $(this).next('.js-count')
      .text('('+ count +')');
    });
  }

  function sortId(item, val) {
    var n = [],
        r = item.length === 0 ? restaurant.restaurant : item;

    r.forEach(function(restaurant) {
      if (restaurant.refineId.indexOf(val) >= 0) {
        n.push(restaurant);
      }
    });
    return n;
  }

  function sortedNameCounter(data, txt) {
    var count = 0;
    data.forEach(function(restaurant) {
      if(restaurant.cityName == txt) count++;
    });

    return count;
  }

  function countName() {
    $('.p-search_cities_name').each(function() {
      count = countNameInit(restaurant, $(this).text());

      $(this).next('.js-count')
      .text('('+ count +')');
    });
  }

  function countId() {
    $('.p-search_refine_name').each(function() {
      count = countIdInit(restaurant, $(this).parent().prev().val());

      $(this).next('.js-count')
      .text('('+ count +')');
    });
  }
  // コメントアウト外すと、自動生成on 画面のどこかをクリックで50生成
  // var json,
  //     appgenre,
  //     appatmosphere,
  //     Apphotword,
  //     appregion,
  //     arr = {"refineId": []};

  // $('html').on('click', function() {

  //   for(var i = 0; i <= 50; i++) {
  //     createRestaurantRegion(appregion);
  //     createRestaurantRefine(appgenre, 'genre');
  //     createRestaurantRefine(appatmosphere, 'atmosphere');
  //     createRestaurantRefine(Apphotword, 'hotword');

  //     createRestaurant();
  //     arr = {"refineId": []};
  //   }
  // });
  // function createRestaurantRegion(data) {
  //   item1 = data.places[Math.floor(Math.random()*data.places.length)];
  //   regionId = item1.id;
  //   cityName = item1.cities[Math.floor(Math.random()*item1.cities.length)];

  //   json = {"regionId": regionId, "cityName": cityName};
  // }

  // function createRestaurantRefine(data, type) {
  //   num = Math.floor(Math.random()*4);

  //   for(var i = 0; i <= num; i++) {
  //     var id = data[type][Math.floor(Math.random()*data[type].length)].id;

  //     arr.refineId.push(id);
  //   }
  // }

  // function createRestaurant() {
  //   var restaurant = Object.assign(json, arr);
  //   console.log(restaurant);
  //   var item =
  //   '{<br>'+
  //   '"regionId": '+restaurant.regionId+',<br>'+
  //   '"cityName": "'+restaurant.cityName+'",<br>'+
  //   '"refineId": ['+restaurant.refineId+']<br>'+
  //   '},<br>';

  //   $('footer').append(item);
  // }
});