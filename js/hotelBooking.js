  $(function() {

    var link = document.querySelector('link[id=homePage]');
    var content = link.import.querySelector('#home');
    document.body.appendChild(document.importNode(content, true));   
    
    $("#datepicker").datepicker({
      dateFormat: "dd-mm-yy",
      minDate: 1,
      defaultDate: 1,
      
    });

    $('#datepicker').on('change', function(){
      createCheckoutDatePicker('#datepicker', '#datepicker1');
    });


    $('#createAcc').click(function() {


    });

    $("#getSearchResult").click(function() {
     var city = $('#searchInput').val();
     var checkInDate = $('#datepicker').datepicker("getDate");
     var checkOutDate = $('#datepicker1').datepicker("getDate");
     var errorCount1=  validateInput(city, checkInDate, checkOutDate);


      if (errorCount1 == 1) {

        $.ajax({
          type: "GET",
          url: "php/getHotels.php",
          data: "string=" + city + "&checkInDate=" + checkInDate + "&checkOutDate=" + checkOutDate,

          success: function(result) {
            result = JSON.parse(result);
              console.log(result);
              showHotels();
                  $("#checkIn").datepicker({
                    dateFormat: "dd-mm-yy",
                     minDate: 1,
                     defaultDate: 1,
                     showOptions: { direction: "up" }
                  });

                   $("#checkOut").datepicker({
                      dateFormat: "dd-mm-yy",
                      minDate:  checkInDate
                    });
                 
                 $('#checkIn').on('change', function(){
                  createCheckoutDatePicker('#checkIn', '#checkOut');
                });

              $('#search').val(city);
              $('#checkIn').val(formatDate(checkInDate));
              $('#checkOut').val(formatDate(checkOutDate));
              addRangeSelector();


            if (result['status'] == 'ok') {
          
              var hotels = result['answer'];
              var hotelsDiv = $('<ul>').addClass('list-group');
              $.each(hotels, function(index) {

                var hotel = $('<div>').addClass('list-group-item-heading').attr('id', hotels[index]['id'])
                  .append($('<a>').html(hotels[index]['name']));
                hotel.append($('<div>').addClass('row')
                  .append($('<p>').addClass('col-md-6').html(hotels[index]['street'] + ", " + hotels[index]['country']))
                  .append($('<p>').addClass('col-md-6').html("Rooms available: " + hotels[index]['emptyRooms'])));

                hotel.append($('<p>').html(hotels[index]['rating'] + "/5"));
                var listElement = $('<li>').addClass('list-group-item').append(hotel);
                hotelsDiv.append(listElement);
              });
              $('#hotels').append(hotelsDiv);
            } else if (result['status'] == 'empty'){

               $('#hotels').html("No results found. Try refining your search!");
            }
          }
        });
      }
    });

  $('#searchWithFilter').click(function(){

     var city = $('#search').val();
     var checkInDate = $('#checkIn').datepicker("getDate");
     var checkOutDate = $('#checkOut').datepicker("getDate");
     var errorCount1=  validateInput(city, checkInDate, checkOutDate);
     console.log(errorCount1);
     if(errorCount1==1){

     }

  });


  var validateInput = function(city, ciDate, coDate){

    var errorString = "Please fill the following fields:</br>";
      var errorString2 = ""
      var errors= 1;
    
      
      if (city == "") {
        errorString += errors++ +".Location / Hotel name </br>";
      }

      if (ciDate == null) {
        errorString += errors++ +".Check-in date </br>";
      } else {
          var checkInDate = formatDate(ciDate);
      }

      if (coDate == null) {
        errorString += errors++ +".Check-out date.</br>";
      } else {
        var checkOutDate = formatDate(coDate);
      }

      if (errors != 1) {
          $('.alert-success').children('span').html(errorString);
          $('.alert-success').slideDown(500).delay(3000).slideUp(500);
      }

      return errors;
  }

  var formatDate = function(date){
      return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
  };

  var createCheckoutDatePicker = function(checkin, checkout){
     var min = $(checkin).val();
      if(min > $( checkout ).val())
        $(checkout).val("");
    $( checkout ).datepicker( "destroy" );
    $(checkout).datepicker({
      dateFormat: "dd-mm-yy",
      minDate: min,
      defaultDate: min
    });
  }

  });

  var showHotels = function() {
    $('#home').hide();
    var link = document.querySelector('link[id=resultsPage]');
    var content = link.import.querySelector('#searchResults');
    document.body.appendChild(document.importNode(content, true)); 
  };

  var addRangeSelector = function(){
  $( "#amount-slider" ).slider({
      range: true,
      min: 0,
      max: 500,
      values: [ 200, 300 ],
      slide: function( event, ui ) {
        $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
      }
    });
    $( "#amount" ).val( "$" + $( "#amount-slider" ).slider( "values", 0 ) +
      " - $" + $( "#amount-slider" ).slider( "values", 1 ) );

     $( "#rating-slider" ).slider({
      range: true,
      min: 0,
      max: 5,
      values: [ 3, 5 ],
      slide: function( event, ui ) {
        $( "#rating" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
      }
    });
    $( "#rating" ).val( "$" + $( "#rating-slider" ).slider( "values", 0 ) +
      " - $" + $( "#rating-slider" ).slider( "values", 1 ) );
};