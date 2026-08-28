// Multi-step order form for Salafiaath

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('orderForm');
  if (!form) return;

  const steps = form.querySelectorAll('.form-step');
  const progressSteps = document.querySelectorAll('.progress-step');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const submitBtn = document.getElementById('submitBtn');
  const formNav = document.getElementById('formNav');
  const formSuccess = document.getElementById('formSuccess');

  let currentStep = 1;
  const totalSteps = steps.length;

  function showStep(step) {
    steps.forEach(function (s) {
      s.classList.remove('active');
    });
    const active = form.querySelector('.form-step[data-step="' + step + '"]');
    if (active) active.classList.add('active');

    progressSteps.forEach(function (p) {
      const pStep = parseInt(p.getAttribute('data-step'), 10);
      p.classList.remove('active', 'completed');
      if (pStep === step) p.classList.add('active');
      else if (pStep < step) p.classList.add('completed');
    });

    // Buttons
    prevBtn.style.visibility = step === 1 ? 'hidden' : 'visible';
    if (step === totalSteps) {
      nextBtn.style.display = 'none';
      submitBtn.style.display = 'inline-flex';
    } else {
      nextBtn.style.display = 'inline-flex';
      submitBtn.style.display = 'none';
    }

    // Scroll to top of form
    form.closest('.form-wrapper').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function validateStep(step) {
    const stepEl = form.querySelector('.form-step[data-step="' + step + '"]');
    if (!stepEl) return true;

    let valid = true;
    const requiredFields = stepEl.querySelectorAll('[required]');

    // Clear previous errors in this step
    stepEl.querySelectorAll('.form-group').forEach(function (g) {
      g.classList.remove('error');
    });

    requiredFields.forEach(function (field) {
      const group = field.closest('.form-group') || field.closest('.checkbox-option')?.parentElement;
      let isValid = true;

      if (field.type === 'radio') {
        const name = field.name;
        const checked = stepEl.querySelector('input[name="' + name + '"]:checked');
        isValid = !!checked;
        if (!isValid) {
          const radioGroup = stepEl.querySelector('[data-field="' + name + '"]') || field.closest('.form-group');
          if (radioGroup) radioGroup.classList.add('error');
          valid = false;
        }
      } else if (field.type === 'checkbox') {
        isValid = field.checked;
        if (!isValid) {
          const parent = field.closest('.form-group');
          if (parent) parent.classList.add('error');
          valid = false;
        }
      } else if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = field.value.trim() !== '' && emailRegex.test(field.value.trim());
        if (!isValid && group) {
          group.classList.add('error');
          valid = false;
        }
      } else if (field.type === 'number') {
        const num = parseInt(field.value, 10);
        isValid = !isNaN(num) && num >= 1;
        if (!isValid && group) {
          group.classList.add('error');
          valid = false;
        }
      } else {
        isValid = field.value.trim() !== '';
        if (!isValid && group) {
          group.classList.add('error');
          valid = false;
        }
      }
    });

    return valid;
  }

  nextBtn.addEventListener('click', function () {
    if (validateStep(currentStep)) {
      currentStep++;
      if (currentStep > totalSteps) currentStep = totalSteps;
      showStep(currentStep);
    }
  });

  prevBtn.addEventListener('click', function () {
    currentStep--;
    if (currentStep < 1) currentStep = 1;
    showStep(currentStep);
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!validateStep(currentStep)) return;

    // Extra safety: validate all required across form
    let allValid = true;
    for (let i = 1; i <= totalSteps; i++) {
      if (!validateStep(i)) {
        allValid = false;
        currentStep = i;
        showStep(currentStep);
        break;
      }
    }
    if (!allValid) return;

    // Disable button to prevent double submit
    submitBtn.disabled = true;
    submitBtn.textContent = 'Versturen…';

    // Use Formspree (or any endpoint set in action)
    const formData = new FormData(form);

    // Add a readable summary for the email body
    const summary = buildEmailSummary(formData);
    formData.append('samenvatting', summary);

    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
      .then(function (response) {
        if (response.ok) {
          // Success
          form.style.display = 'none';
          formNav.style.display = 'none';
          document.getElementById('formProgress').style.display = 'none';
          formSuccess.classList.add('show');
        } else {
          return response.json().then(function (data) {
            throw new Error(data.error || 'Er ging iets mis bij het versturen.');
          });
        }
      })
      .catch(function (err) {
        alert('Sorry, er is iets misgegaan bij het versturen van je aanvraag. Probeer het later opnieuw of neem contact op via Instagram @salafiaath.\n\nDetails: ' + (err.message || ''));
        submitBtn.disabled = false;
        submitBtn.textContent = 'Aanvraag versturen';
      });
  });

  function buildEmailSummary(formData) {
    const lines = [
      'Nieuwe aanvraag via Salafiaath website',
      '',
      '=== Klantgegevens ===',
      'Naam: ' + (formData.get('naam') || '-'),
      'E-mail: ' + (formData.get('email') || '-'),
      'Telefoon: ' + (formData.get('telefoon') || '-'),
      'Woonplaats: ' + (formData.get('plaats') || '-'),
      '',
      '=== Bestelling ===',
      'Product: ' + (formData.get('product') || '-'),
      'Aantal: ' + (formData.get('aantal') || '-'),
      'Kleur: ' + (formData.get('kleur') || '-'),
      'Lengte/maat: ' + (formData.get('lengte') || '-'),
      'Gewenste leverdatum: ' + (formData.get('gewenste_datum') || '-'),
      '',
      '=== Extra informatie ===',
      'Opmerkingen: ' + (formData.get('opmerkingen') || '-'),
      'Hoe gevonden: ' + (formData.get('hoe_gevonden') || '-'),
      '',
      'Privacy akkoord: ' + (formData.get('privacy') || 'Nee')
    ];
    return lines.join('\n');
  }

  // Live clear error on input
  form.addEventListener('input', function (e) {
    const group = e.target.closest('.form-group');
    if (group) group.classList.remove('error');
  });
  form.addEventListener('change', function (e) {
    const group = e.target.closest('.form-group');
    if (group) group.classList.remove('error');
  });

  // Init
  showStep(1);
});
