const CAT_AUTOS = 'https://japceibal.github.io/emercado-api/cats_products/101.json';
let autos_array = [ ] ; 

function agregarLaLista() { 
  let contenido = ''
  for (let i=0; i < autos_array.length; i++) { 
    auto = autos_array[i];

    //aca no cambio nada excepto donde tomo los datos de cada 'auto' yyy el setCatID por las dudas.. 
contenido += `
<div onclick="setAutoID(${auto.id})" class="list-group-item list-group-item-action cursor-active">
    <div class="row">
        <div class="col-3">
            <img src="${auto.image}" alt="${auto.description}" class="img-thumbnail">
        </div>
        <div class="col">
            <div class="d-flex w-100 justify-content-between">
                <h4 class="mb-1">${auto.name}</h4>
                <small class="text-muted">${auto.soldCount} artículos</small>
            </div>
            <p class="mb-1">${auto.description}</p>
        </div>
    </div>
</div>
`
document.getElementById("cat-list-container").innerHTML = contenido;
  }
}


document.addEventListener("DOMContentLoaded", function(e){
 


fetch(CAT_AUTOS)    // esto o podria usar la funcion getJSONData de init.js ?
 .then(res => {
  if (res.ok) { return res.json() }
  else {console.log('error en el fetch en products.js')}

 })
 .then (data => { 
autos_array = data.products 
agregarLaLista();
}
)

 })


