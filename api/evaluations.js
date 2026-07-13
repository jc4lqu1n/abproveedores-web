import { Resend } from 'resend';

const allowedServices = [
  'Infraestructura TI',
  'Redes y conectividad',
  'WiFi corporativo',
  'Microsoft 365',
  'Servidores',
  'Active Directory',
  'Cloud',
  'Ciberseguridad',
  'Respaldos',
  'Mesa de Ayuda',
  'Otro',
];

function createRequestId() {
  const year = new Date().getFullYear();
  const datePart = Date.now().toString().slice(-6);

  return `EV-${year}-${datePart}`;
}

function sanitize(value = '') {
  return String(value)
    .replace(/[<>]/g, '')
    .trim();
}

function validatePayload(payload) {
  const errors = [];

  if (!payload || typeof payload !== 'object') {
    return ['El cuerpo de la solicitud no es válido.'];
  }

  if (!payload.company?.trim()) {
    errors.push('La empresa es obligatoria.');
  }

  if (!payload.name?.trim()) {
    errors.push('El nombre es obligatorio.');
  }

  if (!payload.email?.trim()) {
    errors.push('El correo es obligatorio.');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    errors.push('El correo no es válido.');
  }

  if (!payload.phone?.trim()) {
    errors.push('El teléfono es obligatorio.');
  }

  if (!Array.isArray(payload.services) || payload.services.length === 0) {
    errors.push('Debe seleccionar al menos un servicio.');
  }

  if (
    Array.isArray(payload.services) &&
    payload.services.some(
      (service) => !allowedServices.includes(service),
    )
  ) {
    errors.push('Se detectó un servicio no válido.');
  }

  if (!payload.companySize?.trim()) {
    errors.push('El tamaño de la empresa es obligatorio.');
  }

  if (!payload.priority?.trim()) {
    errors.push('El objetivo de la evaluación es obligatorio.');
  }

  return errors;
}

function buildHtml(data, requestId) {
  const services = data.services
    .map((service) => `<li>${sanitize(service)}</li>`)
    .join('');

  return `
    <div style="font-family:Arial,sans-serif;max-width:720px;margin:auto;color:#172033">
      <div style="background:#0b2f59;padding:24px;border-radius:14px 14px 0 0;color:white">
        <h1 style="margin:0;font-size:24px">
          Nueva evaluación técnica
        </h1>

        <p style="margin:8px 0 0;color:#dbeafe">
          Código ${requestId}
        </p>
      </div>

      <div style="border:1px solid #dbe3ec;border-top:0;padding:24px;border-radius:0 0 14px 14px">
        <h2 style="font-size:18px">Datos del contacto</h2>

        <p><strong>Empresa:</strong> ${sanitize(data.company)}</p>
        <p><strong>Nombre:</strong> ${sanitize(data.name)}</p>
        <p><strong>Cargo:</strong> ${sanitize(
          data.role || 'No informado',
        )}</p>
        <p><strong>Correo:</strong> ${sanitize(data.email)}</p>
        <p><strong>Teléfono:</strong> ${sanitize(data.phone)}</p>

        <h2 style="font-size:18px;margin-top:26px">
          Alcance solicitado
        </h2>

        <ul>${services}</ul>

        <p>
          <strong>Tamaño de empresa:</strong>
          ${sanitize(data.companySize)}
        </p>

        <p>
          <strong>Objetivo:</strong>
          ${sanitize(data.priority)}
        </p>

        <h2 style="font-size:18px;margin-top:26px">
          Observaciones
        </h2>

        <p style="white-space:pre-line">
          ${sanitize(
            data.comments || 'Sin observaciones adicionales.',
          )}
        </p>
      </div>
    </div>
  `;
}

export function GET() {
  return Response.json(
    {
      ok: true,
      service: 'A&B Evaluaciones',
      status: 'operativo',
      emailConfigured: Boolean(process.env.RESEND_API_KEY),
    },
    {
      status: 200,
    },
  );
}

export async function POST(request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return Response.json(
        {
          ok: false,
          message:
            'El servicio de correo todavía no está configurado.',
        },
        {
          status: 503,
        },
      );
    }

    /*
     * Resend se instancia aquí, después de confirmar
     * que la variable de entorno existe.
     */
    const resend = new Resend(apiKey);

    let payload;

    try {
      payload = await request.json();
    } catch {
      return Response.json(
        {
          ok: false,
          message: 'El cuerpo de la solicitud no contiene JSON válido.',
        },
        {
          status: 400,
        },
      );
    }

    const validationErrors = validatePayload(payload);

    if (validationErrors.length > 0) {
      return Response.json(
        {
          ok: false,
          message: 'La solicitud contiene datos inválidos.',
          errors: validationErrors,
        },
        {
          status: 400,
        },
      );
    }

    const requestId = createRequestId();

    const { data, error } = await resend.emails.send({
      from: 'A&B Proveedores <contacto@abproveedoresi.cl>',
      to: ['contacto@abproveedoresi.cl'],
      replyTo: payload.email,
      subject: `Nueva evaluación técnica ${requestId}`,
      html: buildHtml(payload, requestId),
    });

    if (error) {
  console.error(
    'RESEND_ERROR:',
    JSON.stringify(error, null, 2),
  );

  return Response.json(
    {
      ok: false,
      message: 'No fue posible enviar la evaluación.',
      detail: error.message ?? 'Error del proveedor de correo.',
    },
    {
      status: 502,
    },
  );
}

    return Response.json(
      {
        ok: true,
        requestId,
        emailId: data?.id ?? null,
        message: 'La evaluación fue enviada correctamente.',
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error('Error inesperado:', error);

    return Response.json(
      {
        ok: false,
        message:
          'Ocurrió un error inesperado al procesar la solicitud.',
      },
      {
        status: 500,
      },
    );
  }
}