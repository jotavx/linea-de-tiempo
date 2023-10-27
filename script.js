// Datos para la línea de tiempo
var items = new vis.DataSet([
  {
    id: 0,
    content:
      '<div  class="item-container"> <div class="item-text"><i class="fa-brands fa-youtube " style="color: #ff0000;"></i>  Primer Plan Quinquenal <br> Gobierno de Juan Domingo Perón </div><br> <img  src="../assets/items-timeline/item-1.png"> </div>',
    start: "1947-01-05",
  },
  {
    id: 1,
    content:
      '<div class="item-container"> <div class="item-text"><i class="fa-solid fa-image " style="color: #26e33c;"></i>  Construcción de edificio <br> Radio Nacional Córdoba </div><br> <img  src="../assets/items-timeline/item-2.png"> </div>',
    start: "1948-01-05",
  },
  {
    id: 2,
    content:
      '<div class="item-container"> <div class="item-text"><i class="fa-solid fa-image " style="color: #26e33c;"></i>  Compra de terrenos <br> Planta Transmisora de Toledo </div><br> <img  src="../assets/items-timeline/item-3.png"> </div>',
    start: "1950-01-05",
  },
  {
    id: 3,
    content:
      '<div class="item-container"> <div class="item-text"><i class="fa-solid fa-image " style="color: #26e33c;"></i>  Fallecimiento de Eva Perón </div><br> <img  src="../assets/items-timeline/item-4.png"> </div>',
    start: "1952-01-05",
  },
]);

// Configurar las opciónes de la línea de tiempo de vis.js
var container = document.getElementById("timeline");
var options = {
  animation: false,
  zoomable: true,
  orientation: "top",
  stack: false,
  zoomMin: 31536000000, // Zoom mínimo en milisegundos (1 año)
  zoomMax: 99361000000.000091553, // Zoom máximo en milisegundos (Menos de 1 año)
  //zoomMax: 27361000000.000076294, // Mejorado para mobile (No borrar valor)
  start: "1845-01-01",
  end: "2050-01-01",
  showMinorLabels: false,
  width: "100%",
  height: "210px",
  margin: {
    item: 10,
  },
};

// Inicializar linea
var timeline = new vis.Timeline(container, items, options);

//FUNCIONES PARA EL MOVIMIENTO VINCULADO DE EL SLIDE Y LOS EVENTOS LINEA DE TIEMPO
// Controlador de eventos para el carrusel de Bootstrap
$("#myCarousel").on("slid.bs.carousel", function () {
  var activeSlideId = $(".carousel-item.active").attr("data-slide-id");
  timeline.setSelection(activeSlideId); // Ubica el item correspondiente en la línea de tiempo
  var activeSlideStartDate = items.get(activeSlideId).start;
  timeline.moveTo(activeSlideStartDate, { animation: { duration: 500 } }); // Mueve la línea de tiempo
});

// Controlador de eventos para la línea de tiempo
timeline.on("select", function (properties) {
  if (properties.items.length > 0) {
    var selectedItemId = properties.items[0];
    var slideIndex = $(
      '.carousel-item[data-slide-id="' + selectedItemId + '"]'
    ).index();
    $("#myCarousel").carousel(slideIndex); // Cambia al slide correspondiente en el carrusel
  }
});

//FUNCIONES PARA IR AL PRIMER EVENTO E IR AL ULTIVO EVENTO
// Agrega un controlador de eventos para el botón "Ir al Primer Evento"
document.getElementById("goToFirst").addEventListener("click", function () {
  var firstItemId = items.getIds()[0]; // Obtiene el ID del primer evento
  var slideIndex = $(
    '.carousel-item[data-slide-id="' + firstItemId + '"]'
  ).index();

  // Mueve la vista de la línea de tiempo al primer evento
  timeline.focus(firstItemId);
  // Cambia al slide correspondiente en el carrusel
  $("#myCarousel").carousel(slideIndex);
});

// Agrega un controlador de eventos para el botón "Ir al Último Evento"
document.getElementById("goToLast").addEventListener("click", function () {
  var lastItemId = items.getIds()[items.length - 1]; // Obtiene el ID del último evento
  var slideIndex = $(
    '.carousel-item[data-slide-id="' + lastItemId + '"]'
  ).index();

  // Mueve la vista de la línea de tiempo al último evento
  timeline.focus(lastItemId);
  // Cambia al slide correspondiente en el carrusel
  $("#myCarousel").carousel(slideIndex);
});

// FUNCION PARA PODER DESLIZAR LA LINEA DESDE EL SLIDE
$(document).ready(function () {
  var banner = $("#myCarousel"); // Reemplaza "timeline" con el ID de tu banner de línea de tiempo
  var x_inicial;

  banner.on("mousedown", function (event) {
    x_inicial = event.pageX;
  });

  banner.on("mouseup", function (event) {
    var x_final = event.pageX;
    var deltaX = x_final - x_inicial;

    if (deltaX > 50) {
      $("#myCarousel").carousel("prev");
    } else if (deltaX < -50) {
      $("#myCarousel").carousel("next");
    }
  });
});

//AJUSTA EL ZOOM DEL DISPLAY TIMELINE EN RESOLUCIÓNES MENORES A 576px

// Llama a la función al cargar la página y al redimensionar la ventana
window.addEventListener("load", ajustarZoomMax);
window.addEventListener("resize", ajustarZoomMax);

function ajustarZoomMax() {
  // Obtener el ancho actual de la pantalla
  var anchoPantalla = window.innerWidth;

  // Definir el valor de zoomMax para resoluciones menores a 576px
  var zoomMaxPequeno = 27361000000.000076294;
  var zoomMaxGrande = 99361000000.000091553;
  // Configurar zoomMax en consecuencia
  if (anchoPantalla < 576) {
    timeline.setOptions({ zoomMax: zoomMaxPequeno });
    timeline.zoomOut(1);
  } else {
    // Restablecer a un valor diferente si la pantalla es más grande
    timeline.setOptions({ zoomMax: zoomMaxGrande });
  }
}

function scrollToYear() {
  var year = yearInput.value;

  // Verifica si el valor es un año válido y cumple con los criterios
  if (/^\d{4}$/.test(year) && year >= 1930 && year <= 2024) {
    // Encuentra el elemento en la línea de tiempo que coincide con el año
    var itemsInYear = items.get({
      filter: function (item) {
        return item.start.includes(year);
      },
    });

    if (itemsInYear.length > 0) {
      var itemId = itemsInYear[0].id;
      timeline.setSelection(itemId); // Selecciona el elemento en la línea de tiempo
      timeline.focus(itemId); // Enfoca la línea de tiempo en el elemento
      var slideIndex = $(
        '.carousel-item[data-slide-id="' + itemId + '"]'
      ).index();
      $("#myCarousel").carousel(slideIndex); // Cambia al slide correspondiente en el carrusel
    } else {
      // Si no hay eventos para el año especificado, solo realiza el movimiento de la línea de tiempo
      timeline.moveTo(year);
    }

    yearInput.value = ""; // Borra el valor del input después de la búsqueda exitosa
  } else {
    errorMessage.textContent =
      "Ingresa un año válido de 4 dígitos entre 1930 y 2024";
  }
}

yearInput.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    // Verifica si el valor tiene menos de 4 dígitos y muestra un mensaje de error
    if (yearInput.value.length < 4) {
      errorMessage.textContent = "El año debe tener 4 dígitos";
    } else {
      scrollToYear();
    }
  }
});

yearInput.addEventListener("input", function () {
  // Borra cualquier mensaje de error existente cuando se modifica el input
  errorMessage.textContent = "";
});
