  $(function() {

    var link = document.querySelector('link[id=homePage]');
    var content = link.import.querySelector('#home');
    document.body.appendChild(document.importNode(content, true));   

    $("#datepicker").datepicker({
      dateFormat: "dd-mm-yy"
    });
    $("#datepicker1").datepicker({
      dateFormat: "dd-mm-yy"
    });

    $('#createAcc').click(function() {


    });

    $("#getSearchResult").click(function() {

      var errorString = "Please fill the following fields:</br>";
      var errorString2 = ""
      var errorCount1 = 1;
      var errorCount2 = 1;

      var city = $("#searchInput").val();
      if (city == "") {
        errorString += errorCount1++ +".Location / Hotel name </br>";
        console.log("jsf");
      }

      var ciDate = $("#datepicker").datepicker("getDate");
      if (ciDate == null) {
        errorString += errorCount1++ +".Check-in date </br>";
      } else {
        if (ciDate < new Date()) {
          errorString2 += "Check-in date chosen has already past</br>";
          errorCount2++;
        } else
          var checkInDate = ciDate.getFullYear() + '-' + ('0' + (ciDate.getMonth() + 1)).slice(-2) + '-' + ('0' + ciDate.getDate()).slice(-2);
      }

      var coDate = $("#datepicker1").datepicker("getDate");
      if (coDate == null) {
        errorString += errorCount1++ +".Check-out date.</br>";
      } else {
        var checkOutDate = coDate.getFullYear() + '-' + ('0' + (coDate.getMonth() + 1)).slice(-2) + '-' + ('0' + coDate.getDate()).slice(-2);
        if (checkInDate && (ciDate > coDate)) {
          errorString2 += "Check-in date must be before check-out date</br>";
          errorCount2++;
        }
      }

      if (errorCount1 != 1 || errorCount2 != 1) {
        if (errorCount1 == 1)
          $('.alert-success').children('span').html(errorString2);
        else
          $('.alert-success').children('span').html(errorString + errorString2);
        $('.alert-success').slideDown(500).delay(3000).slideUp(500);
      }
      if (errorCount1 == 1 && errorCount2 == 1) {

        $.ajax({
          type: "GET",
          url: "php/getHotels.php",
          data: "string=" + city + "&checkInDate=" + checkInDate + "&checkOutDate=" + checkOutDate,

          success: function(result) {
            result = JSON.parse(result);

            if (result['status'] == 'ok') {
              console.log(result);
              showHotels();
              var hotels = result['answer'];
              var hotelsDiv = $('<ul>').addClass('list-group');
              $.each(hotels, function(index) {

                var hotel = $('<div>').addClass('list-group-item-heading').attr('id', hotels[index]['id'])
                  .append($('<a>').html(hotels[index]['name']));
                hotel.append($('<div>').addClass('row')
                  .append($('<p>').addClass('col-md-6').html(hotels[index]['street'] + ", " + hotels[index]['country']))
                  .append($('<p>').addClass('col-md-6').html("Rooms available: " + hotels[index]['emptyRooms'])));

                hotel.append($('<p>').html(hotels[index]['rating'] + "/5"));
                var listElement = $('<li>').addClass('list-group-item col-md-5 col-md-offset-2').append(hotel);
                hotelsDiv.append(listElement);
              });
              $('#hotels').append(hotelsDiv);
            } else if (result['status'] == 'empty'){
               console.log(result);
               showHotels();
               $('#hotels').html("No results found. Try refining your search!");
            }
          }
        });
      }
    });

  });

  var showHotels = function() {
    $('#home').hide();
    var link = document.querySelector('link[id=resultsPage]');
    var content = link.import.querySelector('#searchResults');
    document.body.appendChild(document.importNode(content, true)); 
  };