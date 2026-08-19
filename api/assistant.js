import {
  runPublicAssistant
} from '../server/publicAssistantCore.js'

export default async function handler(request) {
  if (request.method !== 'POST') {
    return Response.json(
      {
        error: 'Método no permitido'
      },
      {
        status: 405
      }
    )
  }

  try {
    const body =
      await request.json()

    const message =
      body?.message?.trim()

    const history =
      Array.isArray(body?.history)
        ? body.history
        : []

    if (!message) {
      return Response.json(
        {
          error:
            'Debes enviar un mensaje'
        },
        {
          status: 400
        }
      )
    }

    const result =
      await runPublicAssistant({
        message,
        history,
        openaiApiKey:
          process.env.OPENAI_API_KEY
      })

    return Response.json(
      result,
      {
        status: 200
      }
    )
  } catch (error) {
    console.error(
      'A&B Public Assistant API error:',
      error
    )

    return Response.json(
      {
        error:
          'No fue posible procesar la consulta con el Asistente A&B.',

        detail:
          process.env.NODE_ENV ===
          'development'
            ? error?.message
            : undefined
      },
      {
        status: 500
      }
    )
  }
}