(function () {
    var doc = document,
        startBtn = doc.getElementById('start'),
        firstname = doc.getElementById('firstname'),
        lastname = doc.getElementById('lastname'),
        fathername = doc.getElementById('fathername'),
        phone = doc.getElementById('phone'),
        place = doc.getElementById('place'),
        alert = doc.getElementById('alert');
    startBtn.addEventListener('click', function (e) {
        var role = doc.querySelector('input[name="roleId"]:checked');
        if (!firstname.value.trim()
            || !lastname.value.trim()
            || !fathername.value.trim()
            || !phone.value.trim()
            || !place.value.trim()
            || !role) {
            alert.classList.add('alert_visible');
            e.preventDefault();
        }
    }, false);
})();