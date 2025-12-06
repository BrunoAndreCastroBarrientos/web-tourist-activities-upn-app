
document.addEventListener('DOMContentLoaded', function() {
    console.log('📊 Dashboard - Inicializando gráficos...');
    
    if (typeof dc === 'undefined' || typeof crossfilter === 'undefined') {
        console.error('Error: DC.js o Crossfilter no están cargados');
        return;
    }
    
    inicializarDashboard();
});

function generarDatosEjemplo() {
    const destinos = ['Cancún', 'París', 'Tokio', 'Maldivas', 'Suiza', 'Machu Picchu'];
    const tiposViaje = ['Playa', 'Ciudad', 'Aventura', 'Romance'];
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    const datos = [];
    
    for (let i = 1; i <= 150; i++) {
        const destino = destinos[Math.floor(Math.random() * destinos.length)];
        const tipo = tiposViaje[Math.floor(Math.random() * tiposViaje.length)];
        const mes = meses[Math.floor(Math.random() * meses.length)];
        const viajeros = Math.floor(Math.random() * 5) + 1; // 1-5 viajeros
        const precioBase = Math.floor(Math.random() * 2000) + 500; // $500-$2500
        
        datos.push({
            id: i,
            destino: destino,
            tipo: tipo,
            mes: mes,
            mesNumero: meses.indexOf(mes) + 1, // Para ordenar
            viajeros: viajeros,
            precio: precioBase,
            rangoPrecio: calcularRangoPrecio(precioBase)
        });
    }
    
    return datos;
}

function calcularRangoPrecio(precio) {
    if (precio < 800) return 'Económico ($500-$800)';
    if (precio < 1200) return 'Moderado ($800-$1200)';
    if (precio < 1800) return 'Premium ($1200-$1800)';
    return 'Lujo ($1800+)';
}

function inicializarDashboard() {
    const datos = generarDatosEjemplo();
    console.log('Datos generados:', datos.length, 'reservaciones');
    
    const cf = crossfilter(datos);
    
    const dimensionDestino = cf.dimension(function(d) { return d.destino; });
    
    const dimensionTipo = cf.dimension(function(d) { return d.tipo; });
    
    const dimensionMes = cf.dimension(function(d) { return d.mesNumero; });
    
    const dimensionPrecio = cf.dimension(function(d) { return d.rangoPrecio; });
    
    const grupoDestino = dimensionDestino.group().reduceCount();
    
    const grupoTipo = dimensionTipo.group().reduceCount();
    
    const grupoMes = dimensionMes.group().reduceCount();
    
    const grupoPrecio = dimensionPrecio.group().reduceCount();
    
    
    const chartDestinos = dc.barChart('#chart-destinos');
    
    chartDestinos
        .width(450)
        .height(250)
        .margins({top: 20, right: 20, bottom: 50, left: 40})
        .dimension(dimensionDestino)
        .group(grupoDestino)
        .x(d3.scaleBand())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .yAxisLabel('Reservaciones')
        .colors('#2c7a7b')
        .renderHorizontalGridLines(true)
        .on('filtered', actualizarResumen);
    
    chartDestinos.on('renderlet', function(chart) {
        chart.selectAll('g.x text')
            .attr('transform', 'rotate(-45)')
            .style('text-anchor', 'end');
    });
    
    const chartTipo = dc.pieChart('#chart-tipo-viaje');
    
    chartTipo
        .width(300)
        .height(250)
        .radius(100)
        .innerRadius(40) // Dona (donut chart)
        .dimension(dimensionTipo)
        .group(grupoTipo)
        .colors(d3.scaleOrdinal(['#2c7a7b', '#38b2ac', '#81e6d9', '#285e61']))
        .legend(dc.legend().x(10).y(10).itemHeight(13).gap(5))
        .label(function(d) {
            return d.key + ': ' + d.value;
        })
        .on('filtered', actualizarResumen);
    
    const chartMeses = dc.lineChart('#chart-meses');
    
    const nombresMeses = ['', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    chartMeses
        .width(650)
        .height(250)
        .margins({top: 20, right: 20, bottom: 30, left: 40})
        .dimension(dimensionMes)
        .group(grupoMes)
        .x(d3.scaleLinear().domain([1, 12]))
        .elasticY(true)
        .yAxisLabel('Reservaciones')
        .renderArea(true) // Área bajo la línea
        .renderDataPoints(true)
        .dotRadius(5)
        .colors('#2c7a7b')
        .renderHorizontalGridLines(true)
        .on('filtered', actualizarResumen);
    
    // Personalizamos el eje X para mostrar nombres de meses
    chartMeses.xAxis().tickFormat(function(d) {
        return nombresMeses[d] || '';
    });
    
    const chartPrecios = dc.rowChart('#chart-precios');
    
    chartPrecios
        .width(300)
        .height(250)
        .margins({top: 10, right: 10, bottom: 30, left: 10})
        .dimension(dimensionPrecio)
        .group(grupoPrecio)
        .elasticX(true)
        .colors(d3.scaleOrdinal(['#2c7a7b', '#38b2ac', '#81e6d9', '#285e61']))
        .label(function(d) {
            return d.key;
        })
        .on('filtered', actualizarResumen);
    
    dc.renderAll();
    
    actualizarResumen();
    actualizarTabla(cf, dimensionDestino);
    
    const btnReset = document.getElementById('btn-reset-filtros');
    if (btnReset) {
        btnReset.addEventListener('click', function() {
            dc.filterAll(); // Limpia todos los filtros
            dc.renderAll(); // Re-renderiza los gráficos
            actualizarResumen();
            actualizarTabla(cf, dimensionDestino);
            console.log('Filtros reiniciados');
        });
    }
    
    // Función para actualizar el resumen
    function actualizarResumen() {
        // Total de reservaciones (filtradas)
        const totalReservaciones = cf.groupAll().reduceCount().value();
        document.getElementById('total-reservaciones').textContent = totalReservaciones;
        
        // Ingresos totales (suma de precios)
        const ingresosTotales = cf.groupAll().reduceSum(function(d) { return d.precio; }).value();
        document.getElementById('ingresos-totales').textContent = '$' + ingresosTotales.toLocaleString('es-MX');
        
        // Destinos activos (con al menos una reservación)
        const destinosActivos = grupoDestino.all().filter(function(d) { return d.value > 0; }).length;
        document.getElementById('destinos-populares').textContent = destinosActivos;
        
        // Promedio de viajeros
        const sumViajeros = cf.groupAll().reduceSum(function(d) { return d.viajeros; }).value();
        const promedioViajeros = totalReservaciones > 0 ? (sumViajeros / totalReservaciones).toFixed(1) : 0;
        document.getElementById('promedio-viajeros').textContent = promedioViajeros;
        
        // Actualizamos la tabla
        actualizarTabla(cf, dimensionDestino);
    }
}

function actualizarTabla(cf, dimension) {
    const tbody = document.querySelector('#tabla-datos tbody');
    const contadorTabla = document.getElementById('contador-tabla');
    
    if (!tbody) return;
    
    const datosTabla = dimension.top(20);
    
    if (contadorTabla) {
        contadorTabla.textContent = dimension.top(Infinity).length;
    }
    
    tbody.innerHTML = '';
    
    datosTabla.forEach(function(d) {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${d.id}</td>
            <td>${d.destino}</td>
            <td><span class="badge bg-secondary">${d.tipo}</span></td>
            <td>${d.viajeros}</td>
            <td>$${d.precio.toLocaleString('es-MX')}</td>
            <td>${d.mes}</td>
        `;
        tbody.appendChild(fila);
    });
}


let timeoutResize;

window.addEventListener('resize', function() {
    clearTimeout(timeoutResize);
    timeoutResize = setTimeout(function() {
        dc.renderAll();
        console.log('Gráficos redimensionados');
    }, 250);
});


console.log(`
╔══════════════════════════════════════════╗
║     TurisBooking - DASHBOARD           ║
║     Proyecto Universitario               ║
║     Tecnologías: DC.js + Crossfilter     ║
╚══════════════════════════════════════════╝
`);
