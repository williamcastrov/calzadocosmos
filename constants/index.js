import {
  star, metrica, kpi, masvendidos, vtasmarketing, ventastotales
} from "../assets";


export const navLinks = [
  {
    id: "home",
    title: "Inicio",
  },
  {
    id: "planeacion",
    title: "Planeación",
  },
  {
    id: "compras",
    title: "Compras",
  },
  {
    id: "inventarios",
    title: "Inventarios",
  },
  {
    id: "Ventas",
    title: "Ventas",
  },
  {
    id: "logistica",
    title: "Logistica",
  },
];

export const opcionesmenu = [
  {
    name: "Inicio",
    href: "#",
    icon: "HomeIcon",
    current: false,
  },
  {
    name: "Planeación",
    href: "#",
    icon: "ClockIcon",
    current: false,
  },
  {
    name: "Compras",
    href: "/",
    icon: "ScaleIcon",
    current: false,
  },
  {
    name: "Inventarios",
    href: "#",
    icon: "CreditCardIcon",
    current: false,
  },
  {
    name: "Ventas",
    href: "/dashboard/DatosEntorno",
    icon: "UserGroupIcon",
    current: false,
  },
  {
    name: "Generador de consultas",
    href: "/GenerarConsultas/ConsultasVentas",
    icon: "UserGroupIcon",
    current: false,
  },
  {
    name: "Innovacion",
    href: "/dashboard/DatosInnovacion",
    icon: "UserGroupIcon",
    current: false,
  },
  {
    name: "Logistica",
    href: "#",
    icon: "DocumentReportIcon",
    current: false,
  },
  {
    name: "Informes de cierre",
    href: "/dashboard/InformesCierre",
    icon: "DocumentReportIcon",
    current: false,
  },
];

export const opcionesmenudos = [
  {
    name: "Configuración",
    href: "#",
    icon: "HomeIcon",
    current: false,
  },
  {
    name: "Cargar imagenes",
    href: "/LoadImage/LoadReference",
    icon: "ClockIcon",
    current: false,
  },
  {
    name: "Privacidad",
    href: "#",
    icon: "ScaleIcon",
    current: false,
  }
];

export const features = [
  {
    id: "kpi",
    icon: kpi,
    title: "KPI",
    content:
      "Indicadores clave de desempeño, de calidad aplicados a proesos del negociso (KPI)",
  },
  {
    id: "metricas",
    icon: metrica,
    title: "Métricas",
    content:
      "Métricas y datos fundamentales para hacer un seguimiento del estado de la empresa.",
  },
  {
    id: "feature-3",
    icon: star,
    title: "En tiempo real",
    content:
      "Banco de datos unificados, consolidados, y actualizados en tiempo real. ",
  },
];

export const stats = [
  {
    id: "stats-1",
    title: "En ventas",
    value: "450+",
  },
  {
    id: "stats-2",
    title: "Productos",
    value: "2860+",
  },
  {
    id: "stats-3",
    title: "Tiendas virtuales",
    value: "$230M+",
  },
];

export const footerLinks = [
  {
    title: "Useful Links",
    links: [
      {
        name: "Content",
        link: "https://www.hoobank.com/content/",
      },
      {
        name: "How it Works",
        link: "https://www.hoobank.com/how-it-works/",
      },
      {
        name: "Create",
        link: "https://www.hoobank.com/create/",
      },
      {
        name: "Explore",
        link: "https://www.hoobank.com/explore/",
      },
      {
        name: "Terms & Services",
        link: "https://www.hoobank.com/terms-and-services/",
      },
    ],
  },
  {
    title: "Community",
    links: [
      {
        name: "Help Center",
        link: "https://www.hoobank.com/help-center/",
      },
      {
        name: "Partners",
        link: "https://www.hoobank.com/partners/",
      },
      {
        name: "Suggestions",
        link: "https://www.hoobank.com/suggestions/",
      },
      {
        name: "Blog",
        link: "https://www.hoobank.com/blog/",
      },
      {
        name: "Newsletters",
        link: "https://www.hoobank.com/newsletters/",
      },
    ],
  },
  {
    title: "Partner",
    links: [
      {
        name: "Our Partner",
        link: "https://www.hoobank.com/our-partner/",
      },
      {
        name: "Become a Partner",
        link: "https://www.hoobank.com/become-a-partner/",
      },
    ],
  },
];

export const compras = [
  {
    id: "devolucion",
    valor: "221 Und - $ 17.5 MM",
    title: "Devoluciones por compras",
  },
  {
    id: "entrada",
    valor: "46,634 Und - $ 2,252 MM",
    title: "Ingreso por compras",
  },
  {
    id: "entradastransito",
    valor: "38,715 Und - $ 1,869 MM",
    title: "Entrada por transito",
  },
  {
    id: "salidastransito",
    valor: "38,509 Und - $ 1,859 MM",
    title: "Salidas por transito",
  }
];

export const tails = [
  { name: "Compras", periodouno: "Mes Corriente", periododos: "Mes Anterior",
    href: "/reports/Products", icon: "ScaleIcon", amount: "221 Und - $ 17.5 MM", current: false },
  { name: "Costos", periodouno: "Mes Corriente", periododos: "Mes Anterior",
    href: "/reports/Products", icon: "ScaleIcon", amount: "46,634 Und - $ 2,252 MM", current: false },
  { name: "Inventarios", periodouno: "Mes Corriente", periododos: "Mes Anterior",
    href: "/reports/Products", icon: "ScaleIcon", amount: "38,715 Und - $ 1,869 MM", current: false },
  { name: "Gastos", periodouno: "Mes Corriente", periododos: "Mes Anterior",
    href: "/reports/Products", icon: "ScaleIcon", amount: "38,509 Und - $ 1,853 MM", current: false },
  // More items...
];

export const tailsvtas = [
  { name: "Ventas", periodouno: "Mes Corriente", periododos: "Mes Anterior",
    href: "/reports/Products", icon: "ScaleIcon", amount: "221 Und - $ 17.5 MM", current: false },
  { name: "Margen", periodouno: "Mes Corriente", periododos: "Mes Anterior",
    href: "/reports/Products", icon: "ScaleIcon", amount: "46,634 Und - $ 2,252 MM", current: false },
  { name: "Participacion", periodouno: "Mes Corriente", periododos: "Mes Anterior",
    href: "/reports/Products", icon: "ScaleIcon", amount: "38,715 Und - $ 1,869 MM", current: false },
  { name: "Margenlinea", periodouno: "Mes Corriente", periododos: "Mes Anterior",
    href: "/reports/Products", icon: "ScaleIcon", amount: "38,509 Und - $ 1,853 MM", current: false },
  // More items...
];



export const vtascanal = [
  {
    id: 1,
    name: "PayU",
    href: "#",
    amount: "$43,335,137",
    currency: "USD",
    units: "228",
    date: "Agosto 18, 2022",
    datetime: "2022-08-18",
  },
  {
    id: 1,
    name: "Contra entrega",
    href: "#",
    amount: "$25,046,019",
    currency: "USD",
    units: "160",
    date: "Agosto 16, 2022",
    datetime: "2022-08-16",
  },
  {
    id: 1,
    name: "Dafiti",
    href: "#",
    amount: "$26,731,843",
    currency: "USD",
    units: "171",
    date: "Agosto 17, 2022",
    datetime: "2022-08-17",
  },
];

export const ecommerce = [
  {
    id: "masvendidos",
    logo: ventastotales,
    titulo: "Productos mas vendidos"
  },
  {
    id: "ventasmarketing",
    logo: ventastotales,
    titulo: "Ventas marketing"
  },
  {
    id: "ventastotales",
    logo: ventastotales,
    titulo: "Ventas totales"
  }
];

export const pedidos = [
  {
    fecha: "2022-06-01",
    cantpedidos: "13",
    cantrecaudos: "1860160",
    cumplimiento: "96%"
  },
  {
    fecha: "2022-06-02",
    cantpedidos: "13",
    cantrecaudos: "2237170",
    cumplimiento: "96%"
  },
  {
    fecha: "2022-06-03",
    cantpedidos: "6",
    cantrecaudos: "1023900",
    cumplimiento: "96%"
  },
  {
    fecha: "2022-06-04",
    cantpedidos: "17",
    cantrecaudos: "2695710",
    cumplimiento: "96%"
  },
  {
    fecha: "2022-06-05",
    cantpedidos: "5",
    cantrecaudos: "8894",
    cumplimiento: "96%"
  },
  {
    fecha: "2022-06-06",
    cantpedidos: "14",
    cantrecaudos: "2114530",
    cumplimiento: "96%"
  },
  {
    fecha: "2022-06-07",
    cantpedidos: "11",
    cantrecaudos: "1411620",
    cumplimiento: "96%"
  },
  {
    fecha: "2022-06-08",
    cantpedidos: "12",
    cantrecaudos: "1710800",
    cumplimiento: "96%"
  },
  {
    fecha: "2022-06-09",
    cantpedidos: "18",
    cantrecaudos: "3483500",
    cumplimiento: "96%"
  },
  {
    fecha: "2022-06-10",
    cantpedidos: "12",
    cantrecaudos: "1718180",
    cumplimiento: "96%"
  },
  {
    fecha: "2022-06-09",
    cantpedidos: "18",
    cantrecaudos: "3483500",
    cumplimiento: "96%"
  },
  {
    fecha: "2022-06-10",
    cantpedidos: "12",
    cantrecaudos: "1718180",
    cumplimiento: "96%"
  },
  {
    fecha: "2022-06-11",
    cantpedidos: "13",
    cantrecaudos: "2055540",
    cumplimiento: "96%"
  },
  {
    fecha: "2022-06-12",
    cantpedidos: "12",
    cantrecaudos: "1895230",
    cumplimiento: "96%"
  },
  {
    fecha: "2022-06-13",
    cantpedidos: "17",
    cantrecaudos: "2594779",
    cumplimiento: "96%"
  },
  {
    fecha: "2022-06-14",
    cantpedidos: "5",
    cantrecaudos: "70816",
    cumplimiento: "96%"
  },
  {
    fecha: "2022-06-15",
    cantpedidos: "8",
    cantrecaudos: "1161519",
    cumplimiento: "96%"
  },
  {
    fecha: "2022-06-16",
    cantpedidos: "6",
    cantrecaudos: "8871",
    cantrecaudos: "1710800",
    cumplimiento: "96%"
  },
  {
    fecha: "2022-06-17",
    cantpedidos: "376",
    cantrecaudos: "59198370",
    cumplimiento: "96%"
  },
  {
    fecha: "2022-06-18",
    cantpedidos: "9",
    cantrecaudos: "1396797",
    cumplimiento: "96%"
  },
  {
    fecha: "2022-06-19",
    cantpedidos: "5",
    cantrecaudos: "9345",
    cumplimiento: "96%"
  },
  {
    fecha: "2022-06-20",
    cantpedidos: "8",
    cantrecaudos: "1512935",
    cumplimiento: "96%"
  },
  {
    fecha: "2022-06-21",
    cantpedidos: "10",
    cantrecaudos: "1765121",
    cumplimiento: "96%"
  },
  {
    fecha: "2022-06-22",
    cantpedidos: "7",
    cantrecaudos: "7476750",
    cumplimiento: "96%"
  },
  {
    fecha: "2022-06-23",
    cantpedidos: "15",
    cantrecaudos: "2618810",
    cumplimiento: "96%"
  },
  {
    fecha: "2022-06-24",
    cantpedidos: "13",
    cantrecaudos: "2246575",
    cumplimiento: "96%"
  },
  {
    fecha: "2022-06-25",
    cantpedidos: "9",
    cantrecaudos: "1834560",
    cumplimiento: "96%"
  },
  {
    fecha: "2022-06-26",
    cantpedidos: "16",
    cantrecaudos: "2742170",
    cumplimiento: "96%"
  },
  {
    fecha: "2022-06-27",
    cantpedidos: "16",
    cantrecaudos: "2759160",
    cumplimiento: "96%"
  },
  {
    fecha: "2022-06-28",
    cantpedidos: "9",
    cantrecaudos: "1348330",
    cumplimiento: "96%"
  },
  {
    fecha: "2022-06-29",
    cantpedidos: "11",
    cantrecaudos: "1685991",
    cumplimiento: "96%"
  },
  {
    fecha: "2022-06-30",
    cantpedidos: "10",
    cantrecaudos: "1802400",
    cumplimiento: "96%"
  },
  // More people...
];