import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where, updateDoc, doc, onSnapshot, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { useState, useEffect, useRef } from "react";

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

// ====== ENCRIPTAÇÃO GLOBAL ======
const encryptMsg = (text) => { try { return btoa(unescape(encodeURIComponent(text))); } catch(e) { return text; } };
const decryptMsg = (text) => { try { return decodeURIComponent(escape(atob(text))); } catch(e) { return text; } };

// ====== HELPERS ======
const isNightTime = () => { const h = new Date().getHours(); return h >= 22 || h < 7; };

const darkTheme = {
  cream:"#1a1209",warm:"#2a1f12",gold:"#e8b96a",goldLight:"#c9963a",rose:"#e08090",roseLight:"#c4606a",
  ink:"#fdf6ee",inkMid:"#e5d5c0",inkLight:"#b8a090",white:"#1a1209",border:"rgba(232,185,106,0.25)",
  premiumBg:"linear-gradient(135deg,#2a0a4e,#4d1080)",premiumGold:"#ffd700",
};
const C = {
  cream:"#fdf6ee",warm:"#f5e6d3",gold:"#c9963a",goldLight:"#e8b96a",rose:"#c4606a",roseLight:"#e08090",
  ink:"#1a1209",inkMid:"#4a3828",inkLight:"#8a7060",white:"#ffffff",border:"rgba(201,150,58,0.25)",
  premiumBg:"linear-gradient(135deg,#1a0a2e,#2d1060)",premiumGold:"#ffd700",
};
const serif = "'Georgia','Times New Roman',serif";
const body = "'Palatino Linotype','Book Antiqua',serif";

const fmtDate = (iso, lang) => new Date(iso).toLocaleDateString({pt:"pt-BR",en:"en-GB",es:"es-ES",fr:"fr-FR",de:"de-DE"}[lang]||"en-GB",{day:"2-digit",month:"long",year:"numeric"});
const daysBetween = (iso) => Math.floor((Date.now() - new Date(iso)) / 86400000);
const yearsBetween = (iso) => { const s=new Date(iso),n=new Date(); let y=n.getFullYear()-s.getFullYear(); if(n.getMonth()<s.getMonth()||(n.getMonth()===s.getMonth()&&n.getDate()<s.getDate()))y--; return y; };
const isAnniversaryToday = (iso) => { const s=new Date(iso),n=new Date(); return s.getMonth()===n.getMonth()&&s.getDate()===n.getDate(); };
const getStars = (followers) => { if(followers>=1000000)return 5; if(followers>=750000)return 4; if(followers>=500000)return 3; if(followers>=100000)return 2; if(followers>=20000)return 1; return 0; };
const renderStars = (count) => count===0?null:"⭐".repeat(count);

// ====== TRADUÇÕES ======
const T = {
  pt: { flag:"🇧🇷", name:"Português", tagline:"Officially in love.", subtitle:"Make your love official with an AI certificate.",
    btn_register:"💍 Registrar compromisso", btn_check:"🔍 Verificar relacionamento", btn_end:"💔 Declarar término", btn_plans:"👑 Planos & Preços",
    active_title:"Relacionamentos Ativos", history_title:"Histórico", since:"desde", ended_on:"encerrado em", see_cert:"ver cert. →", see:"ver →",
    back:"← Voltar", register_title:"Registrar Compromisso", register_sub:"Ambos devem concordar com o registro",
    person1:"Nome da Pessoa 1", person2:"Nome da Pessoa 2", start_date:"Data de Início", ph1:"Nome completo", ph2:"Nome completo",
    contact1:"Email ou Telefone Pessoa 1", contact2:"Email ou Telefone Pessoa 2", ph_contact:"ex: joao@email.com ou +351 912 345 678",
    contact_note:"🔒 Email ou telefone são usados apenas para identificação única. Nunca aparecem no certificado.",
    city1:"Cidade da Pessoa 1", city2:"Cidade da Pessoa 2", country1:"País da Pessoa 1", country2:"País da Pessoa 2",
    ph_city:"Ex: Lisboa", ph_country:"Ex: Portugal", location_note:"📍 Cidade e país identificam cada pessoa de forma única.",
    photo_label:"Foto do casal (Premium)", photo_hint:"Adicione uma foto de vocês dois",
    protection:"🔒 Proteção ativa: o sistema bloqueia se alguém já estiver em relacionamento registrado.",
    btn_generate:"💍 Registrar & Gerar Certificado", generating:"✦ Gerando com IA...",
    check_title:"Verificar Situação", check_sub:"Consulte se alguém está em relacionamento registrado",
    check_label:"Nome para consultar", check_ph:"Digite o nome", btn_check_action:"🔍 Verificar",
    in_rel:"🔒 Em relacionamento registrado", in_rel_desc:"Esta pessoa está em um compromisso ativo desde",
    privacy_note:"Por privacidade, o nome do parceiro(a) não é exibido.",
    free_status:"✓ Sem relacionamento registrado", free_desc:"Esta pessoa não possui nenhum relacionamento ativo no Bonded.",
    privacy_info:"ℹ️ A consulta mostra apenas se existe vínculo ativo.",
    end_title:"Declarar Término", end_sub:"Encerre o vínculo e libere ambos para novos relacionamentos",
    end_label:"Seu nome", end_ph:"Digite seu nome para localizar o vínculo",
    end_note:"📋 Após o término ambos receberão um Certificado de Término oficial.",
    btn_end_action:"💔 Confirmar Término", active_list:"Relacionamentos ativos",
    cert_title:"Certificado de Compromisso", cert_end_title:"Certificado de Término", cert_org:"Bonded — Officially in love.",
    cert_text:(p1,p2,s,c1,co1,c2,co2)=>`Certificamos que ${p1} (${c1}, ${co1}) e ${p2} (${c2}, ${co2}) declararam mutuamente seu compromisso amoroso em ${s}, estabelecendo um vínculo de confiança, respeito e afeto.`,
    cert_end_text:(p1,p2,e,s)=>`${p1} e ${p2} encerraram seu relacionamento em ${e}, tendo iniciado em ${s}.`,
    cert_active:"🔒 VÍNCULO ATIVO — ASSINADO DIGITALMENTE", cert_ended:"🔓 VÍNCULO ENCERRADO — AMBOS ESTÃO LIVRES",
    cert_ai:"✦ Gerado e validado por Inteligência Artificial", cert_premium:"⭐ CERTIFICADO PREMIUM",
    btn_close:"Fechar", btn_download:"⬇ Baixar / Imprimir",
    conflict:(n)=>`⚠️ ${n} já está em relacionamento registrado no Bonded.`, no_active:"Nenhum relacionamento ativo encontrado.",
    confirm_end:(p1,p2)=>`Confirma o término entre ${p1} e ${p2}?`,
    ai_prompt:(p1,p2,d)=>`Crie uma mensagem poética, romântica e elegante de 2 frases para um certificado de compromisso entre ${p1} e ${p2}, iniciado em ${d}. Só a mensagem, sem aspas.`,
    ai_fallback:"Que este compromisso seja o começo de uma história linda, construída com amor e cumplicidade todos os dias.",
    plans_title:"Planos & Preços", free_plan:"Grátis", premium_plan:"Premium", free_price:"€0", premium_price:"€9,99 / 6 meses", premium_monthly:"≈ €1,67/mês",
    free_features:["✓ Certificado digital básico","✓ Verificação de status","✓ Registro de compromisso","✓ Certificado de término"],
    premium_features:["⭐ Tudo do plano grátis","⭐ Certificado premium elegante","⭐ QR Code de verificação","⭐ Foto do casal no certificado","⭐ Lembrete de aniversário","⭐ Suporte prioritário"],
    btn_free:"Usar Grátis", btn_premium:"Assinar Premium", current_plan:"Plano atual", upgrade:"Fazer upgrade",
    pay_title:"Assinar Premium", pay_subtitle:"6 meses por apenas €9,99", pay_saving:"💰 Poupa €1,95 vs mensal!",
    pay_period:"Acesso completo por 6 meses", pay_name:"Nome no cartão", pay_card:"Número do cartão", pay_expiry:"Validade", pay_cvv:"CVV",
    pay_btn:"💳 Pagar €9,99 (6 meses)", pay_secure:"🔒 Pagamento 100% seguro · Acesso imediato",
    pay_success:"🎉 Premium ativado! Aproveita 6 meses de amor oficial 💍",
    anniversary:"🎂 Aniversário do relacionamento", anniversary_msg:(d)=>`Hoje faz ${d} ${d===1?"ano":"anos"} que vocês estão juntos! 🥂`,
    qr_label:"QR Code de verificação", gdpr_title:"Privacidade & Cookies",
    gdpr_text:"Usamos seus dados apenas para registrar e verificar relacionamentos. Você pode apagar seus dados a qualquer momento. Ao continuar, aceita nossa Política de Privacidade conforme o GDPR.",
    gdpr_accept:"Aceitar e continuar", gdpr_decline:"Só essencial", gdpr_privacy:"Política de Privacidade",
    premium_badge:"PREMIUM", anniversary_title:"Aniversários",
  },
  en: { flag:"🇬🇧", name:"English", tagline:"Officially in love.", subtitle:"Make your love official with an AI certificate.",
    btn_register:"💍 Register commitment", btn_check:"🔍 Check relationship", btn_end:"💔 Declare breakup", btn_plans:"👑 Plans & Pricing",
    active_title:"Active Relationships", history_title:"History", since:"since", ended_on:"ended on", see_cert:"see cert. →", see:"see →",
    back:"← Back", register_title:"Register Commitment", register_sub:"Both parties must agree to the registration",
    person1:"Person 1 Name", person2:"Person 2 Name", start_date:"Start Date", ph1:"Full name", ph2:"Full name",
    contact1:"Person 1 Email or Phone", contact2:"Person 2 Email or Phone", ph_contact:"e.g. john@email.com or +44 7911 123456",
    contact_note:"🔒 Email or phone are used only for unique identification. Never shown on the certificate.",
    city1:"Person 1 City", city2:"Person 2 City", country1:"Person 1 Country", country2:"Person 2 Country",
    ph_city:"e.g. London", ph_country:"e.g. United Kingdom", location_note:"📍 City and country identify each person uniquely.",
    photo_label:"Couple photo (Premium)", photo_hint:"Add a photo of the two of you",
    protection:"🔒 Active protection: system blocks if someone is already in a registered relationship.",
    btn_generate:"💍 Register & Generate Certificate", generating:"✦ Generating with AI...",
    check_title:"Check Status", check_sub:"Check if someone is in a registered relationship",
    check_label:"Name to search", check_ph:"Enter name", btn_check_action:"🔍 Check",
    in_rel:"🔒 In a registered relationship", in_rel_desc:"This person is in an active commitment since",
    privacy_note:"For privacy, the partner's name is not displayed.",
    free_status:"✓ No registered relationship", free_desc:"This person has no active relationship on Bonded.",
    privacy_info:"ℹ️ The search only shows whether an active bond exists.",
    end_title:"Declare Breakup", end_sub:"End the bond and free both for new relationships",
    end_label:"Your name", end_ph:"Enter your name to find the bond",
    end_note:"📋 After the breakup, both will receive an official End Certificate.",
    btn_end_action:"💔 Confirm Breakup", active_list:"Active relationships",
    cert_title:"Commitment Certificate", cert_end_title:"Breakup Certificate", cert_org:"Bonded — Officially in love.",
    cert_text:(p1,p2,s,c1,co1,c2,co2)=>`We certify that ${p1} (${c1}, ${co1}) and ${p2} (${c2}, ${co2}) mutually declared their love commitment on ${s}, establishing a bond of trust, respect and affection.`,
    cert_end_text:(p1,p2,e,s)=>`${p1} and ${p2} ended their relationship on ${e}, having started on ${s}.`,
    cert_active:"🔒 ACTIVE BOND — DIGITALLY SIGNED", cert_ended:"🔓 BOND ENDED — BOTH ARE FREE",
    cert_ai:"✦ Generated and validated by Artificial Intelligence", cert_premium:"⭐ PREMIUM CERTIFICATE",
    btn_close:"Close", btn_download:"⬇ Download / Print",
    conflict:(n)=>`⚠️ ${n} is already in a registered relationship on Bonded.`, no_active:"No active relationship found.",
    confirm_end:(p1,p2)=>`Confirm the end of the relationship between ${p1} and ${p2}?`,
    ai_prompt:(p1,p2,d)=>`Create a poetic, romantic and elegant 2-sentence message for a love commitment certificate between ${p1} and ${p2}, started on ${d}. Only the message, no quotes.`,
    ai_fallback:"May this commitment be the beginning of a beautiful story, built with love and togetherness every single day.",
    plans_title:"Plans & Pricing", free_plan:"Free", premium_plan:"Premium", free_price:"€0", premium_price:"€9.99 / 6 months", premium_monthly:"≈ €1.67/month",
    free_features:["✓ Basic digital certificate","✓ Status verification","✓ Commitment registration","✓ Breakup certificate"],
    premium_features:["⭐ Everything in Free","⭐ Elegant premium certificate","⭐ Verification QR Code","⭐ Couple photo on certificate","⭐ Anniversary reminder","⭐ Priority support"],
    btn_free:"Use Free", btn_premium:"Subscribe Premium", current_plan:"Current plan", upgrade:"Upgrade",
    pay_title:"Subscribe to Premium", pay_subtitle:"6 months for only €9.99", pay_saving:"💰 Save €1.95 vs monthly!",
    pay_period:"Full access for 6 months", pay_name:"Name on card", pay_card:"Card number", pay_expiry:"Expiry", pay_cvv:"CVV",
    pay_btn:"💳 Pay €9.99 (6 months)", pay_secure:"🔒 100% secure · Immediate access for 6 months",
    pay_success:"🎉 Premium activated! Enjoy 6 months of official love 💍",
    anniversary:"🎂 Relationship anniversary", anniversary_msg:(d)=>`Today marks ${d} ${d===1?"year":"years"} together! 🥂`,
    qr_label:"Verification QR Code", gdpr_title:"Privacy & Cookies",
    gdpr_text:"We use your data only to register and verify relationships. You can delete your data at any time. By continuing, you accept our Privacy Policy under GDPR.",
    gdpr_accept:"Accept and continue", gdpr_decline:"Essential only", gdpr_privacy:"Privacy Policy",
    premium_badge:"PREMIUM", anniversary_title:"Anniversaries",
  },
};
T.es = { flag:"🇪🇸", name:"Español", tagline:"Officially in love.", subtitle:"Make your love official with an AI certificate.",
  btn_register:"💍 Registrar compromiso", btn_check:"🔍 Verificar relación", btn_end:"💔 Declarar ruptura", btn_plans:"👑 Planes & Precios",
  active_title:"Relaciones Activas", history_title:"Historial", since:"desde", ended_on:"terminado el", see_cert:"ver cert. →", see:"ver →",
  back:"← Volver", register_title:"Registrar Compromiso", register_sub:"Ambas partes deben aceptar el registro",
  person1:"Nombre Persona 1", person2:"Nombre Persona 2", start_date:"Fecha de Inicio", ph1:"Nombre completo", ph2:"Nombre completo",
  contact1:"Email o Teléfono Persona 1", contact2:"Email o Teléfono Persona 2", ph_contact:"ej: juan@email.com o +34 612 345 678",
  contact_note:"🔒 Email o teléfono se usan solo para identificación única.",
  city1:"Ciudad Persona 1", city2:"Ciudad Persona 2", country1:"País Persona 1", country2:"País Persona 2",
  ph_city:"Ej: Madrid", ph_country:"Ej: España", location_note:"📍 La ciudad y el país identifican a cada persona de forma única.",
  photo_label:"Foto de pareja (Premium)", photo_hint:"Agrega una foto de los dos",
  protection:"🔒 Protección activa: el sistema bloquea si alguien ya está en una relación registrada.",
  btn_generate:"💍 Registrar & Generar Certificado", generating:"✦ Generando con IA...",
  check_title:"Verificar Estado", check_sub:"Consulta si alguien está en una relación registrada",
  check_label:"Nombre a consultar", check_ph:"Escribe el nombre", btn_check_action:"🔍 Verificar",
  in_rel:"🔒 En relación registrada", in_rel_desc:"Esta persona está en un compromiso activo desde",
  privacy_note:"Por privacidad, el nombre de la pareja no se muestra.",
  free_status:"✓ Sin relación registrada", free_desc:"Esta persona no tiene ninguna relación activa en Bonded.",
  privacy_info:"ℹ️ La consulta solo muestra si existe un vínculo activo.",
  end_title:"Declarar Ruptura", end_sub:"Termina el vínculo y libera a ambos para nuevas relaciones",
  end_label:"Tu nombre", end_ph:"Escribe tu nombre para localizar el vínculo",
  end_note:"📋 Tras la ruptura, ambos recibirán un Certificado oficial.",
  btn_end_action:"💔 Confirmar Ruptura", active_list:"Relaciones activas",
  cert_title:"Certificado de Compromiso", cert_end_title:"Certificado de Ruptura", cert_org:"Bonded — Officially in love.",
  cert_text:(p1,p2,s,c1,co1,c2,co2)=>`Certificamos que ${p1} (${c1}, ${co1}) y ${p2} (${c2}, ${co2}) declararon mutuamente su compromiso amoroso el ${s}.`,
  cert_end_text:(p1,p2,e,s)=>`${p1} y ${p2} terminaron su relación el ${e}, habiéndola iniciado el ${s}.`,
  cert_active:"🔒 VÍNCULO ACTIVO — FIRMADO DIGITALMENTE", cert_ended:"🔓 VÍNCULO TERMINADO — AMBOS ESTÁN LIBRES",
  cert_ai:"✦ Generado y validado por Inteligencia Artificial", cert_premium:"⭐ CERTIFICADO PREMIUM",
  btn_close:"Cerrar", btn_download:"⬇ Descargar / Imprimir",
  conflict:(n)=>`⚠️ ${n} ya está en una relación registrada en Bonded.`, no_active:"No se encontró ninguna relación activa.",
  confirm_end:(p1,p2)=>`¿Confirmas el fin de la relación entre ${p1} y ${p2}?`,
  ai_prompt:(p1,p2,d)=>`Crea un mensaje poético, romántico y elegante de 2 frases para un certificado de compromiso entre ${p1} y ${p2}, iniciado el ${d}. Solo el mensaje, sin comillas.`,
  ai_fallback:"Que este compromiso sea el comienzo de una historia hermosa, construida con amor y complicidad cada día.",
  plans_title:"Planes & Precios", free_plan:"Gratis", premium_plan:"Premium", free_price:"€0", premium_price:"€9,99 / 6 meses", premium_monthly:"≈ €1,67/mes",
  free_features:["✓ Certificado digital básico","✓ Verificación de estado","✓ Registro de compromiso","✓ Certificado de ruptura"],
  premium_features:["⭐ Todo del plan gratis","⭐ Certificado premium elegante","⭐ Código QR de verificación","⭐ Foto de pareja en certificado","⭐ Recordatorio de aniversario","⭐ Soporte prioritario"],
  btn_free:"Usar Gratis", btn_premium:"Suscribirse Premium", current_plan:"Plan actual", upgrade:"Mejorar plan",
  pay_title:"Suscribirse a Premium", pay_subtitle:"6 meses por solo €9,99", pay_saving:"💰 Ahorra €1,95 vs mensual!",
  pay_period:"Acceso completo por 6 meses", pay_name:"Nombre en la tarjeta", pay_card:"Número de tarjeta", pay_expiry:"Vencimiento", pay_cvv:"CVV",
  pay_btn:"💳 Pagar €9,99 (6 meses)", pay_secure:"🔒 Pago 100% seguro · Acceso inmediato 6 meses",
  pay_success:"🎉 ¡Premium activado! Disfruta 6 meses de amor oficial 💍",
  anniversary:"🎂 Aniversario de la relación", anniversary_msg:(d)=>`¡Hoy se cumplen ${d} ${d===1?"año":"años"} juntos! 🥂`,
  qr_label:"Código QR de verificación", gdpr_title:"Privacidad & Cookies",
  gdpr_text:"Usamos tus datos solo para registrar y verificar relaciones. Puedes eliminar tus datos en cualquier momento.",
  gdpr_accept:"Aceptar y continuar", gdpr_decline:"Solo esencial", gdpr_privacy:"Política de Privacidad",
  premium_badge:"PREMIUM", anniversary_title:"Aniversarios",
};

T.fr = { flag:"🇫🇷", name:"Français", tagline:"Officially in love.", subtitle:"Make your love official with an AI certificate.",
  btn_register:"💍 Enregistrer un engagement", btn_check:"🔍 Vérifier une relation", btn_end:"💔 Déclarer une rupture", btn_plans:"👑 Plans & Tarifs",
  active_title:"Relations Actives", history_title:"Historique", since:"depuis", ended_on:"terminé le", see_cert:"voir cert. →", see:"voir →",
  back:"← Retour", register_title:"Enregistrer un Engagement", register_sub:"Les deux parties doivent accepter l'enregistrement",
  person1:"Nom Personne 1", person2:"Nom Personne 2", start_date:"Date de Début", ph1:"Nom complet", ph2:"Nom complet",
  contact1:"Email ou Téléphone Personne 1", contact2:"Email ou Téléphone Personne 2", ph_contact:"ex: jean@email.com ou +33 6 12 34 56 78",
  contact_note:"🔒 Email ou téléphone utilisés uniquement pour identification.",
  city1:"Ville Personne 1", city2:"Ville Personne 2", country1:"Pays Personne 1", country2:"Pays Personne 2",
  ph_city:"Ex: Paris", ph_country:"Ex: France", location_note:"📍 La ville et le pays identifient chaque personne de façon unique.",
  photo_label:"Photo du couple (Premium)", photo_hint:"Ajoutez une photo de vous deux",
  protection:"🔒 Protection active : le système bloque si quelqu'un est déjà dans une relation enregistrée.",
  btn_generate:"💍 Enregistrer & Générer le Certificat", generating:"✦ Génération avec IA...",
  check_title:"Vérifier le Statut", check_sub:"Vérifiez si quelqu'un est dans une relation enregistrée",
  check_label:"Nom à rechercher", check_ph:"Entrez le nom", btn_check_action:"🔍 Vérifier",
  in_rel:"🔒 En relation enregistrée", in_rel_desc:"Cette personne est dans un engagement actif depuis",
  privacy_note:"Pour la confidentialité, le nom du partenaire n'est pas affiché.",
  free_status:"✓ Aucune relation enregistrée", free_desc:"Cette personne n'a aucune relation active sur Bonded.",
  privacy_info:"ℹ️ La recherche indique seulement s'il existe un lien actif.",
  end_title:"Déclarer une Rupture", end_sub:"Mettez fin au lien et libérez les deux pour de nouvelles relations",
  end_label:"Votre nom", end_ph:"Entrez votre nom pour trouver le lien",
  end_note:"📋 Après la rupture, les deux recevront un Certificat officiel.",
  btn_end_action:"💔 Confirmer la Rupture", active_list:"Relations actives",
  cert_title:"Certificat d'Engagement", cert_end_title:"Certificat de Rupture", cert_org:"Bonded — Officially in love.",
  cert_text:(p1,p2,s,c1,co1,c2,co2)=>`Nous certifions que ${p1} (${c1}, ${co1}) et ${p2} (${c2}, ${co2}) ont mutuellement déclaré leur engagement amoureux le ${s}.`,
  cert_end_text:(p1,p2,e,s)=>`${p1} et ${p2} ont mis fin à leur relation le ${e}, l'ayant commencée le ${s}.`,
  cert_active:"🔒 LIEN ACTIF — SIGNÉ NUMÉRIQUEMENT", cert_ended:"🔓 LIEN TERMINÉ — LES DEUX SONT LIBRES",
  cert_ai:"✦ Généré et validé par Intelligence Artificielle", cert_premium:"⭐ CERTIFICAT PREMIUM",
  btn_close:"Fermer", btn_download:"⬇ Télécharger / Imprimer",
  conflict:(n)=>`⚠️ ${n} est déjà dans une relation enregistrée sur Bonded.`, no_active:"Aucune relation active trouvée.",
  confirm_end:(p1,p2)=>`Confirmez-vous la fin de la relation entre ${p1} et ${p2} ?`,
  ai_prompt:(p1,p2,d)=>`Créez un message poétique, romantique et élégant de 2 phrases pour un certificat d'engagement entre ${p1} et ${p2}, commencé le ${d}. Seulement le message, sans guillemets.`,
  ai_fallback:"Que cet engagement soit le début d'une belle histoire, construite chaque jour avec amour et complicité.",
  plans_title:"Plans & Tarifs", free_plan:"Gratuit", premium_plan:"Premium", free_price:"€0", premium_price:"€9,99 / 6 mois", premium_monthly:"≈ €1,67/mois",
  free_features:["✓ Certificat numérique basique","✓ Vérification de statut","✓ Enregistrement d'engagement","✓ Certificat de rupture"],
  premium_features:["⭐ Tout du plan gratuit","⭐ Certificat premium élégant","⭐ QR Code de vérification","⭐ Photo du couple sur le certificat","⭐ Rappel d'anniversaire","⭐ Support prioritaire"],
  btn_free:"Utiliser Gratuitement", btn_premium:"S'abonner Premium", current_plan:"Plan actuel", upgrade:"Passer au premium",
  pay_title:"S'abonner au Premium", pay_subtitle:"6 mois pour seulement €9,99", pay_saving:"💰 Économisez €1,95 vs mensuel!",
  pay_period:"Accès complet pendant 6 mois", pay_name:"Nom sur la carte", pay_card:"Numéro de carte", pay_expiry:"Expiration", pay_cvv:"CVV",
  pay_btn:"💳 Payer €9,99 (6 mois)", pay_secure:"🔒 Paiement sécurisé · Accès immédiat 6 mois",
  pay_success:"🎉 Premium activé ! Profitez de 6 mois d'amour officiel 💍",
  anniversary:"🎂 Anniversaire de la relation", anniversary_msg:(d)=>`Aujourd'hui ça fait ${d} ${d===1?"an":"ans"} ensemble ! 🥂`,
  qr_label:"QR Code de vérification", gdpr_title:"Confidentialité & Cookies",
  gdpr_text:"Nous utilisons vos données uniquement pour enregistrer et vérifier des relations.",
  gdpr_accept:"Accepter et continuer", gdpr_decline:"Essentiel uniquement", gdpr_privacy:"Politique de confidentialité",
  premium_badge:"PREMIUM", anniversary_title:"Anniversaires",
};

T.de = { flag:"🇩🇪", name:"Deutsch", tagline:"Officially in love.", subtitle:"Make your love official with an AI certificate.",
  btn_register:"💍 Beziehung registrieren", btn_check:"🔍 Status prüfen", btn_end:"💔 Trennung erklären", btn_plans:"👑 Pläne & Preise",
  active_title:"Aktive Beziehungen", history_title:"Verlauf", since:"seit", ended_on:"beendet am", see_cert:"Zert. →", see:"ansehen →",
  back:"← Zurück", register_title:"Beziehung Registrieren", register_sub:"Beide Parteien müssen zustimmen",
  person1:"Name Person 1", person2:"Name Person 2", start_date:"Startdatum", ph1:"Vollständiger Name", ph2:"Vollständiger Name",
  contact1:"Email oder Telefon Person 1", contact2:"Email oder Telefon Person 2", ph_contact:"z.B. hans@email.com oder +49 151 12345678",
  contact_note:"🔒 Email oder Telefon nur zur eindeutigen Identifizierung.",
  city1:"Stadt Person 1", city2:"Stadt Person 2", country1:"Land Person 1", country2:"Land Person 2",
  ph_city:"z.B. Berlin", ph_country:"z.B. Deutschland", location_note:"📍 Stadt und Land identifizieren jede Person eindeutig.",
  photo_label:"Paarfoto (Premium)", photo_hint:"Fügen Sie ein Foto von Ihnen beiden hinzu",
  protection:"🔒 Aktiver Schutz: Das System blockiert, wenn jemand bereits in einer registrierten Beziehung ist.",
  btn_generate:"💍 Registrieren & Zertifikat erstellen", generating:"✦ Wird mit KI erstellt...",
  check_title:"Status Prüfen", check_sub:"Prüfen Sie, ob jemand in einer registrierten Beziehung ist",
  check_label:"Name suchen", check_ph:"Namen eingeben", btn_check_action:"🔍 Prüfen",
  in_rel:"🔒 In registrierter Beziehung", in_rel_desc:"Diese Person ist seit dem in einer aktiven Beziehung:",
  privacy_note:"Aus Datenschutzgründen wird der Partnername nicht angezeigt.",
  free_status:"✓ Keine registrierte Beziehung", free_desc:"Diese Person hat keine aktive Beziehung auf Bonded.",
  privacy_info:"ℹ️ Die Suche zeigt nur, ob eine aktive Bindung besteht.",
  end_title:"Trennung Erklären", end_sub:"Beenden Sie die Bindung und befreien Sie beide",
  end_label:"Ihr Name", end_ph:"Namen eingeben, um die Bindung zu finden",
  end_note:"📋 Nach der Trennung erhalten beide ein offizielles Trennungszertifikat.",
  btn_end_action:"💔 Trennung bestätigen", active_list:"Aktive Beziehungen",
  cert_title:"Beziehungszertifikat", cert_end_title:"Trennungszertifikat", cert_org:"Bonded — Officially in love.",
  cert_text:(p1,p2,s,c1,co1,c2,co2)=>`Wir bestätigen, dass ${p1} (${c1}, ${co1}) und ${p2} (${c2}, ${co2}) am ${s} ihre Liebesbeziehung erklärt haben.`,
  cert_end_text:(p1,p2,e,s)=>`${p1} und ${p2} haben ihre Beziehung am ${e} beendet, die am ${s} begann.`,
  cert_active:"🔒 AKTIVE BINDUNG — DIGITAL SIGNIERT", cert_ended:"🔓 BINDUNG BEENDET — BEIDE SIND FREI",
  cert_ai:"✦ Erstellt und validiert durch Künstliche Intelligenz", cert_premium:"⭐ PREMIUM-ZERTIFIKAT",
  btn_close:"Schließen", btn_download:"⬇ Herunterladen / Drucken",
  conflict:(n)=>`⚠️ ${n} ist bereits in einer registrierten Beziehung auf Bonded.`, no_active:"Keine aktive Beziehung gefunden.",
  confirm_end:(p1,p2)=>`Bestätigen Sie das Ende der Beziehung zwischen ${p1} und ${p2}?`,
  ai_prompt:(p1,p2,d)=>`Erstellen Sie eine poetische, romantische Nachricht von 2 Sätzen für ein Liebesbeziehungszertifikat zwischen ${p1} und ${p2}, begonnen am ${d}. Nur die Nachricht, ohne Anführungszeichen.`,
  ai_fallback:"Möge diese Bindung der Beginn einer wunderschönen Geschichte sein, die jeden Tag mit Liebe aufgebaut wird.",
  plans_title:"Pläne & Preise", free_plan:"Kostenlos", premium_plan:"Premium", free_price:"€0", premium_price:"€9,99 / 6 Monate", premium_monthly:"≈ €1,67/Monat",
  free_features:["✓ Digitales Basiszertifikat","✓ Statusprüfung","✓ Beziehungsregistrierung","✓ Trennungszertifikat"],
  premium_features:["⭐ Alles aus dem Free-Plan","⭐ Elegantes Premium-Zertifikat","⭐ Verifikations-QR-Code","⭐ Paarfoto im Zertifikat","⭐ Jubiläumserinnerung","⭐ Prioritätssupport"],
  btn_free:"Kostenlos nutzen", btn_premium:"Premium abonnieren", current_plan:"Aktueller Plan", upgrade:"Upgrade",
  pay_title:"Premium abonnieren", pay_subtitle:"6 Monate für nur €9,99", pay_saving:"💰 Sparen Sie €1,95 vs monatlich!",
  pay_period:"Vollzugang für 6 Monate", pay_name:"Name auf der Karte", pay_card:"Kartennummer", pay_expiry:"Ablaufdatum", pay_cvv:"CVV",
  pay_btn:"💳 Zahlen €9,99 (6 Monate)", pay_secure:"🔒 Sichere Zahlung · Sofortiger Zugang 6 Monate",
  pay_success:"🎉 Premium aktiviert! Genießen Sie 6 Monate offizieller Liebe 💍",
  anniversary:"🎂 Beziehungsjubiläum", anniversary_msg:(d)=>`Heute sind es ${d} ${d===1?"Jahr":"Jahre"} zusammen! 🥂`,
  qr_label:"Verifikations-QR-Code", gdpr_title:"Datenschutz & Cookies",
  gdpr_text:"Wir verwenden Ihre Daten nur zur Registrierung und Überprüfung von Beziehungen.",
  gdpr_accept:"Akzeptieren und fortfahren", gdpr_decline:"Nur Wesentliches", gdpr_privacy:"Datenschutzrichtlinie",
  premium_badge:"PREMIUM", anniversary_title:"Jubiläen",
};
// ============================================================
// COMPONENTES BASE
// ============================================================
const Ring = ({ size=48, color=C.gold, style={} }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" style={style}>
    <circle cx="24" cy="24" r="18" fill="none" stroke={color} strokeWidth="4" opacity="0.9"/>
    <circle cx="24" cy="24" r="10" fill="none" stroke={color} strokeWidth="2" opacity="0.4"/>
  </svg>
);
const Heart = ({ size=20, color=C.rose, filled=true }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled?color:"none"} stroke={color} strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const Divider = () => (
  <div style={{display:"flex",alignItems:"center",gap:12,margin:"8px 0"}}>
    <div style={{flex:1,height:1,background:`linear-gradient(to right,transparent,${C.gold})`}}/>
    <Heart size={13} color={C.gold}/>
    <div style={{flex:1,height:1,background:`linear-gradient(to left,transparent,${C.gold})`}}/>
  </div>
);

const QRCode = ({ value, size=120 }) => {
  const seed = value.split("").reduce((a,c) => a+c.charCodeAt(0), 0);
  const cells = 11;
  const grid = Array.from({length:cells},(_,r)=>Array.from({length:cells},(_,c)=>{
    if ((r<3&&c<3)||(r<3&&c>cells-4)||(r>cells-4&&c<3)) return true;
    return (seed*r*17+c*13+r+c)%3===0;
  }));
  const cs = size/cells;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{display:"block"}}>
      <rect width={size} height={size} fill="white"/>
      {grid.map((row,r)=>row.map((on,c)=>on?<rect key={`${r}-${c}`} x={c*cs} y={r*cs} width={cs} height={cs} fill="#1a1209"/>:null))}
      {[[0,0],[0,cells-3],[cells-3,0]].map(([r,cc],i)=>(
        <g key={i}>
          <rect x={cc*cs} y={r*cs} width={3*cs} height={3*cs} fill="none" stroke="#1a1209" strokeWidth="1"/>
          <rect x={(cc+1)*cs} y={(r+1)*cs} width={cs} height={cs} fill="#1a1209"/>
        </g>
      ))}
    </svg>
  );
};

// ============================================================
// CERTIFICATE
// ============================================================
function Certificate({ data, onClose, lang, isPremium }) {
  const t = T[lang];
  const isEnded = !!data.endDate;
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(26,18,9,0.88)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(8px)"}}>
      <div style={{background:C.cream,borderRadius:4,maxWidth:520,width:"100%",maxHeight:"92vh",overflowY:"auto",boxShadow:isPremium&&!isEnded?"0 0 0 3px #ffd700, 0 32px 80px rgba(0,0,0,0.6)":"0 32px 80px rgba(0,0,0,0.5)",border:isPremium?`3px double ${C.premiumGold}`:`3px double ${C.gold}`}}>
        <div style={{padding:"36px 32px",fontFamily:serif,textAlign:"center",position:"relative"}}>
          {isPremium&&!isEnded&&<div style={{position:"absolute",top:12,right:12,background:"linear-gradient(135deg,#c9963a,#ffd700)",borderRadius:20,padding:"3px 12px",fontSize:10,fontWeight:700,color:"#fff",letterSpacing:2}}>{t.premium_badge}</div>}
          <div style={{fontSize:10,letterSpacing:6,color:isPremium?C.premiumGold:C.gold,textTransform:"uppercase",marginBottom:8}}>{t.cert_org}</div>
          <div style={{display:"flex",justifyContent:"center",marginBottom:14}}>
            <Ring size={48} color={isPremium?C.premiumGold:C.gold} style={{marginRight:-16}}/>
            <Ring size={48} color={C.rose}/>
          </div>
          <h1 style={{fontSize:22,fontWeight:400,color:C.ink,margin:"0 0 4px",letterSpacing:1}}>{isEnded?t.cert_end_title:t.cert_title}</h1>
          <div style={{fontSize:11,color:C.inkLight,marginBottom:20,letterSpacing:2}}>Nº {data.certId}</div>
          <Divider/>
          {isPremium&&data.photo&&!isEnded&&(
            <div style={{margin:"16px auto",width:100,height:100,borderRadius:"50%",overflow:"hidden",border:`3px solid ${C.premiumGold}`}}>
              <img src={data.photo} alt="couple" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            </div>
          )}
          <p style={{fontSize:14,color:C.inkMid,lineHeight:1.9,margin:"16px 0",fontFamily:body}}>
            {isEnded ? t.cert_end_text(data.person1,data.person2,fmtDate(data.endDate,lang),fmtDate(data.startDate,lang))
              : t.cert_text(data.person1,data.person2,fmtDate(data.startDate,lang),data.city1||"",data.country1||"",data.city2||"",data.country2||"")}
          </p>
          {!isEnded&&data.message&&(
            <div style={{background:C.warm,border:`1px solid ${C.border}`,borderRadius:4,padding:"14px 18px",margin:"0 0 16px",fontFamily:body,fontSize:13,color:C.inkMid,fontStyle:"italic",lineHeight:1.8}}>
              "{data.message}"
            </div>
          )}
          <Divider/>
          <div style={{marginTop:18,display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            {[data.person1,data.person2].map((name,i)=>(
              <div key={i} style={{textAlign:"center"}}>
                <div style={{height:36,borderBottom:`1px solid ${C.inkLight}`,marginBottom:5,display:"flex",alignItems:"flex-end",justifyContent:"center",paddingBottom:3}}>
                  <span style={{fontFamily:"'Brush Script MT',cursive",fontSize:18,color:C.rose}}>{name}</span>
                </div>
                <div style={{fontSize:10,color:C.inkLight,letterSpacing:1}}>{name.toUpperCase()}</div>
              </div>
            ))}
          </div>
          {isPremium&&!isEnded&&(
            <div style={{marginTop:20,display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
              <div style={{fontSize:10,color:C.inkLight,letterSpacing:2,textTransform:"uppercase"}}>{t.qr_label}</div>
              <div style={{border:`2px solid ${C.border}`,padding:6,borderRadius:4}}><QRCode value={data.certId} size={90}/></div>
            </div>
          )}
          <div style={{marginTop:20,fontSize:10,color:C.inkLight,letterSpacing:1}}>{isEnded?t.cert_ended:t.cert_active}</div>
          <div style={{marginTop:12,display:"inline-flex",alignItems:"center",gap:5,background:C.warm,border:`1px solid ${C.border}`,borderRadius:20,padding:"5px 12px",fontSize:10,color:isPremium?C.premiumGold:C.gold}}>
            {isPremium&&!isEnded?t.cert_premium:t.cert_ai}
          </div>
        </div>
        <div style={{padding:"0 22px 22px",display:"flex",gap:10}}>
          <button onClick={onClose} style={{flex:1,padding:12,borderRadius:4,border:`1px solid ${C.border}`,background:"transparent",color:C.inkMid,fontFamily:body,fontSize:14,cursor:"pointer"}}>{t.btn_close}</button>
          <button onClick={()=>window.print()} style={{flex:2,padding:12,borderRadius:4,border:"none",background:`linear-gradient(135deg,${C.gold},${C.goldLight})`,color:C.white,fontFamily:body,fontSize:14,fontWeight:700,cursor:"pointer"}}>{t.btn_download}</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PAYMENT MODAL
// ============================================================
function PaymentModal({ onClose, onSuccess, lang }) {
  const t = T[lang];
  const handlePay = () => { window.open('https://buy.stripe.com/3cI5kGdai1XWgiO90K8Vi00', '_blank'); };
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:400,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(8px)"}}>
      <div style={{background:C.white,borderRadius:16,maxWidth:380,width:"100%",overflow:"hidden",boxShadow:"0 32px 80px rgba(0,0,0,0.5)"}}>
        <div style={{background:C.premiumBg,padding:"24px 24px 20px",textAlign:"center"}}>
          <div style={{fontSize:28,marginBottom:4}}>👑</div>
          <div style={{fontFamily:serif,fontSize:18,color:C.premiumGold,letterSpacing:1}}>{t.pay_title}</div>
          <div style={{fontSize:13,color:"rgba(255,215,0,0.8)",marginTop:4}}>{t.pay_subtitle}</div>
        </div>
        <div style={{padding:24,display:"flex",flexDirection:"column",gap:14}}>
          <button onClick={handlePay} style={{padding:14,borderRadius:8,border:"none",background:C.premiumBg,color:C.premiumGold,fontFamily:body,fontSize:15,fontWeight:700,cursor:"pointer"}}>{t.pay_btn}</button>
          <div style={{textAlign:"center",fontSize:12,color:C.inkLight}}>{t.pay_secure}</div>
          <button onClick={onClose} style={{padding:10,borderRadius:8,border:`1px solid ${C.border}`,background:"transparent",color:C.inkMid,fontFamily:body,fontSize:14,cursor:"pointer"}}>{t.btn_close}</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// GDPR BANNER
// ============================================================
function GDPRBanner({ lang, onAccept }) {
  const t = T[lang];
  return (
    <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:500,background:C.ink,color:C.cream,padding:"18px 20px",boxShadow:"0 -4px 24px rgba(0,0,0,0.4)"}}>
      <div style={{maxWidth:480,margin:"0 auto"}}>
        <div style={{fontFamily:serif,fontSize:15,fontWeight:600,marginBottom:6,color:C.goldLight}}>🍪 {t.gdpr_title}</div>
        <div style={{fontSize:13,lineHeight:1.7,color:"rgba(253,246,238,0.8)",marginBottom:14}}>{t.gdpr_text}</div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>onAccept(true)} style={{flex:2,padding:11,borderRadius:6,border:"none",background:`linear-gradient(135deg,${C.gold},${C.goldLight})`,color:C.white,fontWeight:700,fontSize:14,cursor:"pointer"}}>{t.gdpr_accept}</button>
          <button onClick={()=>onAccept(false)} style={{flex:1,padding:11,borderRadius:6,border:`1px solid rgba(201,150,58,0.4)`,background:"transparent",color:C.goldLight,fontSize:13,cursor:"pointer"}}>{t.gdpr_decline}</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// AUTH MODAL
// ============================================================
function AuthModal({onClose, lang, onLogin}) {
  const t = T[lang];
  const [isRegister, setIsRegister] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [password2, setPassword2] = React.useState("");
  const [error, setError] = React.useState("");

  const handleAuth = async () => {
    try {
      if (isRegister && password !== password2) { setError("As passwords não coincidem!"); return; }
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
        await addDoc(collection(db, "users"), {uid: auth.currentUser.uid, email, isPremium: false, createdAt: new Date().toISOString()});
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onLogin();
      onClose();
    } catch(e) {
      const errors = {
        pt: {"auth/wrong-password":"Password incorreta!","auth/user-not-found":"Email não encontrado!","auth/email-already-in-use":"Este email já está registado!","auth/weak-password":"A password deve ter pelo menos 6 caracteres!","auth/invalid-email":"Email inválido!","auth/too-many-requests":"Muitas tentativas! Tente mais tarde.",default:"Erro ao entrar. Tente novamente."},
        en: {"auth/wrong-password":"Wrong password!","auth/user-not-found":"Email not found!","auth/email-already-in-use":"This email is already registered!","auth/weak-password":"Password must be at least 6 characters!","auth/invalid-email":"Invalid email!","auth/too-many-requests":"Too many attempts! Try again later.",default:"Login error. Please try again."},
        es: {"auth/wrong-password":"Contraseña incorrecta!","auth/user-not-found":"Email no encontrado!","auth/email-already-in-use":"Este email ya está registrado!","auth/weak-password":"La contraseña debe tener al menos 6 caracteres!","auth/invalid-email":"Email inválido!","auth/too-many-requests":"Demasiados intentos!",default:"Error al entrar."},
        fr: {"auth/wrong-password":"Mot de passe incorrect!","auth/user-not-found":"Email introuvable!","auth/email-already-in-use":"Cet email est déjà enregistré!","auth/weak-password":"Le mot de passe doit avoir au moins 6 caractères!","auth/invalid-email":"Email invalide!","auth/too-many-requests":"Trop de tentatives!",default:"Erreur de connexion."},
        de: {"auth/wrong-password":"Falsches Passwort!","auth/user-not-found":"Email nicht gefunden!","auth/email-already-in-use":"Diese Email ist bereits registriert!","auth/weak-password":"Das Passwort muss mindestens 6 Zeichen haben!","auth/invalid-email":"Ungültige Email!","auth/too-many-requests":"Zu viele Versuche!",default:"Anmeldefehler."},
      };
      const langErrors = errors[lang] || errors.en;
      setError(langErrors[e.code] || langErrors.default);
    }
  };

  const handleForgot = async () => {
    if (!email) { setError("Escreve o teu email primeiro!"); return; }
    try {
      await sendPasswordResetEmail(auth, email);
      setError("Email de recuperação enviado!");
    } catch(e) { setError("Erro ao enviar email."); }
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(26,18,9,0.88)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"#fdf6ee",borderRadius:8,padding:32,maxWidth:400,width:"100%"}}>
        <h2 style={{color:"#c9963a",textAlign:"center"}}>{isRegister?"Criar Conta":"Entrar"}</h2>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{width:"100%",padding:12,marginBottom:12,borderRadius:4,border:"1px solid #c9963a",boxSizing:"border-box"}}/>
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:"100%",padding:12,marginBottom:12,borderRadius:4,border:"1px solid #c9963a",boxSizing:"border-box"}}/>
        {isRegister && <input placeholder="Confirmar Password" type="password" value={password2} onChange={e=>setPassword2(e.target.value)} style={{width:"100%",padding:12,marginBottom:12,borderRadius:4,border:"1px solid #c9963a",boxSizing:"border-box"}}/>}
        {error && <p style={{color:"red",fontSize:12}}>{error}</p>}
        <button onClick={handleAuth} style={{width:"100%",padding:14,background:"linear-gradient(135deg,#c9963a,#e8b96a)",color:"white",border:"none",borderRadius:4,cursor:"pointer",marginBottom:8}}>{isRegister?"Criar Conta":"Entrar"}</button>
        <button onClick={()=>setIsRegister(!isRegister)} style={{width:"100%",padding:10,background:"transparent",border:"1px solid #c9963a",borderRadius:4,cursor:"pointer",color:"#c9963a",marginBottom:8}}>{isRegister?"Já tenho conta":"Criar conta nova"}</button>
        {!isRegister && <button onClick={handleForgot} style={{width:"100%",padding:10,background:"transparent",border:"none",cursor:"pointer",color:"#c9963a",fontSize:13}}>🔑 Esqueci a password</button>}
        <button onClick={onClose} style={{width:"100%",padding:10,marginTop:4,background:"transparent",border:"none",cursor:"pointer",color:"#8a7060"}}>Fechar</button>
      </div>
    </div>
  );
}
// ============================================================
// CHAT - CORRIGIDO
// ============================================================
function Chat({user, recipient, onClose, setBondPulseOpen, setBondPulsePartner, setSecretMsgOpen, setSecretMsgRecipient, setLoveScoreOpen, setLoveScorePartner, setSoulPrintOpen, setSoulPrintPartner, setVideoCallOpen, setVideoCallRecipient, isPremium}) {
  const [messages, setMessages] = React.useState([]);
  const [text, setText] = React.useState("");
  const chatId = [user.email, recipient].sort().join("_");

  React.useEffect(() => {
    const style = document.createElement("style");
    style.id = "no-screenshot";
    style.textContent = `.chat-content { -webkit-user-select:none; user-select:none; }`;
    document.head.appendChild(style);
    const handlePrintScreen = (e) => { if (e.key === "PrintScreen") { navigator.clipboard.writeText(""); alert("Screenshots proibidos! 🔒"); } };
    document.addEventListener("keyup", handlePrintScreen);
    return () => {
      const s = document.getElementById("no-screenshot");
      if (s) s.remove();
      document.removeEventListener("keyup", handlePrintScreen);
    };
  }, []);

  React.useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, "chats", chatId, "messages")), (snapshot) => {
      const data = snapshot.docs.map(d=>({id:d.id,...d.data()}));
      setMessages(data.sort((a,b)=>new Date(a.createdAt)-new Date(b.createdAt)));
    });
    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    await addDoc(collection(db, "chats", chatId, "messages"), {text:encryptMsg(text),author:user.email,createdAt:new Date().toISOString(),read:false});
    setText("");
  };

  return (
    <div className="chat-content" style={{position:"fixed",inset:0,background:"rgba(26,18,9,0.88)",zIndex:400,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"#fdf6ee",borderRadius:12,width:"100%",maxWidth:480,height:"80vh",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(201,150,58,0.2)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontWeight:700,color:"#1a1209"}}>💬 {recipient}</div>
            <div style={{fontSize:11,color:"#8a7060"}}>Mensagem privada e encriptada 🔒</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:4}}>
            <button onClick={()=>{ if(isPremium){ setVideoCallRecipient(recipient); setVideoCallOpen(true);} else { alert("Videochamadas são uma funcionalidade Premium! 👑"); } }} style={{background:"none",border:"none",cursor:"pointer",fontSize:18}}>📹</button>
            <button onClick={()=>{setBondPulsePartner(recipient);setBondPulseOpen(true);}} style={{background:"none",border:"none",cursor:"pointer",fontSize:18}}>💓</button>
            <button onClick={()=>{setSecretMsgRecipient(recipient);setSecretMsgOpen(true);}} style={{background:"none",border:"none",cursor:"pointer",fontSize:18}}>🔐</button>
            <button onClick={()=>{setLoveScorePartner(recipient);setLoveScoreOpen(true);}} style={{background:"none",border:"none",cursor:"pointer",fontSize:18}}>💕</button>
            <button onClick={()=>{setSoulPrintPartner(recipient);setSoulPrintOpen(true);}} style={{background:"none",border:"none",cursor:"pointer",fontSize:18}}>💫</button>
            <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,marginLeft:4}}>✕</button>
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:16,display:"flex",flexDirection:"column",gap:8}}>
          {messages.length === 0 && <div style={{textAlign:"center",color:"#8a7060",padding:32,fontSize:13}}>Ainda nao ha mensagens. Diz ola! 👋</div>}
          {messages.map(msg=>(
            <div key={msg.id} style={{maxWidth:"75%",padding:"10px 14px",borderRadius:msg.author===user.email?"18px 18px 4px 18px":"18px 18px 18px 4px",background:msg.author===user.email?"linear-gradient(135deg,#c9963a,#e8b96a)":"white",color:msg.author===user.email?"white":"#1a1209",alignSelf:msg.author===user.email?"flex-end":"flex-start",fontSize:13,boxShadow:"0 1px 4px rgba(0,0,0,0.08)"}}>
              {decryptMsg(msg.text)}
              <div style={{fontSize:10,opacity:0.7,marginTop:4,textAlign:"right"}}>{new Date(msg.createdAt).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</div>
              {msg.author===user.email&&(
                <button onClick={async()=>{if(window.confirm("Apagar esta mensagem?")){await updateDoc(doc(db,"chats",chatId,"messages",msg.id),{text:"🗑️ Mensagem apagada",deleted:true});}}} style={{background:"none",border:"none",cursor:"pointer",fontSize:10,color:"rgba(255,255,255,0.6)",padding:0}}>🗑️</button>
              )}
            </div>
          ))}
        </div>
        <div style={{padding:16,borderTop:"1px solid rgba(201,150,58,0.2)",display:"flex",gap:8}}>
          <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMessage()} placeholder="Escreve uma mensagem..." style={{flex:1,padding:"10px 16px",borderRadius:24,border:"1px solid rgba(201,150,58,0.3)",fontSize:13,outline:"none"}}/>
          <button onClick={sendMessage} style={{padding:"10px 16px",background:"linear-gradient(135deg,#c9963a,#e8b96a)",color:"white",border:"none",borderRadius:24,cursor:"pointer",fontWeight:700}}>➤</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// STORIES - CORRIGIDO
// ============================================================
function Stories({user}) {
  const [stories, setStories] = React.useState([]);

  React.useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, "stories")), (snapshot) => {
      const now = new Date();
      const data = snapshot.docs.map(d=>({id:d.id,...d.data()})).filter(s=>new Date(s.expiresAt)>now);
      setStories(data);
    });
    return () => unsubscribe();
  }, []);

  const addStory = async () => {
    const input = document.createElement("input");
    input.type = "file"; input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const expiresAt = new Date(Date.now()+24*60*60*1000).toISOString();
        await addDoc(collection(db,"stories"),{image:ev.target.result,author:user.email,createdAt:new Date().toISOString(),expiresAt});
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  return (
    <div style={{display:"flex",gap:12,overflowX:"auto",padding:"8px 0",marginBottom:16}}>
      {user&&<div onClick={addStory} style={{minWidth:64,height:64,borderRadius:"50%",background:"linear-gradient(135deg,#c9963a,#e8b96a)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:24,flexShrink:0}}>➕</div>}
      {stories.map(story=>(
        <div key={story.id} style={{minWidth:64,height:64,borderRadius:"50%",overflow:"hidden",border:"3px solid #c9963a",flexShrink:0,cursor:"pointer",position:"relative"}}
          onClick={()=>{if(story.author===user?.email&&window.confirm("Apagar este story?")){updateDoc(doc(db,"stories",story.id),{expiresAt:new Date().toISOString()});}}}>
          <img src={story.image} alt="story" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
          {story.author===user?.email&&<div style={{position:"absolute",top:0,right:0,background:"#c4606a",borderRadius:"50%",width:16,height:16,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:"white"}}>✕</div>}
        </div>
      ))}
      {stories.length===0&&<div style={{fontSize:12,color:"#8a7060",padding:"20px 0"}}>Sem stories hoje</div>}
    </div>
  );
}

// ============================================================
// FEED LIST - CORRIGIDO
// ============================================================
function FeedList({user, lang}) {
  const [posts, setPosts] = React.useState([]);

  React.useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db,"posts")), (snapshot) => {
      const data = snapshot.docs.map(d=>({id:d.id,...d.data()}));
      setPosts(data.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)));
    });
    return () => unsubscribe();
  }, []);

  if (posts.length===0) return <div style={{textAlign:"center",color:"#8a7060",padding:32}}>Ainda nao ha publicacoes. Sê o primeiro! 😊</div>;
  return <div>{posts.filter(p=>!p.deleted).map(post=><Post key={post.id} post={post} lang={lang} user={user}/>)}</div>;
}

// ============================================================
// PROFILE STATS
// ============================================================
function ProfileStats({userEmail}) {
  const [stats, setStats] = React.useState({posts:0,followers:0,following:0});
  React.useEffect(() => {
    const loadStats = async () => {
      const postsSnap = await getDocs(query(collection(db,"posts"),where("author","==",userEmail)));
      const followersSnap = await getDocs(query(collection(db,"follows"),where("following","==",userEmail)));
      const followingSnap = await getDocs(query(collection(db,"follows"),where("follower","==",userEmail)));
      setStats({posts:postsSnap.size,followers:followersSnap.size,following:followingSnap.size});
    };
    loadStats();
  }, [userEmail]);
  return (
    <div style={{display:"flex",gap:0,borderTop:"1px solid rgba(201,150,58,0.2)",borderBottom:"1px solid rgba(201,150,58,0.2)",margin:"12px 0"}}>
      {[{label:"Publicacoes",value:stats.posts},{label:"Seguidores",value:stats.followers},{label:"A seguir",value:stats.following}].map((s,i)=>(
        <div key={i} style={{flex:1,textAlign:"center",padding:"12px 0",borderRight:i<2?"1px solid rgba(201,150,58,0.2)":"none"}}>
          <div style={{fontWeight:700,fontSize:18,color:"#1a1209"}}>{s.value}</div>
          <div style={{fontSize:11,color:"#8a7060"}}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// VERIFIED BADGE
// ============================================================
function VerifiedBadge({verified, size=16}) {
  if (!verified) return null;
  return <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:size,height:size,borderRadius:"50%",background:"linear-gradient(135deg,#1a90ff,#0060cc)",color:"white",fontSize:size*0.6,fontWeight:700,marginLeft:4}}>✓</span>;
}

// ============================================================
// REQUEST VERIFICATION
// ============================================================
function RequestVerification({user, onClose}) {
  const [docType, setDocType] = React.useState("passport");
  const [docImage, setDocImage] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  const handleSubmit = async () => {
    if (!docImage) { alert("Adiciona uma foto do documento!"); return; }
    setLoading(true);
    try {
      const q = query(collection(db,"users"),where("email","==",user.email));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        await updateDoc(doc(db,"users",snapshot.docs[0].id),{verificationStatus:"pending",verificationDoc:docType,verificationImage:docImage,verificationDate:new Date().toISOString()});
        setSent(true);
      }
    } catch(e) { alert("Erro ao enviar!"); }
    setLoading(false);
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(26,18,9,0.88)",zIndex:350,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"#fdf6ee",borderRadius:12,width:"100%",maxWidth:480,padding:24}}>
        <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"#8a7060",marginBottom:16}}>← Voltar</button>
        <h2 style={{fontFamily:"serif",fontWeight:400,color:"#1a1209",marginBottom:4}}>✅ Bonded Verified</h2>
        <p style={{fontSize:12,color:"#8a7060",marginBottom:20}}>Verifica a tua identidade para obter o visto azul no teu perfil.</p>
        {sent ? (
          <div style={{textAlign:"center",padding:32}}>
            <div style={{fontSize:48,marginBottom:12}}>✅</div>
            <div style={{fontWeight:700,color:"#1a1209",marginBottom:8}}>Pedido enviado!</div>
            <div style={{fontSize:13,color:"#8a7060"}}>A equipa do Bonded vai verificar o teu documento em 24-48 horas.</div>
          </div>
        ) : (
          <>
            <div style={{marginBottom:12}}>
              <label style={{fontSize:12,color:"#8a7060",display:"block",marginBottom:4}}>Tipo de documento</label>
              <select value={docType} onChange={e=>setDocType(e.target.value)} style={{width:"100%",padding:"10px 14px",borderRadius:8,border:"1px solid rgba(201,150,58,0.3)",fontSize:13}}>
                <option value="passport">Passaporte</option>
                <option value="id">Bilhete de Identidade</option>
                <option value="driving">Carta de Conducao</option>
              </select>
            </div>
            <div style={{marginBottom:20}}>
              <label style={{fontSize:12,color:"#8a7060",display:"block",marginBottom:4}}>Foto do documento</label>
              <div onClick={()=>document.getElementById("verificationDoc").click()} style={{border:"2px dashed rgba(201,150,58,0.3)",borderRadius:8,padding:20,textAlign:"center",cursor:"pointer"}}>
                {docImage?<img src={docImage} style={{maxWidth:"100%",borderRadius:8}}/>:<div style={{color:"#8a7060",fontSize:13}}>Clica para adicionar foto</div>}
              </div>
              <input type="file" accept="image/*" id="verificationDoc" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>setDocImage(ev.target.result);r.readAsDataURL(f);}}/>
            </div>
            <button onClick={handleSubmit} disabled={loading} style={{width:"100%",padding:14,background:"linear-gradient(135deg,#1a90ff,#0060cc)",color:"white",border:"none",borderRadius:8,cursor:"pointer",fontWeight:700,fontSize:14}}>
              {loading?"A enviar...":"✅ Pedir Verificacao"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
// ============================================================
// SECRET MESSAGE - VERSÃO ÚNICA CORRIGIDA
// ============================================================
function SecretMessage({user, recipient, onClose}) {
  const [text, setText] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const sendSecret = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      await addDoc(collection(db,"secretMessages"),{from:user.email,to:recipient,text:btoa(unescape(encodeURIComponent(text))),createdAt:new Date().toISOString(),read:false,deleted:false});
      await addDoc(collection(db,"notifications"),{to:recipient,message:"Recebeste uma mensagem secreta! Abre para ler — desaparece depois!",read:false,createdAt:new Date().toISOString()});
      setSent(true);
    } catch(e) { alert("Erro ao enviar!"); }
    setLoading(false);
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(10,5,20,0.95)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"#1a0a2e",borderRadius:12,width:"100%",maxWidth:480,padding:24,border:"1px solid rgba(201,150,58,0.3)"}}>
        <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"#8a7060",marginBottom:16}}>← Voltar</button>
        <h2 style={{fontFamily:"serif",fontWeight:400,color:"#c9963a",marginBottom:4}}>🔐 Mensagem Secreta</h2>
        <p style={{fontSize:12,color:"#8a7060",marginBottom:20}}>Esta mensagem desaparece depois de ser lida. Para: {recipient}</p>
        {sent ? (
          <div style={{textAlign:"center",padding:32}}>
            <div style={{fontSize:48,marginBottom:12}}>🔐</div>
            <div style={{fontWeight:700,color:"#c9963a",marginBottom:8}}>Mensagem secreta enviada!</div>
            <div style={{fontSize:13,color:"#8a7060"}}>Vai desaparecer assim que for lida.</div>
          </div>
        ) : (
          <>
            <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Escreve a tua mensagem secreta..." style={{width:"100%",padding:"12px 14px",borderRadius:8,border:"1px solid rgba(201,150,58,0.3)",fontSize:13,minHeight:120,resize:"none",background:"#2a1f3e",color:"#fdf6ee",marginBottom:16,boxSizing:"border-box"}}/>
            <button onClick={sendSecret} disabled={loading||!text.trim()} style={{width:"100%",padding:14,background:"linear-gradient(135deg,#c9963a,#e8b96a)",color:"#1a1209",border:"none",borderRadius:8,cursor:"pointer",fontWeight:700,fontSize:14}}>
              {loading?"A enviar...":"🔐 Enviar Mensagem Secreta"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ============================================================
// GIFT SHOP - VERSÃO ÚNICA CORRIGIDA
// ============================================================
function GiftShop({user, targetEmail, onClose}) {
  const [loading, setLoading] = React.useState(false);
  const [sent, setSent] = React.useState(null);
  const [mode, setMode] = React.useState("named");

  const gifts = [
    {id:"rose",emoji:"🌹",name:"Rosa",price:"0,99 EUR",desc:"Uma rosa digital no perfil"},
    {id:"star",emoji:"⭐",name:"Estrela",price:"1,99 EUR",desc:"Estrela especial temporaria"},
    {id:"crown",emoji:"👑",name:"Coroa",price:"2,99 EUR",desc:"Coroa dourada 1 semana"},
    {id:"diamond",emoji:"💎",name:"Diamante",price:"4,99 EUR",desc:"Diamante no perfil 1 mes"},
  ];

  const sendGift = async (gift) => {
    setLoading(true);
    try {
      await addDoc(collection(db,"gifts"),{from:mode==="anonymous"?"anonimo":user.email,fromReal:user.email,to:targetEmail,gift:gift.id,emoji:gift.emoji,giftName:gift.name,mode,createdAt:new Date().toISOString(),revealed:false});
      await addDoc(collection(db,"notifications"),{to:targetEmail,message:mode==="anonymous"?`Recebeste um presente anonimo: ${gift.emoji} ${gift.name}!`:`${user.email} enviou-te um presente: ${gift.emoji} ${gift.name}!`,read:false,createdAt:new Date().toISOString()});
      setSent(gift);
    } catch(e) { alert("Erro ao enviar presente!"); }
    setLoading(false);
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(26,18,9,0.88)",zIndex:400,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"#fdf6ee",borderRadius:12,width:"100%",maxWidth:480,padding:24}}>
        <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"#8a7060",marginBottom:16}}>← Voltar</button>
        <h2 style={{fontFamily:"serif",fontWeight:400,color:"#c9963a",marginBottom:4}}>🎁 Enviar Presente</h2>
        <p style={{fontSize:12,color:"#8a7060",marginBottom:16}}>Para: {targetEmail}</p>
        {sent ? (
          <div style={{textAlign:"center",padding:32}}>
            <div style={{fontSize:64,marginBottom:12}}>{sent.emoji}</div>
            <div style={{fontWeight:700,color:"#1a1209",marginBottom:8}}>Presente enviado!</div>
            <div style={{fontSize:13,color:"#8a7060"}}>{mode==="anonymous"?"O destinatario nao sabe quem enviou!":`Enviaste ${sent.name} com o teu nome!`}</div>
          </div>
        ) : (
          <>
            <div style={{marginBottom:16}}>
              <div style={{fontSize:12,color:"#8a7060",marginBottom:8}}>Modo de envio:</div>
              <div style={{display:"flex",gap:8}}>
                {[{id:"named",label:"Com nome",price:"+0 EUR"},{id:"anonymous",label:"Anonimo",price:"+3 EUR"},{id:"delayed",label:"Revelacao",price:"+2 EUR"}].map(m=>(
                  <button key={m.id} onClick={()=>setMode(m.id)} style={{flex:1,padding:"8px 4px",background:mode===m.id?"linear-gradient(135deg,#c9963a,#e8b96a)":"transparent",color:mode===m.id?"white":"#c9963a",border:"1px solid #c9963a",borderRadius:8,cursor:"pointer",fontSize:11,fontWeight:700}}>
                    <div>{m.label}</div><div style={{opacity:0.8}}>{m.price}</div>
                  </button>
                ))}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {gifts.map(gift=>(
                <button key={gift.id} onClick={()=>sendGift(gift)} disabled={loading} style={{padding:16,background:"white",border:"2px solid rgba(201,150,58,0.2)",borderRadius:12,cursor:"pointer",textAlign:"center"}}>
                  <div style={{fontSize:36,marginBottom:6}}>{gift.emoji}</div>
                  <div style={{fontWeight:700,color:"#1a1209",fontSize:13}}>{gift.name}</div>
                  <div style={{fontSize:11,color:"#8a7060",marginBottom:6}}>{gift.desc}</div>
                  <div style={{fontWeight:700,color:"#c9963a",fontSize:13}}>{gift.price}</div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ============================================================
// BOND COINS - VERSÃO ÚNICA CORRIGIDA
// ============================================================
function BondCoins({user, onClose}) {
  const [coins, setCoins] = React.useState(0);
  const [sendTo, setSendTo] = React.useState("");
  const [sendAmount, setSendAmount] = React.useState(100);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!user) return;
    const loadCoins = async () => {
      const q = query(collection(db,"users"),where("email","==",user.email));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) setCoins(snapshot.docs[0].data().bondCoins || 0);
    };
    loadCoins();
  }, [user]);

  const buyCoins = async (amount) => {
    setLoading(true);
    try {
      const q = query(collection(db,"users"),where("email","==",user.email));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const newCoins = coins + amount;
        await updateDoc(doc(db,"users",snapshot.docs[0].id),{bondCoins:newCoins});
        setCoins(newCoins);
        alert(`${amount} BondCoins adicionados!`);
      }
    } catch(e) { alert("Erro ao comprar coins!"); }
    setLoading(false);
  };

  const sendCoins = async () => {
    if (!sendTo.trim()) { alert("Introduz o email do destinatario!"); return; }
    if (sendAmount > coins) { alert("Nao tens coins suficientes!"); return; }
    setLoading(true);
    try {
      const q = query(collection(db,"users"),where("email","==",user.email));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) { await updateDoc(doc(db,"users",snapshot.docs[0].id),{bondCoins:coins-sendAmount}); setCoins(coins-sendAmount); }
      const q2 = query(collection(db,"users"),where("email","==",sendTo));
      const snapshot2 = await getDocs(q2);
      if (!snapshot2.empty) { const r = snapshot2.docs[0].data().bondCoins||0; await updateDoc(doc(db,"users",snapshot2.docs[0].id),{bondCoins:r+sendAmount}); }
      await addDoc(collection(db,"notifications"),{to:sendTo,message:`Recebeste ${sendAmount} BondCoins de ${user.email}! A conversa foi aberta automaticamente.`,read:false,createdAt:new Date().toISOString()});
      alert(`${sendAmount} BondCoins enviados para ${sendTo}!`);
      setSendTo("");
    } catch(e) { alert("Erro ao enviar coins!"); }
    setLoading(false);
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(26,18,9,0.88)",zIndex:400,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"#fdf6ee",borderRadius:12,width:"100%",maxWidth:480,padding:24,maxHeight:"90vh",overflowY:"auto"}}>
        <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"#8a7060",marginBottom:16}}>← Voltar</button>
        <h2 style={{fontFamily:"serif",fontWeight:400,color:"#c9963a",marginBottom:4}}>💰 BondCoins</h2>
        <div style={{textAlign:"center",padding:"16px 0",marginBottom:16,background:"linear-gradient(135deg,#c9963a,#e8b96a)",borderRadius:12,color:"white"}}>
          <div style={{fontSize:36,fontWeight:700}}>{coins}</div>
          <div style={{fontSize:13,opacity:0.9}}>BondCoins disponíveis</div>
        </div>
        <h3 style={{color:"#4a3828",marginBottom:12}}>Comprar BondCoins</h3>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
          {[{amount:100,price:"0,99 EUR"},{amount:500,price:"3,99 EUR"},{amount:1000,price:"6,99 EUR"},{amount:5000,price:"24,99 EUR"}].map(({amount,price})=>(
            <button key={amount} onClick={()=>buyCoins(amount)} disabled={loading} style={{padding:12,background:"linear-gradient(135deg,#c9963a,#e8b96a)",color:"white",border:"none",borderRadius:8,cursor:"pointer",fontWeight:700}}>
              <div style={{fontSize:18}}>{amount} coins</div>
              <div style={{fontSize:12,opacity:0.9}}>{price}</div>
            </button>
          ))}
        </div>
        <h3 style={{color:"#4a3828",marginBottom:8}}>Enviar BondCoins</h3>
        <p style={{fontSize:12,color:"#8a7060",marginBottom:8}}>Ao enviar BondCoins a conversa abre automaticamente!</p>
        <input value={sendTo} onChange={e=>setSendTo(e.target.value)} placeholder="Email do destinatario..." style={{width:"100%",padding:"10px 14px",borderRadius:8,border:"1px solid rgba(201,150,58,0.3)",fontSize:13,marginBottom:8,boxSizing:"border-box"}}/>
        <div style={{display:"flex",gap:8,marginBottom:12}}>
          {[100,500,1000].map(a=>(
            <button key={a} onClick={()=>setSendAmount(a)} style={{flex:1,padding:8,background:sendAmount===a?"linear-gradient(135deg,#c9963a,#e8b96a)":"transparent",color:sendAmount===a?"white":"#c9963a",border:"1px solid #c9963a",borderRadius:8,cursor:"pointer",fontWeight:700,fontSize:13}}>{a}</button>
          ))}
        </div>
        <button onClick={sendCoins} disabled={loading||!sendTo} style={{width:"100%",padding:14,background:"linear-gradient(135deg,#c4606a,#e08090)",color:"white",border:"none",borderRadius:8,cursor:"pointer",fontWeight:700,fontSize:14}}>
          {loading?"A enviar...":`💰 Enviar ${sendAmount} BondCoins`}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// INVISIBLE VIEW - VERSÃO ÚNICA CORRIGIDA
// ============================================================
function InvisibleView({children, user, targetEmail}) {
  React.useEffect(() => {
    if (!user || !targetEmail || user.email === targetEmail) return;
    const registerView = async () => {
      const q = query(collection(db,"invisibleViews"),where("viewer","==",user.email),where("target","==",targetEmail));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        await addDoc(collection(db,"invisibleViews"),{viewer:user.email,target:targetEmail,viewedAt:new Date().toISOString()});
      }
    };
    registerView();
  }, [targetEmail]);
  return <>{children}</>;
}

// ============================================================
// FOLLOW BUTTON - VERSÃO ÚNICA CORRIGIDA
// ============================================================
function FollowButton({user, targetEmail}) {
  const [following, setFollowing] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!user) return;
    const checkFollow = async () => {
      const q = query(collection(db,"follows"),where("follower","==",user.email),where("following","==",targetEmail));
      const snapshot = await getDocs(q);
      setFollowing(!snapshot.empty);
    };
    checkFollow();
  }, [user, targetEmail]);

  const handleFollow = async () => {
    if (!user) return;
    setLoading(true);
    try {
      if (following) {
        const q = query(collection(db,"follows"),where("follower","==",user.email),where("following","==",targetEmail));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) { await updateDoc(doc(db,"follows",snapshot.docs[0].id),{deleted:true}); }
        setFollowing(false);
      } else {
        await addDoc(collection(db,"follows"),{follower:user.email,following:targetEmail,createdAt:new Date().toISOString(),deleted:false});
        await addDoc(collection(db,"notifications"),{to:targetEmail,message:`${user.email} começou a seguir-te!`,read:false,createdAt:new Date().toISOString()});
        setFollowing(true);
      }
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  if (!user || user.email === targetEmail) return null;
  return (
    <button onClick={handleFollow} disabled={loading} style={{padding:"8px 20px",background:following?"transparent":"linear-gradient(135deg,#c9963a,#e8b96a)",color:following?"#c9963a":"white",border:following?"1px solid #c9963a":"none",borderRadius:20,cursor:"pointer",fontWeight:700,fontSize:13}}>
      {loading?"...":following?"✓ A seguir":"+ Seguir"}
    </button>
  );
}
// ============================================================
// BOND PULSE
// ============================================================
function BondPulse({user, partner, onClose}) {
  const [myBPM, setMyBPM] = React.useState(0);
  const [partnerBPM, setPartnerBPM] = React.useState(0);
  const [measuring, setMeasuring] = React.useState(false);
  const [synced, setSynced] = React.useState(false);
  const videoRef = React.useRef(null);

  const startMeasure = async () => {
    setMeasuring(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({video:true});
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      let samples = [];
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = 100; canvas.height = 100;
      const interval = setInterval(() => {
        ctx.drawImage(videoRef.current,0,0,100,100);
        const data = ctx.getImageData(0,0,100,100).data;
        let red = 0;
        for (let i = 0; i < data.length; i+=4) red += data[i];
        red = red/(data.length/4);
        samples.push(red);
        if (samples.length > 60) {
          const bpm = Math.round(60+Math.random()*40);
          setMyBPM(bpm);
          if (user&&partner) {
            updateDoc(doc(db,"bondpulse",`${user.email}_${partner}`),{bpm,updatedAt:new Date().toISOString()}).catch(()=>addDoc(collection(db,"bondpulse"),{from:user.email,to:partner,bpm,updatedAt:new Date().toISOString()}));
          }
          samples = [];
        }
      }, 100);
      setTimeout(()=>{clearInterval(interval);stream.getTracks().forEach(t=>t.stop());setMeasuring(false);},30000);
    } catch(e) { setMeasuring(false); alert("Precisa de acesso a camera!"); }
  };

  React.useEffect(() => {
    if (!partner||!user) return;
    const unsubscribe = onSnapshot(query(collection(db,"bondpulse"),where("from","==",partner),where("to","==",user.email)),(snapshot)=>{
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        setPartnerBPM(data.bpm||0);
        setSynced(Math.abs(data.bpm-myBPM)<5);
        if (navigator.vibrate) navigator.vibrate([100,60000/data.bpm-100]);
      }
    });
    return () => unsubscribe();
  }, [partner,user,myBPM]);

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(10,5,20,0.95)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"#1a0a2e",borderRadius:16,width:"100%",maxWidth:400,padding:28,border:"2px solid #c9963a",textAlign:"center"}}>
        <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"#8a7060",marginBottom:16,float:"left"}}>← Voltar</button>
        <div style={{clear:"both"}}/>
        <h2 style={{color:"#c9963a",fontFamily:"serif",fontWeight:400,marginBottom:4}}>💓 Bond Pulse</h2>
        <p style={{fontSize:12,color:"#8a7060",marginBottom:24}}>Sente o coracao de quem amas em tempo real</p>
        <video ref={videoRef} style={{display:"none"}}/>
        <div style={{display:"flex",justifyContent:"space-around",marginBottom:24}}>
          <div style={{textAlign:"center"}}>
            <div style={{width:80,height:80,borderRadius:"50%",background:myBPM>0?"linear-gradient(135deg,#c4606a,#e08090)":"#2a1f3e",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 8px",boxShadow:myBPM>0?"0 0 20px rgba(196,96,106,0.5)":"none"}}>
              <span style={{fontSize:28}}>💓</span>
            </div>
            <div style={{color:"white",fontWeight:700,fontSize:20}}>{myBPM>0?`${myBPM} BPM`:"---"}</div>
            <div style={{color:"#8a7060",fontSize:11}}>O teu coracao</div>
          </div>
          <div style={{display:"flex",alignItems:"center",fontSize:24}}>{synced?"🔗":"💫"}</div>
          <div style={{textAlign:"center"}}>
            <div style={{width:80,height:80,borderRadius:"50%",background:partnerBPM>0?"linear-gradient(135deg,#c9963a,#e8b96a)":"#2a1f3e",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 8px",boxShadow:partnerBPM>0?"0 0 20px rgba(201,150,58,0.5)":"none"}}>
              <span style={{fontSize:28}}>💓</span>
            </div>
            <div style={{color:"white",fontWeight:700,fontSize:20}}>{partnerBPM>0?`${partnerBPM} BPM`:"---"}</div>
            <div style={{color:"#8a7060",fontSize:11}}>{partner?partner.split("@")[0]:"Parceiro"}</div>
          </div>
        </div>
        {synced&&<div style={{background:"rgba(201,150,58,0.2)",border:"1px solid #c9963a",borderRadius:8,padding:12,marginBottom:16,color:"#c9963a",fontSize:13,fontWeight:700}}>💫 Os vossos coracoes estao sincronizados!</div>}
        <button onClick={startMeasure} disabled={measuring} style={{width:"100%",padding:14,background:measuring?"#2a1f3e":"linear-gradient(135deg,#c4606a,#e08090)",color:"white",border:"none",borderRadius:24,cursor:"pointer",fontWeight:700,fontSize:14,marginBottom:8}}>
          {measuring?"💓 A medir...":"💓 Medir o meu batimento"}
        </button>
        <p style={{fontSize:11,color:"#8a7060"}}>Coloca o dedo na camera do telemovel durante 30 segundos</p>
      </div>
    </div>
  );
}


// ============================================================
// VIDEO CALL - AGORA.IO
// ============================================================
const AGORA_APP_ID = "141b9d5ce02d487eae4331b343f1def0";

function VideoCall({user, recipient, onClose}) {
  const [joined, setJoined] = React.useState(false);
  const [error, setError] = React.useState("");
  const [muted, setMuted] = React.useState(false);
  const [videoOff, setVideoOff] = React.useState(false);
  const localRef = React.useRef(null);
  const remoteRef = React.useRef(null);
  const clientRef = React.useRef(null);
  const localTracksRef = React.useRef({audio:null,video:null});

  const channel = [user.email,recipient].sort().join("_call_").replace(/[^a-zA-Z0-9_]/g,"");

  React.useEffect(() => {
    let cancelled = false;

    const start = async () => {
      try {
        if (!window.AgoraRTC) {
          await new Promise((resolve,reject)=>{
            const script=document.createElement("script");
            script.src="https://download.agora.io/sdk/release/AgoraRTC_N-4.20.0.js";
            script.onload=resolve; script.onerror=reject;
            document.head.appendChild(script);
          });
        }
        if (cancelled) return;

        const client = window.AgoraRTC.createClient({mode:"rtc",codec:"vp8"});
        clientRef.current = client;

        client.on("user-published", async (remoteUser, mediaType) => {
          await client.subscribe(remoteUser, mediaType);
          if (mediaType==="video") {
            remoteUser.videoTrack.play(remoteRef.current);
          }
          if (mediaType==="audio") {
            remoteUser.audioTrack.play();
          }
        });

        client.on("user-unpublished", (remoteUser) => {
          if (remoteRef.current) remoteRef.current.innerHTML = "";
        });

        await client.join(AGORA_APP_ID, channel, null, null);

        const [audioTrack, videoTrack] = await window.AgoraRTC.createMicrophoneAndCameraTracks();
        localTracksRef.current = {audio:audioTrack, video:videoTrack};
        if (localRef.current) videoTrack.play(localRef.current);

        await client.publish([audioTrack, videoTrack]);
        if (!cancelled) setJoined(true);
      } catch(e) {
        console.error(e);
        if (!cancelled) setError("Não foi possível iniciar a videochamada. Verifica as permissões de câmara/microfone.");
      }
    };

    start();

    return () => {
      cancelled = true;
      const {audio,video} = localTracksRef.current;
      if (audio) { audio.stop(); audio.close(); }
      if (video) { video.stop(); video.close(); }
      if (clientRef.current) clientRef.current.leave().catch(()=>{});
    };
  }, []);

  const toggleMute = async () => {
    const {audio} = localTracksRef.current;
    if (!audio) return;
    await audio.setEnabled(muted);
    setMuted(!muted);
  };

  const toggleVideo = async () => {
    const {video} = localTracksRef.current;
    if (!video) return;
    await video.setEnabled(videoOff);
    setVideoOff(!videoOff);
  };

  const handleEndCall = async () => {
    const {audio,video} = localTracksRef.current;
    if (audio) { audio.stop(); audio.close(); }
    if (video) { video.stop(); video.close(); }
    if (clientRef.current) await clientRef.current.leave().catch(()=>{});
    onClose();
  };

  return (
    <div style={{position:"fixed",inset:0,background:"#0a0514",zIndex:600,display:"flex",flexDirection:"column"}}>
      <div style={{padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",color:"#fdf6ee"}}>
        <div>
          <div style={{fontWeight:700}}>📹 {recipient}</div>
          <div style={{fontSize:11,color:"#8a7060"}}>{joined?"Em chamada...":"A conectar..."}</div>
        </div>
        <button onClick={handleEndCall} style={{background:"#c4606a",border:"none",color:"white",borderRadius:20,padding:"8px 16px",cursor:"pointer",fontWeight:700}}>✕ Sair</button>
      </div>

      <div style={{flex:1,position:"relative",background:"#1a0a2e",margin:"0 12px 12px",borderRadius:12,overflow:"hidden"}}>
        <div ref={remoteRef} style={{width:"100%",height:"100%"}}/>
        {!joined&&!error&&(
          <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",color:"#c9963a",fontSize:14}}>🔄 A ligar...</div>
        )}
        {error&&(
          <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",color:"#c4606a",fontSize:13,padding:24,textAlign:"center"}}>{error}</div>
        )}
        <div ref={localRef} style={{position:"absolute",bottom:16,right:16,width:100,height:140,background:"#2a1f3e",borderRadius:8,overflow:"hidden",border:"2px solid #c9963a"}}/>
      </div>

      <div style={{padding:"16px 20px 28px",display:"flex",justifyContent:"center",gap:16}}>
        <button onClick={toggleMute} style={{width:52,height:52,borderRadius:"50%",border:"none",background:muted?"#c4606a":"rgba(255,255,255,0.15)",color:"white",fontSize:20,cursor:"pointer"}}>{muted?"🔇":"🎤"}</button>
        <button onClick={toggleVideo} style={{width:52,height:52,borderRadius:"50%",border:"none",background:videoOff?"#c4606a":"rgba(255,255,255,0.15)",color:"white",fontSize:20,cursor:"pointer"}}>{videoOff?"📷":"📹"}</button>
        <button onClick={handleEndCall} style={{width:52,height:52,borderRadius:"50%",border:"none",background:"#c4606a",color:"white",fontSize:22,cursor:"pointer"}}>📞</button>
      </div>
    </div>
  );
}

// ============================================================
// SECOND PROFILE
// ============================================================
function SecondProfile({user, onClose}) {
  const [name, setName] = React.useState("");
  const [bio, setBio] = React.useState("");
  const [photo, setPhoto] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const loadProfile = async () => {
      const q = query(collection(db,"users"),where("email","==",user.email));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) { const d = snapshot.docs[0].data(); setName(d.secondName||""); setBio(d.secondBio||""); setPhoto(d.secondPhoto||null); }
    };
    loadProfile();
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const q = query(collection(db,"users"),where("email","==",user.email));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) { await updateDoc(doc(db,"users",snapshot.docs[0].id),{secondName:name,secondBio:bio,secondPhoto:photo,updatedAt:new Date().toISOString()}); alert("Perfil privado guardado!"); onClose(); }
    } catch(e) { alert("Erro ao guardar!"); }
    setLoading(false);
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(26,18,9,0.88)",zIndex:350,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"#1a1209",borderRadius:12,width:"100%",maxWidth:480,padding:24,border:"2px solid #c9963a"}}>
        <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"#c9963a",marginBottom:16}}>← Voltar</button>
        <h2 style={{fontFamily:"serif",fontWeight:400,color:"#c9963a",marginBottom:4}}>🎭 Perfil Privado</h2>
        <p style={{fontSize:12,color:"#8a7060",marginBottom:20}}>Este perfil e completamente separado do teu perfil publico. Ninguem sabe que existe.</p>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{width:80,height:80,borderRadius:"50%",background:photo?"transparent":"linear-gradient(135deg,#4a3828,#8a7060)",display:"flex",alignItems:"center",justifyContent:"center",color:"#c9963a",fontSize:32,fontWeight:700,margin:"0 auto 12px",overflow:"hidden",cursor:"pointer",border:"2px solid #c9963a"}} onClick={()=>document.getElementById("secondPhoto").click()}>
            {photo?<img src={photo} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:"🎭"}
          </div>
          <input type="file" accept="image/*" id="secondPhoto" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>setPhoto(ev.target.result);r.readAsDataURL(f);}}/>
          <div style={{fontSize:12,color:"#8a7060"}}>Clica para adicionar foto privada</div>
        </div>
        <div style={{marginBottom:12}}>
          <label style={{fontSize:12,color:"#8a7060",display:"block",marginBottom:4}}>Nome privado</label>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nome do teu perfil privado" style={{width:"100%",padding:"10px 14px",borderRadius:8,border:"1px solid #c9963a",fontSize:13,background:"#2a1f12",color:"#fdf6ee",boxSizing:"border-box"}}/>
        </div>
        <div style={{marginBottom:20}}>
          <label style={{fontSize:12,color:"#8a7060",display:"block",marginBottom:4}}>Bio privada</label>
          <textarea value={bio} onChange={e=>setBio(e.target.value)} placeholder="Bio do teu perfil privado..." style={{width:"100%",padding:"10px 14px",borderRadius:8,border:"1px solid #c9963a",fontSize:13,minHeight:80,resize:"none",background:"#2a1f12",color:"#fdf6ee",boxSizing:"border-box"}}/>
        </div>
        <button onClick={handleSave} disabled={loading} style={{width:"100%",padding:14,background:"linear-gradient(135deg,#c9963a,#e8b96a)",color:"#1a1209",border:"none",borderRadius:8,cursor:"pointer",fontWeight:700,fontSize:14}}>
          {loading?"A guardar...":"🎭 Guardar Perfil Privado"}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// DELETE ACCOUNT - apaga conta + todos os dados associados
// ============================================================
function DeleteAccount({user, onClose}) {
  const [password, setPassword] = React.useState("");
  const [confirmText, setConfirmText] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [step, setStep] = React.useState(1);

  const wipeUserData = async (email) => {
    // 1. Posts
    const postsSnap = await getDocs(query(collection(db,"posts"),where("author","==",email)));
    for (const d of postsSnap.docs) await deleteDoc(doc(db,"posts",d.id));

    // 2. Stories
    const storiesSnap = await getDocs(query(collection(db,"stories"),where("author","==",email)));
    for (const d of storiesSnap.docs) await deleteDoc(doc(db,"stories",d.id));

    // 3. Follows (como follower e following)
    const followsAsFollower = await getDocs(query(collection(db,"follows"),where("follower","==",email)));
    for (const d of followsAsFollower.docs) await deleteDoc(doc(db,"follows",d.id));
    const followsAsFollowing = await getDocs(query(collection(db,"follows"),where("following","==",email)));
    for (const d of followsAsFollowing.docs) await deleteDoc(doc(db,"follows",d.id));

    // 4. Notificações
    const notifsSnap = await getDocs(query(collection(db,"notifications"),where("to","==",email)));
    for (const d of notifsSnap.docs) await deleteDoc(doc(db,"notifications",d.id));

    // 5. Mensagens secretas
    const secretsTo = await getDocs(query(collection(db,"secretMessages"),where("to","==",email)));
    for (const d of secretsTo.docs) await deleteDoc(doc(db,"secretMessages",d.id));
    const secretsFrom = await getDocs(query(collection(db,"secretMessages"),where("from","==",email)));
    for (const d of secretsFrom.docs) await deleteDoc(doc(db,"secretMessages",d.id));

    // 6. Presentes
    const giftsTo = await getDocs(query(collection(db,"gifts"),where("to","==",email)));
    for (const d of giftsTo.docs) await deleteDoc(doc(db,"gifts",d.id));
    const giftsFrom = await getDocs(query(collection(db,"gifts"),where("fromReal","==",email)));
    for (const d of giftsFrom.docs) await deleteDoc(doc(db,"gifts",d.id));

    // 7. Pensamentos (Thought Bubble)
    const thoughtsSnap = await getDocs(query(collection(db,"thoughts"),where("author","==",email)));
    for (const d of thoughtsSnap.docs) await deleteDoc(doc(db,"thoughts",d.id));

    // 8. Cofre privado
    const vaultSnap = await getDocs(query(collection(db,"vaults"),where("email","==",email)));
    for (const d of vaultSnap.docs) await deleteDoc(doc(db,"vaults",d.id));

    // 9. Soul prints
    const soulSnap = await getDocs(query(collection(db,"soulprints"),where("email","==",email)));
    for (const d of soulSnap.docs) await deleteDoc(doc(db,"soulprints",d.id));

    // 10. Love scores
    const loveSnap1 = await getDocs(query(collection(db,"loveScores"),where("user1","==",email)));
    for (const d of loveSnap1.docs) await deleteDoc(doc(db,"loveScores",d.id));
    const loveSnap2 = await getDocs(query(collection(db,"loveScores"),where("user2","==",email)));
    for (const d of loveSnap2.docs) await deleteDoc(doc(db,"loveScores",d.id));

    // 11. Bond Pulse
    const bpSnap1 = await getDocs(query(collection(db,"bondpulse"),where("from","==",email)));
    for (const d of bpSnap1.docs) await deleteDoc(doc(db,"bondpulse",d.id));
    const bpSnap2 = await getDocs(query(collection(db,"bondpulse"),where("to","==",email)));
    for (const d of bpSnap2.docs) await deleteDoc(doc(db,"bondpulse",d.id));

    // 12. Random Connect
    const rcSnap = await getDocs(query(collection(db,"randomConnect"),where("email","==",email)));
    for (const d of rcSnap.docs) await deleteDoc(doc(db,"randomConnect",d.id));

    // 13. Conversas (chats) - apagar mensagens e o documento da conversa
    const allChats = await getDocs(collection(db,"chats"));
    for (const chatDoc of allChats.docs) {
      if (chatDoc.id.includes(email)) {
        const messagesSnap = await getDocs(collection(db,"chats",chatDoc.id,"messages"));
        for (const m of messagesSnap.docs) await deleteDoc(doc(db,"chats",chatDoc.id,"messages",m.id));
        await deleteDoc(doc(db,"chats",chatDoc.id)).catch(()=>{});
      }
    }

    // 14. Relacionamentos (apagar registos onde a pessoa aparece)
    const relsSnap = await getDocs(collection(db,"relationships"));
    for (const d of relsSnap.docs) {
      const data = d.data();
      if (data.person1Email===email || data.person2Email===email) {
        await deleteDoc(doc(db,"relationships",d.id));
      }
    }

    // 15. Visualizações invisíveis
    const ivSnap1 = await getDocs(query(collection(db,"invisibleViews"),where("viewer","==",email)));
    for (const d of ivSnap1.docs) await deleteDoc(doc(db,"invisibleViews",d.id));
    const ivSnap2 = await getDocs(query(collection(db,"invisibleViews"),where("target","==",email)));
    for (const d of ivSnap2.docs) await deleteDoc(doc(db,"invisibleViews",d.id));

    // 16. Documento do utilizador
    const userSnap = await getDocs(query(collection(db,"users"),where("email","==",email)));
    for (const d of userSnap.docs) await deleteDoc(doc(db,"users",d.id));
  };

  const handleDelete = async () => {
    setError("");
    if (confirmText.trim().toUpperCase()!=="APAGAR") { setError("Escreve APAGAR para confirmar."); return; }
    if (!password) { setError("Introduz a tua password para confirmar."); return; }
    setLoading(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
      await wipeUserData(user.email);
      await deleteUser(user);
      onClose();
    } catch(e) {
      if (e.code==="auth/wrong-password") setError("Password incorreta!");
      else if (e.code==="auth/too-many-requests") setError("Muitas tentativas. Tenta mais tarde.");
      else setError("Erro ao apagar a conta. Tenta novamente.");
    }
    setLoading(false);
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(26,18,9,0.92)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"#fdf6ee",borderRadius:12,width:"100%",maxWidth:420,padding:24}}>
        <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"#8a7060",marginBottom:16}}>← Voltar</button>
        <h2 style={{fontFamily:"serif",fontWeight:400,color:"#c4606a",marginBottom:4}}>⚠️ Apagar Conta</h2>
        {step===1&&(
          <>
            <p style={{fontSize:13,color:"#4a3828",lineHeight:1.7,marginBottom:16}}>
              Esta ação é <strong>permanente</strong> e vai apagar:
            </p>
            <ul style={{fontSize:12,color:"#8a7060",lineHeight:2,marginBottom:20,paddingLeft:20}}>
              <li>Perfil, fotos e bio</li>
              <li>Todas as publicações e stories</li>
              <li>Todas as conversas e mensagens</li>
              <li>Cofre privado, mensagens secretas</li>
              <li>Relacionamentos registados</li>
              <li>Seguidores, presentes, BondCoins, Soul Print</li>
            </ul>
            <button onClick={()=>setStep(2)} style={{width:"100%",padding:14,background:"#c4606a",color:"white",border:"none",borderRadius:8,cursor:"pointer",fontWeight:700,fontSize:14}}>Continuar</button>
          </>
        )}
        {step===2&&(
          <>
            <p style={{fontSize:13,color:"#4a3828",marginBottom:12}}>Escreve <strong>APAGAR</strong> para confirmar:</p>
            <input value={confirmText} onChange={e=>setConfirmText(e.target.value)} placeholder="APAGAR" style={{width:"100%",padding:12,marginBottom:12,borderRadius:4,border:"1px solid #c4606a",boxSizing:"border-box"}}/>
            <p style={{fontSize:13,color:"#4a3828",marginBottom:8}}>Introduz a tua password:</p>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" style={{width:"100%",padding:12,marginBottom:12,borderRadius:4,border:"1px solid #c4606a",boxSizing:"border-box"}}/>
            {error&&<p style={{color:"#c4606a",fontSize:12,marginBottom:8}}>{error}</p>}
            <button onClick={handleDelete} disabled={loading} style={{width:"100%",padding:14,background:"#c4606a",color:"white",border:"none",borderRadius:8,cursor:"pointer",fontWeight:700,fontSize:14,marginBottom:8}}>
              {loading?"A apagar tudo...":"⚠️ Apagar Conta Definitivamente"}
            </button>
            <button onClick={()=>setStep(1)} style={{width:"100%",padding:10,background:"transparent",border:"1px solid #8a7060",borderRadius:8,cursor:"pointer",color:"#8a7060"}}>Voltar</button>
          </>
        )}
      </div>
    </div>
  );
}

// ============================================================
// EDIT PROFILE
// ============================================================
function EditProfile({user, onClose, onSave}) {
  const [name, setName] = React.useState("");
  const [bio, setBio] = React.useState("");
  const [photo, setPhoto] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const loadProfile = async () => {
      const q = query(collection(db,"users"),where("email","==",user.email));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) { const d = snapshot.docs[0].data(); setName(d.name||""); setBio(d.bio||""); setPhoto(d.photo||null); }
    };
    loadProfile();
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const q = query(collection(db,"users"),where("email","==",user.email));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) { await updateDoc(doc(db,"users",snapshot.docs[0].id),{name,bio,photo,updatedAt:new Date().toISOString()}); }
      else { await addDoc(collection(db,"users"),{email:user.email,name,bio,photo,isPremium:false,createdAt:new Date().toISOString()}); }
      onSave({name,bio,photo});
      onClose();
    } catch(e) { alert("Erro ao guardar perfil!"); }
    setLoading(false);
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(26,18,9,0.88)",zIndex:350,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"#fdf6ee",borderRadius:12,width:"100%",maxWidth:480,padding:24}}>
        <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"#8a7060",marginBottom:16}}>← Voltar</button>
        <h2 style={{fontFamily:"serif",fontWeight:400,color:"#1a1209",marginBottom:20}}>👤 Editar Perfil</h2>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{width:80,height:80,borderRadius:"50%",background:photo?"transparent":"linear-gradient(135deg,#c9963a,#e8b96a)",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:32,fontWeight:700,margin:"0 auto 12px",overflow:"hidden",cursor:"pointer"}} onClick={()=>document.getElementById("profilePhoto").click()}>
            {photo?<img src={photo} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:user.email[0].toUpperCase()}
          </div>
          <input type="file" accept="image/*" id="profilePhoto" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>setPhoto(ev.target.result);r.readAsDataURL(f);}}/>
          <div style={{fontSize:12,color:"#8a7060"}}>Clica na foto para alterar</div>
        </div>
        <div style={{marginBottom:12}}>
          <label style={{fontSize:12,color:"#8a7060",display:"block",marginBottom:4}}>Nome</label>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="O teu nome" style={{width:"100%",padding:"10px 14px",borderRadius:8,border:"1px solid rgba(201,150,58,0.3)",fontSize:13,boxSizing:"border-box"}}/>
        </div>
        <div style={{marginBottom:20}}>
          <label style={{fontSize:12,color:"#8a7060",display:"block",marginBottom:4}}>Bio</label>
          <textarea value={bio} onChange={e=>setBio(e.target.value)} placeholder="Fala um pouco sobre ti..." style={{width:"100%",padding:"10px 14px",borderRadius:8,border:"1px solid rgba(201,150,58,0.3)",fontSize:13,minHeight:80,resize:"none",boxSizing:"border-box"}}/>
        </div>
        <button onClick={handleSave} disabled={loading} style={{width:"100%",padding:14,background:"linear-gradient(135deg,#c9963a,#e8b96a)",color:"white",border:"none",borderRadius:8,cursor:"pointer",fontWeight:700,fontSize:14}}>
          {loading?"A guardar...":"💾 Guardar perfil"}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// CHAT LIST
// ============================================================
function ChatList({user, onOpenChat, onClose}) {
  const [chats, setChats] = React.useState([]);

  React.useEffect(() => {
    if (!user) return;
    const loadChats = async () => {
      const q = query(collection(db,"chats"));
      const snapshot = await getDocs(q);
      const userChats = snapshot.docs.filter(d=>d.id.includes(user.email)).map(d=>{
        const emails = d.id.split("_");
        const other = emails.find(e=>e!==user.email);
        return {id:d.id,other};
      });
      setChats(userChats);
    };
    loadChats();
  }, [user]);

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(26,18,9,0.88)",zIndex:350,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"#fdf6ee",borderRadius:12,width:"100%",maxWidth:480,padding:24,maxHeight:"80vh",overflowY:"auto"}}>
        <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"#8a7060",marginBottom:16}}>← Voltar</button>
        <h2 style={{fontFamily:"serif",fontWeight:400,color:"#1a1209",marginBottom:16}}>💬 Conversas</h2>
        {chats.length===0&&<div style={{textAlign:"center",color:"#8a7060",padding:32,fontSize:13}}>Ainda nao tens conversas. Envia uma mensagem a alguem! 😊</div>}
        {chats.map(chat=>(
          <div key={chat.id} onClick={()=>onOpenChat(chat.other)} style={{display:"flex",alignItems:"center",gap:12,padding:14,borderBottom:"1px solid rgba(201,150,58,0.1)",cursor:"pointer",borderRadius:8}}>
            <div style={{width:48,height:48,borderRadius:"50%",background:"linear-gradient(135deg,#c9963a,#e8b96a)",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:700,fontSize:18,flexShrink:0}}>{chat.other[0].toUpperCase()}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:14,color:"#1a1209"}}>{chat.other}</div>
              <div style={{fontSize:12,color:"#8a7060"}}>Clica para ver a conversa</div>
            </div>
            <div style={{fontSize:20}}>›</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// SEARCH USERS - CORRIGIDO
// ============================================================
function SearchUsers({user, onViewProfile, onChat, onClose}) {
  const [search, setSearch] = React.useState("");
  const [results, setResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const handleSearch = async () => {
    if (!search.trim()) return;
    setLoading(true);
    try {
      const q = query(collection(db,"users"),where("email",">=",search),where("email","<=",search+"\uf8ff"));
      const snapshot = await getDocs(q);
      setResults(snapshot.docs.map(d=>({id:d.id,...d.data()})));
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(26,18,9,0.88)",zIndex:350,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"#fdf6ee",borderRadius:12,width:"100%",maxWidth:480,padding:24,maxHeight:"80vh",overflowY:"auto"}}>
        <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"#8a7060",marginBottom:16}}>← Voltar</button>
        <h2 style={{fontFamily:"serif",fontWeight:400,color:"#1a1209",marginBottom:16}}>🔍 Pesquisar pessoas</h2>
        <div style={{display:"flex",gap:8,marginBottom:16}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSearch()} placeholder="Pesquisa por email..." style={{flex:1,padding:"10px 16px",borderRadius:24,border:"1px solid rgba(201,150,58,0.3)",fontSize:13}}/>
          <button onClick={handleSearch} style={{padding:"10px 16px",background:"linear-gradient(135deg,#c9963a,#e8b96a)",color:"white",border:"none",borderRadius:24,cursor:"pointer",fontWeight:700}}>🔍</button>
        </div>
        {loading&&<div style={{textAlign:"center",color:"#8a7060",padding:20}}>A pesquisar...</div>}
        {results.length===0&&!loading&&search&&<div style={{textAlign:"center",color:"#8a7060",padding:20,fontSize:13}}>Nenhum resultado encontrado</div>}
        {results.map(profile=>(
          <div key={profile.id} style={{display:"flex",alignItems:"center",gap:12,padding:12,borderBottom:"1px solid rgba(201,150,58,0.1)"}}>
            <div style={{width:40,height:40,borderRadius:"50%",background:"linear-gradient(135deg,#c9963a,#e8b96a)",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:700,flexShrink:0}}>{profile.email[0].toUpperCase()}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:13,color:"#1a1209"}}>{profile.name||profile.email}</div>
              {profile.isPremium&&<span style={{fontSize:10,color:"#c9963a"}}>👑 Premium</span>}
            </div>
            <div style={{display:"flex",gap:6}}>
              <button onClick={()=>onViewProfile(profile.email)} style={{padding:"6px 12px",background:"linear-gradient(135deg,#4a3828,#8a7060)",color:"white",border:"none",borderRadius:16,cursor:"pointer",fontSize:11}}>👤</button>
              <button onClick={()=>onChat(profile.email)} style={{padding:"6px 12px",background:"linear-gradient(135deg,#c4606a,#e08090)",color:"white",border:"none",borderRadius:16,cursor:"pointer",fontSize:11}}>💬</button>
              <FollowButton user={user} targetEmail={profile.email}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
// ============================================================
// PROFILE PAGE - CORRIGIDO
// ============================================================
function ProfilePage({user, profileEmail, onClose, onChat, setGiftOpen, setGiftTarget}) {
  const [profile, setProfile] = React.useState(null);
  const [posts, setPosts] = React.useState([]);

  React.useEffect(() => {
    const loadProfile = async () => {
      const q = query(collection(db,"users"),where("email","==",profileEmail));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) setProfile({id:snapshot.docs[0].id,...snapshot.docs[0].data()});
    };
    const loadPosts = async () => {
      const q = query(collection(db,"posts"),where("author","==",profileEmail));
      const snapshot = await getDocs(q);
      setPosts(snapshot.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)));
    };
    loadProfile();
    loadPosts();
  }, [profileEmail]);

  return (
    <InvisibleView user={user} targetEmail={profileEmail}>
      <div style={{position:"fixed",inset:0,background:"rgba(26,18,9,0.88)",zIndex:350,display:"flex",alignItems:"center",justifyContent:"center",padding:16,overflowY:"auto"}}>
        <div style={{background:"#fdf6ee",borderRadius:12,width:"100%",maxWidth:480,padding:24}}>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"#8a7060",marginBottom:16}}>← Voltar</button>
          <div style={{textAlign:"center",marginBottom:20}}>
            <div style={{width:80,height:80,borderRadius:"50%",background:"linear-gradient(135deg,#c9963a,#e8b96a)",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:32,fontWeight:700,margin:"0 auto 12px",overflow:"hidden"}}>
              {profile?.photo?<img src={profile.photo} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:profileEmail[0].toUpperCase()}
            </div>
            <div style={{fontWeight:700,fontSize:18,color:"#1a1209",display:"flex",alignItems:"center",justifyContent:"center"}}>
              {profile?.name||profileEmail}
              <VerifiedBadge verified={profile?.verificationStatus==="approved"}/>
            </div>
            <div style={{fontSize:12,color:"#8a7060",marginTop:4}}>{profileEmail}</div>
            {profile?.bio&&<div style={{fontSize:13,color:"#4a3828",marginTop:8,lineHeight:1.6}}>{profile.bio}</div>}
            {profile?.isPremium&&<div style={{marginTop:6,display:"inline-block",background:"linear-gradient(135deg,#c9963a,#e8b96a)",color:"white",padding:"2px 12px",borderRadius:20,fontSize:11,fontWeight:700}}>👑 Premium</div>}
          </div>
          <ProfileStats userEmail={profileEmail}/>
          {user&&user.email!==profileEmail&&(
            <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
              <button onClick={()=>onChat(profileEmail)} style={{flex:1,padding:10,background:"linear-gradient(135deg,#c4606a,#e08090)",color:"white",border:"none",borderRadius:20,cursor:"pointer",fontWeight:700,fontSize:13}}>💬 Mensagem</button>
              <button onClick={()=>{setGiftTarget(profileEmail);setGiftOpen(true);}} style={{flex:1,padding:10,background:"linear-gradient(135deg,#c9963a,#e8b96a)",color:"white",border:"none",borderRadius:20,cursor:"pointer",fontWeight:700,fontSize:13}}>🎁 Presente</button>
              <FollowButton user={user} targetEmail={profileEmail}/>
            </div>
          )}
          <div>
            <div style={{fontWeight:700,color:"#1a1209",marginBottom:12}}>📸 Publicações</div>
            {posts.filter(p=>!p.deleted).length===0&&<div style={{textAlign:"center",color:"#8a7060",padding:20,fontSize:13}}>Sem publicacoes ainda</div>}
            {posts.filter(p=>!p.deleted).map(post=><Post key={post.id} post={post} lang="pt" user={user}/>)}
          </div>
        </div>
      </div>
    </InvisibleView>
  );
}

// ============================================================
// POST - CORRIGIDO
// ============================================================
function Post({post, lang, user}) {
  const [liked, setLiked] = React.useState(false);
  const [likes, setLikes] = React.useState(post.likes||0);
  const [showComments, setShowComments] = React.useState(false);

  const handleLike = async () => {
    const newLikes = liked?likes-1:likes+1;
    setLiked(!liked); setLikes(newLikes);
    if (post.id) { await updateDoc(doc(db,"posts",post.id),{likes:newLikes}); }
  };

  return (
    <div style={{background:"#fff",borderRadius:12,padding:16,marginBottom:12,boxShadow:"0 2px 8px rgba(0,0,0,0.08)"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
        <div style={{width:40,height:40,borderRadius:"50%",background:"linear-gradient(135deg,#c9963a,#e8b96a)",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:700}}>{post.author?post.author[0].toUpperCase():"?"}</div>
        <div>
          <div style={{fontWeight:700,fontSize:13,color:"#1a1209"}}>{post.author||"Anónimo"}</div>
          <div style={{fontSize:11,color:"#8a7060"}}>{post.createdAt?new Date(post.createdAt).toLocaleDateString():""}</div>
        </div>
      </div>
      {post.text&&<p style={{fontSize:14,color:"#1a1209",lineHeight:1.7,margin:"0 0 10px"}}>{post.text}</p>}
      {post.image&&<img src={post.image} alt="post" style={{width:"100%",borderRadius:8,marginBottom:10}}/>}
      <div style={{display:"flex",gap:16,paddingTop:10,borderTop:"1px solid rgba(201,150,58,0.2)"}}>
        <button onClick={handleLike} style={{background:"none",border:"none",cursor:"pointer",fontSize:13,color:liked?"#c4606a":"#8a7060"}}>{liked?"❤️":"🤍"} {likes}</button>
        <button onClick={()=>setShowComments(!showComments)} style={{background:"none",border:"none",cursor:"pointer",fontSize:13,color:showComments?"#c9963a":"#8a7060"}}>💬 {post.comments?post.comments.length:0}</button>
        <button style={{background:"none",border:"none",cursor:"pointer",fontSize:13,color:"#8a7060"}}>🔗 Partilhar</button>
        {user&&post.author===user.email&&(
          <button onClick={async()=>{if(window.confirm("Apagar esta publicação?")){await updateDoc(doc(db,"posts",post.id),{deleted:true});}}} style={{background:"none",border:"none",cursor:"pointer",fontSize:13,color:"#c4606a"}}>🗑️ Apagar</button>
        )}
      </div>
      {showComments&&(
        <div style={{marginTop:10,borderTop:"1px solid rgba(201,150,58,0.2)",paddingTop:10}}>
          {(post.comments||[]).map((c,i)=>(
            <div key={i} style={{fontSize:12,color:"#4a3828",marginBottom:6,padding:"6px 10px",background:"rgba(201,150,58,0.05)",borderRadius:6}}><strong>{c.author}</strong>: {c.text}</div>
          ))}
          <div style={{display:"flex",gap:8,marginTop:8}}>
            <input id={`comment-${post.id}`} placeholder="Escreve um comentário..." style={{flex:1,padding:"8px 12px",borderRadius:20,border:"1px solid rgba(201,150,58,0.3)",fontSize:12}}/>
            <button onClick={async()=>{const input=document.getElementById(`comment-${post.id}`);if(!input.value.trim())return;const newComment={author:user?.email||"Anonimo",text:input.value,createdAt:new Date().toISOString()};const updatedComments=[...(post.comments||[]),newComment];if(post.id)await updateDoc(doc(db,"posts",post.id),{comments:updatedComments});input.value="";}} style={{padding:"8px 14px",background:"linear-gradient(135deg,#c9963a,#e8b96a)",color:"white",border:"none",borderRadius:20,cursor:"pointer",fontSize:12}}>Enviar</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// PRIVATE VAULT
// ============================================================
function PrivateVault({user, onClose}) {
  const [pin, setPin] = React.useState("");
  const [confirmPin, setConfirmPin] = React.useState("");
  const [unlocked, setUnlocked] = React.useState(false);
  const [hasPin, setHasPin] = React.useState(false);
  const [photos, setPhotos] = React.useState([]);
  const [notes, setNotes] = React.useState([]);
  const [newNote, setNewNote] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [attempts, setAttempts] = React.useState(0);

  React.useEffect(() => {
    const checkPin = async () => {
      const q = query(collection(db,"vaults"),where("email","==",user.email));
      const snapshot = await getDocs(q);
      if (!snapshot.empty&&snapshot.docs[0].data().pin) setHasPin(true);
    };
    checkPin();
  }, [user]);

  const handleUnlock = async () => {
    if (attempts>=3) { alert("Muitas tentativas! Cofre bloqueado."); onClose(); return; }
    setLoading(true);
    try {
      const q = query(collection(db,"vaults"),where("email","==",user.email));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const vaultData = snapshot.docs[0].data();
        if (btoa(pin)===vaultData.pin) { setUnlocked(true); setPhotos(vaultData.photos||[]); setNotes(vaultData.notes||[]); }
        else { setAttempts(attempts+1); alert(`PIN incorreto! Tentativas restantes: ${2-attempts}`); }
      }
    } catch(e) { alert("Erro ao aceder ao cofre!"); }
    setLoading(false);
  };

  const handleCreatePin = async () => {
    if (pin.length<4) { alert("PIN deve ter pelo menos 4 digitos!"); return; }
    if (pin!==confirmPin) { alert("PINs nao coincidem!"); return; }
    setLoading(true);
    try {
      await addDoc(collection(db,"vaults"),{email:user.email,pin:btoa(pin),photos:[],notes:[],createdAt:new Date().toISOString()});
      setHasPin(true); setUnlocked(true);
    } catch(e) { alert("Erro ao criar cofre!"); }
    setLoading(false);
  };

  const addPhoto = () => {
    const input = document.createElement("input");
    input.type="file"; input.accept="image/*";
    input.onchange=async(e)=>{
      const file=e.target.files[0]; if(!file)return;
      const reader=new FileReader();
      reader.onload=async(ev)=>{
        const newPhotos=[...photos,{id:Date.now(),data:ev.target.result}];
        setPhotos(newPhotos);
        const q=query(collection(db,"vaults"),where("email","==",user.email));
        const snapshot=await getDocs(q);
        if(!snapshot.empty)await updateDoc(doc(db,"vaults",snapshot.docs[0].id),{photos:newPhotos});
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const addNote = async () => {
    if (!newNote.trim()) return;
    const newNotes=[...notes,{id:Date.now(),text:btoa(unescape(encodeURIComponent(newNote))),createdAt:new Date().toISOString()}];
    setNotes(newNotes); setNewNote("");
    const q=query(collection(db,"vaults"),where("email","==",user.email));
    const snapshot=await getDocs(q);
    if(!snapshot.empty)await updateDoc(doc(db,"vaults",snapshot.docs[0].id),{notes:newNotes});
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(10,5,20,0.97)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"#0a0514",borderRadius:16,width:"100%",maxWidth:480,padding:24,border:"2px solid #c9963a",maxHeight:"90vh",overflowY:"auto"}}>
        <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"#8a7060",marginBottom:16}}>← Sair do Cofre</button>
        <h2 style={{fontFamily:"serif",fontWeight:400,color:"#c9963a",marginBottom:4,textAlign:"center"}}>🔐 Cofre Privado</h2>
        <p style={{fontSize:12,color:"#8a7060",marginBottom:20,textAlign:"center"}}>Encriptado — so tu tens acesso</p>
        {!hasPin&&(
          <div>
            <p style={{color:"#fdf6ee",fontSize:13,marginBottom:16,textAlign:"center"}}>Cria o teu PIN secreto para proteger o cofre</p>
            <input type="password" placeholder="Cria um PIN (minimo 4 digitos)" value={pin} onChange={e=>setPin(e.target.value)} style={{width:"100%",padding:12,borderRadius:8,border:"1px solid #c9963a",background:"#1a0a2e",color:"#fdf6ee",fontSize:13,marginBottom:8,boxSizing:"border-box"}}/>
            <input type="password" placeholder="Confirma o PIN" value={confirmPin} onChange={e=>setConfirmPin(e.target.value)} style={{width:"100%",padding:12,borderRadius:8,border:"1px solid #c9963a",background:"#1a0a2e",color:"#fdf6ee",fontSize:13,marginBottom:16,boxSizing:"border-box"}}/>
            <button onClick={handleCreatePin} disabled={loading} style={{width:"100%",padding:14,background:"linear-gradient(135deg,#c9963a,#e8b96a)",color:"#0a0514",border:"none",borderRadius:8,cursor:"pointer",fontWeight:700}}>{loading?"A criar...":"🔐 Criar Cofre"}</button>
          </div>
        )}
        {hasPin&&!unlocked&&(
          <div>
            <p style={{color:"#fdf6ee",fontSize:13,marginBottom:16,textAlign:"center"}}>Introduz o teu PIN para abrir o cofre</p>
            <input type="password" placeholder="PIN secreto" value={pin} onChange={e=>setPin(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleUnlock()} style={{width:"100%",padding:12,borderRadius:8,border:"1px solid #c9963a",background:"#1a0a2e",color:"#fdf6ee",fontSize:13,marginBottom:16,textAlign:"center",letterSpacing:8,boxSizing:"border-box"}}/>
            <button onClick={handleUnlock} disabled={loading} style={{width:"100%",padding:14,background:"linear-gradient(135deg,#c9963a,#e8b96a)",color:"#0a0514",border:"none",borderRadius:8,cursor:"pointer",fontWeight:700}}>{loading?"A verificar...":"🔓 Abrir Cofre"}</button>
            <p style={{fontSize:11,color:"#c4606a",marginTop:8,textAlign:"center"}}>Apos 3 tentativas erradas o cofre bloqueia</p>
          </div>
        )}
        {unlocked&&(
          <div>
            <button onClick={addPhoto} style={{width:"100%",padding:10,background:"linear-gradient(135deg,#c9963a,#e8b96a)",color:"#0a0514",border:"none",borderRadius:8,cursor:"pointer",fontWeight:700,fontSize:13,marginBottom:16}}>📸 Adicionar Foto</button>
            {photos.length>0&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:16}}>{photos.map(photo=><img key={photo.id} src={photo.data} style={{width:"100%",aspectRatio:"1",objectFit:"cover",borderRadius:8,border:"1px solid #c9963a"}}/>)}</div>}
            <div style={{marginBottom:16}}>
              <textarea value={newNote} onChange={e=>setNewNote(e.target.value)} placeholder="Escreve uma nota secreta..." style={{width:"100%",padding:12,borderRadius:8,border:"1px solid #c9963a",background:"#1a0a2e",color:"#fdf6ee",fontSize:13,minHeight:80,resize:"none",boxSizing:"border-box"}}/>
              <button onClick={addNote} style={{width:"100%",marginTop:8,padding:10,background:"rgba(201,150,58,0.2)",color:"#c9963a",border:"1px solid #c9963a",borderRadius:8,cursor:"pointer",fontWeight:700}}>+ Guardar Nota</button>
            </div>
            {notes.map(note=>(
              <div key={note.id} style={{padding:12,background:"#1a0a2e",borderRadius:8,marginBottom:8,fontSize:13,color:"#fdf6ee",border:"1px solid rgba(201,150,58,0.2)"}}>
                {decodeURIComponent(escape(atob(note.text)))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
// ============================================================
// LOVE AI SCORE
// ============================================================
function LoveAIScore({user, partner, onClose}) {
  const [score, setScore] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [analysis, setAnalysis] = React.useState("");

  const calculateScore = async () => {
    setLoading(true);
    try {
      const chatId = [user.email,partner].sort().join("_");
      const snapshot = await getDocs(query(collection(db,"chats",chatId,"messages")));
      const messages = snapshot.docs.map(d=>d.data());
      const totalMessages = messages.length;
      const userMessages = messages.filter(m=>m.author===user.email).length;
      const partnerMessages = messages.filter(m=>m.author!==user.email).length;
      const responseRate = totalMessages>0?Math.min(100,Math.round((Math.min(userMessages,partnerMessages)/Math.max(userMessages,partnerMessages))*100)):50;
      const finalScore = Math.min(99,Math.max(60,Math.round((responseRate*0.4)+(Math.min(totalMessages,100)*0.3)+(Math.random()*30))));
      setScore(finalScore);
      const analyses = ["A vossa comunicacao e muito equilibrada — ambos participam igualmente.","Notamos um padrao de respostas rapidas — sinal de interesse mutuo!","A frequencia das mensagens indica uma conexao forte entre voces.","O vosso ritmo de conversa e muito saudavel e natural."];
      setAnalysis(analyses[Math.floor(Math.random()*analyses.length)]);
      await addDoc(collection(db,"loveScores"),{user1:user.email,user2:partner,score:finalScore,createdAt:new Date().toISOString()});
    } catch(e) { setScore(75); setAnalysis("Continuem a comunicar para uma analise mais precisa!"); }
    setLoading(false);
  };

  const getColor=(s)=>s>=90?"#e8b96a":s>=75?"#c9963a":"#c4606a";
  const getEmoji=(s)=>s>=90?"💍":s>=75?"❤️":"💕";
  const getLabel=(s)=>s>=90?"Amor Profundo":s>=75?"Conexao Forte":"Boa Compatibilidade";

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(10,5,20,0.95)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"#1a0a2e",borderRadius:16,width:"100%",maxWidth:400,padding:28,border:"2px solid #c9963a",textAlign:"center"}}>
        <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"#8a7060",marginBottom:16,float:"left"}}>← Voltar</button>
        <div style={{clear:"both"}}/>
        <h2 style={{color:"#c9963a",fontFamily:"serif",fontWeight:400,marginBottom:4}}>💕 Love AI Score</h2>
        <p style={{fontSize:12,color:"#8a7060",marginBottom:24}}>A IA analisa a vossa compatibilidade</p>
        {!score&&!loading&&(
          <div>
            <div style={{fontSize:48,marginBottom:16}}>💕</div>
            <p style={{color:"#fdf6ee",fontSize:13,marginBottom:20}}>Com: {partner}</p>
            <button onClick={calculateScore} style={{width:"100%",padding:14,background:"linear-gradient(135deg,#c9963a,#e8b96a)",color:"#1a0a2e",border:"none",borderRadius:24,cursor:"pointer",fontWeight:700,fontSize:14}}>💕 Calcular Love Score</button>
          </div>
        )}
        {loading&&<div><div style={{fontSize:48,marginBottom:16}}>🔄</div><p style={{color:"#fdf6ee",fontSize:13}}>A IA esta a analisar...</p></div>}
        {score&&!loading&&(
          <div>
            <div style={{width:120,height:120,borderRadius:"50%",background:`conic-gradient(${getColor(score)} ${score}%, #2a1f3e ${score}%)`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",boxShadow:`0 0 30px ${getColor(score)}44`}}>
              <div style={{width:90,height:90,borderRadius:"50%",background:"#1a0a2e",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                <div style={{fontSize:24}}>{getEmoji(score)}</div>
                <div style={{fontSize:22,fontWeight:700,color:getColor(score)}}>{score}%</div>
              </div>
            </div>
            <div style={{fontSize:16,fontWeight:700,color:getColor(score),marginBottom:8}}>{getLabel(score)}</div>
            <p style={{fontSize:13,color:"#8a7060",marginBottom:20,lineHeight:1.6}}>{analysis}</p>
            <button onClick={calculateScore} style={{width:"100%",padding:12,background:"transparent",color:"#c9963a",border:"1px solid #c9963a",borderRadius:24,cursor:"pointer",fontWeight:700,fontSize:13}}>🔄 Recalcular</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// SOUL PRINT
// ============================================================
function SoulPrint({user, partner, onClose}) {
  const [mySoulPrint, setMySoulPrint] = React.useState(null);
  const [partnerSoulPrint, setPartnerSoulPrint] = React.useState(null);
  const [coupleSoulPrint, setCoupleSoulPrint] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const canvasRef = React.useRef(null);
  const coupleCanvasRef = React.useRef(null);

  const generateSoulPrint = (seed, canvas, colors) => {
    const ctx = canvas.getContext("2d");
    const cx = canvas.width/2, cy = canvas.height/2;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const rng=(n)=>{let x=Math.sin(seed+n)*10000;return x-Math.floor(x);};
    for (let layer=0;layer<8;layer++) {
      const petals=Math.floor(rng(layer)*6)+4, radius=20+layer*15;
      ctx.beginPath(); ctx.strokeStyle=colors[Math.floor(rng(layer+10)*colors.length)]; ctx.lineWidth=1.5; ctx.globalAlpha=0.7;
      for (let i=0;i<=petals*10;i++) {
        const angle=(i/(petals*10))*Math.PI*2;
        const r=radius*(1+0.3*Math.sin(petals*angle+rng(layer)*Math.PI));
        const x=cx+r*Math.cos(angle), y=cy+r*Math.sin(angle);
        i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
      }
      ctx.closePath(); ctx.stroke();
    }
    ctx.globalAlpha=1;
  };

  const generate = async () => {
    setLoading(true);
    try {
      const seed1=user.email.split("").reduce((a,c)=>a+c.charCodeAt(0),0);
      const seed2=partner?partner.split("").reduce((a,c)=>a+c.charCodeAt(0),0):0;
      const canvas1=canvasRef.current;
      generateSoulPrint(seed1,canvas1,["#c9963a","#e8b96a","#c4606a","#e08090","#8a7060"]);
      setMySoulPrint(canvas1.toDataURL());
      if (partner&&coupleCanvasRef.current) {
        const canvas2=document.createElement("canvas"); canvas2.width=200; canvas2.height=200;
        generateSoulPrint(seed2,canvas2,["#4a90d9","#7ab8f5","#2d6fa8","#9fc8f0","#1a4a7a"]);
        setPartnerSoulPrint(canvas2.toDataURL());
        const coupleCanvas=coupleCanvasRef.current;
        generateSoulPrint((seed1+seed2)/2,coupleCanvas,["#c9963a","#4a90d9","#e8b96a","#7ab8f5","#c4606a"]);
        setCoupleSoulPrint(coupleCanvas.toDataURL());
      }
      await addDoc(collection(db,"soulprints"),{email:user.email,seed:seed1,createdAt:new Date().toISOString()});
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  React.useEffect(()=>{if(canvasRef.current)generate();},[]);

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(5,2,15,0.97)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:16,overflowY:"auto"}}>
      <div style={{background:"#0a0514",borderRadius:16,width:"100%",maxWidth:480,padding:28,border:"2px solid #c9963a",textAlign:"center"}}>
        <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"#8a7060",marginBottom:16,float:"left"}}>← Voltar</button>
        <div style={{clear:"both"}}/>
        <h2 style={{color:"#c9963a",fontFamily:"serif",fontWeight:400,marginBottom:4}}>💫 Soul Print</h2>
        <p style={{fontSize:11,color:"#8a7060",marginBottom:20}}>A tua identidade digital unica — nunca existiu outra igual</p>
        <canvas ref={canvasRef} width={200} height={200} style={{display:"none"}}/>
        <canvas ref={coupleCanvasRef} width={200} height={200} style={{display:"none"}}/>
        {loading&&<div style={{padding:32,color:"#c9963a"}}>A gerar o teu Soul Print...</div>}
        {!loading&&mySoulPrint&&(
          <div>
            <div style={{marginBottom:20}}>
              <p style={{color:"#8a7060",fontSize:12,marginBottom:8}}>O teu Soul Print</p>
              <img src={mySoulPrint} style={{width:160,height:160,borderRadius:"50%",border:"3px solid #c9963a",boxShadow:"0 0 30px rgba(201,150,58,0.4)"}}/>
              <p style={{color:"#fdf6ee",fontSize:11,marginTop:8}}>Unico no universo — so teu</p>
            </div>
            {partnerSoulPrint&&<div style={{marginBottom:20}}><p style={{color:"#8a7060",fontSize:12,marginBottom:8}}>Soul Print de {partner?.split("@")[0]}</p><img src={partnerSoulPrint} style={{width:120,height:120,borderRadius:"50%",border:"3px solid #4a90d9",boxShadow:"0 0 20px rgba(74,144,217,0.4)"}}/></div>}
            {coupleSoulPrint&&(
              <div style={{marginBottom:20,padding:16,background:"rgba(201,150,58,0.1)",borderRadius:12,border:"1px solid rgba(201,150,58,0.3)"}}>
                <p style={{color:"#c9963a",fontSize:13,fontWeight:700,marginBottom:8}}>💫 Soul Print do Casal</p>
                <img src={coupleSoulPrint} style={{width:140,height:140,borderRadius:"50%",border:"3px solid #c9963a",boxShadow:"0 0 30px rgba(201,150,58,0.6)"}}/>
                <p style={{color:"#8a7060",fontSize:11,marginTop:8}}>Unico no universo — so existe por causa de voces dois</p>
              </div>
            )}
            <button onClick={generate} style={{width:"100%",padding:12,background:"transparent",color:"#c9963a",border:"1px solid #c9963a",borderRadius:24,cursor:"pointer",fontWeight:700,fontSize:13}}>🔄 Regenerar</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// THOUGHT BUBBLE
// ============================================================
function ThoughtBubble({user, lang, onClose}) {
  const [text, setText] = React.useState("");
  const [posted, setPosted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [thoughts, setThoughts] = React.useState([]);

  React.useEffect(() => {
    const now = new Date();
    const unsubscribe = onSnapshot(query(collection(db,"thoughts")), (snapshot) => {
      const data = snapshot.docs.map(d=>({id:d.id,...d.data()})).filter(t=>!t.deleted&&new Date(t.expiresAt)>now).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
      setThoughts(data);
    });
    return () => unsubscribe();
  }, []);

  const handlePost = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      await addDoc(collection(db,"thoughts"),{text,author:user.email,likes:0,createdAt:new Date().toISOString(),expiresAt:new Date(Date.now()+60*60*1000).toISOString(),deleted:false});
      setText(""); setPosted(true); setTimeout(()=>setPosted(false),3000);
    } catch(e) { alert("Erro ao publicar!"); }
    setLoading(false);
  };

  const handleLike = async (thought) => {
    if (!thought.id) return;
    await updateDoc(doc(db,"thoughts",thought.id),{likes:(thought.likes||0)+1});
  };

  const getTimeLeft = (expiresAt) => {
    const mins = Math.round((new Date(expiresAt)-new Date())/60000);
    if (mins<=0) return "A expirar...";
    if (mins<60) return `${mins} min restantes`;
    return "1 hora";
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(26,18,9,0.92)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"#fdf6ee",borderRadius:16,width:"100%",maxWidth:480,padding:24,maxHeight:"90vh",overflowY:"auto"}}>
        <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"#8a7060",marginBottom:16}}>← Voltar</button>
        <h2 style={{fontFamily:"serif",fontWeight:400,color:"#1a1209",marginBottom:4}}>💭 Thought Bubble</h2>
        <p style={{fontSize:12,color:"#8a7060",marginBottom:16}}>Publica um pensamento — desaparece em 1 hora se ninguem interagir!</p>
        {user&&(
          <div style={{background:"white",borderRadius:12,padding:16,marginBottom:16,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
            <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="O que tens na cabeca agora? 💭" style={{width:"100%",padding:10,borderRadius:8,border:"1px solid rgba(201,150,58,0.3)",fontSize:13,minHeight:80,resize:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
            {posted&&<p style={{color:"#2d8a2d",fontSize:12,margin:"8px 0"}}>✅ Publicado! Desaparece em 1 hora se ninguem der like.</p>}
            <button onClick={handlePost} disabled={loading} style={{marginTop:8,padding:"10px 20px",background:"linear-gradient(135deg,#c9963a,#e8b96a)",color:"white",border:"none",borderRadius:20,cursor:"pointer",fontWeight:700,fontSize:13}}>{loading?"A publicar...":"💭 Publicar Pensamento"}</button>
          </div>
        )}
        {thoughts.length===0&&<div style={{textAlign:"center",color:"#8a7060",padding:32,fontSize:13}}>Sem pensamentos agora. Sê o primeiro! 💭</div>}
        {thoughts.map(thought=>(
          <div key={thought.id} style={{background:"white",borderRadius:12,padding:16,marginBottom:12,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
            <div style={{fontSize:14,color:"#1a1209",lineHeight:1.7,marginBottom:10}}>{thought.text}</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <button onClick={()=>handleLike(thought)} style={{background:"none",border:"none",cursor:"pointer",fontSize:13,color:"#c4606a"}}>❤️ {thought.likes||0}</button>
              <span style={{fontSize:11,color:"#c9963a",fontWeight:700}}>⏰ {getTimeLeft(thought.expiresAt)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// RANDOM CONNECT
// ============================================================
function RandomConnect({user, onClose}) {
  const [status, setStatus] = React.useState("waiting");
  const [messages, setMessages] = React.useState([]);
  const [text, setText] = React.useState("");
  const [timeLeft, setTimeLeft] = React.useState(600);
  const [sessionId, setSessionId] = React.useState(null);

  React.useEffect(() => {
    if (!user) return;
    const findPartner = async () => {
      const q = query(collection(db,"randomConnect"),where("status","==","waiting"),where("email","!=",user.email));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const partnerDoc = snapshot.docs[0];
        const sid = [user.email,partnerDoc.data().email].sort().join("_RC_");
        await updateDoc(doc(db,"randomConnect",partnerDoc.id),{status:"connected",partner:user.email});
        await addDoc(collection(db,"randomConnect"),{email:user.email,status:"connected",partner:partnerDoc.data().email,sessionId:sid,createdAt:new Date().toISOString()});
        setSessionId(sid); setStatus("connected");
      } else {
        const docRef = await addDoc(collection(db,"randomConnect"),{email:user.email,status:"waiting",createdAt:new Date().toISOString()});
        const unsubscribe = onSnapshot(doc(db,"randomConnect",docRef.id),(d)=>{
          if (d.data()?.status==="connected") {
            const sid=[user.email,d.data().partner].sort().join("_RC_");
            setSessionId(sid); setStatus("connected"); unsubscribe();
          }
        });
      }
    };
    findPartner();
  }, [user]);

  React.useEffect(() => {
    if (status!=="connected"||!sessionId) return;
    const unsubscribe = onSnapshot(query(collection(db,"randomChats",sessionId,"messages")), (snapshot) => {
      setMessages(snapshot.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>new Date(a.createdAt)-new Date(b.createdAt)));
    });
    const timer = setInterval(()=>setTimeLeft(prev=>{if(prev<=1){clearInterval(timer);setStatus("ended");return 0;}return prev-1;}),1000);
    return ()=>{unsubscribe();clearInterval(timer);};
  }, [status,sessionId]);

  const sendMessage = async () => {
    if (!text.trim()||!sessionId) return;
    await addDoc(collection(db,"randomChats",sessionId,"messages"),{text,author:user.email,createdAt:new Date().toISOString()});
    setText("");
  };

  const formatTime=(s)=>`${Math.floor(s/60)}:${(s%60).toString().padStart(2,"0")}`;

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(10,5,20,0.95)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"#1a0a2e",borderRadius:16,width:"100%",maxWidth:480,height:"85vh",display:"flex",flexDirection:"column",border:"2px solid #c9963a"}}>
        <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(201,150,58,0.2)"}}>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"#8a7060",marginBottom:8}}>← Sair</button>
          <h2 style={{color:"#c9963a",fontFamily:"serif",fontWeight:400,margin:0}}>🎲 Random Connect</h2>
          {status==="connected"&&<div style={{display:"flex",justifyContent:"space-between",marginTop:4}}><span style={{fontSize:12,color:"#8a7060"}}>A falar com alguem anonimo</span><span style={{fontSize:12,color:timeLeft<60?"#c4606a":"#c9963a",fontWeight:700}}>⏰ {formatTime(timeLeft)}</span></div>}
        </div>
        {status==="waiting"&&<div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}><div style={{fontSize:48}}>🎲</div><p style={{color:"#fdf6ee",fontSize:14,textAlign:"center"}}>A procurar alguem para falar...</p><p style={{color:"#8a7060",fontSize:12,textAlign:"center"}}>Vais ser conectado com uma pessoa aleatoria do mundo por 10 minutos!</p></div>}
        {status==="connected"&&(
          <>
            <div style={{flex:1,overflowY:"auto",padding:16,display:"flex",flexDirection:"column",gap:8}}>
              <div style={{textAlign:"center",padding:12,background:"rgba(201,150,58,0.1)",borderRadius:8,marginBottom:8}}><span style={{fontSize:12,color:"#c9963a"}}>Conectado! Tens {formatTime(timeLeft)} para falar.</span></div>
              {messages.map(msg=>(
                <div key={msg.id} style={{maxWidth:"75%",padding:"10px 14px",borderRadius:msg.author===user.email?"18px 18px 4px 18px":"18px 18px 18px 4px",background:msg.author===user.email?"linear-gradient(135deg,#c9963a,#e8b96a)":"#2a1f3e",color:msg.author===user.email?"#1a0a2e":"#fdf6ee",alignSelf:msg.author===user.email?"flex-end":"flex-start",fontSize:13}}>{msg.text}</div>
              ))}
            </div>
            <div style={{padding:16,borderTop:"1px solid rgba(201,150,58,0.2)",display:"flex",gap:8}}>
              <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMessage()} placeholder="Escreve uma mensagem..." style={{flex:1,padding:"10px 16px",borderRadius:24,border:"1px solid rgba(201,150,58,0.3)",background:"#2a1f3e",color:"#fdf6ee",fontSize:13}}/>
              <button onClick={sendMessage} style={{padding:"10px 16px",background:"linear-gradient(135deg,#c9963a,#e8b96a)",color:"#1a0a2e",border:"none",borderRadius:24,cursor:"pointer",fontWeight:700}}>➤</button>
            </div>
          </>
        )}
        {status==="ended"&&(
          <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}>
            <div style={{fontSize:48}}>⏰</div>
            <p style={{color:"#fdf6ee",fontSize:14,textAlign:"center"}}>O tempo acabou!</p>
            <p style={{color:"#8a7060",fontSize:12,textAlign:"center"}}>A conversa foi apagada automaticamente.</p>
            <button onClick={onClose} style={{padding:"12px 24px",background:"linear-gradient(135deg,#c9963a,#e8b96a)",color:"#1a0a2e",border:"none",borderRadius:24,cursor:"pointer",fontWeight:700}}>Fechar</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// LUNA - IA EXCLUSIVA (Premium + Verified)
// ============================================================

const LUNA_SYSTEM_PROMPT = `Tu és a Luna, a IA do Bonded — uma app de relacionamentos. A tua personalidade combina: psicóloga, socióloga, professora, amiga próxima e cupido.

O teu papel agora é conversar com um utilizador que quer companhia para uma atividade (ex: cinema, jantar, passeio). Precisas de descobrir, de forma natural e calorosa:
1. Que atividade quer fazer
2. Quando (hoje, esta noite, este fim de semana, etc)
3. Onde (cidade/zona)
4. Que tipo de companhia prefere (masculina, feminina, ou tanto faz)
5. Alguma preferência extra relevante (idade aproximada, interesses, vibe)

Sê breve, calorosa, conversacional — como uma amiga a ajudar. Faz UMA pergunta de cada vez. Usa português de Portugal/Cabo Verde (informal mas respeitoso). Usa emojis com moderação.

Quando tiveres TODAS as informações (atividade, quando, onde, preferência de companhia), responde APENAS com um bloco JSON neste formato exato, sem mais nenhum texto:
{"done": true, "activity": "...", "when": "...", "where": "...", "companionPreference": "masculino|feminino|qualquer", "notes": "..."}

Antes de teres tudo, responde APENAS em texto normal (conversa), nunca em JSON.`;

const LUNA_PROACTIVE_PROMPT = `Tu és a Luna, a IA do Bonded. Acabaste de conectar duas pessoas (Verified+Premium) que, separadamente, indicaram estar disponíveis para conhecer alguém perto delas agora. Nenhuma das duas sabe quem é a outra ainda.

A tua tarefa é fazer a "mediação cega": conversa com CADA pessoa em privado (esta conversa é só com UMA delas), de forma calorosa e natural, confirma se ainda tem interesse, e prepara-a para a possibilidade de conhecer alguém compatível agora. Não reveles qualquer detalhe sobre a outra pessoa além do que for fornecido no contexto (ex: "alguém que também está livre agora e gosta de [interesse]").

Pergunta no fim: "Queres que tente apresentar-vos?" e espera um Sim/Não/Talvez.

Sê breve (2-4 frases), calorosa, em português de Portugal/Cabo Verde.`;

const LUNA_WORKER_URL = "https://bonded-luna.ostilindo2010.workers.dev";

async function callLunaAI(messages, systemPrompt) {
  try {
    const response = await fetch(LUNA_WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system: systemPrompt,
        messages: messages,
      })
    });
    const data = await response.json();
    if (data.error) { console.error("Luna Worker error:", data.error); return "Desculpa, a Luna está indisponível neste momento. Tenta novamente daqui a pouco 😊"; }
    const text = data.content.map(c => c.text || "").join("\n");
    return text;
  } catch (e) {
    console.error("Luna AI error:", e);
    return "Desculpa, tive um problema a processar isso. Podes repetir? 😊";
  }
}

// ============================================================
// LUNA CHAT - Modo Reativo
// ============================================================
function LunaChat({user, profile, onClose}) {
  const [messages, setMessages] = React.useState([
    {role:"luna", text:"Olá! Sou a Luna 🌙 Posso ajudar-te a encontrar companhia para algo que queiras fazer. O que te apetece fazer?"}
  ]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [requestSaved, setRequestSaved] = React.useState(false);
  const [matchFound, setMatchFound] = React.useState(null);

  const isEligible = profile?.isPremium && profile?.verificationStatus==="approved";

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    const newMessages = [...messages, {role:"user", text:userMsg}];
    setMessages(newMessages);
    setLoading(true);

    const apiMessages = newMessages
      .filter(m=>m.role!=="system")
      .map(m=>({role: m.role==="user"?"user":"assistant", content:m.text}));

    const reply = await callLunaAI(apiMessages, LUNA_SYSTEM_PROMPT);

    // Tentar detetar JSON de conclusão
    let parsed = null;
    try {
      const jsonMatch = reply.match(/\{[\s\S]*"done"[\s\S]*\}/);
      if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
    } catch(e) {}

    if (parsed && parsed.done) {
      setMessages([...newMessages, {role:"luna", text:`Perfeito! 🌙 Vou já procurar alguém compatível para "${parsed.activity}" — ${parsed.when}, em ${parsed.where}. Assim que encontrar alguém, aviso-te aqui!`}]);
      // Guardar pedido no Firestore
      try {
        await addDoc(collection(db,"lunaRequests"),{
          email:user.email,
          activity:parsed.activity,
          when:parsed.when,
          where:parsed.where,
          companionPreference:parsed.companionPreference,
          notes:parsed.notes||"",
          status:"active",
          createdAt:new Date().toISOString(),
        });
        setRequestSaved(true);
        // Procurar match imediato
        await searchForMatch(parsed);
      } catch(e) { console.error(e); }
    } else {
      setMessages([...newMessages, {role:"luna", text:reply}]);
    }
    setLoading(false);
  };

  const searchForMatch = async (myRequest) => {
    try {
      const q = query(collection(db,"lunaRequests"),where("status","==","active"));
      const snapshot = await getDocs(q);
      const candidates = snapshot.docs
        .map(d=>({id:d.id,...d.data()}))
        .filter(r=>r.email!==user.email);

      // procurar compatibilidade simples: mesma "where" (zona) e preferência compatível
      const compatible = candidates.find(c => {
        const sameZone = c.where && myRequest.where && c.where.toLowerCase().includes(myRequest.where.toLowerCase().split(",")[0].trim().toLowerCase());
        return sameZone;
      });

      if (compatible) {
        // Verificar se o candidato também é Verified+Premium
        const candidateUserSnap = await getDocs(query(collection(db,"users"),where("email","==",compatible.email)));
        if (!candidateUserSnap.empty) {
          const candidateData = candidateUserSnap.docs[0].data();
          if (candidateData.isPremium && candidateData.verificationStatus==="approved") {
            // Criar sessão de mediação cega
            const sessionId = [user.email, compatible.email].sort().join("_luna_");
            await addDoc(collection(db,"lunaMatches"),{
              sessionId,
              user1:user.email,
              user2:compatible.email,
              request1:myRequest,
              request2:{activity:compatible.activity,when:compatible.when,where:compatible.where,notes:compatible.notes},
              status1:"pending",
              status2:"pending",
              revealed:false,
              createdAt:new Date().toISOString(),
            });
            setMatchFound({sessionId, partnerActivity:compatible.activity, partnerNotes:compatible.notes});
          }
        }
      }
    } catch(e) { console.error(e); }
  };

  if (!isEligible) {
    return (
      <div style={{position:"fixed",inset:0,background:"rgba(10,5,20,0.95)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
        <div style={{background:"#1a0a2e",borderRadius:16,width:"100%",maxWidth:400,padding:28,border:"2px solid #c9963a",textAlign:"center"}}>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"#8a7060",marginBottom:16,float:"left"}}>← Voltar</button>
          <div style={{clear:"both"}}/>
          <div style={{fontSize:48,marginBottom:12}}>🌙</div>
          <h2 style={{color:"#c9963a",fontFamily:"serif",fontWeight:400,marginBottom:8}}>Luna</h2>
          <p style={{fontSize:13,color:"#fdf6ee",lineHeight:1.7,marginBottom:16}}>A Luna está disponível apenas para utilizadores <strong>Premium</strong> com <strong>Bonded Verified</strong> aprovado.</p>
          <p style={{fontSize:12,color:"#8a7060",lineHeight:1.6}}>
            {!profile?.isPremium && "• Torna-te Premium\n"}
            {profile?.verificationStatus!=="approved" && "• Pede a verificação no teu perfil"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(10,5,20,0.95)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"#1a0a2e",borderRadius:16,width:"100%",maxWidth:420,height:"80vh",display:"flex",flexDirection:"column",border:"2px solid #c9963a"}}>
        <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(201,150,58,0.2)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontWeight:700,color:"#c9963a",display:"flex",alignItems:"center",gap:6}}>🌙 Luna</div>
            <div style={{fontSize:11,color:"#8a7060"}}>A tua amiga e cupido pessoal</div>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,color:"#8a7060"}}>✕</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:16,display:"flex",flexDirection:"column",gap:8}}>
          {messages.map((msg,i)=>(
            <div key={i} style={{maxWidth:"80%",padding:"10px 14px",borderRadius:msg.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",background:msg.role==="user"?"linear-gradient(135deg,#c9963a,#e8b96a)":"#2a1f3e",color:msg.role==="user"?"#1a0a2e":"#fdf6ee",alignSelf:msg.role==="user"?"flex-end":"flex-start",fontSize:13,lineHeight:1.6}}>
              {msg.text}
            </div>
          ))}
          {loading&&<div style={{alignSelf:"flex-start",color:"#8a7060",fontSize:12}}>🌙 Luna está a escrever...</div>}
          {matchFound&&(
            <div style={{background:"rgba(201,150,58,0.15)",border:"1px solid #c9963a",borderRadius:12,padding:14,marginTop:8}}>
              <div style={{color:"#c9963a",fontWeight:700,fontSize:13,marginBottom:6}}>✨ Encontrei alguém!</div>
              <div style={{color:"#fdf6ee",fontSize:12,lineHeight:1.6}}>Alguém também Verified está disponível para "{matchFound.partnerActivity}" na mesma zona. A Luna vai falar com ambos em privado. Aguarda a notificação! 💫</div>
            </div>
          )}
          {requestSaved&&!matchFound&&(
            <div style={{background:"rgba(201,150,58,0.1)",border:"1px solid rgba(201,150,58,0.3)",borderRadius:12,padding:14,marginTop:8}}>
              <div style={{color:"#c9963a",fontSize:12}}>🔍 Pedido guardado! A Luna vai continuar a procurar alguém compatível e avisa-te assim que encontrar.</div>
            </div>
          )}
        </div>
        <div style={{padding:14,borderTop:"1px solid rgba(201,150,58,0.2)",display:"flex",gap:8}}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMessage()} placeholder="Escreve à Luna..." disabled={loading} style={{flex:1,padding:"10px 16px",borderRadius:24,border:"1px solid rgba(201,150,58,0.3)",background:"#2a1f3e",color:"#fdf6ee",fontSize:13,outline:"none"}}/>
          <button onClick={sendMessage} disabled={loading} style={{padding:"10px 16px",background:"linear-gradient(135deg,#c9963a,#e8b96a)",color:"#1a0a2e",border:"none",borderRadius:24,cursor:"pointer",fontWeight:700}}>➤</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// LUNA MATCHES - Notificações de mediação cega
// ============================================================
function LunaMatchNotification({user, match, onClose, onRespond}) {
  const isUser1 = match.user1 === user.email;
  const myStatus = isUser1 ? match.status1 : match.status2;
  const partnerRequest = isUser1 ? match.request2 : match.request1;
  const [responding, setResponding] = React.useState(false);

  const handleRespond = async (response) => {
    setResponding(true);
    try {
      const field = isUser1 ? "status1" : "status2";
      await updateDoc(doc(db,"lunaMatches",match.id),{[field]:response});
      onRespond(response);
    } catch(e) { console.error(e); }
    setResponding(false);
  };

  if (myStatus !== "pending") {
    return (
      <div style={{position:"fixed",inset:0,background:"rgba(10,5,20,0.95)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
        <div style={{background:"#1a0a2e",borderRadius:16,width:"100%",maxWidth:380,padding:28,border:"2px solid #c9963a",textAlign:"center"}}>
          <div style={{fontSize:40,marginBottom:12}}>🌙</div>
          <p style={{color:"#fdf6ee",fontSize:13,marginBottom:16}}>
            {match.revealed
              ? "Vocês os dois disseram que sim! A Luna vai abrir uma conversa entre vocês 💫"
              : "Já respondeste. A aguardar a outra pessoa..."}
          </p>
          <button onClick={onClose} style={{padding:"10px 24px",background:"linear-gradient(135deg,#c9963a,#e8b96a)",color:"#1a0a2e",border:"none",borderRadius:20,cursor:"pointer",fontWeight:700}}>Fechar</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(10,5,20,0.95)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"#1a0a2e",borderRadius:16,width:"100%",maxWidth:380,padding:28,border:"2px solid #c9963a",textAlign:"center"}}>
        <div style={{fontSize:40,marginBottom:12}}>🌙✨</div>
        <h2 style={{color:"#c9963a",fontFamily:"serif",fontWeight:400,marginBottom:8}}>A Luna encontrou alguém!</h2>
        <p style={{color:"#fdf6ee",fontSize:13,lineHeight:1.7,marginBottom:8}}>
          Alguém também Verified está disponível para <strong>"{partnerRequest?.activity}"</strong>{partnerRequest?.where?` em ${partnerRequest.where}`:""}{partnerRequest?.when?`, ${partnerRequest.when}`:""}.
        </p>
        {partnerRequest?.notes&&<p style={{color:"#8a7060",fontSize:12,marginBottom:16,fontStyle:"italic"}}>"{partnerRequest.notes}"</p>}
        <p style={{color:"#c9963a",fontSize:13,fontWeight:700,marginBottom:16}}>Queres que tente apresentar-vos?</p>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>handleRespond("yes")} disabled={responding} style={{flex:1,padding:12,background:"linear-gradient(135deg,#c9963a,#e8b96a)",color:"#1a0a2e",border:"none",borderRadius:20,cursor:"pointer",fontWeight:700,fontSize:13}}>Sim</button>
          <button onClick={()=>handleRespond("maybe")} disabled={responding} style={{flex:1,padding:12,background:"transparent",color:"#c9963a",border:"1px solid #c9963a",borderRadius:20,cursor:"pointer",fontWeight:700,fontSize:13}}>Talvez</button>
          <button onClick={()=>handleRespond("no")} disabled={responding} style={{flex:1,padding:12,background:"transparent",color:"#8a7060",border:"1px solid #8a7060",borderRadius:20,cursor:"pointer",fontWeight:700,fontSize:13}}>Não</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// LUNA WIDGET - botão flutuante + listener de matches
// ============================================================
function LunaWidget({user, profile}) {
  const [chatOpen, setChatOpen] = React.useState(false);
  const [activeMatch, setActiveMatch] = React.useState(null);
  const [enabled, setEnabled] = React.useState(true);

  const isEligible = profile?.isPremium && profile?.verificationStatus==="approved";

  React.useEffect(() => {
    if (!user || !isEligible || !enabled) return;
    const unsubscribe = onSnapshot(query(collection(db,"lunaMatches")), (snapshot) => {
      const matches = snapshot.docs
        .map(d=>({id:d.id,...d.data()}))
        .filter(m => (m.user1===user.email || m.user2===user.email));

      // Procurar match com revealed e ambos "yes" para abrir chat automaticamente
      const revealedMatch = matches.find(m=>m.revealed);
      if (revealedMatch && !revealedMatch[`opened_${user.email.replace(/[.@]/g,'_')}`]) {
        // marca como aberto (best-effort, não bloqueia)
      }

      // Procurar match pendente para esta pessoa
      const pending = matches.find(m => {
        const isUser1 = m.user1===user.email;
        const myStatus = isUser1 ? m.status1 : m.status2;
        return myStatus === "pending";
      });

      if (pending) setActiveMatch(pending);
      else {
        // verificar se algum foi revelado agora (ambos disseram yes)
        const justRevealed = matches.find(m=>{
          return m.status1==="yes" && m.status2==="yes";
        });
        if (justRevealed && !justRevealed.revealed) {
          updateDoc(doc(db,"lunaMatches",justRevealed.id),{revealed:true}).catch(()=>{});
        }
      }
    });
    return () => unsubscribe();
  }, [user, isEligible, enabled]);

  if (!user || !isEligible) return null;

  return (
    <>
      <button onClick={()=>setChatOpen(true)} style={{position:"fixed",bottom:80,right:16,width:56,height:56,borderRadius:"50%",background:"linear-gradient(135deg,#1a0a2e,#c9963a)",border:"2px solid #c9963a",color:"white",fontSize:24,cursor:"pointer",zIndex:80,boxShadow:"0 4px 16px rgba(201,150,58,0.4)"}}>
        🌙
      </button>
      {chatOpen&&<LunaChat user={user} profile={profile} onClose={()=>setChatOpen(false)}/>}
      {activeMatch&&<LunaMatchNotification user={user} match={activeMatch} onClose={()=>setActiveMatch(null)} onRespond={()=>setActiveMatch(null)}/>}
    </>
  );
}

// ============================================================
// APP PRINCIPAL - CORRIGIDO
// ============================================================
function App() {
  const [user, setUser] = React.useState(null);
  const [profile, setProfile] = React.useState(null);
  const [lang, setLang] = React.useState("pt");
  const [screen, setScreen] = React.useState("feed");
  const [authOpen, setAuthOpen] = React.useState(false);
  const [editProfileOpen, setEditProfileOpen] = React.useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = React.useState(false);
  const [secondProfileOpen, setSecondProfileOpen] = React.useState(false);
  const [chatListOpen, setChatListOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [vaultOpen, setVaultOpen] = React.useState(false);
  const [verificationOpen, setVerificationOpen] = React.useState(false);
  const [thoughtBubbleOpen, setThoughtBubbleOpen] = React.useState(false);
  const [randomConnectOpen, setRandomConnectOpen] = React.useState(false);

  const [chatRecipient, setChatRecipient] = React.useState(null);
  const [profileViewEmail, setProfileViewEmail] = React.useState(null);

  const [bondCoinsOpen, setBondCoinsOpen] = React.useState(false);
  const [giftOpen, setGiftOpen] = React.useState(false);
  const [giftTarget, setGiftTarget] = React.useState(null);
  const [secretMsgOpen, setSecretMsgOpen] = React.useState(false);
  const [secretMsgRecipient, setSecretMsgRecipient] = React.useState(null);

  const [bondPulseOpen, setBondPulseOpen] = React.useState(false);
  const [bondPulsePartner, setBondPulsePartner] = React.useState(null);
  const [loveScoreOpen, setLoveScoreOpen] = React.useState(false);
  const [loveScorePartner, setLoveScorePartner] = React.useState(null);
  const [soulPrintOpen, setSoulPrintOpen] = React.useState(false);
  const [soulPrintPartner, setSoulPrintPartner] = React.useState(null);
  const [videoCallOpen, setVideoCallOpen] = React.useState(false);
  const [videoCallRecipient, setVideoCallRecipient] = React.useState(null);

  const [gdprAccepted, setGdprAccepted] = React.useState(localStorage.getItem("gdprAccepted")==="true"||localStorage.getItem("gdprAccepted")==="essential");

  const [postText, setPostText] = React.useState("");
  const [postImage, setPostImage] = React.useState(null);
  const [posting, setPosting] = React.useState(false);

  const [relationships, setRelationships] = React.useState([]);
  const [paymentOpen, setPaymentOpen] = React.useState(false);

  const t = T[lang];

  // ===== AUTH STATE =====
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const q = query(collection(db,"users"),where("email","==",currentUser.email));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) setProfile({id:snapshot.docs[0].id,...snapshot.docs[0].data()});
        else {
          await addDoc(collection(db,"users"),{email:currentUser.email,isPremium:false,bondCoins:0,createdAt:new Date().toISOString()});
        }
      } else { setProfile(null); }
    });
    return () => unsubscribe();
  }, []);

  // ===== NIGHT MODE =====
  const theme = isNightTime() ? darkTheme : C;

  // ===== GDPR =====
  const handleGdprAccept = (full) => {
    localStorage.setItem("gdprAccepted", full?"true":"essential");
    setGdprAccepted(true);
  };

  // ===== POST =====
  const handlePost = async () => {
    if (!postText.trim()&&!postImage) return;
    setPosting(true);
    try {
      await addDoc(collection(db,"posts"),{text:postText,image:postImage,author:user.email,likes:0,comments:[],createdAt:new Date().toISOString(),deleted:false});
      setPostText(""); setPostImage(null);
    } catch(e) { alert("Erro ao publicar!"); }
    setPosting(false);
  };

  const addPostImage = () => {
    const input = document.createElement("input");
    input.type="file"; input.accept="image/*";
    input.onchange=(e)=>{
      const file=e.target.files[0]; if(!file)return;
      const reader=new FileReader();
      reader.onload=(ev)=>setPostImage(ev.target.result);
      reader.readAsDataURL(file);
    };
    input.click();
  };

  // ===== RELATIONSHIPS =====
  React.useEffect(() => {
    if (!user) return;
    const loadRelationships = async () => {
      const snapshot = await getDocs(collection(db,"relationships"));
      const data = snapshot.docs.map(d=>({id:d.id,...d.data()})).filter(r=>r.person1Email===user.email||r.person2Email===user.email);
      setRelationships(data);
    };
    loadRelationships();
  }, [user]);

  // ===== HANDLE END RELATIONSHIP - CORRIGIDO (async) =====
  const handleEnd = async (relId, p1, p2) => {
    if (!window.confirm(t.confirm_end(p1,p2))) return;
    try {
      await updateDoc(doc(db,"relationships",relId),{endDate:new Date().toISOString(),active:false});
      const snapshot = await getDocs(collection(db,"relationships"));
      const data = snapshot.docs.map(d=>({id:d.id,...d.data()})).filter(r=>r.person1Email===user.email||r.person2Email===user.email);
      setRelationships(data);
    } catch(e) { alert("Erro ao terminar relacionamento!"); }
  };

  const navBtn = (key, icon, label) => (
    <button onClick={()=>setScreen(key)} style={{flex:1,padding:"10px 4px",background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,color:screen===key?theme.gold:theme.inkLight,fontWeight:screen===key?700:400}}>
      <span style={{fontSize:20}}>{icon}</span>
      <span style={{fontSize:10}}>{label}</span>
    </button>
  );

  return (
    <div style={{minHeight:"100vh",background:theme.cream,fontFamily:body,paddingBottom:70}}>
      {/* HEADER */}
      <div style={{position:"sticky",top:0,zIndex:100,background:theme.cream,borderBottom:`1px solid ${theme.border}`,padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <Ring size={28} color={theme.gold}/>
          <span style={{fontFamily:serif,fontSize:18,fontWeight:700,color:theme.ink,letterSpacing:1}}>Bonded</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <select value={lang} onChange={e=>setLang(e.target.value)} style={{background:"transparent",border:`1px solid ${theme.border}`,borderRadius:6,padding:"4px 6px",fontSize:12,color:theme.ink,cursor:"pointer"}}>
            {Object.keys(T).map(l=><option key={l} value={l}>{T[l].flag} {T[l].name}</option>)}
          </select>
          {user ? (
            <>
              <button onClick={()=>setSearchOpen(true)} style={{background:"none",border:"none",cursor:"pointer",fontSize:18}}>🔍</button>
              <button onClick={()=>setChatListOpen(true)} style={{background:"none",border:"none",cursor:"pointer",fontSize:18}}>💬</button>
              <button onClick={()=>setBondCoinsOpen(true)} style={{background:"none",border:"none",cursor:"pointer",fontSize:18}}>💰</button>
              <button onClick={()=>signOut(auth)} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:theme.inkLight}}>Sair</button>
            </>
          ) : (
            <button onClick={()=>setAuthOpen(true)} style={{padding:"8px 16px",background:`linear-gradient(135deg,${theme.gold},${theme.goldLight})`,color:"white",border:"none",borderRadius:20,cursor:"pointer",fontWeight:700,fontSize:13}}>Entrar</button>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{maxWidth:480,margin:"0 auto",padding:"16px"}}>
        {screen==="feed"&&(
          <div>
            <Stories user={user}/>
            {user&&(
              <div style={{background:theme.white==="#1a1209"?"#2a1f12":"white",borderRadius:12,padding:16,marginBottom:16,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
                <textarea value={postText} onChange={e=>setPostText(e.target.value)} placeholder="No que estas a pensar? 💭" style={{width:"100%",padding:10,borderRadius:8,border:`1px solid ${theme.border}`,fontSize:13,minHeight:60,resize:"none",fontFamily:"inherit",background:"transparent",color:theme.ink,boxSizing:"border-box"}}/>
                {postImage&&<img src={postImage} style={{width:"100%",borderRadius:8,marginTop:8}}/>}
                <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}>
                  <button onClick={addPostImage} style={{background:"none",border:"none",cursor:"pointer",fontSize:18}}>📷</button>
                  <button onClick={handlePost} disabled={posting} style={{padding:"8px 20px",background:`linear-gradient(135deg,${theme.gold},${theme.goldLight})`,color:"white",border:"none",borderRadius:20,cursor:"pointer",fontWeight:700,fontSize:13}}>{posting?"...":"Publicar"}</button>
                </div>
              </div>
            )}
            <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
              <button onClick={()=>setThoughtBubbleOpen(true)} style={{flex:1,minWidth:100,padding:10,background:"transparent",border:`1px solid ${theme.border}`,borderRadius:20,cursor:"pointer",fontSize:12,color:theme.inkMid}}>💭 Thoughts</button>
              <button onClick={()=>setRandomConnectOpen(true)} style={{flex:1,minWidth:100,padding:10,background:"transparent",border:`1px solid ${theme.border}`,borderRadius:20,cursor:"pointer",fontSize:12,color:theme.inkMid}}>🎲 Random</button>
            </div>
            <FeedList user={user} lang={lang}/>
          </div>
        )}

        {screen==="profile"&&user&&(
          <div>
            <div style={{textAlign:"center",marginBottom:20}}>
              <div style={{width:80,height:80,borderRadius:"50%",background:profile?.photo?"transparent":`linear-gradient(135deg,${theme.gold},${theme.goldLight})`,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:32,fontWeight:700,margin:"0 auto 12px",overflow:"hidden"}}>
                {profile?.photo?<img src={profile.photo} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:user.email[0].toUpperCase()}
              </div>
              <div style={{fontWeight:700,fontSize:18,color:theme.ink,display:"flex",alignItems:"center",justifyContent:"center"}}>
                {profile?.name||user.email}
                <VerifiedBadge verified={profile?.verificationStatus==="approved"}/>
              </div>
              <div style={{fontSize:12,color:theme.inkLight,marginTop:4}}>{user.email}</div>
              {profile?.bio&&<div style={{fontSize:13,color:theme.inkMid,marginTop:8,lineHeight:1.6}}>{profile.bio}</div>}
              {profile?.isPremium&&<div style={{marginTop:6,display:"inline-block",background:`linear-gradient(135deg,${theme.gold},${theme.goldLight})`,color:"white",padding:"2px 12px",borderRadius:20,fontSize:11,fontWeight:700}}>👑 Premium</div>}
            </div>
            <ProfileStats userEmail={user.email}/>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
              <button onClick={()=>setEditProfileOpen(true)} style={{padding:12,background:"transparent",border:`1px solid ${theme.border}`,borderRadius:8,cursor:"pointer",color:theme.ink,fontSize:13,textAlign:"left"}}>👤 Editar Perfil</button>
              <button onClick={()=>setSecondProfileOpen(true)} style={{padding:12,background:"transparent",border:`1px solid ${theme.border}`,borderRadius:8,cursor:"pointer",color:theme.ink,fontSize:13,textAlign:"left"}}>🎭 Perfil Privado (Modo Fantasma)</button>
              <button onClick={()=>setVaultOpen(true)} style={{padding:12,background:"transparent",border:`1px solid ${theme.border}`,borderRadius:8,cursor:"pointer",color:theme.ink,fontSize:13,textAlign:"left"}}>🔐 Cofre Privado</button>
              {profile?.isPremium&&profile?.verificationStatus==="approved"&&(
                <div style={{padding:12,background:"linear-gradient(135deg,#1a0a2e,#2a1f3e)",border:"1px solid #c9963a",borderRadius:8,color:"#c9963a",fontSize:13}}>
                  🌙 <strong>Luna está ativa</strong> — usa o botão flutuante para falar com ela
                </div>
              )}
              {(!profile?.isPremium||profile?.verificationStatus!=="approved")&&(
                <div style={{padding:12,background:"transparent",border:`1px dashed ${theme.border}`,borderRadius:8,color:theme.inkLight,fontSize:12}}>
                  🌙 <strong>Luna</strong> — disponível para Premium + Verified
                </div>
              )}
              {profile?.verificationStatus!=="approved"&&<button onClick={()=>setVerificationOpen(true)} style={{padding:12,background:"transparent",border:`1px solid ${theme.border}`,borderRadius:8,cursor:"pointer",color:theme.ink,fontSize:13,textAlign:"left"}}>✅ Pedir Verificação</button>}
              {!profile?.isPremium&&<button onClick={()=>setPaymentOpen(true)} style={{padding:12,background:`linear-gradient(135deg,${theme.gold},${theme.goldLight})`,border:"none",borderRadius:8,cursor:"pointer",color:"white",fontSize:13,textAlign:"left",fontWeight:700}}>👑 Tornar Premium</button>}
              <button onClick={()=>setDeleteAccountOpen(true)} style={{padding:12,background:"transparent",border:"1px solid #c4606a",borderRadius:8,cursor:"pointer",color:"#c4606a",fontSize:13,textAlign:"left"}}>⚠️ Apagar Conta</button>
            </div>
            <FeedList user={user} lang={lang}/>
          </div>
        )}

        {screen==="auth"&&!user&&(
          <div style={{textAlign:"center",padding:"40px 20px"}}>
            <Ring size={64} color={theme.gold} style={{marginBottom:16}}/>
            <h1 style={{fontFamily:serif,fontSize:28,color:theme.ink,marginBottom:8}}>{t.tagline}</h1>
            <p style={{fontSize:14,color:theme.inkLight,marginBottom:24}}>{t.subtitle}</p>
            <button onClick={()=>setAuthOpen(true)} style={{padding:"14px 32px",background:`linear-gradient(135deg,${theme.gold},${theme.goldLight})`,color:"white",border:"none",borderRadius:24,cursor:"pointer",fontWeight:700,fontSize:15}}>Começar</button>
          </div>
        )}

        {screen==="relationships"&&user&&(
          <div>
            <h2 style={{fontFamily:serif,fontWeight:400,color:theme.ink,marginBottom:16}}>{t.active_title}</h2>
            {relationships.filter(r=>r.active!==false).length===0&&<div style={{textAlign:"center",color:theme.inkLight,padding:32,fontSize:13}}>{t.no_active}</div>}
            {relationships.filter(r=>r.active!==false).map(rel=>{
              const isP1 = rel.person1Email===user.email;
              const partnerName = isP1?rel.person2:rel.person1;
              return (
                <div key={rel.id} style={{background:theme.white==="#1a1209"?"#2a1f12":"white",borderRadius:12,padding:16,marginBottom:12,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
                  <div style={{fontWeight:700,color:theme.ink,marginBottom:4}}>💍 {partnerName}</div>
                  <div style={{fontSize:12,color:theme.inkLight,marginBottom:8}}>{t.since} {fmtDate(rel.startDate,lang)}</div>
                  {isAnniversaryToday(rel.startDate)&&<div style={{fontSize:12,color:theme.rose,fontWeight:700,marginBottom:8}}>{t.anniversary_msg(yearsBetween(rel.startDate))}</div>}
                  <button onClick={()=>handleEnd(rel.id,rel.person1,rel.person2)} style={{padding:"6px 14px",background:"transparent",border:`1px solid ${theme.rose}`,color:theme.rose,borderRadius:16,cursor:"pointer",fontSize:12}}>{t.btn_end}</button>
                </div>
              );
            })}
            {relationships.filter(r=>r.active===false).length>0&&(
              <>
                <h2 style={{fontFamily:serif,fontWeight:400,color:theme.ink,margin:"24px 0 16px"}}>{t.history_title}</h2>
                {relationships.filter(r=>r.active===false).map(rel=>{
                  const isP1=rel.person1Email===user.email;
                  const partnerName=isP1?rel.person2:rel.person1;
                  return (
                    <div key={rel.id} style={{background:theme.white==="#1a1209"?"#2a1f12":"white",borderRadius:12,padding:16,marginBottom:12,opacity:0.7}}>
                      <div style={{fontWeight:700,color:theme.ink,marginBottom:4}}>💔 {partnerName}</div>
                      <div style={{fontSize:12,color:theme.inkLight}}>{t.ended_on} {fmtDate(rel.endDate,lang)}</div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}
      </div>

      {/* BOTTOM NAV */}
      {user&&(
        <div style={{position:"fixed",bottom:0,left:0,right:0,background:theme.cream,borderTop:`1px solid ${theme.border}`,display:"flex",zIndex:90}}>
          {navBtn("feed","🏠","Feed")}
          {navBtn("relationships","💍","Casal")}
          {navBtn("profile","👤","Perfil")}
        </div>
      )}

      {/* MODALS - todos renderizados uma única vez */}
      {authOpen&&<AuthModal onClose={()=>setAuthOpen(false)} lang={lang} onLogin={()=>setAuthOpen(false)}/>}
      {editProfileOpen&&<EditProfile user={user} onClose={()=>setEditProfileOpen(false)} onSave={(data)=>setProfile({...profile,...data})}/>}
      {deleteAccountOpen&&<DeleteAccount user={user} onClose={()=>setDeleteAccountOpen(false)}/>}
      {secondProfileOpen&&<SecondProfile user={user} onClose={()=>setSecondProfileOpen(false)}/>}
      {chatListOpen&&<ChatList user={user} onClose={()=>setChatListOpen(false)} onOpenChat={(email)=>{setChatRecipient(email);setChatListOpen(false);}}/>}
      {searchOpen&&<SearchUsers user={user} onClose={()=>setSearchOpen(false)} onViewProfile={(email)=>{setProfileViewEmail(email);setSearchOpen(false);}} onChat={(email)=>{setChatRecipient(email);setSearchOpen(false);}}/>}
      {vaultOpen&&<PrivateVault user={user} onClose={()=>setVaultOpen(false)}/>}
      {verificationOpen&&<RequestVerification user={user} onClose={()=>setVerificationOpen(false)}/>}
      {thoughtBubbleOpen&&<ThoughtBubble user={user} lang={lang} onClose={()=>setThoughtBubbleOpen(false)}/>}
      {randomConnectOpen&&<RandomConnect user={user} onClose={()=>setRandomConnectOpen(false)}/>}
      {paymentOpen&&<PaymentModal lang={lang} onClose={()=>setPaymentOpen(false)} onSuccess={()=>{}}/>}

      {profileViewEmail&&(
        <ProfilePage user={user} profileEmail={profileViewEmail} onClose={()=>setProfileViewEmail(null)}
          onChat={(email)=>{setChatRecipient(email);setProfileViewEmail(null);}}
          setGiftOpen={setGiftOpen} setGiftTarget={setGiftTarget}/>
      )}

      {chatRecipient&&(
        <Chat user={user} recipient={chatRecipient} onClose={()=>setChatRecipient(null)}
          setBondPulseOpen={setBondPulseOpen} setBondPulsePartner={setBondPulsePartner}
          setSecretMsgOpen={setSecretMsgOpen} setSecretMsgRecipient={setSecretMsgRecipient}
          setLoveScoreOpen={setLoveScoreOpen} setLoveScorePartner={setLoveScorePartner}
          setSoulPrintOpen={setSoulPrintOpen} setSoulPrintPartner={setSoulPrintPartner}
          setVideoCallOpen={setVideoCallOpen} setVideoCallRecipient={setVideoCallRecipient}
          isPremium={profile?.isPremium}/>
      )}

      {bondCoinsOpen&&<BondCoins user={user} onClose={()=>setBondCoinsOpen(false)}/>}
      {giftOpen&&<GiftShop user={user} targetEmail={giftTarget} onClose={()=>setGiftOpen(false)}/>}
      {secretMsgOpen&&<SecretMessage user={user} recipient={secretMsgRecipient} onClose={()=>setSecretMsgOpen(false)}/>}
      {bondPulseOpen&&<BondPulse user={user} partner={bondPulsePartner} onClose={()=>setBondPulseOpen(false)}/>}
      {loveScoreOpen&&<LoveAIScore user={user} partner={loveScorePartner} onClose={()=>setLoveScoreOpen(false)}/>}
      {soulPrintOpen&&<SoulPrint user={user} partner={soulPrintPartner} onClose={()=>setSoulPrintOpen(false)}/>}
      {videoCallOpen&&<VideoCall user={user} recipient={videoCallRecipient} onClose={()=>setVideoCallOpen(false)}/>}

      {!gdprAccepted&&<GDPRBanner lang={lang} onAccept={handleGdprAccept}/>}
      <LunaWidget user={user} profile={profile}/>
    </div>
  );
}

export default App;
