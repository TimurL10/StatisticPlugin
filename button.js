
var advance = {
  status: "",
  name : "",
  value : "",
  caseAmount : ""
}
var setting = {
}
var Authors = [{
  name: "",
  value: "",
  caseAmount: "",
  turn : "",
  dsGostR: "",
  dsTrEas: "",
  ssGostR: "",
  ssTrEas: ""
}]
var arpromis = []
var arrSelectedAutors =[]

//progress bar
function move() {
  var inf = document.querySelector('.info-div')
  if (!inf){
  var div2 = document.createElement('div');
  div2.className = "info-div"
  div2.innerHTML = 'Please wait..'
  document.querySelector('.table-perf-title').appendChild(div2)
}
}
var div = document.createElement("div")
div.className="ldBar"
div.setAttribute('data-value', '50');
document.querySelector('.wrapper').appendChild(div)

var div = document.createElement("div")
div.innerHTML = 'Настройки'
div.className = 'settings-pan-title'
document.querySelector('.wrapper').appendChild(div)

var div = document.createElement("div")
div.className = 'settings-pan'
document.querySelector('.wrapper').appendChild(div)

var div1 = document.createElement("div")
div.innerHTML = '<input type="text" name="dateFrom" value="" placeholder="&nbsp;дата начала" id="datepicker"/><input type="text" name="dateTo" value="" placeholder="&nbsp;дата окончания" id="datepicker1"/>'
document.querySelector('.settings-pan').appendChild(div1)

var div2 = document.createElement("div")
div2.className = 'input-checkbox-lable'
div2.id = 'checkbDiv'
div2.innerHTML = '<input type="checkbox" id="dsGostR" value="3"><label for="dsGostR">&nbsp;ДС ГОСТ Р</label><input type="checkbox" id="dsTrEaes" value="5"><label for="dsTrEaes">&nbsp;ДС ТР ЕАЭС</label><input type="checkbox" id="ssGostR" value="4"><label for="ssGostR">&nbsp;СС ГОСТ Р</label><input type="checkbox" id="ssTrEas" value="6"><label for="ssTrEas">&nbsp;СС ТР ЕАЭС</label><br>'
document.querySelector('.settings-pan').appendChild(div2)

div.setAttribute('data-value', '50');
document.querySelector('.wrapper').appendChild(div)

$( function() {
$( "#datepicker" ).datepicker();
});
$( function() {
$( "#datepicker1" ).datepicker();
});

var buttonDate = document.createElement("button")
buttonDate.innerHTML = "Получить отчет"
buttonDate.id = "myBtn"
document.querySelector('.wrapper').appendChild(buttonDate)
buttonDate.addEventListener('click',submutFunc,false);
function submutFunc() {
  setting.fromDate = document.querySelector("#datepicker").value
  setting.toDate = document.querySelector("#datepicker1").value
  setting.typedoc = []
  //Set array of checked agents
  var i = document.querySelectorAll("#checkbDiv input")
    i.forEach(item => {
      if(item.checked) {
        setting.typedoc.push(item)
      }
  })
      var promiseArray = []
      Authors.filter(item => {
      if(item.turn == "on") {return item}
      move()
    })
    .forEach((item,index,arr) => {
        setting.typedoc.forEach(elemnt => {
        promiseArray.push(SetValue(item,elemnt,arr,index))
        })
      })
          Promise.all(promiseArray).then((result) => {
          var table = document.querySelector('.res-table');
          if (!table) {
            table = document.createElement("div");
            table.className = "res-table"
            document.querySelector('#mainDiv').appendChild(table)
          }

            table.innerHTML = ''
            var inf = document.querySelector('.info-div')
            inf.parentNode.removeChild( inf );
            var titleDiv = document.createElement('div')
            titleDiv.className = 'table-docs-title'
            titleDiv.innerHTML = 'Все документы'
            table.appendChild(titleDiv)
          var row = document.createElement("div");
          row.className="res-row";
          row.innerHTML='<div class="res-cell" style="color:#9c9ea1;">ИСПОЛНИТЕЛЬ</div>';
          table.appendChild(row);
          setting.typedoc.forEach(elemnt => {
            var cell = document.createElement("div");
            cell.className = "res-cell"
            cell.setAttribute("style", "color: #9c9ea1;");
            switch(elemnt.id) {
              case 'dsGostR' : cell.innerHTML = "ДС ГОСТ Р";
              break;
              case 'dsTrEaes' : cell.innerHTML = "ДС ТР ЕАЭС";
              break;
              case 'ssGostR' : cell.innerHTML = "СС ГОСТ Р";
              break;
              case 'ssTrEas' : cell.innerHTML = "СС ТР ЕАЭС";
              break;
            }
            row.appendChild(cell)
          })
                Authors.filter(item => (item.turn == "on")).forEach(promiss=> {
                var item = promiss
                var row = document.createElement("div");
                row.className="res-row"
                var cell = document.createElement("div");
                cell.className = "res-cell"
                cell.innerHTML = item.name
                row.appendChild(cell)

                  setting.typedoc.forEach(elemnt => {
                  var cell = document.createElement("div");
                  cell.className = "res-cell"
                  cell.innerHTML = item[elemnt.id]
                  row.appendChild(cell)
           })
           table.appendChild(row)
        })
      })
}

function SetValue(item,elemnt,arr,index) {
  return Promise.resolve().then(()=> {
    return FindValue({
      value:item.value,
       type_value : elemnt.value,
       fromDate : setting.fromDate,
       toDate: setting.toDate
    }).then(object => {
      arr[index][elemnt.id] =  object;
      return arr[index]
})
})
}

function FindValue(object) {
  var body  = new FormData();
  body.append("SelectedExecutorId", object.value);
  body.append("SelectedStartDate", object.fromDate);
  body.append("SelectEndDate", object.toDate);
  body.append("SelectedDocumentTypeId", object.type_value);
  return  fetch("https://stage-2-docs.advance-docs.ru/Claim",{
    method : 'POST',
    body : body,
    credentials: "include"
}).then(function(responce){
    return responce.text()
}).then(function(text){
  parser = new DOMParser();
  doc = parser.parseFromString(text, "text/html");
  return doc.querySelector("table.inner tbody tr td").innerHTML;
}).catch((err)=>{
  return "Ошибка";
})
}

LoadAutorhs()



function LoadAutorhs() {
  fetch("https://stage-2-docs.advance-docs.ru/Claim",{credentials: "include"})
  .then((responce)=>{
    return responce.text()
  }).then((text)=>{
    parser = new DOMParser();
    doc = parser.parseFromString(text, "text/html");
    var arr = doc.querySelectorAll("#SelectedExecutorId option")
    arr.forEach(function(item, i) {
      if (i == 0) {
        item.innerHTML = "Для всех:"
      }
        Authors.push({
        name: item.innerHTML,
        value: item.value,
        caseAmount : "",
        turn : "off"
      })
    });
    Authors.splice(0,1)
  }).then(()=>{
    var mainDiv = document.createElement('div');
    mainDiv.id = "mainDiv";
    var div = document.createElement('div');
    div.id = "All_authors";
    mainDiv.appendChild(div)
    var titleDiv = document.createElement('div')
    titleDiv.className = 'table-perf-title'
    titleDiv.innerHTML = 'Исполнители'
    div.appendChild(titleDiv)
    var chkbxSelectAll = document.createElement('input')
    chkbxSelectAll.id = 'chkbx-Select-All'
    chkbxSelectAll.setAttribute('type','checkbox')

    Authors.forEach(function(item) {
    var subdiv = document.createElement('div');
    subdiv.className = "mySubDiv"
    subdiv.id = item.name
    subdiv.myName = item.name
    subdiv.innerHTML = item.name
    subdiv.addEventListener('click',(e)=> {
      var o = e.target;
      while(o){
        if(o.tagName =='DIV'){
          break;
        }
        o = o.parentNode;
      }
      if(o){
        if(o.attributes['data-sel']){
          o.removeAttribute('data-sel');
          item.turn = "off"
        } else {
          item.turn = "on"
          o.setAttribute('data-sel', 1);
        }
      }
    },false);
    div.appendChild(subdiv);
  })
  document.querySelector('.wrapper').appendChild(mainDiv)
})
};
