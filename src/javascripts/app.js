$(function() {
  var $search = $('.p-search_inner'),
      $regionList = $('.p-search_region_list'),
      $refineList = $('.p-search_refine_list');

      var json,
          appgenre,
          appatmosphere,
          Apphotword,
          appregion,
          arr = {"refineId": []};

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
      var item = $(this).val()+',';

      $('.js-refine').append(item);
    });
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
    });
  }

  function setCities(place) {
    place.cities.forEach(function(cities, i) {
      var num = i + place.id + 1,
          item =
            '<li>'+
              '<input type="checkbox" id="'+ num +'" value="'+ cities +'">'+
              '<label for="'+ num +'" class="p-search_label">'+
                '<span class="p-search_checkbox"></span><span class="p-search_cities_name">'+ cities +'</span>(num)'+
              '</label>'+
            '</li>';

      $('.js-region_' + place.id).append(item);
    });
  }

  function setRefine(data, val) {
    data[val].forEach(function(value) {
      var item =
          '<li>'+
            '<input type="checkbox" id="'+ value.id +'" value="'+ value.name +'"><label for="'+ value.id +'" class="p-search_label">'+
              '<span class="p-search_checkbox"></span><span class="p-search_'+ val +'_name">'+ value.name +'</span>(num)'+
            '</label>'+
          '</li>';

      $('.p-search_'+ val +'_list').append(item);
    })
  }

  function createRestaurantRegion(data) {
    item1 = data.places[Math.floor(Math.random()*data.places.length)];
    regionId = item1.id;
    cityName = item1.cities[Math.floor(Math.random()*item1.cities.length)];

    json = {"regionId": regionId, "cityName": cityName};
  }

  function createRestaurantRefine(data, type) {
    num = Math.floor(Math.random()*4);

    for(var i = 0; i <= num; i++) {
      var id = data[type][Math.floor(Math.random()*data[type].length)].id;

      arr.refineId.push(id);
    }
  }

  function createRestaurant() {
    var restaurant = Object.assign(json, arr);
    console.log(restaurant);
    var item =
    '{<br>'+
    '"regionId": '+restaurant.regionId+',<br>'+
    '"cityName": "'+restaurant.cityName+'",<br>'+
    '"refineId": ['+restaurant.refineId+']<br>'+
    '},<br>';

    $('footer').append(item);
  }

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
});