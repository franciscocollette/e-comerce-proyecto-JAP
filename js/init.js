const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

PRODU_URL = 'https://japceibal.github.io/emercado-api/products/' + localStorage.getItem('produID') + '.json'

var articulosCarrito = new Object();
articulosCarrito.articles = [];
var articulosDelLocal = new Object();
articulosDelLocal.articles = [];

let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

function deleteUser() { 
  
  localStorage.removeItem('infoperfil');

}

let getJSONData = function(url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
          
    })
    
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}

document.addEventListener('DOMContentLoaded', function() { 
  document.getElementById('listanavbar').innerHTML +=  `  <li class="nav-item" > <div class="dropdown">
  <a id="direcUsuario" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
  ${JSON.parse(localStorage.getItem('infoperfil')).email} </a>
  
  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
   <li><a class="dropdown-item" href="cart.html">Mi carrito</a></li>
   <li><a class="dropdown-item" href="my-profile.html">Mi perfil</a></li>
   <li><a class="dropdown-item" href="index.html" onclick="deleteUser()"> Cerrar sesión</a></li>
 </ul>`
  


})

function agregaracarrito (produid) { 
  

  // aca tengo que hacer un fetch que agarre el producto y en funcion a eso me cree el articulaso 
  fetch (PRODU_URL)
  .then (res => { 
    if (res.ok) { return res.json() }
    else { console.log('error en el fetch para el produ')}
  })
  .then (data => { 
  
    var articulaso = new Object();
            
            articulaso.name = data.name;
            articulaso.count = 1;
            articulaso.id = data.id;
            articulaso.unitCost = data.cost;
            articulaso.currency = data.currency;
            articulaso.image = data.images[0] ;

            
          
//ahora hacer un if de que si no hay nada en el local storage guarde el articulosCarrito
// pero que si puede agarrar un articulosCarrito, lo agarre y agregue nuestro articulaso y luego guarde el articulosCarritol

if (localStorage.getItem('articulosCarritoGuardados') === null ) { 

  articulosCarrito = articulosDelLocal

}
else { 
articulosDelLocal = JSON.parse(localStorage.getItem('articulosCarritoGuardados'))
articulosCarrito = articulosDelLocal
}



 
let articulosString = [ ]
for (let articulo of articulosCarrito.articles ) { articulosString.push(JSON.stringify(articulo)) } ;
if (articulosString.indexOf(JSON.stringify(articulaso))>=0) { 
  window.location='cart.html' }

else { 
  articulosCarrito.articles.push(articulaso)
  console.log('agregadoalcarrito'+produid);
  localStorage.setItem('articulosCarritoGuardados', JSON.stringify(articulosCarrito));
  window.location='cart.html'

}
 

// hay que hacer que la funcion en cart.html tome nuestro articulosCarritoGuardados del local storage y agregue a la lista


  })
    


 
  
}

