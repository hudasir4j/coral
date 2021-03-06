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

      // Get array of unique cities
      for (let i in oppsArr) {
        let city = oppsArr[i].attributes.city.toLowerCase();
        if (!cityArr.includes(city) && city !== "los angelels") {
          cityArr.push(city);
        }
      }

      // Sort array
      cityArr.sort();

      // Set up HTML
      let innerHTML = ``;
      cityArr.forEach((c) => {
        innerHTML += `<option>${c}</option>`;
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

      // Search for keywords in name and description for each opp
      for (let i in oppsArr) {
        let desc = oppsArr[i].attributes.description.toLowerCase();
        let name = oppsArr[i].attributes.Name.toLowerCase();
        keywordArr.forEach((keyword) => {
          if (desc.indexOf(keyword) !== -1 || name.indexOf(keyword) !== -1) {
            resArr.push(oppsArr[i]);
          }
        });
      }

      // Set up HTML
      let innerHTML = ``;
      if (resArr.length <= 0) {
        innerHTML = `<div class="opportunity">
               <h2>no results found!</h2>
             </div>`;
      } else {
        let name, description, city, zip, url;
        // link,
        // address1,
        // address2,
        // hours,
        // phones;
        for (let i = 0; i < resArr.length; i++) {
          let currResAttrs = resArr[i].attributes;
          name = currResAttrs.Name;
          description = currResAttrs.description;
          city = currResAttrs.city;
          zip = currResAttrs.zip;
          url = currResAttrs.url;
          // address1 = currResAttrs.addrln1;
          // address2 = currResAttrs.addrln2;
          // hours = currResAttrs.hours;
          // phones = currResAttrs.phones;
          let urlInnerHTML = ``;
          if (url) {
            if (url.indexOf("http") === -1) {
              url = `https://${url}`;
            }
            urlInnerHTML = `
              <div class="flex-end"><a class="website-btn right" href="${url}" target="_blank" rel="noopener noreferrer">
              website
              </a></div>
              `;
          }
          innerHTML += `
            <div class="opportunity">
               <h2 class="left">${name}</h2>
               <h3 class="right">${city}, ${zip}</h3>
               <p class="left">
                 ${description}
               </p>
               ${urlInnerHTML}
            </div>`.toLowerCase();
        }
      }
      document.getElementById("opportunities").innerHTML = innerHTML;
    }
  };
}
