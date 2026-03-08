// lugares.js - Archivo exclusivo para los datos de los establecimientos

const places = [
    {
        id: 1,
        name: "Yo Invito",
        category: "restaurant",
        image: "imagenes/Yo invito.webp",
        rating: 4.8,
        reviews: 324,
        address: "📍Calle 3era, esquina a D, Vedado",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4428.31293970352!2d-82.40070568849433!3d23.142295711761346!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88cd7753ed68eb81%3A0xc7348a78249be9df!2sYo%20Invito...!5e1!3m2!1ses!2sus!4v1771418149936!5m2!1ses!2sus",
        description: "Contamos con área infantil para el disfrute de los peques. Siéntete como en casa 😊😌",
        specialties: ["Variedad de comida cubana e internacional"],
        priceRange: "$$$",
        menu: {
            entrees: [
                { item: "Tostones Rellenos", price: "$3.500", desc: "De jamón y queso, con salsa tártara" },
                { item: "Croquetas de la Casa", price: "$2.800", desc: "6 unidades, bechamel cremosa" },
                { item: "Ensalada Mixta", price: "$2.800", desc: "Lechuga, tomate, cebolla y pepino" },
                { item: "Sopa del Día", price: "$2.200", desc: "Consultar variedad disponible" }
            ],
            mains: [
                { item: "Bife de Chorizo (400g)", price: "$12.500", desc: "Corte premium con guarnición" },
                { item: "Asado para 2 personas", price: "$18.900", desc: "Vacio, entraña, chorizo y morcilla" },
                { item: "Pollo Grille", price: "$8.500", desc: "Pechuga marinada con vegetales" },
                { item: "Ropa Vieja", price: "$9.200", desc: "Clásico cubano con arroz y plátano" }
            ],
            pasta: [
                { item: "Spaghetti Bolognesa", price: "$7.500", desc: "Salsa de tomate con carne molida" },
                { item: "Fettuccine Alfredo", price: "$8.200", desc: "Salsa cremosa con pollo" },
                { item: "Lasagna de Carne", price: "$8.800", desc: "Capas de pasta con bechamel" }
            ],
            sandwiches: [
                { item: "Cubano Tradicional", price: "$5.500", desc: "Jamón, cerdo, queso, pepinillos y mostaza" },
                { item: "Pan con Lechón", price: "$6.200", desc: "Cerdo asado, cebolla crujiente y mojo" },
                { item: "Hamburguesa Clásica", price: "$6.800", desc: "Carne 150g, queso cheddar, vegetales" },
                { item: "Chivito Uruguayo", price: "$8.500", desc: "Lomo, jamón, queso, huevo y mayonesa" },
                { item: "Sándwich de Pollo", price: "$5.800", desc: "Pechuga grille, lechuga y tomate" }
            ],
            desserts: [
                { item: "Flan de Caramelo", price: "$2.500", desc: "Casero, receta tradicional" },
                { item: "Tarta de Queso", price: "$3.200", desc: "Con mermelada de frutos rojos" },
                { item: "Helado Artesanal", price: "$2.800", desc: "2 bolas, varios sabores" }
            ],
            drinks: [
                { item: "Vino Malbec Reserva", price: "$8.500", desc: "Botella de bodega Trapiche" },
                { item: "Cerveza Nacional", price: "$2.200", desc: "Cristal o Bucanero" },
                { item: "Refrescos Importados", price: "$2.800", desc: "Coca-Cola, Sprite, Fanta" },
                { item: "Agua Natural", price: "$1.500", desc: "500ml" }
            ]
        },
        hours: "⏰️ Lun-Dom: 12:00pm-23:00pm",
        phone: "#",
    },
    {
        id: 2,
        name: "5 Esquinas Trattoria",
        category: "restaurant",
        image: "imagenes/5 esquinas.jpg",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍calle Habana esq. Cuarteles, Habana Vieja",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "Creamos verdaderas obras de arte con el más puro sabor italiano.",
        specialties: ["Comida Italiana"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Bruschetta Clásica", price: "$3.200", desc: "Tomate, albahaca y aceite de oliva" },
                { item: "Provoleta", price: "$4.200", desc: "Queso provolone a la parrilla" },
                { item: "Antipasto Mixto", price: "$5.800", desc: "Jamón, queso, aceitunas y pepinillos" }
            ],
            mains: [
                { item: "Osso Buco", price: "$14.500", desc: "Con risotto milanés" },
                { item: "Saltimbocca", price: "$13.200", desc: "Lomo de ternera con jamón y salvia" }
            ],
            pasta: [
                { item: "Spaghetti Carbonara", price: "$9.500", desc: "Con huevo, panceta y queso pecorino" },
                { item: "Ravioli de Ricotta", price: "$10.200", desc: "Con salsa de tomate y albahaca" },
                { item: "Tagliatelle al Pesto", price: "$9.800", desc: "Salsa genovesa casera" },
                { item: "Lasagna Bolognesa", price: "$11.500", desc: "Receta tradicional emiliana" }
            ],
            sandwiches: [
                { item: "Panini Caprese", price: "$6.500", desc: "Mozzarella, tomate y pesto" },
                { item: "Ciabatta de Pollo", price: "$7.200", desc: "Pechuga, rúcula y parmesano" },
                { item: "Focaccia de Jamón", price: "$6.800", desc: "Jamón serrano y tomates secos" }
            ],
            desserts: [
                { item: "Tiramisú", price: "$4.500", desc: "Auténtico italiano con mascarpone" },
                { item: "Panna Cotta", price: "$3.800", desc: "Con coulis de frutos rojos" },
                { item: "Cannoli Siciliano", price: "$3.200", desc: "Relleno de ricotta y chocolate" }
            ],
            drinks: [
                { item: "Chianti Classico", price: "$12.000", desc: "Botella DOCG" },
                { item: "Prosecco", price: "$8.500", desc: "Espumante italiano" },
                { item: "Aperol Spritz", price: "$4.200", desc: "Cóctel clásico veneciano" }
            ]
        },
        hours: "⏰️ Mar-Dom: 18:00-02:00",
        phone: "#",
    },
    {
        id: 3,
        name: "Sapori",
        category: "bar",
        image: "imagenes/Sapori.jpg",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍| Calle 31 entre 6 y 8. Miramar. Playa.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "Con amor y con sabor. Postres peligrosamente adictivos.",
        specialties: ["Dulcería-Brunch"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Tostada Francesa", price: "$4.500", desc: "Con frutas frescas y miel" },
                { item: "Yogurt Griego", price: "$3.800", desc: "Con granola y frutos rojos" }
            ],
            mains: [
                { item: "Waffles Belgas", price: "$6.500", desc: "Con helado y salsa de chocolate" },
                { item: "Pancakes", price: "$5.800", desc: "Stack de 3 con maple syrup" }
            ],
            pasta: [
                { item: "Fettuccine al Huevo", price: "$8.200", desc: "Con mantequilla y parmesano" }
            ],
            sandwiches: [
                { item: "Bagel con Salmón", price: "$7.500", desc: "Queso crema, alcaparras y cebolla" },
                { item: "Sándwich de Huevo", price: "$5.200", desc: "Huevo poché, aguacate y espinaca" },
                { item: "Croissant Mixto", price: "$4.800", desc: "Jamón y queso gratinado" }
            ],
            desserts: [
                { item: "Cheesecake Oreo", price: "$4.800", desc: "Base de galleta y crema" },
                { item: "Torta de Chocolate", price: "$5.200", desc: "Húmeda con ganache" },
                { item: "Macarons", price: "$2.500", desc: "2 unidades, variedad de sabores" },
                { item: "Cupcakes", price: "$2.200", desc: "Decorados artesanalmente" }
            ],
            drinks: [
                { item: "Café Especial", price: "$2.500", desc: "Grano de origen único" },
                { item: "Chocolate Caliente", price: "$3.200", desc: "Con malvaviscos" },
                { item: "Smoothies", price: "$3.800", desc: "Frutas naturales" },
                { item: "Té Helado", price: "$2.200", desc: "Casero, varios sabores" }
            ]
        },
        hours: "⏰️ Lun-Dom: 8:00am-22:00pm",
        phone: "#",
    },
    {
        id: 4,
        name: "El Portal de Cojímar",
        category: "restaurant",
        image: "imagenes/El Portal de Cojimar.jpg",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Calle Morro, Esq. K, Cojímar",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "🍽 Restaurante familiar en Cojímar. A minutos del mar.",
        specialties: ["🔥 Parrilladas", "🦐 Mariscos", "🍕 Pizzas"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Ceviche de Pescado", price: "$4.500", desc: "Leche de tigre y camote" },
                { item: "Conchas de Mariscos", price: "$5.200", desc: "Gratinadas con queso" },
                { item: "Papa a la Huancaína", price: "$3.800", desc: "Salsa cremosa y aceitunas" }
            ],
            mains: [
                { item: "Parrilla del Mar", price: "$16.800", desc: "Langosta, camarones y pescado" },
                { item: "Chuleta de Cerdo", price: "$9.500", desc: "A la parrilla con yuca frita" },
                { item: "Pescado Entero", price: "$12.000", desc: "Frito o al ajillo" }
            ],
            pasta: [
                { item: "Pizza Familiar", price: "$11.500", desc: "8 porciones, 2 ingredientes" },
                { item: "Spaghetti con Mariscos", price: "$10.800", desc: "Salsa de tomate y langostinos" }
            ],
            sandwiches: [
                { item: "Sándwich de Pescado", price: "$7.800", desc: "Filete empanizado con tártara" },
                { item: "Torta de Jamón", price: "$5.500", desc: "Jamón, queso y aguacate" },
                { item: "Wrap de Pollo", price: "$6.200", desc: "Pollo grille, vegetales y aderezo" }
            ],
            desserts: [
                { item: "Suspiro Limeño", price: "$3.500", desc: "Dulce de leche y merengue" },
                { item: "Mazamorra Morada", price: "$2.800", desc: "Postre tradicional peruano" }
            ],
            drinks: [
                { item: "Pisco Sour", price: "$3.800", desc: "Cóctel bandera peruano" },
                { item: "Chicha Morada", price: "$2.200", desc: "Bebida de maíz morado" },
                { item: "Limonada Frozen", price: "$2.500", desc: "Con hierbabuena" }
            ]
        },
        hours: "⏰️ Lun-Dom: 8:00am-22:00pm",
        phone: "53 55422269",
    },
    {
        id: 5,
        name: "Los 3 Chinitos",
        category: "restaurant",
        image: "imagenes/Los 3 Chinitos.jpg",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Calle 10 entre 3ra y 5ta Miramar",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "Bienvenidos a Los 3 Chinitos en Miramar. Servicio a Domicilio en toda la Habana.",
        specialties: ["pizzas grandes con agregos exóticos"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Palitos de Queso", price: "$3.200", desc: "Con salsa marinara" },
                { item: "Alitas de Pollo", price: "$4.500", desc: "6 unidades, BBQ o picantes" },
                { item: "Aros de Cebolla", price: "$3.500", desc: "Empanizados y crujientes" }
            ],
            mains: [
                { item: "Pizza Extravaganza", price: "$13.500", desc: "Pepperoni, champiñones, pimientos" },
                { item: "Pizza Hawaiana", price: "$12.800", desc: "Jamón y piña" },
                { item: "Pizza 4 Quesos", price: "$14.200", desc: "Mozzarella, cheddar, parmesano, gorgonzola" }
            ],
            pasta: [
                { item: "Spaghetti con Albóndigas", price: "$8.500", desc: "Salsa de tomate casera" },
                { item: "Fettuccine Carbonara", price: "$9.200", desc: "Crema, panceta y huevo" }
            ],
            sandwiches: [
                { item: "Sub de Pepperoni", price: "$7.500", desc: "Pepperoni, queso y vegetales" },
                { item: "Sándwich de Pollo BBQ", price: "$6.800", desc: "Pollo desmenuzado con salsa BBQ" },
                { item: "Calzone Especial", price: "$9.500", desc: "Relleno de jamón, queso y champiñones" }
            ],
            desserts: [
                { item: "Pizza de Nutella", price: "$6.500", desc: "Con fresas y plátano" },
                { item: "Cinnamon Rolls", price: "$3.200", desc: "2 unidades con glaseado" }
            ],
            drinks: [
                { item: "Cerveza Artesanal", price: "$3.500", desc: "IPA o Stout local" },
                { item: "Malteada", price: "$4.200", desc: "Vainilla, chocolate o fresa" },
                { item: "Soda Italiana", price: "$2.800", desc: "Jarabe de frutas con gas" }
            ]
        },
        hours: "⏰️ Lun-Dom: 8:00am-22:00pm",
        phone: "+53 56143419",
    },
    {
        id: 6,
        name: "Café de la Esquina",
        category: "restaurant",
        image: "imagenes/Café de la Esquina.webp",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Calle 10 entre 3ra y 5ta Miramar",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "¡No pierdas la oportunidad, únete a esta experiencia de sabores únicos!",
        specialties: ["Fusión entre comida cubana e italiana 🇨🇺🇮🇹"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Tamal en Cazuela", price: "$3.800", desc: "Versión gourmet del clásico" },
                { item: "Focaccia de Hierbas", price: "$2.500", desc: "Con aceite de oliva y romero" },
                { item: "Yuca con Mojo", price: "$2.800", desc: "Aliño de ajo y limón" }
            ],
            mains: [
                { item: "Ropa Vieja Risotto", price: "$11.500", desc: "Fusión cubano-italiana" },
                { item: "Lechón Asado", price: "$13.200", desc: "Con congrí y yuca" },
                { item: "Pollo al Ajillo", price: "$9.800", desc: "Con vino blanco y champiñones" }
            ],
            pasta: [
                { item: "Spaghetti con Ropa Vieja", price: "$10.500", desc: "Nuestra especialidad fusión" },
                { item: "Ravioli de Plátano", price: "$9.800", desc: "Relleno de plátano macho" }
            ],
            sandwiches: [
                { item: "Cubano Especial", price: "$7.200", desc: "Lechón, jamón y queso suizo" },
                { item: "Medianoche", price: "$6.500", desc: "Pan dulce, jamón y queso" },
                { item: "Elena Ruz", price: "$5.800", desc: "Pavo, crema de queso y mermelada" },
                { item: "Pan con Bistec", price: "$8.200", desc: "Palomilla, cebolla y papas fritas" }
            ],
            desserts: [
                { item: "Tres Leches", price: "$3.800", desc: "Clásico cubano" },
                { item: "Tiramisú de Ron", price: "$4.500", desc: "Con añejo havana club" },
                { item: "Flan de Coco", price: "$3.200", desc: "Con salsa de caramelo" }
            ],
            drinks: [
                { item: "Café Cubano", price: "$1.500", desc: "Expresso intenso" },
                { item: "Cortadito", price: "$2.000", desc: "Con leche evaporada" },
                { item: "Café Bombón", price: "$2.500", desc: "Con leche condensada" },
                { item: "Mojito", price: "$3.500", desc: "Clásico cubano" }
            ]
        },
        hours: "⏰️ Lun-Dom: 10:30am-23:30pm",
        phone: "78362565",
    },
    {
        id: 7,
        name: "Ela & Paleta",
        category: "icecream",
        image: "imagenes/Ela & Paleta.jpg",
        rating: 4.9,
        reviews: 512,
        address: "Calle 9na. e/ F y G, Vedado.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3285!2d-58.42!3d-34.55!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDMzJzAwLjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "Dicen que los colores hacen la vida más bonita... 🌈Y si la disfrutas con un helado, puede ser perfecta. 🍨💕",
        specialties: ["🍦Helado artesanal, inclusivo y sabroso."],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Mini Cono Degustación", price: "$1.800", desc: "3 mini porciones para probar" }
            ],
            mains: [
                { item: "Waffle con Helado", price: "$5.500", desc: "Con 2 sabores a elección" },
                { item: "Brownie Caliente", price: "$6.200", desc: "Con bola de helado vainilla" }
            ],
            pasta: [],
            sandwiches: [
                { item: "Donuts Rellenos", price: "$3.200", desc: "De crema pastelera y chocolate" },
                { item: "Cookie Sándwich", price: "$4.500", desc: "2 galletas con helado en medio" }
            ],
            desserts: [
                { item: "1/4 kg (2 sabores)", price: "$3.800", desc: "Incluye cucurucho o envase" },
                { item: "1/2 kg (3 sabores)", price: "$6.200", desc: "Ideal para compartir" },
                { item: "1 kg (4 sabores)", price: "$11.500", desc: "Familiar" },
                { item: "Cucurucho Gourmet", price: "$2.500", desc: "Con chocolate y almendras" },
                { item: "Café Affogato", price: "$4.200", desc: "Helado de vainilla con espresso" },
                { item: "Sundae Especial", price: "$5.800", desc: "Con salsa, crema y frutos" }
            ],
            drinks: [
                { item: "Smoothie de Helado", price: "$4.500", desc: "Batido cremoso de helado" },
                { item: "Granizado", price: "$3.200", desc: "Café o limón con helado" },
                { item: "Agua Mineral", price: "$1.800", desc: "Con o sin gas" }
            ]
        },
        hours: "Lun-Dom: 10:00am-1:00am",
        phone: "#",
    },
    {
        id: 8,
        name: "LILU CHURROS CUBA",
        category: "streetfood",
        image: "imagenes/Lilu-Churros.jpg",
        rating: 4.7,
        reviews: 267,
        address: "Linea no. 406 e/ F y G, VEDADO.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.2!2d-58.36!3d-34.61!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM2JzM2LjAiUyA1OMKwMjEnMzYuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "Food truck de tacos auténticos mexicanos. Tortillas hechas a mano y salsas caseras picantes.",
        specialties: ["Churros Rellenos"],
        priceRange: "$",
        menu: {
            entrees: [
                { item: "Totopos con Guacamole", price: "$2.800", desc: "Totopos caseros con guacamole fresco" },
                { item: "Elote", price: "$1.800", desc: "Mazorca con mayo, queso y chile" },
                { item: "Chicharrones", price: "$2.200", desc: "Con salsa verde picante" }
            ],
            mains: [
                { item: "Taco al Pastor", price: "$1.200", desc: "Cerdo marinado con piña" },
                { item: "Taco de Carnitas", price: "$1.300", desc: "Cerdo desmenuzado crujiente" },
                { item: "Taco de Barbacoa", price: "$1.400", desc: "Res al horno underground" },
                { item: "Quesadilla", price: "$2.500", desc: "Con queso Oaxaca y guacamole" },
                { item: "Burrito", price: "$3.800", desc: "Grande con arroz, frijoles y carne" }
            ],
            pasta: [],
            sandwiches: [
                { item: "Torta de Milanesa", price: "$4.500", desc: "Pollo empanizado con aguacate" },
                { item: "Pambazo", price: "$3.800", desc: "Pan en salsa de chile guajillo" }
            ],
            desserts: [
                { item: "Churros", price: "$2.500", desc: "4 unidades con chocolate caliente" },
                { item: "Flan Napolitano", price: "$2.200", desc: "Con cajeta" }
            ],
            drinks: [
                { item: "Agua de Horchata", price: "$900", desc: "Bebida tradicional de arroz" },
                { item: "Agua de Jamaica", price: "$900", desc: "Flor de jamaica" },
                { item: "Michelada", price: "$2.800", desc: "Cerveza con limón y especias" },
                { item: "Refresco Mexicano", price: "$1.200", desc: "Jarritos, variedad de sabores" }
            ]
        },
        hours: "Vie-Dom: 19:00-02:00",
        phone: "+54 11 5678-9012",
        distance: 3.1
    },
    {
        id: 9,
        name: "Crispy Chicken",
        category: "restaurant",
        image: "imagenes/Crispy Chicken.jpg",
        rating: 4.5,
        reviews: 198,
        address: "🗺️📍Ave. Acosta, esq Juan Delgado,Monaco",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.3!2d-58.41!3d-34.59!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM1JzI0LjAiUyA1OMKwMjQnMzYuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "El secreto de la felicidad está en un pollito.",
        specialties: ["Variedades de Pollo y otras delicias 🍗🧋"],
        priceRange: "$$$$",
        menu: {
            entrees: [
                { item: "Edamame", price: "$2.800", desc: "Con sal de mar" },
                { item: "Gyozas de Cerdo", price: "$4.200", desc: "6 unidades, fritas o al vapor" },
                { item: "Tempura de Langostinos", price: "$5.800", desc: "4 unidades con salsa tentsuyu" }
            ],
            mains: [
                { item: "Tabla Omakase (15 piezas)", price: "$15.000", desc: "Selección del chef" },
                { item: "Sashimi Mixto", price: "$8.900", desc: "12 cortes de salmón, atún y pez blanco" },
                { item: "Tartar de Atún", price: "$6.500", desc: "Con aguacate y salsa ponzu" }
            ],
            pasta: [
                { item: "Yakisoba", price: "$7.200", desc: "Fideos salteados con vegetales" }
            ],
            sandwiches: [
                { item: "Sushi Burger", price: "$8.500", desc: "Arroz tempurizado con salmón" },
                { item: "Onigiri Mixto", price: "$4.200", desc: "3 piezas, variados rellenos" }
            ],
            desserts: [
                { item: "Mochi de Matcha", price: "$3.200", desc: "2 unidades" },
                { item: "Helado de Sésamo Negro", price: "$3.800", desc: "Con coulis de frambuesa" },
                { item: "Dorayaki", price: "$2.800", desc: "Panqueque japonés relleno" }
            ],
            drinks: [
                { item: "Sake Premium", price: "$12.000", desc: "Botella Dassai 23" },
                { item: "Sake Caliente", price: "$3.500", desc: "Por copa" },
                { item: "Té Verde Japonés", price: "$2.200", desc: "Genmaicha o sencha" },
                { item: "Ramune", price: "$2.800", desc: "Refresco japonés" }
            ]
        },
        hours: "Lun-Dom: 10:00am-23:30pm",
        phone: "+53 63182745",
    },
    {
        id: 10,
        name: "Cafetería Pilón",
        category: "bar",
        image: "imagenes/Cafetería Pilón.jpg",
        rating: 4.4,
        reviews: 156,
        address: "Calle 25 entre M y N",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.1!2d-58.37!3d-34.62!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM3JzEyLjAiUyA1OMKwMjInMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "nuevos espacios para pilonear junto a nosotros.",
        specialties: ["Descubrelo"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Medialunas", price: "$1.800", desc: "2 unidades, dulces o saladas" },
                { item: "Tostado de Campo", price: "$3.200", desc: "Con jamón crudo y rúcula" }
            ],
            mains: [
                { item: "Avocado Toast", price: "$4.500", desc: "Con huevo pochado y semillas" },
                { item: "Huevos Benedictinos", price: "$5.800", desc: "Con salsa holandesa" },
                { item: "Tostado J&Q", price: "$3.800", desc: "Jamón, queso y tomate" }
            ],
            pasta: [],
            sandwiches: [
                { item: "Sándwich de Salmón", price: "$7.200", desc: "Salmón ahumado y queso crema" },
                { item: "Bagel de Pavo", price: "$6.500", desc: "Pavo, rúcula y mostaza dulce" },
                { item: "Ciabatta Caprese", price: "$5.800", desc: "Mozzarella fresca y tomate" }
            ],
            desserts: [
                { item: "Cheesecake", price: "$3.200", desc: "Estilo Nueva York con frutos rojos" },
                { item: "Carrot Cake", price: "$3.500", desc: "Con frosting de queso crema" },
                { item: "Cookie Gigante", price: "$2.200", desc: "Con chips de chocolate" }
            ],
            drinks: [
                { item: "Flat White", price: "$1.800", desc: "Doble espresso con leche texturizada" },
                { item: "Café Filtrado", price: "$1.500", desc: "Origen Colombia, notas cítricas" },
                { item: "Cold Brew", price: "$2.200", desc: "Extracción en frío 12 horas" },
                { item: "Chai Latte", price: "$2.500", desc: "Té especiado con leche" }
            ]
        },
        hours: "Lun-Vie: 08:00-20:00, Sáb-Dom: 09:00-21:00",
        phone: "#",
    },
    {
        id: 11,
        name: "Parranda Grill Bar",
        category: "restaurant",
        image: "imagenes/Parranda Grill Bar.jpg",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍O'farrill #366 % D'strampes y Figueroa. La víbora.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "✨Una vista perfecta al horizonte habanero✨",
        specialties: ["picadera Parrandas te garantiza una experiencia agradable y entretenida"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Lun-Dom: 12:00am-00:00pm",
        phone: "#",
    },
    {
        id: 12,
        name: "Sensaciones Restaurante-Grill",
        category: "restaurant",
        image: "imagenes/Sensacioones Restaurante-Grill.jpg",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Calle 70 No. 902 entre 9na y 11, Playa",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "Dónde comer es un placer✨ Una experiencia del Grupo Tentaciones",
        specialties: ["Sabores frescos, platos sorprendentes"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Lun-Dom: 12:00am-00:00pm",
        phone: "#",
    },
    {
        id: 13,
        name: "RESTAURANTE EL JARDIN",
        category: "restaurant",
        image: "imagenes/RESTAURANTE EL JARDIN.jpg",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Linea y Calle C, Vedado",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "El espacio ideal para disfrutar en familia",
        specialties: ["🥘Comida criolla e internacional"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Lun-Dom: 12:00am-00:00pm",
        phone: "7 8311414",
    },
    {
        id: 14,
        name: "La Despensa",
        category: "restaurant",
        image: "imagenes/La despensa.jpg",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Calle 9 / F y G",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "💛 Sabor Tropical 🍻🌴.Tu nuevo vicio en el Vedado",
        specialties: ["Personaliza🍕 | Disfruta 🥪| Dispensa 🍺"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Lun-Dom: 7:30am-3:00am",
        phone: "7 8311414",
    },
    {
        id: 15,
        name: "Fuego Lento Steakhouse",
        category: "restaurant",
        image: "imagenes/Fuego Lento Steakhouse.jpg",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Calle 1ra e/ C y D, Vedado",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "🧑🏾‍🍳 Hay sabores que no se apresuran... se construyen. Esta tabla nace del respeto por el tiempo, la brasa y la buena carne.",
        specialties: ["CORTES & CARNES"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Lun-Dom: 12:30pm-12:00am",
        phone: "+53 52145269",
    },
    {
        id: 16,
        name: "Sabores",
        category: "restaurant",
        image: "imagenes/Sabores.webp",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Calle 1ra e/ C y D, Vedado",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "Sabores, en el Palacio del Conde Lombillo🏛️.",
        specialties: ["Descubrelo"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Lun-Dom: 12:30pm-12:00am",
        phone: "#",
    },
    {
        id: 17,
        name: "The Monkey Restobar",
        category: "restaurant",
        image: "imagenes/The Monkey Restobar.jpg",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Calle L e/ calle 17 y calle 15, Vedado.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "RestoBar-Eventos privados-DJ Session🎧.",
        specialties: ["Especializados en comida internacional y cortes de carnes🥩"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Lun-Dom: 10:00pm-1:00am",
        phone: "+53 58058576",
    },
    {
        id: 18,
        name: "Malcriado",
        category: "bar",
        image: "imagenes/Malcriado.webp",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Calle Infanta entre Jovellar y San Lázaro # 202A",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "Aquí el sabor no tiene reglas, las reglas las pones tu..",
        specialties: ["☕️Rico café y más"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Tostada Francesa", price: "$4.500", desc: "Con frutas frescas y miel" },
                { item: "Yogurt Griego", price: "$3.800", desc: "Con granola y frutos rojos" }
            ],
            mains: [
                { item: "Waffles Belgas", price: "$6.500", desc: "Con helado y salsa de chocolate" },
                { item: "Pancakes", price: "$5.800", desc: "Stack de 3 con maple syrup" }
            ],
            pasta: [
                { item: "Fettuccine al Huevo", price: "$8.200", desc: "Con mantequilla y parmesano" }
            ],
            sandwiches: [
                { item: "Bagel con Salmón", price: "$7.500", desc: "Queso crema, alcaparras y cebolla" },
                { item: "Sándwich de Huevo", price: "$5.200", desc: "Huevo poché, aguacate y espinaca" },
                { item: "Croissant Mixto", price: "$4.800", desc: "Jamón y queso gratinado" }
            ],
            desserts: [
                { item: "Cheesecake Oreo", price: "$4.800", desc: "Base de galleta y crema" },
                { item: "Torta de Chocolate", price: "$5.200", desc: "Húmeda con ganache" },
                { item: "Macarons", price: "$2.500", desc: "2 unidades, variedad de sabores" },
                { item: "Cupcakes", price: "$2.200", desc: "Decorados artesanalmente" }
            ],
            drinks: [
                { item: "Café Especial", price: "$2.500", desc: "Grano de origen único" },
                { item: "Chocolate Caliente", price: "$3.200", desc: "Con malvaviscos" },
                { item: "Smoothies", price: "$3.800", desc: "Frutas naturales" },
                { item: "Té Helado", price: "$2.200", desc: "Casero, varios sabores" }
            ]
        },
        hours: "⏰️ Lun-Dom: 8:00am-22:00pm",
        phone: "#",
    },
    {
        id: 19,
        name: "El Frito",
        category: "bar",
        image: "imagenes/El Frito.jpg",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Calle Aguacate entre Obispo y Obrapía. Habana Vieja",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "Apúrate y prueba las alitas antes de que vuelen 😏",
        specialties: ["Alitas crujientes, croquetas saciantes, papas fritas en su punto"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Tostada Francesa", price: "$4.500", desc: "Con frutas frescas y miel" },
                { item: "Yogurt Griego", price: "$3.800", desc: "Con granola y frutos rojos" }
            ],
            mains: [
                { item: "Waffles Belgas", price: "$6.500", desc: "Con helado y salsa de chocolate" },
                { item: "Pancakes", price: "$5.800", desc: "Stack de 3 con maple syrup" }
            ],
            pasta: [
                { item: "Fettuccine al Huevo", price: "$8.200", desc: "Con mantequilla y parmesano" }
            ],
            sandwiches: [
                { item: "Bagel con Salmón", price: "$7.500", desc: "Queso crema, alcaparras y cebolla" },
                { item: "Sándwich de Huevo", price: "$5.200", desc: "Huevo poché, aguacate y espinaca" },
                { item: "Croissant Mixto", price: "$4.800", desc: "Jamón y queso gratinado" }
            ],
            desserts: [
                { item: "Cheesecake Oreo", price: "$4.800", desc: "Base de galleta y crema" },
                { item: "Torta de Chocolate", price: "$5.200", desc: "Húmeda con ganache" },
                { item: "Macarons", price: "$2.500", desc: "2 unidades, variedad de sabores" },
                { item: "Cupcakes", price: "$2.200", desc: "Decorados artesanalmente" }
            ],
            drinks: [
                { item: "Café Especial", price: "$2.500", desc: "Grano de origen único" },
                { item: "Chocolate Caliente", price: "$3.200", desc: "Con malvaviscos" },
                { item: "Smoothies", price: "$3.800", desc: "Frutas naturales" },
                { item: "Té Helado", price: "$2.200", desc: "Casero, varios sabores" }
            ]
        },
        hours: "⏰️ Lun-Dom: 10:00am-19:30pm",
        phone: "#",
    },
    {
        id: 20,
        name: "Birra | Casa de la Cerveza",
        category: "bar",
        image: "imagenes/Birra  Casa de la Cerveza.jpg",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍15 entre L y K #153.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "🍺 Cerveza siempre helada y gran variedad.",
        specialties: ["🍸 Cocteles únicos con base de cerveza."],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Tostada Francesa", price: "$4.500", desc: "Con frutas frescas y miel" },
                { item: "Yogurt Griego", price: "$3.800", desc: "Con granola y frutos rojos" }
            ],
            mains: [
                { item: "Waffles Belgas", price: "$6.500", desc: "Con helado y salsa de chocolate" },
                { item: "Pancakes", price: "$5.800", desc: "Stack de 3 con maple syrup" }
            ],
            pasta: [
                { item: "Fettuccine al Huevo", price: "$8.200", desc: "Con mantequilla y parmesano" }
            ],
            sandwiches: [
                { item: "Bagel con Salmón", price: "$7.500", desc: "Queso crema, alcaparras y cebolla" },
                { item: "Sándwich de Huevo", price: "$5.200", desc: "Huevo poché, aguacate y espinaca" },
                { item: "Croissant Mixto", price: "$4.800", desc: "Jamón y queso gratinado" }
            ],
            desserts: [
                { item: "Cheesecake Oreo", price: "$4.800", desc: "Base de galleta y crema" },
                { item: "Torta de Chocolate", price: "$5.200", desc: "Húmeda con ganache" },
                { item: "Macarons", price: "$2.500", desc: "2 unidades, variedad de sabores" },
                { item: "Cupcakes", price: "$2.200", desc: "Decorados artesanalmente" }
            ],
            drinks: [
                { item: "Café Especial", price: "$2.500", desc: "Grano de origen único" },
                { item: "Chocolate Caliente", price: "$3.200", desc: "Con malvaviscos" },
                { item: "Smoothies", price: "$3.800", desc: "Frutas naturales" },
                { item: "Té Helado", price: "$2.200", desc: "Casero, varios sabores" }
            ]
        },
        hours: "⏰️ Lun-Jue: 10:00am-23:00pm Vie-Dom: 10:00am-00:00am  ",
        phone: "#",
    },
    {
        id: 21,
        name: "JAMA | Best sushi in Town 💎",
        category: "restaurant",
        image: "imagenes/Best Sushi in Town.jpg",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Aguiar 261 entre O'Really y San Juan de Dios.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "Best Sushi in Town.",
        specialties: ["Sushi"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Lun-Dom: 10:00pm-1:00am",
        phone: "+53 58058576",
    },
    {
        id: 22,
        name: "Café Literario La Copa",
        category: "bar",
        image: "imagenes/Café Literario La Copa.jpg",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍1ra A/42 y 44, La Copa, Playa.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "🤎✨ Un rincón para leer, crear y saborear.",
        specialties: ["Descrubelo"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Tostada Francesa", price: "$4.500", desc: "Con frutas frescas y miel" },
                { item: "Yogurt Griego", price: "$3.800", desc: "Con granola y frutos rojos" }
            ],
            mains: [
                { item: "Waffles Belgas", price: "$6.500", desc: "Con helado y salsa de chocolate" },
                { item: "Pancakes", price: "$5.800", desc: "Stack de 3 con maple syrup" }
            ],
            pasta: [
                { item: "Fettuccine al Huevo", price: "$8.200", desc: "Con mantequilla y parmesano" }
            ],
            sandwiches: [
                { item: "Bagel con Salmón", price: "$7.500", desc: "Queso crema, alcaparras y cebolla" },
                { item: "Sándwich de Huevo", price: "$5.200", desc: "Huevo poché, aguacate y espinaca" },
                { item: "Croissant Mixto", price: "$4.800", desc: "Jamón y queso gratinado" }
            ],
            desserts: [
                { item: "Cheesecake Oreo", price: "$4.800", desc: "Base de galleta y crema" },
                { item: "Torta de Chocolate", price: "$5.200", desc: "Húmeda con ganache" },
                { item: "Macarons", price: "$2.500", desc: "2 unidades, variedad de sabores" },
                { item: "Cupcakes", price: "$2.200", desc: "Decorados artesanalmente" }
            ],
            drinks: [
                { item: "Café Especial", price: "$2.500", desc: "Grano de origen único" },
                { item: "Chocolate Caliente", price: "$3.200", desc: "Con malvaviscos" },
                { item: "Smoothies", price: "$3.800", desc: "Frutas naturales" },
                { item: "Té Helado", price: "$2.200", desc: "Casero, varios sabores" }
            ]
        },
        hours: "⏰️ Lun-Jue: 9:00am-17:00pm",
        phone: "#",
    },
    {
        id: 23,
        name: "LUQUE HABANA",
        category: "restaurant",
        image: "imagenes/LUQUE HABANA.jpg",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Calle G #556 / 23 y 25. Vedado.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "Prueba nuestras pizzas y pastas 🍕🍝. Disfruta de cócteles clásicos 🍹🍸.",
        specialties: ["Especializado en comida italiana"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Lun-Dom: 11:00pm-23:30pm",
        phone: "+53 50633569",
    },
    {
        id: 24,
        name: "Encuentro Restaurante Chino",
        category: "restaurant",
        image: "imagenes/Encuentro Restaurante Chino.webp",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Hotel Manzana Kempinski piso 2.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "🔥 Donde hay fuego, hay sabor.Y en Encuentro, el fuego es solo el comienzo.",
        specialties: ["Hot pot & Auténtica Comida China en Cuba"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Lun-Dom: 12:00pm-00:00am",
        phone: "+53 50134757",
    },
    {
        id: 25,
        name: "𝐋𝐀 𝐂𝐀𝐑𝐑𝐄𝐓𝐀",
        category: "restaurant",
        image: "imagenes/La Carreta.webp",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Calle 21. Esq. K Vedado.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "⭐️El Icónico Famoso Restaurant en CUBA donde nació LA CARRETA ORIGINAL. Música en vivo a diario",
        specialties: ["Hot pot & Auténtica Comida China en Cuba"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Lun-Dom: 12:00pm-00:00am",
        phone: "#",
    },
    {
        id: 26,
        name: "Café Clington",
        category: "bar",
        image: "imagenes/Café Clington.jpg",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Calle 60 e/ 3era y 3era A no.303,Playa.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "“Unirnos es un comienzo ,estar juntos es un progreso y trabajar juntos es un éxito“🧡",
        specialties: ["Descrubelo"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Tostada Francesa", price: "$4.500", desc: "Con frutas frescas y miel" },
                { item: "Yogurt Griego", price: "$3.800", desc: "Con granola y frutos rojos" }
            ],
            mains: [
                { item: "Waffles Belgas", price: "$6.500", desc: "Con helado y salsa de chocolate" },
                { item: "Pancakes", price: "$5.800", desc: "Stack de 3 con maple syrup" }
            ],
            pasta: [
                { item: "Fettuccine al Huevo", price: "$8.200", desc: "Con mantequilla y parmesano" }
            ],
            sandwiches: [
                { item: "Bagel con Salmón", price: "$7.500", desc: "Queso crema, alcaparras y cebolla" },
                { item: "Sándwich de Huevo", price: "$5.200", desc: "Huevo poché, aguacate y espinaca" },
                { item: "Croissant Mixto", price: "$4.800", desc: "Jamón y queso gratinado" }
            ],
            desserts: [
                { item: "Cheesecake Oreo", price: "$4.800", desc: "Base de galleta y crema" },
                { item: "Torta de Chocolate", price: "$5.200", desc: "Húmeda con ganache" },
                { item: "Macarons", price: "$2.500", desc: "2 unidades, variedad de sabores" },
                { item: "Cupcakes", price: "$2.200", desc: "Decorados artesanalmente" }
            ],
            drinks: [
                { item: "Café Especial", price: "$2.500", desc: "Grano de origen único" },
                { item: "Chocolate Caliente", price: "$3.200", desc: "Con malvaviscos" },
                { item: "Smoothies", price: "$3.800", desc: "Frutas naturales" },
                { item: "Té Helado", price: "$2.200", desc: "Casero, varios sabores" }
            ]
        },
        hours: "⏰️ Lun-Jue: 9:00am-20:00pm",
        phone: "#",
    },
    {
        id: 27,
        name: "Food Master",
        category: "restaurant",
        image: "imagenes/Food Master.jpg",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Calle 7ma A #6620 e/66 y 70 Miramar ",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "Porque los buenos momentos merecen un buen lugar. 💚💚💚",
        specialties: ["BURGER 🍔 PIZZA 🍕 PASTA & GOOD MOOD"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Dom-Jue: 11:00am- 21:00pm Vie-Sab 11:00am-22:00am",
        phone: "#",
    },
    {
        id: 28,
        name: "Sibarita 🍍",
        category: "restaurant",
        image: "imagenes/sibarita.jpg",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍O'Reilly 528 / Bernaza y Villegas, Habana Vieja.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "🌎 Cuban Food & Tiki Cocktails 🗿🍸. Havanos & Hookahs | Live Music&DJs🎶.",
        specialties: ["Descubrelo"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Lun-Dom: 12:00pm-00:00am",
        phone: "#",
    },
    {
        id: 29,
        name: "EL PROYECTO",
        category: "bar",
        image: "imagenes/EL PROYECTO.jpg",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍14 y 11, Vedado",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "🎥 cine gratis en un portal.",
        specialties: ["Descrubelo"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Tostada Francesa", price: "$4.500", desc: "Con frutas frescas y miel" },
                { item: "Yogurt Griego", price: "$3.800", desc: "Con granola y frutos rojos" }
            ],
            mains: [
                { item: "Waffles Belgas", price: "$6.500", desc: "Con helado y salsa de chocolate" },
                { item: "Pancakes", price: "$5.800", desc: "Stack de 3 con maple syrup" }
            ],
            pasta: [
                { item: "Fettuccine al Huevo", price: "$8.200", desc: "Con mantequilla y parmesano" }
            ],
            sandwiches: [
                { item: "Bagel con Salmón", price: "$7.500", desc: "Queso crema, alcaparras y cebolla" },
                { item: "Sándwich de Huevo", price: "$5.200", desc: "Huevo poché, aguacate y espinaca" },
                { item: "Croissant Mixto", price: "$4.800", desc: "Jamón y queso gratinado" }
            ],
            desserts: [
                { item: "Cheesecake Oreo", price: "$4.800", desc: "Base de galleta y crema" },
                { item: "Torta de Chocolate", price: "$5.200", desc: "Húmeda con ganache" },
                { item: "Macarons", price: "$2.500", desc: "2 unidades, variedad de sabores" },
                { item: "Cupcakes", price: "$2.200", desc: "Decorados artesanalmente" }
            ],
            drinks: [
                { item: "Café Especial", price: "$2.500", desc: "Grano de origen único" },
                { item: "Chocolate Caliente", price: "$3.200", desc: "Con malvaviscos" },
                { item: "Smoothies", price: "$3.800", desc: "Frutas naturales" },
                { item: "Té Helado", price: "$2.200", desc: "Casero, varios sabores" }
            ]
        },
        hours: "⏰️ Lun-Jue: 9:00am-20:00pm",
        phone: "#",
    },
    {
        id: 30,
        name: "Mila",
        category: "restaurant",
        image: "imagenes/Mila.webp",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Calle 9na/J e I # 254 Vedado.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "Un spot italiano con detalles que enamoran desde que entras.",
        specialties: ["🍕Auténtica Cocina Italiana en La Habana"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Lun-Dom: 12:00pm-23:00am",
        phone: "+53 58695188",
    },
    {
        id: 31,
        name: "Brasserie 255 Restaurant",
        category: "restaurant",
        image: "imagenes/Brasserie 255 Restaurant.webp",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Juan Delgado 255, entre Santa Catalina y Milagros Santos Suarez.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "Sabores que te hacen querer volver ✨",
        specialties: ["Desayuno | Almuerzo | Cena 🍽️🍷"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Lun-Dom: 8:00am-23:00am",
        phone: "+53 56147642",
    },
    {
        id: 32,
        name: "ATENEO DE LA HABANA",
        category: "Bar",
        image: "imagenes/ATENEO DE LA HABANA.webp",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Prado 121 esquina Refugio.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "Creando un espacio para todxs 🌈",
        specialties: ["☕ Café Ateneo"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Lun-Vie: 8:30am-18:00pm Sab-Dom: 10:00am-18:00pm ",
        phone: "+53 52845235",
    },
    {
        id: 33,
        name: "Paladar Kilómetro Zero",
        category: "restaurant",
        image: "imagenes/Paladar Kilómetro Zero.jpg",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Juan Delgado 255, entre Santa Catalina y Milagros Santos Suarez.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "Sabores que te hacen querer volver ✨",
        specialties: ["Desayuno | Almuerzo | Cena 🍽️🍷"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Lun-Dom: 8:00am-23:00am",
        phone: "+53 56147642",
    },
    {
        id: 34,
        name: "Kore • Café",
        category: "Bar",
        image: "imagenes/Kore • Café.webp",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Calzada y K, Vedado.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "Si buscas un almuerzo que te deje satisfecho pero ligero para seguir con tu día, nuestra Ensalada César es la respuesta definitiva.😌👌🏻",
        specialties: ["🧇 Waffles, ☕️ Cafés, 🥗 Ensaladas, 🐾Pet Friendly"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Lun-Dom: 7:00am-00:00am ",
        phone: "#",
    },
    {
        id: 35,
        name: "Mambo",
        category: "restaurant",
        image: "imagenes/Mambo.jpg",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Ave 23 entre 12 y 14",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "📍Donde se vive el entretenimiento en vivo.✨Experimenta el Multiverso Mambo✨",
        specialties: ["Descrubelo"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Lun-Dom: 11:00am-00:00am",
        phone: "#",
    },
    {
        id: 36,
        name: "Zooppelia 🍦 Heladería",
        category: "icecream",
        image: "imagenes/Zooppelia 🍦 Heladería.jpg",
        rating: 4.9,
        reviews: 512,
        address: "Calle 9na. e/ F y G, Vedado.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3285!2d-58.42!3d-34.55!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDMzJzAwLjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "En @zoomarket_habana podrás comprar Helados, Yogurts probióticos y otros productos de Helados CID.",
        specialties: ["Descubrelo"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Mini Cono Degustación", price: "$1.800", desc: "3 mini porciones para probar" }
            ],
            mains: [
                { item: "Waffle con Helado", price: "$5.500", desc: "Con 2 sabores a elección" },
                { item: "Brownie Caliente", price: "$6.200", desc: "Con bola de helado vainilla" }
            ],
            pasta: [],
            sandwiches: [
                { item: "Donuts Rellenos", price: "$3.200", desc: "De crema pastelera y chocolate" },
                { item: "Cookie Sándwich", price: "$4.500", desc: "2 galletas con helado en medio" }
            ],
            desserts: [
                { item: "1/4 kg (2 sabores)", price: "$3.800", desc: "Incluye cucurucho o envase" },
                { item: "1/2 kg (3 sabores)", price: "$6.200", desc: "Ideal para compartir" },
                { item: "1 kg (4 sabores)", price: "$11.500", desc: "Familiar" },
                { item: "Cucurucho Gourmet", price: "$2.500", desc: "Con chocolate y almendras" },
                { item: "Café Affogato", price: "$4.200", desc: "Helado de vainilla con espresso" },
                { item: "Sundae Especial", price: "$5.800", desc: "Con salsa, crema y frutos" }
            ],
            drinks: [
                { item: "Smoothie de Helado", price: "$4.500", desc: "Batido cremoso de helado" },
                { item: "Granizado", price: "$3.200", desc: "Café o limón con helado" },
                { item: "Agua Mineral", price: "$1.800", desc: "Con o sin gas" }
            ]
        },
        hours: "Lun-Dom: 10:00am-1:00am",
        phone: "#",
    },
    {
        id: 37,
        name: "IMPERIOS",
        category: "restaurant",
        image: "imagenes/IMPERIOS.jpg",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Avenida 9na #12018 entre calle 120 y 130 Reparto Cubanacan ,playa.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "Vive una experiencia en cada nivel: Sport Bar(billar🎱 y dardos🎯) ●Discoteca(Vie-Sáb DJ+shows)",
        specialties: ["●Terraza con pizzas y parrilladas."],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Lun-Mie: 12:00pm-00:00am Jue-Dom: 12:00pm-3:00am",
        phone: "+53 50284747",
    },
    {
        id: 38,
        name: "Alta Casa",
        category: "restaurant",
        image: "imagenes/Alta Casa.jpg",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Calle 47 # 807 e/ Conill y Santa Ana, Nuevo Vedado",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "Sabores que elevan tu experiencia ✨",
        specialties: ["Descrubelo"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Lun-Dom: 11:00am-00:00am",
        phone: "78831365",
    },
    {
        id: 39,
        name: "El Bejuco",
        category: "Bar",
        image: "imagenes/El Bejuco.jpg",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Calle Línea 1206 entre 18 y 20, Vedado.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "☀️ |Co-working by day 💻 |☕ Café |.🌙 |🍹 Bar | 🎲 Dominó |.🌿 Ambiente urbano y alternativo.",
        specialties: ["Descubrelo"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Lun-Dom: 9:00am-4:00am ",
        phone: "#",
    },
    {
        id: 40,
        name: "Montefreddo",
        category: "icecream",
        image: "imagenes/Montefreddo.jpg",
        rating: 4.9,
        reviews: 512,
        address: "Calle San Rafael #1209, entre Ronda y Mazón. Edificio Victoria. Plaza de la Revolución.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3285!2d-58.42!3d-34.55!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDMzJzAwLjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "🍦✨ Helados, frapuccinos, dulces variados, bocadillos y cafés.",
        specialties: [" Helado artesanal con alta dosis de felicidad"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Mini Cono Degustación", price: "$1.800", desc: "3 mini porciones para probar" }
            ],
            mains: [
                { item: "Waffle con Helado", price: "$5.500", desc: "Con 2 sabores a elección" },
                { item: "Brownie Caliente", price: "$6.200", desc: "Con bola de helado vainilla" }
            ],
            pasta: [],
            sandwiches: [
                { item: "Donuts Rellenos", price: "$3.200", desc: "De crema pastelera y chocolate" },
                { item: "Cookie Sándwich", price: "$4.500", desc: "2 galletas con helado en medio" }
            ],
            desserts: [
                { item: "1/4 kg (2 sabores)", price: "$3.800", desc: "Incluye cucurucho o envase" },
                { item: "1/2 kg (3 sabores)", price: "$6.200", desc: "Ideal para compartir" },
                { item: "1 kg (4 sabores)", price: "$11.500", desc: "Familiar" },
                { item: "Cucurucho Gourmet", price: "$2.500", desc: "Con chocolate y almendras" },
                { item: "Café Affogato", price: "$4.200", desc: "Helado de vainilla con espresso" },
                { item: "Sundae Especial", price: "$5.800", desc: "Con salsa, crema y frutos" }
            ],
            drinks: [
                { item: "Smoothie de Helado", price: "$4.500", desc: "Batido cremoso de helado" },
                { item: "Granizado", price: "$3.200", desc: "Café o limón con helado" },
                { item: "Agua Mineral", price: "$1.800", desc: "Con o sin gas" }
            ]
        },
        hours: "Lun-Dom: 10:00am-9:00pm",
        phone: "78781535",
    },
    {
        id: 41,
        name: "Paladar El jardin de los Milagros",
        category: "restaurant",
        image: "imagenes/Paladar El jardin de los Milagros.jpg",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Calle 37 entre 24 y San Juan Bautista Nuevo Vedado.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "Sabores que elevan tu experiencia ✨",
        specialties: ["Comida al carbon🥩"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Lun-Dom: 12:00pm-9:30pm",
        phone: "78811053",
    },
    {
        id: 42,
        name: "Nero di seppia 🦑",
        category: "restaurant",
        image: "imagenes/Nero di seppia 🦑.jpg",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Calle 6 / 1ra y 3ra, Miramar, Playa.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "Esencia italiana 🇮🇹✨",
        specialties: ["Descrubelo"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Mie-Jue: 16:00pm-00:00am Vie-Dom: 12:00pm-00:00am",
        phone: "53 54787871",
    },
    {
        id: 43,
        name: "San Ignacio 214",
        category: "restaurant",
        image: "imagenes/San Ignacio 214.webp",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍San Ignacio214 esq. Lamparilla.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "☕ Donde el aroma del tabaco se mezcla con el sabor cubano.",
        specialties: ["Auténticas recetas cubanas"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Lun-Dom: 9:00am-22:00pm",
        phone: "#",
    },
    {
        id: 44,
        name: "A la Turca Istanbul",
        category: "icecream",
        image: "imagenes/A la Turca Istanbul.jpg",
        rating: 4.9,
        reviews: 512,
        address: "🗺️📍21 y L, Vedado.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3285!2d-58.42!3d-34.55!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDMzJzAwLjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "Restaurante-Heladería 🇹🇷🍨.",
        specialties: ["Descubrelo"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Mini Cono Degustación", price: "$1.800", desc: "3 mini porciones para probar" }
            ],
            mains: [
                { item: "Waffle con Helado", price: "$5.500", desc: "Con 2 sabores a elección" },
                { item: "Brownie Caliente", price: "$6.200", desc: "Con bola de helado vainilla" }
            ],
            pasta: [],
            sandwiches: [
                { item: "Donuts Rellenos", price: "$3.200", desc: "De crema pastelera y chocolate" },
                { item: "Cookie Sándwich", price: "$4.500", desc: "2 galletas con helado en medio" }
            ],
            desserts: [
                { item: "1/4 kg (2 sabores)", price: "$3.800", desc: "Incluye cucurucho o envase" },
                { item: "1/2 kg (3 sabores)", price: "$6.200", desc: "Ideal para compartir" },
                { item: "1 kg (4 sabores)", price: "$11.500", desc: "Familiar" },
                { item: "Cucurucho Gourmet", price: "$2.500", desc: "Con chocolate y almendras" },
                { item: "Café Affogato", price: "$4.200", desc: "Helado de vainilla con espresso" },
                { item: "Sundae Especial", price: "$5.800", desc: "Con salsa, crema y frutos" }
            ],
            drinks: [
                { item: "Smoothie de Helado", price: "$4.500", desc: "Batido cremoso de helado" },
                { item: "Granizado", price: "$3.200", desc: "Café o limón con helado" },
                { item: "Agua Mineral", price: "$1.800", desc: "Con o sin gas" }
            ]
        },
        hours: "⏰️ Lun-Dom: 12:00pm-23:00pm",
        phone: "#",
    },
    {
        id: 45,
        name: "Amaya",
        category: "restaurant",
        image: "imagenes/Amaya.jpg",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍21 y L, Vedado.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "Descubre la magia de la cocina turca en el corazón de Amaya ✨️",
        specialties: ["Descrubelo"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Mar-Dom: 12:00pm-00:00am",
        phone: "#",
    },
    {
        id: 46,
        name: "PanParaPan 23y18",
        category: "restaurant",
        image: "imagenes/PanParaPan 23y18.webp",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Calle 23, esq 18 # 1202, Vedado, Plaza de la Revolución.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "Capturando la perfección en cada rebanada🍕📷",
        specialties: ["Restaurante de comida rápida"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Mar-Dom: 10:00am-11:30pm",
        phone: "+53 52724660",
    },
    {
        id: 47,
        name: "Restaurante Snack Bar G310",
        category: "restaurant",
        image: "imagenes/Restaurante Snack Bar G310.jpg",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Calle G No 310 e/ 13 y 15.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "Wifi gratis",
        specialties: ["🍔 Snack, tragos y comida cubana"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Lun-Dom: 24 horas",
        phone: "#",
    },
    {
        id: 48,
        name: "La Macorina",
        category: "restaurant",
        image: "imagenes/La Macorina.jpg",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Prado 62. Frente al hotel Packard, Havana.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "⭐ Sabores que te hacen querer volver",
        specialties: ["Cocina Cubana & Internacional"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Lun-Dom: 8:30am-23:00pm",
        phone: "#",
    },
    {
        id: 49,
        name: "Café FM",
        category: "Bar",
        image: "imagenes/Café FM.jpg",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Playa 13 entre 60 y 62.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "Descubre el placer de saborear una jugosa hamburguesa",
        specialties: ["Descubrelo"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Lun-Dom: 24 horas",
        phone: "+53 51967272",
    },
    {
        id: 50,
        name: "Razones y Motivos",
        category: "restaurant",
        image: "imagenes/Razones y Motivos.jpg",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Calle F #63 entre 3ra y 5ta, Vedado.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "Un lugar perfecto para ir con tus amigos y compartir una tarde especial",
        specialties: ["Restaurante de Comida Criolla e Internacional."],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Lun-Dom: 12:00pm-23:30pm",
        phone: "+53 52930021",
    },
    {
        id: 51,
        name: "El Idilio",
        category: "restaurant",
        image: "imagenes/El Idilio.webp",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Esquina de 15 y G, Vedado.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "🔥 Que no se apague la llama",
        specialties: ["Cocina al carbón + cerveza dispensada 🍻"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Lun-Dom: 12:00pm-23:00pm",
        phone: "+53 52913911",
    },
    {
        id: 52,
        name: "Café Del Ángel",
        category: "Bar",
        image: "imagenes/Café Del Ángel.jpg",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Compostela 1 Esquina Cuarteles.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "🍝🍗 Elige entre pasta pomodoro o nuggets, ¡y disfruta de un menú delicioso para todos! 😋",
        specialties: ["Descubrelo"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Lun-Dom: 8:00am-22:00pm ",
        phone: "#",
    },
    {
        id: 53,
        name: "Sushi Level_Qva",
        category: "restaurant",
        image: "imagenes/Sushi Level_Qva.jpg",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Concordia/lealtad y perseverancia 304, Centro Habana.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "🍱Restaurante y Delivery",
        specialties: ["Comida asiática."],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Mar-Dom: 19:00pm-23:30pm",
        phone: "+53 52913911",
    },
    {
        id: 54,
        name: "MiauCafé",
        category: "Bar",
        image: "imagenes/MiauCafé.jpg",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Calle Línea #1057 entre 12 y 14, Plaza de la Revolución.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "🍝🖼️El ronroneo del arte.☕️El maullido del café.📚El pelaje de los libros.🎶El zarpazo de la música",
        specialties: ["Descubrelo"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Lun-Sab: 11:00am-22:00pm Dom: 14:00pm-22:00pm",
        phone: "#",
    },
    {
        id: 55,
        name: "ENPLAZA23",
        category: "Bar",
        image: "imagenes/ENPLAZA23.jpg",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Ave. 23 e/ Paseo y 2, Vedado.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "🛒🍕 Un lugar para hacer compras y comer delicioso.",
        specialties: ["Descubrelo"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Lun-Dom: 10:00am-22:00pm",
        phone: "#",
    },
    {
        id: 56,
        name: "Thaly’s Cafe",
        category: "Bar",
        image: "imagenes/Thaly’s Cafe.webp",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Calle 12 #318 entre 3ra y 5ta Miramar",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "Diseñado para hacerte feliz ☺️",
        specialties: ["Descubrelo"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Lun-Vie: 8:00am-18:00pm",
        phone: "72035525",
    },
    {
        id: 57,
        name: "La Torre de Marfil Restaurant & Bar",
        category: "restaurant",
        image: "imagenes/La Torre de Marfil Restaurant & Bar.jpg",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Calle Mercaderes entre Obispo y Obrapia.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "Restaurante de cocina cubana e internacional con toques de la cocina oriental,",
        specialties: ["Descubrelo"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Mar-Dom: 11:00am-23:00pm",
        phone: "+53 52667604",
    },
    {
        id: 58,
        name: "Teniente Rey 360",
        category: "restaurant",
        image: "imagenes/Teniente Rey 360.jpg",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Calle Teniente Rey #360 e/ Villegas y Aguacate.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "🍹Bar-Restaurante especializado en comida tradicional cubana🇨🇺",
        specialties: ["Descubrelo"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Lun-Dom: 11:00am-21:30pm",
        phone: "78602916",
    },
    {
        id: 59,
        name: "Restuarante Perla Negra🏴",
        category: "restaurant",
        image: "imagenes/Restuarante Perla Negra.jpg",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Calle Milagros No.114 e/ Heredia y Felipe Poey, Santos Suárez.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "¿Quieres conocer un Barco Pirata ☠️ en plena Habana?",
        specialties: ["Descubrelo"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Lun-Vie: 12:00pm-00:00am Sab-Vie: 12:00pm-2:00am",
        phone: "+53 59333495",
    },
    {
        id: 60,
        name: "Restaurant Habana Blues",
        category: "restaurant",
        image: "imagenes/Restaurant Habana Blues.jpg",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Calle H entre 17 y 19 vedado.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "🤤 Menú variado.🖼️ Decoración única.🎶 Musica y show en vivo.",
        specialties: ["Descubrelo"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Lun-Dom: 12:00pm-23:30am ",
        phone: "+53 7835654",
    },
    {
        id: 61,
        name: "La Lola Bar & Cafeteria",
        category: "Bar",
        image: "imagenes/LaLola bar & cafetería.webp",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Ayestaran & Pedro Perez",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "🛵 domicilio en toda la habana",
        specialties: ["Descubrelo"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Lun-Dom: 14:00pm-3:00am",
        phone: "+53 53654726",
    },
    {
        id: 62,
        name: "Kanda",
        category: "Bar",
        image: "imagenes/Kanda.webp",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Calle J #460 entre 21 y 23, Vedado.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "🥤 En Kanda puedes pedir tus bebidas favoritas para llevar.Iced coffee, matcha, shakes o cualquier clásico…",
        specialties: ["Descubrelo"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Lun-Dom: 9:00am-21:00pm",
        phone: "#",
    },
    {
        id: 63,
        name: "Tiky Tiky",
        category: "Bar",
        image: "imagenes/Tiky Tiky.jpg",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Calle 19 entre 2 y 4 #825 Vedado.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "🥤 En Kanda puedes pedir tus bebidas favoritas para llevar.Iced coffee, matcha, shakes o cualquier clásico…",
        specialties: ["🍽️Comida criolla e internacional!!!"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Lun-Dom: 10:00am-22:00pm",
        phone: "+53 59172820",
    },
    {
        id: 64,
        name: "Mojito Mojito",
        category: "restaurant",
        image: "imagenes/Mojito Mojito.webp",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Muralla e/Cuba y San Ignacio (entrada en PLAZA VIEJA).",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "🍋🍋MOJITO MOJITO :Porque cuando tomas mojito: UNA VEZ NO BASTA.",
        specialties: ["Descubrelo"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Lun-Dom: 12:00pm-23:30pm ",
        phone: "#",
    },
    {
        id: 65,
        name: "🍝Sfornabontà by Amalfi🍸",
        category: "restaurant",
        image: "imagenes/Sfornabontà by Amalfi.jpg",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Calle 1ra # 4215 entre 42 y 44, Playa.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "🇮🇹 Il Gusto della Qualitá.🍋 Restaurante Coffee Shop",
        specialties: ["Descubrelo"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Lun-Dom: 7:30am-23:00pm ",
        phone: "#",
    },
    {
        id: 66,
        name: "Betty Boom",
        category: "restaurant",
        image: "imagenes/Betty Boom.jpg",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Calle 60 y 5ta A, Miramar.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "Deliciosa comida a la parrilla, así como por sus opciones vegetarianas y saludables.",
        specialties: ["Descubrelo"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Lun-Dom: 8:30am-00:00am ",
        phone: "+53 53904259",
    },
    {
        id: 67,
        name: "Restaurante 7 Dias",
        category: "restaurant",
        image: "imagenes/Restaurante 7 Dias.jpg",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Calle 14 y Mar, Miramar, Playa",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "¡Una experiencia explosiva!",
        specialties: ["Descubrelo"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Dom-Jue: 11:00am-22:30pm Vie-Sab: 11:00am-00:00am ",
        phone: "+53 52837046.",
    },
    {
        id: 68,
        name: "FONDA LA PAILA",
        category: "restaurant",
        image: "imagenes/FONDA LA PAILA.jpg",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Esq 25,calle M,Vedado.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "Los colores de nuestros platos no son casualidad… son identidad. 🎨🔥",
        specialties: ["COMIDA AL CARBÓN"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Lun-Dom: 12:00pm-00:00am",
        phone: "+53 58846474",
    },
    {
        id: 69,
        name: "Bohío Mercadito",
        category: "Bar",
        image: "imagenes/Bohío Mercadito.jpg",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Calle 19 / 12 y 10 Vedado.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "Realiza tu compra y de paso tómate un café ☕️✨",
        specialties: ["Descrubelo"],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Lun-Dom: 10:00am-21:00pm",
        phone: "#",
    },
    {
        id: 70,
        name: "El Farallón",
        category: "restaurant",
        image: "imagenes/El Farallón.jpg",
        rating: 4.9,
        reviews: 189,
        address: "🗺️📍Calle 22, esquina 23, Vedado.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
        description: "🥇Restaurante-Pizzería de lujo con una carta amplia, variada y exquisita🤤.",
        specialties: ["💯Las pastas, carnes, pescados y arroces que nunca probaste en La Habana‼️."],
        priceRange: "$$",
        menu: {
            entrees: [
                { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
            ],
            mains: [
                { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
            ],
            pasta: [
                { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
            ],
            sandwiches: [
                { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
            ],
            desserts: [
                { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
            ],
            drinks: [
                { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
            ]
        },
        hours: "⏰️ Lun-Dom: 11:00am-23:00pm",
        phone: "+53 59652021",
    },

    {
                id: 68,
                name: "Entre Nos",
                category: "restaurant",
                image: "",
                rating: 4.9,
                reviews: 189,
                address: "🗺️📍Aguiar 62 / Cuarteles y Peña Pobre, Cabañas, La Habana.",
                mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
                description: "🍀Lo que aquí pase, Entre nos se queda🍀",
                specialties: ["🥗ensaladas.🍹smothies.🥐 sandwiches.🍖platos al grill.🍝pastas"],
                priceRange: "$$",
                menu: {
                    entrees: [
                        { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                        { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                        { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
                    ],
                    mains: [
                        { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                        { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                        { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
                    ],
                    pasta: [
                        { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
                    ],
                    sandwiches: [
                        { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                        { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                        { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                        { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
                    ],
                    desserts: [
                        { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                        { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
                    ],
                    drinks: [
                        { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                        { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                        { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                        { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
                    ]
                },
                hours: "⏰️ Lun-Dom: 11:00am-23:00pm",
                phone: "#",
            },

            {
                id: 70,
                name: "Helad'oro",
                category: "icecream",
                image: "",
                rating: 4.9,
                reviews: 512,
                address: "Calle Aguiar 206btw/Empedrado y Tejadillom La Habana.",
                mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3285!2d-58.42!3d-34.55!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDMzJzAwLjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
                description: "Helado artesanal con un toque cubano.",
                specialties: ["Descubrelo"],
                priceRange: "$$",
                menu: {
                    entrees: [
                        { item: "Mini Cono Degustación", price: "$1.800", desc: "3 mini porciones para probar" }
                    ],
                    mains: [
                        { item: "Waffle con Helado", price: "$5.500", desc: "Con 2 sabores a elección" },
                        { item: "Brownie Caliente", price: "$6.200", desc: "Con bola de helado vainilla" }
                    ],
                    pasta: [],
                    sandwiches: [
                        { item: "Donuts Rellenos", price: "$3.200", desc: "De crema pastelera y chocolate" },
                        { item: "Cookie Sándwich", price: "$4.500", desc: "2 galletas con helado en medio" }
                    ],
                    desserts: [
                        { item: "1/4 kg (2 sabores)", price: "$3.800", desc: "Incluye cucurucho o envase" },
                        { item: "1/2 kg (3 sabores)", price: "$6.200", desc: "Ideal para compartir" },
                        { item: "1 kg (4 sabores)", price: "$11.500", desc: "Familiar" },
                        { item: "Cucurucho Gourmet", price: "$2.500", desc: "Con chocolate y almendras" },
                        { item: "Café Affogato", price: "$4.200", desc: "Helado de vainilla con espresso" },
                        { item: "Sundae Especial", price: "$5.800", desc: "Con salsa, crema y frutos" }
                    ],
                    drinks: [
                        { item: "Smoothie de Helado", price: "$4.500", desc: "Batido cremoso de helado" },
                        { item: "Granizado", price: "$3.200", desc: "Café o limón con helado" },
                        { item: "Agua Mineral", price: "$1.800", desc: "Con o sin gas" }
                    ]
                },
                hours: "Lun-Dom: 11:00am-20:00pm",
                phone: "53 50131498",
                
            },

            {
                id: 71,
                name: "El Gelato",
                category: "icecream",
                image: "",
                rating: 4.9,
                reviews: 512,
                address: "Ave 1ra Esq. 46, Playa.",
                mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3285!2d-58.42!3d-34.55!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDMzJzAwLjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
                description: "Donde se celebran los momentos especiales.",
                specialties: ["Helado artesanal premium 🍨"],
                priceRange: "$$",
                menu: {
                    entrees: [
                        { item: "Mini Cono Degustación", price: "$1.800", desc: "3 mini porciones para probar" }
                    ],
                    mains: [
                        { item: "Waffle con Helado", price: "$5.500", desc: "Con 2 sabores a elección" },
                        { item: "Brownie Caliente", price: "$6.200", desc: "Con bola de helado vainilla" }
                    ],
                    pasta: [],
                    sandwiches: [
                        { item: "Donuts Rellenos", price: "$3.200", desc: "De crema pastelera y chocolate" },
                        { item: "Cookie Sándwich", price: "$4.500", desc: "2 galletas con helado en medio" }
                    ],
                    desserts: [
                        { item: "1/4 kg (2 sabores)", price: "$3.800", desc: "Incluye cucurucho o envase" },
                        { item: "1/2 kg (3 sabores)", price: "$6.200", desc: "Ideal para compartir" },
                        { item: "1 kg (4 sabores)", price: "$11.500", desc: "Familiar" },
                        { item: "Cucurucho Gourmet", price: "$2.500", desc: "Con chocolate y almendras" },
                        { item: "Café Affogato", price: "$4.200", desc: "Helado de vainilla con espresso" },
                        { item: "Sundae Especial", price: "$5.800", desc: "Con salsa, crema y frutos" }
                    ],
                    drinks: [
                        { item: "Smoothie de Helado", price: "$4.500", desc: "Batido cremoso de helado" },
                        { item: "Granizado", price: "$3.200", desc: "Café o limón con helado" },
                        { item: "Agua Mineral", price: "$1.800", desc: "Con o sin gas" }
                    ]
                },
                hours: "Lun-Dom: 9:00am-23:00pm",
                phone: "53 59605045",
                
            },

            {
                id: 72,
                name: "Café & Estancia Bohemia",
                category: "restaurant",
                image: "",
                rating: 4.9,
                reviews: 189,
                address: "🗺️📍San Ignacio 364 Muralla y Teniente Rey.La Habana.",
                mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
                description: "Se refleja la riqueza histórica y cultural que definen a la ciudad.",
                specialties: ["Descrubelo."],
                priceRange: "$$",
                menu: {
                    entrees: [
                        { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                        { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                        { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
                    ],
                    mains: [
                        { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                        { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                        { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
                    ],
                    pasta: [
                        { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
                    ],
                    sandwiches: [
                        { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                        { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                        { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                        { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
                    ],
                    desserts: [
                        { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                        { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
                    ],
                    drinks: [
                        { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                        { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                        { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                        { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
                    ]
                },
                hours: "⏰️ Lun-Dom: 11:00am-23:00pm",
                phone: "+53 52871607",
            },

            {
                id: 73,
                name: "Mango Gelateria & Cafe",
                category: "icecream",
                image: "",
                rating: 4.9,
                reviews: 512,
                address: "Teniente Rey #106 / San Ignacio y Cuba. La Habana Vieja.",
                mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3285!2d-58.42!3d-34.55!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDMzJzAwLjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
                description: "Un paseo por Plaza Vieja siempre es mejor con un gelato🍦",
                specialties: ["Helado artesanal 🍧 basado en el puro sabor tropical 🍍 y con receta italiana 🇮🇹."],
                priceRange: "$$",
                menu: {
                    entrees: [
                        { item: "Mini Cono Degustación", price: "$1.800", desc: "3 mini porciones para probar" }
                    ],
                    mains: [
                        { item: "Waffle con Helado", price: "$5.500", desc: "Con 2 sabores a elección" },
                        { item: "Brownie Caliente", price: "$6.200", desc: "Con bola de helado vainilla" }
                    ],
                    pasta: [],
                    sandwiches: [
                        { item: "Donuts Rellenos", price: "$3.200", desc: "De crema pastelera y chocolate" },
                        { item: "Cookie Sándwich", price: "$4.500", desc: "2 galletas con helado en medio" }
                    ],
                    desserts: [
                        { item: "1/4 kg (2 sabores)", price: "$3.800", desc: "Incluye cucurucho o envase" },
                        { item: "1/2 kg (3 sabores)", price: "$6.200", desc: "Ideal para compartir" },
                        { item: "1 kg (4 sabores)", price: "$11.500", desc: "Familiar" },
                        { item: "Cucurucho Gourmet", price: "$2.500", desc: "Con chocolate y almendras" },
                        { item: "Café Affogato", price: "$4.200", desc: "Helado de vainilla con espresso" },
                        { item: "Sundae Especial", price: "$5.800", desc: "Con salsa, crema y frutos" }
                    ],
                    drinks: [
                        { item: "Smoothie de Helado", price: "$4.500", desc: "Batido cremoso de helado" },
                        { item: "Granizado", price: "$3.200", desc: "Café o limón con helado" },
                        { item: "Agua Mineral", price: "$1.800", desc: "Con o sin gas" }
                    ]
                },
                hours: "Lun-Dom: 10:00am-23:00pm",
                phone: "+53 50914755",
                
            },

            {
                id: 74,
                name: "Bar Restaurante Industria 8 ⭐",
                category: "restaurant",
                image: "",
                rating: 4.9,
                reviews: 189,
                address: "🗺️📍Industria, Genios y Refugio, Centro Habana.",
                mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
                description: "El sótano más privado de La Habana ✨ Comida, Música y más ⭐ Ofertas nuevas todas las semanas 🎁.",
                specialties: ["Descrubelo."],
                priceRange: "$$",
                menu: {
                    entrees: [
                        { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                        { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                        { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
                    ],
                    mains: [
                        { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                        { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                        { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
                    ],
                    pasta: [
                        { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
                    ],
                    sandwiches: [
                        { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                        { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                        { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                        { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
                    ],
                    desserts: [
                        { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                        { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
                    ],
                    drinks: [
                        { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                        { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                        { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                        { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
                    ]
                },
                hours: "⏰️ Lun-Dom: 12:00pm-00:00am",
                phone: "#",
            },

             {
                id: 75,
                name: "Los Mercaderes",
                category: "restaurant",
                image: "",
                rating: 4.9,
                reviews: 189,
                address: "🗺️📍Mercaderes 207 / Lamparilla y Amargura. Habana Vieja, Havana, Cuba.",
                mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
                description: "Una experiencia para vivir y compartir.",
                specialties: ["Descrubelo."],
                priceRange: "$$",
                menu: {
                    entrees: [
                        { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                        { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                        { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
                    ],
                    mains: [
                        { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                        { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                        { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
                    ],
                    pasta: [
                        { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
                    ],
                    sandwiches: [
                        { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                        { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                        { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                        { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
                    ],
                    desserts: [
                        { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                        { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
                    ],
                    drinks: [
                        { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                        { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                        { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                        { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
                    ]
                },
                hours: "⏰️ Lun-Dom: 12:00pm-00:00am",
                phone: "+53 52901531",
            },

            {
                id: 76,
                name: "Restaurante El Rum Rum de La Habana",
                category: "restaurant",
                image: "",
                rating: 4.9,
                reviews: 189,
                address: "🗺️📍Calle Empedrado No. 256 Entre Cuba y Aguiar, Havana.",
                mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
                description: "Un restaurante de primera categoría con cocina creativa, cócteles de autor y auténticos momentos con puros. Consolidado como uno de los favoritos de La Habana y la mejor opción.",
                specialties: ["Descrubelo."],
                priceRange: "$$",
                menu: {
                    entrees: [
                        { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                        { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                        { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
                    ],
                    mains: [
                        { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                        { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                        { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
                    ],
                    pasta: [
                        { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
                    ],
                    sandwiches: [
                        { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                        { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                        { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                        { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
                    ],
                    desserts: [
                        { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                        { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
                    ],
                    drinks: [
                        { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                        { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                        { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                        { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
                    ]
                },
                hours: "⏰️ Lun-Dom: 12:00pm-23:00pm",
                phone: "+53 52901531",
            },

            {
                id: 77,
                name: "La Guarida",
                category: "restaurant",
                image: "",
                rating: 4.9,
                reviews: 189,
                address: "🗺️📍Calle Empedrado No. 256 Entre Cuba y Aguiar, Havana.",
                mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
                description: "Un viaje al corazón de La Habana.",
                specialties: ["Descrubelo."],
                priceRange: "$$",
                menu: {
                    entrees: [
                        { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                        { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                        { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
                    ],
                    mains: [
                        { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                        { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                        { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
                    ],
                    pasta: [
                        { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
                    ],
                    sandwiches: [
                        { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                        { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                        { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                        { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
                    ],
                    desserts: [
                        { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                        { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
                    ],
                    drinks: [
                        { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                        { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                        { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                        { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
                    ]
                },
                hours: "⏰️ Lun-Dom: 12:00pm-23:00pm",
                phone: "#",
            },

            {
                id: 78,
                name: "LA ESQUINA DE CUBA",
                category: "restaurant",
                image: "",
                rating: 4.9,
                reviews: 189,
                address: "🗺️📍Calle Cuba #203 e/ Empedrado y O'Reilly, Havana.",
                mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
                description: "Un balcón en la Habana Vieja.",
                specialties: ["Descrubelo."],
                priceRange: "$$",
                menu: {
                    entrees: [
                        { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                        { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                        { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
                    ],
                    mains: [
                        { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                        { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                        { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
                    ],
                    pasta: [
                        { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
                    ],
                    sandwiches: [
                        { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                        { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                        { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                        { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
                    ],
                    desserts: [
                        { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                        { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
                    ],
                    drinks: [
                        { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                        { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                        { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                        { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
                    ]
                },
                hours: "⏰️ Lun-Dom: 12:00pm-23:00pm",
                phone: "#",
            },

            {
                id: 79,
                name: "Vistamar Restaurante",
                category: "restaurant",
                image: "",
                rating: 4.9,
                reviews: 189,
                address: "🗺️📍Calle 1ra entre 22 y 24.",
                mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
                description: "✨Un sabor, un estilo, un océano.",
                specialties: ["Descrubelo."],
                priceRange: "$$",
                menu: {
                    entrees: [
                        { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                        { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                        { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
                    ],
                    mains: [
                        { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                        { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                        { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
                    ],
                    pasta: [
                        { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
                    ],
                    sandwiches: [
                        { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                        { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                        { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                        { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
                    ],
                    desserts: [
                        { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                        { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
                    ],
                    drinks: [
                        { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                        { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                        { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                        { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
                    ]
                },
                hours: "⏰️ Lun-Dom: 12:00pm-00:00am",
                phone: "#",
            },

            {
                id: 80,
                name: "ChaChaChá Bar-Restaurante",
                category: "restaurant",
                image: "",
                rating: 4.9,
                reviews: 189,
                address: "🗺️📍Monserrate #159 / Tejadillo y Chacon, Havana.",
                mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
                description: "Música en vivo• Coctelería de autor.",
                specialties: ["Comida cubana contemporánea."],
                priceRange: "$$",
                menu: {
                    entrees: [
                        { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                        { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                        { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
                    ],
                    mains: [
                        { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                        { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                        { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
                    ],
                    pasta: [
                        { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
                    ],
                    sandwiches: [
                        { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                        { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                        { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                        { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
                    ],
                    desserts: [
                        { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                        { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
                    ],
                    drinks: [
                        { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                        { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                        { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                        { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
                    ]
                },
                hours: "⏰️ Lun-Dom: 12:00pm-00:00am",
                phone: "#",
            },

             {
                id: 81,
                name: "Bar El Dandy",
                category: "Bar",
                image: "",
                rating: 4.9,
                reviews: 189,
                address: "🗺️📍Teniente Rey 401, esquina Villegas, Parque Cristo, La Habana.",
                mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
                description: "Tapas and cocktail bar ☕️✨",
                specialties: ["Descrubelo"],
                priceRange: "$$",
                menu: {
                    entrees: [
                        { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                        { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                        { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
                    ],
                    mains: [
                        { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                        { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                        { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
                    ],
                    pasta: [
                        { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
                    ],
                    sandwiches: [
                        { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                        { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                        { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                        { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
                    ],
                    desserts: [
                        { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                        { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
                    ],
                    drinks: [
                        { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                        { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                        { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                        { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
                    ]
                },
                hours: "⏰️ Lun-Dom: 8:00am-22:00pm",
                phone: "53 53254319",
            },

            {
                id: 82,
                name: "O'Reilly 304",
                category: "restaurant",
                image: "",
                rating: 4.9,
                reviews: 189,
                address: "🗺️📍O'Reilly #304 Habana y Aguiar, Habana Viieja.",
                mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
                description: "Opciones vegetarianas, Opciones veganas, Opciones sin gluten.",
                specialties: ["Descrubelo."],
                priceRange: "$$",
                menu: {
                    entrees: [
                        { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                        { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                        { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
                    ],
                    mains: [
                        { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                        { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                        { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
                    ],
                    pasta: [
                        { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
                    ],
                    sandwiches: [
                        { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                        { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                        { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                        { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
                    ],
                    desserts: [
                        { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                        { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
                    ],
                    drinks: [
                        { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                        { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                        { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                        { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
                    ]
                },
                hours: "⏰️ Lun-Dom: 12:00pm-00:00am",
                phone: "#",
            },

            {
                id: 83,
                name: "Café Laurent",
                category: "Bar",
                image: "",
                rating: 4.9,
                reviews: 189,
                address: "🗺️📍Calle M #257 entre 19 y 21, Vedado.",
                mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
                description: "Tapas and cocktail bar ☕️✨",
                specialties: [" Coctelería premium"],
                priceRange: "$$",
                menu: {
                    entrees: [
                        { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                        { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                        { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
                    ],
                    mains: [
                        { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                        { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                        { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
                    ],
                    pasta: [
                        { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
                    ],
                    sandwiches: [
                        { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                        { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                        { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                        { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
                    ],
                    desserts: [
                        { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                        { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
                    ],
                    drinks: [
                        { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                        { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                        { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                        { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
                    ]
                },
                hours: "⏰️ Lun-Dom: 12:00pm-23:00pm",
                phone: "53 53254319",
            },

           

            {
                id: 84,
                name: "Adastra Restaurante",
                category: "restaurant",
                image: "",
                rating: 4.9,
                reviews: 189,
                address: "🗺️📍Obipo #255 entre Cuba Y Aguiar,Habana Viieja.",
                mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
                description: "Donde el sabor y la calidez te llevan hacia las estrellas✨",
                specialties: ["Descrubelo."],
                priceRange: "$$",
                menu: {
                    entrees: [
                        { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                        { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                        { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
                    ],
                    mains: [
                        { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                        { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                        { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
                    ],
                    pasta: [
                        { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
                    ],
                    sandwiches: [
                        { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                        { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                        { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                        { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
                    ],
                    desserts: [
                        { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                        { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
                    ],
                    drinks: [
                        { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                        { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                        { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                        { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
                    ]
                },
                hours: "⏰️ Lun-Dom: 12:00pm-00:00am",
                phone: "+53 63518498",
            },

            {
                id: 85,
                name: "Doña Eutimia",
                category: "restaurant",
                image: "",
                rating: 4.9,
                reviews: 189,
                address: "🗺️📍Callejón del Chorro 60C Plaza de La Catedral Habana Vieja.",
                mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5!2d-58.42!3d-34.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzQ4LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
                description: "🥘 Comida Tradicional Cubana ",
                specialties: ["Descrubelo."],
                priceRange: "$$",
                menu: {
                    entrees: [
                        { item: "Picadera Parranda", price: "$8.500", desc: "Mix de frituras para compartir" },
                        { item: "Croquetas Variadas", price: "$3.800", desc: "6 unidades, jamón y pollo" },
                        { item: "Papas Fritas Cargadas", price: "$4.200", desc: "Con cheddar, panceta y verdeo" }
                    ],
                    mains: [
                        { item: "Hamburguesa Parranda", price: "$7.800", desc: "Doble carne, cheddar y huevo" },
                        { item: "Chivito al Plato", price: "$9.500", desc: "Lomo, jamón, queso y huevo" },
                        { item: "Milanesa Napolitana", price: "$10.200", desc: "Con papas españolas" }
                    ],
                    pasta: [
                        { item: "Pizza de la Casa", price: "$11.000", desc: "Salsa especial y 4 quesos" }
                    ],
                    sandwiches: [
                        { item: "Hamburguesa Bacon", price: "$8.500", desc: "Doble panceta y cebolla caramelizada" },
                        { item: "Sándwich de Bondiola", price: "$7.200", desc: "Cerdo desmenuzado con salsa BBQ" },
                        { item: "Wrap de Pollo Crispy", price: "$6.800", desc: "Pollo empanizado y vegetales" },
                        { item: "Pan de Queso XL", price: "$5.500", desc: "3 unidades, receta brasileña" }
                    ],
                    desserts: [
                        { item: "Chocotorta", price: "$3.500", desc: "Clásica argentina" },
                        { item: "Helado Frito", price: "$4.200", desc: "Tempura de helado vainilla" }
                    ],
                    drinks: [
                        { item: "Pinta IPA", price: "$2.800", desc: "Indian Pale Ale local" },
                        { item: "Pinta Stout", price: "$3.200", desc: "Cerveza negra con notas de café" },
                        { item: "Cuba Libre", price: "$3.500", desc: "Ron, coca y limón" },
                        { item: "Gin Tonic", price: "$4.200", desc: "Con frutos rojos" }
                    ]
                },
                hours: "⏰️ Lun-Dom: 12:00pm-00:00am",
                phone: "+53 53284713",
            }


];

const events = [
    {
        id: 1,
        title: "Feria de Comida Callejera",
        type: "festival",
        date: "15-17 Dic",
        location: "Parque Centenario",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400",
        description: "Los mejores food trucks de la ciudad en un solo lugar",
        price: "Entrada libre"
    },
    {
        id: 2,
        title: "Taller de Sushi para Principiantes",
        type: "workshop",
        date: "20 Dic",
        location: "Sushi Master",
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400",
        description: "Aprende a hacer rolls básicos con un chef profesional",
        price: "$15.000"
    },
    {
        id: 3,
        title: "Degustación de Vinos Malbec",
        type: "tasting",
        date: "22 Dic",
        location: "El Asador Argentino",
        image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400",
        description: "Cata guiada de 6 etiquetas premium con maridaje",
        price: "$25.000"
    },
    {
        id: 4,
        title: "Noche de Cerveza Artesanal",
        type: "festival",
        date: "28 Dic",
        location: "La Birrería Artesanal",
        image: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400",
        description: "Presentación de cervezas de temporada con música en vivo",
        price: "$8.000"
    }
];