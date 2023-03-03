const dayFormatChange = function(day){
    const options = { weekday: 'long', month: 'long', day: 'numeric' };

    return day.toLocaleDateString("en-US",options)
};

$( function() {
    $( "#datepicker" ).datepicker({
      showOn: "button",
      buttonImage: "images/calendar.gif",
      buttonImageOnly: true,
      buttonText: "Select date"
    }).hide();
});

let datepickerDisplay = false;

$("#datepickerIcon").click(function() {
    if(!datepickerDisplay){
        $("#datepicker").show();
        datepickerDisplay = true;
    } else{
        $("#datepicker").hide();
        datepickerDisplay = false;

        let selectedDate = $("#datepicker").datepicker("getDate");  

        if(selectedDate !== null){
            $(".current-date").html(dayFormatChange(selectedDate));
            $(".day-selector").val(dayFormatChange(selectedDate));
            $("form.listEntry").submit();
        }
    }
});

$(document).ready(function(){
    $("a.fa-solid").click(function(){
        $(this).prev().attr("value","delete");
        $(this).closest("form").submit();
    });
});

function checkEmpty() {
    const inputEntry = $("#entryText");
    if (inputEntry && inputEntry.val()) {
        return true;    
    } else{
        alert("You have to write something to add a New Item");
        return false;
    }
}

