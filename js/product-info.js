PRODU_ID = 'https://japceibal.github.io/emercado-api/products/' + localStorage.getItem('produID') + '.json'

URL_COMENTARIOS = 'https://japceibal.github.io/emercado-api/products_comments/' + localStorage.getItem('produID') + '.json'


let produ_obj = {}

function showProdu() {
    let contenido =
   `<div class="row">         
         <div class="col">
            <div><br> <br> 
                <h3 class="mb-1">${produ_obj.name}</h3> <br> 
                <hr> 
                <h6 class="mb-1"> <strong> Precio </strong>  </h6>
                <p class="mb-1">${produ_obj.currency} ${produ_obj.cost} </p>
                <br>
                <h6 class="mb-1"> <strong> Descripción </strong>  </h6>
                <p class="mb-1">${produ_obj.description}</p> 
                <br>
                <h6 class="mb-1"> <strong> Categoría </strong>  </h6> 
                <p class="mb-1">${produ_obj.category}</p> 
                <br>
                <h6 class="mb-1"> <strong> Cantidad de vendidos </strong>  </h6>
                <p class="mb-1">${produ_obj.soldCount} </p> 
                <br>
                <h6 class="mb-1"> <strong> Imagenes Ilustrativas </strong>  </h6>
                  ${addImgs(produ_obj.images)} 
             </div>

            
         </div>
    </div>  `

    document.getElementById('containerProduInfo').innerHTML = contenido;

}

function showComent (coment_array) { 
    let contenido2 = '';
    if (coment_array.length === 0 ) { contenido2 = `<p> No hay comentarios aún </p> `}
    else { 
    for (let comentario of coment_array) { 
        contenido2 += 
        `<div class="comentario"> 
         <p> <strong>${comentario.user}</strong> - ${comentario.dateTime} - ${addScore(comentario.score)}  
         <br>
         ${comentario.description} </p>  
            </div> `
    }} 
    console.log(coment_array)
  

    document.getElementById('containerComents').innerHTML = contenido2 
}

function addScore (score) {
    let contenido = ``
    if (score === 1 ) { contenido = 
    `<span class="fa fa-star checked"></span>
    <span class="fa fa-star"></span>
    <span class="fa fa-star"></span>
    <span class="fa fa-star"></span>
    <span class="fa fa-star"></span> `}
    else if (score === 2) { contenido = 
        `<span class="fa fa-star checked"></span>
        <span class="fa fa-star checked"></span>
        <span class="fa fa-star"></span>
        <span class="fa fa-star"></span>
        <span class="fa fa-star"></span> `}
    else if (score === 3 ) { contenido = 
        `<span class="fa fa-star checked"></span>
        <span class="fa fa-star checked"></span>
        <span class="fa fa-star checked"></span>
        <span class="fa fa-star"></span>
        <span class="fa fa-star"></span> `}
    else if (score === 4) {contenido = 
         `<span class="fa fa-star checked"></span>
        <span class="fa fa-star checked"></span>
        <span class="fa fa-star checked"></span>
        <span class="fa fa-star checked"></span>
        <span class="fa fa-star"></span> `}
    else if (score === 5 ) { contenido = 
        `<span class="fa fa-star checked"></span>
        <span class="fa fa-star checked"></span>
        <span class="fa fa-star checked"></span>
        <span class="fa fa-star checked"></span>
        <span class="fa fa-star checked"></span> `};
    return contenido;
}

function addImgs (listaImg) { 
    let contIMG = ""
    for (let img of listaImg) { 
        contIMG += ` <div class='colum-img'>  <img src="${img}" alt='${produ_obj.description}' class='img-thumbnail'> </div> `
        
    }
    return contIMG; 
}

document.addEventListener('DOMContentLoaded', function (e) {
    fetch(PRODU_ID)
        .then(res => {
            if (res.ok) { return res.json() }
            else console.log('error en el fetch del producto, pelotudo')
        })
        .then(data => {
            produ_obj = data
            showProdu();
        })

        fetch(URL_COMENTARIOS)
        .then(res => { 
            if(res.ok) {return res.json()}
            else console.log('error en el fetch de comentarios')
        })
        .then(data => {
            showComent(data);
        })
        document.getElementById('botonenviar').addEventListener('click', function (e) { 

            event.preventDefault()
        
            const date = new Date()
            console.log(date.getHours())

            var elSelect = document.getElementById('userscore');
            var scoreUsuario = parseInt(elSelect.options[elSelect.selectedIndex].value)

            comentario = `<div class="comentario"> 
            <p> <strong>${localStorage.getItem('usuario')}</strong>
             - ${date.getFullYear()}-${date.getMonth() + 1 }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}
            ${addScore(scoreUsuario)}  
            <br>
            ${document.getElementById('usercoment').value} </p>  
               </div> `;

               document.getElementById('containerComents').innerHTML += comentario

        

        }) 


})