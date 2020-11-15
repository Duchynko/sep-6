const url =
  "https://sep6-api.azurewebsites.net/api/httptrigger?name=Jakub&code=IDY/dvQwiI0TsVbIj8apqLaklMMmUSC1x7ux/sLAH51tHeAhFseGbw==";

fetch(url)
  .then((data) => {
    return data.text();
  })
  .then((res) => {
      console.log(res)
  })
  .catch((err) => {
    console.log('Error:', err);
  });
