/**
 * L'aspect d'une pastille de jour, partagé entre l'atelier du coach — où
 * elle se coche — et les écrans du client — où elle se lit.
 *
 * Les deux vues montrent la même chose ; les laisser diverger, c'est faire
 * croire à deux données différentes.
 */
export const dayChipStyle = (active: boolean) =>
  ({
    px: 2,
    py: 1,
    minW: '34px',
    textAlign: 'center',
    borderRadius: 'md',
    borderWidth: '1px',
    borderColor: active ? 'app.primary' : 'whiteAlpha.200',
    bg: active ? 'app.primary/16' : 'transparent',
    color: active ? 'app.primary' : 'fg.muted',
    fontSize: 'xs',
    fontWeight: active ? 'bold' : 'normal',
  }) as const;
