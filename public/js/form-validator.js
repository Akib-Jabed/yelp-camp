(() => {
    const fields = document.querySelectorAll('.needs-validation');

    Array.from(fields).forEach((field) => {
        field.addEventListener(
            'submit',
            (event) => {
                if (!field.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }

                field.classList.add('was-validated');
            },
            false
        );
    });
})();
