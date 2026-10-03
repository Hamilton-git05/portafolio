const form = document.getElementById("form-contacto");
const estado = document.getElementById("estado");

function mostrarError(campo, mensaje) {
  const caja = form.querySelector('[data-error="' + campo.name + '"]');
  caja.textContent = mensaje;
  campo.classList.toggle("invalid", mensaje !== "");
}

function validarCampo(campo) {
  const valor = campo.value.trim();
  let mensaje = "";
  if (campo.name === "nombre" && valor.length < 2) {
    mensaje = "Escribí tu nombre (mínimo 2 letras).";
  }
  if (campo.name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
    mensaje = "Escribí un email válido, por ejemplo nombre@correo.com.";
  }
  if (campo.name === "mensaje" && valor.length < 10) {
    mensaje = "El mensaje tiene que tener al menos 10 caracteres.";
  }
  mostrarError(campo, mensaje);
  return mensaje === "";
}

const campos = form.querySelectorAll("input, textarea");

// Valida cada campo cuando la persona sale de él
campos.forEach(function (campo) {
  campo.addEventListener("blur", function () {
    validarCampo(campo);
  });
});

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  estado.textContent = "";
  estado.className = "estado";

  let todoOk = true;
  campos.forEach(function (campo) {
    if (!validarCampo(campo)) {
      todoOk = false;
    }
  });

  if (todoOk) {
    try {
      const respuesta = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });
      if (respuesta.ok) {
        estado.textContent = "¡Mensaje enviado! Gracias por escribirme.";
        estado.classList.add("ok");
        form.reset();
      } else {
        estado.textContent = "No se pudo enviar el mensaje. Probá de nuevo en un rato.";
        estado.classList.add("mal");
      }
    } catch (error) {
      estado.textContent = "No se pudo enviar el mensaje. Revisá tu conexión.";
      estado.classList.add("mal");
    }
  } else {
    estado.textContent = "Revisá los campos marcados.";
    estado.classList.add("mal");
  }
});
