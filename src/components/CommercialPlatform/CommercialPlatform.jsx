import { useMemo, useState } from 'react';
import { ArrowRight, Calculator, CheckCircle2, ClipboardList, Monitor, Network, ShieldCheck, Server } from 'lucide-react';
import './CommercialPlatform.css';

const catalog = [
  { icon: Server, category: 'Infraestructura', title: 'Servidores y virtualización', description: 'Implementación de servidores, Active Directory, Proxmox y continuidad operacional.', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80' },
  { icon: Network, category: 'Conectividad', title: 'Redes empresariales', description: 'Cableado estructurado, WiFi corporativo, VPN y segmentación de redes.', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=900&q=80' },
  { icon: ShieldCheck, category: 'Seguridad', title: 'Ciberseguridad administrada', description: 'Evaluaciones, políticas de seguridad, respaldos y protección de accesos.', image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=900&q=80' },
  { icon: Monitor, category: 'Soporte', title: 'Soporte TI por convenio', description: 'Atención remota y presencial, inventario, seguimiento y mantenimiento preventivo.', image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=900&q=80' },
  { icon: ClipboardList, category: 'Desarrollo', title: 'Software y automatización', description: 'Aplicaciones web, sistemas internos, integraciones y automatización de procesos.', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80' },
];

const fmt = new Intl.NumberFormat('es-CL');

export default function CommercialPlatform({ hideCatalog = false }) {
  const [category, setCategory] = useState('Todos');
  const [users, setUsers] = useState(25);
  const [sites, setSites] = useState(1);
  const [needs, setNeeds] = useState(['Soporte técnico']);
  const categories = ['Todos', ...new Set(catalog.map(item => item.category))];
  const filtered = useMemo(() => category === 'Todos' ? catalog : catalog.filter(item => item.category === category), [category]);
  const selected = useMemo(() => {
    const recommendations = [...needs];
    if (users >= 20 && !recommendations.includes('Administración de equipos')) recommendations.push('Administración de equipos');
    if (sites > 1 && !recommendations.includes('VPN y conectividad entre sedes')) recommendations.push('VPN y conectividad entre sedes');
    return recommendations;
  }, [users, sites, needs]);

  const toggle = (value) => setNeeds(previous => previous.includes(value) ? previous.filter(item => item !== value) : [...previous, value]);
  const requestQuote = (service) => {
    const detail = service ? `Servicio: ${service}` : `Usuarios: ${users}\nSedes: ${sites}\nNecesidades: ${selected.join(', ') || 'Por definir'}`;
    const message = `Hola, quisiera solicitar una evaluación y cotización de A&B Proveedores.\n${detail}\nPor favor, indíquenme los siguientes pasos.`;
    window.open(`https://wa.me/56986747101?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="commercial-platform">
      {!hideCatalog && <section className="commercial-section section" id="catalogo">
        <div className="commercial-heading">
          <span>Catálogo de soluciones</span>
          <h2>Encuentra la solución tecnológica que necesita tu empresa.</h2>
          <p>Explora servicios especializados y solicita una propuesta según tu infraestructura. Los valores se determinan tras una evaluación técnica.</p>
        </div>
        <div className="commercial-filters" role="group" aria-label="Filtrar soluciones por categoría">
          {categories.map(item => <button key={item} type="button" className={category === item ? 'commercial-filter active' : 'commercial-filter'} onClick={() => setCategory(item)} aria-pressed={category === item}>{item}</button>)}
        </div>
        <div className="commercial-grid">
          {filtered.map(item => {
            const Icon = item.icon;
            return <article className="commercial-card" key={item.title}>
              <img className="commercial-card-photo" src={item.image} alt={`Imagen ilustrativa de ${item.title}`} loading="lazy" onError={event => { event.currentTarget.style.display = "none"; }} />
              <div className="commercial-card-icon"><Icon size={26}/></div>
              <span>{item.category}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <button type="button" onClick={() => requestQuote(item.title)}>Solicitar cotización <ArrowRight size={17}/></button>
            </article>;
          })}
        </div>
      </section>}

      <section className="commercial-section commercial-configurator section" id="configurador">
        <div className="commercial-heading">
          <span>Configura tu solución TI</span>
          <h2>Cuéntanos cómo opera tu empresa.</h2>
          <p>Recibe una recomendación inicial de servicios. No constituye un presupuesto definitivo ni requiere ingresar datos sensibles de tu infraestructura.</p>
        </div>
        <div className="commercial-config-grid">
          <div className="commercial-config-form">
            <div className="commercial-config-label"><Calculator size={20}/> Dimensionamiento inicial</div>
            <label htmlFor="ab-users">Cantidad aproximada de usuarios <strong>{fmt.format(users)}</strong></label>
            <input id="ab-users" type="range" min="1" max="250" step="1" value={users} onChange={e => setUsers(Number(e.target.value))}/>
            <label htmlFor="ab-sites">Cantidad de sedes <strong>{sites}</strong></label>
            <input id="ab-sites" type="range" min="1" max="10" step="1" value={sites} onChange={e => setSites(Number(e.target.value))}/>
            <fieldset>
              <legend>¿Qué necesitas resolver?</legend>
              {['Soporte técnico', 'Redes y WiFi', 'Servidores y respaldos', 'Ciberseguridad', 'Cloud y correo', 'Desarrollo de software'].map(item => <label className="commercial-check" key={item}><input type="checkbox" checked={needs.includes(item)} onChange={() => toggle(item)}/>{item}</label>)}
            </fieldset>
          </div>
          <div className="commercial-recommendation" aria-live="polite">
            <div className="commercial-config-label"><CheckCircle2 size={20}/> Recomendación preliminar</div>
            <h3>Solución para {fmt.format(users)} usuarios {sites > 1 ? `en ${sites} sedes` : 'en una sede'}</h3>
            <p>Servicios sugeridos a partir de los datos indicados:</p>
            <ul>{(selected.length ? selected : ['Evaluación inicial de infraestructura']).map(item => <li key={item}><CheckCircle2 size={16}/>{item}</li>)}</ul>
            <p className="commercial-disclaimer">La disponibilidad, alcance, tiempos y precios se confirman mediante diagnóstico y cotización formal.</p>
            <button type="button" onClick={() => requestQuote(null)}>Solicitar propuesta personalizada <ArrowRight size={18}/></button>
          </div>
        </div>
      </section>
    </div>
  );
}
