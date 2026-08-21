  import { useState, useEffect } from "react";
  import { ChevronRight, Tag, Gift, Percent, User } from "lucide-react";
  import { useAuthState } from "react-firebase-hooks/auth";
  import { auth } from "../firebase";
  import {  useNavigate } from "react-router-dom";
  import Header from "../components/Header";
import PlanCard from "../components/PlanCard";
import BannerCarousel from "../components/BannerCarousel";
import { GestorNotificaciones } from "../components/GestorNotificaciones";
import NotificationsModal, {contarNoLeidas} from "../components/Modalnotis";



interface PlanSocio {
  nombre: string;
  estado: string;
}



  interface HomeProps {
    openMenu: () => void;
  }

  export default function Home({ openMenu }: HomeProps) {
    const [user] = useAuthState(auth);
    const firstName = user?.displayName?.split(" ")[0] || "Alan";
    const [notisOpen, setNotisOpen] = useState(false);
const [unreadCount, setUnreadCount] = useState<number>(0);

    const navigate = useNavigate();

const [planes, setPlanes] = useState<PlanSocio[]>(() => {
  const cached = localStorage.getItem("auren_planes");
  return cached ? JSON.parse(cached) : [];
});
    // Estado para el carrusel de publicidad automático
    const [currentSlide, setCurrentSlide] = useState(0);



const slides = [
    {
      badge: "BENEFICIO EXCLUSIVO",
      title: "Conocé tus coberturas y ahorros vigentes",
      description: "Accedé a tus descuentos y cartilla médica al instante.",
      icon: Tag,
      color: "bg-[#0F1E3D]",
      bgImage: "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop')",
    },
    {
      badge: "PROMOCIÓN DEL MES",
      title: "Descuentos en farmacias adheridas",
      description: "Presentá tu credencial digital y ahorra en tus medicamentos.",
      icon: Gift,
      color: "bg-[#C9974A]",
      bgImage: "url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1000&auto=format&fit=crop')",
    },
    {
      badge: "NOVEDADES AUREN",
      title: "Nueva cartilla de especialistas",
      description: "Sumamos nuevos profesionales",
      icon: Percent,
      color: "bg-[#0F1E3D]",
      bgImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop')",
    },
  ];
const estilos = [
  { imageSrc: "https://res.cloudinary.com/dt6f9th0x/image/upload/v1787031889/aurensalud_wnnf8y.jpg" },
  { imageSrc: "https://res.cloudinary.com/dt6f9th0x/image/upload/v1787032014/aurenenruta_w1xmvo.jpg" },
  { imageSrc: "https://res.cloudinary.com/dt6f9th0x/image/upload/v1787031918/aurensepelios_n6nhbo.jpg" },
  { imageSrc: "https://res.cloudinary.com/dt6f9th0x/image/upload/v1787031918/aurenmascotas_o3ivmq.jpg" },
];

    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 4000);
      return () => clearInterval(timer);
    }, [slides.length]);

    const direction = sessionStorage.getItem("nav_direction") || "right";
    const animationClass = direction === "right" ? "animate-slide-right" : "animate-slide-left";

    useEffect(() => {
      const fetchSocio = async () => {
        if (!user) return;
        const idToken = await user.getIdToken();
        try {
          const res = await fetch("https://backendauren.onrender.com/api/mi-socio", {
            headers: { Authorization: `Bearer ${idToken}` },
          });
          if (res.ok) {
            const data = await res.json();
            setPlanes(data.planes || []);
            localStorage.setItem("auren_planes", JSON.stringify(data.planes || []));
          }
        } catch {
          // silencioso
        }
      };
      fetchSocio();
    }, [user]);

useEffect(() => {
  contarNoLeidas().then((count) => {
    console.log("Notificaciones no leídas calculadas:", count);
    setUnreadCount(count);
  });
}, [])


    return (
      <div className={`min-h-screen-safe bg-gradient-to-b from-[#FDFBF7] via-[#FBF6EC] to-[#F5EAD2] pb-24 overflow-y-auto ${animationClass}`}>
        {/* Header superior */}
        <Header
  onOpenMenu={openMenu}
  onOpenNotifications={() => setNotisOpen(true)}
  unreadCount={unreadCount}
/>
        
        {/* Bloque azul con la panza hacia arriba (curva inferior normal y superior recta o viceversa según el flujo visual) */}
<div className="relative bg-gradient-to-br from-[#0F1E3D] via-[#152953] to-[#0A1429] px-6 pt-6 pb-20 rounded-t-3xl shadow-xl"> 
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className="text-xl font-normal text-slate-300">Hola</span>
      <h1 className="text-xl font-bold text-white">{firstName} 👋</h1>
    </div>
    
    <button
      onClick={() => navigate("/perfil")}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-[#C9974A]/40 backdrop-blur-sm shadow-md"
    >
      <User size={18} className="text-[#C9974A]" />
    </button>


  </div>
</div>
        {/* Carrusel de Publicidad Flotante */}
       <div className="px-6 -mt-10 relative z-10">
  <div 
    className="rounded-3xl p-5 shadow-xl border border-slate-100 transition hover:shadow-2xl overflow-hidden relative"
    style={{
      backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.90), rgba(255, 255, 255, 0.90)), ${slides[currentSlide].bgImage}`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
    {/* Contenido de adentro con la altura fija de 120px que armamos antes */}
    <div className="flex items-center justify-between gap-4 h-[120px]">
      <div className="space-y-1.5 flex-1 flex flex-col justify-start h-full">
        <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-50 text-[#C9974A] text-[10px] font-bold tracking-wider uppercase self-start">
          {slides[currentSlide].badge}
        </span>
        <div>
          <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
            {slides[currentSlide].title}
          </h3>
          <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">
            {slides[currentSlide].description}
          </p>
        </div>
      </div>
      
  <button 
  onClick={() => {/* tu lógica de navegación */}}
  className="absolute right-4 bottom-4 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[#0F1E3D] text-xs font-bold shadow-lg hover:bg-[#C9974A] hover:text-white transition flex items-center gap-1"
>
  <span>Ver más</span>
  <ChevronRight size={14} />
</button>

    </div>

    {/* Puntitos */}
    <div className="flex justify-center items-center gap-1.5 mt-4">
      {slides.map((_, index) => (
        <button
          key={index}
          onClick={() => setCurrentSlide(index)}
          className={`h-2 rounded-full transition-all duration-300 ${
            currentSlide === index ? "w-6 bg-[#C9974A]" : "w-2 bg-slate-200"
          }`}
          aria-label={`Ir al slide ${index + 1}`}
        />
      ))}
    </div>
  </div>
</div>

        {/* Tus planes */}
<div className="mt-6 px-6">
  <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Tus planes</h2>
  <div className="grid grid-cols-2 gap-3">
{planes.map((plan, i) => {
  const style = estilos[i % estilos.length];
  return (
    <PlanCard
  key={plan.nombre}
  plan={plan.nombre}
  imageSrc={style.imageSrc}
/>
  );
})}
  </div>
</div>

       <BannerCarousel
banners={[
  {
    title: "10 % en combustibles",
    subtitle: "Promocion valida solo los jueves",
    imageSrc: "https://res.cloudinary.com/dt6f9th0x/image/upload/w_800,q_auto,f_auto/v1787031918/combustible_cbvszo.jpg",
  },
  {
    title: "25% de descuento en articulos de padel",
    subtitle: "Yo igual jugaria al tenis",
    imageSrc: "https://res.cloudinary.com/dt6f9th0x/image/upload/w_800,q_auto,f_auto/v1787031918/padel_mhtb0k.jpg",
  },
  {
    title: "25% en opticas",
    subtitle: "comprate unos ray ban bro",
    imageSrc: "https://res.cloudinary.com/dt6f9th0x/image/upload/w_800,q_auto,f_auto/v1787031918/optica_e193zc.jpg",
  },
]}
/>


<GestorNotificaciones/>

<NotificationsModal
  isOpen={notisOpen}
  onClose={() => setNotisOpen(false)}
  onReadStateChange={setUnreadCount}
/>
        
      </div>
    );
  }