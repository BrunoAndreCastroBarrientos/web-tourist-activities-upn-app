document.addEventListener('DOMContentLoaded', function() {
    console.log('🌍 TurisBooking - JavaScript cargado correctamente');
    
    inicializarTema();
    inicializarTamanoFuente();
    inicializarFiltroDestinos();
    inicializarContadores();
    inicializarNewsletter();
});


function inicializarTema() {
    const btnTema = document.getElementById('btn-tema');
    
    if (!btnTema) return;
    
    const temaGuardado = localStorage.getItem('tema');
    
    if (temaGuardado === 'oscuro') {
        document.body.classList.add('tema-oscuro');
        actualizarIconoTema(true);
    }
    
    btnTema.addEventListener('click', function() {
        const esOscuro = document.body.classList.toggle('tema-oscuro');
        
        localStorage.setItem('tema', esOscuro ? 'oscuro' : 'claro');
        
        actualizarIconoTema(esOscuro);
        
        console.log('Tema cambiado a:', esOscuro ? 'oscuro' : 'claro');
    });
}

function actualizarIconoTema(esOscuro) {
    const btnTema = document.getElementById('btn-tema');
    const icono = btnTema.querySelector('i');
    
    if (esOscuro) {
        icono.classList.remove('bi-moon-fill');
        icono.classList.add('bi-sun-fill');
    } else {
        icono.classList.remove('bi-sun-fill');
        icono.classList.add('bi-moon-fill');
    }
}

let tamanoFuenteActual = 16;

function inicializarTamanoFuente() {
    const btnAumentar = document.getElementById('btn-aumentar');
    const btnDisminuir = document.getElementById('btn-disminuir');
    
    if (!btnAumentar || !btnDisminuir) return;
    
    const tamanoGuardado = localStorage.getItem('tamanoFuente');
    if (tamanoGuardado) {
        tamanoFuenteActual = parseInt(tamanoGuardado);
        aplicarTamanoFuente();
    }
    
    btnAumentar.addEventListener('click', function() {
        if (tamanoFuenteActual < 24) {
            tamanoFuenteActual += 2;
            aplicarTamanoFuente();
            guardarTamanoFuente();
            console.log('Tamaño de fuente aumentado a:', tamanoFuenteActual + 'px');
        }
    });
    
    btnDisminuir.addEventListener('click', function() {
        if (tamanoFuenteActual > 12) {
            tamanoFuenteActual -= 2;
            aplicarTamanoFuente();
            guardarTamanoFuente();
            console.log('Tamaño de fuente disminuido a:', tamanoFuenteActual + 'px');
        }
    });
}

function aplicarTamanoFuente() {
    document.documentElement.style.setProperty('--tamano-fuente-base', tamanoFuenteActual + 'px');
    document.documentElement.style.fontSize = tamanoFuenteActual + 'px';
}

function guardarTamanoFuente() {
    localStorage.setItem('tamanoFuente', tamanoFuenteActual.toString());
}

function inicializarFiltroDestinos() {
    const botonesFiltroo = document.querySelectorAll('.btn-filtro');
    const tarjetasDestinos = document.querySelectorAll('.destino-card');
    const contadorDestinos = document.getElementById('contador-destinos');
    
    if (botonesFiltroo.length === 0 || tarjetasDestinos.length === 0) return;
    
    botonesFiltroo.forEach(function(boton) {
        boton.addEventListener('click', function() {
            const filtro = this.getAttribute('data-filtro');
            
            botonesFiltroo.forEach(btn => btn.classList.remove('active'));
            
            this.classList.add('active');
            
            let destinosVisibles = 0;
            
            tarjetasDestinos.forEach(function(tarjeta) {
                const categoria = tarjeta.getAttribute('data-categoria');
                
                if (filtro === 'todos' || categoria === filtro) {
                    tarjeta.classList.remove('oculto');
                    tarjeta.style.display = '';
                    destinosVisibles++;
                } else {
                    tarjeta.classList.add('oculto');
                    tarjeta.style.display = 'none';
                }
            });
            
            if (contadorDestinos) {
                contadorDestinos.textContent = destinosVisibles;
            }
            
            console.log('Filtro aplicado:', filtro, '- Destinos visibles:', destinosVisibles);
        });
    });
}

function inicializarContadores() {
    const contadores = document.querySelectorAll('.contador');
    
    if (contadores.length === 0) return;
    
    const opciones = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                animarContador(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, opciones);
    
    contadores.forEach(function(contador) {
        observer.observe(contador);
    });
}

function animarContador(elemento) {
    const objetivo = parseInt(elemento.getAttribute('data-objetivo'));
    const duracion = 2000;
    const incremento = objetivo / (duracion / 16);
    let valorActual = 0;
    
    function actualizar() {
        valorActual += incremento;
        
        if (valorActual < objetivo) {
            elemento.textContent = formatearNumero(Math.floor(valorActual));
            requestAnimationFrame(actualizar);
        } else {
            elemento.textContent = formatearNumero(objetivo);
        }
    }
    
    actualizar();
}

function formatearNumero(numero) {
    return numero.toLocaleString('es-MX');
}

function inicializarNewsletter() {
    const formNewsletter = document.getElementById('form-newsletter');
    const mensajeNewsletter = document.getElementById('mensaje-newsletter');
    
    if (!formNewsletter) return;
    
    formNewsletter.addEventListener('submit', function(evento) {
        evento.preventDefault();
        
        const inputEmail = this.querySelector('input[type="email"]');
        const email = inputEmail.value;
        
        if (validarEmail(email)) {
            mensajeNewsletter.textContent = '✅ ¡Gracias por suscribirte! Te enviaremos las mejores ofertas.';
            mensajeNewsletter.style.color = '#ffffff';
            
            inputEmail.value = '';
            
            console.log('Suscripción exitosa:', email);
        } else {
            mensajeNewsletter.textContent = '❌ Por favor ingresa un correo válido.';
            mensajeNewsletter.style.color = '#ffd700';
        }
        
        setTimeout(function() {
            mensajeNewsletter.textContent = '';
        }, 5000);
    });
}

function validarEmail(email) {
    const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return patron.test(email);
}

document.querySelectorAll('a[href^="#"]').forEach(function(link) {
    link.addEventListener('click', function(evento) {
        const destino = this.getAttribute('href');
        
        if (destino.length > 1) {
            evento.preventDefault();
            const elemento = document.querySelector(destino);
            
            if (elemento) {
                elemento.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
    }
});


function mostrarNotificacion(mensaje, tipo = 'info') {
    const notificacion = document.createElement('div');
    notificacion.className = `alert alert-${tipo} position-fixed`;
    notificacion.style.cssText = 'top: 100px; right: 20px; z-index: 9999; animation: fadeIn 0.3s ease;';
    notificacion.textContent = mensaje;
    
    document.body.appendChild(notificacion);
    
    setTimeout(function() {
        notificacion.remove();
    }, 3000);
}

window.exploraViajes = {
    mostrarNotificacion: mostrarNotificacion,
    formatearNumero: formatearNumero,
    validarEmail: validarEmail
};
