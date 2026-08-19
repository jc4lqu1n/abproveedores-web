import {
  useEffect,
  useRef,
  useState
} from 'react'

import {
  ArrowUp,
  Bot,
  ClipboardCheck,
  Headphones,
  LifeBuoy,
  MessageCircle,
  X
} from 'lucide-react'

import botImage from '../../assets/bot.png'

import {
  sendPublicAssistantMessage
} from '../../services/assistantService'

import {
  requestCommercialAgent
} from '../../services/commercialChatService'

import './AssistantWidget.css'

const SERVICE_DESK_URL =
  'https://ab-servicedesk.vercel.app'

const STORAGE_MESSAGES =
  'ab_public_assistant_messages'

const STORAGE_CONVERSATION =
  'ab_public_commercial_conversation'

const initialMessage = {
  role: 'assistant',

  content:
    'Hola. Soy tu Asistente Técnico. Puedo orientarte sobre soporte TI, redes, infraestructura, servidores, ciberseguridad y nuestros servicios para empresas. ¿En qué podemos ayudarte?'
}

const initialSuggestions = [
  {
    label: 'Necesito soporte',
    icon: LifeBuoy
  },

  {
    label: 'Busco soporte para mi empresa',
    icon: Headphones
  },

  {
    label: 'Quiero evaluar un proyecto',
    icon: ClipboardCheck
  }
]

function AssistantWidget({
  onOpenEvaluation
}) {
  const [open, setOpen] =
    useState(false)

  const [message, setMessage] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  const [handoffLoading, setHandoffLoading] =
    useState(false)

  const [messages, setMessages] =
    useState(() =>
      loadStoredMessages()
    )

  const [conversation, setConversation] =
    useState(() =>
      loadStoredConversation()
    )

  const [actions, setActions] =
    useState({
      handoff: false,
      evaluation: false,
      serviceDesk: false
    })

  const [lead, setLead] =
    useState({
      name: null,
      company: null,
      email: null,
      phone: null,
      location: null,
      equipmentCount: null,
      need: null,
      preferredModality: null,
      urgency: null,
      summary: null
    })

  const messagesEndRef =
    useRef(null)

  const waitingAgent =
    conversation?.status ===
    'waiting_agent'

  const humanActive =
    conversation?.status ===
    'human_active'

  useEffect(() => {
    if (!open) {
      return
    }

    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    })
  }, [
    messages,
    loading,
    handoffLoading,
    open
  ])

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_MESSAGES,
        JSON.stringify(messages)
      )
    } catch (error) {
      console.warn(
        'No fue posible guardar el historial local:',
        error
      )
    }
  }, [messages])

  useEffect(() => {
    if (!conversation) {
      return
    }

    try {
      localStorage.setItem(
        STORAGE_CONVERSATION,
        JSON.stringify(conversation)
      )
    } catch (error) {
      console.warn(
        'No fue posible guardar la conversación local:',
        error
      )
    }
  }, [conversation])

  async function sendMessage(text) {
    const cleanMessage =
      String(text || '').trim()

    if (
      !cleanMessage ||
      loading ||
      handoffLoading ||
      waitingAgent ||
      humanActive
    ) {
      return
    }

    const userMessage = {
      role: 'user',
      content: cleanMessage
    }

    const previousMessages =
      messages

    setMessages([
      ...previousMessages,
      userMessage
    ])

    setMessage('')
    setLoading(true)

    try {
      const history =
        previousMessages
          .slice(-10)
          .map(item => ({
            role: item.role,
            content: item.content
          }))

      const data =
        await sendPublicAssistantMessage({
          message: cleanMessage,
          history
        })

      setMessages(current => [
        ...current,

        {
          role: 'assistant',

          content:
            data?.reply ||
            'No pude generar una respuesta.'
        }
      ])

      setActions({
        handoff:
          Boolean(
            data?.actions?.handoff
          ),

        evaluation:
          Boolean(
            data?.actions?.evaluation
          ),

        serviceDesk:
          Boolean(
            data?.actions?.serviceDesk
          )
      })

      if (data?.lead) {
        setLead(current => ({
          ...current,

          ...Object.fromEntries(
            Object.entries(data.lead).filter(
              ([, value]) =>
                value !== null &&
                value !== undefined &&
                value !== ''
            )
          )
        }))
      }

    } catch (error) {
      console.error(
        'Public Assistant error:',
        error
      )

      setMessages(current => [
        ...current,

        {
          role: 'assistant',

          content:
            'No pude procesar tu consulta en este momento. Puedes intentarlo nuevamente.'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(event) {
    event.preventDefault()

    sendMessage(message)
  }

  function handleEvaluation() {
    if (
      typeof onOpenEvaluation ===
      'function'
    ) {
      onOpenEvaluation()

      setOpen(false)

      return
    }

    const evaluationSection =
      document.querySelector(
        '#evaluacion'
      )

    if (evaluationSection) {
      evaluationSection.scrollIntoView({
        behavior: 'smooth'
      })

      setOpen(false)
    }
  }

  function handleServiceDesk() {
    window.open(
      SERVICE_DESK_URL,
      '_blank',
      'noopener,noreferrer'
    )
  }

  async function handleAgentRequest() {
    if (
      handoffLoading ||
      waitingAgent ||
      humanActive
    ) {
      return
    }

    setHandoffLoading(true)

    try {
      const result =
        await requestCommercialAgent({
          messages,

          lead: {
            ...lead,

            summary:
              lead.summary ||
              buildConversationSummary(
                messages
              )
          }
        })

      const nextConversation = {
        conversationId:
          result.conversationId,

        visitorToken:
          result.visitorToken,

        status:
          result.status ||
          'waiting_agent',

        createdAt:
          result.createdAt ||
          new Date().toISOString()
      }

      setConversation(
        nextConversation
      )

      setActions({
        handoff: false,
        evaluation: false,
        serviceDesk: false
      })

      setMessages(current => [
        ...current,

        {
          role: 'assistant',

          content:
            'Tu solicitud fue derivada correctamente a atención humana de A&B. La conversación quedó registrada y está esperando que un agente la tome. No tendrás que volver a explicar los antecedentes.'
        }
      ])
    } catch (error) {
      console.error(
        'Commercial handoff error:',
        error
      )

      setMessages(current => [
        ...current,

        {
          role: 'assistant',

          content:
            'No pude registrar la derivación en este momento. Puedes intentarlo nuevamente.'
        }
      ])
    } finally {
      setHandoffLoading(false)
    }
  }

  return (
    <>
      {open && (
        <section
          className="public-assistant-panel"
          aria-label="Asistente A&B"
        >
          <header className="public-assistant-header">
            <div className="public-assistant-brand">
              <img
                src={botImage}
                alt="Asistente A&B"
                className="public-assistant-avatar"
              />

              <div className="public-assistant-brand-copy">
                <strong>
                  {humanActive
                    ? 'Agente A&B'
                    : 'Asistente A&B'}
                </strong>

                <span>
                  {humanActive
                    ? 'Atención humana'
                    : waitingAgent
                      ? 'Esperando agente'
                      : 'Orientación y servicios TI'}
                </span>

                <small>
                  <i />

                  {humanActive
                    ? 'Agente conectado'
                    : waitingAgent
                      ? 'Solicitud registrada'
                      : 'En línea'}
                </small>
              </div>
            </div>

            <button
              type="button"
              className="public-assistant-close"
              onClick={() =>
                setOpen(false)
              }
              aria-label="Cerrar asistente"
            >
              <X size={18} />
            </button>
          </header>

          <div className="public-assistant-messages">
            {messages.map(
              (item, index) => {
                const isUser =
                  item.role === 'user'

                return (
                  <div
                    key={`${item.role}-${index}`}
                    className={
                      isUser
                        ? 'public-assistant-row user'
                        : 'public-assistant-row assistant'
                    }
                  >
                    {!isUser && (
                      <img
                        src={botImage}
                        alt=""
                        className="public-assistant-message-avatar"
                      />
                    )}

                    <div
                      className={
                        isUser
                          ? 'public-assistant-message user'
                          : 'public-assistant-message assistant'
                      }
                    >
                      {item.content}
                    </div>

                    {isUser && (
                      <div className="public-assistant-user-avatar">
                        <MessageCircle
                          size={15}
                        />
                      </div>
                    )}
                  </div>
                )
              }
            )}

            {loading && (
              <div className="public-assistant-row assistant">
                <img
                  src={botImage}
                  alt=""
                  className="public-assistant-message-avatar"
                />

                <div className="public-assistant-message assistant">
                  <span className="public-assistant-thinking">
                    Analizando tu consulta

                    <span className="public-assistant-dots">
                      ...
                    </span>
                  </span>
                </div>
              </div>
            )}

            {handoffLoading && (
              <div className="public-assistant-row assistant">
                <img
                  src={botImage}
                  alt=""
                  className="public-assistant-message-avatar"
                />

                <div className="public-assistant-message assistant">
                  <span className="public-assistant-thinking">
                    Registrando la derivación

                    <span className="public-assistant-dots">
                      ...
                    </span>
                  </span>
                </div>
              </div>
            )}

            <div
              ref={messagesEndRef}
            />
          </div>

          {messages.length === 1 &&
            !waitingAgent &&
            !humanActive && (
              <div className="public-assistant-suggestions">
                {initialSuggestions.map(
                  suggestion => {
                    const Icon =
                      suggestion.icon

                    return (
                      <button
                        key={
                          suggestion.label
                        }
                        type="button"
                        onClick={() =>
                          sendMessage(
                            suggestion.label
                          )
                        }
                        disabled={
                          loading ||
                          handoffLoading
                        }
                      >
                        <Icon size={17} />

                        <span>
                          {suggestion.label}
                        </span>
                      </button>
                    )
                  }
                )}
              </div>
            )}

          {(actions.handoff ||
            actions.evaluation ||
            actions.serviceDesk) &&
            !waitingAgent &&
            !humanActive && (
              <div className="public-assistant-actions">
                {actions.handoff && (
                  <button
                    type="button"
                    className="agent"
                    onClick={
                      handleAgentRequest
                    }
                    disabled={
                      handoffLoading
                    }
                  >
                    <Headphones
                      size={17}
                    />

                    {handoffLoading
                      ? 'Derivando...'
                      : 'Solicitar agente'}
                  </button>
                )}

                {actions.evaluation && (
                  <button
                    type="button"
                    onClick={
                      handleEvaluation
                    }
                  >
                    <ClipboardCheck
                      size={17}
                    />

                    Solicitar evaluación
                  </button>
                )}

                {actions.serviceDesk && (
                  <button
                    type="button"
                    onClick={
                      handleServiceDesk
                    }
                  >
                    <LifeBuoy
                      size={17}
                    />

                    Ir a ServiceDesk
                  </button>
                )}
              </div>
            )}

          {waitingAgent && (
            <div className="public-assistant-actions">
              <div className="public-assistant-waiting">
                <Headphones
                  size={16}
                />

                <span>
                  Esperando que un agente de A&B tome la conversación.
                </span>
              </div>
            </div>
          )}

          <form
            className="public-assistant-form"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              value={message}
              onChange={event =>
                setMessage(
                  event.target.value
                )
              }
              placeholder={
                waitingAgent
                  ? 'Esperando agente...'
                  : humanActive
                    ? 'Atención humana activa'
                    : 'Escribe tu consulta...'
              }
              disabled={
                loading ||
                handoffLoading ||
                waitingAgent ||
                humanActive
              }
              autoComplete="off"
            />

            <button
              type="submit"
              disabled={
                loading ||
                handoffLoading ||
                waitingAgent ||
                humanActive ||
                !message.trim()
              }
              aria-label="Enviar mensaje"
            >
              <ArrowUp size={19} />
            </button>
          </form>

          <footer className="public-assistant-footer">
            <Bot size={11} />

            {humanActive
              ? 'A&B · Atención humana'
              : waitingAgent
                ? 'A&B · Esperando agente'
                : 'IA de A&B · Atención comercial'}
          </footer>
        </section>
      )}

      <button
        type="button"
        className={
          open
            ? 'public-assistant-launcher open'
            : 'public-assistant-launcher'
        }
        onClick={() =>
          setOpen(current => !current)
        }
        aria-label={
          open
            ? 'Cerrar Asistente A&B'
            : 'Abrir Asistente A&B'
        }
      >
        <span className="public-assistant-launcher-avatar">
          <img
            src={botImage}
            alt=""
          />
        </span>

        {!open && (
          <span className="public-assistant-launcher-copy">
            <strong>
              Asistente A&B
            </strong>

            <small>
              {waitingAgent
                ? 'Esperando agente'
                : '¿En qué te ayudamos?'}
            </small>
          </span>
        )}
      </button>
    </>
  )
}

function loadStoredMessages() {
  try {
    const stored =
      localStorage.getItem(
        STORAGE_MESSAGES
      )

    if (!stored) {
      return [
        initialMessage
      ]
    }

    const parsed =
      JSON.parse(stored)

    if (
      !Array.isArray(parsed) ||
      parsed.length === 0
    ) {
      return [
        initialMessage
      ]
    }

    return parsed
  } catch {
    return [
      initialMessage
    ]
  }
}

function loadStoredConversation() {
  try {
    const stored =
      localStorage.getItem(
        STORAGE_CONVERSATION
      )

    if (!stored) {
      return null
    }

    const parsed =
      JSON.parse(stored)

    if (
      !parsed?.conversationId ||
      !parsed?.visitorToken
    ) {
      return null
    }

    return parsed
  } catch {
    return null
  }
}

function buildConversationSummary(
  messages
) {
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
      .filter(Boolean)

  if (
    userMessages.length === 0
  ) {
    return (
      'Solicitud comercial iniciada desde la página web de A&B.'
    )
  }

  return userMessages
    .slice(-10)
    .join('\n')
    .slice(0, 3000)
}

export default AssistantWidget;