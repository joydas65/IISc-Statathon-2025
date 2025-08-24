/**
 * SuppressionBadge
 * - Displays k & suppressed cell count from response meta, if present
 */
type Props = {
  suppression?: { k: number; suppressed_cells: number } | null;
};

export default function SuppressionBadge({ suppression }: Props) {
  if (!suppression) return null;
  return (
    <div className="text-xs text-amber-700 bg-amber-50 rounded px-2 py-1 inline-block">
      k={suppression.k}, suppressed={suppression.suppressed_cells}
    </div>
  );
}
