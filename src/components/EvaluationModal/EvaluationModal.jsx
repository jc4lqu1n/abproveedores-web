import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  Mail,
  Phone,
  Send,
  User,
  X,
} from 'lucide-react';

import './EvaluationModal.css';

const serviceOptions = [
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

const companySizes = [
  '1 a 10 usuarios',
  '11 a 25 usuarios',
  '26 a 50 usuarios',
  '51 a 100 usuarios',
  'Más de 100 usuarios',
];

const priorities = [
  'Resolver un problema urgente',
  'Modernizar la infraestructura',
  'Solicitar una cotización',
  'Realizar una evaluación preventiva',
];

const initialForm = {
  company: '',
  name: '',
  role: '',
  email: '',
  phone: '',
  services: [],
  companySize: '',
  priority: '',
  comments: '',
};

function EvaluationModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submittedRequest, setSubmittedRequest] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const closeModal = () => {
    setStep(1);
    setFormData(initialForm);
    setErrors({});
    setSubmittedRequest(null);
    setIsSubmitting(false);
    setSubmitError('');
    onClose();
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setStep(1);
        setFormData(initialForm);
        setErrors({});
        setSubmittedRequest(null);
        setIsSubmitting(false);
        setSubmitError('');
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const updateField = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: '',
    }));

    setSubmitError('');
  };

  const toggleService = (service) => {
    setFormData((current) => {
      const isSelected = current.services.includes(service);

      return {
        ...current,
        services: isSelected
          ? current.services.filter((item) => item !== service)
          : [...current.services, service],
      };
    });

    setErrors((current) => ({
      ...current,
      services: '',
    }));

    setSubmitError('');
  };

  const validateStep = () => {
    const nextErrors = {};

    if (step === 1) {
      if (!formData.company.trim()) {
        nextErrors.company = 'Ingrese el nombre de la empresa.';
      }

      if (!formData.name.trim()) {
        nextErrors.name = 'Ingrese su nombre.';
      }

      if (!formData.email.trim()) {
        nextErrors.email = 'Ingrese su correo.';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        nextErrors.email = 'Ingrese un correo válido.';
      }

      if (!formData.phone.trim()) {
        nextErrors.phone = 'Ingrese un teléfono de contacto.';
      }
    }

    if (step === 2 && formData.services.length === 0) {
      nextErrors.services = 'Seleccione al menos un servicio.';
    }

    if (step === 3) {
      if (!formData.companySize) {
        nextErrors.companySize =
          'Seleccione el tamaño de la empresa.';
      }

      if (!formData.priority) {
        nextErrors.priority =
          'Seleccione el objetivo de la evaluación.';
      }
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const nextStep = () => {
    if (!validateStep()) {
      return;
    }

    setSubmitError('');
    setStep((current) => Math.min(current + 1, 4));
  };

  const previousStep = () => {
    setSubmitError('');
    setStep((current) => Math.max(current - 1, 1));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setSubmitError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/evaluations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      let result;

      try {
        result = await response.json();
      } catch {
        throw new Error(
          'El servidor devolvió una respuesta no válida.',
        );
      }

      if (!response.ok) {
        throw new Error(
          result.message ||
            'No fue posible enviar la solicitud.',
        );
      }

      const message = [
        `Solicitud de evaluación técnica ${result.requestId}`,
        '',
        `Empresa: ${formData.company}`,
        `Nombre: ${formData.name}`,
        `Cargo: ${formData.role || 'No informado'}`,
        `Correo: ${formData.email}`,
        `Teléfono: ${formData.phone}`,
        '',
        'Servicios requeridos:',
        ...formData.services.map(
          (service) => `- ${service}`,
        ),
        '',
        `Tamaño de empresa: ${formData.companySize}`,
        `Objetivo: ${formData.priority}`,
        '',
        'Observaciones:',
        formData.comments ||
          'Sin observaciones adicionales.',
      ].join('\n');

      setSubmittedRequest({
        id: result.requestId,
        message,
      });
    } catch (error) {
      console.error('Error enviando evaluación:', error);

      setSubmitError(
        error instanceof Error
          ? error.message
          : 'No fue posible enviar la solicitud.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="evaluation-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closeModal();
        }
      }}
    >
      <section
        className="evaluation-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="evaluation-title"
      >
        <header className="evaluation-header">
          <div>
            <span>Evaluación técnica inicial</span>

            <h2 id="evaluation-title">
              Cuéntenos qué necesita resolver.
            </h2>
          </div>

          <button
            type="button"
            className="evaluation-close"
            onClick={closeModal}
            aria-label="Cerrar formulario"
          >
            <X size={23} />
          </button>
        </header>

        {submittedRequest ? (
          <div className="evaluation-success">
            <div className="evaluation-success-icon">
              <Check size={32} />
            </div>

            <span>Solicitud registrada</span>

            <h3>
              Su evaluación técnica fue enviada correctamente.
            </h3>

            <strong>{submittedRequest.id}</strong>

            <p>
              Nuestro equipo revisará los antecedentes y se pondrá en
              contacto con usted. Guarde este código como referencia de
              la solicitud.
            </p>

            <div className="evaluation-success-actions">
              <a
                className="evaluation-button evaluation-button-primary"
                href={`https://wa.me/?text=${encodeURIComponent(
                  submittedRequest.message,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Compartir por WhatsApp
              </a>

              <a
                className="evaluation-button evaluation-button-secondary"
                href={`mailto:contacto@abproveedoresi.cl?subject=${encodeURIComponent(
                  `Evaluación técnica ${submittedRequest.id}`,
                )}&body=${encodeURIComponent(
                  submittedRequest.message,
                )}`}
              >
                Enviar copia por correo
              </a>
            </div>

            <button
              type="button"
              className="evaluation-button evaluation-button-secondary"
              onClick={closeModal}
            >
              Cerrar
            </button>
          </div>
        ) : (
          <>
            <div className="evaluation-progress">
              {[1, 2, 3, 4].map((number) => (
                <div
                  className={`progress-step ${
                    number <= step
                      ? 'progress-step-active'
                      : ''
                  }`}
                  key={number}
                >
                  <span>
                    {number < step ? (
                      <Check size={15} />
                    ) : (
                      number
                    )}
                  </span>

                  <small>
                    {number === 1 && 'Contacto'}
                    {number === 2 && 'Servicios'}
                    {number === 3 && 'Empresa'}
                    {number === 4 && 'Detalle'}
                  </small>
                </div>
              ))}
            </div>

            <form
              className="evaluation-form"
              onSubmit={handleSubmit}
            >
              {submitError && (
                <div
                  className="evaluation-error"
                  role="alert"
                >
                  {submitError}
                </div>
              )}

              {step === 1 && (
                <div className="form-step">
                  <div className="form-step-heading">
                    <span>Paso 1 de 4</span>
                    <h3>Datos de contacto</h3>

                    <p>
                      Utilizaremos estos antecedentes para coordinar la
                      evaluación.
                    </p>
                  </div>

                  <div className="form-grid">
                    <label className="form-field">
                      <span>Empresa *</span>

                      <div className="input-wrapper">
                        <Building2 size={18} />

                        <input
                          name="company"
                          value={formData.company}
                          onChange={updateField}
                          placeholder="Nombre de la empresa"
                          autoComplete="organization"
                        />
                      </div>

                      {errors.company && (
                        <small className="field-error">
                          {errors.company}
                        </small>
                      )}
                    </label>

                    <label className="form-field">
                      <span>Nombre *</span>

                      <div className="input-wrapper">
                        <User size={18} />

                        <input
                          name="name"
                          value={formData.name}
                          onChange={updateField}
                          placeholder="Nombre y apellido"
                          autoComplete="name"
                        />
                      </div>

                      {errors.name && (
                        <small className="field-error">
                          {errors.name}
                        </small>
                      )}
                    </label>

                    <label className="form-field">
                      <span>Cargo</span>

                      <div className="input-wrapper">
                        <Building2 size={18} />

                        <input
                          name="role"
                          value={formData.role}
                          onChange={updateField}
                          placeholder="Cargo o función"
                        />
                      </div>
                    </label>

                    <label className="form-field">
                      <span>Correo *</span>

                      <div className="input-wrapper">
                        <Mail size={18} />

                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={updateField}
                          placeholder="correo@empresa.cl"
                          autoComplete="email"
                        />
                      </div>

                      {errors.email && (
                        <small className="field-error">
                          {errors.email}
                        </small>
                      )}
                    </label>

                    <label className="form-field form-field-full">
                      <span>Teléfono *</span>

                      <div className="input-wrapper">
                        <Phone size={18} />

                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={updateField}
                          placeholder="+56 9 1234 5678"
                          autoComplete="tel"
                        />
                      </div>

                      {errors.phone && (
                        <small className="field-error">
                          {errors.phone}
                        </small>
                      )}
                    </label>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="form-step">
                  <div className="form-step-heading">
                    <span>Paso 2 de 4</span>
                    <h3>Servicios requeridos</h3>
                    <p>
                      Puede seleccionar una o varias áreas.
                    </p>
                  </div>

                  <div className="option-grid">
                    {serviceOptions.map((service) => {
                      const selected =
                        formData.services.includes(service);

                      return (
                        <button
                          type="button"
                          className={`select-option ${
                            selected
                              ? 'select-option-active'
                              : ''
                          }`}
                          key={service}
                          onClick={() =>
                            toggleService(service)
                          }
                        >
                          <span className="option-check">
                            {selected && (
                              <Check size={15} />
                            )}
                          </span>

                          {service}
                        </button>
                      );
                    })}
                  </div>

                  {errors.services && (
                    <small className="field-error">
                      {errors.services}
                    </small>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="form-step">
                  <div className="form-step-heading">
                    <span>Paso 3 de 4</span>
                    <h3>Características de la empresa</h3>

                    <p>
                      Esta información nos permite estimar el alcance.
                    </p>
                  </div>

                  <div className="selection-group">
                    <h4>Tamaño de la empresa</h4>

                    <div className="radio-grid">
                      {companySizes.map((size) => (
                        <label
                          className={`radio-option ${
                            formData.companySize === size
                              ? 'radio-option-active'
                              : ''
                          }`}
                          key={size}
                        >
                          <input
                            type="radio"
                            name="companySize"
                            value={size}
                            checked={
                              formData.companySize === size
                            }
                            onChange={updateField}
                          />

                          <span>{size}</span>
                        </label>
                      ))}
                    </div>

                    {errors.companySize && (
                      <small className="field-error">
                        {errors.companySize}
                      </small>
                    )}
                  </div>

                  <div className="selection-group">
                    <h4>Objetivo principal</h4>

                    <div className="radio-grid">
                      {priorities.map((priority) => (
                        <label
                          className={`radio-option ${
                            formData.priority === priority
                              ? 'radio-option-active'
                              : ''
                          }`}
                          key={priority}
                        >
                          <input
                            type="radio"
                            name="priority"
                            value={priority}
                            checked={
                              formData.priority === priority
                            }
                            onChange={updateField}
                          />

                          <span>{priority}</span>
                        </label>
                      ))}
                    </div>

                    {errors.priority && (
                      <small className="field-error">
                        {errors.priority}
                      </small>
                    )}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="form-step">
                  <div className="form-step-heading">
                    <span>Paso 4 de 4</span>
                    <h3>Información adicional</h3>

                    <p>
                      Explique brevemente el problema, proyecto o
                      necesidad.
                    </p>
                  </div>

                  <label className="form-field">
                    <span>Observaciones</span>

                    <textarea
                      name="comments"
                      value={formData.comments}
                      onChange={updateField}
                      rows="7"
                      placeholder="Ejemplo: necesitamos revisar la red, mejorar la cobertura WiFi y evaluar respaldos..."
                    />
                  </label>

                  <div className="evaluation-summary">
                    <strong>Resumen de la solicitud</strong>

                    <p>
                      <span>Empresa:</span>{' '}
                      {formData.company}
                    </p>

                    <p>
                      <span>Servicios:</span>{' '}
                      {formData.services.join(', ')}
                    </p>

                    <p>
                      <span>Objetivo:</span>{' '}
                      {formData.priority}
                    </p>
                  </div>
                </div>
              )}

              <footer className="evaluation-actions">
                {step > 1 ? (
                  <button
                    type="button"
                    className="evaluation-button evaluation-button-secondary"
                    onClick={previousStep}
                    disabled={isSubmitting}
                  >
                    <ArrowLeft size={18} />
                    Volver
                  </button>
                ) : (
                  <button
                    type="button"
                    className="evaluation-button evaluation-button-secondary"
                    onClick={closeModal}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </button>
                )}

                {step < 4 ? (
                  <button
                    type="button"
                    className="evaluation-button evaluation-button-primary"
                    onClick={nextStep}
                  >
                    Continuar
                    <ArrowRight size={18} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="evaluation-button evaluation-button-primary"
                  >
                    {isSubmitting
                      ? 'Enviando solicitud...'
                      : 'Enviar solicitud'}

                    <Send size={18} />
                  </button>
                )}
              </footer>
            </form>
          </>
        )}
      </section>
    </div>
  );
}

export default EvaluationModal;