function login() {
  let Role = "";
  var email = document.getElementsByName("email")[0].value;
  var password = document.getElementsByName("password")[0].value;
  
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const jwtResponse = fetch('http://localhost:8080/authenticate',
  {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify({"username": email, "password": password})
  })
  .then(response => response.text())
    .then(text => 
      {
        if(text.startsWith("{\"jwt\":"))
        {
          $('#alert1').hide('fade') // close alert incorrect login info
          str1 = text.substring(8);
          str2 = str1.slice(0, -2);
          jwtToken = "Bearer " + str2;

          localStorage.setItem('jwtToken', jwtToken); // write
          //console.log(localStorage.getItem('jwtToken')); // read
          $('#loginModal').modal('hide');


          const myHeaders1 = new Headers();
          myHeaders1.append('Authorization', jwtToken);
          fetch('http://localhost:8080/currentUser/getRole',
          {
            method: 'GET',
            headers: myHeaders1,
          })
          .then(response => response.text())
          .then(text => 
              { 
                Role = text;
                if (Role.startsWith('[ROLE_ADMIN]'))
                {window.location.href = 'https://de221.github.io/DNDWarehouse-Frontend/admin-home'}
                else if (Role.startsWith('[ROLE_USER]'))
                {window.location.href = 'https://de221.github.io/DNDWarehouse-Frontend/user-home'};
              });
        }
        else
        {
          $('.alert').show('fade');
          //$('.alert').css("display","block"); 
        }
      })
}
$('#link-close').click(function(){$('#alert1').hide('fade');}); // close alert incorrect login info

jQuery( "li:has(ul)" ).hover(function(){ // When a li that has a ul is clicked ...
	jQuery(this).toggleClass('active');}); // then toggle (add/remove) the class 'active' on it. 

function logout() {
  localStorage.setItem('jwtToken', 'null');
  window.location.href = 'https://de221.github.io/DNDWarehouse-Frontend/';
}
  // add_action('template_redirect','my_non_logged_redirect');
  // function my_non_logged_redirect()
  // {
  //      if ((in_category(1) && !is_user_logged_in() ))
  //     {
  //         wp_redirect( 'https://de221.github.io/DNDWarehouse-Frontend/' );
  //         die();
  //     }
  // }

async function fetchWarehouses() 
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
    
    let json = await fetch('http://localhost:8080/packet/fetchWarehouses')
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
            //console.log(listWarehouseStorages);
            putWarehouses(json.length, listCityNames, listWarehouseStorages);
        })   
}
    function getUserInfo() {
      const myHeaders = new Headers();
      myHeaders.append('Authorization', localStorage.getItem('jwtToken'))

      fetch('http://localhost:8080/currentUser/getRole',
      {
        method: 'GET',
        headers: myHeaders,
      })
      .then(response => response.text())
      .then(text => 
          { 
            if(text.startsWith('[ROLE_ADMIN]'))
            text1 = "Admin ";
            if(text.startsWith('[ROLE_USER]'))
            text1 = "User ";
              var block = document.getElementById("user-name");
              block.textContent += text1;
              localStorage.setItem('role', text1.slice(0, -1));

              fetch('http://localhost:8080/currentUser/getUsername',
              {
                method: 'GET',
                headers: myHeaders,
              })
              .then(response2 => response2.text())
              .then(text2 => 
                  { 
                      var block = document.getElementById("user-name");
                      block.textContent += text2;
                  })
          })
}
function isLoged() {
  if(localStorage.getItem('jwtToken').localeCompare('null') != 0)
  {
    var block = document.getElementById("user-picture");
    block.style.display = "block";
    var block1 = document.getElementById("signup");
    block1.textContent = "Logout";
    block1.removeAttribute("data-target");
    block1.removeAttribute("data-toggle");
    block1.setAttribute('onclick','logout();');
    block1.onclick = function() {logout();};
    var block2 = document.getElementById("index-user-name");
    block2.style.display = "flex";

    if(localStorage.getItem('role').localeCompare('Admin') === 0)
      {block2.href= "https://de221.github.io/DNDWarehouse-Frontend/admin-home"};
    if(localStorage.getItem('role').localeCompare('User') === 0)
      {block2.href= "https://de221.github.io/DNDWarehouse-Frontend/user-home"};
  }   
}
    // async function loadIntoTable() {
    //     const tableHead = table.querySelector("thead");
    //     const tableBody = table.querySelector("tbody");
    //     const response = await fetch('http://localhost:8080/task/fetch');
    //     const data = await response.json();
    //     buildHtmlTable(data);
    //     //clear the table
    //     tableHead.innerHTML = "<tr></tr>";
    //     tableBody.innerHTML = "";
    //     //populate the headers
    //     for(const headerText of headers) {
    //         const headerElement = document.createElement("th");
    //         headerElement.textContent = headerText;
    //         tableHead.querySelector("tr").appendChild(headerElement);
    //     }
    //     for(const row of rows){
    //         const rowElement = document.createElement("tr");

    //         for(const cellText of row){
    //             const cellElement = document.createElement("tr");

    //             cellElement.textContent = cellText;
    //             rowElement.appendChild(cellElement);
    //         }

    //         tableBody.appendChild(rowElement);
    //     }

    //     console.log(data);
    // }
    
    async function LoadTable() {
      const myHeaders = new Headers();
      myHeaders.append('Authorization', localStorage.getItem('jwtToken'));
      let json = await fetch('http://localhost:8080/task/fetch',
      {
        method: 'GET',
        headers: myHeaders,
      });
      //let json = [{"id":3,"name":"Task3","start":null,"employees":[],"packets":[],"fullStatusName":"New Task","expectedFinish":null,"cityName":null},{"id":4,"name":"Task4","start":null,"employees":[],"packets":[],"fullStatusName":"New Task","expectedFinish":null,"cityName":null},{"id":5,"name":"Task5","start":null,"employees":[],"packets":[],"fullStatusName":"New Task","expectedFinish":null,"cityName":null},{"id":1,"name":"Task1","start":"2022-01-10T23:20:58.986+00:00","employees":[],"packets":[{"id":10,"name":"packetX","weight":0.269,"warehouseId":1}],"fullStatusName":"Finished","expectedFinish":"2022-01-10T23:26:58.986+00:00","cityName":"Sofia"},{"id":2,"name":"Task2","start":"2022-01-10T23:25:58.897+00:00","employees":[],"packets":[{"id":4,"name":"Kutiq pulna s taini","weight":69.0,"warehouseId":2}],"fullStatusName":"Finished","expectedFinish":"2022-01-11T05:50:44.398+00:00","cityName":"Plovdiv"}]
      document.body.appendChild(buildHtmlTable(json));
    }
    
    var _table_ = document.createElement('table');
    _tr_ = document.createElement('tr'),
    _th_ = document.createElement('th'),
    _td_ = document.createElement('td');
    
    
    // Builds the HTML Table out of myList json data from Ivy restful service.
    function buildHtmlTable(arr) {
      var table = _table_.cloneNode(false),
        columns = addAllColumnHeaders(arr, table);
      for (var i = 0, maxi = arr.length; i < maxi; ++i) {
        var tr = _tr_.cloneNode(false);
        for (var j = 0, maxj = columns.length; j < maxj; ++j) {
          var td = _td_.cloneNode(false);
          var cellValue = arr[i][columns[j]];
          td.appendChild(document.createTextNode(arr[i][columns[j]] || ''));
          tr.appendChild(td);
        }
        table.appendChild(tr);
      }
      return table;
    }
    
    // Adds a header row to the table and returns the set of columns.
    // Need to do union of keys from all records as some records may not contain
    // all records
    function addAllColumnHeaders(arr, table) {
      var columnSet = [],
        tr = _tr_.cloneNode(false);
      for (var i = 0, l = arr.length; i < l; i++) {
        for (var key in arr[i]) {
          if (arr[i].hasOwnProperty(key) && columnSet.indexOf(key) === -1) {
            columnSet.push(key);
            var th = _th_.cloneNode(false);
            th.appendChild(document.createTextNode(key));
            tr.appendChild(th);
          }
        }
      }
      table.appendChild(tr);
      return columnSet;
    }