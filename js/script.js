// Auto-highlight current nav link
const currentPage = window.location.pathname.split("/").pop();

document.querySelectorAll("nav a").forEach(link => {
  const linkPage = link.getAttribute("href").split("/").pop();

  if (linkPage === currentPage || (currentPage === "" && linkPage === "index.html")) {
    link.classList.add("active");
  }
});


// Back-to-top button
const backToTopButton = document.createElement("button");
backToTopButton.textContent = "↑";
backToTopButton.className = "back-to-top";
document.body.appendChild(backToTopButton);

window.addEventListener("scroll", () => {
  if (window.scrollY > 400) {
    backToTopButton.classList.add("show");
  } else {
    backToTopButton.classList.remove("show");
  }
});

backToTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});


// Collapsible sections
document.querySelectorAll(".collapsible-title").forEach(title => {
  title.addEventListener("click", () => {
    title.classList.toggle("open");

    const content = title.nextElementSibling;

    if (content && content.classList.contains("collapsible-content")) {
      content.classList.toggle("open");
    }
  });
});


// Reference search
const referenceSearch = document.getElementById("referenceSearch");

if (referenceSearch) {
  referenceSearch.addEventListener("input", () => {
    const searchText = referenceSearch.value.toLowerCase();

    document.querySelectorAll(".reference-item").forEach(reference => {
      const referenceText = reference.textContent.toLowerCase();

      if (referenceText.includes(searchText)) {
        reference.style.display = "";
      } else {
        reference.style.display = "none";
      }
    });
  });
}


// Dashboard charts
let regionChart;
let ageChart;
let timelineChart;

function getChartOptions(titleText) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: titleText,
        font: {
          size: 16,
          weight: "bold"
        },
        padding: {
          bottom: 16
        }
      },
      legend: {
        position: "top"
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 12
          }
        }
      },
      x: {
        ticks: {
          font: {
            size: 12
          }
        }
      }
    }
  };
}

function buildRegionChart(metric) {
  const labels = ["North America", "Europe", "Africa", "Asia", "South America"];

  const dataOptions = {
    total_cases_per_million: {
      label: "Total cases per million",
      data: [320000, 410000, 75000, 180000, 250000]
    },
    total_deaths_per_million: {
      label: "Total deaths per million",
      data: [3200, 2900, 900, 1200, 3100]
    }
  };

  if (regionChart) {
    regionChart.destroy();
  }

  regionChart = new Chart(document.getElementById("regionChart"), {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: dataOptions[metric].label,
          data: dataOptions[metric].data
        }
      ]
    },
    options: getChartOptions("Regional COVID-19 Comparison")
  });
}

function buildAgeChart(metric) {
  const labels = ["0–17", "18–49", "50–64", "65+"];

  const dataOptions = {
    hospitalization: {
      label: "COVID hospitalization risk",
      data: [1, 3, 8, 20]
    },
    severity: {
      label: "Relative severity risk",
      data: [1, 2, 6, 18]
    }
  };

  if (ageChart) {
    ageChart.destroy();
  }

  ageChart = new Chart(document.getElementById("ageChart"), {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: dataOptions[metric].label,
          data: dataOptions[metric].data
        }
      ]
    },
    options: getChartOptions("Age-Group Risk Comparison")
  });
}

function buildTimelineChart(metric, location) {
  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];

  const baseData = {
    Canada: {
      new_cases_smoothed_per_million: [95, 130, 210, 330, 240, 180, 140, 165],
      new_deaths_smoothed_per_million: [1.4, 2.0, 3.2, 5.1, 3.8, 2.9, 2.1, 2.5]
    },
    "United States": {
      new_cases_smoothed_per_million: [120, 180, 260, 420, 300, 210, 160, 190],
      new_deaths_smoothed_per_million: [2, 3, 5, 8, 6, 4, 3, 4]
    },
    "United Kingdom": {
      new_cases_smoothed_per_million: [140, 190, 280, 390, 310, 220, 170, 200],
      new_deaths_smoothed_per_million: [1.8, 2.6, 4.3, 6.5, 5.1, 3.7, 2.8, 3.2]
    },
    Japan: {
      new_cases_smoothed_per_million: [60, 90, 150, 260, 210, 170, 130, 155],
      new_deaths_smoothed_per_million: [0.8, 1.2, 2.1, 3.6, 3.0, 2.4, 1.7, 2.0]
    },
    World: {
      new_cases_smoothed_per_million: [100, 150, 230, 350, 270, 200, 150, 180],
      new_deaths_smoothed_per_million: [1.5, 2.3, 3.8, 6.0, 4.7, 3.5, 2.6, 3.0]
    }
  };

  const metricLabels = {
    new_cases_smoothed_per_million: "New cases per million",
    new_deaths_smoothed_per_million: "New deaths per million"
  };

  if (timelineChart) {
    timelineChart.destroy();
  }

  timelineChart = new Chart(document.getElementById("timelineChart"), {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: `${location}: ${metricLabels[metric]}`,
          data: baseData[location][metric],
          tension: 0.3
        }
      ]
    },
    options: getChartOptions("Virus Trends Over Time")
  });
}

function initializeDashboardCharts() {
  if (!document.getElementById("regionChart")) return;

  const regionMetric = document.getElementById("regionMetric");
  const ageMetric = document.getElementById("ageMetric");
  const timelineLocation = document.getElementById("timelineLocation");
  const timelineMetric = document.getElementById("timelineMetric");

  if (!regionMetric || !ageMetric || !timelineLocation || !timelineMetric) {
    console.error("One or more dashboard dropdowns are missing.");
    return;
  }

  buildRegionChart(regionMetric.value);
  buildAgeChart(ageMetric.value);
  buildTimelineChart(timelineMetric.value, timelineLocation.value);

  regionMetric.addEventListener("change", () => {
    buildRegionChart(regionMetric.value);
  });

  ageMetric.addEventListener("change", () => {
    buildAgeChart(ageMetric.value);
  });

  timelineLocation.addEventListener("change", () => {
    buildTimelineChart(timelineMetric.value, timelineLocation.value);
  });

  timelineMetric.addEventListener("change", () => {
    buildTimelineChart(timelineMetric.value, timelineLocation.value);
  });
}

initializeDashboardCharts();