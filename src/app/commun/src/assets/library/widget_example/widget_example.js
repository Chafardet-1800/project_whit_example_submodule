
function openWidget() {
    let button = document.getElementById('chinchin_widget')
    document.getElementById('widget_container')?.remove()
    let configuration = JSON.stringify({
        width: '80%',
        height: '80%',
        radius:0,
        url: 'https://sandbox-wod.pagochinchin.com/'
    })
    
    button?.setAttribute('configuration', configuration)
}

addEventListener("message", (event) => {
    switch (event.data.type) {
        case 'content-loaded':
            console.log('cargó');
            break;
        case 'close':
            closeWidget()
            console.log('cierre');
            break;
        case 'complete':
            console.log('completado');
            break;
        case 'error':
            closeWidget()
            console.log('error');
            break;
    
        default:
            break;
    }
});

function closeWidget() {
    document.getElementById('widget_container')?.remove()
}