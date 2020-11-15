const url =
  "https://sep6-api.azurewebsites.net/api/httptrigger?name=Jakub";

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
