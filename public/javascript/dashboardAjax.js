function updatecount(id) {
  console.log("ajax is working ");
  $.ajax({
    url: id,
    method: "get",
    success: (res) => {
      new Chart("reportsChart", {
        type: "line",
        data: {
          labels: res.labelsByCount,
          datasets: [
            {
              label: "Sales by orders",
              data: res?.dataByCount,
              borderColor: "blue",
              fill: false,
            },
          ],
        },
        options: {
          legend: { display: true },
          text: "Sales by Amount",
        },
      });
      var barColors = [
        "red",
        "green",
        "blue",
        "orange",
        "brown",
        "blue",
        "#00aba9",
        "#2b5797",
        "#e8c3b9",
        "#1e7145",
        "red",
        "green",
      ];
      new Chart("barChart", {
        type: "bar",
        data: {
          labels: res.labelsByAmount,
          datasets: [
            {
              backgroundColor: barColors,
              data: res?.dataByAmount,
            },
          ],
        },
        options: {
          legend: { display: false },
          title: {
            display: true,
            text: "Sales by Amount",
          },
        },
      });
      

      var barColors = [
        "blue",
        "#00aba9",
        "#2b5797",
        "#e8c3b9",
        "#1e7145",
        "red",
        "green",
        "blue",
        "orange",
        "brown",
        "yellow",
      ];
      new Chart("pieChart", {
        type: "pie",
        data: {
          labels: res.labelsByCount,
          datasets: [
            {
              backgroundColor: barColors,
              data: res.dataByCount,
            },
          ],
        },
        options: {
          title: {
            display: true,
            text: "sales by order",
          },
        },
      });
    },
  });
}
