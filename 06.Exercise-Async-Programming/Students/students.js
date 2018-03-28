function attachEvents() {

    let username = 'guest';
    let password = 'guest';
    let base64encode = btoa(username + ':' + password);
    let authorization = {"Authorization": "Basic " + base64encode};

    $('#load').on('click', loadData);
    $('#create').on('click', createData);

    function loadData() {
        $('#results .students').remove();
        $.ajax({
            method: 'GET',
            url: `https://baas.kinvey.com/appdata/kid_BJXTsSi-e/students`,
            headers: authorization
        }).then(loadStudents).catch(showError);

        function loadStudents(res) {
            let sorted = res.sort((a, b) => Number(a.ID) - Number(b.ID));
            for (let stud of sorted) {
                $('#results')
                    .append($('<tr class="students">')
                        .append(`<th>${stud.ID}</th>`)
                        .append(`<th>${stud.FirstName}</th>`)
                        .append(`<th>${stud.LastName}</th>`)
                        .append(`<th>${stud.FacultyNumber}</th>`)
                        .append(`<th>${stud.Grade}</th>`));
            }
        }
    }

    function createData() {

        let id = $('#id').val();
        let firstName = $('#firstNane').val();
        let lastName = $('#lastName').val();
        let facultyNumber = $('#facultyNumber').val();
        let grade = $('#grade').val();

        let jsonStudInfo = JSON.stringify({
            ID: Number(id),
            FirstName: firstName,
            LastName: lastName,
            FacultyNumber: facultyNumber,
            Grade: Number(grade)
        });
        $.ajax({
            method: 'POST',
            url: `https://baas.kinvey.com/appdata/kid_BJXTsSi-e/students`,
            headers: authorization,
            data: jsonStudInfo,
            contentType: 'application/json'
        }).then(appendStud).catch(showError);
    }

    function showError(err) {
        console.log(err);
    }

}