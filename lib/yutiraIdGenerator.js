import User from '@/models/User';

export function formatYutiraId(n) {
  return `YUTIRA${String(n).padStart(4, '0')}`;
}

export async function generateNextYutiraId() {
  // Find the highest existing yutiraId and increment.
  const last = await User.findOne({ yutiraId: { $exists: true, $ne: null } })
    .sort({ yutiraId: -1 })
    .lean();

  if (!last?.yutiraId) return formatYutiraId(1);

  const num = Number(String(last.yutiraId).replace('YUTIRA', ''));
  const next = Number.isFinite(num) ? num + 1 : 1;
  return formatYutiraId(next);
}
