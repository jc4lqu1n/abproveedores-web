import {
  createCommercialHandoff
} from '../server/commercialHandoffCore.js'

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

    const messages =
      Array.isArray(body?.messages)
        ? body.messages
        : []

    const lead =
      body?.lead &&
      typeof body.lead === 'object'
        ? body.lead
        : {}

    if (messages.length === 0) {
      return Response.json(
        {
          error:
            'No existe una conversación para derivar.'
        },
        {
          status: 400
        }
      )
    }

    const result =
      await createCommercialHandoff({
        messages,
        lead,

        supabaseUrl:
          process.env.SUPABASE_URL,

        supabaseSecretKey:
          process.env.SUPABASE_SERVICE_ROLE_KEY
      })

    return Response.json(
      result,
      {
        status: 200
      }
    )
  } catch (error) {
    console.error(
      'A&B Commercial Handoff API error:',
      error
    )

    return Response.json(
      {
        error:
          'No fue posible derivar la conversación a un agente.',

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