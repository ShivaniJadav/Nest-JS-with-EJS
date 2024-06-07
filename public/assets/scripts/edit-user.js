let flag = 0;
    const fnameInput = document.getElementById('txtfname');
    const lnameInput = document.getElementById('txtlname');
    const mobileInput = document.getElementById('txtmobile');
    const emailInput = document.getElementById('txtemail');
    // const verifyInput = document.querySelector('#chkverified');
    // const filename = document.getElementById('txtfile');
    // const photofile = document.getElementById('photofile');

    const fileInput = document.getElementById('formFile');

    document.getElementById('imgphoto').addEventListener('click', function () {
      fileInput.click();
    });

    fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
              flag = 1;
                // Create a URL for the selected file and set it as the image source
                const imageURL = URL.createObjectURL(file);
                const imgtag = document.getElementById('imgphoto');
                imgtag.src = imageURL;
            }
        });

    function validateForm() {
      // console.log(document.querySelector('#chkverified').checked);
      // const chkterms = document.getElementById('chkterms');
      // const passwordInput = document.getElementById('txtPassword');
      // const confirmPasswordInput = document.getElementById('txtConfirmPassword');
      const mobilePattern = /^\d{1,10}$/;
      const namePattern = /^[a-zA-Z]+$/;
      const emailPattern = /^[^\s@]+@[^\s@]+[^.]\.[^.][^\s@]+$/;
      // const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
      console.log(flag);
      if(flag == 0) {
        fileInput.removeAttribute('name');
      }

      if (!fnameInput.value) {
        event.preventDefault();
        nameError.textContent = 'First name is required.';
      } else if (!namePattern.test(fnameInput.value)) {
        event.preventDefault();
        nameError.textContent = 'First name is invalid.';
      } else if (!lnameInput.value) {
        event.preventDefault();
        nameError.textContent = 'Last name is required.';
      } else if (!namePattern.test(lnameInput.value)) {
        event.preventDefault();
        nameError.textContent = 'Last name is invalid.';
      } else {
        nameError.textContent = '';
      }

      if (!mobileInput.value) {
        event.preventDefault();
        mobileError.textContent = 'Mobile no. is required.';
      } else if (!mobilePattern.test(mobileInput.value)) {
        event.preventDefault();
        mobileError.textContent = 'Mobile no. is invalid.';
      } else {
        mobileError.textContent = '';
      }

      if (!emailInput.value) {
        event.preventDefault();
        emailError.textContent = 'Email is required.';
      } else if (!emailPattern.test(emailInput.value)) {
        event.preventDefault();
        emailError.textContent = 'Email is invalid.';
      } else {
        emailError.textContent = '';
      }
    }

    // function submitForm() {
    //   console.log('submitted');
    //   validateForm();
    //   console.log('validated');

    //   const data = {
    //     first_name: fnameInput.value,
    //     last_name: lnameInput.value,
    //     email: emailInput.value,
    //     mobile_no: mobileInput.value,
    //     is_verified: verifyInput.checked
    //   };

    //   console.log('data: ', data);

    //   axios.put(`/users/<%= edituser.user_id %>`, data)
    //     .then(function (response) {
    //       console.log('API called', response);
    //       window.location.href = '/users';
    //     })
    //     .catch(function (error) {
    //       console.error('There was an error making the request:', error);
    //     });
    // }

    document.getElementById('txtfname').addEventListener('change', validateForm);
    document.getElementById('txtlname').addEventListener('change', validateForm);
    document.getElementById('txtmobile').addEventListener('change', validateForm);
    document.getElementById('txtemail').addEventListener('change', validateForm);
    document.getElementById('chkverified').addEventListener('change', validateForm);

    document.getElementById('btnSubmit').addEventListener('click', validateForm);