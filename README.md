# SkillTinder
Aplicación para conseguir trabajos.

Esta aplicación está concebida como un API que puede ser consumida desde Postman o desde cualquier aplicación que pueda consumir APIs.

También es posible crear una Aplicación de Usuario que consuma estas API y presente una interfaz de usuario.

Un ejemplo de uso de nuestra API es el siguiente, usando JS.

----------------------------
var myHeaders = new Headers();
myHeaders.append("Authorization", "Basic aW5mb0BpYm0uY29tOk1hcjEzMDEx");

var raw = "";

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("http://localhost:3000/consultProfessionals/skill/Advanced Excel", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
----------------

Este código consume el API consultProfessionals by Skill
Como parámetro de la petición se envía la habilidad (skill) que se desea buscar entre los profesionales.
