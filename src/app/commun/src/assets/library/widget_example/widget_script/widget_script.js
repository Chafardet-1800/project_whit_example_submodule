/**
 * Tipos de eventos de ventana
 */
const windowEventTypes = {
    CLOSE: 'close',
    COMPLETE: 'complete',
    ERROR: 'error',
    LOADED: 'content-loaded'
}

  const widgetTag = 'chinchin-button'

  /**
   * Id de la etiqueta para controlar el widget
   */
  const widgetTagId = 'chinchin_widget'

  const element = document.getElementsByTagName(widgetTag)

  const sendMessageChinchin = () => {
      window.top.postMessage('close-widget-chinchin')
  }

  //* Escucho eventos del widger
  window.addEventListener('message', function(event){

    //* Me indica que ya cargó el iframe
    if(event.data?.type == windowEventTypes.LOADED){

      //* Spinner
      let spinner = document.getElementById('spinner')
      if(spinner) {
        spinner.className = 'hide_frame'
        spinner.hidden = true
      }

      //* Contenedor del iframe
      let frameContainer = document.getElementById('widget_container')
      if(frameContainer) {
        frameContainer.classList.remove('flex_centered')
      }

      //* Iframe
      let frame = document.getElementById('frame')
      if(frame) {
        frame.classList.remove('hide_frame')
      }
    }
  })

  addEventListener('click', (event) => {
    if (element[widgetTagId] && element[widgetTagId]?.attributes) {
      if(!element[widgetTagId].attributes['configuration']?.value || element[widgetTagId].attributes['configuration']?.value == '[object Object]'){
        return
      }

      // Variables de configuración del widget, como la url, las dimensiones, el border radius y el tipo de apertura (target)

      let configuration = JSON.parse(element[widgetTagId].attributes['configuration']?.value)
      //Url del sitio web que se verá en el iframe
      let url = configuration.url
      //Indican las dimensiones del iframe
      let width = configuration.width??60
      let height = configuration.height??80
      let radius = configuration.radius??10
      //Indica si se abrirá el widget en otra ventana
      let target = false
      if(configuration.target_blank != undefined) {
        target = JSON.parse(configuration.target_blank)
      } else {
        target = false
      }

      // Lógica para abrir el html del widget

      if(event.target == element[widgetTagId]) {
        if(!target) {
          document.body.insertAdjacentHTML('afterbegin', `
            <div id="widget_container" class="widget_container flex_centered">
              <div id="spinner">
                <svg class="widgetSpinner"  viewBox="25 25 50 50">
                  <circle r="20" cy="50" cx="50"></circle>
                </svg>
              </div>
              <iframe id="frame" class="frame hide_frame"  height="${height}" width="${width}" style="border-radius: ${radius}px;" allow="camera;geolocation" src="${url}"  allow-same-origin allowfullscreen></iframe>
            </div>
          `)
          // En caso de que se quiera abrir en otra ventana
        } else {
          const link = document.createElement('a');
          link.setAttribute('target', '_blank')
          link.href = `${url}`;
          link.click();
        }
      }
    }

  })
