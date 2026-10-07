/* =========================================================
   PASSWORD SHOW / HIDE
========================================================= */

function togglePassword() {

    const password =
        document.getElementById("loginPassword");

    const toggle =
        document.querySelector(".password-toggle");


    const isPassword =
        password.type === "password";


    if (isPassword) {

        password.type = "text";

        toggle.textContent = "Hide";

        toggle.setAttribute(
            "aria-label",
            "Hide password"
        );

    } else {

        password.type = "password";

        toggle.textContent = "Show";

        toggle.setAttribute(
            "aria-label",
            "Show password"
        );

    }
}


/* =========================================================
   LOGIN
========================================================= */

function agencyLogin() {

    const email =
        document.getElementById("loginEmail").value.trim();

    const password =
        document.getElementById("loginPassword").value;

    const loginScreen =
        document.getElementById("loginScreen");

    const loginError =
        document.getElementById("loginError");


    /*
     * Demo login credentials
     */
    const correctEmail = "admin@agency.com";
    const correctPassword = "1234";


    if (
        email === correctEmail &&
        password === correctPassword
    ) {

        // Hide login screen
        loginScreen.style.display = "none";

        // Hide error
        loginError.style.display = "none";
         // Redirect to dashboard
        window.location.href = "dashboard.html";

    } else {

        // Show error
        loginError.style.display = "block";

    }
}


/* =========================================================
   ENTER KEY LOGIN
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const password =
        document.getElementById("loginPassword");

    const email =
        document.getElementById("loginEmail");


    password.addEventListener("keydown", function (event) {

        if (event.key === "Enter") {
            agencyLogin();
        }

    });


    email.addEventListener("keydown", function (event) {

        if (event.key === "Enter") {
            agencyLogin();
        }

    });

});
