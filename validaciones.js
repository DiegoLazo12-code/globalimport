const form = document.querySelector('.register-form');
const referenciaField = form.querySelector('textarea[name="referencia"]');
const charCount = document.querySelector('.char-count');

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
    element.classList.add('input-error');
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
    groupElement.classList.add('checkbox-error');
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
    form.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    form.querySelectorAll('.checkbox-error').forEach(el => el.classList.remove('checkbox-error'));
    form.querySelectorAll('.error-message').forEach(el => el.remove());
}

function updateCharCount() {
    const value = referenciaField.value;
    charCount.textContent = value.length;
    if (value.length > 200) {
        referenciaField.classList.add('input-error');
    } else {
        referenciaField.classList.remove('input-error');
    }
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
    }

    const terminos = form.querySelector('input[name="terminos"]');
    if (!terminos.checked) {
        showGroupError(terminos.closest('.checkbox-inline'), 'Debes aceptar los Términos y Condiciones.');
        valid = false;
    }

    const privacidad = form.querySelector('input[name="privacidad"]');
    if (!privacidad.checked) {
        showGroupError(privacidad.closest('.checkbox-inline'), 'Debes aceptar la Política de Privacidad.');
        valid = false;
    }

    if (!valid) {
        event.preventDefault();
        const firstError = form.querySelector('.input-error, .checkbox-error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
});

form.addEventListener('input', event => {
    const target = event.target;
    if (target.classList.contains('input-error')) {
        target.classList.remove('input-error');
        const next = target.nextElementSibling;
        if (next && next.classList.contains('error-message')) {
            next.remove();
        }
    }
    if (target.closest('.checkbox-inline') && target.checked) {
        const wrapper = target.closest('.checkbox-inline');
        if (wrapper.classList.contains('checkbox-error')) {
            wrapper.classList.remove('checkbox-error');
            const next = wrapper.nextElementSibling;
            if (next && next.classList.contains('error-message')) next.remove();
        }
    }
    if (target.closest('fieldset.checkbox-group') && target.checked) {
        const fieldset = target.closest('fieldset.checkbox-group');
        if (fieldset.classList.contains('checkbox-error')) {
            fieldset.classList.remove('checkbox-error');
            const next = fieldset.nextElementSibling;
            if (next && next.classList.contains('error-message')) next.remove();
        }
    }
    if (target === referenciaField) {
        updateCharCount();
    }
});

referenciaField.addEventListener('input', updateCharCount);
updateCharCount();
