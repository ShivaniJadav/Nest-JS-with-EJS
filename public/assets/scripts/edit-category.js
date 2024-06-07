const nameInput = document.getElementById('txtname');
    
    function validateForm() {
      if (!nameInput.value) {
        event.preventDefault();
        nameError.textContent = 'Name is required.';
      } else {
        nameError.textContent = '';
      }
    }

    document.getElementById('btnSubmit').addEventListener('click', validateForm);