$(function(){

	 $( "#datepicker" ).datepicker({ dateFormat: "dd-mm-yy" });
	 $( "#datepicker1" ).datepicker({ dateFormat: "dd-mm-yy" });

$("#getSearchResult").click(function(){

	var checkInDate = $("#datepicker").datepicker("getDate");
	var checkOutDate = $("#datepicker1").value;
	console.log(checkInDate);
});

});
