
var div = document.createElement("div")
div.innerHTML = '<a href="#" id="name" align="center"></a><br><a href="#" id="status" align="left"></a><br>'
document.querySelector('.wrapper').appendChild(div)



var div1 = document.createElement("div")
div.innerHTML = '<h5>Укажите дату с:</h5><br><input type="text" name="date" class="form_datetime" id="fromDate" value="" placeholder="DD/MM/YYYY"/><h5>По:</h5><br><input type="text" name="date" class="form_datetime" id="toDate" value="" placeholder="DD/MM/YYYY"/><br>'
document.querySelector('.wrapper').appendChild(div1)

var buttonDate = document.createElement("button")
buttonDate.innerHTML = "Submit"
buttonDate.style = "mybtn"
buttonDate.onclick = takeDates
document.querySelector('.wrapper').appendChild(buttonDate)
buttonDate.addEventListener('click',(e)=>{
  //takeDates()
  var num = document.querySelectorAll('div[data-sel]')
},false);


LoadAutorhs();


function takeDates(){
  fromDate = document.querySelector("#fromDate").value
  toDate = document.querySelector("#toDate").value
  document.querySelector("#fromDate").value = ""
  document.querySelector("#toDate").value = ""
  LoadAutorhs(fromDate, toDate)
}

function takeNames(itemName){
  names.push(itemName)
  LoadSelectedAutorhs(names, takeDates)
}


var advance = {
  status: "",
  name : "",
  value : "",
  caseAmount : ""
}
var Authors = []
var arpromis = []
var names =[]

// LoadAutorhs()

function LoadAutorhs(fromDate, toDate) {
  fetch("https://stage-2-docs.advance-docs.ru/Claim",{credentials: "include"})
  .then((responce)=>{
    return responce.text()
  }).then((text)=>{
    parser = new DOMParser();
    doc = parser.parseFromString(text, "text/html");
    var arr = doc.querySelectorAll("#SelectedExecutorId option")
    arr.forEach(function(item, i) {
        Authors.push({
        name: item.innerHTML,
        value: item.value,
        caseAmount : ""
      })
    });
    Authors.splice(0,1)
  }).then(()=>{
    return
}).then(()=>{
    var div = document.createElement('div');
    div.id = "All_authors";

    Authors.forEach(function(item){
    var subdiv = document.createElement('div');
    subdiv.id = item.value
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
        } else {
          o.setAttribute('data-sel',1);
        }
      }
    },false);
    //subdiv.style.marginBottom = "20px"
    var b = document.createElement('span');
    b.className = "alert alert-success";
    b.href="#";
    b.innerHTML = item.name;
//    b.onclick = takeNames(item.name)
    //b.style.marginRight = "100px"
    subdiv.appendChild(b);
    var b = document.createElement('span');
    b.className = "alert alert-success";
    b.href="#";
    b.innerHTML = item.caseAmount;
    subdiv.appendChild(b);
    div.appendChild(subdiv);
  })
  document.querySelector('.wrapper').appendChild(div)

})
};




  function setCaseAmount(names, fromDate, toDate){
    var body  = new FormData();
    body.append("SelectedExecutorId", item.id);
    body.append("SelectedStartDate", fromDate);
    body.append("SelectEndDate", toDate);
    return  fetch("https://stage-2-docs.advance-docs.ru/Claim",{
      method : 'POST',
      body : body,
      credentials: "include"
  }).then(function(responce){
      return responce.text()
 }).then(function(text){
    parser = new DOMParser();
    doc = parser.parseFromString(text, "text/html");
   item.caseAmount = doc.querySelector("table.inner tbody tr td").innerHTML;
   return
 }).catch((err)=>{
   item.caseAmount = "Ошибка";
 })
 };


 function takeDates(){
   fromDate = document.querySelector("#fromDate").value
   toDate = document.querySelector("#toDate").value
   document.querySelector("#fromDate").value = ""
   document.querySelector("#toDate").value = ""
   LoadAutorhs(fromDate, toDate)
 }

 function takeNames(itemName){
   names.push(itemName)
   setCaseAmount(names, takeDates)
 }


 var advance = {
   status: "",
   name : "",
   value : "",
   caseAmount : ""
 }
 var Authors = []
 var arpromis = []
 var names =[]

 // LoadAutorhs()

 function LoadSelectedAutorhs(names,fromDate, toDate) {
 //   fetch("https://stage-2-docs.advance-docs.ru/Claim",{credentials: "include"})
 //   .then((responce)=>{
 //     return responce.text()
 //   }).then((text)=>{
 //     parser = new DOMParser();
 //     doc = parser.parseFromString(text, "text/html");
 //     var arr = doc.querySelectorAll("#SelectedExecutorId option")
 //     arr.forEach(function(item, i) {
 //         Authors.push({
 //         name: item.innerHTML,
 //         value: item.value,
 //         caseAmount : ""
 //       })
 //     });
 //     Authors.splice(0,1)
 //   }).then(()=>{
 //     return
 // }).then(()=>{
   arpromis = Authors.map(item=>setCaseAmount(names, fromDate, toDate));
   return Promise.all(arpromis).then(()=>{
     var div = document.createElement('div');
     div.id = "All_authors";
     Authors.forEach(function(item){
     var subdiv = document.createElement('div');
     subdiv.id = names.value
     subdiv.myName = names.name
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
         } else {
           o.setAttribute('data-sel',1);
         }
       }
     },false);
     //subdiv.style.marginBottom = "20px"
     var b = document.createElement('span');
     b.className = "alert alert-success";
     b.href="#";
     b.innerHTML = names.name;
 //    b.onclick = takeNames(item.name)
     //b.style.marginRight = "100px"
     subdiv.appendChild(b);
     var b = document.createElement('span');
     b.className = "alert alert-success";
     b.href="#";
     b.innerHTML = names.caseAmount;
     subdiv.appendChild(b);
     div.appendChild(subdiv);
   })
   document.querySelector('.wrapper').appendChild(div)
 })
 }
 



 // var dots = window.setInterval( function() {
 //     var wait = document.getElementById("wait");
 //     if ( wait.innerHTML.length > 2 )
 //         wait.innerHTML = "";
 //     else
 //         wait.innerHTML += ".";
 //     }, 500);



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
