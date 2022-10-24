const USUARIO = 'https://japceibal.github.io/emercado-api/user_cart/25801.json';


let usuarioObj = { };
let arrayFinalGlobal = [ ]

function agregarCont (arrayFinal) { 
    let contenido = ' ';
    for (let articulo of arrayFinal ) { 
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
    document.getElementById('articulosCarrito').innerHTML = contenido ;

}




fetch (USUARIO)
.then ( response  => { 
    if (response.ok) { 
        return response.json(); }
        else console.log ('error en el fetch de cart.json')
    
}) 
.then (data => { 
    usuarioObj = data;

    let articulosDelLocal = JSON.parse(localStorage.getItem('articulosCarritoGuardados'))

     const arrayFinal = usuarioObj.articles.concat(articulosDelLocal.articles)

     //esto es para ver si un articulo se repite y sacarlo
     let ids = []; 
     for (let articulo of arrayFinal) { 
      ids.push(articulo.id); 
     }
     let idssort = ids.sort();
     for (let i= 0; i < idssort.length; i++) { 
      if (idssort[i+1] === idssort[i]) { 
        for (let y =0; y < arrayFinal.length; y++) { 
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
    totaltotal (); 



   // esto es para que cada input tenga un listener 
    for (let articulo of arrayFinal) { 
     document.getElementById("cantidadArt"+articulo.id).addEventListener('input',()=> { subtotales(arrayFinal); totales(arrayFinal); costoenvio (); totaltotal (); validarcompra ()})
    }

    // y esto para que los radio button tengan listener 
    document.getElementById('premium').addEventListener('input',()=> { costoenvio ();  totaltotal ();validarcompra ()} );
    document.getElementById('express').addEventListener('input',()=> { costoenvio ();  totaltotal ();validarcompra ()});
    document.getElementById('standard').addEventListener('input',()=> { costoenvio (); totaltotal ();validarcompra ()});


    

    function subtotales (arrayFinal) { 
      // esto agrega cada subtotal en cada div 
  
     for (let articulo of arrayFinal ) { 
 
       document.getElementById('divsubtotal'+articulo.id).innerHTML = `<strong> ` + articulo.currency + ' ' + `<Number id="artitotal${articulo.id}">`
       + articulo.unitCost * document.getElementById("cantidadArt"+articulo.id).value + `</Number> ` 
        + `</strong>`;
      } 
      
    }

    arrayFinalGlobal = arrayFinal

    // esto es para insertar la suma de los subtotales
    function totales(array) {
      let subtotalgral = 0
      for (let articulo of array) { 
        if (articulo.currency === 'UYU') { 
          subtotalgral += Math.round(parseInt(document.getElementById('artitotal'+articulo.id).textContent) / 40) ;
        }
        else {
          subtotalgral += parseInt(document.getElementById('artitotal'+articulo.id).textContent)
         }
      
  
      }
      document.getElementById('subtotalgeneral').innerHTML = subtotalgral;

    }

    //esto es para insertar el costo de envio 
    function costoenvio () { 
      let porcentajeenvio = 0 
      if (document.getElementById('premium').checked) {
        porcentajeenvio = document.getElementById('premium').value
      }
      else if (document.getElementById('express').checked) {
        porcentajeenvio = document.getElementById('express').value
      }
      else if (document.getElementById('standard').checked) {
        porcentajeenvio = document.getElementById('standard').value
      }
      let costoenvio = Math.round(parseInt(document.getElementById('subtotalgeneral').textContent) * porcentajeenvio/ 100)
      document.getElementById(`costoenvio`).innerHTML = costoenvio;
    };


    //esto es para insertar costo de envio sumado a totales
    function totaltotal () { 
      let total = parseInt(document.getElementById('costoenvio').textContent) + parseInt(document.getElementById('subtotalgeneral').textContent);
      document.getElementById('total').innerHTML = total;

    }
    

    

   


    
    
} );

function quitarDelCarrito(produid) { 
  //console.log(arrayFinalGlobal[0].id)
  
  for (let i= 0; i < arrayFinalGlobal.length; i++) { 
    if (arrayFinalGlobal[i].id === produid ) { 
      arrayFinalGlobal.splice(i, 1)
    }
  }
  var newarticulosDelLocal = new Object();
    newarticulosDelLocal.articles = arrayFinalGlobal;
    localStorage.setItem('articulosCarritoGuardados', JSON.stringify(newarticulosDelLocal));
    
    window.location.reload();
  }



  // esto es para que se cambie el texto en el seleccionar metodo de pago y se desabiliten inputs
  function mostrarmetpago() { 
    if (document.getElementById('tarjcredito').checked) { 
      document.getElementById('noselec').classList.add('d-none');
      document.getElementById('tarjcred').classList.remove('d-none');
      document.getElementById('transfbanc').classList.add('d-none');


      document.getElementById('nrotarj').removeAttribute('disabled','');
      document.getElementById('codseg').removeAttribute('disabled','');
      document.getElementById('venc').removeAttribute('disabled','');
      document.getElementById('nrocuenta').setAttribute('disabled','');
     
      
    }

    else if(document.getElementById('transfbancaria').checked) { 
      document.getElementById('noselec').classList.add('d-none');
      document.getElementById('tarjcred').classList.add('d-none');
      document.getElementById('transfbanc').classList.remove('d-none');

      document.getElementById('nrotarj').setAttribute('disabled','');
      document.getElementById('codseg').setAttribute('disabled','');
      document.getElementById('venc').setAttribute('disabled','');
      document.getElementById('nrocuenta').removeAttribute('disabled','');
    }
  }
document.getElementById('tarjcredito').addEventListener('click', ()=> {mostrarmetpago(); validarcompra ()})
document.getElementById('transfbancaria').addEventListener('click', ()=> {mostrarmetpago(); validarcompra () })


// esto es para agregar listener a todas las validaciones que aun no tienen listener
document.getElementById('calle').addEventListener('input', ()=> {validarcompra ()})
document.getElementById('numero').addEventListener('input', ()=> {validarcompra ()})
document.getElementById('esquina').addEventListener('input', ()=> {validarcompra ()})
document.getElementById('nrotarj').addEventListener('input',()=> {validarcompra () })
document.getElementById('nrotarj').addEventListener('input',()=> {validarcompra () })
document.getElementById('codseg').addEventListener('input',()=> {validarcompra () })
document.getElementById('venc').addEventListener('input',()=> {validarcompra () })
document.getElementById('nrocuenta').addEventListener('input',()=> {validarcompra () })

// esto es para las validaciones luego de apretar el boton finalizarcompra 
document.getElementById('finalizarcompra').addEventListener('click',()=>{ validarcompra (); enviarcompra ();
  
})

let direccionvalidada = false;
let tipodeenviovalidado = false;
let articulosmayoresa0 = false; 
let formapagovalidada = false;
let camposformapagovalid = false; 



function validarcompra () { 
  //primero validar que los casilleros de direccion no esten vacios
  

  if ( document.getElementById('calle').value.length <= 0) { 
  document.getElementById('calle').classList.add('is-invalid')
  
}
else if (document.getElementById('calle').value.length > 0) { 
  document.getElementById('calle').classList.add('is-valid')
  document.getElementById('calle').classList.remove('is-invalid')
};

if ( document.getElementById('numero').value.length <= 0) { 
  document.getElementById('numero').classList.add('is-invalid')

}
else if (document.getElementById('numero').value.length > 0) { 
  document.getElementById('numero').classList.add('is-valid')
  document.getElementById('numero').classList.remove('is-invalid')
};

if ( document.getElementById('esquina').value.length <= 0) { 
  document.getElementById('esquina').classList.add('is-invalid')
}
else if (document.getElementById('esquina').value.length > 0) { 
  document.getElementById('esquina').classList.add('is-valid')
  document.getElementById('esquina').classList.remove('is-invalid')
};

if (document.getElementById('esquina').value.length > 0 && document.getElementById('calle').value.length > 0 &&
 document.getElementById('numero').value.length > 0 ) { 
  direccionvalidada = true}
else direccionvalidada = false;

//segundo validar que este seleccionada algun tipo  de envio


if (document.getElementById('premium').checked || document.getElementById('express').checked
|| document.getElementById('standard').checked)
 {document.getElementById('alerttipoenvio').classList.add('d-none')
  tipodeenviovalidado = true }
  
 
 else {document.getElementById('alerttipoenvio').classList.remove('d-none')
 tipodeenviovalidado = false } 
 

//tercero validar que la cantidad de cada articulo es mayor a 0 y que no es null 

for (let articulo of arrayFinalGlobal) { 
  if (document.getElementById('cantidadArt'+articulo.id).value < 1 ) { 
    document.getElementById('cantidadArt'+articulo.id).classList.add('is-invalid') 
    
  }
  else if (document.getElementById('cantidadArt'+articulo.id).value > 0) { 
    document.getElementById('cantidadArt'+articulo.id).classList.remove('is-invalid')
    articulosmayoresa0=true;
  }
};
for (let articulo of arrayFinalGlobal) { 
  if (document.getElementById('cantidadArt'+articulo.id).value < 1 ) { 
    articulosmayoresa0=false;
    break;
  }};


//cuarto validar que este seleccionada alguna forma de pago 

if (document.getElementById('tarjcredito').checked || document.getElementById('transfbancaria').checked)
 {document.getElementById('alertpago').classList.add('d-none')
 formapagovalidada = true }

 else {document.getElementById('alertpago').classList.remove('d-none')
 formapagovalidada = false } 
 
//quinto validar que los campos para la forma de pago tengan contenido 

if (document.getElementById('tarjcredito').checked) {
  if ( document.getElementById('nrotarj').value.length < 1) { 
    document.getElementById('nrotarj').classList.add('is-invalid')
  }
  else if(document.getElementById('nrotarj').value.length > 0 ) { 
    document.getElementById('nrotarj').classList.add('is-valid')
    document.getElementById('nrotarj').classList.remove('is-invalid')
  };
  if ( document.getElementById('codseg').value.length < 1) { 
    document.getElementById('codseg').classList.add('is-invalid')
  }
  else if(document.getElementById('codseg').value.length > 0 ) { 
    document.getElementById('codseg').classList.add('is-valid')
    document.getElementById('codseg').classList.remove('is-invalid')
  };
  if ( document.getElementById('venc').value.length < 1) { 
    document.getElementById('venc').classList.add('is-invalid')
  }
  else if(document.getElementById('venc').value.length > 0 ) { 
    document.getElementById('venc').classList.add('is-valid')
    document.getElementById('venc').classList.remove('is-invalid')
  };
}

if (document.getElementById('transfbancaria').checked) { 
  if ( document.getElementById('nrocuenta').value.length < 1) { 
    document.getElementById('nrocuenta').classList.add('is-invalid')
  }
  else if(document.getElementById('nrocuenta').value.length > 0 ) { 
    document.getElementById('nrocuenta').classList.add('is-valid')
    document.getElementById('nrocuenta').classList.remove('is-invalid')
  };
};
// esto es para ver si los campos de las formas de pago estan completos
if (document.getElementById('tarjcredito').checked && document.getElementById('nrotarj').value.length > 0
 && document.getElementById('codseg').value.length > 0 &&  document.getElementById('venc').value.length > 0 )
{ camposformapagovalid = true
  document.getElementById('alertcampovacio').classList.add('d-none') }
else if (!document.getElementById('tarjcredito').checked || !document.getElementById('nrotarj').value.length > 0
 || !document.getElementById('codseg').value.length > 0 ||  !document.getElementById('venc').value.length > 0 )
 {camposformapagovalid=false 
document.getElementById('alertcampovacio').classList.remove('d-none')};

 if (!camposformapagovalid) { 
if (document.getElementById('transfbancaria').checked && document.getElementById('nrocuenta').value.length > 0 )
{ camposformapagovalid = true
  document.getElementById('alertcampovacio').classList.add('d-none') }
  else if (!document.getElementById('transfbancaria').checked || !document.getElementById('nrocuenta').value.length > 0  )
{camposformapagovalid = false 
  document.getElementById('alertcampovacio').classList.remove('d-none')};
};


// si todo lo anterior es true que aparezca un cartel verde y se recargue la pagina 

};

function showAlertSuccess() {
  document.getElementById("alert-success").classList.add("show");
}

function enviarcompra () { 
  if (direccionvalidada && tipodeenviovalidado && articulosmayoresa0 && formapagovalidada && camposformapagovalid )
  { showAlertSuccess();
    console.log('todo correctoo')}
  else console.log('algo no esta validado')
};

  




