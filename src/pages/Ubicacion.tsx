import './Ubicacion.css'

function Ubicacion() {
  const googleMapsUrl = 'https://www.google.com/maps/place/UNIVERSAL+TORNILLOS+Y+FERRETER%C3%8DA+SAS/@4.6064187,-74.0957095,21z/data=!4m6!3m5!1s0x8e3f9914bb6ea08d:0xa36a815bd81441d!8m2!3d4.6064188!4d-74.0955485!16s%2Fg%2F11g01snfc2?hl=es&entry=ttu&g_ep=EgoyMDI1MDYzMC4wIKXMDSoASAFQAw%3D%3D'
  const wazeUrl = 'https://waze.com/ul?ll=4.6064188,-74.0955485&navigate=yes'
  return (
    <div className="ubicacion-container">
      <h1>¿Dónde estamos?</h1>
      <div className="mapa-container">
        <iframe
          title="Ubicación Universal Tornillos y Ferretería SAS"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.899837858964!2d-74.0957095!3d4.6064188!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9914bb6ea08d%3A0xa36a815bd81441d!2sUNIVERSAL%20TORNILLOS%20Y%20FERRETER%C3%8DA%20SAS!5e0!3m2!1ses-419!2sco!4v1718030000000!5m2!1ses-419!2sco"
          width="100%"
          height="350"
          style={{ border: 0, borderRadius: '12px' }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
      <div className="ubicacion-botones">
        <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="btn-maps">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="24" fill="#fff"/><path d="M24 8C16.268 8 10 14.268 10 22C10 32.5 24 44 24 44C24 44 38 32.5 38 22C38 14.268 31.732 8 24 8ZM24 27C21.2386 27 19 24.7614 19 22C19 19.2386 21.2386 17 24 17C26.7614 17 29 19.2386 29 22C29 24.7614 26.7614 27 24 27Z" fill="#4285F4"/><circle cx="24" cy="22" r="5" fill="#34A853"/><path d="M24 17C26.7614 17 29 19.2386 29 22C29 24.7614 26.7614 27 24 27V17Z" fill="#FBBC05"/><path d="M24 27C21.2386 27 19 24.7614 19 22C19 19.2386 21.2386 17 24 17V27Z" fill="#EA4335"/></svg>
          Abrir en Google Maps
        </a>
        <a href={wazeUrl} target="_blank" rel="noopener noreferrer" className="btn-waze">
          <svg viewBox="0 0 48 48" width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g>
              <ellipse cx="24" cy="24" rx="24" ry="24" fill="#fff"/>
              <path d="M36.5 32.5c1.5-2.2 2.5-5.1 2.5-8.1C39 16.8 32.2 11 24 11S9 16.8 9 24.4c0 3.7 1.7 7.1 4.5 9.5-.2.7-.5 1.7-.7 2.2-.2.5.2 1.1.8 1.1.6 0 2.2-.2 4.1-1.7 1.7.5 3.5.8 5.3.8 2.1 0 4.1-.3 6-.9 1.9 1.5 3.5 1.7 4.1 1.7.6 0 1-.6.8-1.1-.2-.5-.5-1.5-.7-2.2z" fill="#fff"/>
              <path d="M24 13c7.2 0 13 5.1 13 11.4 0 2.7-1.1 5.2-2.7 7.1-.2.2-.3.5-.2.8.2.6.5 1.6.7 2.2-1.1-.1-2.5-.5-3.7-1.5-.2-.2-.5-.2-.7-.1-1.8.6-3.7.9-5.6.9-1.7 0-3.4-.2-5-.7-.2-.1-.5 0-.7.1-1.2 1-2.6 1.4-3.7 1.5.2-.6.5-1.6.7-2.2.1-.3 0-.6-.2-.8-1.7-1.9-2.7-4.4-2.7-7.1C11 18.1 16.8 13 24 13z" fill="#05C3DD"/>
              <ellipse cx="18.5" cy="26.5" rx="1.5" ry="1.5" fill="#222"/>
              <ellipse cx="29.5" cy="26.5" rx="1.5" ry="1.5" fill="#222"/>
              <path d="M20 30c.7.6 2.2 1 4 1s3.3-.4 4-1" stroke="#222" strokeWidth="1.2" strokeLinecap="round"/>
            </g>
          </svg>
          Abrir en Waze
        </a>
      </div>
    </div>
  )
}
export default Ubicacion 