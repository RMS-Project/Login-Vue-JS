import Store from '../store'

// Exporta com parametro para permitir importar apenas
// uma modulo.
export default function useStore (module) {
  // Se tiver uma string com o nome do modulo.
  if (module) {
  	// Retorne apenas o modulo.
    return Store[module]
  }

  // Se não tiver retorne o modulo io store completo.
  return Store
}
