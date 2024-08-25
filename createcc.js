
window.onload = function () {
    // Check if the URL has a 'code' parameter and populate the 'linkCode' input field
    var urlParams = new URLSearchParams(window.location.search);
    var codeValue = urlParams.get('code');
    if (codeValue) {
        var linkCodeInput = document.getElementById("linkCode");
        linkCodeInput.value = codeValue;
    }
};

function validateForm(email) {
    console.log(email)
    var email = document.getElementById(email).value;
    if (email.trim() === "") {
        alert("Please enter an email address.");
        return false;
    }
    else if (!validateEmail(email)) {
        alert("Please enter a valid email address.");
        return false;
    }
    return true;
}

function validateEmail(email) {
    // Regular expression pattern for email validation
    var emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailPattern.test(email);
}
