// Los dos software que vende Cumplido. Cada uno es un producto completo:
// atención + agenda + administración y contabilidad incluidas.
export type SolutionId = 'salud' | 'belleza';

export interface Solution {
  id: SolutionId;
  name: string; // Cumplido Salud
  short: string; // Salud
  accent: string;
  accentInk: string;
  icon: string;
  seoTitle: string;
  seoDescription: string;
  pitch: string; // una línea para tarjetas
  headline: string;
  intro: string;
  audience: string[];
  people: string; // cómo llama el negocio a quien atiende
  needs: { title: string; text: string }[];
  highlights: string[]; // lo que más necesita este negocio
  workflow: { title: string; text: string }[];
  roles: { name: string; can: string }[];
  limits: string[];
  faqs: { q: string; a: string }[];
}

export const solutions: Record<SolutionId, Solution> = {
  salud: {
    id: 'salud',
    name: 'Cumplido Salud',
    short: 'Salud',
    accent: 'var(--c-health)',
    accentInk: 'var(--c-health-ink)',
    icon: 'Tooth',
    seoTitle: 'Cumplido Salud: software para consultorios de odontología y fisioterapia',
    seoDescription:
      'Agenda, historia clínica, evoluciones, consentimientos, planes de terapia, inventario de insumos, caja y contabilidad en un solo software para consultorios de odontología, fisioterapia y bienestar.',
    pitch: 'Para consultorios de odontología, fisioterapia y bienestar.',
    headline: 'Tu consultorio al día: agenda, historia clínica y cuentas en un solo software',
    intro:
      'Cumplido Salud está hecho para consultorios donde cada cita deja un registro clínico, gasta insumos y forma parte de un tratamiento de varias sesiones. Incluye toda la administración y la contabilidad, sin módulos aparte.',
    audience: ['Odontología', 'Fisioterapia y rehabilitación', 'Salud y bienestar'],
    people: 'pacientes',
    highlights: [
      'Historia clínica de odontología y fisioterapia',
      'Valoración inicial y evolución por sesión',
      'Consentimientos informados con firma del profesional',
      'Planes de tratamiento y paquetes de terapia con saldo',
      'Insumos con lotes y vencimientos',
      'Caja, cartera y contabilidad incluidas',
    ],
    needs: [
      { title: 'Pacientes que no llegan', text: 'Los recordatorios automáticos avisan antes de la cita para que no quede el espacio vacío en la agenda.' },
      { title: 'Tratamientos de muchas sesiones', text: 'Cada plan de terapia muestra las sesiones hechas, las que faltan y lo que el paciente debe.' },
      { title: 'Historias clínicas en papel', text: 'Valoración, evoluciones, consentimientos y firma quedan en la ficha del paciente, con acceso solo para quien tiene permiso clínico.' },
      { title: 'Insumos que se vencen o se acaban', text: 'El inventario controla lotes y vencimientos, y descuenta lo que se usa en cada procedimiento.' },
    ],
    workflow: [
      { title: 'El paciente agenda', text: 'Desde la app o en recepción, según la disponibilidad del profesional.' },
      { title: 'Recibe un recordatorio', text: 'Por notificación o correo antes de la cita.' },
      { title: 'El profesional atiende', text: 'Consulta la historia, registra la evolución y los insumos usados.' },
      { title: 'Recepción cobra', text: 'Registra el pago o el abono y actualiza el saldo del tratamiento.' },
      { title: 'Las cuentas quedan hechas', text: 'Caja, cartera, gastos y reportes se actualizan solos.' },
    ],
    roles: [
      { name: 'Odontólogo o fisioterapeuta', can: 'Ve su agenda y registra la historia clínica y las evoluciones de sus pacientes.' },
      { name: 'Recepción', can: 'Agenda, confirma, reprograma y cobra. No ve el contenido clínico.' },
      { name: 'Contador', can: 'Consulta caja, gastos, cartera y contabilidad, sin acceso a historias clínicas.' },
      { name: 'Dueño o administrador', can: 'Configura servicios, profesionales, permisos e inventario, y revisa los reportes.' },
      { name: 'Paciente', can: 'Reserva, consulta su historial de citas y tratamientos, y sus pagos desde la app.' },
    ],
    limits: [
      'Es una herramienta de gestión: no reemplaza el criterio clínico ni valida diagnósticos.',
      'Calidad y cumplimiento (PQRS, eventos adversos, habilitación) está planeado.',
      'Cada prestador sigue siendo responsable de la normativa de historia clínica y habilitación que le aplique.',
    ],
    faqs: [
      { q: '¿Sirve para odontología y fisioterapia a la vez?', a: 'Sí. Cada especialidad tiene sus formatos de historia clínica y ambas comparten agenda, pacientes, caja e inventario.' },
      { q: '¿Quién puede ver la historia clínica?', a: 'Solo los usuarios con permiso clínico, normalmente el profesional tratante. Recepción y el contador trabajan sin ver ese contenido.' },
      { q: '¿Tengo que pagar aparte la parte administrativa y contable?', a: 'No. La administración y la contabilidad vienen incluidas en Cumplido Salud.' },
      { q: '¿Puedo cobrar por paquete de sesiones?', a: 'Sí. Los paquetes controlan las sesiones hechas, las pendientes y el saldo.' },
    ],
  },

  belleza: {
    id: 'belleza',
    name: 'Cumplido Belleza',
    short: 'Belleza',
    accent: 'var(--c-beauty)',
    accentInk: 'var(--c-beauty-ink)',
    icon: 'Scissors',
    seoTitle: 'Cumplido Belleza: software para peluquerías, barberías y salones de belleza',
    seoDescription:
      'Agenda por profesional, servicios, clientes, comisiones, inventario de productos, caja y contabilidad en un solo software para peluquerías, barberías, salones, manicura y pedicura.',
    pitch: 'Para peluquerías, barberías, salones, manicura y pedicura.',
    headline: 'Tu salón lleno y en orden: agenda, comisiones y caja en un solo software',
    intro:
      'Cumplido Belleza está hecho para salones donde varias personas atienden a la vez, los clientes vuelven seguido y cada servicio usa productos. Incluye toda la administración y la contabilidad, sin módulos aparte.',
    audience: ['Peluquerías y barberías', 'Salones de belleza y estética', 'Manicura y pedicura'],
    people: 'clientes',
    highlights: [
      'Agenda por estilista, barbero o manicurista',
      'Servicios con duración, precio y comisión',
      'Historial y preferencias de cada cliente',
      'Paquetes y control de sesiones',
      'Comisiones calculadas solas',
      'Caja, inventario y contabilidad incluidas',
    ],
    needs: [
      { title: 'Citas cruzadas y sillas vacías', text: 'Cada profesional tiene su agenda con la duración real de cada servicio, y los clientes reciben recordatorio.' },
      { title: 'Comisiones a mano a fin de mes', text: 'Los servicios marcados como hechos y cobrados calculan las comisiones de cada persona.' },
      { title: 'El cliente que vuelve y nadie recuerda', text: 'El historial muestra qué se hizo, qué productos usó y cuándo le toca volver.' },
      { title: 'Productos que se acaban sin aviso', text: 'El inventario descuenta lo que se usa en cada servicio y avisa qué reponer.' },
    ],
    workflow: [
      { title: 'El cliente reserva', text: 'Elige servicio y profesional desde la app o por recepción.' },
      { title: 'Recibe la confirmación', text: 'Y un recordatorio antes de la cita.' },
      { title: 'El profesional atiende', text: 'Marca el servicio como hecho y los productos usados.' },
      { title: 'Caja cobra', text: 'Registra el método de pago; la venta queda asignada al profesional.' },
      { title: 'Las cuentas quedan hechas', text: 'Comisiones, caja, gastos y reportes se actualizan solos.' },
    ],
    roles: [
      { name: 'Estilista, barbero o manicurista', can: 'Ve su agenda, sus servicios hechos y sus comisiones.' },
      { name: 'Recepción o caja', can: 'Agenda, cobra y registra abonos y devoluciones.' },
      { name: 'Contador', can: 'Consulta caja, gastos, cartera y contabilidad.' },
      { name: 'Dueño o administrador', can: 'Configura servicios, precios, comisiones, turnos e inventario, y revisa los reportes.' },
      { name: 'Cliente', can: 'Reserva, consulta servicios y su historial, y recibe recordatorios en la app.' },
    ],
    limits: [
      'Las confirmaciones por SMS y WhatsApp están planeadas y dependerán de un proveedor externo.',
      'La venta de productos en línea no está incluida por ahora.',
    ],
    faqs: [
      { q: '¿Puedo manejar servicios de distinta duración?', a: 'Sí. Cada servicio tiene su duración y la agenda reserva ese tiempo con el profesional elegido.' },
      { q: '¿Cómo se calculan las comisiones?', a: 'Se configuran por profesional o por servicio y se calculan con los servicios hechos y cobrados.' },
      { q: '¿Tengo que pagar aparte la parte administrativa y contable?', a: 'No. La administración y la contabilidad vienen incluidas en Cumplido Belleza.' },
      { q: '¿Sirve si trabajo solo o sola?', a: 'Sí. El plan Básico es para equipos de 1 a 5 personas.' },
    ],
  },
};

export const solutionList = Object.values(solutions);
