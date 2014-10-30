  $(function() {
    showHome();

    $('#confirmBooking').click(function() {
      showConfirmBooking();
    });

  
  });

  var validateInput = function(city, ciDate, coDate) {

    var errorString = "Please fill the following fields:</br>";
    var errorString2 = ""
    var errors = 1;

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

  var searchHotels = function() {
    var city = $('#searchInput').val();
    var checkInDate = $('#datepicker').datepicker("getDate");
    var checkOutDate = $('#datepicker1').datepicker("getDate");
    var errorCount1 = validateInput(city, checkInDate, checkOutDate);


    if (errorCount1 == 1) {

      $.ajax({
        type: "GET",
        url: "php/getHotels.php",
        data: "string=" + city + "&checkInDate=" + checkInDate + "&checkOutDate=" + checkOutDate,

        success: function(result) {
          result = JSON.parse(result);
          console.log(result);
          showHotels();

          copyOldValues(city, checkInDate, checkOutDate);

          var searchButton = $('#searchWithFilter');
          searchButton.before($('<ul>').addClass('list-group list-group-modified').attr('id', 'facility-list'));
          var list = $('#facility-list');
          var facilities = result['facilities'];

          $.each(facilities, function(index) {
            var option = $('<input>').attr('type', 'checkBox')
              .attr('name', 'facility')
              .attr('id', 'facOption' + facilities[index]['id'])
              .attr('value', facilities[index]['id']);

            var label = $('<label>')
              .attr('for', 'facOption' + facilities[index]['id'])
              .html('  ' + facilities[index]['name'] + '  ').append(option);

            var listElement = $('<li>').addClass('list-group-item')
              .append(label);

            list.append(listElement);
          });


          var categories = result['categories'];
          var categorySelect = $('#roomCategory');

          $.each(categories, function(i) {
            var option = $('<option>')
              .attr('id', categories[i]['id'])
              .html(categories[i]['name']);
            categorySelect.append(option);

          });
          $("#roomCategory").prop("selectedIndex", -1);
          if (result['status'] == 'ok') {

            updateResults(result['answer']);

          } else if (result['status'] == 'empty') {

            $('#hotels').html("No results found. Try refining your search!");
          }
        }
      });

    }
  }

  var formatDate = function(date) {
    return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
  };

  var formatToDisplay = function(date) {
    return ('0' + date.getDate()).slice(-2) + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear();
  };

  var createCheckoutDatePicker = function(checkin, checkout) {
    var min = $(checkin).val();
    if (min > $(checkout).val())
      $(checkout).val("");
    $(checkout).datepicker("destroy");
    $(checkout).datepicker({
      dateFormat: "dd-mm-yy",
      minDate: min,
      defaultDate: min,
      beforeShow: function() {
        setTimeout(function() {
          $('.ui-datepicker').css('z-index', 99);
        }, 0);
      }
    });
  }

  var filterResults = function() {

    var city = $('#search').val();
    var checkInDate = $('#checkIn').datepicker("getDate");
    var checkOutDate = $('#checkOut').datepicker("getDate");
    var errorCount1 = validateInput(city, checkInDate, checkOutDate);

    if (errorCount1 == 1) {
      var facReq = "";
      var numSelected = 0;
      $(':checkbox:checked').each(function(i) {
        facReq += parseInt($(this).val()) + '|';
        numSelected++;
      });
      facReq = facReq.substring(0, facReq.length - 1);

      $('#hotels').empty();
      $("#progressbar").progressbar({
        value: false
      });

      $.ajax({
        type: "GET",
        url: "php/getFilteredHotels.php",
        data: "string=" + city + "&checkInDate=" + checkInDate + "&checkOutDate=" + checkOutDate + "&pMin=" + $('#amount-slider').slider('values')[0] + "&pMax=" + $('#amount-slider').slider('values')[1] + "&rMin=" + $('#rating-slider').slider('values')[0] + "&rMax=" + $('#rating-slider').slider('values')[1] + "&fac=" + facReq + "&numF=" + numSelected + "&cat=" + $('#roomCategory').children(":selected").attr("id"),

        success: function(result) {
          console.log(result);
          result = JSON.parse(result);
          $("#progressbar").progressbar("destroy");
          if (result['status'] == 'ok') {
            updateResults(result['answer']);

          } else {
            $('#hotels').html("No results found. Try refining your search!");
          }

        }

      });
    }
  }

  var updateResults = function(hotels) {
    var hotelsDiv = $('<ul>').addClass('list-group list-group-modified');
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

  }

  var showHotels = function() {
    $('#home').hide();
    var link = document.querySelector('link[id=resultsPage]');
    var content = link.import.querySelector('#searchResults');
    document.body.appendChild(document.importNode(content, true));
    $('#searchWithFilter').bind('click', filterResults);
    $('#checkIn').on('change', function() {
      createCheckoutDatePicker('#checkIn', '#checkOut');
    });

    $("#checkIn").datepicker({
      dateFormat: "dd-mm-yy",
      minDate: 1,
      defaultDate: 1,
      showOptions: {
        direction: "up"
      },
      beforeShow: function() {
        setTimeout(function() {
          $('.ui-datepicker').css('z-index', 99);
        }, 0);
      }
    })

  };

  var showSignIn = function() {
    $('#home').hide();
    var link = document.querySelector('link[id=signInPage]');
    var content = link.import.querySelector('#signIn');
    document.body.appendChild(document.importNode(content, true));
  };

  var copyOldValues = function(city, checkInDate, checkOutDate) {

    $("#checkOut").datepicker({
      dateFormat: "dd-mm-yy",
      minDate: checkInDate,
      beforeShow: function() {
        setTimeout(function() {
          $('.ui-datepicker').css('z-index', 99);
        }, 0);
      }
    })


    $('#search').val(city);
    $('#checkIn').val(formatToDisplay(checkInDate));
    $('#checkOut').val(formatToDisplay(checkOutDate));
    addRangeSelector();

  }


  var showConfirmBooking = function() {
    $('#home').hide();
    $('#signUp').hide();
    var link = document.querySelector('link[id=confirmBookingPage]');
    var content = link.import.querySelector('#confirmBooking');
    document.body.appendChild(document.importNode(content, true));
  };

  var showHome = function() {

    $('#signUp').hide();
    if (($.find('#home')).length == 0) {
      var link = document.querySelector('link[id=homePage]');
      var content = link.import.querySelector('#home');
      document.body.appendChild(document.importNode(content, true));
      $('#createAcc').bind('click', showSignUp);
      $('#signIn').bind('click', showSignIn);

      $("#datepicker").datepicker({
        dateFormat: "dd-mm-yy",
        minDate: 1,
        defaultDate: 1,

      });

      $('#datepicker').on('change', function() {
        createCheckoutDatePicker('#datepicker', '#datepicker1');
      });

      $('#getSearchResult').bind('click', searchHotels);
    } else
      $('#home').show();
  };

  var showSignUp = function() {
    $('#home').hide();
    if (($.find('#signUp')).length == 0) {
      var link = document.querySelector('link[id=signUpPage]');
      var content = link.import.querySelector('#signUp');
      document.body.appendChild(document.importNode(content, true));
      $('#goBack').bind('click', showHome);
      $('#signInBtn').bind('click', signIn);
      $('#signUpBtn').bind('click', signUp);

      $("#datepickerSignUp").datepicker({
        dateFormat: "dd-mm-yy",
        minDate: 1,
        defaultDate: 1,

      });
    } else
      $('#signUp').show();
  };

  var addRangeSelector = function() {
    $("#amount-slider").slider({
      range: true,
      min: 0,
      max: 500,
      values: [000, 500],
      slide: function(event, ui) {
        $("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
      }
    });
    $("#amount").val("$" + $("#amount-slider").slider("values", 0) +
      " - $" + $("#amount-slider").slider("values", 1));

    $("#rating-slider").slider({
      range: true,
      min: 0,
      max: 5,
      values: [0, 5],
      slide: function(event, ui) {
        $("#rating").val("$" + ui.values[0] + " - $" + ui.values[1]);
      }
    });
    $( "#rating" ).val( "$" + $( "#rating-slider" ).slider( "values", 0 ) +
      " - $" + $( "#rating-slider" ).slider( "values", 1 ) );
};

var validateSignIn = function(username,password) {

    var errorString = "Please fill the following fields:</br>";
    var errorString2 = ""
    var errors = 1;


    if (username == "") {
      errorString += errors++ +".Location / Username </br>";
    }

    if (password == "") {
      errorString += errors++ +".Location / Password </br>";
    }

    if (errors != 1) {
      $('.alert-success').children('span').html(errorString);
      $('.alert-success').slideDown(500).delay(3000).slideUp(500);
    }

    return errors;
  }

  var signIn = function() {
  
     var username = $('#signInUsername').val();
      var password = $('#signInPassword').val();
      var errorCount1 = validateSignIn(username, password);



      if (errorCount1 == 1) {

        $.ajax({
          type: "GET",
          url: "php/login.php",
          data: "username=" + username + "&pass=" + password,

          success: function(result) {
            result = JSON.parse(result);
              console.log(result);


            if (result['status'] == 'Success') {
              showConfirmBooking();

            var name = result['name'];
            $('#displayName').html("Welcome " + name);

            $('.alert-success').children('span').html("Welcome " + name);
            $('.alert-success').slideDown(500);

          } else if (result['status'] == 'Fail') {

            $('.alert-success').children('span').html("Login Failed! Please enter correct email and password!");
            $('.alert-success').slideDown(500);
          }
                             
            }
      
    });
      }
    
};

var validateSignUp = function(name, email, dob, username, password, confirmPassword, unitNo, street, country, postal, contact) {

    var errorString = "Please fill the following fields:</br>";
    var errorString2 = "Password and Confirm Password do not match!"
    var errors = 1;

    if (name == "") {
      errorString += errors++ +".Location / Name </br>";
    }

    if (email == "") {
      errorString += errors++ +".Location / Email </br>";
    }
    if (dob == null) {
      errorString += errors++ +".Date of Birth </br>";
    } else {
      var checkInDate = formatDate(dob);
    }
    if (username == "") {
      errorString += errors++ +".Location / Username </br>";
    }

    if (password == "") {
      errorString += errors++ +".Location / Password </br>";
    }

    if (confirmPassword == "") {
      errorString += errors++ +".Location / Confirm Password </br>";
    }

    if (unitNo == "") {
      errorString += errors++ +".Location / Unit Number </br>";
    }
    if (street == "") {
      errorString += errors++ +".Location / Street Name </br>";
    }

    if (country == "") {
      errorString += errors++ +".Location / Country </br>";
    }

    if (postal == "") {
      errorString += errors++ +".Location / Postal Code </br>";
    }

    if (contact == "") {
      errorString += errors++ +".Location / Contact Number </br>";
    }

    if (password != confirmPassword) {
      $('.alert-success').children('span').html(errorString2);
      $('.alert-success').slideDown(500).delay(3000).slideUp(500);
    }

    if (errors != 1) {
      $('.alert-success').children('span').html(errorString);
      $('.alert-success').slideDown(500).delay(3000).slideUp(500);
    }

    return errors;
  }

  var signUp = function() {
  
      var name = $('#signUpName').val();
      var email = $('#signUpEmail').val();
      var dob = $('#datepickerSignUp').datepicker("getDate");
      var username = $('#signUpUsername').val();
      var password = $('#signUpPass').val();
      var confirmPassword = $('#signUpConfirmPass').val();
      var unitNo = $('#unitNo').val();
      var street = $('#street').val();
      var country = $('#country').val();
      var postal = $('#postal').val();
      var contact = $('#contact').val();
      var errorCount1 = validateSignUp(name, email, dob, username, password, confirmPassword, unitNo, street, country, postal, contact);



      if (errorCount1 == 1) {

        $.ajax({
          type: "GET",
          url: "php/signUp.php",
          data: "name=" + name + "&email=" + email + "&dob=" + dob + "&username=" + username + "&password=" + password + "&unitNo=" + unitNo
          + "&street=" + street + "&country=" + country + "&postal=" + postal + "&contact=" + contact,

          success: function(result) {
            result = JSON.parse(result);
              console.log(result);


            if (result['status'] == 'Success') {

            var name = result['name'];
            $('.alert-success').children('span').html("Hi " + name + ", your account has been successfully created!");
            $('.alert-success').slideDown(500);

          } else if (result['status'] == 'Fail') {

            $('.alert-success').children('span').html("Sign Up Failed!");
            $('.alert-success').slideDown(500);
          }
          else if (result['status'] == 'Exist') {

            $('.alert-success').children('span').html("Username is existing!");
            $('.alert-success').slideDown(500);
          }
                             
            }
      
    });
      }
    
};

