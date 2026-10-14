import type { PayOverride, PayStaff, PayTarget } from "./model.ts";

export function getOverrideTargets(
  staff: PayStaff,
  kind: PayTarget["kind"],
  overrides: readonly PayOverride[],
  editingId?: string,
) {
  const linked = staff.targets.filter((target) => target.kind === kind);
  const assigned = new Set(
    overrides
      .filter((item) => item.staffId === staff.id && item.id !== editingId)
      .map((item) => item.targetId),
  );
  const available = linked.filter((target) => !assigned.has(target.id));
  const noun = kind === "enrollment" ? "enrollments" : "classes or services";
  const emptyMessage = !linked.length
    ? `No ${noun} are linked to this staff member. Choose another override type or staff member.`
    : !available.length
      ? `All linked ${noun} already have overrides. Close this dialog to edit an existing override in the staff list.`
      : undefined;
  return { available, emptyMessage };
}
