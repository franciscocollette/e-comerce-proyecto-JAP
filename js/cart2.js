const USUARIO = 'https://japceibal.github.io/emercado-api/user_cart/25801.json';


let usuarioObj = {};
let arrayFinalGlobal = []

let radioPremium = document.getElementById('premium');
let radioExpress = document.getElementById('express');
let radioStandard = document.getElementById('standard');
let divSubtotalGral = document.getElementById('subtotalgeneral');
let divcCostoEnvio = document.getElementById('costoenvio')


let inputCalle = document.getElementById('calle');
let inputNumero = document.getElementById('numero');


function agregarCont(arrayFinal) {
  let contenido = ' ';
  for (let articulo of arrayFinal) {
    contenido += `<div class="row" id='productrow'> 
        <img  class="col-sm-2" src= ${articulo.image} alt=${articulo.name}>  
        <div class="col-sm-2 my-auto"> ${articulo.name}</div> 
        <div class="col-sm-2 my-auto"> ${articulo.currency}  ${articulo.unitCost} </div> 
        <div class="col-sm-2 my-auto"> <input class='form-control ' min="1" id='cantidadArt${articulo.id}' type='number' value=${articulo.count} style="width: 90px;"> </div> 
         <div class="col-sm-2 my-auto" id='divsubtotal${articulo.id}'> </div> 
         <button class='col-sm-2 btn btn-secondary' style="padding: 2px; height: 27px;" onclick='quitarDelCarrito(${articulo.id})' >
          Quitar del carrito </button>
         </div> 
         <hr> `

  }
  document.getElementById('articulosCarrito').innerHTML = contenido;

}




fetch(USUARIO)
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    else console.log('error en el fetch de cart.json')

  })
  .then(data => {
    usuarioObj = data;

    let articulosDelLocal = JSON.parse(localStorage.getItem('articulosCarritoGuardados'))

    const arrayFinal = usuarioObj.articles.concat(articulosDelLocal.articles)

    //esto es para ver si un articulo se repite y sacarlo
    let ids = [];
    for (let articulo of arrayFinal) {
      ids.push(articulo.id);
    }
    let idssort = ids.sort();
    for (let i = 0; i < idssort.length; i++) {
      if (idssort[i + 1] === idssort[i]) {
        for (let y = 0; y < arrayFinal.length; y++) {
          if (idssort[i] === arrayFinal[y].id) {
            arrayFinal.splice(y, 1)
            break;
          }
        }
      }
    }


    agregarCont(arrayFinal)
    subtotales(arrayFinal)

    totales(arrayFinal);
    totaltotal();


    // esto es para que cada input tenga un listener 
    for (let articulo of arrayFinal) {
      document.getElementById("cantidadArt" + articulo.id).addEventListener('input', () => { subtotales(arrayFinal); totales(arrayFinal); costoenvio(); totaltotal(); validarcompra() })
    }

    // y esto para que los radio button tengan listener 
    radioPremium.addEventListener('input', () => { costoenvio(); totaltotal(); validarcompra() });
    radioExpress.addEventListener('input', () => { costoenvio(); totaltotal(); validarcompra() });
    radioStandard.addEventListener('input', () => { costoenvio(); totaltotal(); validarcompra() });




    function subtotales(arrayFinal) {
      // esto agrega cada subtotal en cada div 

      for (let articulo of arrayFinal) {

        document.getElementById('divsubtotal' + articulo.id).innerHTML = `<strong> ` + articulo.currency + ' ' + `<Number id="artitotal${articulo.id}">`
          + articulo.unitCost * document.getElementById("cantidadArt" + articulo.id).value + `</Number> `
          + `</strong>`;
      }

    }

    arrayFinalGlobal = arrayFinal

    // esto es para insertar la suma de los subtotales
    function totales(array) {
      let subtotalgral = 0
      for (let articulo of array) {
        if (articulo.currency === 'UYU') {
          subtotalgral += Math.round(parseInt(document.getElementById('artitotal' + articulo.id).textContent) / 40);
        }
        else {
          subtotalgral += parseInt(document.getElementById('artitotal' + articulo.id).textContent)
        }


      }
      divSubtotalGral.innerHTML = subtotalgral;

    }

    //esto es para insertar el costo de envio 
    function costoenvio() {
      let porcentajeenvio = 0
      if (radioPremium.checked) {
        porcentajeenvio = radioPremium.value
      }
      else if (radioExpress.checked) {
        porcentajeenvio = radioExpress.value
      }
      else if (radioStandard.checked) {
        porcentajeenvio = radioStandard.value
      }
      let costoenvio = Math.round(parseInt(divSubtotalGral.textContent) * porcentajeenvio / 100)
      divcCostoEnvio.innerHTML = costoenvio;
    };


    //esto es para insertar costo de envio sumado a totales
    function totaltotal() {
      let total = parseInt(divcCostoEnvio.textContent) + parseInt(divSubtotalGral.textContent);
      document.getElementById('total').innerHTML = total;
    }

  });


function quitarDelCarrito(produid) {
  //console.log(arrayFinalGlobal[0].id)

  for (let i = 0; i < arrayFinalGlobal.length; i++) {
    if (arrayFinalGlobal[i].id === produid) {
      arrayFinalGlobal.splice(i, 1)
    }
  }
  var newarticulosDelLocal = new Object();
  newarticulosDelLocal.articles = arrayFinalGlobal;
  localStorage.setItem('articulosCarritoGuardados', JSON.stringify(newarticulosDelLocal));

  window.location.reload();
}



// esto es para que se cambie el texto en el seleccionar metodo de pago y se desabiliten inputs
let radioTarjCred = document.getElementById('tarjcredito');
let pNoSelec = document.getElementById('noselec');
let pTarjCred = document.getElementById('tarjcred');
let pTransfBanc =  document.getElementById('transfbanc');

let inputNroTarj = document.getElementById('nrotarj');
let inputCodSeg = document.getElementById('codseg');
let inputVenc = document.getElementById('venc');
let inputNroCuenta =  document.getElementById('nrocuenta');
let radioTransfBancaria = document.getElementById('transfbancaria');


function mostrarmetpago() {
  if (radioTarjCred.checked) {
    pNoSelec.classList.add('d-none');
    pTarjCred.classList.remove('d-none');
    pTransfBanc.classList.add('d-none');


    inputNroTarj.removeAttribute('disabled', '');
    inputCodSeg.removeAttribute('disabled', '');
    inputVenc.removeAttribute('disabled', '');
    inputNroCuenta.setAttribute('disabled', '');


  }

  else if (radioTransfBancaria.checked) {
    pNoSelec.classList.add('d-none');
    pTarjCred.classList.add('d-none');
    pTransfBanc.classList.remove('d-none');

    inputNroTarj.setAttribute('disabled', '');
    inputCodSeg.setAttribute('disabled', '');
    inputVenc.setAttribute('disabled', '');
    inputNroCuenta.removeAttribute('disabled', '');
  }
}
radioTarjCred.addEventListener('click', () => { mostrarmetpago(); validarcompra() })
radioTransfBancaria.addEventListener('click', () => { mostrarmetpago(); validarcompra() })


// esto es para agregar listener a todas las validaciones que aun no tienen listener
inputCalle.addEventListener('input', () => { validarcompra() })
inputNumero.addEventListener('input', () => { validarcompra() })
document.getElementById('esquina').addEventListener('input', () => { validarcompra() })
inputNroTarj.addEventListener('input', () => { validarcompra() })
inputCodSeg.addEventListener('input', () => { validarcompra() })
inputVenc.addEventListener('input', () => { validarcompra() })
inputNroCuenta.addEventListener('input', () => { validarcompra() })

// esto es para las validaciones luego de apretar el boton finalizarcompra 
document.getElementById('finalizarcompra').addEventListener('click', () => {
  validarcompra(); enviarcompra();

})

let direccionvalidada = false;
let tipodeenviovalidado = false;
let articulosmayoresa0 = false;
let formapagovalidada = false;
let camposformapagovalid = false;



function validarcompra() {
  //primero validar que los casilleros de direccion no esten vacios


  if (inputCalle.value.length <= 0) {
    inputCalle.classList.add('is-invalid')

  }
  else if (inputCalle.value.length > 0) {
    inputCalle.classList.add('is-valid')
    inputCalle.classList.remove('is-invalid')
  };

  if (inputNumero.value.length <= 0) {
    inputNumero.classList.add('is-invalid')

  }
  else if (inputNumero.value.length > 0) {
    inputNumero.classList.add('is-valid')
    inputNumero.classList.remove('is-invalid')
  };

  if (document.getElementById('esquina').value.length <= 0) {
    document.getElementById('esquina').classList.add('is-invalid')
  }
  else if (document.getElementById('esquina').value.length > 0) {
    document.getElementById('esquina').classList.add('is-valid')
    document.getElementById('esquina').classList.remove('is-invalid')
  };

  if (document.getElementById('esquina').value.length > 0 && inputCalle.value.length > 0 &&
    inputNumero.value.length > 0) {
    direccionvalidada = true
  }
  else direccionvalidada = false;

  //segundo validar que este seleccionada algun tipo  de envio


  if (radioPremium.checked || radioExpress.checked
    || radioStandard.checked) {
    document.getElementById('alerttipoenvio').classList.add('d-none')
    tipodeenviovalidado = true
  }


  else {
    document.getElementById('alerttipoenvio').classList.remove('d-none')
    tipodeenviovalidado = false
  }


  //tercero validar que la cantidad de cada articulo es mayor a 0 y que no es null 

  for (let articulo of arrayFinalGlobal) {
    if (document.getElementById('cantidadArt' + articulo.id).value < 1) {
      document.getElementById('cantidadArt' + articulo.id).classList.add('is-invalid')

    }
    else if (document.getElementById('cantidadArt' + articulo.id).value > 0) {
      document.getElementById('cantidadArt' + articulo.id).classList.remove('is-invalid')
      articulosmayoresa0 = true;
    }
  };
  for (let articulo of arrayFinalGlobal) {
    if (document.getElementById('cantidadArt' + articulo.id).value < 1) {
      articulosmayoresa0 = false;
      break;
    }
  };


  //cuarto validar que este seleccionada alguna forma de pago 

  if (radioTarjCred.checked || radioTransfBancaria.checked) {
    document.getElementById('alertpago').classList.add('d-none')
    formapagovalidada = true
  }

  else {
    document.getElementById('alertpago').classList.remove('d-none')
    formapagovalidada = false
  }

  //quinto validar que los campos para la forma de pago tengan contenido 

  if (radioTarjCred.checked) {
    if (inputNroTarj.value.length < 1) {
      inputNroTarj.classList.add('is-invalid')
    }
    else if (inputNroTarj.value.length > 0) {
      inputNroTarj.classList.add('is-valid')
      inputNroTarj.classList.remove('is-invalid')
    };
    if (inputCodSeg.value.length < 1) {
      inputCodSeg.classList.add('is-invalid')
    }
    else if (inputCodSeg.value.length > 0) {
      inputCodSeg.classList.add('is-valid')
      inputCodSeg.classList.remove('is-invalid')
    };
    if (inputVenc.value.length < 1) {
      inputVenc.classList.add('is-invalid')
    }
    else if (inputVenc.value.length > 0) {
      inputVenc.classList.add('is-valid')
      inputVenc.classList.remove('is-invalid')
    };
  }

  if (radioTransfBancaria.checked) {
    if (inputNroCuenta.value.length < 1) {
      inputNroCuenta.classList.add('is-invalid')
    }
    else if (inputNroCuenta.value.length > 0) {
      inputNroCuenta.classList.add('is-valid')
      inputNroCuenta.classList.remove('is-invalid')
    };
  };

  // esto es para ver si los campos de las formas de pago estan completos
  let alertCampoVacio = document.getElementById('alertcampovacio');

  if (radioTarjCred.checked && inputNroTarj.value.length > 0
    && inputCodSeg.value.length > 0 && inputVenc.value.length > 0) {
    camposformapagovalid = true
    alertCampoVacio.classList.add('d-none')
  }
  else if (!radioTarjCred.checked || !inputNroTarj.value.length > 0
    || !inputCodSeg.value.length > 0 || !inputVenc.value.length > 0) {
    camposformapagovalid = false
    alertCampoVacio.classList.remove('d-none')
  };

  if (!camposformapagovalid) {
    if (radioTransfBancaria.checked && inputNroCuenta.value.length > 0) {
      camposformapagovalid = true
      alertCampoVacio.classList.add('d-none')
    }
    else if (!radioTransfBancaria.checked || !inputNroCuenta.value.length > 0) {
      camposformapagovalid = false
      alertCampoVacio.classList.remove('d-none')
    };
  };

};

  // si todo lo anterior es true que aparezca un cartel verde y se recargue la pagina 

function showAlertSuccess() {
  document.getElementById("alert-success").classList.add("show");
}

function enviarcompra() {
  if (direccionvalidada && tipodeenviovalidado && articulosmayoresa0 && formapagovalidada && camposformapagovalid) {
    showAlertSuccess();
    console.log('todo correctoo')
  }
  else console.log('algo no esta validado')
};






