$(function() {

    $("#datepicker").datepicker({
        dateFormat: "dd-mm-yy"
    });
    $("#datepicker1").datepicker({
        dateFormat: "dd-mm-yy"
    });

    $('#createAcc').click(function(){
        

    });

    $("#getSearchResult").click(function() {

        var errorString = "Please fill the following fields:</br>";
        var errors = 1;

        var city = $("#searchInput").val();
        if (city == "") {
            errorString += errors++ +".Location / Hotel name </br>";
        }

        var date = $("#datepicker").datepicker("getDate");
        if (date == null) {
            errorString += errors++ +".Check-in date </br>";
        } else {
            var checkInDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
        }

        date = $("#datepicker1").datepicker("getDate");
        if (date == null) {
            errorString += errors++ +".Check-out date.";
        } else {
            var checkOutDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
        }

        if (errors != 1) {

            $('.alert-success').children('span').html(errorString);
            $('.alert-success').slideDown(500).delay(2000).slideUp(500);
        } else {

            $.ajax({
                type: "GET",
                url: "php/getHotels.php",
                data: "string=" + city + "&checkInDate=" + checkInDate + "&checkOutDate=" + checkOutDate,

                success: function(result) {
                    result = JSON.parse(result);

                    if (result['status'] == 'ok') {} else {

                    }
                }
            });
        }

        console.log(city);
        console.log(checkInDate);
        console.log(checkOutDate);
    });

});