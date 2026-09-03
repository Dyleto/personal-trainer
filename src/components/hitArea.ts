import type { SystemStyleObject } from '@chakra-ui/react';

/**
 * Étend la zone touchable d'un contrôle à 44 px sans toucher à sa taille
 * visible.
 *
 * L'édition en place rend l'application dense et lisible, mais elle produit
 * mécaniquement des cibles de la taille de leur texte : 96 % des commandes de
 * l'atelier passaient sous 44 px sur mobile, certaines à 24 × 16. Plutôt que
 * de grossir la typographie — ce qui détruirait la densité — on superpose au
 * contrôle un rectangle transparent centré, qui reçoit le doigt.
 *
 * Deux contrôles voisins ne peuvent pas revendiquer 44 px chacun s'ils sont
 * espacés de moins : leurs zones se recouvrent, et c'est le dernier dans le
 * DOM qui gagne. D'où deux tailles dans l'application :
 *
 *   44 px — contrôles isolés : cellules de calendrier, lignes de liste,
 *           boutons de bas d'écran, crans du ressenti.
 *   32 px — gouttières et valeurs en ligne de l'atelier, où les commandes se
 *           suivent à 8 px. C'est au-dessus du plancher WCAG 2.5.8 (24 px),
 *           et c'est le maximum atteignable sans renoncer à la densité
 *           typographique qui fait tenir un programme sur un écran.
 */
export const hitArea = (size = 44): SystemStyleObject => ({
  position: 'relative',
  _after: {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: `${size}px`,
    minHeight: `${size}px`,
    width: '100%',
    height: '100%',
    // Ne capte que le pointeur : invisible, et jamais dans le flux.
    pointerEvents: 'auto',
  },
});
