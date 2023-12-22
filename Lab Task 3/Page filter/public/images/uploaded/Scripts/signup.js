$(document).ready(function () {
    $('#registrationForm').validate({
        rules: {
            username: 'required',
            email: {
                required: true,
                email: true
            },
            password: 'required',
            confirmPassword: {
                required: true,
                equalTo: '#password'
            }
        },
        messages: {
            username: 'Please enter your username',
            email: {
                required: 'Please enter your email',
                email: 'Please enter a valid email address'
            },
            password: 'Please enter your password',
            confirmPassword: {
                required: 'Please confirm your password',
                equalTo: 'Passwords do not match'
            }
        },
        submitHandler: function (form) {
            // You can handle the form submission here
            alert('Form submitted successfully!');
        }
    });
});
