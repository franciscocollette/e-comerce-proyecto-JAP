CATEG_ID = 'https://japceibal.github.io/emercado-api/cats_products/'+localStorage.getItem('catID')+'.json'


// CAT_AUTOS = 'https://japceibal.github.io/emercado-api/cats_products/101.json';

let produ_array = [ ] ; 

let minCount = undefined;
let maxCount = undefined;

// para ordenar la listaa 
let currentSortCriteria = undefined;
const ORDER_ASC_BY_PRICE = "min a may";
const ORDER_DESC_BY_PRICE = "may a menor";
const ORDER_BY_PROD_COUNT = "cant vendidos";

function sortCategories(criteria, array){
    let result = [];
    if (criteria === ORDER_ASC_BY_PRICE)
    {
        result = array.sort(function(a, b) {
            if ( a.cost < b.cost ){ return -1; }
            if ( a.cost > b.cost ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_DESC_BY_PRICE){
        result = array.sort(function(a, b) {
            if ( a.cost > b.cost ){ return -1; }
            if ( a.cost < b.cost ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_BY_PROD_COUNT){
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.soldCount);
            let bCount = parseInt(b.soldCount);

            if ( aCount > bCount ){ return -1; }
            if ( aCount < bCount ){ return 1; }
            return 0;
        });
    }

    return result;
}


// -------------------------------------------------------------

function setProduID(id) {
    localStorage.setItem("produID", id);
    window.location = "product-info.html"
}

function agregarLaLista() { 
  let contenido = ''
  for (let i=0; i < produ_array.length; i++) { 
    produ = produ_array[i];

    // esto es para el filtrado 
    if (((minCount == undefined) || (minCount != undefined && parseInt(produ.cost) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(produ.cost) <= maxCount))){
// fin de esto es para el filtrado

contenido += `
<div onclick="setProduID(${produ.id})" class="list-group-item list-group-item-action cursor-active">
    <div class="row">
        <div class="col-3">
            <img src="${produ.image}" alt="${produ.description}" class="img-thumbnail">
        </div>
        <div class="col">
            <div class="d-flex w-100 justify-content-between">
                <h4 class="mb-1">${produ.name}</h4> <h4 class="mb-1">${produ.currency} ${produ.cost} </h4>
                <small class="text-muted">${produ.soldCount} artículos vendidos</small>
            </div>
            <p class="mb-1">${produ.description}</p>
        </div>
    </div>
</div>
`
            }
document.getElementById("cat-list-container").innerHTML = contenido;
  }
}

// funcion para ordenar arrays 
function sortAndAgregarLaLista(sortCriteria, categoriesArray){
    currentSortCriteria = sortCriteria;

    if(categoriesArray != undefined){
        produ_array = categoriesArray;
    }

    produ_array = sortCategories(currentSortCriteria, produ_array);

    
    agregarLaLista();
}
////// ------------------------------------------------------------- 

document.addEventListener("DOMContentLoaded", function(e){
 


fetch(CATEG_ID)    
 .then(res => {
  if (res.ok) { return res.json() }
  else {console.log('error en el fetch en products.js')}

 })
 .then (data => { 
produ_array = data.products 
agregarLaLista();

document.getElementById('nombreCategorias').innerHTML = data.catName;  // aca pongo el nombre de la categoria
}
)

// esto sera para ordenar las arrays 
document.getElementById("sortAsc").addEventListener("click", function(){
    sortAndAgregarLaLista(ORDER_DESC_BY_PRICE);
});

document.getElementById("sortDesc").addEventListener("click", function(){
    sortAndAgregarLaLista(ORDER_ASC_BY_PRICE );
});
document.getElementById("sortByCount").addEventListener("click", function(){
    sortAndAgregarLaLista(ORDER_BY_PROD_COUNT);
});
// --------------------------------------------------------------------------------

// Y ESTO ES PARA EL FILTRADOR  ------------------------------------------------------
document.getElementById("clearRangeFilter").addEventListener("click", function(){
    document.getElementById("rangeFilterCountMin").value = "";
    document.getElementById("rangeFilterCountMax").value = "";

    minCount = undefined;
    maxCount = undefined;

    agregarLaLista();
});

document.getElementById("rangeFilterCount").addEventListener("click", function(){
    //Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
    //de productos por categoría.
    minCount = document.getElementById("rangeFilterCountMin").value;
    maxCount = document.getElementById("rangeFilterCountMax").value;

    if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0){
        minCount = parseInt(minCount);
    }
    else{
        minCount = undefined;
    }

    if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0){
        maxCount = parseInt(maxCount);
    }
    else{
        maxCount = undefined;
    }

    agregarLaLista();
});
// ------------------------------------------------------------------------------------

 })


