$(function() {
  showHome();

});

var loginUId = -1;

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
    var cinDate  = formatDate(checkInDate);
    var coutDate = formatDate(checkOutDate);
    $.ajax({
      type: "GET",
      url: "php/getHotels.php",
      data: "string=" + city + "&checkInDate=" + cinDate + "&checkOutDate=" + coutDate,

      success: function(result) {
        result = JSON.parse(result);
        console.log(result);
        showHotels();
        copyOldValues(city, checkInDate, checkOutDate);
        $('#hotels').empty();
        var searchButton = $('#searchWithFilter');
        if($('#facilities').find('#facility-list').length == 0){
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
      }
        if (result['status'] == 'ok') {

          updateResults(result['answer']);
          $('#hotels').find('a').bind('click',[cinDate, coutDate, 1] ,hotelSelected);

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
    checkInDate = formatDate(checkInDate);
    checkOutDate = formatDate(checkOutDate);

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
          $('#hotels').find('a').bind('click',[checkInDate, checkOutDate,  $('#roomCategory').children(":selected").attr("id")] ,hotelSelected);

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

    var hotel = $('<div>').addClass('list-group-item-heading')
      .append($('<a>').html(hotels[index]['name']).attr('id', hotels[index]['id']));
    hotel.append($('<div>').addClass('row')
      .append($('<p>').addClass('col-md-6').html(hotels[index]['street'] + ", " + hotels[index]['country']))
      .append($('<p>').addClass('col-md-6').html("Rooms available: " + hotels[index]['emptyRooms'])));

    hotel.append($('<p>').html("Rating: " + hotels[index]['rating'] + "/5"));
    var listElement = $('<li>').addClass('list-group-item').append(hotel);
    hotelsDiv.append(listElement);
  });
  $('#hotels').append(hotelsDiv);

}

var hotelSelected = function(event){
  var checkOutDate = event.data[1];
  var checkInDate = event.data[0];
  var cid = event.data[2];
  var hid = parseInt($(this).attr('id'));

}

var showHotels = function() {
  $('#home').hide();

  if ($.find('#searchResults').length == 0) {
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
    });
  } else {
    $('#searchResults').show();
  }
  if(loginUId==-1){
    $('#searchLogout').hide();
     $('#searchCreateAcc').show();
     $('#searchCreateAcc').bind('click', showSignUp);
  }
  else{
    $('#searchCreateAcc').hide();
    $('#searchLogout').show();
    $('#searchLogout').bind('click', showLogout);

  }

};

var getBookingRecord = function(booking) {
  var bookingsDiv = $('<ul>').addClass('list-group list-group-modified');
  $.each(booking, function(index, value) {
    console.log(value);
    var bookings = $('<div>').addClass('list-group-item-heading').attr('bId', value['bId'])
      .append($('<a>').html(booking[index]['hName']));
    bookings.append($('<div>').addClass('row')
      .append($('<p>').addClass('col-md-8').html(booking[index]['unitNo'] + ", " + booking[index]['street'] + ", " + booking[index]['country'] + " (" + booking[index]['postalCode'] + ")")));
    bookings.append($('<p>').html("Hotel contact: " + booking[index]['contact']));
    bookings.append($('<p>').html("Room Type: " + booking[index]['roomName']));
    bookings.append($('<p>').html("Booking Date: " + booking[index]['bookingDate']));
    bookings.append($('<p>').html("Check In Date: " + booking[index]['checkInDate']));
    bookings.append($('<p>').html("Duration: " + booking[index]['duration'] + " days"));
    bookings.append($('<p>').html("Room Price: " + booking[index]['roomPrice']));
    bookings.append($('<p>').html("Total Price: " + booking[index]['totalPrice']));
    bookings.append($('<p>').html("Status: " + booking[index]['status']));

    var listElement = $('<li>').addClass('list-group-item').append(bookings);
    bookingsDiv.append(listElement);
  });
  $('#bookingReturned').append(bookingsDiv);

}


var showBookingRecord = function(loginUId) {

  $.ajax({
    type: "GET",
    url: "php/userBooking.php",
    data: "uId=" + loginUId,

    success: function(result) {
      result = JSON.parse(result);

      var rows = result['rows'];


      if (result['status'] == 'Empty') {
        $('#editBooking').hide();
        $('#bookingReturned').html("You have " + rows + " booking.");
      }

      if (result['status'] == 'Fail') {
        $('#bookingReturned').html("Fail to get bookings. Rows = " + rows);
      }


      $.ajax({
        type: "GET",
        url: "php/getBookingSummary.php",
        data: "hId=" + hId + "&cId=" + cId + "&checkInDate=" + checkInDate + "&checkOutDate=" + checkOutDate,

      if (result['status'] == 'Success') {
        $('#bookingReturned').html("You have " + rows + " booking.");
        getBookingRecord(result['answer']);


      }

    }
  });

}

var showHotelDetails = function(hId, cId, checkInDate, checkOutDate) {

  $.ajax({
    type: "GET",
    url: "php/getBookingSummary.php",
    data: "hId=" + hId + "&cId=" + cId,

    success: function(result) {
      result = JSON.parse(result);

      var categoryName = result['cName'];
      var price = result['price'];

      if (result['status'] == 'Fail') {
        $('#bookingDetails').html("Fail to get details.");
      }

      if (result['status'] == 'Success') {
        $('#bookingDetails').html("The price for " + categoryName + " from " + checkInDate + " to " + checkOutDate + " is $ " + price);
        getBookingDetails(result['answer']);

      }

    }
  });

}

var getHotelDetails = function(hotelDetails) {
  var hotelDiv = $('<ul>').addClass('list-group list-group-modified');
  $(hotelDetails, function() {
    var hotel = $('<div>').addClass('list-group-item-heading').attr('hId', hotelDetails['hId'])
      .append($('<a>').html(hotelDetails[index]['hName']));
    hotel.append($('<div>').addClass('row')
      .append($('<p>').addClass('col-md-8').html(hotelDetails['unitNo'] + ", " + hotelDetails['street'] + ", " + hotelDetails['country'] + " (" + hotelDetails['postalCode'] + ")")));
    hotel.append($('<p>').html("Hotel contact: " + hotelDetails['contact']));
    hotel.append($('<p>').html("Hotel Rating: " + hotelDetails['rating']));


    var listElement = $('<li>').addClass('list-group-item').append(hotel);
    hotelDiv.append(listElement);
  });
  $('#detailsReturned').append(hotelDiv);

}

var showLogout = function() {
  loginUId = -1;
  $('#signUp').hide();
  $('#confirmBooking').hide();
  showHome();
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
  if (($.find('#confirmBooking')).length == 0) {
    var link = document.querySelector('link[id=confirmBookingPage]');
    var content = link.import.querySelector('#confirmBooking');
    document.body.appendChild(document.importNode(content, true));
    $('#makeBooking').bind('click', showHome);
    $('#logout').bind('click', showLogout);
  } else
    $('#confirmBooking').show();

};

var showBookingDetails = function() {
  $('#home').hide();
  $('#signUp').hide();
  $('#confirmBooking').hide();
  $('#searchResults').hide();
  if (($.find('#bookingDetails')).length == 0) {
    var link = document.querySelector('link[id=bookingDetailsPage]');
    var content = link.import.querySelector('#bookingDetails');
    document.body.appendChild(document.importNode(content, true));
    $('#makeBooking').bind('click', createBooking);
    $('#cancelBooking').bind('click', showHome);
    $('#bookingLogout').bind('click', showLogout);
  } else
    $('#bookingDetails').show();

};


var createBooking = function(uId, hId, roomNo, bookingDate, checkInDate, duration, guests, status) {

  $.ajax({
    type: "GET",
    url: "php/insertBooking.php",
    data: "uId=" + uId + "&hId=" + hId + "&roomNo=" + roomNo + "&bookingDate=" + bookingDate + "&checkInDate=" + checkInDate + "&duration=" + duration + "&guests=" + guests + "&status=" + status,

    success: function(result) {
      result = JSON.parse(result);
      console.log(result);

      if (result['status'] == 'Success') {
        $('.alert-success').children('span').html("Your booking has been successfully made!");
        $('.alert-success').slideDown(500);

      } else if (result['status'] == 'Fail') {

        $('.alert-success').children('span').html("Failed to make booking!");
        $('.alert-success').slideDown(500);
      }

    }

  });


};

var showHome = function() {

  $('#signUp').hide();
  $('#confirmBooking').hide();
  $('#admin').hide();

  if (($.find('#home')).length == 0) {
    var link = document.querySelector('link[id=homePage]');
    var content = link.import.querySelector('#home');
    document.body.appendChild(document.importNode(content, true));

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

  if (loginUId == -1) {
    $('#homeLogout').hide();
    $('#createAcc').show();
    $('#createAcc').bind('click', showSignUp);
  } else {
    $('#homeLogout').show();
    $('#homeLogout').bind('click', showLogout);
    $('#createAcc').hide();
  }
};

var showSignUp = function() {
  $('#home').hide();
  $('#searchResults').hide();

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

var showAdminPanel = function() {
  $('#home').hide();
  $('#signUp').hide();
  $('#searchResults').hide();


  if (($.find('#admin')).length == 0) {
    var link = document.querySelector('link[id=adminPage]');
    var content = link.import.querySelector('#admin');
    document.body.appendChild(document.importNode(content, true));

  } else
    $('#adminPanel').show();

      updateHotelDetails();

      $('#modify-hotel').bind('change', fillDetailsForHotel);
      $('#update-hotel-button').bind('click', updateHotel);
      $('#delete-hotel-button').bind('click', deleteHotel);
      $('#add-hotel-button').bind('click', addHotel);
        $('#adminLogout').bind('click', showHome);

  $('#myTab a').click(function(e) {
    e.preventDefault();
    $(this).tab('show');
  });
};

var addHotel = function(){

  var div = $('#addHotel');

  var name = $(div).children('#name').val();
  var unit = $(div).children('#unit').val();
  var street = $(div).children('#street').val();
  var country = $(div).children('#country').val();
  var postal = $(div).children('#code').val();
  var contact = $(div).children('#contact').val();
  var rating = $(div).children('#rating').val();

  var errorCount = validateHotelFields(1,name, unit, street, country, postal, contact, rating);

  if(errorCount==1){
    var newFacilities = [];
    $.each($('#add-fac').children(':selected'), function(index, value){
      newFacilities.push(($(value).attr('id')));
    });
    newFacilities = JSON.stringify(newFacilities);
    
    $.ajax({
      url: 'php/addHotel.php',
      data: 
      'name=' + name + '&unit=' + unit + '&street=' + street + '&country=' + country
      + '&postal=' + postal + '&contact=' + contact + '&rating=' + rating +'&fac=' + newFacilities,
      type: 'POST',
      success: function(result){
        console.log(result);
        result = JSON.parse(result);
         
         if(result['status'] =='ok'){
           $('.alert-success').children('span').html("Successfully added hotel- " + name);
           $('.alert-success').slideDown(500).delay(3000).slideUp(500);
           updateHotelDetails();

         }
         else{
          $('.alert-success').children('span').html(result['status']);
          $('.alert-success').slideDown(500).delay(3000).slideUp(500);
         }
      }
    });
}
}

var deleteHotel = function() {
  var hotelsToDelete="";
  var hotelNames = "";
  var count=0;
  $('#remove-hotel').children(':selected').each(function(index, value){
    hotelsToDelete += ($(value).attr('id') + '|');
    hotelNames += $(value).val() + "</br>";
    count++;
  });
   if(count !=0){
    hotelsToDelete = hotelsToDelete.substring(0, hotelsToDelete.length - 1);
    bootbox.confirm("You are about to delete "+ count + " hotels. Are you sure you want to continue ?", function(result){
      if(result){
      $.ajax({
        url: 'php/deleteHotels.php',
        type: 'POST',
        data: 'ids=' +hotelsToDelete,
        success: function(result){
           console.log(result);
          result = JSON.parse(result);
         
       
          if(result['status'] =='ok'){
           $('.alert-success').children('span').html("Successfully deleted: </br>" + hotelNames);
           $('.alert-success').slideDown(500).delay(3000).slideUp(500);
           updateHotelDetails();
         }
         else{
           $('.alert-success').children('span').html(result['status']);
           $('.alert-success').slideDown(500).delay(3000).slideUp(500);
         }
        }
      });
    }
    });
  }
  else{
   $('.alert-success').children('span').html("Select atleast one hotel to delete!");
  $('.alert-success').slideDown(500).delay(3000).slideUp(500);
  }

};

var updateHotel = function() {
  var div = $('#hotel-details');
  var id=  parseInt($('#modify-hotel').children(':selected').attr('id'));
  var name = $(div).children('#name').val();
  var unit = $(div).children('#unit').val();
  var street = $(div).children('#street').val();
  var country = $(div).children('#country').val();
  var postal = $(div).children('#code').val();
  var contact = $(div).children('#contact').val();
  var rating = $(div).children('#rating').val();

  var errorCount = validateHotelFields(id,name, unit, street, country, postal, contact, rating);

  if(errorCount==1){
    var newFacilities = [];
    $.each($('#mod-fac').children(':selected'), function(index, value){
      newFacilities.push(($(value).attr('id')));
    });
    newFacilities = JSON.stringify(newFacilities);
    
    $.ajax({
      url: 'php/updateHotel.php',
      data: 'id=' + id
      + '&name=' + name + '&unit=' + unit + '&street=' + street + '&country=' + country
      + '&postal=' + postal + '&contact=' + contact + '&rating=' + rating +'&fac=' + newFacilities,
      type: 'POST',
      success: function(result){
        console.log(result);
        result = JSON.parse(result);
         
         if(result['status'] =='ok'){
           $('.alert-success').children('span').html("Successfully updated hotel!");
           $('.alert-success').slideDown(500).delay(3000).slideUp(500);
           updateHotelDetails();

         }
         else{
          $('.alert-success').children('span').html(result['status']);
          $('.alert-success').slideDown(500).delay(3000).slideUp(500);
         }
      }
    });
  }
};

var updateHotelDetails = function(){
 $.ajax({
    type: "GET",
    url: "php/getHotelsForAdmin.php",
    success: function(result) {
      result = JSON.parse(result);
      if (result['status'] == 'ok') {
        var hotels = result['answer'];
        var facilities = result['facilities'];
        var categories = result['categories'];
        var s = $('#remove-hotel');
        var k = $('#modify-hotel');
        k.empty();
        k.append($('<option selected="true" id="0" style="display:none;">Select a hotel</option>'));
        s.empty();

        $.each(hotels, function(index) {
          var option = $('<option>').html(hotels[index][1]).attr('id', hotels[index][0]);
          k.append(option.clone());
          s.append(option.clone());
        });
        var s = $('.facilities-list');
        s.empty();
        $.each(facilities, function(index) {
          var option = $('<option>').html(facilities[index]['name']).attr('id', facilities[index]['id']);
          s.append(option.clone());

        });
      }
    }
  });
      
}

var validateHotelFields = function(id,name, unit, street, country, postal, contact, rating){
  var errorString = "Please correct the following errors: </br>";
  var errors = 1;

  if(id==0){
    errorString += errors++ +".Please select a hotel </br>";
  }

  if (name == "") {
    errorString += errors++ +".Hotel name should not be blank </br>";
  }

  if (unit == "") {
    errorString += errors++ +".Unit-No should not be blank</br>";
  }

  if (street == "") {
    errorString += errors++ +".Street should not be blank</br>";
  }

  if(country == ""){
     errorString += errors++ +".Country should not be blank</br>";
  }

  if(!(($.isNumeric(postal) && Math.floor(postal) == postal) || postal=="")){
    errorString += errors++ +".Postal Code is invalid</br>";
  }

  if(!(($.isNumeric(contact) && Math.floor(contact) == contact) || contact=="")){
    errorString += errors++ +".Contact number is invalid</br>";
  }

  if(!(($.isNumeric(rating) && rating <= 5 && rating >=0) || rating == "")){
    errorString += errors++ +".Rating is invalid</br>";
  }

  if (errors != 1) {
    $('.alert-success').children('span').html(errorString);
    $('.alert-success').slideDown(500).delay(3000).slideUp(500);
  }

  return errors;

}

var fillDetailsForHotel = function() {
  var optionId = parseInt($(this).children(':selected').attr('id'));
  $.ajax({
    url: "php/getFacilitiesForHotel.php",
    type: "GET",
    data: "id=" + optionId,
    success: function(result) {
      result = JSON.parse(result);
      if (result['status'] == 'ok') {
         $('#hotel-details').css('display', 'visible');

        var hotelDetails = $('#hotel-details').children();

        $.each(hotelDetails, function(index) {
          $(hotelDetails[index]).val(result['details'][index + 1]);
        });
        var hotelFacilities = result['facilities'];
        var facList = $('#mod-fac');
        $.each(hotelFacilities, function(index) {
          facList.children('#' + hotelFacilities[index]).attr('selected', 'true');
        });
       
            }
    }
  });
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
  $("#rating").val($("#rating-slider").slider("values", 0) +
    " - " + $("#rating-slider").slider("values", 1));
};

var validateSignIn = function(username, password) {

  var errorString = "Please fill the following fields:</br>";
  var errorString2 = ""
  var errors = 1;


  if (username == "") {
    errorString += errors++ +". Username </br>";
  }

  if (password == "") {
    errorString += errors++ +". Password </br>";
  }

  if (errors != 1) {
    $('.alert-success').children('span').html(errorString);
    $('.alert-success').slideDown(500).delay(3000).slideUp(500);
  }

  return errors;
}

var signIn = function() {
  $('#logout').bind('click', showLogout);

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
        //show
        console.log(result);

        loginUId = result['uId'];
        var name = result['name'];
        if (result['status'] == 'Success') {
          if(loginUId ==1)
            showAdminPanel();
          else
         {showConfirmBooking();

          $('#displayName').html("Welcome " + name);
          showBookingRecord(loginUId);
        }


        } else if (result['status'] == 'Fail') {

          $('.alert-success').children('span').html("Login Failed! Please enter correct email and password!");
          $('.alert-success').slideDown(500).delay(3000).slideUp(500);
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
    errorString += errors++ +". Name </br>";
  }
  if (email == "") {
    errorString += errors++ +". Email </br>";
  }
  if (dob == null) {
    errorString += errors++ +".Date of Birth </br>";
  } else {
    var checkInDate = formatDate(dob);
  }
  if (username == "") {
    errorString += errors++ +". Username </br>";
  }

  if (password == "") {
    errorString += errors++ +". Password </br>";
  }

   if (confirmPassword == "") {
    errorString += errors++ +". Confirm Password </br>";
  }

  if (password != confirmPassword) {
      errorString += errors++ +". Password and Confirm Password do not match </br>";
  }

  if (unitNo == "") {
    errorString += errors++ +". Unit Number </br>";
  }
  if (street == "") {
    errorString += errors++ +". Street Name </br>";
  }

  if (country == "") {
    errorString += errors++ +". Country </br>";
  }

  if (postal == "") {
    errorString += errors++ +". Postal Code </br>";
  }
  if (contact == "") {
    errorString += errors++ +". Contact Number </br>";
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
  var dateOfBirth = formatDate(dob);



        $.ajax({
          type: "GET",
          url: "php/signUp.php",
          data: "name=" + name + "&email=" + email + "&dob=" + dateOfBirth + "&username=" + username + "&password=" + password + "&unitNo=" + unitNo
          + "&street=" + street + "&country=" + country + "&postal=" + postal + "&contact=" + contact,

  if (errorCount1 == 1) {

    $.ajax({
      type: "GET",
      url: "php/signUp.php",
      data: "name=" + name + "&email=" + email + "&dob=" + dob + "&username=" + username + "&password=" + password + "&unitNo=" + unitNo + "&street=" + street + "&country=" + country + "&postal=" + postal + "&contact=" + contact,

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
        } else if (result['status'] == 'Exist') {

          $('.alert-success').children('span').html("Username is existing!");
          $('.alert-success').slideDown(500);
        }

      }

    });
  }

};
