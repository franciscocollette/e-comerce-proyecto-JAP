
let nombre = document.getElementById('nombre');
let segnombre = document.getElementById('segnombre');
let apellido = document.getElementById('apellido');
let segapellido = document.getElementById('segapellido');
let email = document.getElementById('emailperf');
let telcont = document.getElementById('telcontacto');
let formulario = document.getElementById('formperfil');


//hay que hacer un if de que si el perfilObj no esta en el local se cree uno vacio y si hay algo que lo tome 
if (localStorage.getItem('infoperfil') === null) {
    var perfilObj = new Object();
    perfilObj.name = '';
    perfilObj.segname = '';
    perfilObj.apellido = '';
    perfilObj.segapellido = '';
    perfilObj.email = localStorage.getItem('usuario');
    perfilObj.telcont = '';
}
else {
    var perfilObj = JSON.parse(localStorage.getItem('infoperfil'));
    nombre.value = perfilObj.name;
    segnombre.value = perfilObj.segname
    apellido.value = perfilObj.apellido;
    segapellido.value = perfilObj.segapellido;
    email.value = perfilObj.email;
    telcont.value = perfilObj.telcont;
}

function checkiflogged() {
    if (localStorage.getItem('usuario') === null) {
        formulario.classList.add('d-none')
        document.getElementById('msjnologged').classList.remove('d-none');
    }
    else {
        document.getElementById('msjnologged').classList.add('d-none');
        formulario.classList.remove('d-none')
        email.value = perfilObj.email;
    }

}
checkiflogged();

formulario.addEventListener("submit", validarFormulario);
document.getElementById("perfilbtn").addEventListener("click", function () { todook(); })

function validarFormulario(evento) {
    evento.preventDefault();
    formulario.classList.add("was-validated");
}

function todook() {
    if (nombre.value.length > 0 && apellido.value.length > 0
        && email.value.length > 0) {
        console.log('todo esta checkeado');
        updateUser();
    }
}

function updateUser() {

    perfilObj.name = nombre.value;
    perfilObj.segname = segnombre.value;
    perfilObj.apellido = apellido.value;
    perfilObj.segapellido = segapellido.value;
    perfilObj.email = email.value;
    perfilObj.telcont = telcont.value;

    localStorage.setItem('infoperfil', JSON.stringify(perfilObj));


}

// probando para guardar imagenes en local storage

function encodeImageFileAsURL() {

    var filesSelected = document.getElementById("inputFileToLoad").files;
    if (filesSelected.length > 0) {
      var fileToLoad = filesSelected[0];

      var fileReader = new FileReader();

      fileReader.onload = function(fileLoadedEvent) {
        var srcData = fileLoadedEvent.target.result; // <--- data: base64

        var newImage = document.createElement('img');
        newImage.src = srcData;

        document.getElementById("imgTest").innerHTML = newImage.outerHTML;
        alert("Converted Base64 version is " + document.getElementById("imgTest").innerHTML);
        console.log("Converted Base64 version is " + document.getElementById("imgTest").innerHTML);
      }
      fileReader.readAsDataURL(fileToLoad);
    }
  }
