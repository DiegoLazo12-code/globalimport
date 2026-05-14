const form = document.querySelector('.register-form');
const referenciaField = form.querySelector('textarea[name="referencia"]');
const charCount = document.querySelector('.char-count');
const passwordInput = form.querySelector('input[name="password"]');
const strengthFill = document.querySelector('.strength-fill');
const strengthLabel = document.querySelector('.strength-indicator p');

const validators = {
    nombre(value) {
        const trimmed = value.trim();
        return /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,60}$/.test(trimmed);
    },
    nacimiento(value) {
        if (!value) return false;
        const birthday = new Date(value);
        const today = new Date();
        let age = today.getFullYear() - birthday.getFullYear();
        const monthDiff = today.getMonth() - birthday.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
            age -= 1;
        }
        return age >= 18;
    },
    documento(value) {
        const raw = value.trim();
        const digitsOnly = raw.replace(/\D/g, '');
        if (/^[0-9]{7,8}$/.test(digitsOnly)) {
            return true;
        }
        const cleanRut = raw.replace(/\./g, '').replace(/-/g, '').toUpperCase();
        if (!/^[0-9]{7,8}[0-9K]$/.test(cleanRut)) {
            return false;
        }
        const rutBody = cleanRut.slice(0, -1);
        const givenDv = cleanRut.slice(-1);
        let sum = 0;
        let multiplier = 2;
        for (let i = rutBody.length - 1; i >= 0; i--) {
            sum += Number(rutBody[i]) * multiplier;
            multiplier = multiplier === 7 ? 2 : multiplier + 1;
        }
        const expected = 11 - (sum % 11);
        const dv = expected === 11 ? '0' : expected === 10 ? 'K' : String(expected);
        return dv === givenDv;
    },
    genero(value) {
        return value.trim() !== '';
    },
    nacionalidad(value) {
        return value.trim() !== '';
    },
    email(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
    },
    password(value) {
        return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(value);
    },
    telefono(value) {
        const digits = value.replace(/[^0-9]/g, '');
        return digits.length >= 8;
    },
    ciudad(value) {
        return /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,}$/.test(value.trim());
    },
    calle(value) {
        return value.trim().length >= 5;
    },
    codigo_postal(value) {
        return /^[A-Za-z0-9]{4,10}$/.test(value.trim());
    },
    referencia(value) {
        return value.trim().length <= 200;
    }
};

function showError(element, message) {
    if (!element) return;
    element.classList.remove('campo-ok');
    element.classList.add('campo-error');
    const next = element.nextElementSibling;
    if (next && next.classList.contains('error-message')) {
        next.textContent = message;
        return;
    }
    const error = document.createElement('p');
    error.className = 'error-message';
    error.textContent = message;
    element.insertAdjacentElement('afterend', error);
}

function showGroupError(groupElement, message) {
    if (!groupElement) return;
    groupElement.classList.remove('campo-ok');
    groupElement.classList.add('campo-error');
    const next = groupElement.nextElementSibling;
    if (next && next.classList.contains('error-message')) {
        next.textContent = message;
        return;
    }
    const error = document.createElement('p');
    error.className = 'error-message';
    error.textContent = message;
    groupElement.insertAdjacentElement('afterend', error);
}

function clearErrors() {
    form.querySelectorAll('.campo-error').forEach(el => el.classList.remove('campo-error'));
    form.querySelectorAll('.campo-ok').forEach(el => el.classList.remove('campo-ok'));
    form.querySelectorAll('.error-message').forEach(el => el.remove());
}

function removeFieldFeedback(element) {
    if (!element) return;
    element.classList.remove('campo-error', 'campo-ok');
    const next = element.nextElementSibling;
    if (next && next.classList.contains('error-message')) {
        next.remove();
    }
}

function updateCharCount() {
    const value = referenciaField.value;
    charCount.textContent = value.length;
    if (value.length > 200) {
        referenciaField.classList.add('campo-error');
        referenciaField.classList.remove('campo-ok');
    } else {
        referenciaField.classList.remove('campo-error');
    }
}

function evaluatePasswordStrength(password) {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[!@#$%^&*]/.test(password)) score += 1;
    if (password.length >= 12) score += 1;
    return score;
}

function validateField(element) {
    if (!element) return true;
    const value = element.value;
    const name = element.name;

    switch (name) {
        case 'nombre':
            if (!validators.nombre(value)) {
                showError(element, 'Nombre completo: solo letras y espacios, 3-60 caracteres.');
                return false;
            }
            break;
        case 'nacimiento':
            if (!validators.nacimiento(value)) {
                showError(element, 'Debes ser mayor de 18 años.');
                return false;
            }
            break;
        case 'documento':
            if (!validators.documento(value)) {
                showError(element, 'RUT inválido: 7-8 dígitos o formato válido.');
                return false;
            }
            break;
        case 'genero':
        case 'nacionalidad':
        case 'pais':
            if (!value.trim()) {
                showError(element, `Selecciona una opción válida.`);
                return false;
            }
            break;
        case 'email':
            if (!validators.email(value)) {
                showError(element, 'El email no tiene un formato válido.');
                return false;
            }
            break;
        case 'email_confirm': {
            const emailField = form.querySelector('input[name="email"]');
            if (value.trim() !== emailField.value.trim()) {
                showError(element, 'Los correos deben coincidir exactamente.');
                return false;
            }
            break;
        }
        case 'password':
            if (!validators.password(value)) {
                showError(element, 'Contraseña: mínimo 8 caracteres, 1 mayúscula, 1 número y 1 carácter especial.');
                return false;
            }
            break;
        case 'password_confirm': {
            const passwordField = form.querySelector('input[name="password"]');
            if (value !== passwordField.value) {
                showError(element, 'Las contraseñas deben coincidir exactamente.');
                return false;
            }
            break;
        }
        case 'telefono':
            if (!validators.telefono(value)) {
                showError(element, 'Teléfono: mínimo 8 dígitos numéricos.');
                return false;
            }
            break;
        case 'provincia':
            if (!value.trim()) {
                showError(element, 'Provincia / Estado no puede quedar vacío.');
                return false;
            }
            break;
        case 'ciudad':
            if (!validators.ciudad(value)) {
                showError(element, 'Ciudad: solo letras y espacios, mínimo 2 caracteres.');
                return false;
            }
            break;
        case 'calle':
            if (!validators.calle(value)) {
                showError(element, 'Calle y número: mínimo 5 caracteres.');
                return false;
            }
            break;
        case 'codigo_postal':
            if (!validators.codigo_postal(value)) {
                showError(element, 'Código postal: solo alfanumérico, 4-10 caracteres.');
                return false;
            }
            break;
        case 'referencia':
            if (!validators.referencia(value)) {
                showError(element, 'Referencia no puede superar los 200 caracteres.');
                return false;
            }
            break;
    }

    element.classList.add('campo-ok');
    return true;
}

function getStrengthInfo(score) {
    if (score === 0) {
        return { label: 'Sin contraseña', width: '0%', color: '#cbd5e1' };
    }
    if (score === 1) {
        return { label: 'Muy débil', width: '20%', color: '#dc2626' };
    }
    if (score === 2) {
        return { label: 'Débil', width: '40%', color: '#f97316' };
    }
    if (score === 3) {
        return { label: 'Regular', width: '60%', color: '#eab308' };
    }
    if (score === 4) {
        return { label: 'Buena', width: '80%', color: '#22c55e' };
    }
    return { label: 'Excelente', width: '100%', color: '#16a34a' };
}

function updatePasswordStrength() {
    if (!passwordInput || !strengthFill || !strengthLabel) return;
    const score = evaluatePasswordStrength(passwordInput.value);
    const strength = getStrengthInfo(score);
    strengthFill.style.width = strength.width;
    strengthFill.style.backgroundColor = strength.color;
    strengthLabel.textContent = `Fuerza de contraseña: ${strength.label}`;
}

function showSuccessMessage() {
    const nombre = form.querySelector('input[name="nombre"]').value.trim();
    const titleName = nombre ? nombre.split(' ')[0] : 'usuario';
    const successWrapper = document.createElement('div');
    successWrapper.className = 'success-card';
    successWrapper.innerHTML = `
        <h2>Registro exitoso</h2>
        <p>Gracias <strong>${titleName}</strong>, tu registro se completó correctamente.</p>
        <a href="index.html" class="btn-primary">Volver al inicio</a>
    `;
    form.style.display = 'none';
    form.parentElement.appendChild(successWrapper);
}

form.addEventListener('submit', event => {
    clearErrors();
    let valid = true;

    const nombre = form.querySelector('input[name="nombre"]');
    if (!validators.nombre(nombre.value)) {
        showError(nombre, 'Nombre completo: solo letras y espacios, 3-60 caracteres.');
        valid = false;
    }

    const nacimiento = form.querySelector('input[name="nacimiento"]');
    if (!validators.nacimiento(nacimiento.value)) {
        showError(nacimiento, 'Debes ser mayor de 18 años.');
        valid = false;
    }

    const documento = form.querySelector('input[name="documento"]');
    if (!validators.documento(documento.value)) {
        showError(documento, 'RUT debe contener solo números y tener entre 7 y 8 dígitos.');
        valid = false;
    }

    const genero = form.querySelector('select[name="genero"]');
    if (!validators.genero(genero.value)) {
        showError(genero, 'Selecciona tu género.');
        valid = false;
    }

    const nacionalidad = form.querySelector('select[name="nacionalidad"]');
    if (!validators.nacionalidad(nacionalidad.value)) {
        showError(nacionalidad, 'Selecciona tu nacionalidad.');
        valid = false;
    }

    const email = form.querySelector('input[name="email"]');
    if (!validators.email(email.value)) {
        showError(email, 'Ingresa un correo electrónico válido.');
        valid = false;
    }

    const emailConfirm = form.querySelector('input[name="email_confirm"]');
    if (emailConfirm.value.trim() !== email.value.trim()) {
        showError(emailConfirm, 'Los correos deben coincidir exactamente.');
        valid = false;
    }

    const password = form.querySelector('input[name="password"]');
    if (!validators.password(password.value)) {
        showError(password, 'Contraseña: mínimo 8 caracteres, 1 mayúscula, 1 número y 1 carácter especial.');
        valid = false;
    }

    const passwordConfirm = form.querySelector('input[name="password_confirm"]');
    if (passwordConfirm.value !== password.value) {
        showError(passwordConfirm, 'Las contraseñas deben coincidir exactamente.');
        valid = false;
    }

    const telefono = form.querySelector('input[name="telefono"]');
    if (!validators.telefono(telefono.value)) {
        showError(telefono, 'Teléfono: mínimo 8 dígitos relacionados y pueden incluir +, -, espacios.');
        valid = false;
    }

    const pais = form.querySelector('select[name="pais"]');
    if (!pais.value.trim()) {
        showError(pais, 'Selecciona un país válido.');
        valid = false;
    }

    const provincia = form.querySelector('input[name="provincia"]');
    if (!provincia.value.trim()) {
        showError(provincia, 'Provincia / Estado no puede quedar vacío.');
        valid = false;
    }

    const ciudad = form.querySelector('input[name="ciudad"]');
    if (!validators.ciudad(ciudad.value)) {
        showError(ciudad, 'Ciudad: solo letras y espacios, mínimo 2 caracteres.');
        valid = false;
    }

    const calle = form.querySelector('input[name="calle"]');
    if (!validators.calle(calle.value)) {
        showError(calle, 'Calle y número: mínimo 5 caracteres.');
        valid = false;
    }

    const codigoPostal = form.querySelector('input[name="codigo_postal"]');
    if (!validators.codigo_postal(codigoPostal.value)) {
        showError(codigoPostal, 'Código postal: solo alfanumérico, 4-10 caracteres.');
        valid = false;
    }

    const referencia = referenciaField;
    if (!validators.referencia(referencia.value)) {
        showError(referencia, 'Referencia no puede superar los 200 caracteres.');
        valid = false;
    }

    const categorias = form.querySelectorAll('input[name="categoria"]:checked');
    const categoriaGroup = form.querySelector('fieldset.checkbox-group');
    if (categorias.length === 0) {
        showGroupError(categoriaGroup, 'Selecciona al menos una categoría de interés.');
        valid = false;
    }

    const cliente = form.querySelector('input[name="cliente"]:checked');
    const clienteGroup = form.querySelectorAll('fieldset.checkbox-group')[1];
    if (!cliente) {
        showGroupError(clienteGroup, 'Selecciona el tipo de cliente.');
        valid = false;
    } else {
        clienteGroup.classList.add('campo-ok');
    }

    const terminos = form.querySelector('input[name="terminos"]');
    if (!terminos.checked) {
        showGroupError(terminos.closest('.checkbox-inline'), 'Debes aceptar los Términos y Condiciones.');
        valid = false;
    } else {
        terminos.closest('.checkbox-inline').classList.add('campo-ok');
    }

    const privacidad = form.querySelector('input[name="privacidad"]');
    if (!privacidad.checked) {
        showGroupError(privacidad.closest('.checkbox-inline'), 'Debes aceptar la Política de Privacidad.');
        valid = false;
    } else {
        privacidad.closest('.checkbox-inline').classList.add('campo-ok');
    }

    if (!valid) {
        event.preventDefault();
        const firstError = form.querySelector('.campo-error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    } else {
        event.preventDefault();
        showSuccessMessage();
    }
});

form.addEventListener('input', event => {
    const target = event.target;
    if (target instanceof Element) {
        removeFieldFeedback(target);
    }

    if (target.closest('.checkbox-inline') && target.checked) {
        const wrapper = target.closest('.checkbox-inline');
        removeFieldFeedback(wrapper);
    }
    if (target.closest('fieldset.checkbox-group') && target.checked) {
        const fieldset = target.closest('fieldset.checkbox-group');
        removeFieldFeedback(fieldset);
    }
    if (target === referenciaField) {
        updateCharCount();
    }
    if (target === passwordInput) {
        updatePasswordStrength();
    }
});

const editableFields = Array.from(form.querySelectorAll('input[name]:not([type="checkbox"]):not([type="radio"]), select[name], textarea[name]'));
editableFields.forEach(field => {
    field.addEventListener('blur', () => {
        removeFieldFeedback(field);
        validateField(field);
    });
});

const checkboxInputs = Array.from(form.querySelectorAll('input[type="checkbox"], input[type="radio"]'));
checkboxInputs.forEach(input => {
    input.addEventListener('change', () => {
        if (input.name === 'terminos' || input.name === 'privacidad') {
            const wrapper = input.closest('.checkbox-inline');
            if (wrapper) {
                removeFieldFeedback(wrapper);
                if (input.checked) wrapper.classList.add('campo-ok');
            }
        }
        if (input.name === 'categoria') {
            const fieldset = form.querySelector('fieldset.checkbox-group');
            removeFieldFeedback(fieldset);
            const checked = form.querySelectorAll('input[name="categoria"]:checked');
            if (checked.length > 0) fieldset.classList.add('campo-ok');
        }
        if (input.name === 'cliente') {
            const fieldset = form.querySelectorAll('fieldset.checkbox-group')[1];
            removeFieldFeedback(fieldset);
            if (form.querySelector('input[name="cliente"]:checked')) fieldset.classList.add('campo-ok');
        }
    });
});

referenciaField.addEventListener('input', updateCharCount);
passwordInput.addEventListener('input', updatePasswordStrength);
updateCharCount();
updatePasswordStrength();
