// content.js
function click_handler() {
	console.log("hi");
	var x = $("a.fill");
	console.log(x[x.length - 1]);
	if (x[x.length - 1].children.length == 1) {
		x[x.length - 1].click();
		console.log("Clicked: " + x.length);
	}
}
$(document).ready(function() {
	var win = $("md-content");
	win.scroll(function() {
		console.log("scroll");
		if (win[0].scrollHeight - win.scrollTop() - win.outerHeight() < 1) {
			click_handler();
		}
	});
});
