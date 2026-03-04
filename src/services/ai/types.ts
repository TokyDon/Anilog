/**
 * Re-export AiIdentificationResult for consumers of the AI service layer.
 * Keep import paths clean: import from 'services/ai/types', not from 'types/animon'.
 */
export type { AiIdentificationResult } from '../../types/animon';
