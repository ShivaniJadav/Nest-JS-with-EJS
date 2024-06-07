document.getElementById('resendLink').addEventListener('click', function () {
    const btnSubmit = document.getElementById('btnSubmit');
    btnSubmit.setAttribute('disabled', true);
  })

  document.getElementById('btnSubmit').addEventListener('click', function (event) {
    const otpInputs = document.querySelectorAll('input[name="otp-input"]');
    const otpError = document.getElementById('otpError');
    
    let otpValue = '';
    otpInputs.forEach(input => {
      otpValue += input.value;
    });

    document.getElementById('otp-hidden-input').value = otpValue;
    if(otpValue == '') {
      event.preventDefault();
      otpError.textContent = 'OTP is required.';
    } else if(otpValue.length != 6) {
      event.preventDefault();
      otpError.textContent = 'OTP is Invalid.';
    } else {
      otpError.textContent = '';
    }
  });

  document.addEventListener('DOMContentLoaded', function () {
    const inputs = document.querySelectorAll('.fp-input');
    inputs.forEach((input, index) => {
      input.addEventListener('input', () => {
        if (input.value.length === 1 && index < inputs.length - 1) {
          inputs[index + 1].focus();
        }
        updateHiddenInput();
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && input.value.length === 0 && index > 0) {
          inputs[index - 1].focus();
        }
      });

      input.addEventListener('paste', (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text');
        if (/^\d{6}$/.test(pasteData)) {
          pasteData.split('').forEach((char, i) => {
            if (i < inputs.length) {
              inputs[i].value = char;
            }
          });
          updateHiddenInput();
          inputs[inputs.length - 1].focus();
        }
      });
    });

    function updateHiddenInput() {
      const otpValue = Array.from(inputs).map(input => input.value).join('');
      document.getElementById('otp-hidden-input').value = otpValue;
    }
  });