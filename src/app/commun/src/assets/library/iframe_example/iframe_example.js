let frame = document.getElementById('frame')
function openIframe() {
    frame.style.display = 'block'
}

addEventListener("message", (event) => {
    switch (event.data.type) {
        case 'content-loaded':
            console.log('cargó');
            break;
        case 'close':
            closeIframe()
            console.log('cierre');
            break;
        case 'complete':
            console.log('completado');
            break;
        case 'error':
            closeIframe()
            console.log('error');
            break;
    
        default:
            break;
    }
});

function closeIframe() {
    frame.style.display = 'none'
}