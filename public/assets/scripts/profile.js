let flag = 0;
    window.onload = function () {
      const imgtag = document.getElementById('imgphoto');
      imgtag.src = '/images/<%= user.photo %>';
    };
    
    const fileInput = document.getElementById('formFile');
    // const form = document.getElementById('frm');
    
    function validateForm() {

      const fnameInput = document.getElementById('txtfname');
      const lnameInput = document.getElementById('txtlname');
      const mobileInput = document.getElementById('txtmobile');
      const emailInput = document.getElementById('txtemail');

      const mobilePattern = /^\d{1,10}$/;
      const namePattern = /^[a-zA-Z]+$/;
      const emailPattern = /^[^\s@]+@[^\s@]+[^.]\.[^.][^\s@]+$/;

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
      // form.submit();
    }

    document.getElementById('btnSubmit').addEventListener('click', validateForm);
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