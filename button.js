
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

var div = document.createElement("div")
div.innerHTML = '<h4 class="textH5">Отчет:</h4>'
document.querySelector('.wrapper').appendChild(div)

var div = document.createElement("div")
div.innerHTML = '<a href="#" id="name" align="center"></a><br><a href="#" id="status" align="left"></a><br>'
document.querySelector('.wrapper').appendChild(div)

var div1 = document.createElement("div")
div.innerHTML = '<h5 class="textH5">Укажите дату с:</h5><input type="text" name="dateFrom" value="" placeholder="DD/MM/YYYY" id="fromDate"/><h5 class="textH5">По:</h5><input type="text" name="dateTo" value="" placeholder="DD/MM/YYYY" id="toDate"/>'
document.querySelector('.wrapper').appendChild(div1)

var div2 = document.createElement("div")
div2.id = "checkbDiv"
div2.innerHTML = '<input type="checkbox" id="dsGostR" value="3"><label for="dsGostR">ДС ГОСТ Р</label><input type="checkbox" id="dsTrEaes" value="5"><label for="dsTrEaes">ДС ТР ЕАЭС</label><br><input type="checkbox" id="ssGostR" value="4"><label for="ssGostR">СС ГОСТ Р</label><input type="checkbox" id="ssTrEas" value="6"><label for="ssTrEas">СС ТР ЕАЭС</label><br>'
//div2.innerHTML = '<select multiple size="4" id="multSelect"><option value="3" >ДС ГОСТ Р</option><option value="5">ДС ТР ЕАЭС</option><option value="4">СС ГОСТ Р</option><option value="6">СС ТР ЕАЭС</option></select>'
document.querySelector('.wrapper').appendChild(div2)

var buttonDate = document.createElement("button")
buttonDate.innerHTML = "Submit"
buttonDate.id = "myBtn"
document.querySelector('.wrapper').appendChild(buttonDate)
buttonDate.addEventListener('click',submutFunc,false);
function submutFunc() {
  setting.fromDate = document.querySelector("#fromDate").value
  setting.toDate = document.querySelector("#toDate").value
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
}).forEach((item,index,arr) => {

    setting.typedoc.forEach(elemnt => {
    promiseArray.push(SetValue(item,elemnt,arr,index))
  })
})
Promise.all(promiseArray).then((result)=>{
//  document.body.innerHTML = "Загрузили Ура!!!"
var bigdiv = document.createElement("div")

      result.forEach(promiss=>{
console.log(promiss);
        var item = promiss

        var div = document.createElement("div")

        setting.typedoc.forEach(elemnt => {

console.log(item);
        div.innerHTML +=  item.name+  "- всего сделанно:" + elemnt.id + " - " + item[elemnt.id] + "\r\n"
        bigdiv.appendChild(div)
      })
document.querySelector('.wrapper').appendChild(bigdiv)
})

})
}

function SetValue(item,elemnt,arr,index) {
  return Promise.resolve().then(()=>{
    //document.body.innerHTML = "Загружаем..."
    return FindValue({
      value:item.value,
       type_value : elemnt.value,
       fromDate : setting.fromDate,
       toDate: setting.toDate
    }).then(object => {

      arr[index][elemnt.id] =  object;
return arr[index]
      // switch (document.body.innerHTML) {
      //   case "Загружаем...":
      //     document.body.innerHTML = "Загружаем."
      //     console.log(document.body.innerHTML);
      //     break;
      //     case "Загружаем..":
      //       document.body.innerHTML = "Загружаем..."
      //       console.log(document.body.innerHTML);
      //       break;
      //       case "Загружаем.":
      //         document.body.innerHTML = "Загружаем.."
      //         console.log(document.body.innerHTML);
      //         break;
      //   default:
//document.querySelectorAll('#' + 'i' + item.value + ' span')[1].innerHTML = item.caseAmount;
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
    var div = document.createElement('div');
    div.id = "All_authors";
    div.className = "mySubDiv"
    Authors.forEach(function(item){
    var subdiv = document.createElement('div');
    subdiv.className = "mySubDiv"
    subdiv.id = "i" + item.value
    subdiv.myName = item.name
    subdiv.addEventListener('click',(e)=>{
      var o=e.target;
      while(o){
        if(o.tagName=='DIV'){
          break;
        }
        o=o.parentNode;
      }
      if(o){
        if(o.attributes['data-sel']){
          o.removeAttribute('data-sel');
          item.turn = "off"
        } else {
          item.turn = "on"
          o.setAttribute('data-sel',1);
        }
      }
    },false);
    var b = document.createElement('span');
    b.className = "alert alert-success";
    b.href="#";
    b.innerHTML = item.name;
    subdiv.appendChild(b);
    var c = document.createElement('span');
    c.className = "alert alert-success";
    c.href="#";
    c.innerHTML = item.caseAmount;
    subdiv.appendChild(c);
    div.appendChild(subdiv);
  })
  document.querySelector('.wrapper').appendChild(div)
})
};

    // function LoadSelectedAutorhs(arrSelectedAutors,fromDate, toDate) {
    //   var arpromis=[]
    //    arrSelectedAutors.forEach(item=>{
    //      if (item.turn == "on") {
    //        arpromis.push(setCaseAmount(item, fromDate, toDate))
    //      }
    //    })
    //    return Promise.all(arpromis).then((value) => {
    //      value.forEach(item=>{
    //        document.querySelectorAll('#' + 'i' + item.value + ' span')[1].innerHTML = item.caseAmount;
    //        })
    //      })
    //    }

// function CheckSession(argument) {
// fetch("https://stage-2-docs.advance-docs.ru/",{
//   credentials: "include"
// }).then(function(responce){
//  return responce.text()
// }).then(function(text){
//   parser = new DOMParser();
//   doc = parser.parseFromString(text, "text/html");
//   if(doc.querySelector(".btn-submit")){
//     advance.status = "Off"
//     advance.name = ""
//   }
//   else{
//     advance.status = "On"
//     advance.name = doc.querySelector(".admin-menu a").innerHTML
//   }
//   document.querySelector('#name').innerHTML = advance.name;
//   document.querySelector('#status').innerHTML =advance.status;
// })
// }
