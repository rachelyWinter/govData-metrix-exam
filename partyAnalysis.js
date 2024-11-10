document.addEventListener("DOMContentLoaded", () => {
  fetchListOfCity();
  const cityInput = document.getElementById("select_city_input");
  cityInput.addEventListener("change", (event) => {
    const cityName = event.target.value;
    console.log("city" + cityName);
    if (cityName) {
      fetch7TopPartiesByCity(cityName);
    }
  });
});

function fetchListOfCity() {
  const citiesURL =
    "https://data.gov.il/api/3/action/datastore_search?resource_id=5c78e9fa-c2e2-4771-93ff-7f400a12f7ba&q=&limit=32000";
  fetch(citiesURL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          "An error occurred, please try again later" + response.statusText
        );
      }
      return response.json();
    })
    .then((data) => {
      const cities = data.result.records;

      const cityNames = cities.map((city) => city["שם_ישוב"]); // מחלצים את השם של העיר

      const cityListElement = document.getElementById("city_list");
      cityNames.forEach((cityName) => {
        const option = document.createElement("option");
        option.value = cityName;
        cityListElement.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

fetchListOfCity();

function fetch7TopPartiesByCity(cityName) {
  document.createElement("h1").innerHTML = "תוצאות הבחירות";
  const partiesURL = `https://data.gov.il/api/3/action/datastore_search?resource_id=929b50c6-f455-4be2-b438-ec6af01421f2&q={"שם ישוב":"${cityName}"}&limit=32000`;
  fetch(partiesURL)
    .then((response) => {
      if (!response.ok) {
        document.createElement("h3").innerText = "Service Error";
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      const cities = data.result.records;
      let cityData = cities[0];
      if (cityData) {
        // מחלצים את שמות המפלגות והקולות וממירים למערך
        const partyVotes = Object.entries(cityData).filter(
          ([key, value]) =>
            key !== "שם ישוב" &&
            key !== "סמל ישוב" &&
            key !== "בזב" &&
            key !== "מצביעים" &&
            key !== "פסולים" &&
            key !== "כשרים" &&
            key !== "_id"
        );
        console.log(partyVotes);
        // מיון המפלגות לפי מספר הקולות בסדר יורד ובחירת 7 הראשונות
        const topParties = partyVotes
          .sort((a, b) => b.votes - a.votes)
          .filter(([key, value]) => value > 10)
          .slice(0, 7);
        console.log(topParties);
        resetCanvas();
        const ctx = document.getElementById("myChart");
        const labels = topParties.map((item) => item[0]);
        const data = topParties.map((item) => item[1]);

        new Chart(ctx, {
          type: "bar",
          data: {
            labels,
            datasets: [
              {
                label: "המפלגות הגבוהות ביותר ",
                data,
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      }
    });
}

function resetCanvas() {
  const canvasContainer = document.getElementById("canvasContainer");
  canvasContainer.innerHTML = '<canvas id="myChart"></canvas>';
}
// fetch7TopPartiesByCity("מודיעין עילית");
