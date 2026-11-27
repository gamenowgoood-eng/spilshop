'use strict';

// Existing Revolut payment destination retained exactly as supplied in the original project.
const REVOLUT_CHECKOUT_URL = 'https://checkout.revolut.com/pay/34bd909a-12e7-49f8-a393-540bd03d9c2f';

const products = [
  { name: "Baldur's Gate 3", price: 54, img: 'IMG_9089.jpg', cat: 'spil' },
  { name: 'GTA V (PS5)', price: 24.99, img: 'IMG_9087.jpg', cat: 'spil' },
  { name: 'EA Sports FC 27', price: 67, img: 'IMG_9088.jpg', cat: 'spil' },
  { name: "Elden Ring Collector's", price: 87, img: 'IMG_9090.jpg', cat: 'spil' },
  { name: 'UFC 6', price: 60, img: 'IMG_9091.jpg', cat: 'spil' },
  { name: 'EA Sports FC 26', price: 60, img: 'IMG_9092.jpg', cat: 'spil' },
  { name: 'The Last of Us Part I', price: 47, img: 'IMG_9093.jpg', cat: 'spil' },
  { name: 'Uncharted Legacy of Thieves', price: 40, img: 'IMG_9094.jpg', cat: 'spil' },
  { name: 'Red Dead Redemption', price: 44, img: 'IMG_9095.jpg', cat: 'spil' },
  { name: '007 First Light', price: 67, img: 'IMG_9096.jpg', cat: 'spil' },
  { name: 'Mafia: The Old Country', price: 60, img: 'IMG_9097.jpg', cat: 'spil' },
  { name: 'Far Cry 6', price: 33, img: 'IMG_9098.jpg', cat: 'spil' },
  { name: 'Battlefield 6', price: 67, img: 'IMG_9099.jpg', cat: 'spil' },
  { name: 'God of War Ragnarök', price: 54, img: 'IMG_9100.jpg', cat: 'spil' },
  { name: 'PlayStation 5', price: 539, img: 'IMG_9116.jpg', cat: 'konsol' },
  { name: 'Xbox Series X', price: 579, img: 'IMG_9117.jpg', cat: 'konsol' },
  { name: 'Nintendo Switch OLED', price: 335, img: 'switch-oled.jpg', cat: 'konsol' },
  { name: 'DualSense Controller', price: 74, img: 'dualsense.jpg', cat: 'tilbehor' },
  { name: 'Xbox Wireless Controller', price: 67, img: 'xbox-controller.jpg', cat: 'tilbehor' },
  { name: 'Nintendo Switch Pro Controller', price: 80, img: 'switch-pro.jpg', cat: 'tilbehor' },
  { name: 'Gaming Headset', price: 54, img: 'headset.jpg', cat: 'tilbehor' },
  { name: 'Controller Charging Station', price: 35, img: 'charging-dock.jpg', cat: 'tilbehor' },
  { name: 'HDMI Cable 2m', price: 15, img: 'hdmi.jpg', cat: 'tilbehor' },
  { name: 'USB-C Charging Cable', price: 12, img: 'usbc.jpg', cat: 'tilbehor' },
  { name: 'Memory Card 1TB', price: 89, img: 'memory.jpg', cat: 'tilbehor' },
  { name: 'Gaming Mouse', price: 39, img: 'mouse.jpg', cat: 'tilbehor' }
];

const CART_STORAGE_KEY = 'gamenowgood_cart_v2';

// Shipping is charged on every item except the GTA VI offer and the PS5 + GTA VI bundle.
const EUROPEAN_COUNTRIES = new Set([
  'austria','belgium','bulgaria','croatia','cyprus','czechia','czech republic','denmark',
  'estonia','finland','france','germany','greece','hungary','iceland','ireland','italy',
  'latvia','liechtenstein','lithuania','luxembourg','malta','netherlands','norway','poland',
  'portugal','romania','slovakia','slovenia','spain','sweden','switzerland','united kingdom',
  'uk','great britain'
]);
const CARRIER_PRICES_EUR = { GLS: 8.99, DHL: 11.99, UPS: 13.99, FedEx: 15.99 };
function isFreeShippingItem(item) {
  const name = String(item.name || '').toLowerCase();
  return name === 'gta vi (ps5)' || name === 'gta vi pre-order' || name === 'ps5 + gta vi bundle';
}
function getProductSubtotal() {
  return cart.reduce((sum, item) => sum + Number(item.price) * Number(item.qty), 0);
}
function getShippingCost() {
  const paidShippingItems = cart.filter(item => !isFreeShippingItem(item));
  if (!paidShippingItems.length) return 0;
  const carrier = document.getElementById('shipping-carrier')?.value || 'GLS';
  return CARRIER_PRICES_EUR[carrier] || CARRIER_PRICES_EUR.GLS;
}
function refreshShippingUI() {
  const group = document.getElementById('shipping-choice-group');
  const summary = document.getElementById('checkout-shipping-total');
  const country = (document.getElementById('country')?.value || '').trim().toLowerCase();
  const hasPaidShippingItems = cart.some(item => !isFreeShippingItem(item));
  const isEurope = EUROPEAN_COUNTRIES.has(country);
  if (group) group.style.display = hasPaidShippingItems ? 'block' : 'none';
  const carrier = document.getElementById('shipping-carrier');
  if (carrier) {
    // Carrier options are offered for European destinations only.
    Array.from(carrier.options).forEach(option => {
      option.hidden = !isEurope && option.value === 'GLS';
    });
    if (!isEurope && carrier.value === 'GLS') carrier.value = 'DHL';
  }
  const shipping = getShippingCost();
  const total = getProductSubtotal() + shipping;
  if (summary) summary.textContent = `Shipping: €${shipping.toFixed(2)} · Order total: €${total.toFixed(2)}`;
  return { shipping, total, carrier: carrier?.value || 'Free shipping' };
}

let cart = loadCart();
let activeFilter = 'all';
const grid = document.getElementById('grid');
const cartCount = document.getElementById('cart-count');
const searchInput = document.getElementById('search');
const suggestionsBox = document.getElementById('search-suggestions');

const translations = {"de":{"navFeatured":"Angebote","navShop":"Shop","navAbout":"Über uns","navHelp":"Hilfe","cart":"Warenkorb","eyebrow":"DEIN NÄCHSTES LEVEL BEGINNT HIER","heroTitle":"Bring dein","heroTitle2":"Gaming-Setup aufs nächste Level.","heroText":"Entdecke Videospiele, Konsolen und Gaming-Zubehör für dein nächstes Abenteuer.","explore":"Produkte entdecken","featuredPicks":"Ausgewählte Angebote ansehen","secure":"Sicherer Checkout","revolutHandled":"Zahlung über Revolut","customerSupport":"Kundenservice","clearOrder":"Klare Bestellübersicht","reviewBasket":"Prüfe deinen Warenkorb vor der Zahlung","handPicked":"AUSGEWÄHLT","featured":"Ausgewählte","offers":"Angebote","selectedItems":"Entdecke ausgewählte Produkte aus unserem Shop.","preorder":"VORBESTELLUNG","upcoming":"Ankündigung eines kommenden Titels. Artwork und Veröffentlichungsdetails werden bestätigt, sobald sie offiziell verfügbar sind.","addBasket":"In den Warenkorb","bundle":"BUNDLE-ANGEBOT","bundleDesc":"PlayStation 5-Konsole mit DualSense und GTA VI.","availabilityNote":"Verfügbarkeit, Veröffentlichungstermine, Versandkosten und Bestelldetails sollten vor der Zahlung bestätigt werden.","theStore":"DER SHOP","findYour":"Finde dein","gear":"Gaming-Zubehör.","browse":"Entdecke Spiele, Konsolen und Zubehör.","allItems":"Alle Artikel","games":"Spiele","consoles":"Konsolen","accessories":"Zubehör","search":"Produkte suchen...","aboutStore":"ÜBER DEN SHOP","gamingGear":"Gaming-Zubehör.","madeSimple":"Ganz einfach.","aboutText":"Game Good Now ist ein Online-Shop für Videospiele, Konsolen und Gaming-Zubehör. Wir möchten das Stöbern und Bestellen einfach gestalten – mit klaren Produktinformationen und einem Checkout über unseren Zahlungsanbieter.","contactSupport":"Kundenservice kontaktieren","needHand":"Brauchst du Hilfe?","contactUs":"Kontaktiere uns.","emailSupport":"E-Mail-Support","beforeOrder":"Vor der Bestellung","beforeOrderText":"Bitte frage uns, ob der Artikel verfügbar ist, und lass dir Versandkosten und Lieferzeit bestätigen.","orderQuestions":"Fragen zur Bestellung","orderQuestionsText":"Gib bei Anfragen an den Kundenservice bitte deine Bestelldaten an.","footerLine":"Spiele, Konsolen und Zubehör.","yourSelection":"DEINE AUSWAHL","shoppingBasket":"Warenkorb","deliveryDetails":"Lieferdetails","enterDetails":"Gib deine Daten ein, bevor du zum bestehenden Revolut-Checkout weitergehst.","firstName":"Vorname *","lastName":"Nachname *","email":"E-Mail *","phone":"Telefon","address":"Adresse *","city":"Stadt *","postal":"Postleitzahl *","country":"Land *","continueRevolut":"Weiter zu Revolut","continueCheckout":"Weiter zur Kasse","clearBasket":"Warenkorb leeren","paymentNote":"Du wirst zu Revolut weitergeleitet, um die Zahlung abzuschließen. Diese statische Website sendet deine Bestelldaten nicht automatisch an den Shop."},"fr":{"navFeatured":"Offres","navShop":"Boutique","navAbout":"À propos","navHelp":"Aide","cart":"Panier","eyebrow":"VOTRE PROCHAIN NIVEAU COMMENCE ICI","heroTitle":"Passez au niveau supérieur","heroTitle2":"avec votre setup gaming.","heroText":"Découvrez des jeux vidéo, des consoles et des accessoires pour votre prochaine aventure.","explore":"Voir les produits","featuredPicks":"Voir les offres sélectionnées","secure":"Paiement sécurisé","revolutHandled":"Paiement traité par Revolut","customerSupport":"Service client","clearOrder":"Détails de commande clairs","reviewBasket":"Vérifiez votre panier avant de payer","handPicked":"SÉLECTION","featured":"Offres","offers":"à la une","selectedItems":"Découvrez une sélection de produits de notre boutique.","preorder":"PRÉCOMMANDE","upcoming":"Annonce d’une sortie à venir. Les visuels et les détails de sortie seront confirmés dès leur disponibilité officielle.","addBasket":"Ajouter au panier","bundle":"OFFRE GROUPÉE","bundleDesc":"Console PlayStation 5 avec DualSense et GTA VI.","availabilityNote":"La disponibilité, les dates de sortie, les frais de livraison et les détails de commande doivent être confirmés avant le paiement.","theStore":"LA BOUTIQUE","findYour":"Trouvez votre","gear":"équipement.","browse":"Parcourez les jeux, consoles et accessoires.","allItems":"Tous les articles","games":"Jeux","consoles":"Consoles","accessories":"Accessoires","search":"Rechercher des produits...","aboutStore":"À PROPOS DE LA BOUTIQUE","gamingGear":"Équipement gaming.","madeSimple":"En toute simplicité.","aboutText":"Game Good Now est une boutique en ligne proposant des jeux vidéo, des consoles et des accessoires gaming. Nous souhaitons rendre la navigation et la commande simples, avec des informations claires et un paiement géré par notre prestataire.","contactSupport":"Contacter le service client","needHand":"Besoin d’aide ?","contactUs":"Contactez-nous.","emailSupport":"Assistance par e-mail","beforeOrder":"Avant de commander","beforeOrderText":"Contactez-nous pour confirmer le stock, les frais de livraison et le délai estimé.","orderQuestions":"Questions sur une commande","orderQuestionsText":"Indiquez les détails de votre commande lorsque vous contactez le service client.","footerLine":"Jeux, consoles et accessoires.","yourSelection":"VOTRE SÉLECTION","shoppingBasket":"Panier","deliveryDetails":"Informations de livraison","enterDetails":"Saisissez vos coordonnées avant de continuer vers le paiement Revolut.","firstName":"Prénom *","lastName":"Nom *","email":"E-mail *","phone":"Téléphone","address":"Adresse *","city":"Ville *","postal":"Code postal *","country":"Pays *","continueRevolut":"Continuer vers Revolut","continueCheckout":"Continuer vers le paiement","clearBasket":"Vider le panier","paymentNote":"Vous serez redirigé vers Revolut pour effectuer le paiement. Ce site statique n’envoie pas automatiquement les détails de commande à la boutique."},"zh":{"navFeatured":"精选优惠","navShop":"商店","navAbout":"关于我们","navHelp":"帮助","cart":"购物车","eyebrow":"开启你的游戏新境界","heroTitle":"升级你的","heroTitle2":"游戏装备。","heroText":"探索电子游戏、游戏主机和配件，开启下一段冒险。","explore":"浏览商品","featuredPicks":"查看精选商品","secure":"安全结账","revolutHandled":"由 Revolut 处理付款","customerSupport":"客户支持","clearOrder":"清晰的订单信息","reviewBasket":"付款前请检查购物车","handPicked":"精选推荐","featured":"精选","offers":"优惠","selectedItems":"看看我们商店精选的商品。","preorder":"预购商品","upcoming":"即将推出的商品信息。官方公布后将确认图片和发行详情。","addBasket":"加入购物车","bundle":"组合商品","bundleDesc":"PlayStation 5 主机、DualSense 手柄和 GTA VI。","availabilityNote":"付款前请确认库存、发行日期、配送费用和最终订单详情。","theStore":"商店","findYour":"寻找你的","gear":"游戏装备。","browse":"浏览游戏、主机和配件。","allItems":"全部商品","games":"游戏","consoles":"主机","accessories":"配件","search":"搜索商品...","aboutStore":"关于商店","gamingGear":"游戏装备。","madeSimple":"轻松选购。","aboutText":"Game Good Now 是一家销售电子游戏、游戏主机和游戏配件的网上商店。我们致力于提供清晰的商品信息，让浏览和下单更加简单，付款由支付服务商处理。","contactSupport":"联系客户支持","needHand":"需要帮助？","contactUs":"联系我们。","emailSupport":"电子邮件支持","beforeOrder":"下单前","beforeOrderText":"请联系我们确认库存、配送费用和预计送达时间。","orderQuestions":"订单问题","orderQuestionsText":"联系客户支持时，请提供您的订单信息。","footerLine":"游戏、主机和配件。","yourSelection":"您的选择","shoppingBasket":"购物车","deliveryDetails":"配送信息","enterDetails":"继续使用 Revolut 结账前，请填写您的信息。","firstName":"名字 *","lastName":"姓氏 *","email":"电子邮件 *","phone":"电话","address":"地址 *","city":"城市 *","postal":"邮政编码 *","country":"国家/地区 *","continueRevolut":"前往 Revolut","continueCheckout":"继续结账","clearBasket":"清空购物车","paymentNote":"您将跳转至 Revolut 完成付款。此静态网站不会自动向商店发送订单详情。"},"es":{"navFeatured":"Ofertas","navShop":"Tienda","navAbout":"Acerca de","navHelp":"Ayuda","cart":"Carrito","eyebrow":"TU SIGUIENTE NIVEL EMPIEZA AQUÍ","heroTitle":"Lleva tu","heroTitle2":"setup gaming al siguiente nivel.","heroText":"Descubre videojuegos, consolas y accesorios para tu próxima aventura.","explore":"Ver productos","featuredPicks":"Ver productos destacados","secure":"Pago seguro","revolutHandled":"Pago gestionado por Revolut","customerSupport":"Atención al cliente","clearOrder":"Detalles claros del pedido","reviewBasket":"Revisa tu carrito antes de pagar","handPicked":"SELECCIÓN ESPECIAL","featured":"Ofertas","offers":"destacadas","selectedItems":"Descubre una selección de productos de nuestra tienda.","preorder":"RESERVA","upcoming":"Anuncio de un próximo lanzamiento. Las imágenes y los detalles se confirmarán cuando estén disponibles oficialmente.","addBasket":"Añadir al carrito","bundle":"LOTE","bundleDesc":"Consola PlayStation 5 con DualSense y GTA VI.","availabilityNote":"Confirma la disponibilidad, las fechas de lanzamiento, los gastos de envío y los detalles del pedido antes de pagar.","theStore":"LA TIENDA","findYour":"Encuentra tu","gear":"equipo.","browse":"Explora juegos, consolas y accesorios.","allItems":"Todos los artículos","games":"Juegos","consoles":"Consolas","accessories":"Accesorios","search":"Buscar productos...","aboutStore":"SOBRE LA TIENDA","gamingGear":"Equipo gaming.","madeSimple":"Así de fácil.","aboutText":"Game Good Now es una tienda online de videojuegos, consolas y accesorios gaming. Queremos que explorar y comprar sea sencillo, con información clara y el pago gestionado por nuestro proveedor de pagos.","contactSupport":"Contactar con atención al cliente","needHand":"¿Necesitas ayuda?","contactUs":"Contáctanos.","emailSupport":"Soporte por correo electrónico","beforeOrder":"Antes de comprar","beforeOrderText":"Pregúntanos para confirmar existencias, gastos de envío y plazo de entrega estimado.","orderQuestions":"Consultas sobre pedidos","orderQuestionsText":"Incluye los datos de tu pedido al contactar con atención al cliente.","footerLine":"Juegos, consolas y accesorios.","yourSelection":"TU SELECCIÓN","shoppingBasket":"Carrito","deliveryDetails":"Datos de entrega","enterDetails":"Introduce tus datos antes de continuar al pago de Revolut.","firstName":"Nombre *","lastName":"Apellidos *","email":"Correo electrónico *","phone":"Teléfono","address":"Dirección *","city":"Ciudad *","postal":"Código postal *","country":"País *","continueRevolut":"Continuar a Revolut","continueCheckout":"Continuar con el pago","clearBasket":"Vaciar carrito","paymentNote":"Serás redirigido a Revolut para completar el pago. Esta web estática no envía automáticamente los datos del pedido a la tienda."},"ar":{"navFeatured":"العروض","navShop":"المتجر","navAbout":"من نحن","navHelp":"المساعدة","cart":"السلة","eyebrow":"مستواك التالي يبدأ من هنا","heroTitle":"طوّر","heroTitle2":"إعدادات الألعاب لديك.","heroText":"اكتشف ألعاب الفيديو وأجهزة اللعب والإكسسوارات لمغامرتك القادمة.","explore":"استكشف المنتجات","featuredPicks":"شاهد الاختيارات المميزة","secure":"دفع آمن","revolutHandled":"تتم معالجة الدفع عبر Revolut","customerSupport":"دعم العملاء","clearOrder":"تفاصيل طلب واضحة","reviewBasket":"راجع سلتك قبل الدفع","handPicked":"اختيارات مميزة","featured":"عروض","offers":"مختارة","selectedItems":"تعرّف على مجموعة مختارة من منتجات متجرنا.","preorder":"طلب مسبق","upcoming":"إعلان عن إصدار قادم. سيتم تأكيد الصور وتفاصيل الإصدار عند توفرها رسميًا.","addBasket":"أضف إلى السلة","bundle":"عرض مجموعة","bundleDesc":"جهاز PlayStation 5 مع وحدة تحكم DualSense ولعبة GTA VI.","availabilityNote":"يرجى تأكيد التوفر ومواعيد الإصدار وتكاليف التوصيل وتفاصيل الطلب قبل الدفع.","theStore":"المتجر","findYour":"اعثر على","gear":"معداتك.","browse":"تصفح الألعاب وأجهزة اللعب والإكسسوارات.","allItems":"كل المنتجات","games":"الألعاب","consoles":"أجهزة اللعب","accessories":"الإكسسوارات","search":"ابحث عن المنتجات...","aboutStore":"عن المتجر","gamingGear":"معدات الألعاب.","madeSimple":"بكل سهولة.","aboutText":"Game Good Now متجر إلكتروني يعرض ألعاب الفيديو وأجهزة اللعب وإكسسوارات الألعاب. نسعى إلى جعل التصفح والطلب سهلين مع معلومات واضحة عن المنتجات، وتتم معالجة الدفع عبر مزود الدفع لدينا.","contactSupport":"تواصل مع دعم العملاء","needHand":"هل تحتاج إلى مساعدة؟","contactUs":"تواصل معنا.","emailSupport":"الدعم عبر البريد الإلكتروني","beforeOrder":"قبل الطلب","beforeOrderText":"تواصل معنا لتأكيد توفر المنتج وتكلفة التوصيل ومدة التسليم المتوقعة.","orderQuestions":"استفسارات الطلبات","orderQuestionsText":"يرجى تضمين تفاصيل طلبك عند التواصل مع دعم العملاء.","footerLine":"ألعاب وأجهزة لعب وإكسسوارات.","yourSelection":"اختياراتك","shoppingBasket":"سلة التسوق","deliveryDetails":"تفاصيل التوصيل","enterDetails":"أدخل بياناتك قبل المتابعة إلى صفحة الدفع عبر Revolut.","firstName":"الاسم الأول *","lastName":"اسم العائلة *","email":"البريد الإلكتروني *","phone":"الهاتف","address":"العنوان *","city":"المدينة *","postal":"الرمز البريدي *","country":"الدولة *","continueRevolut":"المتابعة إلى Revolut","continueCheckout":"متابعة الدفع","clearBasket":"إفراغ السلة","paymentNote":"سيتم تحويلك إلى Revolut لإتمام الدفع. هذا الموقع الثابت لا يرسل تفاصيل الطلب تلقائيًا إلى المتجر."},"it":{"navFeatured":"Offerte","navShop":"Negozio","navAbout":"Chi siamo","navHelp":"Assistenza","cart":"Carrello","eyebrow":"IL TUO PROSSIMO LIVELLO INIZIA QUI","heroTitle":"Fai evolvere il tuo","heroTitle2":"setup gaming.","heroText":"Scopri videogiochi, console e accessori per la tua prossima avventura.","explore":"Scopri i prodotti","featuredPicks":"Guarda le offerte in evidenza","secure":"Checkout sicuro","revolutHandled":"Pagamento gestito da Revolut","customerSupport":"Assistenza clienti","clearOrder":"Dettagli ordine chiari","reviewBasket":"Controlla il carrello prima di pagare","handPicked":"SELEZIONATI","featured":"Offerte","offers":"in evidenza","selectedItems":"Scopri una selezione di articoli del nostro negozio.","preorder":"PREORDINE","upcoming":"Annuncio di un’uscita futura. Immagini e dettagli saranno confermati quando disponibili ufficialmente.","addBasket":"Aggiungi al carrello","bundle":"OFFERTA BUNDLE","bundleDesc":"Console PlayStation 5 con DualSense e GTA VI.","availabilityNote":"Disponibilità, date di uscita, costi di spedizione e dettagli finali dell’ordine devono essere confermati prima del pagamento.","theStore":"IL NEGOZIO","findYour":"Trova la tua","gear":"attrezzatura.","browse":"Sfoglia giochi, console e accessori.","allItems":"Tutti gli articoli","games":"Giochi","consoles":"Console","accessories":"Accessori","search":"Cerca prodotti...","aboutStore":"IL NEGOZIO","gamingGear":"Accessori gaming.","madeSimple":"In modo semplice.","aboutText":"Game Good Now è un negozio online di videogiochi, console e accessori gaming. Vogliamo rendere la navigazione e gli ordini semplici, con informazioni chiare sui prodotti e pagamento gestito dal nostro fornitore.","contactSupport":"Contatta l’assistenza clienti","needHand":"Hai bisogno di aiuto?","contactUs":"Contattaci.","emailSupport":"Assistenza via e-mail","beforeOrder":"Prima di ordinare","beforeOrderText":"Contattaci per confermare disponibilità, costi di spedizione e tempi di consegna stimati.","orderQuestions":"Domande sugli ordini","orderQuestionsText":"Includi i dettagli dell’ordine quando contatti l’assistenza clienti.","footerLine":"Giochi, console e accessori.","yourSelection":"LA TUA SELEZIONE","shoppingBasket":"Carrello","deliveryDetails":"Dettagli di consegna","enterDetails":"Inserisci i tuoi dati prima di proseguire al checkout Revolut.","firstName":"Nome *","lastName":"Cognome *","email":"E-mail *","phone":"Telefono","address":"Indirizzo *","city":"Città *","postal":"CAP *","country":"Paese *","continueRevolut":"Continua su Revolut","continueCheckout":"Procedi al checkout","clearBasket":"Svuota il carrello","paymentNote":"Verrai reindirizzato a Revolut per completare il pagamento. Questo sito statico non invia automaticamente i dettagli dell’ordine al negozio."}};

let currentLanguage = localStorage.getItem('ggn_language') || 'en';
function t(key) { return (translations[currentLanguage] && translations[currentLanguage][key]) || key; }
function applyLanguage(lang) {
  currentLanguage = translations[lang] ? lang : 'en';
  try { localStorage.setItem('ggn_language', currentLanguage); } catch (_) {}
  document.documentElement.lang = currentLanguage;
  document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el => { const key=el.getAttribute('data-i18n'); if (translations[currentLanguage][key]) el.textContent=translations[currentLanguage][key]; });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { const key=el.getAttribute('data-i18n-placeholder'); if (translations[currentLanguage][key]) el.placeholder=translations[currentLanguage][key]; });
  document.getElementById('lang-select').value = currentLanguage;
  render(); updateCart();
}

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved.filter(item => item && typeof item.name === 'string' && Number.isFinite(Number(item.price)) && Number.isFinite(Number(item.qty)) && Number(item.qty) > 0).map(item => ({ name: item.name, price: Number(item.price), qty: Math.floor(Number(item.qty)), img: item.img || '' })) : [];
  } catch (_) { return []; }
}
function saveCart() {
  try { localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart)); } catch (_) { /* storage may be disabled */ }
}
function money(value) { return `€${Number(value).toFixed(2).replace(/\.00$/, '')}`; }
function safeText(value) {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}
function render() {
  const query = searchInput.value.trim().toLowerCase();
  const list = products.filter(product => (activeFilter === 'all' || product.cat === activeFilter) && product.name.toLowerCase().includes(query));
  grid.innerHTML = '';
  if (!list.length) {
    grid.innerHTML = `<div class="empty-results">${({de:'Keine Produkte gefunden. Bitte versuche eine andere Suche.',fr:'Aucun produit trouvé. Essayez une autre recherche.',zh:'未找到商品，请尝试其他搜索。',es:'No se encontraron productos. Prueba otra búsqueda.',ar:'لم يتم العثور على منتجات. جرّب بحثًا آخر.',it:'Nessun prodotto trovato. Prova un’altra ricerca.'}[currentLanguage] || 'No products found. Try another search.')}</div>`;
    return;
  }
  list.forEach(product => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `<div class="product-image-wrap"><img src="${safeText(product.img)}" alt="${safeText(product.name)}" loading="lazy"><span class="product-category">${product.cat === 'spil' ? ({de:'SPIEL',fr:'JEU',zh:'游戏',es:'JUEGO',ar:'لعبة',it:'GIOCO'}[currentLanguage] || 'GAME') : product.cat === 'konsol' ? ({de:'KONSOLE',fr:'CONSOLE',zh:'主机',es:'CONSOLA',ar:'جهاز',it:'CONSOLE'}[currentLanguage] || 'CONSOLE') : ({de:'ZUBEHÖR',fr:'ACCESSOIRE',zh:'配件',es:'ACCESORIO',ar:'إكسسوار',it:'ACCESSORIO'}[currentLanguage] || 'ACCESSORY')}</span></div><div class="product-info"><h3>${safeText(product.name)}</h3><div class="product-bottom"><strong class="price">${money(product.price)}</strong><button class="add-button" type="button" aria-label="${t('addBasket')} ${safeText(product.name)}">＋</button></div><button class="buy-button" type="button">${t('addBasket')}</button></div>`;
    card.querySelector('.add-button').addEventListener('click', () => addDeal(product.name, product.price, 1, product.img));
    card.querySelector('.buy-button').addEventListener('click', () => addDeal(product.name, product.price, 1, product.img));
    grid.appendChild(card);
  });
}
function showSuggestions(query) {
  if (!query.trim()) { suggestionsBox.classList.remove('show'); suggestionsBox.innerHTML = ''; return; }
  const matches = products.filter(product => product.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
  suggestionsBox.innerHTML = matches.length ? matches.map(product => `<button class="suggestion-item" type="button" data-name="${safeText(product.name)}"><img src="${safeText(product.img)}" alt="" loading="lazy"><span>${safeText(product.name)}<small>${money(product.price)}</small></span></button>`).join('') : '<div class="suggestion-empty">No matching products</div>';
  suggestionsBox.classList.add('show');
  suggestionsBox.querySelectorAll('[data-name]').forEach(button => button.addEventListener('click', () => {
    searchInput.value = button.dataset.name;
    activeFilter = 'all';
    document.querySelectorAll('.filter').forEach(item => item.classList.toggle('active', item.dataset.filter === 'all'));
    render(); suggestionsBox.classList.remove('show');
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
  }));
}
searchInput.addEventListener('input', () => { render(); showSuggestions(searchInput.value); });
searchInput.addEventListener('focus', () => { if (searchInput.value) showSuggestions(searchInput.value); });
document.addEventListener('click', event => { if (!event.target.closest('.search-wrapper')) suggestionsBox.classList.remove('show'); });
document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  activeFilter = button.dataset.filter;
  document.querySelectorAll('.filter').forEach(item => item.classList.toggle('active', item === button));
  render();
}));

function addDeal(name, price, qty = 1, img = '') {
  const amount = Math.max(1, Math.min(99, Math.floor(Number(qty) || 1)));
  const existing = cart.find(item => item.name === name);
  if (existing) existing.qty = Math.min(99, existing.qty + amount);
  else cart.push({ name, price: Number(price), qty: amount, img });
  updateCart(); openCart();
}
function updateCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = totalItems;
  const itemsDiv = document.getElementById('cart-items');
  itemsDiv.innerHTML = cart.map((item, index) => `<div class="cart-item">${item.img ? `<img src="${safeText(item.img)}" alt="">` : ''}<div class="cart-item-name"><b>${safeText(item.name)}</b><small>${money(item.price)} each</small></div><div class="qty-control"><button type="button" aria-label="Decrease quantity" onclick="changeQty(${index},-1)">−</button><span>${item.qty}</span><button type="button" aria-label="Increase quantity" onclick="changeQty(${index},1)">＋</button></div><strong>${money(item.price * item.qty)}</strong></div>`).join('') || `<p class="empty-cart">${({de:'Dein Warenkorb ist leer. Füge ein Produkt hinzu.',fr:'Votre panier est vide. Ajoutez un produit pour commencer.',zh:'购物车为空。请先添加商品。',es:'Tu carrito está vacío. Añade un producto para empezar.',ar:'سلتك فارغة. أضف منتجًا للبدء.',it:'Il carrello è vuoto. Aggiungi un prodotto per iniziare.'}[currentLanguage] || 'Your basket is empty. Add a product to get started.')}</p>`;
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  document.getElementById('cart-total').textContent = `${({de:"Gesamt",fr:"Total",zh:"总计",es:"Total",ar:"الإجمالي",it:"Totale"}[currentLanguage] || "Total")}: ${money(total)}`;
  refreshShippingUI();
  document.getElementById('show-checkout').disabled = cart.length === 0;
  saveCart();
}
function changeQty(index, delta) {
  if (!cart[index]) return;
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  updateCart();
  if (!cart.length) resetCheckout();
}
function resetCheckout() {
  document.getElementById('checkout-form').style.display = 'none';
  document.getElementById('show-checkout').style.display = 'block';
}
function openCart() { document.getElementById('cart-modal').style.display = 'flex'; document.body.classList.add('modal-open'); }
function closeCart() { document.getElementById('cart-modal').style.display = 'none'; document.body.classList.remove('modal-open'); }
function clearCart() { cart = []; updateCart(); resetCheckout(); }
function showCheckoutForm() {
  if (!cart.length) { alert(({de:'Dein Warenkorb ist leer.',fr:'Votre panier est vide.',zh:'购物车为空。',es:'Tu carrito está vacío.',ar:'سلة التسوق فارغة.',it:'Il carrello è vuoto.'}[currentLanguage] || 'Your basket is empty.')); return; }
  document.getElementById('checkout-form').style.display = 'block';
  document.getElementById('show-checkout').style.display = 'none';
}
let orderSubmissionInProgress = false;

async function confirmOrder() {
  if (orderSubmissionInProgress) return;
  const ids = ['fname', 'lname', 'email', 'address', 'city', 'postal', 'country'];
  const values = Object.fromEntries(ids.map(id => [id, document.getElementById(id).value.trim()]));
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email);
  if (ids.some(id => !values[id]) || !emailValid) {
    alert(({de:'Bitte fülle alle Pflichtfelder aus und gib eine gültige E-Mail-Adresse ein.',fr:'Veuillez remplir tous les champs obligatoires et saisir une adresse e-mail valide.',zh:'请填写所有必填项并输入有效的电子邮件地址。',es:'Completa todos los campos obligatorios e introduce un correo válido.',ar:'يرجى إكمال جميع الحقول المطلوبة وإدخال بريد إلكتروني صالح.',it:'Compila tutti i campi obbligatori e inserisci un indirizzo e-mail valido.'}[currentLanguage] || 'Please complete all required fields and enter a valid email address.'));
    const firstInvalid = ids.map(id => document.getElementById(id)).find(input => !input.value.trim() || (input.type === 'email' && !input.validity.valid));
    if (firstInvalid) firstInvalid.focus();
    return;
  }
  if (!cart.length) { alert(({de:'Dein Warenkorb ist leer.',fr:'Votre panier est vide.',zh:'购物车为空。',es:'Tu carrito está vacío.',ar:'سلة التسوق فارغة.',it:'Il carrello è vuoto.'}[currentLanguage] || 'Your basket is empty.')); return; }

  const shippingDetails = refreshShippingUI();
  const total = shippingDetails.total;
  const orderNumber = `GGN-${Date.now()}`;
  const customerName = `${values.fname} ${values.lname}`;
  const phone = document.getElementById('phone').value.trim();
  const shippingAddress = `${values.address}, ${values.postal} ${values.city}, ${values.country}`;
  const orderItems = cart.map(item => `${item.name} × ${item.qty} — €${(item.price * item.qty).toFixed(2)}`).join('\n');
  const order = {
    orderNumber,
    customer: { name: customerName, email: values.email, phone, address: shippingAddress },
    items: cart.map(item => ({ name: item.name, price: item.price, quantity: item.qty })),
    total, currency: 'EUR', createdAt: new Date().toISOString()
  };
  try { localStorage.setItem('lastOrder', JSON.stringify(order)); } catch (_) { /* no local storage available */ }

  const templateParams = {
    order_number: orderNumber,
    email: values.email,
    customer_name: customerName,
    customer_email: values.email,
    customer_phone: phone || 'Not provided',
    shipping_address: shippingAddress,
    order_items: orderItems,
    order_total: `€${total.toFixed(2)}`,
    shipping_method: shippingDetails.carrier,
    shipping_cost: `€${shippingDetails.shipping.toFixed(2)}`,
    order_status: 'Payment not yet verified — check Revolut manually',
    reply_to: values.email
  };

  const checkoutButton = document.querySelector('#checkout-form .checkout-btn');
  orderSubmissionInProgress = true;
  if (checkoutButton) { checkoutButton.disabled = true; checkoutButton.dataset.originalText = checkoutButton.textContent; checkoutButton.textContent = 'Sending order details…'; }

  try {
    if (!window.emailjs) throw new Error('EmailJS library did not load.');
    await emailjs.send('service_ugj62eh', 'template_v9uyohy', templateParams, {
      publicKey: 'S_AcPoR-Af1RxiYbc'
    });
  } catch (error) {
    console.error('EmailJS order email failed:', error);
    orderSubmissionInProgress = false;
    if (checkoutButton) { checkoutButton.disabled = false; checkoutButton.textContent = checkoutButton.dataset.originalText || 'Continue to Revolut'; }
    alert('Your order details could not be emailed to the store. Please try again or contact support@game-good-now.com. You have not been redirected to payment.');
    return;
  }

  // The existing Revolut URL is a fixed payment link and cannot be given this dynamic total.
  // Stop here rather than redirecting the customer to an incorrect amount.
  alert(`Your order request ${orderNumber} has been sent to the store. Total including shipping: €${total.toFixed(2)}. Payment is not taken yet. The store must send a matching Revolut payment request.`);

}

document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('country').addEventListener('input', refreshShippingUI);
document.getElementById('shipping-carrier').addEventListener('change', refreshShippingUI);
document.getElementById('lang-select').addEventListener('change', event => applyLanguage(event.target.value));
document.getElementById('cart-modal').addEventListener('click', event => { if (event.target.id === 'cart-modal') closeCart(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeCart(); });
render();
updateCart();
applyLanguage(currentLanguage);
