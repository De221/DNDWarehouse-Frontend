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

            let block = document.getElementById("index-page");
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
                let div = _div_.cloneNode(false);
                div.className="side-dropdown-content";
                let subdiv0 = _div_.cloneNode(false);
                subdiv0.innerHTML="id: " + obj["id"];
                div.appendChild(subdiv0);
                let subdiv1 = _div_.cloneNode(false);
                subdiv1.innerHTML="weight: " + obj["weight"];
                div.appendChild(subdiv1);
                let subdiv2 = _div_.cloneNode(false);
                subdiv2.innerHTML="warehouse id: " + obj["warehouseId"];
                div.appendChild(subdiv2);                

                divMain.appendChild(div);
                let divText = _div_.cloneNode(false);
                divText.innerHTML=obj["name"];
                divText.className="divText";
                divMain.appendChild(divText);
                let img = _img_.cloneNode(false);
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
              let divMain = _div_.cloneNode(false);
              divMain.className="dropdown-content";
              cellValue.forEach(obj => {
                let div = _div_.cloneNode(false);
                div.className="side-dropdown-content";
                let subdiv0 = _div_.cloneNode(false);
                subdiv0.innerHTML="id: " + obj["id"];
                div.appendChild(subdiv0);
                let subdiv1 = _div_.cloneNode(false);
                subdiv1.innerHTML="email: " + obj["email"];
                div.appendChild(subdiv1);                          

                divMain.appendChild(div);
                let divText = _div_.cloneNode(false);
                divText.innerHTML=obj["fullName"];
                divText.className="divText";
                divMain.appendChild(divText);
                let img = _img_.cloneNode(false);
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
// Close the dropdown menu if the user clicks outside of it.
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
// ------------------------------------------------End of Admin-browseTasks------------------------------------------------------
// ------------------------------------------------Start of Admin-browseTasks Functions------------------------------------------------------

function reLoadTaskTable()
{
  $('#my-content-table').remove();
  LoadTaskTable();
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




function addPacketModal()
{
  $('.alert').hide();
  button3.innerHTML="Add Packet";
  let title5 = document.getElementById("modal-title5");
  title5.style.textDecoration = "underline";
  let title6 = document.getElementById("modal-title6");
  title6.style.textDecoration = "none";
  
  button3.setAttribute("onclick", "addPacket()");
}
function removePacketModal()
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
// ------------------------------------------------End of Admin-browseTasks Functions------------------------------------------------------