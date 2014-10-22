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
        var errorString2 = "Check-in date must be before Check-out date</br>"
        var errorCount1 = 1;
        var errorCount2 = 1;

        var city = $("#searchInput").val();
        if (city == "") {
            errorString += errorCount1++ +".Location / Hotel name </br>";
        }

        var ciDate = $("#datepicker").datepicker("getDate");
        if (ciDate == null) {
            errorString += errorCount1++ +".Check-in date </br>";
        } else {
            var checkInDate = ciDate.getFullYear() + '-' + ('0' + (ciDate.getMonth() + 1)).slice(-2) + '-' + ('0' + ciDate.getDate()).slice(-2);
        }

        var coDate = $("#datepicker1").datepicker("getDate");
        if (coDate == null) {
            errorString += errorCount1++ +".Check-out date.";
        } else {
            var checkOutDate = coDate.getFullYear() + '-' + ('0' + (coDate.getMonth() + 1)).slice(-2) + '-' + ('0' + coDate.getDate()).slice(-2);
            if(checkInDate && (ciDate > coDate)){
            errorString += "Check-in date must be before check-out date</br>";
            errorCount2++;
            }
        }

        if (errorCount1 != 1) {

            $('.alert-success').children('span').html(errorString);
            $('.alert-success').slideDown(500).delay(2000).slideUp(500);
        }
        else if(errorCount2 !=1){
             $('.alert-success').children('span').html(errorString2);
            $('.alert-success').slideDown(500).delay(2000).slideUp(500);

        }
         else {

            $.ajax({
                type: "GET",
                url: "php/getHotels.php",
                data: "string=" + city + "&checkInDate=" + checkInDate + "&checkOutDate=" + checkOutDate,

                success: function(result) {
                    result = JSON.parse(result);

                    if (result['status'] == 'ok') {
                        console.log(result);
                        showHotels();           
                    } else {

                    }
                }
            });
        }
    });

});

var showHotels = function(){

};