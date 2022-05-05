function buttonLogin() {
    window.location.href = 'http://localhost:8080/login';
}

jQuery( "li:has(ul)" ).hover(function(){ // When a li that has a ul is clicked ...
	jQuery(this).toggleClass('active');}); // then toggle (add/remove) the class 'active' on it. 

function fetchWarehouses() 
{
    var listCityNames = [];
    var listWarehouseStorages = [];
    function putWarehouses(length, spantext, circleText) {
        for (let i = 0; i < length; i++) {
            var div = document.createElement("div");
            div.className="warehouse__icon";
            var img = document.createElement("img");
            img.setAttribute("src", "https://cdn-icons-png.flaticon.com/512/189/189214.png");
            var infoCircle = document.createElement("div");
            infoCircle.className="quick__info__circle";
            infoCircle.innerHTML="Storage:" + circleText[i];
            var span = document.createElement("span");
            span.className="warehouse__icon__text";
            span.textContent=spantext[i];

            div.appendChild(img);
            div.appendChild(infoCircle);
            div.appendChild(span);

            var block = document.getElementById("index-page");
            block.appendChild(div);
        };
    }
    
    let json = fetch('http://localhost:8080/packet/fetchWarehouses')
    .then(response => {return response.json();})
    .then(json => 
        { 
            //console.log(json); 
            //console.log(json.length);
            for (var warehouse of json) {
                //console.log(warehouse);--> full info
                listCityNames.push(warehouse['cityName']);
                listWarehouseStorages.push(warehouse['storage_space']);
            }
            console.log(listWarehouseStorages);
            putWarehouses(json.length, listCityNames, listWarehouseStorages);
        })
    
}
    