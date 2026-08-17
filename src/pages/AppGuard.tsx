import InstallButton from '../components/InstallButton';

export default function InstalarApp() {
  const userAgent = navigator.userAgent;

  const isAndroid = /Android/i.test(userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0f172a',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        textAlign: 'center',
        fontFamily: 'sans-serif'
      }}
    >
      <h1
        style={{
          fontSize: '26px',
          marginBottom: '12px'
        }}
      >
        Instalación requerida
      </h1>

      <p
        style={{
          color: '#94a3b8',
          maxWidth: '360px',
          marginBottom: '32px',
          fontSize: '15px'
        }}
      >
        Para acceder al sistema y utilizar todas las funciones,
        tenés que instalar esta aplicación.
      </p>

      {/* ANDROID */}
      {isAndroid && (
        <div
          style={{
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '340px',
            width: '100%',
            textAlign: 'left'
          }}
        >
          <p
            style={{
              margin: '0 0 16px 0',
              fontWeight: 'bold',
              color: '#38bdf8'
            }}
          >
            📱 Instalar en Android
          </p>

          <p
            style={{
              margin: '0 0 20px 0',
              color: '#cbd5e1',
              fontSize: '14px',
              lineHeight: '1.6'
            }}
          >
            Tocá el botón de abajo para instalar la aplicación
            directamente en tu teléfono.
          </p>

          <InstallButton />
        </div>
      )}

      {/* IPHONE / IPAD */}
      {isIOS && (
        <div
          style={{
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '340px',
            width: '100%',
            textAlign: 'left'
          }}
        >
          <p
            style={{
              margin: '0 0 16px 0',
              fontWeight: 'bold',
              color: '#38bdf8'
            }}
          >
            📱 Si estás en iPhone (iOS):
          </p>

          <ol
            style={{
              margin: 0,
              paddingLeft: '20px',
              color: '#cbd5e1',
              fontSize: '14px',
              lineHeight: '1.6'
            }}
          >
            <li>
              Tocá el botón de <b>Compartir</b>{' '}
              <span
                style={{
                  fontSize: '16px',
                  marginLeft: '4px'
                }}
              >
                📤
              </span>{' '}
              en la barra inferior de Safari.
            </li>

            <li>
              Buscá y seleccioná la opción{' '}
              <b>&quot;Agregar a inicio&quot;</b>.
            </li>

            <li>
              Tocá en <b>Agregar</b> arriba a la derecha.
              ¡Listo! Abrila desde el nuevo ícono en tu
              pantalla.
            </li>
          </ol>
        </div>
      )}

      {/* PC */}
      {!isAndroid && !isIOS && (
        <div
          style={{
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '340px',
            width: '100%',
            textAlign: 'left'
          }}
        >
          <p
            style={{
              margin: '0 0 16px 0',
              fontWeight: 'bold',
              color: '#38bdf8'
            }}
          >
            💻 Instalar en computadora
          </p>

          <ol
            style={{
              margin: 0,
              paddingLeft: '20px',
              color: '#cbd5e1',
              fontSize: '14px',
              lineHeight: '1.6'
            }}
          >
            <li>
              En Chrome o Edge, buscá el ícono de{' '}
              <b>Instalar</b> en la barra de direcciones.
            </li>

            <li>
              También podés abrir el menú del navegador y
              seleccionar <b>&quot;Instalar aplicación&quot;</b>.
            </li>

            <li>
              Confirmá la instalación y abrí la aplicación
              desde el nuevo acceso.
            </li>
          </ol>
        </div>
      )}
    </div>
  );
}