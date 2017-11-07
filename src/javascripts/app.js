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
    $(this).next()
    .children()
    .toggleClass('is-checked');
  });



  $.ajax({
    url: '../../api/cities.json',
    dataType: 'json',
  })
  .done(function(data) {
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
    setGenre(data);
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
    setAtmosphere(data);
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
    setHotword(data);
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
      $(this).next()
      .children('.p-search_checkbox')
      .toggleClass('is-checked');
    });
  }

  function setCities(place) {
    place.cities.forEach(function(cities, i) {
      var cityId = i + place.id,
          item =
            '<li>'+
              '<input type="checkbox" id="'+ cityId +'" value="'+ cityId +'">'+
              '<label for="'+ cityId +'" class="p-search_label">'+
                '<span class="p-search_checkbox"></span><span class="p-search_cities_name">'+ cities +'</span>(num)'+
              '</label>'+
            '</li>';

      $('.js-region_'+ place.id).append(item);
    });
  }

  $('html').on('change', 'input:checked', function() {
    console.log($('input:checked'));
  });
});