/** Processing line (fryer, slicer, seasoning) vs packaging line (palletizer, case equipment, conveyors). */

export const PEPSICO_FLOW_STORAGE_KEY = 'pepsico_flow';

/** Read operator lens from session (matches AppFlowContext persistence). */
export function getSessionOperatorRole() {
  try {
    const raw = sessionStorage.getItem(PEPSICO_FLOW_STORAGE_KEY);
    if (!raw) return 'packaging';
    const o = JSON.parse(raw);
    return o.operatorRole === 'processing' ? 'processing' : 'packaging';
  } catch {
    return 'packaging';
  }
}

export const OPERATOR_ROLES = {
  processing: 'processing',
  packaging: 'packaging',
};

export function normalizeOperatorRole(v) {
  if (v === OPERATOR_ROLES.packaging || v === OPERATOR_ROLES.processing) return v;
  return null;
}

export function operatorRoleTitle(role) {
  if (role === OPERATOR_ROLES.packaging) return 'Packaging line operator';
  if (role === OPERATOR_ROLES.processing) return 'Processing line operator';
  return 'Operator';
}

export function operatorRoleShort(role) {
  if (role === OPERATOR_ROLES.packaging) return 'Packaging lens';
  if (role === OPERATOR_ROLES.processing) return 'Processing lens';
  return 'Fleet lens';
}
