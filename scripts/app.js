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

              fetch('http://localhost:8080/currentUser/getEmail',
              {
                method: 'GET',
                headers: myHeaders,
              })
              .then(response2 => response2.text())
              .then(text2 => 
                  { 
                    localStorage.setItem('email', text2);
                      fetch('http://localhost:8080/employee/findByEmail?email=' + text2,
                      {
                        method: 'GET',
                        headers: myHeaders,
                      })
                      .then(response3 => response3.text())
                      .then(text3 => 
                          { 
                            localStorage.setItem('fullName', text3);
                               var block = document.getElementById("user-name");
                               block.textContent += text3;
                          })
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
              localStorage.setItem('role', text1.slice(0, -1));

              if(localStorage.getItem('role').localeCompare('Admin') == 0)
                {block2.setAttribute('onclick', 'transferAdmin();');};
              if(localStorage.getItem('role').localeCompare('User') == 0)
                {block2.setAttribute('onclick', 'transferUser();');};
          })
  }   
}
function transferAdmin(){
  window.location.href = 'https://de221.github.io/DNDWarehouse-Frontend/admin-home';
}
function transferUser(){
  window.location.href = 'https://de221.github.io/DNDWarehouse-Frontend/user-home';
}  
    const toTimestamp = (strDate) => {  //timestamp to UNIX time
      const dt = new Date(strDate).getTime();  
      return dt;
    }
  async function LoadTable() 
  {
    function buildHtmlTable(arr)
    {
      var table = _table_.cloneNode(false),
        thead = _thead_.cloneNode(false),
        tbody = _tbody_.cloneNode(false),
        columns = addAllColumnHeaders(arr, table);
      for (var i = 0, maxi = arr.length; i < maxi; ++i) { //table rows and columns
        var tr = _tr_.cloneNode(false);
        for (var j = 0, maxj = columns.length; j < maxj; ++j) {
          var td = _td_.cloneNode(false);
          var cellValue = arr[i][columns[j]];
          if(cellValue !==null &&(j===6 || j===7))
          {             
            var date = new Date(toTimestamp(cellValue));
            cellValue = date.toDateString() + " " + date.toLocaleTimeString();
          }
          if (typeof(cellValue) == 'object' && cellValue != null && cellValue.length != 0)
          {
            td.className="list__in__table";

            var div0 = _div_.cloneNode(false);
            div0.className="dropdown";
            var button = _button_.cloneNode(false);
            if(j===5)//this means the packets column
            {
              button.innerHTML=arr[i][columns[1]] + " packets";
              button.className="dropbtn";
              var divMain = _div_.cloneNode(false);
              divMain.className="dropdown-content";
              cellValue.forEach(obj => 
              {
                var div = _div_.cloneNode(false);
                div.className="side-dropdown-content";
                var subdiv0 = _div_.cloneNode(false);
                subdiv0.innerHTML="id: " + obj["id"];
                div.appendChild(subdiv0);
                var subdiv1 = _div_.cloneNode(false);
                subdiv1.innerHTML="weight: " + obj["weight"];
                div.appendChild(subdiv1);
                var subdiv2 = _div_.cloneNode(false);
                subdiv2.innerHTML="warehouse id: " + obj["warehouseId"];
                div.appendChild(subdiv2);                

                divMain.appendChild(div);
                var divText = _div_.cloneNode(false);
                divText.innerHTML=obj["name"];
                divText.className="divText";
                divMain.appendChild(divText);
                var img = _img_.cloneNode(false);
                img.setAttribute("src", "https://www.svgrepo.com/show/98299/right-arrow.svg");
                img.className="side-arrow-svg";
                let translateY = -25.92;
                let string = "translate(-30px, ".concat(translateY,"px)");
                img.style.transform = string;
                divMain.appendChild(img);
              });
            }
            if(j===4)//this means the employees column
            {
              button.innerHTML=arr[i][columns[1]] + " employees";
              button.className="dropbtn";
              var divMain = _div_.cloneNode(false);
              divMain.className="dropdown-content";
              cellValue.forEach(obj => {
                var div = _div_.cloneNode(false);
                div.innerHTML=obj["fullName"];
                divMain.appendChild(div);
              });
            }        
            div0.appendChild(button);
            div0.appendChild(divMain);
            td.appendChild(div0);
          }
          
          else
          td.appendChild(document.createTextNode(cellValue || ''));

          tr.appendChild(td);
        }
        table.appendChild(thead);
        table.appendChild(tbody);
        tbody.appendChild(tr);
        table.className="content-table";
      }
      return table;
    }
    function addAllColumnHeaders(arr, table)  // Table headers
    {
      var columnSet = [],
        tr = _tr_.cloneNode(false),
        thead = _thead_.cloneNode(false);
      for (var i = 0, l = arr.length; i < l; i++) {
        for (var key in arr[i]) {
          if (arr[i].hasOwnProperty(key) && columnSet.indexOf(key) === -1) {
            columnSet.push(key);
            var th = _th_.cloneNode(false);
            if (key==='fullStatusName')
            key="status";
            if (key==='cityName')
            key="city";
            if (key==='expectedFinish')
            key="finish";
            th.appendChild(document.createTextNode(key));
            tr.appendChild(th);
          }
        }
      }
      thead.appendChild(tr);
      table.appendChild(thead);
      return columnSet;
    }
      var _table_ = document.createElement('table');
      _thead_ = document.createElement('thead'),
      _tbody_ = document.createElement('tbody'),
      _tr_ = document.createElement('tr'),
      _th_ = document.createElement('th'),
      _td_ = document.createElement('td');
      _div_ = document.createElement('div');
      _button_ = document.createElement('button');
      _img_ = document.createElement('img');
      const page__main__container = document.querySelector('#page__main__container');

      const myHeaders = new Headers();
      myHeaders.append('Authorization', localStorage.getItem('jwtToken'));
      let json = await fetch('http://localhost:8080/task/fetch',
      {
        method: 'GET',
        headers: myHeaders,
      })
      .then(response => response.json())
      .then((response) => 
      {
        //console.log(response);
        page__main__container.appendChild(buildHtmlTable(response));
      })
      .then(response => // Adds event listeners to each button in order to open the submenus.
      {
        const dropbtns = document.querySelectorAll('.dropbtn');
        dropbtns.forEach(dropbtn => dropbtn.addEventListener('click', function ( event ) 
        {
          let dropdowns0 = dropbtn.parentElement.childNodes;
          let dropdowns1 = dropdowns0[1];
          dropdowns1.classList.toggle("show");
        }
        ));

        const sideArrows = document.querySelectorAll('.side-arrow-svg');
        sideArrows.forEach(sideArrow => sideArrow.addEventListener('mouseover', function ( event ) 
        {
          let dropdowns0 = dropbtn.parentElement.childNodes;
          let dropdowns1 = dropdowns0[1];
          dropdowns1.classList.toggle("show");
        }
        ));
      });
  }
// Close the dropdown menu if the user clicks outside of it.
window.onclick = function(event)
{
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}