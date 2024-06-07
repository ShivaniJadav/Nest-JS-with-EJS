function validateForm() {
  const emailInput = document.getElementById('txtemail');
//   const passwordInput = document.getElementById('txtPassword');
  const emailPattern = /^[^\s@]+@[^\s@]+[^.]\.[^.][^\s@]+$/;
//   const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;

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

document.getElementById('btnSubmit').addEventListener('click', validateForm);