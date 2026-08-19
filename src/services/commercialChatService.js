export async function requestCommercialAgent({
  messages,
  lead = {}
}) {
  const response = await fetch(
    '/api/commercial-handoff',
    {
      method: 'POST',

      headers: {
        'Content-Type':
          'application/json'
      },

      body: JSON.stringify({
        messages,
        lead
      })
    }
  )

  let data

  try {
    data = await response.json()
  } catch {
    throw new Error(
      'El servidor devolvió una respuesta inválida.'
    )
  }

  if (!response.ok) {
    throw new Error(
      data?.detail ||
      data?.error ||
      'No fue posible solicitar un agente.'
    )
  }

  if (
    !data?.conversationId ||
    !data?.visitorToken
  ) {
    throw new Error(
      'No se recibió la identificación de la conversación.'
    )
  }

  return data
}