/**
 * NOTA — Reconocimiento de voz en navegador
 *
 * Este hook utiliza la Web Speech API (SpeechRecognition), una API
 * experimental y no estandarizada que actualmente solo funciona de
 * forma fiable en navegadores basados en Chromium (principalmente Chrome).
 *
 * Aunque permite simular una Natural User Interface (NUI) basada en voz,
 * NO constituye una NUI real por los siguientes motivos:
 *
 * - El navegador controla completamente el acceso al micrófono.
 * - El reconocimiento solo puede iniciarse tras una acción explícita
 *   del usuario (click, touch), por razones de seguridad.
 * - El soporte varía según navegador, sistema operativo y dispositivo.
 * - En entornos móviles, el teclado virtual y la gestión del foco pueden
 *   interrumpir o finalizar el reconocimiento de forma automática.
 * - La existencia de la API (isSupported) no garantiza su funcionamiento real.
 *
 * Este enfoque es válido como demostración conceptual en aplicaciones web,
 * pero para interfaces naturales de voz robustas y multiplataforma se
 * recomienda el uso de aplicaciones nativas (React Native) o servicios
 * Speech-to-Text externos (Whisper, Azure, Google Speech, etc.).
 */
import { useState, useEffect, useRef } from "react";

/**
 * Hook personalizado para gestionar el reconocimiento de voz (SpeechRecognition).
 * Utiliza la Web Speech API para convertir el habla en texto.
 * 
 * @param {Function} onResult - Función callback que recibe el texto reconocido.
 * @returns {Object} Objeto con el estado de soporte, si está escuchando y la función para iniciar.
 */
const useVoiceRecognition = (onResult) => {
  // Configuración de la API para compatibilidad con distintos navegadores
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  // Estado que indica si el micrófono está capturando audio
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Verificamos si el navegador actual soporta la API
  const isSupported = !!SpeechRecognition;
  // Si SpeechRecognition existe → true; si es undefined → false

  useEffect(() => {
    if (!isSupported) return;

    // Inicialización del motor de reconocimiento
    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      onResult(text);
      setIsListening(false);
    };

    // Evento: Error durante el reconocimiento
    recognition.onerror = (event) => {
      console.error("Error en reconocimiento:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
  }, [SpeechRecognition, onResult, isSupported]);

  /**
   * Inicia el proceso de escucha si el navegador lo soporta.
   */
  const startListening = () => {
    if (!isSupported || !recognitionRef.current) return;
    try {
      setIsListening(true);
      recognitionRef.current.start();
    } catch {
      console.warn("Ya está escuchando...");
    }
  };

  // Siempre retornamos un objeto consistente
  return {
    isSupported,
    isListening,
    startListening: isSupported ? startListening : () => { }
  };
};

export default useVoiceRecognition;
