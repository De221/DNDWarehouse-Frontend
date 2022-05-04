function buttonLogin() {
    window.location.href = 'http://localhost:8080/login';
}
jQuery( "li:has(ul)" ).hover(function(){ // When a li that has a ul is clicked ...
	jQuery(this).toggleClass('active');}); // then toggle (add/remove) the class 'active' on it. 