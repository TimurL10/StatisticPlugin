let promise = new Promise((resolve, reject) => {


    resolve("result");

  reject(new Error("error"));

});



promise
  .then(
    result => {
      alert("Fulfilled: " + result);
    },
    error => {
      alert("Rejected: " + error);
    }
  );

console.log(promise)
