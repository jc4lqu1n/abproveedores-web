import {
  createClient
} from '@supabase/supabase-js'

function createAdminClient({
  supabaseUrl,
  supabaseSecretKey
}) {
  if (!supabaseUrl) {
    throw new Error(
      'SUPABASE_URL no está configurada.'
    )
  }

  if (!supabaseSecretKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY no está configurada.'
    )
  }

  return createClient(
    supabaseUrl,
    supabaseSecretKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    }
  )
}

function cleanMessages(messages) {
  if (!Array.isArray(messages)) {
    return []
  }

  return messages
    .filter(
      item =>
        item &&
        ['user', 'assistant'].includes(
          item.role
        ) &&
        typeof item.content === 'string'
    )
    .map(item => ({
      role: item.role,
      content:
        item.content.trim()
    }))
    .filter(
      item =>
        item.content.length > 0
    )
    .slice(-40)
}

function buildFallbackSummary(messages) {
  const userMessages =
    messages
      .filter(
        item =>
          item.role === 'user'
      )
      .map(
        item =>
          item.content
      )

  if (
    userMessages.length === 0
  ) {
    return (
      'Solicitud de atención comercial iniciada desde la página web.'
    )
  }

  return userMessages
    .slice(-8)
    .join('\n')
    .slice(0, 3000)
}

export async function createCommercialHandoff({
  messages,
  lead = {},
  supabaseUrl,
  supabaseSecretKey
}) {
  const cleanHistory =
    cleanMessages(messages)

  if (
    cleanHistory.length === 0
  ) {
    throw new Error(
      'No existe una conversación para derivar.'
    )
  }

  const supabase =
    createAdminClient({
      supabaseUrl,
      supabaseSecretKey
    })

  const visitorToken =
    crypto.randomUUID()

  const summary =
    String(
      lead?.summary ||
      buildFallbackSummary(
        cleanHistory
      )
    ).trim()

  const {
    data: conversation,
    error: conversationError
  } = await supabase
    .from(
      'commercial_conversations'
    )
    .insert({
      visitor_token:
        visitorToken,

      visitor_name:
        lead?.name || null,

      visitor_email:
        lead?.email || null,

      visitor_phone:
        lead?.phone || null,

      company_name:
        lead?.company || null,

      status:
        'waiting_agent',

      source:
        'website',

      summary
    })
    .select(
      `
        id,
        visitor_token,
        status,
        created_at
      `
    )
    .single()

  if (conversationError) {
    throw new Error(
      `No fue posible crear la conversación comercial: ${conversationError.message}`
    )
  }

  const messageRows =
    cleanHistory.map(
      item => ({
        conversation_id:
          conversation.id,

        sender_type:
          item.role === 'user'
            ? 'visitor'
            : 'assistant',

        sender_id:
          null,

        content:
          item.content
      })
    )

  const {
    error: messagesError
  } = await supabase
    .from(
      'commercial_messages'
    )
    .insert(
      messageRows
    )

  if (messagesError) {
    await supabase
      .from(
        'commercial_conversations'
      )
      .delete()
      .eq(
        'id',
        conversation.id
      )

    throw new Error(
      `No fue posible guardar el historial: ${messagesError.message}`
    )
  }

  return {
    conversationId:
      conversation.id,

    visitorToken:
      conversation.visitor_token,

    status:
      conversation.status,

    createdAt:
      conversation.created_at
  }
}