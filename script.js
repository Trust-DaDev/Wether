window.onload = function () {
    getWeather(); // Will auto-detect if input is empty
};
const cookieConsent = document.getElementById("cookieConsent");
  const acceptBtn = document.getElementById("acceptCookies");
  const rejectBtn = document.getElementById("rejectCookies");

  // Check if user already made a choice
  const cookieChoice = localStorage.getItem("cookiesAccepted");

  function showBanner() {
    cookieConsent.classList.remove("hidden");
  }

  function hideBanner() {
    cookieConsent.classList.add("hidden");
  }

  if (cookieChoice === null) {
    // Show banner if no choice yet
    showBanner();
  } else if (cookieChoice === "true") {
    // User accepted - you can init tracking here
    console.log("Cookies accepted");
    // Initialize your analytics or tracking here
  } else {
    // User rejected - disable tracking or don't load scripts
    console.log("Cookies rejected");
  }

  acceptBtn.addEventListener("click", () => {
    localStorage.setItem("cookiesAccepted", "true");
    hideBanner();
    // Initialize your analytics or tracking here
    console.log("User accepted cookies");
  });

  rejectBtn.addEventListener("click", () => {
    localStorage.setItem("cookiesAccepted", "false");
    hideBanner();
    // Ensure no tracking scripts run or remove cookies if needed
    console.log("User rejected cookies");
  });

document.getElementById("getWeather").addEventListener("click", getWeather);
document.getElementById("city").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        getWeather();
    }
});

function getWeather() {
    const city = document.getElementById("city").value;

    if (city) {
        fetchWeatherData(city);
    } else {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    getCityNameFromCoords(lat, lon);
                },
                error => {
                    console.error("Geolocation error:", error);
                    showToast("Location access denied", "error");
                }
            );
        } else {
            showToast("Geolocation not supported by this browser", "error");
        }
    }
}



function fetchWeatherData(city) {
    const apiKey = "94d3e8fe2b9d385289be0baeb4367a2d"; 
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                displayWeatherData(data);
                showToast("Weather fetched successfully!", "success");
            } else {
                showToast("City not found!", "error");
            }
        })
        .catch(error => {
            console.error("Error fetching weather data: ", error);
            showToast("Something went wrong. Please try again later.", "error");
        });
}
function getCityNameFromCoords(lat, lon) {
    const apiKey = '7fbaa96bff6f4f05abc2c30d530850b1'; // replace with your actual key
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.results.length > 0) {
                const components = data.results[0].components;
                const city = components.city || components.town || components.village || components.hamlet;

                if (city) {
                    document.getElementById("city").value = city; // optional: display in input
                    fetchWeatherData(city);
                } else {
                    showToast("Couldn't detect your exact town/city", "error");
                }
            } else {
                showToast("No location results found", "error");
            }
        })
        .catch(error => {
            console.error("OpenCage error:", error);
            showToast("Error getting city from location", "error");
        });
}



function displayWeatherData(data) {
    const cityName = data.name;
    const temperature = data.main.temp;
    const description = data.weather[0].description;
    const humidity = data.main.humidity;

    document.getElementById("weatherInfo").classList.remove("hidden");
    document.getElementById("cityName").textContent = `Weather in ${cityName}`;
    document.getElementById("temperature").textContent = `Temperature: ${temperature}°C`;
    document.getElementById("description").textContent = `Condition: ${description}`;
    document.getElementById("humidity").textContent = `Humidity: ${humidity}%`;
}
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');

  const typeStyles = {
      info: 'border-blue-500',
      success: 'border-green-500',
      error: 'border-red-500',
  };

  toast.className = 'fixed bottom-5 right-5 bg-white shadow-lg p-4 rounded-lg text-gray-800 font-medium hidden z-50 transition-all duration-300';
  toast.classList.add(typeStyles[type] || 'border-blue-500');

  toastMsg.textContent = message;

  toast.classList.remove('hidden');
  toast.classList.remove('slide-out');
  toast.classList.add('slide-in');

  setTimeout(() => {
      toast.classList.remove('slide-in');
      toast.classList.add('slide-out');

      setTimeout(() => {
          toast.classList.add('hidden');
      }, 300);
  }, 3000);
}

