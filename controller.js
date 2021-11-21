const loginRedirectPage = "./personal-page/personal-page.html";
const homePage = "../index.html";

async function doLogin(e) {
    e.preventDefault();

    let username = document.getElementById("input-username").value;
    let password = document.getElementById("input-password").value;
    let alertBox = document.querySelectorAll(".alertBox")[0];

    let u = await login(username, password);

    if(u["error"] || !u["users"]) {      //Error DB / Connection
        alertBox.innerHTML="¡Error de conexión!";
    }

    if(u["users"] == "" && u["users"]) { //Incorrect login
        alertBox.innerHTML="Usuario y/o contraseña incorrectos.";
    }

    if(u["users"] != "" && u["users"]) { //Ok!
        alertBox.innerHTML="Inicio de sesión correcto, redireccionando...";
        let userId=u["users"][0]["uuid"];
        localStorage.setItem("sessionId", userId);
        setTimeout(function() {
            window.location.replace(loginRedirectPage);
        }, 2500);
    }
}

async function doLoadData() {

    
    let alertBox = document.querySelectorAll(".alertBox")[0];
    let name = document.querySelector(".name-text");
    let surname = document.querySelector(".surname-text");
    let email = document.querySelector(".email-text");
    let username = document.querySelector(".username-text");
    let tel = document.querySelector(".tel-text");
    let vac = document.querySelector(".vac-text");
    let access_table = document.getElementById("access_data");
    
    let userId = localStorage.getItem("sessionId");
    

    if(userId == null)
        return;
    
    let u = await loadUserData(userId);
    let f = await loadUserAccess(userId, 0, 0);
    alertBox.innerHTML="";
    if(u["error"] || !u["users"] || f["error"] || !f["access_log"]) {  //Error DB / Connection
        alertBox.innerHTML="¡Error de conexión!";
    }
    
    
    if(u["users"] != "" && u["users"]) { //Ok!
        name.innerHTML = u["users"][0]["name"];
        surname.innerHTML = u["users"][0]["surname"];
        email.innerHTML = u["users"][0]["email"];
        username.innerHTML = u["users"][0]["username"];
        tel.innerHTML = u["users"][0]["phone"];
        if(!u["users"][0]["tel"])
            vac.innerHTML = "No";
        else vac.innerHTML = "Sí";

        let qrcodeText = "{"+u["users"][0]["name"]+"},{"+u["users"][0]["surname"]+"},{"+u["users"][0]["uuid"]+"}";

        let qrcode =new QRCode(document.getElementById("qrcode"), {
            text: qrcodeText,
            width:128,
            height: 128,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    }

    if(f["access_log"] != null && f["access_log"]) { // Ok!
        f["access_log"]= f["access_log"].sort((function (a, b) { return new Date(b.timestamp) - new Date(a.timestamp) }));

        if(f["access_log"].length <= 0) {
            alertBox.innerHTML += "No hay datos del usuari@";
        }

        for(let i = 0; i < f["access_log"].length; i++) {
            let nrow = document.createElement("tr");
            let nc_type = document.createElement("td");
            let nc_name = document.createElement("td");
            let nc_timestamp = document.createElement("td");
            let nc_temperature = document.createElement("td");

            nc_type.innerHTML = f["access_log"][i]["type"];
            nc_name.innerHTML = f["access_log"][i]["facility"]["name"];
            nc_timestamp.innerHTML = new Date(f["access_log"][i]["timestamp"]).toLocaleString();
            nc_temperature.innerHTML = f["access_log"][i]["temperature"];

            nrow.append(nc_type);
            nrow.append(nc_name);
            nrow.append(nc_timestamp);
            nrow.append(nc_temperature);
            access_table.appendChild(nrow);
        }
    }
    
}

async function doSignUp(e) {
    e.preventDefault();

    let username = document.getElementById("input-username").value;
    let name = document.getElementById("input-name").value;
    let surname = document.getElementById("input-surname").value;
    let password = document.getElementById("input-password").value;
    let passwordConfirm = document.getElementById("input-password-confirm").value;
    let email = document.getElementById("input-email").value;
    let emailConfirm = document.getElementById("input-email-confirm").value;
    let phone = document.getElementById("input-phone").value;
    let vaccinated = document.getElementById("input-vaccinated").value;
    let is_vaccinated = (vaccinated === 'true');
    let alertBox = document.querySelectorAll(".alertBox")[0];

    let w = await doCheckUsernameExists(username);

    doCheckSignUpForm(w);

    if(!(username.length > 0 && name.length >= 4 && surname.length > 0 && password == passwordConfirm && email == emailConfirm && password.length >= 8 && email.length > 0 && !w))
        return;

    alertBox.innerHTML="";
    
    let u = await addUser(username, password, name, surname, phone, email, is_vaccinated);

    if(u["error"] || !u["insert_users_one"]) {                 //Error DB / Connection
        alertBox.innerHTML="¡Error de conexión!";
    }

    if(u["insert_users_one"] == "" && u["insert_users_one"]) { //Incorrect sign up
        alertBox.innerHTML="Usuario y/o contraseña incorrectos.";
    }

    if(u["insert_users_one"] != "" && u["insert_users_one"]) { //Ok!
        alertBox.innerHTML="Registro correcto, redireccionando...";
        setTimeout(function() {
            window.location.replace(homePage);
        }, 2500);
    }
    
}

async function doCheckUsernameExists(username) { //goldenbird345
    let username_field = document.getElementById("input-username");
    let alertBox = document.querySelectorAll(".alertBox")[0];
    let username_error = document.querySelector(".username-error");

    let u = await fetchUsers();
    let exists = false;

    if(u["error"] || !u["users"]) {      //Error DB / Connection
        alertBox.innerHTML="¡Error de conexión!";
    }

    if(u["users"] != "" && u["users"]) { //Ok!
        u["users"].forEach(user => {
            if (user['username'] == username) {
                username_error.innerHTML = "¡El nombre de usuario ya existe!";
                username_field.style.borderColor = "red";
                exists = true;
            }
        });
    }

    if(!exists) {
        username_field.style.borderColor = "green";
    }

    return exists;
}

function checkPasswords() {
    let password = document.getElementById("input-password");
    let passwordConfirm = document.getElementById("input-password-confirm");
    let pass_confirm_error = document.querySelector(".password-confirm-error");

    if(password.value != passwordConfirm.value) {
        pass_confirm_error.innerHTML = "¡Las contraseñas no coinciden!";
        passwordConfirm.style.borderColor = "red";
    }else {
        pass_confirm_error.innerHTML = "";
        passwordConfirm.style.borderColor = "green";
    }
}

function checkEmails() {
    let email = document.getElementById("input-email");
    let emailConfirm = document.getElementById("input-email-confirm");
    let email_confirm_error = document.querySelector(".email-confirm-error");

    if(email.value != emailConfirm.value) {
        email_confirm_error.innerHTML = "¡Los emails no coinciden!";
        emailConfirm.style.borderColor = "red";
    }else{
        email_confirm_error.innerHTML = "";
        emailConfirm.style.borderColor = "green";
    }
}

function doCheckSignUpForm(w) {
    let username = document.getElementById("input-username");
    let name = document.getElementById("input-name");
    let surname = document.getElementById("input-surname");
    let password = document.getElementById("input-password");
    let email = document.getElementById("input-email");
    let name_error = document.querySelector(".name-error");
    let surname_error = document.querySelector(".surname-error");
    let username_error = document.querySelector(".username-error");
    let pass_error = document.querySelector(".password-error");
    let email_error = document.querySelector(".email-error");

    if(username.value.length < 4) {
        username_error.innerHTML = "¡El campo del nombre de usuario tiene que tener al menos 4 carácteres!";
        username.style.borderColor = "red";
    }else{
        if(!w) //Username not exists
            username.style.borderColor = "green";
        else
            username.style.borderColor = "red";
    }

    if(name.value.length <= 0) {
        name_error.innerHTML = "¡El campo del nombre no puede estar vacío!";
        name.style.borderColor = "red";
    }else{
        name_error.innerHTML = "";
        name.style.borderColor = "green";
    }

    if(surname.value.length <= 0) {
        surname_error.innerHTML = "¡El campo de los apellidos no puede estar vacío!";
        surname.style.borderColor = "red";
    }else{
        surname_error.innerHTML = "";
        surname.style.borderColor = "green";
    }

    if(password.value.length < 8) {
        pass_error.innerHTML = "¡La contraseña tiene que tener al menos 8 carácteres!";
        password.style.borderColor = "red";
    }else{
        pass_error.innerHTML = "";
        password.style.borderColor = "green";
    }

    if(email.value.length <= 0) {
        email_error.innerHTML = "¡El email no puede estar vacío!";
        email.style.borderColor = "red";
    }else{
        email_error.innerHTML = "";
        email.style.borderColor = "green";
    }

}

function doLogOut(e) {
    e.preventDefault();
    localStorage.removeItem("sessionId");
    window.location.replace(homePage);
}

function clearError(e) {
    let s = document.querySelector("."+(e.id).replace("input-", "") + "-error");
    s.innerHTML = "";
}

function goHome() {
    window.location.replace(homePage);
}