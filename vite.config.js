import {
  defineConfig,
  loadEnv
} from 'vite'

import react from '@vitejs/plugin-react'

import {
  runPublicAssistant
} from './server/publicAssistantCore.js'

import {
  createCommercialHandoff
} from './server/commercialHandoffCore.js'

function readJsonBody(req) {
  return new Promise(
    async (resolve, reject) => {
      try {
        let rawBody = ''

        for await (
          const chunk of req
        ) {
          rawBody += chunk
        }

        resolve(
          JSON.parse(
            rawBody || '{}'
          )
        )
      } catch (error) {
        reject(error)
      }
    }
  )
}

function sendJson(
  res,
  statusCode,
  payload
) {
  res.statusCode = statusCode

  res.setHeader(
    'Content-Type',
    'application/json; charset=utf-8'
  )

  res.end(
    JSON.stringify(payload)
  )
}

function localApis(mode) {
  const env = loadEnv(
    mode,
    process.cwd(),
    ''
  )

  return {
    name: 'ab-local-apis',

    configureServer(server) {
      /* =====================================================
         ASISTENTE PÚBLICO
      ===================================================== */

      server.middlewares.use(
        '/api/assistant',
        async (req, res) => {
          if (req.method !== 'POST') {
            sendJson(
              res,
              405,
              {
                error:
                  'Método no permitido'
              }
            )

            return
          }

          try {
            let body

            try {
              body =
                await readJsonBody(req)
            } catch {
              sendJson(
                res,
                400,
                {
                  error:
                    'JSON inválido'
                }
              )

              return
            }

            const message =
              body?.message?.trim()

            const history =
              Array.isArray(
                body?.history
              )
                ? body.history
                : []

            if (!message) {
              sendJson(
                res,
                400,
                {
                  error:
                    'Debes enviar un mensaje'
                }
              )

              return
            }

            const result =
              await runPublicAssistant({
                message,
                history,

                openaiApiKey:
                  env.OPENAI_API_KEY
              })

            sendJson(
              res,
              200,
              result
            )
          } catch (error) {
            console.error(
              'A&B Public Assistant local error:',
              error
            )

            sendJson(
              res,
              500,
              {
                error:
                  'No fue posible procesar la consulta con el Asistente A&B.',

                detail:
                  error?.message ||
                  'Error desconocido'
              }
            )
          }
        }
      )

      /* =====================================================
         DERIVACIÓN COMERCIAL
      ===================================================== */

      server.middlewares.use(
        '/api/commercial-handoff',
        async (req, res) => {
          if (req.method !== 'POST') {
            sendJson(
              res,
              405,
              {
                error:
                  'Método no permitido'
              }
            )

            return
          }

          try {
            let body

            try {
              body =
                await readJsonBody(req)
            } catch {
              sendJson(
                res,
                400,
                {
                  error:
                    'JSON inválido'
                }
              )

              return
            }

            const messages =
              Array.isArray(
                body?.messages
              )
                ? body.messages
                : []

            const lead =
              body?.lead &&
              typeof body.lead ===
                'object'
                ? body.lead
                : {}

            if (
              messages.length === 0
            ) {
              sendJson(
                res,
                400,
                {
                  error:
                    'No existe una conversación para derivar.'
                }
              )

              return
            }

            const result =
              await createCommercialHandoff({
                messages,
                lead,

                supabaseUrl:
                  env.SUPABASE_URL,

                supabaseSecretKey:
                  env.SUPABASE_SERVICE_ROLE_KEY
              })

            sendJson(
              res,
              200,
              result
            )
          } catch (error) {
            console.error(
              'A&B Commercial Handoff local error:',
              error
            )

            sendJson(
              res,
              500,
              {
                error:
                  'No fue posible derivar la conversación a un agente.',

                detail:
                  error?.message ||
                  'Error desconocido'
              }
            )
          }
        }
      )
    }
  }
}

export default defineConfig(
  ({ mode }) => ({
    plugins: [
      react(),
      localApis(mode)
    ]
  })
)