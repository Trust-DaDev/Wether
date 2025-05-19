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
        showToast("Please enter a city name.", "info");
    }
}

function fetchWeatherData(city) {
    const apiKey = "94d3e8fe2b9d385289be0baeb4367a2d"; // Replace with your API key
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
k
