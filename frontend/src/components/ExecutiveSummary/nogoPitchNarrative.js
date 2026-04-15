import { OPERATOR_ROLES } from '../../utils/operatorRole';

/**
 * Pitch-ready No-Go copy for Executive Summary only — reads like OCR + policy gate,
 * scoped by signed-in lens (packaging / processing / regional supervisor).
 */
const NO_GO_PITCH_BY_LENS = {
  packaging: {
    title: 'No-Go — packaging quality gate',
    lead:
      'The uploaded form was read through the packaging quality model. Structured fields were extracted from the scan and evaluated against the active release matrix for your packaging line context. One or more controls did not clear, so the gate stays closed until the documented exception path completes.',
    extractionHeading: 'What the read captured',
    extraction:
      'Vision OCR returned line and run identifiers, the seal-integrity checklist row (bead continuity / closure torque band), case label alignment versus the SKU master, metal-detection acknowledgment, and the case-weight tolerance band. Values were normalized to the packaging quality schema and time-stamped to the submission window.',
    whyHeading: 'Why this is a No-Go',
    why:
      'Seal, label, or weight controls crossed the validated tolerance for this SKU and window. Under plant policy that combination is treated as a failed packaging gate: product cannot advance to ship until corrective action is recorded and the supervisor workflow is satisfied.',
    stepsHeading: 'How the decision was reached',
    steps: [
      'Document read: seal, label, metal-detection, and weight fields were extracted from the scan and checked for completeness and internal consistency.',
      'Policy check: extracted values were compared to the active release matrix (limits, SKU pairing, and acknowledgment rules).',
      'Outcome: the gate failed because at least one mandatory control did not meet the release band — the line remains on hold until remediation and sign-off.',
    ],
  },
  processing: {
    title: 'No-Go — process parameter gate',
    lead:
      'The submitted operator form was ingested through the process read path. Critical control points and numeric bands from the scan were aligned to the validated recipe and thermal profile for your processing lens. The engine returned a hold because the read did not satisfy all release criteria for this run.',
    extractionHeading: 'What the read captured',
    extraction:
      'OCR and field detection pulled moisture / solids window, fryer oil turnover index, critical hold temperatures, seasoning applied rate versus target, and the CCP sign-off row. Values were mapped to the processing parameter schema with shift and SKU context from the form header.',
    whyHeading: 'Why this is a No-Go',
    why:
      'One or more critical parameters or required CCP confirmations fell outside the validated limits for this SKU and shift. Process policy treats that as a failed gate: the cook / hold path cannot be cleared for release until the deviation is dispositioned and the supervisor path completes.',
    stepsHeading: 'How the decision was reached',
    steps: [
      'Document read: CCP rows and numeric bands were extracted from the scan and reviewed for completeness and plausible range.',
      'Policy check: readings were compared to the active thermal and compositional limits for the SKU in scope.',
      'Outcome: the gate failed because a mandatory parameter or sign-off did not clear — production remains on hold until corrective action is documented.',
    ],
  },
  manager: {
    title: 'No-Go — regional quality & compliance hold',
    lead:
      'The submitted form was evaluated at the regional compliance layer. The read summarizes site, line, severity, and non-conformance category so Grade 2 supervisors can see why the gate did not clear without drilling into operator-level fields first.',
    extractionHeading: 'What the read captured',
    extraction:
      'Structured extraction identified site and line designation, run window, non-conformance category, severity flag, and the responsible work-center block from the form image. Those elements were normalized to the regional exception schema for rollup to KPI and audit views.',
    whyHeading: 'Why this is a No-Go',
    why:
      'Corporate release policy for this exception class requires a documented hold at regional visibility until disposition is aligned with the site. The gate therefore remains No-Go until supervisor acknowledgment and any required cross-functional sign-off are complete.',
    stepsHeading: 'How the decision was reached',
    steps: [
      'Document read: exception metadata and severity were parsed from the scan and placed in the regional exception view.',
      'Policy check: the case was matched to the quality & compliance band that mandates a regional hold for this category.',
      'Outcome: the gate failed under regional policy — the site cannot return to standard dispatch in the dashboard until the hold path is completed.',
    ],
  },
};

export function getNoGoPitchNarrative(operatorRole) {
  const lens =
    operatorRole === OPERATOR_ROLES.processing
      ? 'processing'
      : operatorRole === OPERATOR_ROLES.manager
        ? 'manager'
        : 'packaging';

  return NO_GO_PITCH_BY_LENS[lens];
}
