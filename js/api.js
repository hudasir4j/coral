/**
 * Populates the cities dropdown with all cities, sorted in alphabetical order.
 */
function populateCitiesDropdown() {
  let request = new XMLHttpRequest();
  let url = `https://public.gis.lacounty.gov/public/rest/services/LACounty_Dynamic/LMS_Data_Public/MapServer/42/query?where=1%3D1&outFields=city&outSR=4326&f=json`;
  request.open("GET", url, true);
  request.send();
  request.onreadystatechange = () => {
    if (request.readyState == 4 && request.status == 200) {
      let response = JSON.parse(request.responseText);
      let oppsArr = response.features;
      let cityArr = [];
      
      for (let i in oppsArr) {
        let city = oppsArr[i].attributes.city.toLowerCase();
        if (!cityArr.includes(city) && city !== "los angelels") {
          cityArr.push(city);
        }
      }
      
      cityArr.sort();
      
      let innerHTML = "";
      cityArr.forEach((city) => {
        innerHTML += `<option>${city}</option>`;
      });
      
      document.getElementById("cities").innerHTML = innerHTML;
    }
  };
}

/**
 * Returns the search results, based on the user's input(s).
 */
function getSearchResults() {
  let request = new XMLHttpRequest();

  // Get keyword array
  let keywordArr = document
    .getElementById("keyword-input")
    .value.toLowerCase()
    .split(" ");
  let keywordQueryStr = `1%3D1`;

  // Get target city
  let targetCity = document.getElementById("city-input").value.toLowerCase();
  let cityQueryStr = `city%20%3D%20'${targetCity}'`.replace(" ", "%20");

  // Build URL
  let whereQueryStr;
  if ((keywordArr && targetCity) || targetCity) whereQueryStr = cityQueryStr;
  else if (keywordArr) whereQueryStr = keywordQueryStr;
  else return;
  let url = `https://public.gis.lacounty.gov/public/rest/services/LACounty_Dynamic/LMS_Data_Public/MapServer/42/query?where=${whereQueryStr}&outFields=description,zip,link,email,url,Name,addrln2,addrln1,city,hours,phones&outSR=4326&f=json`;

  request.open("GET", url, true);
  request.send();
  request.onreadystatechange = () => {
    if (request.readyState == 4 && request.status == 200) {
      let response = JSON.parse(request.responseText);
      let oppsArr = response.features;
      let resArr = [];

      for (let i in oppsArr) {
        let desc = oppsArr[i].attributes.description.toLowerCase();
        let name = oppsArr[i].attributes.Name.toLowerCase();
        keywordArr.forEach((keyword) => {
          if (desc.indexOf(keyword) !== -1 || name.indexOf(keyword) !== -1) {
            resArr.push(oppsArr[i]);
          }
        });
      }
      console.log(resArr);

      let innerHTML = document.getElementById("output").innerHTML;
      if (resArr.length <= 0) {
        innerHTML.innerHTML = "no results found!"; // TODO: make pretty
      } else {
        let name,
          description,
          address1,
          address2,
          city,
          zip,
          hours,
          phones,
          url,
          link;
        innerHTML = ``;
        for (let i = 0; i < resArr.length; i++) {
          name = resArr[i].attributes.Name;
          description = resArr[i].attributes.description;
          address1 = resArr[i].attributes.addrln1;
          address2 = resArr[i].attributes.addrln2;
          city = resArr[i].attributes.city;
          zip = resArr[i].attributes.zip;
          hours = resArr[i].attributes.hours;
          phones = resArr[i].attributes.phones;
          url = resArr[i].attributes.url;
          link = resArr[i].attributes.link;

          innerHTML += `<div class="opportunity">
               <h2>${name}</h2>
               <h5>
                 ${description}
               </h5>
             </div>`.toLowerCase();
        }
      }
      document.getElementById("opportunities").innerHTML = innerHTML;
    }
  };
}
