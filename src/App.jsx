import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
apiKey: "AIzaSyA3HFYPJm-KeA1UJJDViTDkeQfl2k3GBL0",
authDomain: "bonded-75e5e.firebaseapp.com",
projectId: "bonded-75e5e",
storageBucket: "bonded-75e5e.firebasestorage.app",
messagingSenderId: "357218341238",
appId: "1:357218341238:web:7018dd4778d5bc983cea57"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

import { useState, useEffect, useRef } from "react";
const T = {
  pt: {
    flag: "🇧🇷",
    name: "Português",
    tagline: "Officially in love.",
    subtitle: "Make your love official with an AI certificate.",
    btn_register: "💍 Registrar compromisso",
    btn_check: "🔍 Verificar relacionamento",
    btn_end: "💔 Declarar término",
    btn_plans: "👑 Planos & Preços",
    active_title: "Relacionamentos Ativos",
    history_title: "Histórico",
    since: "desde",
    ended_on: "encerrado em",
    see_cert: "ver cert. →",
    see: "ver →",
    back: "← Voltar",
    register_title: "Registrar Compromisso",
    register_sub: "Ambos devem concordar com o registro",
    person1: "Nome da Pessoa 1",
    person2: "Nome da Pessoa 2",
    start_date: "Data de Início",
    ph1: "Nome completo",
    ph2: "Nome completo",
    contact1: "Email ou Telefone Pessoa 1",
    contact2: "Email ou Telefone Pessoa 2",
    ph_contact: "ex: joao@email.com ou +351 912 345 678",
    contact_note:
      "🔒 Email ou telefone são usados apenas para identificação única. Nunca aparecem no certificado.",
    city1: "Cidade da Pessoa 1",
    city2: "Cidade da Pessoa 2",
    country1: "País da Pessoa 1",
    country2: "País da Pessoa 2",
    ph_city: "Ex: Lisboa",
    ph_country: "Ex: Portugal",
    location_note:
      "📍 Cidade e país são usados para identificar cada pessoa de forma única e evitar conflitos de nomes.",
    photo_label: "Foto do casal (Premium)",
    photo_hint: "Adicione uma foto de vocês dois",
    protection:
      "🔒 Proteção ativa: o sistema bloqueia se alguém já estiver em relacionamento registrado.",
    btn_generate: "💍 Registrar & Gerar Certificado",
    generating: "✦ Gerando com IA...",
    check_title: "Verificar Situação",
    check_sub: "Consulte se alguém está em relacionamento registrado",
    check_label: "Nome para consultar",
    check_ph: "Digite o nome",
    btn_check_action: "🔍 Verificar",
    in_rel: "🔒 Em relacionamento registrado",
    in_rel_desc: "Esta pessoa está em um compromisso ativo desde",
    privacy_note: "Por privacidade, o nome do parceiro(a) não é exibido.",
    free_status: "✓ Sem relacionamento registrado",
    free_desc: "Esta pessoa não possui nenhum relacionamento ativo no Bonded.",
    privacy_info: "ℹ️ A consulta mostra apenas se existe vínculo ativo.",
    end_title: "Declarar Término",
    end_sub: "Encerre o vínculo e libere ambos para novos relacionamentos",
    end_label: "Seu nome",
    end_ph: "Digite seu nome para localizar o vínculo",
    end_note:
      "📋 Após o término ambos receberão um Certificado de Término oficial.",
    btn_end_action: "💔 Confirmar Término",
    active_list: "Relacionamentos ativos",
    cert_title: "Certificado de Compromisso",
    cert_end_title: "Certificado de Término",
    cert_org: "Bonded — Officially in love.",
    cert_text: (p1, p2, s, c1, co1, c2, co2) =>
      `Certificamos que ${p1} (${c1}, ${co1}) e ${p2} (${c2}, ${co2}) declararam mutuamente seu compromisso amoroso em ${s}, estabelecendo um vínculo de confiança, respeito e afeto.`,
    cert_end_text: (p1, p2, e, s) =>
      `${p1} e ${p2} encerraram seu relacionamento em ${e}, tendo iniciado em ${s}.`,
    cert_active: "🔒 VÍNCULO ATIVO — ASSINADO DIGITALMENTE",
    cert_ended: "🔓 VÍNCULO ENCERRADO — AMBOS ESTÃO LIVRES",
    cert_ai: "✦ Gerado e validado por Inteligência Artificial",
    cert_premium: "⭐ CERTIFICADO PREMIUM",
    btn_close: "Fechar",
    btn_download: "⬇ Baixar / Imprimir",
    conflict: (n) => `⚠️ ${n} já está em relacionamento registrado no Bonded.`,
    no_active: "Nenhum relacionamento ativo encontrado.",
    confirm_end: (p1, p2) => `Confirma o término entre ${p1} e ${p2}?`,
    ai_prompt: (p1, p2, d) =>
      `Crie uma mensagem poética, romântica e elegante de 2 frases para um certificado de compromisso entre ${p1} e ${p2}, iniciado em ${d}. Só a mensagem, sem aspas.`,
    ai_fallback:
      "Que este compromisso seja o começo de uma história linda, construída com amor e cumplicidade todos os dias.",
    plans_title: "Planos & Preços",
    free_plan: "Grátis",
    premium_plan: "Premium",
    free_price: "€0",
    premium_price: "€9,99 / 6 meses",
    premium_monthly: "≈ €1,67/mês",
    free_features: [
      "✓ Certificado digital básico",
      "✓ Verificação de status",
      "✓ Registro de compromisso",
      "✓ Certificado de término",
    ],
    premium_features: [
      "⭐ Tudo do plano grátis",
      "⭐ Certificado premium elegante",
      "⭐ QR Code de verificação",
      "⭐ Foto do casal no certificado",
      "⭐ Lembrete de aniversário",
      "⭐ Suporte prioritário",
    ],
    btn_free: "Usar Grátis",
    btn_premium: "Assinar Premium",
    current_plan: "Plano atual",
    upgrade: "Fazer upgrade",
    pay_title: "Assinar Premium",
    pay_subtitle: "6 meses por apenas €9,99",
    pay_saving: "💰 Poupa €1,95 vs mensal!",
    pay_period: "Acesso completo por 6 meses",
    pay_name: "Nome no cartão",
    pay_card: "Número do cartão",
    pay_expiry: "Validade",
    pay_cvv: "CVV",
    pay_btn: "💳 Pagar €9,99 (6 meses)",
    pay_secure: "🔒 Pagamento 100% seguro · Acesso imediato",
    pay_success: "🎉 Premium ativado! Aproveita 6 meses de amor oficial 💍",
    anniversary: "🎂 Aniversário do relacionamento",
    anniversary_msg: (d) =>
      `Hoje faz ${d} ${d === 1 ? "ano" : "anos"} que vocês estão juntos! 🥂`,
    qr_label: "QR Code de verificação",
    gdpr_title: "Privacidade & Cookies",
    gdpr_text:
      "Usamos seus dados apenas para registrar e verificar relacionamentos. Você pode apagar seus dados a qualquer momento. Ao continuar, aceita nossa Política de Privacidade conforme o GDPR.",
    gdpr_accept: "Aceitar e continuar",
    gdpr_decline: "Só essencial",
    gdpr_privacy: "Política de Privacidade",
    premium_badge: "PREMIUM",
    anniversary_title: "Aniversários",
  },
  en: {
    flag: "🇬🇧",
    name: "English",
    tagline: "Officially in love.",
    subtitle: "Make your love official with an AI certificate.",
    btn_register: "💍 Register commitment",
    btn_check: "🔍 Check relationship",
    btn_end: "💔 Declare breakup",
    btn_plans: "👑 Plans & Pricing",
    active_title: "Active Relationships",
    history_title: "History",
    since: "since",
    ended_on: "ended on",
    see_cert: "see cert. →",
    see: "see →",
    back: "← Back",
    register_title: "Register Commitment",
    register_sub: "Both parties must agree to the registration",
    person1: "Person 1 Name",
    person2: "Person 2 Name",
    start_date: "Start Date",
    ph1: "Full name",
    ph2: "Full name",
    contact1: "Person 1 Email or Phone",
    contact2: "Person 2 Email or Phone",
    ph_contact: "e.g. john@email.com or +44 7911 123456",
    contact_note:
      "🔒 Email or phone are used only for unique identification. Never shown on the certificate.",
    city1: "Person 1 City",
    city2: "Person 2 City",
    country1: "Person 1 Country",
    country2: "Person 2 Country",
    ph_city: "e.g. London",
    ph_country: "e.g. United Kingdom",
    location_note:
      "📍 City and country are used to uniquely identify each person and avoid name conflicts.",
    photo_label: "Couple photo (Premium)",
    photo_hint: "Add a photo of the two of you",
    protection:
      "🔒 Active protection: system blocks if someone is already in a registered relationship.",
    btn_generate: "💍 Register & Generate Certificate",
    generating: "✦ Generating with AI...",
    check_title: "Check Status",
    check_sub: "Check if someone is in a registered relationship",
    check_label: "Name to search",
    check_ph: "Enter name",
    btn_check_action: "🔍 Check",
    in_rel: "🔒 In a registered relationship",
    in_rel_desc: "This person is in an active commitment since",
    privacy_note: "For privacy, the partner's name is not displayed.",
    free_status: "✓ No registered relationship",
    free_desc: "This person has no active relationship on Bonded.",
    privacy_info: "ℹ️ The search only shows whether an active bond exists.",
    end_title: "Declare Breakup",
    end_sub: "End the bond and free both for new relationships",
    end_label: "Your name",
    end_ph: "Enter your name to find the bond",
    end_note:
      "📋 After the breakup, both will receive an official End Certificate.",
    btn_end_action: "💔 Confirm Breakup",
    active_list: "Active relationships",
    cert_title: "Commitment Certificate",
    cert_end_title: "Breakup Certificate",
    cert_org: "Bonded — Officially in love.",
    cert_text: (p1, p2, s, c1, co1, c2, co2) =>
      `We certify that ${p1} (${c1}, ${co1}) and ${p2} (${c2}, ${co2}) mutually declared their love commitment on ${s}, establishing a bond of trust, respect and affection.`,
    cert_end_text: (p1, p2, e, s) =>
      `${p1} and ${p2} ended their relationship on ${e}, having started on ${s}.`,
    cert_active: "🔒 ACTIVE BOND — DIGITALLY SIGNED",
    cert_ended: "🔓 BOND ENDED — BOTH ARE FREE",
    cert_ai: "✦ Generated and validated by Artificial Intelligence",
    cert_premium: "⭐ PREMIUM CERTIFICATE",
    btn_close: "Close",
    btn_download: "⬇ Download / Print",
    conflict: (n) =>
      `⚠️ ${n} is already in a registered relationship on Bonded.`,
    no_active: "No active relationship found.",
    confirm_end: (p1, p2) =>
      `Confirm the end of the relationship between ${p1} and ${p2}?`,
    ai_prompt: (p1, p2, d) =>
      `Create a poetic, romantic and elegant 2-sentence message for a love commitment certificate between ${p1} and ${p2}, started on ${d}. Only the message, no quotes.`,
    ai_fallback:
      "May this commitment be the beginning of a beautiful story, built with love and togetherness every single day.",
    plans_title: "Plans & Pricing",
    free_plan: "Free",
    premium_plan: "Premium",
    free_price: "€0",
    premium_price: "€9.99 / 6 months",
    premium_monthly: "≈ €1.67/month",
    free_features: [
      "✓ Basic digital certificate",
      "✓ Status verification",
      "✓ Commitment registration",
      "✓ Breakup certificate",
    ],
    premium_features: [
      "⭐ Everything in Free",
      "⭐ Elegant premium certificate",
      "⭐ Verification QR Code",
      "⭐ Couple photo on certificate",
      "⭐ Anniversary reminder",
      "⭐ Priority support",
    ],
    btn_free: "Use Free",
    btn_premium: "Subscribe Premium",
    current_plan: "Current plan",
    upgrade: "Upgrade",
    pay_title: "Subscribe to Premium",
    pay_subtitle: "6 months for only €9.99",
    pay_saving: "💰 Save €1.95 vs monthly!",
    pay_period: "Full access for 6 months",
    pay_name: "Name on card",
    pay_card: "Card number",
    pay_expiry: "Expiry",
    pay_cvv: "CVV",
    pay_btn: "💳 Pay €9.99 (6 months)",
    pay_secure: "🔒 100% secure · Immediate access for 6 months",
    pay_success: "🎉 Premium activated! Enjoy 6 months of official love 💍",
    anniversary: "🎂 Relationship anniversary",
    anniversary_msg: (d) =>
      `Today marks ${d} ${d === 1 ? "year" : "years"} together! 🥂`,
    qr_label: "Verification QR Code",
    gdpr_title: "Privacy & Cookies",
    gdpr_text:
      "We use your data only to register and verify relationships. You can delete your data at any time. By continuing, you accept our Privacy Policy under GDPR.",
    gdpr_accept: "Accept and continue",
    gdpr_decline: "Essential only",
    gdpr_privacy: "Privacy Policy",
    premium_badge: "PREMIUM",
    anniversary_title: "Anniversaries",
  },
  es: {
    flag: "🇪🇸",
    name: "Español",
    tagline: "Officially in love.",
    subtitle: "Make your love official with an AI certificate.",
    btn_register: "💍 Registrar compromiso",
    btn_check: "🔍 Verificar relación",
    btn_end: "💔 Declarar ruptura",
    btn_plans: "👑 Planes & Precios",
    active_title: "Relaciones Activas",
    history_title: "Historial",
    since: "desde",
    ended_on: "terminado el",
    see_cert: "ver cert. →",
    see: "ver →",
    back: "← Volver",
    register_title: "Registrar Compromiso",
    register_sub: "Ambas partes deben aceptar el registro",
    person1: "Nombre Persona 1",
    person2: "Nombre Persona 2",
    start_date: "Fecha de Inicio",
    ph1: "Nombre completo",
    ph2: "Nombre completo",
    contact1: "Email o Teléfono Persona 1",
    contact2: "Email o Teléfono Persona 2",
    ph_contact: "ej: juan@email.com o +34 612 345 678",
    contact_note:
      "🔒 Email o teléfono se usan solo para identificación única. Nunca aparecen en el certificado.",
    city1: "Ciudad Persona 1",
    city2: "Ciudad Persona 2",
    country1: "País Persona 1",
    country2: "País Persona 2",
    ph_city: "Ej: Madrid",
    ph_country: "Ej: España",
    location_note:
      "📍 La ciudad y el país identifican a cada persona de forma única para evitar conflictos de nombres.",
    photo_label: "Foto de pareja (Premium)",
    photo_hint: "Agrega una foto de los dos",
    protection:
      "🔒 Protección activa: el sistema bloquea si alguien ya está en una relación registrada.",
    btn_generate: "💍 Registrar & Generar Certificado",
    generating: "✦ Generando con IA...",
    check_title: "Verificar Estado",
    check_sub: "Consulta si alguien está en una relación registrada",
    check_label: "Nombre a consultar",
    check_ph: "Escribe el nombre",
    btn_check_action: "🔍 Verificar",
    in_rel: "🔒 En relación registrada",
    in_rel_desc: "Esta persona está en un compromiso activo desde",
    privacy_note: "Por privacidad, el nombre de la pareja no se muestra.",
    free_status: "✓ Sin relación registrada",
    free_desc: "Esta persona no tiene ninguna relación activa en Bonded.",
    privacy_info: "ℹ️ La consulta solo muestra si existe un vínculo activo.",
    end_title: "Declarar Ruptura",
    end_sub: "Termina el vínculo y libera a ambos para nuevas relaciones",
    end_label: "Tu nombre",
    end_ph: "Escribe tu nombre para localizar el vínculo",
    end_note: "📋 Tras la ruptura, ambos recibirán un Certificado oficial.",
    btn_end_action: "💔 Confirmar Ruptura",
    active_list: "Relaciones activas",
    cert_title: "Certificado de Compromiso",
    cert_end_title: "Certificado de Ruptura",
    cert_org: "Bonded — Officially in love.",
    cert_text: (p1, p2, s, c1, co1, c2, co2) =>
      `Certificamos que ${p1} (${c1}, ${co1}) y ${p2} (${c2}, ${co2}) declararon mutuamente su compromiso amoroso el ${s}, estableciendo un vínculo de confianza, respeto y afecto.`,
    cert_end_text: (p1, p2, e, s) =>
      `${p1} y ${p2} terminaron su relación el ${e}, habiéndola iniciado el ${s}.`,
    cert_active: "🔒 VÍNCULO ACTIVO — FIRMADO DIGITALMENTE",
    cert_ended: "🔓 VÍNCULO TERMINADO — AMBOS ESTÁN LIBRES",
    cert_ai: "✦ Generado y validado por Inteligencia Artificial",
    cert_premium: "⭐ CERTIFICADO PREMIUM",
    btn_close: "Cerrar",
    btn_download: "⬇ Descargar / Imprimir",
    conflict: (n) => `⚠️ ${n} ya está en una relación registrada en Bonded.`,
    no_active: "No se encontró ninguna relación activa.",
    confirm_end: (p1, p2) =>
      `¿Confirmas el fin de la relación entre ${p1} y ${p2}?`,
    ai_prompt: (p1, p2, d) =>
      `Crea un mensaje poético, romántico y elegante de 2 frases para un certificado de compromiso entre ${p1} y ${p2}, iniciado el ${d}. Solo el mensaje, sin comillas.`,
    ai_fallback:
      "Que este compromiso sea el comienzo de una historia hermosa, construida con amor y complicidad cada día.",
    plans_title: "Planes & Precios",
    free_plan: "Gratis",
    premium_plan: "Premium",
    free_price: "€0",
    premium_price: "€9,99 / 6 meses",
    premium_monthly: "≈ €1,67/mes",
    free_features: [
      "✓ Certificado digital básico",
      "✓ Verificación de estado",
      "✓ Registro de compromiso",
      "✓ Certificado de ruptura",
    ],
    premium_features: [
      "⭐ Todo del plan gratis",
      "⭐ Certificado premium elegante",
      "⭐ Código QR de verificación",
      "⭐ Foto de pareja en certificado",
      "⭐ Recordatorio de aniversario",
      "⭐ Soporte prioritario",
    ],
    btn_free: "Usar Gratis",
    btn_premium: "Suscribirse Premium",
    current_plan: "Plan actual",
    upgrade: "Mejorar plan",
    pay_title: "Suscribirse a Premium",
    pay_subtitle: "6 meses por solo €9,99",
    pay_saving: "💰 Ahorra €1,95 vs mensual!",
    pay_period: "Acceso completo por 6 meses",
    pay_name: "Nombre en la tarjeta",
    pay_card: "Número de tarjeta",
    pay_expiry: "Vencimiento",
    pay_cvv: "CVV",
    pay_btn: "💳 Pagar €9,99 (6 meses)",
    pay_secure: "🔒 Pago 100% seguro · Acceso inmediato 6 meses",
    pay_success: "🎉 ¡Premium activado! Disfruta 6 meses de amor oficial 💍",
    anniversary: "🎂 Aniversario de la relación",
    anniversary_msg: (d) =>
      `¡Hoy se cumplen ${d} ${d === 1 ? "año" : "años"} juntos! 🥂`,
    qr_label: "Código QR de verificación",
    gdpr_title: "Privacidad & Cookies",
    gdpr_text:
      "Usamos tus datos solo para registrar y verificar relaciones. Puedes eliminar tus datos en cualquier momento. Al continuar, aceptas nuestra Política de Privacidad según el RGPD.",
    gdpr_accept: "Aceptar y continuar",
    gdpr_decline: "Solo esencial",
    gdpr_privacy: "Política de Privacidad",
    premium_badge: "PREMIUM",
    anniversary_title: "Aniversarios",
  },
  fr: {
    flag: "🇫🇷",
    name: "Français",
    tagline: "Officially in love.",
    subtitle: "Make your love official with an AI certificate.",
    btn_register: "💍 Enregistrer un engagement",
    btn_check: "🔍 Vérifier une relation",
    btn_end: "💔 Déclarer une rupture",
    btn_plans: "👑 Plans & Tarifs",
    active_title: "Relations Actives",
    history_title: "Historique",
    since: "depuis",
    ended_on: "terminé le",
    see_cert: "voir cert. →",
    see: "voir →",
    back: "← Retour",
    register_title: "Enregistrer un Engagement",
    register_sub: "Les deux parties doivent accepter l'enregistrement",
    person1: "Nom Personne 1",
    person2: "Nom Personne 2",
    start_date: "Date de Début",
    ph1: "Nom complet",
    ph2: "Nom complet",
    contact1: "Email ou Téléphone Personne 1",
    contact2: "Email ou Téléphone Personne 2",
    ph_contact: "ex: jean@email.com ou +33 6 12 34 56 78",
    contact_note:
      "🔒 Email ou téléphone utilisés uniquement pour identification. Jamais affichés sur le certificat.",
    city1: "Ville Personne 1",
    city2: "Ville Personne 2",
    country1: "Pays Personne 1",
    country2: "Pays Personne 2",
    ph_city: "Ex: Paris",
    ph_country: "Ex: France",
    location_note:
      "📍 La ville et le pays identifient chaque personne de façon unique pour éviter les conflits de noms.",
    photo_label: "Photo du couple (Premium)",
    photo_hint: "Ajoutez une photo de vous deux",
    protection:
      "🔒 Protection active : le système bloque si quelqu'un est déjà dans une relation enregistrée.",
    btn_generate: "💍 Enregistrer & Générer le Certificat",
    generating: "✦ Génération avec IA...",
    check_title: "Vérifier le Statut",
    check_sub: "Vérifiez si quelqu'un est dans une relation enregistrée",
    check_label: "Nom à rechercher",
    check_ph: "Entrez le nom",
    btn_check_action: "🔍 Vérifier",
    in_rel: "🔒 En relation enregistrée",
    in_rel_desc: "Cette personne est dans un engagement actif depuis",
    privacy_note:
      "Pour la confidentialité, le nom du partenaire n'est pas affiché.",
    free_status: "✓ Aucune relation enregistrée",
    free_desc: "Cette personne n'a aucune relation active sur Bonded.",
    privacy_info:
      "ℹ️ La recherche indique seulement s'il existe un lien actif.",
    end_title: "Déclarer une Rupture",
    end_sub:
      "Mettez fin au lien et libérez les deux pour de nouvelles relations",
    end_label: "Votre nom",
    end_ph: "Entrez votre nom pour trouver le lien",
    end_note: "📋 Après la rupture, les deux recevront un Certificat officiel.",
    btn_end_action: "💔 Confirmer la Rupture",
    active_list: "Relations actives",
    cert_title: "Certificat d'Engagement",
    cert_end_title: "Certificat de Rupture",
    cert_org: "Bonded — Officially in love.",
    cert_text: (p1, p2, s, c1, co1, c2, co2) =>
      `Nous certifions que ${p1} (${c1}, ${co1}) et ${p2} (${c2}, ${co2}) ont mutuellement déclaré leur engagement amoureux le ${s}, établissant un lien de confiance, de respect et d'affection.`,
    cert_end_text: (p1, p2, e, s) =>
      `${p1} et ${p2} ont mis fin à leur relation le ${e}, l'ayant commencée le ${s}.`,
    cert_active: "🔒 LIEN ACTIF — SIGNÉ NUMÉRIQUEMENT",
    cert_ended: "🔓 LIEN TERMINÉ — LES DEUX SONT LIBRES",
    cert_ai: "✦ Généré et validé par Intelligence Artificielle",
    cert_premium: "⭐ CERTIFICAT PREMIUM",
    btn_close: "Fermer",
    btn_download: "⬇ Télécharger / Imprimer",
    conflict: (n) =>
      `⚠️ ${n} est déjà dans une relation enregistrée sur Bonded.`,
    no_active: "Aucune relation active trouvée.",
    confirm_end: (p1, p2) =>
      `Confirmez-vous la fin de la relation entre ${p1} et ${p2} ?`,
    ai_prompt: (p1, p2, d) =>
      `Créez un message poétique, romantique et élégant de 2 phrases pour un certificat d'engagement entre ${p1} et ${p2}, commencé le ${d}. Seulement le message, sans guillemets.`,
    ai_fallback:
      "Que cet engagement soit le début d'une belle histoire, construite chaque jour avec amour et complicité.",
    plans_title: "Plans & Tarifs",
    free_plan: "Gratuit",
    premium_plan: "Premium",
    free_price: "€0",
    premium_price: "€9,99 / 6 mois",
    premium_monthly: "≈ €1,67/mois",
    free_features: [
      "✓ Certificat numérique basique",
      "✓ Vérification de statut",
      "✓ Enregistrement d'engagement",
      "✓ Certificat de rupture",
    ],
    premium_features: [
      "⭐ Tout du plan gratuit",
      "⭐ Certificat premium élégant",
      "⭐ QR Code de vérification",
      "⭐ Photo du couple sur le certificat",
      "⭐ Rappel d'anniversaire",
      "⭐ Support prioritaire",
    ],
    btn_free: "Utiliser Gratuitement",
    btn_premium: "S'abonner Premium",
    current_plan: "Plan actuel",
    upgrade: "Passer au premium",
    pay_title: "S'abonner au Premium",
    pay_subtitle: "6 mois pour seulement €9,99",
    pay_saving: "💰 Économisez €1,95 vs mensuel!",
    pay_period: "Accès complet pendant 6 mois",
    pay_name: "Nom sur la carte",
    pay_card: "Numéro de carte",
    pay_expiry: "Expiration",
    pay_cvv: "CVV",
    pay_btn: "💳 Payer €9,99 (6 mois)",
    pay_secure: "🔒 Paiement sécurisé · Accès immédiat 6 mois",
    pay_success: "🎉 Premium activé ! Profitez de 6 mois d'amour officiel 💍",
    anniversary: "🎂 Anniversaire de la relation",
    anniversary_msg: (d) =>
      `Aujourd'hui ça fait ${d} ${d === 1 ? "an" : "ans"} ensemble ! 🥂`,
    qr_label: "QR Code de vérification",
    gdpr_title: "Confidentialité & Cookies",
    gdpr_text:
      "Nous utilisons vos données uniquement pour enregistrer et vérifier des relations. Vous pouvez supprimer vos données à tout moment. En continuant, vous acceptez notre Politique de Confidentialité conformément au RGPD.",
    gdpr_accept: "Accepter et continuer",
    gdpr_decline: "Essentiel uniquement",
    gdpr_privacy: "Politique de confidentialité",
    premium_badge: "PREMIUM",
    anniversary_title: "Anniversaires",
  },
  de: {
    flag: "🇩🇪",
    name: "Deutsch",
    tagline: "Officially in love.",
    subtitle: "Make your love official with an AI certificate.",
    btn_register: "💍 Beziehung registrieren",
    btn_check: "🔍 Status prüfen",
    btn_end: "💔 Trennung erklären",
    btn_plans: "👑 Pläne & Preise",
    active_title: "Aktive Beziehungen",
    history_title: "Verlauf",
    since: "seit",
    ended_on: "beendet am",
    see_cert: "Zert. →",
    see: "ansehen →",
    back: "← Zurück",
    register_title: "Beziehung Registrieren",
    register_sub: "Beide Parteien müssen zustimmen",
    person1: "Name Person 1",
    person2: "Name Person 2",
    start_date: "Startdatum",
    ph1: "Vollständiger Name",
    ph2: "Vollständiger Name",
    contact1: "Email oder Telefon Person 1",
    contact2: "Email oder Telefon Person 2",
    ph_contact: "z.B. hans@email.com oder +49 151 12345678",
    contact_note:
      "🔒 Email oder Telefon nur zur eindeutigen Identifizierung. Nie auf dem Zertifikat sichtbar.",
    city1: "Stadt Person 1",
    city2: "Stadt Person 2",
    country1: "Land Person 1",
    country2: "Land Person 2",
    ph_city: "z.B. Berlin",
    ph_country: "z.B. Deutschland",
    location_note:
      "📍 Stadt und Land identifizieren jede Person eindeutig und vermeiden Namenskonflikte.",
    photo_label: "Paarfoto (Premium)",
    photo_hint: "Fügen Sie ein Foto von Ihnen beiden hinzu",
    protection:
      "🔒 Aktiver Schutz: Das System blockiert, wenn jemand bereits in einer registrierten Beziehung ist.",
    btn_generate: "💍 Registrieren & Zertifikat erstellen",
    generating: "✦ Wird mit KI erstellt...",
    check_title: "Status Prüfen",
    check_sub: "Prüfen Sie, ob jemand in einer registrierten Beziehung ist",
    check_label: "Name suchen",
    check_ph: "Namen eingeben",
    btn_check_action: "🔍 Prüfen",
    in_rel: "🔒 In registrierter Beziehung",
    in_rel_desc: "Diese Person ist seit dem in einer aktiven Beziehung:",
    privacy_note:
      "Aus Datenschutzgründen wird der Partnername nicht angezeigt.",
    free_status: "✓ Keine registrierte Beziehung",
    free_desc: "Diese Person hat keine aktive Beziehung auf Bonded.",
    privacy_info: "ℹ️ Die Suche zeigt nur, ob eine aktive Bindung besteht.",
    end_title: "Trennung Erklären",
    end_sub: "Beenden Sie die Bindung und befreien Sie beide",
    end_label: "Ihr Name",
    end_ph: "Namen eingeben, um die Bindung zu finden",
    end_note:
      "📋 Nach der Trennung erhalten beide ein offizielles Trennungszertifikat.",
    btn_end_action: "💔 Trennung bestätigen",
    active_list: "Aktive Beziehungen",
    cert_title: "Beziehungszertifikat",
    cert_end_title: "Trennungszertifikat",
    cert_org: "Bonded — Officially in love.",
    cert_text: (p1, p2, s, c1, co1, c2, co2) =>
      `Wir bestätigen, dass ${p1} (${c1}, ${co1}) und ${p2} (${c2}, ${co2}) am ${s} ihre Liebesbeziehung erklärt haben.`,
    cert_end_text: (p1, p2, e, s) =>
      `${p1} und ${p2} haben ihre Beziehung am ${e} beendet, die am ${s} begann.`,
    cert_active: "🔒 AKTIVE BINDUNG — DIGITAL SIGNIERT",
    cert_ended: "🔓 BINDUNG BEENDET — BEIDE SIND FREI",
    cert_ai: "✦ Erstellt und validiert durch Künstliche Intelligenz",
    cert_premium: "⭐ PREMIUM-ZERTIFIKAT",
    btn_close: "Schließen",
    btn_download: "⬇ Herunterladen / Drucken",
    conflict: (n) =>
      `⚠️ ${n} ist bereits in einer registrierten Beziehung auf Bonded.`,
    no_active: "Keine aktive Beziehung gefunden.",
    confirm_end: (p1, p2) =>
      `Bestätigen Sie das Ende der Beziehung zwischen ${p1} und ${p2}?`,
    ai_prompt: (p1, p2, d) =>
      `Erstellen Sie eine poetische, romantische Nachricht von 2 Sätzen für ein Liebesbeziehungszertifikat zwischen ${p1} und ${p2}, begonnen am ${d}. Nur die Nachricht, ohne Anführungszeichen.`,
    ai_fallback:
      "Möge diese Bindung der Beginn einer wunderschönen Geschichte sein, die jeden Tag mit Liebe aufgebaut wird.",
    plans_title: "Pläne & Preise",
    free_plan: "Kostenlos",
    premium_plan: "Premium",
    free_price: "€0",
    premium_price: "€9,99 / 6 Monate",
    premium_monthly: "≈ €1,67/Monat",
    free_features: [
      "✓ Digitales Basiszertifikat",
      "✓ Statusprüfung",
      "✓ Beziehungsregistrierung",
      "✓ Trennungszertifikat",
    ],
    premium_features: [
      "⭐ Alles aus dem Free-Plan",
      "⭐ Elegantes Premium-Zertifikat",
      "⭐ Verifikations-QR-Code",
      "⭐ Paarfoto im Zertifikat",
      "⭐ Jubiläumserinnerung",
      "⭐ Prioritätssupport",
    ],
    btn_free: "Kostenlos nutzen",
    btn_premium: "Premium abonnieren",
    current_plan: "Aktueller Plan",
    upgrade: "Upgrade",
    pay_title: "Premium abonnieren",
    pay_subtitle: "6 Monate für nur €9,99",
    pay_saving: "💰 Sparen Sie €1,95 vs monatlich!",
    pay_period: "Vollzugang für 6 Monate",
    pay_name: "Name auf der Karte",
    pay_card: "Kartennummer",
    pay_expiry: "Ablaufdatum",
    pay_cvv: "CVV",
    pay_btn: "💳 Zahlen €9,99 (6 Monate)",
    pay_secure: "🔒 Sichere Zahlung · Sofortiger Zugang 6 Monate",
    pay_success:
      "🎉 Premium aktiviert! Genießen Sie 6 Monate offizieller Liebe 💍",
    anniversary: "🎂 Beziehungsjubiläum",
    anniversary_msg: (d) =>
      `Heute sind es ${d} ${d === 1 ? "Jahr" : "Jahre"} zusammen! 🥂`,
    qr_label: "Verifikations-QR-Code",
    gdpr_title: "Datenschutz & Cookies",
    gdpr_text:
      "Wir verwenden Ihre Daten nur zur Registrierung und Überprüfung von Beziehungen. Sie können Ihre Daten jederzeit löschen. Mit dem Fortfahren akzeptieren Sie unsere Datenschutzrichtlinie gemäß DSGVO.",
    gdpr_accept: "Akzeptieren und fortfahren",
    gdpr_decline: "Nur Wesentliches",
    gdpr_privacy: "Datenschutzrichtlinie",
    premium_badge: "PREMIUM",
    anniversary_title: "Jubiläen",
  },
};
const C = {
  cream: "#fdf6ee",
  warm: "#f5e6d3",
  gold: "#c9963a",
  goldLight: "#e8b96a",
  rose: "#c4606a",
  roseLight: "#e08090",
  ink: "#1a1209",
  inkMid: "#4a3828",
  inkLight: "#8a7060",
  white: "#ffffff",
  border: "rgba(201,150,58,0.25)",
  premiumBg: "linear-gradient(135deg,#1a0a2e,#2d1060)",
  premiumGold: "#ffd700",
};
const serif = "'Georgia','Times New Roman',serif";
const body = "'Palatino Linotype','Book Antiqua',serif";

const fmtDate = (iso, lang) =>
  new Date(iso).toLocaleDateString(
    { pt: "pt-BR", en: "en-GB", es: "es-ES", fr: "fr-FR", de: "de-DE" }[lang] ||
      "en-GB",
    { day: "2-digit", month: "long", year: "numeric" }
  );

const daysBetween = (iso) =>
  Math.floor((Date.now() - new Date(iso)) / 86400000);
const yearsBetween = (iso) => {
  const s = new Date(iso),
    n = new Date();
  let y = n.getFullYear() - s.getFullYear();
  if (
    n.getMonth() < s.getMonth() ||
    (n.getMonth() === s.getMonth() && n.getDate() < s.getDate())
  )
    y--;
  return y;
};
const isAnniversaryToday = (iso) => {
  const s = new Date(iso),
    n = new Date();
  return s.getMonth() === n.getMonth() && s.getDate() === n.getDate();
};

const Ring = ({ size = 48, color = C.gold, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" style={style}>
    <circle
      cx="24"
      cy="24"
      r="18"
      fill="none"
      stroke={color}
      strokeWidth="4"
      opacity="0.9"
    />
    <circle
      cx="24"
      cy="24"
      r="10"
      fill="none"
      stroke={color}
      strokeWidth="2"
      opacity="0.4"
    />
  </svg>
);
const Heart = ({ size = 20, color = C.rose, filled = true }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? color : "none"}
    stroke={color}
    strokeWidth="2"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const Divider = () => (
  <div
    style={{ display: "flex", alignItems: "center", gap: 12, margin: "8px 0" }}
  >
    <div
      style={{
        flex: 1,
        height: 1,
        background: `linear-gradient(to right,transparent,${C.gold})`,
      }}
    />
    <Heart size={13} color={C.gold} />
    <div
      style={{
        flex: 1,
        height: 1,
        background: `linear-gradient(to left,transparent,${C.gold})`,
      }}
    />
  </div>
);

const QRCode = ({ value, size = 120 }) => {
  const seed = value.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const cells = 11;
  const grid = Array.from({ length: cells }, (_, r) =>
    Array.from({ length: cells }, (_, c) => {
      if (
        (r < 3 && c < 3) ||
        (r < 3 && c > cells - 4) ||
        (r > cells - 4 && c < 3)
      )
        return true;
      return (seed * r * 17 + c * 13 + r + c) % 3 === 0;
    })
  );
  const cs = size / cells;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: "block" }}
    >
      <rect width={size} height={size} fill="white" />
      {grid.map((row, r) =>
        row.map((on, c) =>
          on ? (
            <rect
              key={`${r}-${c}`}
              x={c * cs}
              y={r * cs}
              width={cs}
              height={cs}
              fill="#1a1209"
            />
          ) : null
        )
      )}
      {[
        [0, 0],
        [0, cells - 3],
        [cells - 3, 0],
      ].map(([r, cc], i) => (
        <g key={i}>
          <rect
            x={cc * cs}
            y={r * cs}
            width={3 * cs}
            height={3 * cs}
            fill="none"
            stroke="#1a1209"
            strokeWidth="1"
          />
          <rect
            x={(cc + 1) * cs}
            y={(r + 1) * cs}
            width={cs}
            height={cs}
            fill="#1a1209"
          />
        </g>
      ))}
    </svg>
  );
};
function Certificate({ data, onClose, lang, isPremium }) {
  const t = T[lang];
  const isEnded = !!data.endDate;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(26,18,9,0.88)",
        zIndex: 300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          background: C.cream,
          borderRadius: 4,
          maxWidth: 520,
          width: "100%",
          maxHeight: "92vh",
          overflowY: "auto",
          boxShadow:
            isPremium && !isEnded
              ? "0 0 0 3px #ffd700, 0 32px 80px rgba(0,0,0,0.6)"
              : "0 32px 80px rgba(0,0,0,0.5)",
          border: isPremium
            ? `3px double ${C.premiumGold}`
            : `3px double ${C.gold}`,
        }}
      >
        <div
          style={{
            padding: "36px 32px",
            fontFamily: serif,
            textAlign: "center",
            position: "relative",
          }}
        >
          {isPremium && !isEnded && (
            <div
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                background: "linear-gradient(135deg,#c9963a,#ffd700)",
                borderRadius: 20,
                padding: "3px 12px",
                fontSize: 10,
                fontWeight: 700,
                color: "#fff",
                letterSpacing: 2,
              }}
            >
              {t.premium_badge}
            </div>
          )}
          {[
            "0,0",
            "calc(100% - 22px),0",
            "0,calc(100% - 22px)",
            "calc(100% - 22px),calc(100% - 22px)",
          ].map((pos, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: pos.split(",")[0],
                top: pos.split(",")[1],
                width: 22,
                height: 22,
                border: `2px solid ${isPremium ? C.premiumGold : C.gold}`,
                opacity: 0.6,
              }}
            />
          ))}
          <div
            style={{
              fontSize: 10,
              letterSpacing: 6,
              color: isPremium ? C.premiumGold : C.gold,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            {t.cert_org}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 14,
            }}
          >
            <Ring
              size={48}
              color={isPremium ? C.premiumGold : C.gold}
              style={{ marginRight: -16 }}
            />
            <Ring size={48} color={C.rose} />
          </div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 400,
              color: C.ink,
              margin: "0 0 4px",
              letterSpacing: 1,
            }}
          >
            {isEnded ? t.cert_end_title : t.cert_title}
          </h1>
          <div
            style={{
              fontSize: 11,
              color: C.inkLight,
              marginBottom: 20,
              letterSpacing: 2,
            }}
          >
            Nº {data.certId}
          </div>
          <Divider />
          {isPremium && data.photo && !isEnded && (
            <div
              style={{
                margin: "16px auto",
                width: 100,
                height: 100,
                borderRadius: "50%",
                overflow: "hidden",
                border: `3px solid ${C.premiumGold}`,
                boxShadow: `0 0 16px rgba(255,215,0,0.3)`,
              }}
            >
              <img
                src={data.photo}
                alt="couple"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          )}
          <p
            style={{
              fontSize: 14,
              color: C.inkMid,
              lineHeight: 1.9,
              margin: "16px 0",
              fontFamily: body,
            }}
          >
            {isEnded
              ? t.cert_end_text(
                  data.person1,
                  data.person2,
                  fmtDate(data.endDate, lang),
                  fmtDate(data.startDate, lang)
                )
              : t.cert_text(
                  data.person1,
                  data.person2,
                  fmtDate(data.startDate, lang),
                  data.city1 || "",
                  data.country1 || "",
                  data.city2 || "",
                  data.country2 || ""
                )}
          </p>
          {!isEnded && data.message && (
            <div
              style={{
                background: C.warm,
                border: `1px solid ${C.border}`,
                borderRadius: 4,
                padding: "14px 18px",
                margin: "0 0 16px",
                fontFamily: body,
                fontSize: 13,
                color: C.inkMid,
                fontStyle: "italic",
                lineHeight: 1.8,
              }}
            >
              "{data.message}"
            </div>
          )}
          <Divider />
          <div
            style={{
              marginTop: 18,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
            }}
          >
            {[data.person1, data.person2].map((name, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div
                  style={{
                    height: 36,
                    borderBottom: `1px solid ${C.inkLight}`,
                    marginBottom: 5,
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    paddingBottom: 3,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Brush Script MT',cursive",
                      fontSize: 18,
                      color: C.rose,
                    }}
                  >
                    {name}
                  </span>
                </div>
                <div
                  style={{ fontSize: 10, color: C.inkLight, letterSpacing: 1 }}
                >
                  {name.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
          {isPremium && !isEnded && (
            <div
              style={{
                marginTop: 20,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: C.inkLight,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                }}
              >
                {t.qr_label}
              </div>
              <div
                style={{
                  border: `2px solid ${C.border}`,
                  padding: 6,
                  borderRadius: 4,
                }}
              >
                <QRCode value={data.certId} size={90} />
              </div>
            </div>
          )}
          <div
            style={{
              marginTop: 20,
              fontSize: 10,
              color: C.inkLight,
              letterSpacing: 1,
            }}
          >
            {isEnded ? t.cert_ended : t.cert_active}
          </div>
          <div
            style={{
              marginTop: 12,
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              background: C.warm,
              border: `1px solid ${C.border}`,
              borderRadius: 20,
              padding: "5px 12px",
              fontSize: 10,
              color: isPremium ? C.premiumGold : C.gold,
            }}
          >
            {isPremium && !isEnded ? t.cert_premium : t.cert_ai}
          </div>
        </div>
        <div style={{ padding: "0 22px 22px", display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 4,
              border: `1px solid ${C.border}`,
              background: "transparent",
              color: C.inkMid,
              fontFamily: body,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            {t.btn_close}
          </button>
          <button
            onClick={() => window.print()}
            style={{
              flex: 2,
              padding: 12,
              borderRadius: 4,
              border: "none",
              background: `linear-gradient(135deg,${C.gold},${C.goldLight})`,
              color: C.white,
              fontFamily: body,
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {t.btn_download}
          </button>
        </div>
      </div>
    </div>
  );
}
function PaymentModal({ onClose, onSuccess, lang }) {
  const t = T[lang];
  const [form, setForm] = useState({ name: "", card: "", expiry: "", cvv: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const fmtInput = (v, type) => {
    if (type === "card")
      return v
        .replace(/\D/g, "")
        .slice(0, 16)
        .replace(/(.{4})/g, "$1 ")
        .trim();
    if (type === "expiry")
      return v
        .replace(/\D/g, "")
        .slice(0, 4)
        .replace(/^(.{2})(.+)/, "$1/$2");
    if (type === "cvv") return v.replace(/\D/g, "").slice(0, 4);
    return v;
  };

 const handlePay = () =>
   { window.open('https://buy.stripe.com/
                 3cI5kGdai1XWgiO90K8Vi00', '_blank'); };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        zIndex: 400,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          background: C.white,
          borderRadius: 16,
          maxWidth: 380,
          width: "100%",
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            background: C.premiumBg,
            padding: "24px 24px 20px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 4 }}>👑</div>
          <div
            style={{
              fontFamily: serif,
              fontSize: 18,
              color: C.premiumGold,
              letterSpacing: 1,
            }}
          >
            {t.pay_title}
          </div>
          <div
            style={{ fontSize: 13, color: "rgba(255,215,0,0.8)", marginTop: 4 }}
          >
            {t.pay_subtitle}
          </div>
          <div
            style={{ fontSize: 11, color: "rgba(255,215,0,0.6)", marginTop: 2 }}
          >
            {t.pay_saving}
          </div>
        </div>
        <div
          style={{
            padding: 24,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {done ? (
            <div
              style={{ textAlign: "center", padding: "20px 0", fontSize: 20 }}
            >
              {t.pay_success}
            </div>
          ) : (
            <>
              {[
                [t.pay_name, "name", "text", "João Silva"],
                [t.pay_card, "card", "tel", "1234 5678 9012 3456"],
                [t.pay_expiry, "expiry", "tel", "MM/AA"],
                [t.pay_cvv, "cvv", "tel", "123"],
              ].map(([label, key, type, ph]) => (
                <div key={key}>
                  <label
                    style={{
                      fontSize: 11,
                      letterSpacing: 2,
                      color: C.inkLight,
                      display: "block",
                      marginBottom: 5,
                      textTransform: "uppercase",
                    }}
                  >
                    {label}
                  </label>
                  <input
                    type={type}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "11px 14px",
                      borderRadius: 6,
                      border: `1px solid ${C.border}`,
                      fontFamily: body,
                      fontSize: 15,
                      color: C.ink,
                      outline: "none",
                    }}
                    placeholder={ph}
                    value={form[key]}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        [key]: fmtInput(e.target.value, key),
                      }))
                    }
                  />
                </div>
              ))}
              <button
                onClick={handlePay}
                disabled={loading}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  border: "none",
                  background: C.premiumBg,
                  color: C.premiumGold,
                  fontFamily: body,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "⏳ A processar..." : t.pay_btn}
              </button>
              <div
                style={{ textAlign: "center", fontSize: 12, color: C.inkLight }}
              >
                {t.pay_secure}
              </div>
              <button
                onClick={onClose}
                style={{
                  padding: 10,
                  borderRadius: 8,
                  border: `1px solid ${C.border}`,
                  background: "transparent",
                  color: C.inkMid,
                  fontFamily: body,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                {t.btn_close}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function GDPRBanner({ lang, onAccept }) {
  const t = T[lang];
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 500,
        background: C.ink,
        color: C.cream,
        padding: "18px 20px",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.4)",
      }}
    >
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <div
          style={{
            fontFamily: serif,
            fontSize: 15,
            fontWeight: 600,
            marginBottom: 6,
            color: C.goldLight,
          }}
        >
          🍪 {t.gdpr_title}
        </div>
        <div
          style={{
            fontSize: 13,
            lineHeight: 1.7,
            color: "rgba(253,246,238,0.8)",
            marginBottom: 14,
          }}
        >
          {t.gdpr_text}
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={() => onAccept(true)}
            style={{
              flex: 2,
              padding: "11px",
              borderRadius: 6,
              border: "none",
              background: `linear-gradient(135deg,${C.gold},${C.goldLight})`,
              color: C.white,
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            {t.gdpr_accept}
          </button>
          <button
            onClick={() => onAccept(false)}
            style={{
              flex: 1,
              padding: "11px",
              borderRadius: 6,
              border: `1px solid rgba(201,150,58,0.4)`,
              background: "transparent",
              color: C.goldLight,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            {t.gdpr_decline}
          </button>
        </div>
        <div
          style={{
            marginTop: 10,
            fontSize: 11,
            color: "rgba(253,246,238,0.4)",
            textAlign: "center",
            cursor: "pointer",
            textDecoration: "underline",
          }}
          onClick={() =>
            alert(
              "Política de Privacidade\n\nSeus dados são usados apenas para registrar e verificar relacionamentos. Não compartilhamos com terceiros. Você pode solicitar a exclusão a qualquer momento pelo email: privacy@bonded.app\n\nConformidade: GDPR (Europa) | LGPD (Brasil)"
            )
          }
        >
          {t.gdpr_privacy}
        </div>
      </div>
    </div>
  );
}
function AuthModal({onClose, lang, onLogin}) {
const t = T[lang];
const [isRegister, setIsRegister] = React.useState(false);
const [email, setEmail] = React.useState("");
const [password, setPassword] = React.useState("");
const [error, setError] = React.useState("");

const handleAuth = async () => {
try {
if (isRegister) {
await createUserWithEmailAndPassword(auth, email, password);
await addDoc(collection(db, "users"), {uid: auth.currentUser.uid, email, isPremium: false, createdAt: new Date().toISOString()});

} else {
await signInWithEmailAndPassword(auth, email, password);
}
onLogin();
onClose();
} catch(e) {
setError(e.message);
}
};

return (
<div style={{position:"fixed",inset:0,background:"rgba(26,18,9,0.88)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
<div style={{background:"#fdf6ee",borderRadius:8,padding:32,maxWidth:400,width:"100%"}}>
<h2 style={{color:"#c9963a",textAlign:"center"}}>{isRegister ? "Criar Conta" : "Entrar"}</h2>
<input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{width:"100%",padding:12,marginBottom:12,borderRadius:4,border:"1px solid #c9963a"}}/>
<input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:"100%",padding:12,marginBottom:12,borderRadius:4,border:"1px solid #c9963a"}}/>
{error && <p style={{color:"red",fontSize:12}}>{error}</p>}
<button onClick={handleAuth} style={{width:"100%",padding:14,background:"linear-gradient(135deg,#c9963a,#e8b96a)",color:"white",border:"none",borderRadius:4,cursor:"pointer",marginBottom:8}}>
{isRegister ? "Criar Conta" : "Entrar"}
</button>
<button onClick={()=>setIsRegister(!isRegister)} style={{width:"100%",padding:10,background:"transparent",border:"1px solid #c9963a",borderRadius:4,cursor:"pointer",color:"#c9963a"}}>
{isRegister ? "Já tenho conta" : "Criar conta nova"}
</button>
<button onClick={onClose} style={{width:"100%",padding:10,marginTop:8,background:"transparent",border:"none",cursor:"pointer",color:"#8a7060"}}>Fechar</button>
</div>
</div>
);
}

export default function App() {
  const [lang, setLang] = useState("pt");
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState("home");
  const [isPremium, setIsPremium] = useState(false);
  const [gdprAccepted, setGdprAccepted] = useState(false);
  const [couples, setCouples] = useState([]);
  useEffect(() => {
const unsub = onAuthStateChanged(auth, (u) => setUser(u));
return () => unsub();
}, []);
  useEffect(() => {
const loadCouples = async () => {
const q = user ? query(collection(db, "couples"), where("contact1", "==", user.email)) : query(collection(db, "couples"));
const snapshot = await getDocs(q);
const data = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
setCouples(data);
};
loadCouples();
}, []);

  const [form, setForm] = useState({
    person1: "",
    contact1: "",
    city1: "",
    country1: "",
    person2: "",
    contact2: "",
    city2: "",
    country2: "",
    startDate: new Date().toISOString().slice(0, 10),
    photo: null,
  });
  const [endSearch, setEndSearch] = useState("");
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkResult, setCheckResult] = useState(null);
  const [checkSearch, setCheckSearch] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const fileRef = useRef();
  const t = T[lang];

  const inp = (extra = {}) => ({
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 16px",
    borderRadius: 4,
    border: `1px solid ${C.border}`,
    background: C.white,
    fontFamily: body,
    fontSize: 15,
    color: C.ink,
    outline: "none",
    ...extra,
  });
  const btn = (primary = true, danger = false, premium = false) => ({
    width: "100%",
    padding: 14,
    borderRadius: 4,
    border: primary ? "none" : `1px solid ${C.border}`,
    background: premium
      ? C.premiumBg
      : primary
      ? danger
        ? `linear-gradient(135deg,#8a4a52,${C.rose})`
        : `linear-gradient(135deg,${C.rose},${C.roseLight})`
      : "transparent",
    color: premium ? C.premiumGold : primary ? C.white : C.inkMid,
    fontFamily: body,
    fontSize: 15,
    fontWeight: primary ? 700 : 400,
    cursor: "pointer",
    letterSpacing: 0.5,
  });

  const isInRel = (contact) => {
    const c = contact.trim().toLowerCase();
    return couples.find(
      (cp) =>
        !cp.endDate &&
        (cp.contact1.toLowerCase() === c || cp.contact2.toLowerCase() === c)
    );
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm((p) => ({ ...p, photo: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const handleRegister = async () => {
    const {
      person1,
      contact1,
      city1,
      country1,
      person2,
      contact2,
      city2,
      country2,
      startDate,
    } = form;
    if (
      !person1.trim() ||
      !contact1.trim() ||
      !person2.trim() ||
      !contact2.trim() ||
      !startDate
    )
      return;
    if (isInRel(contact1)) {
      alert(t.conflict(person1));
      return;
    }
    if (isInRel(contact2)) {
      alert(t.conflict(person2));
      return;
    }
    setLoading(true);
    let message = t.ai_fallback;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 200,
          messages: [
            {
              role: "user",
              content: t.ai_prompt(person1, person2, fmtDate(startDate, lang)),
            },
          ],
        }),
      });
      const d = await res.json();
      message = d.content?.[0]?.text || t.ai_fallback;
    } catch {}
    const newCouple = {
      id: Date.now(),
      person1: person1.trim(),
      contact1: contact1.trim(),
      person2: person2.trim(),
      contact2: contact2.trim(),
      city1: (city1 || "").trim(),
      country1: (country1 || "").trim(),
      city2: (city2 || "").trim(),
      country2: (country2 || "").trim(),
      startDate,
      endDate: null,
      certId: "BND-" + Date.now().toString(36).toUpperCase(),
      message,
      photo: isPremium ? form.photo : null,
    };
    await addDoc(collection(db, "couples"), newCouple);
    setCouples((prev) => [...prev, newCouple]);
    setLoading(false);
    setCert(newCouple);
    setForm({
      person1: "",
      contact1: "",
      city1: "",
      country1: "",
      person2: "",
      contact2: "",
      city2: "",
      country2: "",
      startDate: new Date().toISOString().slice(0, 10),
      photo: null,
    });
  };

  const handleEnd = () => {
    const n = endSearch.trim().toLowerCase();
    const couple = couples.find(
      (c) =>
        !c.endDate &&
        (c.person1.toLowerCase() === n || c.person2.toLowerCase() === n)
    );
    if (!couple) {
      alert(t.no_active);
      return;
    }
    if (!window.confirm(t.confirm_end(couple.person1, couple.person2))) return;
    const endDate = new Date().toISOString().slice(0, 10);
    const ended = {
      ...couple,
      endDate,
      certId: "BND-FIM-" + Date.now().toString(36).toUpperCase(),
    };
   if (couple.id) await updateDoc(doc(db, "couples", couple.id), {endDate, certId: "BND-FIM-" + Date.now().toString(36).toUpperCase()});
    setCouples((prev) => prev.map((c) => (c.id === couple.id ? ended : c)));
    setCert(ended);
    setEndSearch("");
  };

  const handleCheck = () => {
    const n = checkSearch.trim().toLowerCase();
    if (!n) return;
    const rel = isInRel(n);
    setCheckResult(
      rel ? { found: true, since: rel.startDate } : { found: false }
    );
  };

  const goTo = (s) => {
    setScreen(s);
    setCheckResult(null);
    setCheckSearch("");
  };
  const activeAnniversaries = couples.filter(
    (c) =>
      !c.endDate &&
      isAnniversaryToday(c.startDate) &&
      yearsBetween(c.startDate) > 0
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.cream,
        fontFamily: body,
        color: C.ink,
        paddingBottom: gdprAccepted ? 0 : 120,
      }}
    >
      <style>{`
  @keyframes fadeIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
  .fade{animation:fadeIn 0.4s ease both}
  input:focus{border-color:${C.gold}!important;box-shadow:0 0 0 3px rgba(201,150,58,0.12)}
  button:hover{opacity:0.86}
  `}</style>

      <div
        style={{
          borderBottom: `1px solid ${C.border}`,
          padding: "13px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: C.white,
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            cursor: "pointer",
          }}
          onClick={() => goTo("home")}
        >
          <div style={{ display: "flex" }}>
            <Ring size={24} color={C.gold} style={{ marginRight: -8 }} />
            <Ring size={24} color={C.rose} />
          </div>
          <span
            style={{
              fontFamily: serif,
              fontSize: 19,
              fontWeight: 400,
              color: C.ink,
              letterSpacing: 1,
            }}
          >
            Bonded
          </span>
          {isPremium && (
            <span
              style={{
                background: "linear-gradient(135deg,#c9963a,#ffd700)",
                borderRadius: 12,
                padding: "2px 8px",
                fontSize: 9,
                fontWeight: 700,
                color: "#fff",
                letterSpacing: 1,
              }}
            >
              PREMIUM
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {Object.entries(T).map(([code, val]) => (
            <button
              key={code}
              onClick={() => setLang(code)}
              title={val.name}
              style={{
                background: lang === code ? C.gold : "transparent",
                border: `1px solid ${lang === code ? C.gold : C.border}`,
                borderRadius: 5,
                padding: "3px 6px",
                fontSize: 14,
                cursor: "pointer",
                opacity: lang === code ? 1 : 0.55,
                transition: "all 0.2s",
              }}
            >
              {val.flag}
            </button>
          ))}
        </div>
      </div>

      {activeAnniversaries.map((c) => (
        <div
          key={c.id}
          style={{
            background: "linear-gradient(135deg,#c9963a,#e8b96a)",
            padding: "12px 20px",
            textAlign: "center",
            fontSize: 14,
            color: C.white,
            fontWeight: 600,
          }}
        >
          🎂 {c.person1} & {c.person2} —{" "}
          {t.anniversary_msg(yearsBetween(c.startDate))}
        </div>
      ))}

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "22px 16px" }}>
        {screen === "home" && (
          <div className="fade">
            <div style={{ textAlign: "center", padding: "24px 0 20px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <Ring size={64} color={C.gold} style={{ marginRight: -20 }} />
                <Ring size={64} color={C.rose} />
              </div>
              <h1
                style={{
                  fontFamily: serif,
                  fontSize: 28,
                  fontWeight: 400,
                  margin: "0 0 5px",
                  color: C.ink,
                  letterSpacing: 1,
                }}
              >
                Bonded
              </h1>
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: 3,
                  color: C.gold,
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                {t.tagline}
              </div>
              <p
                style={{
                  color: C.inkMid,
                  fontSize: 14,
                  lineHeight: 1.8,
                  maxWidth: 300,
                  margin: "0 auto 22px",
                }}
              >
                {t.subtitle}
              </p>
              <Divider />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 9,
                marginTop: 6,
              }}
            >
              <button onClick={() => setScreen("auth")} style={{...btn(false), marginBottom:8}}>
{user ? "👤 " + user.email : "🔑 Entrar / Criar Conta"}
</button>
{user && (
<button onClick={() => signOut(auth)} style={{...btn(false), marginBottom:8, fontSize:12}}>
🚪 Sair da conta
</button>
)}

              <button onClick={() => goTo("register")} style={btn(true)}>
                {t.btn_register}
              </button>
              <button onClick={() => goTo("check")} style={btn(false)}>
                {t.btn_check}
              </button>
              <button onClick={() => goTo("end")} style={btn(false)}>
                {t.btn_end}
              </button>
              <button
                onClick={() => goTo("plans")}
                style={{ ...btn(true, false, true) }}
              >
                {t.btn_plans}
              </button>
            </div>
            {couples.filter((c) => !c.endDate).length > 0 && (
              <div style={{ marginTop: 24 }}>
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: 3,
                    color: C.gold,
                    textTransform: "uppercase",
                    textAlign: "center",
                    marginBottom: 10,
                  }}
                >
                  {t.active_title}
                </div>
                {couples
                  .filter((c) => !c.endDate)
                  .map((c) => (
                    <div
                      key={c.id}
                      onClick={() => setCert(c)}
                      style={{
                        background: C.white,
                        border: `1px solid ${C.border}`,
                        borderRadius: 8,
                        padding: "12px 14px",
                        marginBottom: 8,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      {c.photo && (
                        <img
                          src={c.photo}
                          alt=""
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: `2px solid ${C.gold}`,
                          }}
                        />
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>
                          {c.person1} & {c.person2}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: C.inkLight,
                            marginTop: 1,
                          }}
                        >
                          {t.since} {fmtDate(c.startDate, lang)} ·{" "}
                          {daysBetween(c.startDate)} dias
                        </div>
                      </div>
                      <div style={{ fontSize: 11, color: C.gold }}>
                        {t.see_cert}
                      </div>
                    </div>
                  ))}
              </div>
            )}
            {couples.filter((c) => c.endDate).length > 0 && (
              <div style={{ marginTop: 16 }}>
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: 3,
                    color: C.inkLight,
                    textTransform: "uppercase",
                    textAlign: "center",
                    marginBottom: 8,
                  }}
                >
                  {t.history_title}
                </div>
                {couples
                  .filter((c) => c.endDate)
                  .map((c) => (
                    <div
                      key={c.id}
                      onClick={() => setCert(c)}
                      style={{
                        background: "transparent",
                        border: `1px solid ${C.border}`,
                        borderRadius: 8,
                        padding: "10px 14px",
                        marginBottom: 7,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        opacity: 0.6,
                      }}
                    >
                      <Heart size={14} color={C.inkLight} filled={false} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, color: C.inkMid }}>
                          {c.person1} & {c.person2}
                        </div>
                        <div style={{ fontSize: 11, color: C.inkLight }}>
                          {t.ended_on} {fmtDate(c.endDate, lang)}
                        </div>
                      </div>
                      <div style={{ fontSize: 11, color: C.inkLight }}>
                        {t.see}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {screen === "plans" && (
          <div className="fade">
            <button
              onClick={() => goTo("home")}
              style={{
                background: "none",
                border: "none",
                color: C.inkLight,
                cursor: "pointer",
                padding: "0 0 14px",
                fontSize: 14,
              }}
            >
              {t.back}
            </button>
            <div style={{ textAlign: "center", marginBottom: 22 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>👑</div>
              <h2
                style={{
                  fontFamily: serif,
                  fontWeight: 400,
                  fontSize: 22,
                  margin: "0 0 4px",
                }}
              >
                {t.plans_title}
              </h2>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <div
                style={{
                  background: C.white,
                  border: `1px solid ${C.border}`,
                  borderRadius: 12,
                  padding: 18,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div style={{ textAlign: "center", marginBottom: 4 }}>
                  <div
                    style={{ fontFamily: serif, fontSize: 16, fontWeight: 600 }}
                  >
                    {t.free_plan}
                  </div>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      color: C.ink,
                      marginTop: 2,
                    }}
                  >
                    {t.free_price}
                  </div>
                </div>
                <Divider />
                {t.free_features.map((f, i) => (
                  <div
                    key={i}
                    style={{ fontSize: 12, color: C.inkMid, lineHeight: 1.5 }}
                  >
                    {f}
                  </div>
                ))}
                <button
                  onClick={() => {
                    setIsPremium(false);
                    goTo("home");
                  }}
                  style={{
                    ...btn(!isPremium),
                    marginTop: 8,
                    padding: 10,
                    fontSize: 13,
                  }}
                >
                  {!isPremium ? t.current_plan : t.btn_free}
                </button>
              </div>
              <div
                style={{
                  background: C.premiumBg,
                  border: `2px solid ${C.premiumGold}`,
                  borderRadius: 12,
                  padding: 18,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  boxShadow: `0 8px 32px rgba(255,215,0,0.15)`,
                }}
              >
                <div style={{ textAlign: "center", marginBottom: 4 }}>
                  <div
                    style={{
                      fontFamily: serif,
                      fontSize: 16,
                      fontWeight: 600,
                      color: C.premiumGold,
                    }}
                  >
                    ⭐ {t.premium_plan}
                  </div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: C.premiumGold,
                      marginTop: 2,
                    }}
                  >
                    {t.premium_price}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "rgba(255,215,0,0.6)",
                      marginTop: 2,
                    }}
                  >
                    {t.premium_monthly}
                  </div>
                </div>
                <div
                  style={{
                    height: 1,
                    background: `linear-gradient(to right,transparent,${C.premiumGold},transparent)`,
                    margin: "4px 0",
                  }}
                />
                {t.premium_features.map((f, i) => (
                  <div
                    key={i}
                    style={{
                      fontSize: 12,
                      color: "rgba(255,215,0,0.85)",
                      lineHeight: 1.5,
                    }}
                  >
                    {f}
                  </div>
                ))}
                <button
                  onClick={() => {
                    if (!isPremium) setShowPayment(true);
                    else goTo("home");
                  }}
                  style={{
                    marginTop: 8,
                    padding: 10,
                    borderRadius: 4,
                    border: `1px solid ${C.premiumGold}`,
                    background: C.premiumGold,
                    color: C.ink,
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  {isPremium ? t.current_plan : t.btn_premium}
                </button>
              </div>
            </div>
          </div>
        )}

        {screen === "register" && (
          <div className="fade">
            <button
              onClick={() => goTo("home")}
              style={{
                background: "none",
                border: "none",
                color: C.inkLight,
                cursor: "pointer",
                padding: "0 0 14px",
                fontSize: 14,
              }}
            >
              {t.back}
            </button>
            <div style={{ textAlign: "center", marginBottom: 22 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: 10,
                }}
              >
                <Ring size={42} color={C.gold} style={{ marginRight: -13 }} />
                <Ring size={42} color={C.rose} />
              </div>
              <h2
                style={{
                  fontFamily: serif,
                  fontWeight: 400,
                  fontSize: 21,
                  margin: "0 0 3px",
                }}
              >
                {t.register_title}
              </h2>
              <p style={{ color: C.inkLight, fontSize: 13, margin: 0 }}>
                {t.register_sub}
              </p>
            </div>
            <div
              style={{
                background: C.white,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: 20,
                display: "flex",
                flexDirection: "column",
                gap: 13,
              }}
            >
              <div
                style={{
                  background: C.warm,
                  border: `1px solid ${C.border}`,
                  borderRadius: 6,
                  padding: "10px 14px",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    color: C.gold,
                    fontWeight: 700,
                    marginBottom: 10,
                    letterSpacing: 1,
                  }}
                >
                  PESSOA 1
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  <div>
                    <label
                      style={{
                        fontSize: 10,
                        letterSpacing: 2,
                        color: C.gold,
                        display: "block",
                        marginBottom: 4,
                        textTransform: "uppercase",
                      }}
                    >
                      {t.person1}
                    </label>
                    <input
                      style={inp()}
                      placeholder={t.ph1}
                      value={form.person1}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, person1: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        fontSize: 10,
                        letterSpacing: 2,
                        color: C.rose,
                        display: "block",
                        marginBottom: 4,
                        textTransform: "uppercase",
                      }}
                    >
                      {t.contact1} 🔒
                    </label>
                    <input
                      style={inp({ borderColor: "rgba(196,96,106,0.3)" })}
                      placeholder={t.ph_contact}
                      value={form.contact1}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, contact1: e.target.value }))
                      }
                    />
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 8,
                    }}
                  >
                    <div>
                      <label
                        style={{
                          fontSize: 10,
                          letterSpacing: 2,
                          color: C.gold,
                          display: "block",
                          marginBottom: 4,
                          textTransform: "uppercase",
                        }}
                      >
                        {t.city1}
                      </label>
                      <input
                        style={inp()}
                        placeholder={t.ph_city}
                        value={form.city1}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, city1: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          fontSize: 10,
                          letterSpacing: 2,
                          color: C.gold,
                          display: "block",
                          marginBottom: 4,
                          textTransform: "uppercase",
                        }}
                      >
                        {t.country1}
                      </label>
                      <input
                        style={inp()}
                        placeholder={t.ph_country}
                        value={form.country1}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, country1: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <Heart size={20} color={C.rose} />
              </div>
              <div
                style={{
                  background: C.warm,
                  border: `1px solid ${C.border}`,
                  borderRadius: 6,
                  padding: "10px 14px",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    color: C.gold,
                    fontWeight: 700,
                    marginBottom: 10,
                    letterSpacing: 1,
                  }}
                >
                  PESSOA 2
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  <div>
                    <label
                      style={{
                        fontSize: 10,
                        letterSpacing: 2,
                        color: C.gold,
                        display: "block",
                        marginBottom: 4,
                        textTransform: "uppercase",
                      }}
                    >
                      {t.person2}
                    </label>
                    <input
                      style={inp()}
                      placeholder={t.ph2}
                      value={form.person2}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, person2: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        fontSize: 10,
                        letterSpacing: 2,
                        color: C.rose,
                        display: "block",
                        marginBottom: 4,
                        textTransform: "uppercase",
                      }}
                    >
                      {t.contact2} 🔒
                    </label>
                    <input
                      style={inp({ borderColor: "rgba(196,96,106,0.3)" })}
                      placeholder={t.ph_contact}
                      value={form.contact2}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, contact2: e.target.value }))
                      }
                    />
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 8,
                    }}
                  >
                    <div>
                      <label
                        style={{
                          fontSize: 10,
                          letterSpacing: 2,
                          color: C.gold,
                          display: "block",
                          marginBottom: 4,
                          textTransform: "uppercase",
                        }}
                      >
                        {t.city2}
                      </label>
                      <input
                        style={inp()}
                        placeholder={t.ph_city}
                        value={form.city2}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, city2: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          fontSize: 10,
                          letterSpacing: 2,
                          color: C.gold,
                          display: "block",
                          marginBottom: 4,
                          textTransform: "uppercase",
                        }}
                      >
                        {t.country2}
                      </label>
                      <input
                        style={inp()}
                        placeholder={t.ph_country}
                        value={form.country2}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, country2: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  background: "rgba(196,96,106,0.06)",
                  border: `1px solid rgba(196,96,106,0.2)`,
                  borderRadius: 4,
                  padding: "9px 12px",
                  fontSize: 12,
                  color: C.inkMid,
                  lineHeight: 1.6,
                }}
              >
                {t.contact_note}
              </div>
              <div>
                <label
                  style={{
                    fontSize: 10,
                    letterSpacing: 2,
                    color: C.gold,
                    display: "block",
                    marginBottom: 4,
                    textTransform: "uppercase",
                  }}
                >
                  {t.start_date}
                </label>
                <input
                  type="date"
                  style={inp()}
                  value={form.startDate}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, startDate: e.target.value }))
                  }
                />
              </div>
              <div style={{ opacity: isPremium ? 1 : 0.5 }}>
                <label
                  style={{
                    fontSize: 10,
                    letterSpacing: 2,
                    color: isPremium ? C.gold : C.inkLight,
                    display: "block",
                    marginBottom: 4,
                    textTransform: "uppercase",
                  }}
                >
                  {t.photo_label}
                </label>
                {isPremium ? (
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    {form.photo && (
                      <img
                        src={form.photo}
                        alt=""
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: `2px solid ${C.gold}`,
                        }}
                      />
                    )}
                    <button
                      onClick={() => fileRef.current.click()}
                      style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: 4,
                        border: `1px dashed ${C.gold}`,
                        background: "transparent",
                        color: C.gold,
                        fontSize: 13,
                        cursor: "pointer",
                      }}
                    >
                      📷 {t.photo_hint}
                    </button>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handlePhoto}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius: 4,
                      border: `1px dashed ${C.border}`,
                      fontSize: 12,
                      color: C.inkLight,
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                    onClick={() => goTo("plans")}
                  >
                    🔒 {t.upgrade} → Premium
                  </div>
                )}
              </div>
              <div
                style={{
                  background: C.warm,
                  border: `1px solid ${C.border}`,
                  borderRadius: 4,
                  padding: "10px 12px",
                  fontSize: 12,
                  color: C.inkMid,
                  lineHeight: 1.7,
                }}
              >
                {t.protection}
              </div>
              <button
                onClick={handleRegister}
                disabled={loading}
                style={{ ...btn(true), opacity: loading ? 0.7 : 1 }}
              >
                {loading ? t.generating : t.btn_generate}
              </button>
            </div>
          </div>
        )}

        {screen === "check" && (
          <div className="fade">
            <button
              onClick={() => goTo("home")}
              style={{
                background: "none",
                border: "none",
                color: C.inkLight,
                cursor: "pointer",
                padding: "0 0 14px",
                fontSize: 14,
              }}
            >
              {t.back}
            </button>
            <div style={{ textAlign: "center", marginBottom: 22 }}>
              <div style={{ fontSize: 32, marginBottom: 6 }}>🔍</div>
              <h2
                style={{
                  fontFamily: serif,
                  fontWeight: 400,
                  fontSize: 21,
                  margin: "0 0 3px",
                }}
              >
                {t.check_title}
              </h2>
              <p style={{ color: C.inkLight, fontSize: 13, margin: 0 }}>
                {t.check_sub}
              </p>
            </div>
            <div
              style={{
                background: C.white,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: 20,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div>
                <label
                  style={{
                    fontSize: 10,
                    letterSpacing: 2,
                    color: C.gold,
                    display: "block",
                    marginBottom: 4,
                    textTransform: "uppercase",
                  }}
                >
                  {t.check_label}
                </label>
                <input
                  style={inp()}
                  placeholder={t.check_ph}
                  value={checkSearch}
                  onChange={(e) => {
                    setCheckSearch(e.target.value);
                    setCheckResult(null);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                />
              </div>
              <button onClick={handleCheck} style={btn(true)}>
                {t.btn_check_action}
              </button>
              {checkResult && (
                <div
                  className="fade"
                  style={{
                    borderRadius: 6,
                    padding: 14,
                    background: checkResult.found
                      ? "rgba(196,96,106,0.08)"
                      : "rgba(100,180,100,0.08)",
                    border: `1px solid ${
                      checkResult.found ? C.rose : "#6ab06a"
                    }`,
                  }}
                >
                  {checkResult.found ? (
                    <>
                      <div
                        style={{
                          fontWeight: 700,
                          color: C.rose,
                          marginBottom: 4,
                        }}
                      >
                        {t.in_rel}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: C.inkMid,
                          lineHeight: 1.7,
                        }}
                      >
                        {t.in_rel_desc}{" "}
                        <strong>{fmtDate(checkResult.since, lang)}</strong>.
                        <br />
                        <span style={{ fontSize: 11, color: C.inkLight }}>
                          {t.privacy_note}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        style={{
                          fontWeight: 700,
                          color: "#4a9a4a",
                          marginBottom: 4,
                        }}
                      >
                        {t.free_status}
                      </div>
                      <div style={{ fontSize: 13, color: C.inkMid }}>
                        {t.free_desc}
                      </div>
                    </>
                  )}
                </div>
              )}
              <div
                style={{
                  fontSize: 11,
                  color: C.inkLight,
                  lineHeight: 1.7,
                  borderTop: `1px solid ${C.border}`,
                  paddingTop: 10,
                }}
              >
                {t.privacy_info}
              </div>
            </div>
          </div>
        )}

        {screen === "end" && (
          <div className="fade">
            <button
              onClick={() => goTo("home")}
              style={{
                background: "none",
                border: "none",
                color: C.inkLight,
                cursor: "pointer",
                padding: "0 0 14px",
                fontSize: 14,
              }}
            >
              {t.back}
            </button>
            <div style={{ textAlign: "center", marginBottom: 22 }}>
              <div style={{ fontSize: 32, marginBottom: 6 }}>💔</div>
              <h2
                style={{
                  fontFamily: serif,
                  fontWeight: 400,
                  fontSize: 21,
                  margin: "0 0 3px",
                }}
              >
                {t.end_title}
              </h2>
              <p style={{ color: C.inkLight, fontSize: 13, margin: 0 }}>
                {t.end_sub}
              </p>
            </div>
            <div
              style={{
                background: C.white,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: 20,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div>
                <label
                  style={{
                    fontSize: 10,
                    letterSpacing: 2,
                    color: C.gold,
                    display: "block",
                    marginBottom: 4,
                    textTransform: "uppercase",
                  }}
                >
                  {t.end_label}
                </label>
                <input
                  style={inp()}
                  placeholder={t.end_ph}
                  value={endSearch}
                  onChange={(e) => setEndSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleEnd()}
                />
              </div>
              <div
                style={{
                  background: C.warm,
                  border: `1px solid ${C.border}`,
                  borderRadius: 4,
                  padding: "10px 12px",
                  fontSize: 12,
                  color: C.inkMid,
                  lineHeight: 1.7,
                }}
              >
                {t.end_note}
              </div>
              <button onClick={handleEnd} style={btn(true, true)}>
                {t.btn_end_action}
              </button>
            </div>
          </div>
        )}
      </div>

      {cert && (
        <Certificate
          data={cert}
          onClose={() => setCert(null)}
          lang={lang}
          isPremium={isPremium}
        />
      )}
      {showPayment && (
        <PaymentModal
          lang={lang}
          onClose={() => setShowPayment(false)}
          onSuccess={async () => {
setIsPremium(true);
if (user) {
await updateDoc(doc(db, "users", user.uid), {isPremium: true});
}
}}
        />
      )}
      {!gdprAccepted && (
        <GDPRBanner lang={lang} onAccept={() => setGdprAccepted(true)} />
      )}
    {screen === "auth" && (
<AuthModal
lang={lang}
onClose={() => setScreen("home")}
onLogin={async () => {
const u = auth.currentUser;
setUser(u);
if (u) {
try {
const userDoc = await getDocs(query(collection(db, "users"), where("uid", "==", u.uid)));
if (!userDoc.empty) setIsPremium(userDoc.docs[0].data().isPremium || false);
} catch(e) {}
}
}}

/>
)}
    </div>
  );
}
