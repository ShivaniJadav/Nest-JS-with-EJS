const nameInput = document.getElementById('txtname');    
    function validateForm() {
      if (!nameInput.value) {
        event.preventDefault();
        nameError.textContent = 'Name is required.';
      } else {
        nameError.textContent = '';
      }

      selectElement = document.querySelector('#category');
      output = selectElement.value;
      if(output == -1) {
        event.preventDefault();
        categoryError.textContent = 'Please select category.';
      } else {
        categoryError.textContent = '';
      }
    }

    document.getElementById('btnSubmit').addEventListener('click', validateForm);