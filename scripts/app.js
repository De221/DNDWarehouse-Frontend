function login() {
  let Role = "";
  let email = document.getElementsByName("email")[0].value;
  let password = document.getElementsByName("password")[0].value;
  
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
          $('#alert1').show('fade');
          //$('.alert').css("display","block"); 
        }
      })
}
$('#link-close').click(function(){$('#alert1').hide('fade');}); // close alert incorrect login info

jQuery( "li:has(ul)" ).hover(function()
{ // When a li that has a ul is hovered upon ...
	jQuery(this).toggleClass('active');

}); // then toggle (add/remove) the class 'active' on it. 

function logout() {
  localStorage.clear();
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
    let listCityNames = [];
    let listWarehouseStorages = [];
    function putWarehouses(length, spantext, circleText) {
        for (let i = 0; i < length; i++) {
            let div = document.createElement("div");
            div.className="warehouse__icon";
            let img = document.createElement("img");
            img.setAttribute("src", "https://cdn-icons-png.flaticon.com/512/189/189214.png");
            let infoCircle = document.createElement("div");
            infoCircle.className="quick__info__circle";
            infoCircle.innerHTML="Storage:" + circleText[i];
            let span = document.createElement("span");
            span.className="warehouse__icon__text";
            span.textContent=spantext[i];

            div.appendChild(img);
            div.appendChild(infoCircle);
            div.appendChild(span);

            let block = document.getElementById("page__main__container");
            block.appendChild(div);
        };
    }
    
    let json = await fetch('http://localhost:8080/packet/fetchWarehouses')
    .then(response => {return response.json();})
    .then(json => 
        { 
            //console.log(json); 
            //console.log(json.length);
            for (let warehouse of json) {
                //console.log(warehouse);--> full info
                listCityNames.push(warehouse['cityName']);
                listWarehouseStorages.push(warehouse['storage_space']);
            }
            //console.log(listWarehouseStorages);
            putWarehouses(json.length, listCityNames, listWarehouseStorages);
        })   
}
async function fetchWarehousesWithId() 
{
    let listIdAndCityNames = [];
    let listWarehouseStorages = [];
    function putWarehouses(length, spantext, circleText) {
        for (let i = 0; i < length; i++) {
            let div = document.createElement("div");
            div.className="warehouse__icon";
            let img = document.createElement("img");
            img.setAttribute("src", "https://cdn-icons-png.flaticon.com/512/189/189214.png");
            let infoCircle = document.createElement("div");
            infoCircle.className="quick__info__circle";
            infoCircle.innerHTML="Storage:" + circleText[i];
            let span = document.createElement("span");
            span.className="warehouse__icon__text";
            span.textContent=spantext[i];

            div.appendChild(img);
            div.appendChild(infoCircle);
            div.appendChild(span);

            let block = document.getElementById("page__main__container");
            block.appendChild(div);
        };
    }
    
    let json = await fetch('http://localhost:8080/packet/fetchWarehouses')
    .then(response => {return response.json();})
    .then(json => 
        { 
            //console.log(json); 
            //console.log(json.length);
            for (let warehouse of json) {
                //console.log(warehouse);--> full info
                listIdAndCityNames.push('Id: ' + warehouse['id'] + ', ' + warehouse['cityName']);
                listWarehouseStorages.push(warehouse['storage_space']);
            }
            //console.log(listWarehouseStorages);
            putWarehouses(json.length, listIdAndCityNames, listWarehouseStorages);
        })   
}
    function getUserInfo() {
      if(localStorage.getItem('jwtToken') != 'null' && localStorage.getItem('jwtToken') != null)
      {
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
                let block = document.getElementById("user-name");
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
                                 let block = document.getElementById("user-name");
                                 block.textContent += text3;
                            })
                            })
                    })
      }
      
}
function isLoged() {
  if(localStorage.getItem('jwtToken') != null)
  {
    if(localStorage.getItem('jwtToken').localeCompare('null') != 0)
    {
      let block = document.getElementById("user-picture");
      block.style.display = "block";
      let block1 = document.getElementById("signup");
      block1.textContent = "Logout";
      block1.removeAttribute("data-target");
      block1.removeAttribute("data-toggle");
      block1.setAttribute('onclick','logout();');
      block1.onclick = function() {logout();};
      let block2 = document.getElementById("index-user-name");
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

$(document).ready(function(){
  $('#spanLogin2').click(function() 
  {
    $('#loginModal').modal('hide');
    $('#SignupModal').modal('show');
    loadCityOptions();
  });  
});

let cityName;

async function loadCityOptions()
{
  $('.dropdown-options').remove();
  await fetch('http://localhost:8080/employee/fetchCity',
    {
      method: 'GET',
    })
    .then(response => response.json())
    .then((response) =>
    {     
      let counter = 0;
      for (let item of response) 
      {
        if(counter == 0)
          cityName = item['name'];
        counter++;
        let option = document.createElement('option');
        option.className="dropdown-options"
        option.innerHTML=item['name'];
        document.querySelector('#selectCity').appendChild(option);
      }    
    });
}
if(document.getElementById('selectCity') != null)
{
  document.getElementById('selectCity').addEventListener('change', function() {
    cityName = this.value;
  });
} 
function Signup()
{
  let input1 = document.getElementsByName("fname")[0].value;
  let input2 = document.getElementsByName("lname")[0].value;
  let input3 = document.getElementsByName("email1")[0].value;
  let input4 = document.getElementsByName("password1")[0].value;

  let params = 'fname=' + input1 + '&' + 'lname=' + input2 + '&' + 'cityName=' + cityName + '&' + 'email=' + input3 + '&' + 'password=' + input4;
  let request = new XMLHttpRequest();
  request.open("POST", "http://localhost:8080/employee/save?" + params, true);
  request.setRequestHeader("Accept", "application/json");
  request.setRequestHeader('Content-Type', 'application/json');
  request.onload = () => 
  {
    if(request.responseText.includes("Registration"))
    {
      if(!document.querySelector('#alertSignup').classList.contains("alert-success"))
      {
        document.querySelector('#alertSignup').classList.toggle("alert-success");
        document.querySelector('#alertSignup').classList.remove("alert-danger");
      }
      $('#alertSignup-text').html(request.responseText);
      $('#alertSignup').show('fade');
    }
    else if(request.responseText === "Incorrect HTTP request params!")
    {
      if(!document.querySelector('#alertSignup').classList.contains("alert-danger"))
      {
        document.querySelector('#alertSignup').classList.toggle("alert-danger");
        document.querySelector('#alertSignup').classList.remove("alert-success");
      }
      $('#alertSignup-text').html("Please enter valid input values.");
      $('#alertSignup').show('fade');
    }
    else
    {
      if(!document.querySelector('#alertSignup').classList.contains("alert-danger"))
      {
        document.querySelector('#alertSignup').classList.toggle("alert-danger");
        document.querySelector('#alertSignup').classList.remove("alert-success");
      }
      $('#alertSignup-text').html(request.responseText);
      $('#alertSignup').show('fade');
    }
  }
  request.send();
}

window.addEventListener("load", () => {
  let element = document.querySelector("#about-page");
  if(typeof(element) != 'undefined' && element != null)
  {
    document.querySelector("#about-page").addEventListener("click", e => {
      aboutPage();
  });
  } 
});

window.addEventListener("load", () => {
  let element = document.querySelector("#contacts-page");
  if(typeof(element) != 'undefined' && element != null)
  {
    document.querySelector("#contacts-page").addEventListener("click", e => {
      contactsPage();
  });
  } 
});

function aboutPage()
{
  let container = document.getElementById('main__container');
  let subcontainer = document.getElementById('page__main__container');
  subcontainer.classList.remove('warehouse__icons__container');
  subcontainer.classList.add('warehouse__information__container');
  $('.warehouse__icon').remove();
  $('#index-header3').remove();
  $('#index-ul').remove();

  let header = document.getElementById('index-header');
  header.innerHTML="About us".bold();
  
  header3 = document.createElement('h3');
  header3.className="information__header";
  header3.id="index-header3";
  header3.innerHTML="This is some useless infomation about the site and the company :).";

  paragraph = document.createElement('p');
  paragraph.id="index-p";
  paragraph.style.color="white";
  paragraph.innerHTML="paragraph text...";

  subcontainer.appendChild(header3);
  subcontainer.appendChild(paragraph);
  container.appendChild(subcontainer);
}

function contactsPage()
{
  let container = document.getElementById('main__container');
  let subcontainer = document.getElementById('page__main__container');
  subcontainer.classList.remove('warehouse__icons__container');
  subcontainer.classList.add('warehouse__information__container');
  $('.warehouse__icon').remove();
  $('#index-header3').remove();
  $('#index-p').remove();

  let header = document.getElementById('index-header');
  header.innerHTML="Contacts".bold();
  
  header3 = document.createElement('h3');
  header3.className="information__header";
  header3.id="index-header3";
  header3.innerHTML="You can find us at:";

  ul = document.createElement('ul');
  ul.id="index-ul";
  ul.style.color="white";
  ul.innerHTML="<li>Adresses: ...</li><li>Email: ...</li><li>Phone numbers:<ol><li>phone1</li><li>phone2</li><li>phone3</li></ol></li>";

  subcontainer.appendChild(header3);
  subcontainer.appendChild(ul);
  container.appendChild(subcontainer);
}
    
// ------------------------------------------------Start of Admin-HOME Functions------------------------------------------------------

    
// ------------------------------------------------Start of Tasks-Table------------------------------------------------------------------------
async function LoadTaskTable() 
{
  function buildHtmlTable(arr)
  {
    let table = _table_.cloneNode(false),
      thead = _thead_.cloneNode(false),
      tbody = _tbody_.cloneNode(false),
      columns = addAllColumnHeaders(arr, table);
    for (let i = 0, maxi = arr.length; i < maxi; ++i) { //table rows and columns
      let tr = _tr_.cloneNode(false);
      for (let j = 0, maxj = columns.length; j < maxj; ++j) {
        let td = _td_.cloneNode(false);
        let cellValue = arr[i][columns[j]];
        if(cellValue !==null &&(j===6 || j===7))
        {             
          let date = new Date(toTimestamp(cellValue));
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
              let translateY = -25.92; // hard-coded ......
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
              div.className="side-dropdown-content";
              var subdiv0 = _div_.cloneNode(false);
              subdiv0.innerHTML="id: " + obj["id"];
              div.appendChild(subdiv0);
              var subdiv1 = _div_.cloneNode(false);
              subdiv1.innerHTML="email: " + obj["email"];
              div.appendChild(subdiv1);                          

              divMain.appendChild(div);
              var divText = _div_.cloneNode(false);
              divText.innerHTML=obj["fullName"];
              divText.className="divText";
              divMain.appendChild(divText);
              var img = _img_.cloneNode(false);
              img.setAttribute("src", "https://www.svgrepo.com/show/98299/right-arrow.svg");
              img.className="side-arrow-svg";      
              let translateY = -25.92; // hard-coded ......
              let string = "translate(-30px, ".concat(translateY,"px)");
              img.style.transform = string;
              divMain.appendChild(img);
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
      table.id="my-content-table";
    }
    return table;
  }
  function addAllColumnHeaders(arr, table)  // Table headers
  {
    let columnSet = [],
      tr = _tr_.cloneNode(false),
      thead = _thead_.cloneNode(false);
    for (let i = 0, l = arr.length; i < l; i++) {
      for (let key in arr[i]) {
        if (arr[i].hasOwnProperty(key) && columnSet.indexOf(key) === -1) {
          columnSet.push(key);
          let th = _th_.cloneNode(false);
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
    let _table_ = document.createElement('table');
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
        let subdropdowns = document.getElementsByClassName("side-dropdown-content"); //close already opened side-dropdowns
        let i;
        for (i = 0; i < subdropdowns.length; i++) 
        {
          let openSubDropdown = subdropdowns[i];
          if (openSubDropdown.classList.contains('show')) {
            openSubDropdown.classList.remove('show');
          }
        }

        let subdropdowns0 = sideArrow.parentElement.childNodes;
        let parent = sideArrow.parentNode;
        let indexOfArrow = Array.prototype.indexOf.call(parent.children, sideArrow);
        let subdropdowns1 = subdropdowns0[indexOfArrow-2];
        subdropdowns1.classList.toggle("show");
      }
      ));
    });
}
// Close the dropdown menu if the user clicks outside of it.                             -------------- Works for future Tables also -----------------
window.addEventListener('mouseover', function ( event ) 
{
  if (!(event.target.matches('.dropbtn') || event.target.matches('.dropdown-content') 
  || event.target.matches('.divText') || event.target.matches('.side-arrow-svg'))) {
    let dropdowns = document.getElementsByClassName("dropdown-content");
    let i;
    for (i = 0; i < dropdowns.length; i++) {
      let openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
});
window.addEventListener('mouseover', function ( event ) 
{
  if (!event.target.matches('.side-arrow-svg')) {
    let subdropdowns = document.getElementsByClassName("side-dropdown-content");
    let i;
    for (i = 0; i < subdropdowns.length; i++) {
      let openSubDropdown = subdropdowns[i];
      if (openSubDropdown.classList.contains('show')) {
        openSubDropdown.classList.remove('show');
      }
    }
  }
});
// ------------------------------------------------End of Tasks-Table------------------------------------------------------------------------

// ------------------------------------------------Start of Panel for Table calls------------------------------------------------------

function reLoadTaskTable()
{
  $('#my-content-table').remove();
  $('.warehouse__icon').remove();
  $('#page__main__container').removeClass('warehouse__icons__container');
  $('#page__main__container').addClass('page__information');
  LoadTaskTable();
}
function reLoadPacketTable()
{
  $('#my-content-table').remove();
  $('.warehouse__icon').remove();
  $('#page__main__container').removeClass('warehouse__icons__container');
  $('#page__main__container').addClass('page__information');
  LoadPacketTable();
}
function reLoadEmployeeTable()
{
  $('#my-content-table').remove();
  $('.warehouse__icon').remove();
  $('#page__main__container').removeClass('warehouse__icons__container');
  $('#page__main__container').addClass('page__information');
  LoadEmployeeTable();
}
function reLoadWarehousesTable()
{
  $('#my-content-table').remove();
  $('.warehouse__icon').remove();
  $('#page__main__container').removeClass('page__information');
  $('#page__main__container').addClass('warehouse__icons__container');

  $('#page__main__container').css('margin', '10px');
  $('#page__main__container').css('margin-top', '60px');
  $('#page__main__container').css('margin-bottom', '60px');
  $('#page__main__container').css('height', '827px');
  $('#page__main__container').css('width', '100%');
  fetchWarehousesWithId();
}

window.addEventListener("load", () => {
  let element = document.querySelector("#task_table_icon");
  if(typeof(element) != 'undefined' && element != null)
  {
    document.querySelector("#task_table_icon").addEventListener("click", e => {
      reLoadTaskTable();
  });
  } 
});

window.addEventListener("load", () => {
  let element = document.querySelector("#task_table_a");
  if(typeof(element) != 'undefined' && element != null)
  {
    document.querySelector("#task_table_a").addEventListener("click", e => {
      reLoadTaskTable();
  });
  } 
});
window.addEventListener("load", () => {
  let element = document.querySelector("#packet_table_icon");
  if(typeof(element) != 'undefined' && element != null)
  {
    document.querySelector("#packet_table_icon").addEventListener("click", e => {
      reLoadPacketTable();
  });
  } 
});

window.addEventListener("load", () => {
  let element = document.querySelector("#packet_table_a");
  if(typeof(element) != 'undefined' && element != null)
  {
    document.querySelector("#packet_table_a").addEventListener("click", e => {
      reLoadPacketTable();
  });
  } 
});

window.addEventListener("load", () => {
  let element = document.querySelector("#employee_table_icon");
  if(typeof(element) != 'undefined' && element != null)
  {
    document.querySelector("#employee_table_icon").addEventListener("click", e => {
      reLoadEmployeeTable();
  });
  } 
});

window.addEventListener("load", () => {
  let element = document.querySelector("#employee_table_a");
  if(typeof(element) != 'undefined' && element != null)
  {
    document.querySelector("#employee_table_a").addEventListener("click", e => {
      reLoadEmployeeTable();
  });
  } 
});

window.addEventListener("load", () => {
  let element = document.querySelector("#warehouse_table_icon");
  if(typeof(element) != 'undefined' && element != null)
  {
    document.querySelector("#warehouse_table_icon").addEventListener("click", e => {  
      reLoadWarehousesTable();
  });
  } 
});

window.addEventListener("load", () => {
  let element = document.querySelector("#warehouse_table_a");
  if(typeof(element) != 'undefined' && element != null)
  {
    document.querySelector("#warehouse_table_a").addEventListener("click", e => {
      reLoadWarehousesTable();
  });
  } 
});

// ------------------------------------------------End of Panel for Table calls------------------------------------------------------

function createTaskModal(){
$('.alert').hide();
let label1 = document.getElementById("labelField1");
label1.innerHTML="Task name";
button1.innerHTML="Create task";
let title1 = document.getElementById("modal-title1");
title1.style.textDecoration = "underline";
let title2 = document.getElementById("modal-title2");
title2.style.textDecoration = "none";

button1.setAttribute("onclick", "createNewTask()");
}
function removeTaskModal(){
  $('.alert').hide();
  let label1 = document.getElementById("labelField1");
  label1.innerHTML="Task id";
  button1.innerHTML="Remove task";
  let title1 = document.getElementById("modal-title1");
  title1.style.textDecoration = "none";
  let title2 = document.getElementById("modal-title2");
  title2.style.textDecoration = "underline";

  button1.setAttribute("onclick", "removeTask()");
}

function createNewTask()
{
  let input = document.getElementsByName("input-field1")[0].value;

  let params = 'name=' + input;
  let request = new XMLHttpRequest();
  request.open("POST", "http://localhost:8080/task/create?" + params, true);
  request.setRequestHeader('Authorization', localStorage.getItem('jwtToken'));
  request.setRequestHeader("Accept", "application/json");
  request.setRequestHeader('Content-Type', 'application/json');
  request.onload = () => 
  {
    if(request.responseText === "A task with this name already exists.")
    {
      if(!document.querySelector('#alert1').classList.contains("alert-danger"))
      {
        document.querySelector('#alert1').classList.toggle("alert-danger");
        document.querySelector('#alert1').classList.remove("alert-success");
      }
      $('#alert1-text').html("A task with this name already exists.");
      $('.alert').show('fade');
    }
    else if(request.responseText.startsWith("Task number"))
    {
      reLoadTaskTable()
      if(!document.querySelector('#alert1').classList.contains("alert-success"))
      {
        document.querySelector('#alert1').classList.toggle("alert-success");
        document.querySelector('#alert1').classList.remove("alert-danger");
      }
      $('#alert1-text').html("Task " + input + " has been successfully created.");
      $('.alert').show('fade');
    }
    else
    {
      if(!document.querySelector('#alert1').classList.contains("alert-danger"))
      {
        document.querySelector('#alert1').classList.toggle("alert-danger");
        document.querySelector('#alert1').classList.remove("alert-success");
      }
      $('#alert1-text').html("Please enter valid input values.");
      $('.alert').show('fade');
    }
  }
  request.send();
}

function removeTask()
{
  let input = document.getElementsByName("input-field1")[0].value;

  let params = 'taskId=' + input;
  let request = new XMLHttpRequest();
  request.open("DELETE", "http://localhost:8080/task/remove?" + params, true);
  request.setRequestHeader('Authorization', localStorage.getItem('jwtToken'));
  request.setRequestHeader("Accept", "application/json");
  request.setRequestHeader('Content-Type', 'application/json');
  request.onload = () => 
  {
    if(request.status == '400') //Bad request
    {
      if(!document.querySelector('#alert1').classList.contains("alert-danger"))
      {
        document.querySelector('#alert1').classList.toggle("alert-danger");
        document.querySelector('#alert1').classList.remove("alert-success");
      }
      $('#alert1-text').html("Please enter valid input values.");
      $('.alert').show('fade');
    }
    else if(request.responseText === "There is no such task.")
    {
      if(!document.querySelector('#alert1').classList.contains("alert-danger"))
      {
        document.querySelector('#alert1').classList.toggle("alert-danger");
        document.querySelector('#alert1').classList.remove("alert-success");
      }
      $('#alert1-text').html("There is no such task.");
      $('.alert').show('fade');
    }
    else if(request.responseText.startsWith("Task number"))
    {
      reLoadTaskTable()
      if(!document.querySelector('#alert1').classList.contains("alert-success"))
      {
        document.querySelector('#alert1').classList.toggle("alert-success");
        document.querySelector('#alert1').classList.remove("alert-danger");
      }
      $('#alert1-text').html("Task with id: " + input + " has been successfully removed.");
      $('.alert').show('fade');
    }
  }
  request.send();
}



function hireEmpModal()
{
  $('.alert').hide();
  button2.innerHTML="Hire Employee";
  let title3 = document.getElementById("modal-title3");
  title3.style.textDecoration = "underline";
  let title4 = document.getElementById("modal-title4");
  title4.style.textDecoration = "none";
  
  button2.setAttribute("onclick", "hireEmployee()");
}
function fireEmpModal()
{
  $('.alert').hide();
  button2.innerHTML="Fire Employee";
  let title3 = document.getElementById("modal-title3");
  title3.style.textDecoration = "none";
  let title4 = document.getElementById("modal-title4");
  title4.style.textDecoration = "underline";
  
  button2.setAttribute("onclick", "fireEmployee()");
}
function hireEmployee()
{
  let input1 = document.getElementsByName("input-field2")[0].value;
  let input2 = document.getElementsByName("input-field3")[0].value;

  let params = 'taskNumber=' + input1 + '&' + 'email=' + input2;
  let request = new XMLHttpRequest();
  request.open("POST", "http://localhost:8080/task/hireEmployee?" + params, true);
  request.setRequestHeader('Authorization', localStorage.getItem('jwtToken'));
  request.setRequestHeader("Accept", "application/json");
  request.setRequestHeader('Content-Type', 'application/json');
  request.onload = () => 
  {
    if(request.responseText.includes("has been hired"))
    {
      reLoadTaskTable()

      if(!document.querySelector('#alert2').classList.contains("alert-success"))
      {
        document.querySelector('#alert2').classList.toggle("alert-success");
        document.querySelector('#alert2').classList.remove("alert-danger");
      }
      $('#alert2-text').html(request.responseText);
      $('.alert').show('fade');
    }
    else if(request.responseText === "Incorrect HTTP request params!")
    {
      if(!document.querySelector('#alert2').classList.contains("alert-danger"))
      {
        document.querySelector('#alert2').classList.toggle("alert-danger");
        document.querySelector('#alert2').classList.remove("alert-success");
      }
      $('#alert2-text').html("Please enter valid input values.");
      $('.alert').show('fade');
    }
    else
    {
      if(!document.querySelector('#alert2').classList.contains("alert-danger"))
      {
        document.querySelector('#alert2').classList.toggle("alert-danger");
        document.querySelector('#alert2').classList.remove("alert-success");
      }
      $('#alert2-text').html(request.responseText);
      $('.alert').show('fade');
    }
  }
  request.send();
}
function fireEmployee()
{
  let input1 = document.getElementsByName("input-field2")[0].value;
  let input2 = document.getElementsByName("input-field3")[0].value;

  let params = 'taskNumber=' + input1 + '&' + 'email=' + input2;
  let request = new XMLHttpRequest();
  request.open("POST", "http://localhost:8080/task/fireEmployee?" + params, true);
  request.setRequestHeader('Authorization', localStorage.getItem('jwtToken'));
  request.setRequestHeader("Accept", "application/json");
  request.setRequestHeader('Content-Type', 'application/json');
  request.onload = () => 
  {
    if(request.responseText.includes("has been fired"))
    {
      reLoadTaskTable()
      if(!document.querySelector('#alert2').classList.contains("alert-success"))
      {
        document.querySelector('#alert2').classList.toggle("alert-success");
        document.querySelector('#alert2').classList.remove("alert-danger");
      }
      $('#alert2-text').html(request.responseText);
      $('.alert').show('fade');
    }
    else if(request.responseText === "Incorrect HTTP request params!")
    {
      if(!document.querySelector('#alert2').classList.contains("alert-danger"))
      {
        document.querySelector('#alert2').classList.toggle("alert-danger");
        document.querySelector('#alert2').classList.remove("alert-success");
      }
      $('#alert2-text').html("Please enter valid input values.");
      $('.alert').show('fade');
    }
    else
    {
      if(!document.querySelector('#alert2').classList.contains("alert-danger"))
      {
        document.querySelector('#alert2').classList.toggle("alert-danger");
        document.querySelector('#alert2').classList.remove("alert-success");
      }
      $('#alert2-text').html(request.responseText);
      $('.alert').show('fade');
    }
  }
  request.send();
}




function addTaskPacketModal()
{
  $('.alert').hide();
  button3.innerHTML="Add Packet";
  let title5 = document.getElementById("modal-title5");
  title5.style.textDecoration = "underline";
  let title6 = document.getElementById("modal-title6");
  title6.style.textDecoration = "none";
  
  button3.setAttribute("onclick", "addPacket()");
}
function removeTaskPacketModal()
{
  $('.alert').hide();
  button3.innerHTML="Remove Packet";
  let title5 = document.getElementById("modal-title5");
  title5.style.textDecoration = "none";
  let title6 = document.getElementById("modal-title6");
  title6.style.textDecoration = "underline";
  
  button3.setAttribute("onclick", "removePacket()");
}
function addPacket()
{
  let input1 = document.getElementsByName("input-field4")[0].value;
  let input2 = document.getElementsByName("input-field5")[0].value;

  let params = 'packetId=' + input2 + '&' + 'taskId=' + input1;
  let request = new XMLHttpRequest();
  request.open("POST", "http://localhost:8080/task/addPacket?" + params, true);
  request.setRequestHeader('Authorization', localStorage.getItem('jwtToken'));
  request.setRequestHeader("Accept", "application/json");
  request.setRequestHeader('Content-Type', 'application/json');
  request.onload = () => 
  {
    if(request.responseText.includes("has been included"))
    {
      reLoadTaskTable()

      if(!document.querySelector('#alert3').classList.contains("alert-success"))
      {
        document.querySelector('#alert3').classList.toggle("alert-success");
        document.querySelector('#alert3').classList.remove("alert-danger");
      }
      $('#alert3-text').html(request.responseText);
      $('.alert').show('fade');
    }
    else if(request.responseText === "Incorrect HTTP request params!")
    {
      if(!document.querySelector('#alert3').classList.contains("alert-danger"))
      {
        document.querySelector('#alert3').classList.toggle("alert-danger");
        document.querySelector('#alert3').classList.remove("alert-success");
      }
      $('#alert3-text').html("Please enter valid input values.");
      $('.alert').show('fade');
    }
    else
    {
      if(!document.querySelector('#alert3').classList.contains("alert-danger"))
      {
        document.querySelector('#alert3').classList.toggle("alert-danger");
        document.querySelector('#alert3').classList.remove("alert-success");
      }
      $('#alert3-text').html(request.responseText);
      $('.alert').show('fade');
    }
  }
  request.send();
}
function removePacket()
{
  let input1 = document.getElementsByName("input-field4")[0].value;
  let input2 = document.getElementsByName("input-field5")[0].value;

  let params = 'packetId=' + input2 + '&' + 'taskId=' + input1;
  let request = new XMLHttpRequest();
  request.open("POST", "http://localhost:8080/task/removePacket?" + params, true);
  request.setRequestHeader('Authorization', localStorage.getItem('jwtToken'));
  request.setRequestHeader("Accept", "application/json");
  request.setRequestHeader('Content-Type', 'application/json');
  request.onload = () => 
  {
    if(request.responseText.includes("has been excluded"))
    {
      reLoadTaskTable()

      if(!document.querySelector('#alert3').classList.contains("alert-success"))
      {
        document.querySelector('#alert3').classList.toggle("alert-success");
        document.querySelector('#alert3').classList.remove("alert-danger");
      }
      $('#alert3-text').html(request.responseText);
      $('.alert').show('fade');
    }
    else if(request.responseText === "Incorrect HTTP request params!")
    {
      if(!document.querySelector('#alert3').classList.contains("alert-danger"))
      {
        document.querySelector('#alert3').classList.toggle("alert-danger");
        document.querySelector('#alert3').classList.remove("alert-success");
      }
      $('#alert3-text').html("Please enter valid input values.");
      $('.alert').show('fade');
    }
    else
    {
      if(!document.querySelector('#alert3').classList.contains("alert-danger"))
      {
        document.querySelector('#alert3').classList.toggle("alert-danger");
        document.querySelector('#alert3').classList.remove("alert-success");
      }
      $('#alert3-text').html(request.responseText);
      $('.alert').show('fade');
    }
  }
  request.send();
}

// ------------------------------------------------Start of browse packets functions------------------------------------------------------
async function LoadPacketTable()
{
  function buildHtmlTablePackets(arr)
  {
    let table = _table_.cloneNode(false),
      thead = _thead_.cloneNode(false),
      tbody = _tbody_.cloneNode(false),
      columns = addAllColumnHeaders(arr, table);
    for (let i = 0, maxi = arr.length; i < maxi; ++i) 
    { //table rows and columns
      let tr = _tr_.cloneNode(false);
      for (let j = 0, maxj = columns.length; j < maxj; ++j) 
      {
        let td = _td_.cloneNode(false);
        let cellValue = arr[i][columns[j]];
        
         td.appendChild(document.createTextNode(cellValue || ''));

         tr.appendChild(td);
      }
      table.appendChild(thead);
      table.appendChild(tbody);
      tbody.appendChild(tr);
      table.className="content-table";
      table.id="my-content-table";
    }
    return table;
  };
  function addAllColumnHeaders(arr, table)  // Table headers
  {
    let columnSet = [],
      tr = _tr_.cloneNode(false),
      thead = _thead_.cloneNode(false);
    for (let i = 0, l = arr.length; i < l; i++) {
      for (let key in arr[i]) {
        if (arr[i].hasOwnProperty(key) && columnSet.indexOf(key) === -1) {
          columnSet.push(key);
          let th = _th_.cloneNode(false);
           if (key==='cityName')
           key="location";
           if (key==='warehouseId')
           key="warehouse id";
          th.appendChild(document.createTextNode(key));
          tr.appendChild(th);
        }
      }
    }
    thead.appendChild(tr);
    table.appendChild(thead);
    return columnSet;
  }
    let _table_ = document.createElement('table');
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
    let json = await fetch('http://localhost:8080/packet/fetch',
    {
      method: 'GET',
      headers: myHeaders,
    })
    .then(response => response.json())
    .then((response) => 
    {
      //console.log(response);
      page__main__container.appendChild(buildHtmlTablePackets(response));
    })
}

function receivePacketModal()
{
  $('.alert').hide();
  button4.innerHTML="Receive Packet";
  let title7 = document.getElementById("modal-title7");
  title7.style.textDecoration = "underline";
  let title8 = document.getElementById("modal-title8");
  title8.style.textDecoration = "none";
  let label7 = document.getElementById("labelField7");
  $('#input-field7').css("display","block");
  label7.style.display="block";
  label7.innerHTML="Packet weight";
  let label8 = document.getElementById("labelField8");
  $('#input-field8').css("display","block");
  label8.style.display="block";
  label8.innerHTML="Warehouse id";
  
  button4.setAttribute("onclick", "receivePacket()");
}
function deletePacketModal()
{
  $('.alert').hide();
  button4.innerHTML="Delete Packet";
  let title7 = document.getElementById("modal-title7");
  title7.style.textDecoration = "none";
  let title8 = document.getElementById("modal-title8");
  title8.style.textDecoration = "underline";
  let label7 = document.getElementById("labelField7");
  $('#input-field7').css("display","none");
  label7.style.display="none";
  let label8 = document.getElementById("labelField8");
  $('#input-field8').css("display","none");
  label8.style.display="none";
  
  button4.setAttribute("onclick", "deletePacket()");
}

function receivePacket()
{
  let input1 = document.getElementsByName("input-field6")[0].value;
  let input2 = document.getElementsByName("input-field7")[0].value;
  let input3 = document.getElementsByName("input-field8")[0].value;

  let params = 'packetName=' + input1 + '&' + 'weight=' + input2 + '&' + 'warehouseId=' + input3;
  let request = new XMLHttpRequest();
  request.open("POST", "http://localhost:8080/packet/receiveNew?" + params, true);
  request.setRequestHeader('Authorization', localStorage.getItem('jwtToken'));
  request.setRequestHeader("Accept", "application/json");
  request.setRequestHeader('Content-Type', 'application/json');
  request.setRequestHeader('Access-Control-Allow-Origin', '*');
  request.onload = () => 
  {
    if(request.responseText.includes("appeared in warehouse"))
    {
      reLoadPacketTable()

      if(!document.querySelector('#alert4').classList.contains("alert-success"))
      {
        document.querySelector('#alert4').classList.toggle("alert-success");
        document.querySelector('#alert4').classList.remove("alert-danger");
      }
      $('#alert4-text').html(request.responseText);
      $('.alert').show('fade');
    }
    else if(request.responseText === "Incorrect HTTP request params!")
    {
      if(!document.querySelector('#alert4').classList.contains("alert-danger"))
      {
        document.querySelector('#alert4').classList.toggle("alert-danger");
        document.querySelector('#alert4').classList.remove("alert-success");
      }
      $('#alert4-text').html("Please enter valid input values.");
      $('.alert').show('fade');
    }
    else
    {
      if(!document.querySelector('#alert4').classList.contains("alert-danger"))
      {
        document.querySelector('#alert4').classList.toggle("alert-danger");
        document.querySelector('#alert4').classList.remove("alert-success");
      }
      $('#alert4-text').html(request.responseText);
      $('.alert').show('fade');
    }
  }
  request.send();
}
function deletePacket()
{
  let input1 = document.getElementsByName("input-field6")[0].value;

  let params = 'packetName=' + input1;
  let request = new XMLHttpRequest();
  request.open("DELETE", "http://localhost:8080/packet/remove?" + params, true);
  request.setRequestHeader('Authorization', localStorage.getItem('jwtToken'));
  request.setRequestHeader("Accept", "application/json");
  request.setRequestHeader('Content-Type', 'application/json');
  request.onload = () => 
  {
    if(request.responseText.includes("has been deleted"))
    {
      reLoadPacketTable()

      if(!document.querySelector('#alert4').classList.contains("alert-success"))
      {
        document.querySelector('#alert4').classList.toggle("alert-success");
        document.querySelector('#alert4').classList.remove("alert-danger");
      }
      $('#alert4-text').html(request.responseText);
      $('.alert').show('fade');
    }
    else if(request.responseText === "Incorrect HTTP request params!")
    {
      if(!document.querySelector('#alert4').classList.contains("alert-danger"))
      {
        document.querySelector('#alert4').classList.toggle("alert-danger");
        document.querySelector('#alert4').classList.remove("alert-success");
      }
      $('#alert4-text').html("Please enter valid input values.");
      $('.alert').show('fade');
    }
    else
    {
      if(!document.querySelector('#alert4').classList.contains("alert-danger"))
      {
        document.querySelector('#alert4').classList.toggle("alert-danger");
        document.querySelector('#alert4').classList.remove("alert-success");
      }
      $('#alert4-text').html(request.responseText);
      $('.alert').show('fade');
    }
  }
  request.send();
}
// ------------------------------------------------End of browse packets functions--------------------------------------------------------

// ------------------------------------------------Start of browse employees functions--------------------------------------------------------
async function LoadEmployeeTable()
{
  function buildHtmlTablePackets(arr)
  {
    let table = _table_.cloneNode(false),
      thead = _thead_.cloneNode(false),
      tbody = _tbody_.cloneNode(false),
      columns = addAllColumnHeaders(arr, table);
    for (let i = 0, maxi = arr.length; i < maxi; ++i) 
    { //table rows and columns
      let tr = _tr_.cloneNode(false);
      for (let j = 0, maxj = columns.length; j < maxj; ++j) 
      {
        let td = _td_.cloneNode(false);
        let cellValue = arr[i][columns[j]];
        if (cellValue == '')
        cellValue = 'inactive';
        if (cellValue == "1" && j==4)
        cellValue = 'active';
        if (cellValue == 'ROLE_ADMIN')
        cellValue = 'admin';
        if (cellValue == 'ROLE_USER')
        cellValue = 'user';
        
        td.appendChild(document.createTextNode(cellValue || ''));

        tr.appendChild(td);
      }
      table.appendChild(thead);
      table.appendChild(tbody);
      tbody.appendChild(tr);
      table.className="content-table";
      table.id="my-content-table";
    }
    return table;
  };
  function addAllColumnHeaders(arr, table)  // Table headers
  {
    let columnSet = [],
      tr = _tr_.cloneNode(false),
      thead = _thead_.cloneNode(false);
    for (let i = 0, l = arr.length; i < l; i++) {
      for (let key in arr[i]) {
        if (arr[i].hasOwnProperty(key) && columnSet.indexOf(key) === -1) {
          columnSet.push(key);
          let th = _th_.cloneNode(false);
           if (key==='fullName')
           key="name";
           if (key==='cityName')
           key="city";
           if (key==='roles')
           key="role";
           if (key==='active')
           key="account status";
          th.appendChild(document.createTextNode(key));
          tr.appendChild(th);
        }
      }
    }
    thead.appendChild(tr);
    table.appendChild(thead);
    return columnSet;
  }
    let _table_ = document.createElement('table');
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
    let json = await fetch('http://localhost:8080/employee/fetch',
    {
      method: 'GET',
      headers: myHeaders,
    })
    .then(response => response.json())
    .then((response) => 
    {
      //console.log(response);
      page__main__container.appendChild(buildHtmlTablePackets(response));
    })
}

function changeEmployeeProfile()
{
  //....
}
// ------------------------------------------------End of browse employees functions--------------------------------------------------------

// ------------------------------------------------Start of browse warehouses functions--------------------------------------------------------

function addWarehouseModal()
{
  $('.alert').hide();
  button5.innerHTML="Add Warehouse";
  let title9 = document.getElementById("modal-title9");
  title9.style.textDecoration = "underline";
  let title10 = document.getElementById("modal-title10");
  title10.style.textDecoration = "none";

  let label9 = document.getElementById("labelField9");
  label9.innerHTML="Storage space";
  let label10 = document.getElementById("labelField10");
  $('#input-field10').css("display","block");
  label10.style.display="block";
  label10.innerHTML="City id";
  
  button5.setAttribute("onclick", "addWarehouse()");
}
function addCityModal()
{
  $('.alert').hide();
  button5.innerHTML="Add City";
  let title9 = document.getElementById("modal-title9");
  title9.style.textDecoration = "none";
  let title10 = document.getElementById("modal-title10");
  title10.style.textDecoration = "underline";

  let label9 = document.getElementById("labelField9");
  label9.innerHTML="City name";
  let label10 = document.getElementById("labelField10");
  $('#input-field10').css("display","none");
  label10.style.display="none";
  
  button5.setAttribute("onclick", "addCity()");
}
function addWarehouse()
{
  let input1 = document.getElementsByName("input-field9")[0].value;
  let input2 = document.getElementsByName("input-field10")[0].value;

  let params = 'storageSpace=' + input1 + '&' + 'cityId=' + input2;
  let request = new XMLHttpRequest();
  request.open("POST", "http://localhost:8080/employee/addWarehouse?" + params, true);
  request.setRequestHeader('Authorization', localStorage.getItem('jwtToken'));
  request.setRequestHeader("Accept", "application/json");
  request.setRequestHeader('Content-Type', 'application/json');
  request.onload = () => 
  {
    if(request.responseText.includes("Warehouse added successfully"))
    {
      reLoadWarehousesTable();
      if(!document.querySelector('#alert5').classList.contains("alert-success"))
      {
        document.querySelector('#alert5').classList.toggle("alert-success");
        document.querySelector('#alert5').classList.remove("alert-danger");
      }
      $('#alert5-text').html(request.responseText);
      $('.alert').show('fade');
    }
    else if(request.responseText === "Incorrect HTTP request params!")
    {
      if(!document.querySelector('#alert5').classList.contains("alert-danger"))
      {
        document.querySelector('#alert5').classList.toggle("alert-danger");
        document.querySelector('#alert5').classList.remove("alert-success");
      }
      $('#alert5-text').html("Please enter valid input values.");
      $('.alert').show('fade');
    }
    else
    {
      if(!document.querySelector('#alert5').classList.contains("alert-danger"))
      {
        document.querySelector('#alert5').classList.toggle("alert-danger");
        document.querySelector('#alert5').classList.remove("alert-success");
      }
      $('#alert5-text').html(request.responseText);
      $('.alert').show('fade');
    }
  }
  request.send();
}
function addCity()
{
  let input1 = document.getElementsByName("input-field9")[0].value;

  let params = 'cityName=' + input1;
  let request = new XMLHttpRequest();
  request.open("POST", "http://localhost:8080/employee/addCity?" + params, true);
  request.setRequestHeader('Authorization', localStorage.getItem('jwtToken'));
  request.setRequestHeader("Accept", "application/json");
  request.setRequestHeader('Content-Type', 'application/json');
  request.onload = () => 
  {
    if(request.responseText.includes("City added successfully"))
    {
      if(!document.querySelector('#alert5').classList.contains("alert-success"))
      {
        document.querySelector('#alert5').classList.toggle("alert-success");
        document.querySelector('#alert5').classList.remove("alert-danger");
      }
      $('#alert5-text').html(request.responseText);
      $('.alert').show('fade');
    }
    else if(request.responseText === "Incorrect HTTP request params!")
    {
      if(!document.querySelector('#alert5').classList.contains("alert-danger"))
      {
        document.querySelector('#alert5').classList.toggle("alert-danger");
        document.querySelector('#alert5').classList.remove("alert-success");
      }
      $('#alert5-text').html("Please enter valid input values.");
      $('.alert').show('fade');
    }
    else
    {
      if(!document.querySelector('#alert5').classList.contains("alert-danger"))
      {
        document.querySelector('#alert5').classList.toggle("alert-danger");
        document.querySelector('#alert5').classList.remove("alert-success");
      }
      $('#alert5-text').html(request.responseText);
      $('.alert').show('fade');
    }
  }
  request.send();
}

// ------------------------------------------------End of browse warehouses functions--------------------------------------------------------

// ------------------------------------------------End of Admin-HOME Functions------------------------------------------------------



// ------------------------------------------------Start of User-HOME Functions------------------------------------------------------

window.addEventListener("load", () => {
  let element = document.querySelector("#myTasks");
  if(typeof(element) != 'undefined' && element != null)
  {
    document.querySelector("#myTasks").addEventListener("click", e => {
      myTasksPage();
  });
  } 
});

window.addEventListener("load", () => {
  let element = document.querySelector("#myHistory");
  if(typeof(element) != 'undefined' && element != null)
  {
    document.querySelector("#myHistory").addEventListener("click", e => {
      myHistoryPage();
  });
  } 
});

function myTasksPage()
{
  $('#my-content-table').remove();
  LoadMyTasksTable();
}
function myHistoryPage()
{

}

async function LoadMyTasksTable()
{
  function buildHtmlTablePackets(arr)
  {
    let table = _table_.cloneNode(false),
      thead = _thead_.cloneNode(false),
      tbody = _tbody_.cloneNode(false),
      columns = addAllColumnHeaders(arr, table);
    for (let i = 0, maxi = arr.length; i < maxi; ++i) 
    { //table rows and columns
      let tr = _tr_.cloneNode(false);
      for (let j = 0, maxj = columns.length; j < maxj; ++j) 
      {
        let td = _td_.cloneNode(false);
        let cellValue = arr[i][columns[j]];
        
         td.appendChild(document.createTextNode(cellValue || ''));

         tr.appendChild(td);
      }
      table.appendChild(thead);
      table.appendChild(tbody);
      tbody.appendChild(tr);
      table.className="content-table";
      table.id="my-content-table";
    }
    return table;
  };
  function addAllColumnHeaders(arr, table)  // Table headers
  {
    let columnSet = [],
      tr = _tr_.cloneNode(false),
      thead = _thead_.cloneNode(false);
    for (let i = 0, l = arr.length; i < l; i++) {
      for (let key in arr[i]) {
        if (arr[i].hasOwnProperty(key) && columnSet.indexOf(key) === -1) {
          columnSet.push(key);
          let th = _th_.cloneNode(false);
          // if (key==='fullStatusName')
          // key="status";
          // if (key==='cityName')
          // key="city";
          // if (key==='expectedFinish')
          // key="finish";
          th.appendChild(document.createTextNode(key));
          tr.appendChild(th);
        }
      }
    }
    thead.appendChild(tr);
    table.appendChild(thead);
    return columnSet;
  }
    let _table_ = document.createElement('table');
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
    let params = 'email=' + localStorage.getItem('email');
    let json = await fetch('http://localhost:8080/task/getEmployeeTasks?' + params,
    {
      method: 'GET',
      headers: myHeaders,
    })
    .then(response => response.json())
    .then((response) => 
    {
      //console.log(response);
      page__main__container.appendChild(buildHtmlTablePackets(response));
    })
    .then(response => // Adds event listeners to each button in order to open the submenus.
    {
      
    });
}
// ------------------------------------------------End of User-HOME Functions------------------------------------------------------