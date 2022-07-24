var DateTime = luxon.DateTime;

// CURRENT TIME IN KOREA
function updateClock() {
  var nowKST = DateTime.local().setZone("Asia/Seoul");
  // var nowPDT = DateTime.local().setZone("America/Los_Angeles");
  let opts = {
    weekday: "short",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  };
  document.getElementById("liveKST").innerHTML = nowKST.toLocaleString(opts);
  document.getElementById(
    "liveLocal"
  ).innerHTML = DateTime.local().toLocaleString(opts);
  // document.getElementById("livePDT").innerHTML = nowPDT.toLocaleString(opts);
}
// lol this is janky to make it appear instantaneously
updateClock();
setInterval(updateClock, 250); // update multiple times to avoid out-of-sync ticking

// TIME CONVERSION

// $(function() {
//   $("#datetimepicker-local").datetimepicker();
// });

$(function() {
  $("#datetimepicker-kst").datetimepicker();
});

var el;
el = document.getElementById("local-label-zone");
if (el) {
  el.innerHTML = DateTime.local().offsetNameShort;
}

el = document.getElementById("convertTimeSubmitButton");
if (el) {
  el.addEventListener("click", handleTimeConversion);
}

function handleTimeConversion() {
  let inputTime = $("#datetimepicker-kst")
    .data("DateTimePicker")
    .date();
  if (inputTime) {
    let inputTimeKST = DateTime.fromJSDate(inputTime.toDate()).setZone(
      "Asia/Seoul",
      {
        keepLocalTime: true
      }
    );
    let outputTimeLocal = inputTimeKST.toLocal();

    // '05/26/2015, 10:10 AM EDT'
    var opts = {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short"
    };
    $("#datetimepicker-local").val(
      outputTimeLocal.toLocaleString(opts).replace(/,/g, "")
    );
  }
}

$("#timeConversionForm").submit(function(e) {
  e.preventDefault();
});
