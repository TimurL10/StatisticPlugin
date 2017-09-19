//document.querySelector('#mybtn').addEventListener('click', myFunction);
var advance = {
  status: "",
  name : "",
  value : "",
  caseAmount : ""
}
var Authors = [
]
var arpromis = []

LoadAutorhs()

function LoadAutorhs(argument) {

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
    arpromis = Authors.map(item=>setCaseAmount(item));
    return Promise.all(arpromis).then(()=>{
    var div = document.createElement('div');
    div.id = "All_authors";
    Authors.forEach(function(item){
    var subdiv = document.createElement('div');
    subdiv.id = item.value
    var b = document.createElement('a');
    b.className = "alert alert-success";
    b.href="#";
    b.innerHTML = item.name;
    subdiv.appendChild(b);
    var b = document.createElement('a');
    b.className = "alert alert-success";
    b.href="#";
    b.innerHTML = item.caseAmount;
    subdiv.appendChild(b);
    div.appendChild(subdiv);
  })
  document.body.appendChild(div);
})
})
var wait = document.getElementById("wait");
 wait.innerHTML = "";
}
  function setCaseAmount(item){
    var body  = new FormData();
    body.append("SelectedExecutorId",item.value);
    body.append("SelectedStartDate", "19.08.2017");
    body.append("SelectEndDate", "19.09.2017");
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
 }

 var dots = window.setInterval( function() {
     var wait = document.getElementById("wait");
     if ( wait.innerHTML.length > 2 )
         wait.innerHTML = "";
     else
         wait.innerHTML += ".";
     }, 500);

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
