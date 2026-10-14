import {
  formatPayRate,
  type PayRate,
  type PayStaff,
  type PayStructure,
  type PayTarget,
} from "./model";

export function OverrideSummary({
  staff,
  target,
  rate,
  previousRate,
  structures,
}: {
  staff: PayStaff;
  target: PayTarget;
  rate: PayRate;
  previousRate?: PayRate;
  structures: readonly PayStructure[];
}) {
  const unchanged =
    previousRate &&
    (previousRate.method === "tiered"
      ? rate.method === "tiered" &&
        previousRate.structureId === rate.structureId
      : rate.method !== "tiered" &&
        previousRate.method === rate.method &&
        previousRate.cents === rate.cents);
  function label(value: PayRate) {
    return `${formatPayRate(value, structures)}${value.method === "tiered" ? " (tiered pay)" : ""}`;
  }
  return (
    <section className="pay-summary" aria-label="Override summary">
      <span className="pay-context-label">
        {previousRate
          ? unchanged
            ? "Current rate"
            : "Review changes"
          : "Override summary"}
      </span>
      {previousRate ? (
        <>
          <p>
            <strong>{staff.name}</strong> · <strong>{target.name}</strong>
          </p>
          {unchanged ? (
            <p>
              <strong>{label(rate)}</strong>
            </p>
          ) : (
            <p>
              From <strong>{label(previousRate)}</strong> to{" "}
              <strong>{label(rate)}</strong>.
            </p>
          )}
        </>
      ) : (
        <p>
          <strong>{staff.name}</strong>
          {rate.method === "tiered" ? " will use " : " will receive "}
          <strong>{label(rate)}</strong> for <strong>{target.name}</strong>.
        </p>
      )}
      <span>{target.detail}</span>
    </section>
  );
}
