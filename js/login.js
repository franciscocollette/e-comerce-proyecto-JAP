
function showAlertErroremail() {
    document.getElementById("alert-danger-email").classList.add("show");}

    function showAlertErrorPass() {
        document.getElementById("alert-danger-pass").classList.add("show");}
    
    


document.addEventListener('DOMContentLoaded', function() {   
    
    document.getElementById("form inicio").addEventListener('submit', validarFormulario); 
    


}) 

function validarFormulario (evento) { 
    evento.preventDefault();

    var email = document.getElementById('email').value;
    if(email.length == 0) { 
        showAlertErroremail();
        return;
    }


   var password1 = document.getElementById('password1').value;
    if(password1.length == 0) {
        showAlertErrorPass();
    return;
    }

    window.location = 'pagina princ.html'
}