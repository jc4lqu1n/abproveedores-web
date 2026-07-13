import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp } from "react-icons/fa";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Cloud,
  Database,
  FileText,
  GitBranch,
  Headphones,
  HeartPulse,
  Layers3,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Network,
  Phone,
  Server,
  ShieldCheck,
  Stethoscope,
  Wrench,
  X,
} from 'lucide-react';

import EvaluationModal from './components/EvaluationModal/EvaluationModal';

const SERVICE_DESK_URL = 'https://ab-servicedesk.vercel.app';

const services = [
  {
    icon: Server,
    title: 'Infraestructura TI',
    description:
      'Implementación, administración y mantenimiento de servidores, estaciones de trabajo y plataformas empresariales.',
    items: [
      'Servidores físicos y virtuales',
      'Active Directory',
      'Respaldos y continuidad',
    ],
  },
  {
    icon: Network,
    title: 'Redes y conectividad',
    description:
      'Diseño y optimización de redes corporativas seguras, estables y preparadas para crecer.',
    items: [
      'Cableado y puntos de red',
      'WiFi corporativo',
      'VPN y acceso remoto',
    ],
  },
  {
    icon: ShieldCheck,
    title: 'Ciberseguridad',
    description:
      'Protección de infraestructura, usuarios y datos mediante controles de seguridad administrados.',
    items: [
      'Firewall y antivirus',
      'Control de accesos',
      'Políticas de seguridad',
    ],
  },
  {
    icon: Cloud,
    title: 'Cloud y Microsoft 365',
    description:
      'Migración, configuración y soporte de servicios cloud, colaboración y correo corporativo.',
    items: [
      'Microsoft 365',
      'AWS, Azure y OCI',
      'Correo y colaboración',
    ],
  },
  {
    icon: Database,
    title: 'Datos y respaldos',
    description:
      'Protección y disponibilidad de información crítica mediante respaldos y recuperación controlada.',
    items: [
      'NAS y repositorios',
      'Copias automatizadas',
      'Recuperación de información',
    ],
  },
  {
    icon: Headphones,
    title: 'Soporte administrado',
    description:
      'Atención técnica presencial y remota, con registro, seguimiento y priorización de requerimientos.',
    items: [
      'Mesa de ayuda',
      'Soporte a usuarios',
      'Mantenimiento preventivo',
    ],
  },
];

const sectors = [
  {
    icon: HeartPulse,
    title: 'Clínicas y centros médicos',
    description:
      'Continuidad operativa, conectividad, equipos clínicos, estaciones de trabajo y protección de datos.',
  },
  {
    icon: Building2,
    title: 'Notarías y oficinas jurídicas',
    description:
      'Servidores, sistemas notariales, impresoras, seguridad, respaldos y soporte especializado.',
  },
  {
    icon: Stethoscope,
    title: 'Empresas y organizaciones',
    description:
      'Administración integral de infraestructura, usuarios, redes, plataformas cloud y seguridad.',
  },
];

const metrics = [
  {
    value: '+120',
    label: 'equipos implementados',
  },
  {
    value: '+100',
    label: 'puntos de red administrados',
  },
  {
    value: '24/7',
    label: 'registro de solicitudes',
  },
  {
    value: '100%',
    label: 'seguimiento de tickets',
  },
];

const technologies = [
  'Microsoft 365',
  'AWS',
  'Oracle Cloud',
  'Fortinet',
  'Ubiquiti',
  'HP',
  'Proxmox',
  'Windows Server',
];

const integrationAreas = [
  {
    icon: Server,
    title: 'Infraestructura',
    description:
      'Servidores, estaciones de trabajo y virtualización.',
  },
  {
    icon: Network,
    title: 'Conectividad',
    description:
      'Redes corporativas, WiFi, VPN y acceso remoto.',
  },
  {
    icon: Cloud,
    title: 'Cloud',
    description:
      'Microsoft 365, AWS, OCI y servicios empresariales.',
  },
  {
    icon: ShieldCheck,
    title: 'Seguridad',
    description:
      'Firewall, antivirus, accesos y políticas de protección.',
  },
  {
    icon: Headphones,
    title: 'Soporte',
    description:
      'Mesa de ayuda, seguimiento y continuidad operacional.',
  },
];

const implementationCases = [
  {
    icon: HeartPulse,
    sector: 'Sector salud',
    title: 'Modernización de infraestructura clínica',
    description:
      'Implementación y ordenamiento de red, estaciones de trabajo, servidores, políticas de acceso y soporte operacional.',
    achievements: [
      'Administración de estaciones de trabajo',
      'Infraestructura de red corporativa',
      'Control de usuarios y permisos',
      'Respaldos y continuidad',
      'Soporte técnico especializado',
    ],
  },
  {
    icon: Building2,
    sector: 'Sector jurídico',
    title: 'Migración tecnológica para operación notarial',
    description:
      'Preparación de infraestructura, conectividad, servidores, sistemas internos y equipos para una operación crítica.',
    achievements: [
      'Migración de estaciones de trabajo',
      'Servidores y virtualización',
      'Redes y conectividad',
      'Sistemas y bases de datos',
      'Soporte presencial y remoto',
    ],
  },
  {
    icon: Layers3,
    sector: 'Empresas',
    title: 'Soporte tecnológico administrado',
    description:
      'Gestión integral de requerimientos, infraestructura, seguridad y continuidad para organizaciones en crecimiento.',
    achievements: [
      'Mesa de ayuda centralizada',
      'Mantenimiento preventivo',
      'Gestión de Microsoft 365',
      'Seguridad de usuarios',
      'Documentación técnica',
    ],
  },
];

const workProcess = [
  {
    icon: ClipboardCheck,
    number: '01',
    title: 'Evaluación',
    description:
      'Revisamos la necesidad, el entorno actual, los riesgos y las prioridades de la organización.',
  },
  {
    icon: FileText,
    number: '02',
    title: 'Propuesta técnica',
    description:
      'Definimos alcance, solución recomendada, costos, tiempos y responsabilidades del proyecto.',
  },
  {
    icon: Wrench,
    number: '03',
    title: 'Implementación',
    description:
      'Ejecutamos los trabajos de forma controlada, minimizando el impacto sobre la operación.',
  },
  {
    icon: CheckCircle2,
    number: '04',
    title: 'Validación',
    description:
      'Comprobamos funcionamiento, seguridad, conectividad y cumplimiento del alcance acordado.',
  },
  {
    icon: Headphones,
    number: '05',
    title: 'Soporte',
    description:
      'Documentamos la solución y mantenemos seguimiento presencial o remoto según el servicio.',
  },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [evaluationOpen, setEvaluationOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const openEvaluation = () => {
    setEvaluationOpen(true);
  };

  return (
    <div className="site">
      <div className="background-grid" aria-hidden="true" />
      <div
        className="background-glow glow-one"
        aria-hidden="true"
      />
      <div
        className="background-glow glow-two"
        aria-hidden="true"
      />

      <header className="navbar">
        <a
          className="brand"
          href="#inicio"
          onClick={closeMenu}
          aria-label="Ir al inicio de A&B Proveedores Integrales SpA"
        >
          <img
            className="brand-logo"
            src="/images/logo-ab.png"
            alt="A&B Proveedores Integrales SpA"
          />

          <div className="brand-copy">
            <strong>A&B Proveedores Integrales SpA</strong>
            <span>
              Ingeniería en Infraestructura Tecnológica
            </span>
          </div>
        </a>

        <button
          className="menu-button"
          type="button"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          onClick={() =>
            setMenuOpen((currentValue) => !currentValue)
          }
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        <nav
          id="main-navigation"
          className={`nav-links ${
            menuOpen ? 'nav-links-open' : ''
          }`}
        >
          <a href="#inicio" onClick={closeMenu}>
            Inicio
          </a>

          <a href="#servicios" onClick={closeMenu}>
            Servicios
          </a>

          <a href="#soluciones" onClick={closeMenu}>
            Soluciones
          </a>

          <a href="#empresa" onClick={closeMenu}>
            Empresa
          </a>

          <a href="#contacto" onClick={closeMenu}>
            Contacto
          </a>

          <a
            className="nav-support"
            href="#acceso-soporte"
            onClick={closeMenu}
          >
            Soporte y Evaluación
          </a>
        </nav>
      </header>

      <main>
        <section className="hero section" id="inicio">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75 }}
          >
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              Ingeniería en infraestructura tecnológica
            </div>

            <h1>
              Protegemos la infraestructura
              <span>
                {' '}
                que mantiene su negocio funcionando.
              </span>
            </h1>

            <p className="hero-description">
              Diseñamos, implementamos y administramos
              infraestructura TI, redes, servidores, cloud y
              ciberseguridad para clínicas, notarías y empresas que
              necesitan continuidad operacional.
            </p>

            <div className="hero-specialties">
              <span>Infraestructura TI</span>
              <span>Cloud</span>
              <span>Ciberseguridad</span>
              <span>Soporte administrado</span>
            </div>

            <div className="hero-actions">
              <button
                className="button button-primary"
                type="button"
                onClick={openEvaluation}
              >
                Solicitar evaluación
                <ArrowRight size={19} />
              </button>

              <a
                className="button button-secondary"
                href="#acceso-soporte"
              >
                <Headphones size={20} />
                Soporte y Mesa de Ayuda
              </a>
            </div>

            <div className="hero-trust">
              <div>
                <CheckCircle2 size={18} />
                Atención presencial y remota
              </div>

              <div>
                <CheckCircle2 size={18} />
                Soluciones diseñadas a medida
              </div>

              <div>
                <CheckCircle2 size={18} />
                Seguimiento documentado
              </div>
            </div>
          </motion.div>

          <motion.div
            className="hero-panel ecosystem-panel"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <div className="panel-header">
              <div>
                <span className="panel-status" />
                Ecosistema tecnológico
              </div>

              <span>A&B Proveedores Integrales</span>
            </div>

            <div className="ecosystem-visual">
              <div className="ecosystem-orbit orbit-one" />
              <div className="ecosystem-orbit orbit-two" />

              <div className="visual-core">
                <ShieldCheck size={42} />
                <strong>A&B</strong>
                <span>Operación protegida</span>
              </div>

              <div className="visual-node ecosystem-node node-cloud">
                <Cloud size={22} />

                <div>
                  <strong>Cloud</strong>
                  <span>AWS · OCI · Microsoft 365</span>
                </div>
              </div>

              <div className="visual-node ecosystem-node node-servers">
                <Server size={22} />

                <div>
                  <strong>Servidores</strong>
                  <span>Windows · Virtualización</span>
                </div>
              </div>

              <div className="visual-node ecosystem-node node-security">
                <ShieldCheck size={22} />

                <div>
                  <strong>Seguridad</strong>
                  <span>Firewall · VPN · Antivirus</span>
                </div>
              </div>

              <div className="visual-node ecosystem-node node-network">
                <Network size={22} />

                <div>
                  <strong>Conectividad</strong>
                  <span>Redes · WiFi · Monitoreo</span>
                </div>
              </div>
            </div>

            <div className="panel-bottom">
              <div>
                <span>Infraestructura</span>
                <strong>Administrada</strong>
              </div>

              <div>
                <span>Seguridad</span>
                <strong>Supervisada</strong>
              </div>

              <div>
                <span>Soporte</span>
                <strong>Centralizado</strong>
              </div>
            </div>
          </motion.div>
        </section>

        <section
          className="technology-strip section"
          aria-label="Tecnologías con las que trabajamos"
        >
          <p>Tecnologías con las que trabajamos</p>

          <div className="technology-list">
            {technologies.map((technology) => (
              <span key={technology}>{technology}</span>
            ))}
          </div>
        </section>

        <section className="integration-section section">
          <div className="section-heading">
            <span>Arquitectura tecnológica integrada</span>

            <h2>
              Cada servicio forma parte de una operación conectada.
            </h2>

            <p>
              Infraestructura, redes, cloud, seguridad y soporte deben
              trabajar como un solo sistema. A&B integra estas áreas
              para reducir interrupciones y simplificar la
              administración tecnológica.
            </p>
          </div>

          <div className="integration-flow">
            <div
              className="integration-line"
              aria-hidden="true"
            />

            {integrationAreas.map((area, index) => {
              const Icon = area.icon;

              return (
                <motion.article
                  className="integration-item"
                  key={area.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{
                    once: true,
                    amount: 0.25,
                  }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.08,
                  }}
                >
                  <div className="integration-icon">
                    <Icon size={25} />
                  </div>

                  <span className="integration-number">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <h3>{area.title}</h3>
                  <p>{area.description}</p>
                </motion.article>
              );
            })}
          </div>

          <div className="integration-result">
            <GitBranch size={25} />

            <div>
              <span>Resultado</span>

              <strong>
                Una operación tecnológica centralizada y
                administrable.
              </strong>
            </div>
          </div>
        </section>

        <section className="metrics section">
          {metrics.map((metric) => (
            <article
              className="metric-card"
              key={metric.label}
            >
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </article>
          ))}
        </section>

        <section
          className="content-section section"
          id="servicios"
        >
          <div className="section-heading">
            <span>Servicios tecnológicos</span>

            <h2>
              Una sola empresa para administrar todo su entorno TI.
            </h2>

            <p>
              Cubrimos desde la atención diaria de usuarios hasta la
              implementación de infraestructura crítica, seguridad y
              continuidad operacional.
            </p>
          </div>

          <div className="services-grid">
            {services.map((service, index) => {
              const Icon = service.icon;

              return (
                <motion.article
                  className="service-card"
                  key={service.title}
                  initial={{
                    opacity: 0,
                    y: 24,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.06,
                  }}
                >
                  <div className="service-icon">
                    <Icon size={27} />
                  </div>

                  <h3>{service.title}</h3>
                  <p>{service.description}</p>

                  <ul>
                    {service.items.map((item) => (
                      <li key={item}>
                        <CheckCircle2 size={16} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.article>
              );
            })}
          </div>
        </section>

        <section className="cases-section">
          <div className="section cases-inner">
            <div className="section-heading">
              <span>Experiencia aplicada</span>

              <h2>
                Soluciones implementadas en entornos reales.
              </h2>

              <p>
                Trabajamos sobre necesidades concretas: continuidad
                operacional, conectividad, seguridad, equipos,
                servidores y soporte especializado.
              </p>
            </div>

            <div className="cases-grid">
              {implementationCases.map(
                (caseItem, index) => {
                  const Icon = caseItem.icon;

                  return (
                    <motion.article
                      className="case-card"
                      key={caseItem.title}
                      initial={{ opacity: 0, y: 26 }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      viewport={{
                        once: true,
                        amount: 0.2,
                      }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.08,
                      }}
                    >
                      <div className="case-top">
                        <div className="case-icon">
                          <Icon size={27} />
                        </div>

                        <span>{caseItem.sector}</span>
                      </div>

                      <h3>{caseItem.title}</h3>
                      <p>{caseItem.description}</p>

                      <ul>
                        {caseItem.achievements.map(
                          (achievement) => (
                            <li key={achievement}>
                              <CheckCircle2 size={16} />
                              {achievement}
                            </li>
                          ),
                        )}
                      </ul>
                    </motion.article>
                  );
                },
              )}
            </div>
          </div>
        </section>

        <section
          className="process-section section"
          id="proceso"
        >
          <div className="section-heading">
            <span>Nuestra metodología</span>

            <h2>
              Un proceso claro desde el diagnóstico hasta el soporte.
            </h2>

            <p>
              Cada proyecto se desarrolla con alcance definido,
              validación técnica y seguimiento. Así reducimos
              improvisaciones y mantenemos la operación bajo control.
            </p>
          </div>

          <div className="process-grid">
            <div
              className="process-connector"
              aria-hidden="true"
            />

            {workProcess.map((processItem, index) => {
              const Icon = processItem.icon;

              return (
                <motion.article
                  className="process-card"
                  key={processItem.number}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{
                    once: true,
                    amount: 0.25,
                  }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.08,
                  }}
                >
                  <div className="process-card-top">
                    <div className="process-icon">
                      <Icon size={24} />
                    </div>

                    <span>{processItem.number}</span>
                  </div>

                  <h3>{processItem.title}</h3>
                  <p>{processItem.description}</p>
                </motion.article>
              );
            })}
          </div>

          <div className="process-cta">
            <div>
              <span>Primer paso</span>

              <strong>
                Solicite una evaluación técnica inicial.
              </strong>
            </div>

            <button
              className="button button-primary"
              type="button"
              onClick={openEvaluation}
            >
              Comenzar evaluación
              <ArrowRight size={19} />
            </button>
          </div>
        </section>

        <section
          className="solutions-section"
          id="soluciones"
        >
          <div className="section solutions-inner">
            <div className="section-heading section-heading-left">
              <span>Soluciones por industria</span>

              <h2>
                Conocemos los entornos donde una interrupción sí
                importa.
              </h2>

              <p>
                Trabajamos con organizaciones que necesitan
                estabilidad, trazabilidad, protección de datos y
                respuesta técnica oportuna.
              </p>
            </div>

            <div className="sectors-grid">
              {sectors.map((sector) => {
                const Icon = sector.icon;

                return (
                  <article
                    className="sector-card"
                    key={sector.title}
                  >
                    <div className="sector-icon">
                      <Icon size={30} />
                    </div>

                    <h3>{sector.title}</h3>
                    <p>{sector.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section
          className="about-section section"
          id="empresa"
        >
          <div className="about-card">
            <div className="about-content">
              <span className="section-label">
                A&B Proveedores Integrales
              </span>

              <h2>
                Ingeniería aplicada a necesidades reales.
              </h2>

              <p>
                No ofrecemos paquetes genéricos. Revisamos la
                operación, identificamos los riesgos y proponemos
                soluciones que se puedan mantener, documentar y
                escalar.
              </p>

              <div className="about-points">
                <div>
                  <CheckCircle2 size={21} />
                  Diagnóstico técnico
                </div>

                <div>
                  <CheckCircle2 size={21} />
                  Implementación controlada
                </div>

                <div>
                  <CheckCircle2 size={21} />
                  Documentación y seguimiento
                </div>

                <div>
                  <CheckCircle2 size={21} />
                  Soporte posterior
                </div>
              </div>
            </div>

            <div className="about-quote">
              <p>
                “La tecnología debe sostener la operación sin
                transformarse en un problema adicional.”
              </p>

              <span>A&B Proveedores Integrales SpA</span>
            </div>
          </div>
        </section>

        <section
          className="support-section section"
          id="acceso-soporte"
        >
          <div className="support-paths">
            <article className="support-path support-path-client">
              <span>Clientes A&B</span>

              <h2>
                ¿Ya tiene acceso a nuestra Mesa de Ayuda?
              </h2>

              <p>
                Ingrese para registrar requerimientos, adjuntar
                antecedentes y revisar el estado de sus solicitudes.
              </p>

              <a
                className="button button-light"
                href={SERVICE_DESK_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Abrir Mesa de Ayuda
                <ArrowRight size={20} />
              </a>
            </article>

            <article className="support-path support-path-prospect">
              <span>Nuevos clientes</span>

              <h2>Solicite una evaluación técnica.</h2>

              <p>
                Revisaremos su infraestructura y prepararemos una
                propuesta de mejora de acuerdo con sus necesidades.
              </p>

              <button
                className="button button-primary"
                type="button"
                onClick={openEvaluation}
              >
                Solicitar Evaluación Técnica
                <ArrowRight size={20} />
              </button>
            </article>
          </div>
        </section>

        <section
          className="contact-section section"
          id="contacto"
        >
          <div className="section-heading">
            <span>Contacto</span>

            <h2>
              Conversemos sobre su infraestructura tecnológica.
            </h2>

            <p>
              Cuéntenos qué necesita resolver y evaluaremos el alcance
              técnico más adecuado para su empresa.
            </p>
          </div>

          <div className="contact-grid">
            <a
              className="contact-card"
              href="mailto:contacto@abproveedoresi.cl"
            >
              <Mail size={25} />

              <div>
                <span>Correo electrónico</span>
                <strong>contacto@abproveedoresi.cl</strong>
              </div>
            </a>

            <div className="contact-card">
              <Phone size={25} />

              <div>
                <span>Atención comercial</span>
                <strong>Contacto directo</strong>
              </div>
            </div>

            <div className="contact-card">
              <MapPin size={25} />

              <div>
                <span>Cobertura</span>
                <strong>
                  Región Metropolitana, Chile
                </strong>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <img
              className="footer-logo"
              src="/images/logo-ab.png"
              alt="A&B Proveedores Integrales SpA"
            />

            <div>
              <strong>
                A&B Proveedores Integrales SpA
              </strong>

              <span>
                Soluciones tecnológicas para empresas
              </span>
            </div>
          </div>

          <div className="footer-links">
            <a href="#servicios">Servicios</a>
            <a href="#soluciones">Soluciones</a>
            <a href="#contacto">Contacto</a>
            <a href="#acceso-soporte">Soporte</a>
          </div>

          <p>
            © {new Date().getFullYear()} A&B Proveedores Integrales
            SpA.
          </p>
        </div>
      </footer>

      <a
  className="floating-support"
  href="https://wa.me/56986747101?text=Hola,%20visité%20la%20página%20web%20de%20A%26B%20Proveedores%20y%20quisiera%20más%20información."
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Contactar por WhatsApp"
>
  <FaWhatsapp size={24} />
  <span>WhatsApp</span>
</a>

      <EvaluationModal
        isOpen={evaluationOpen}
        onClose={() => setEvaluationOpen(false)}
      />
    </div>
  );
}

export default App;