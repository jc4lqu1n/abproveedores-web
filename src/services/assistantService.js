export async function sendPublicAssistantMessage({
  message,
  history = []
}) {
  const response = await fetch(
    '/api/assistant',
    {
      method: 'POST',

      headers: {
        'Content-Type':
          'application/json'
      },

      body: JSON.stringify({
        message,
        history
      })
    }
  )

  const data =
    await response.json()

  if (!response.ok) {
    throw new Error(
      data?.detail ||
      data?.error ||
      'No fue posible contactar al Asistente A&B.'
    )
  }

  return data
}