/**
 * MongoDB standalone deployments do not support Prisma upsert (requires transactions).
 * Use find-then-update-or-create for single-document writes instead.
 */

export async function updateOrCreate<TExisting, TResult>({
  find,
  update,
  create,
}: {
  find: () => Promise<TExisting | null>;
  update: (existing: TExisting) => Promise<TResult>;
  create: () => Promise<TResult>;
}): Promise<TResult> {
  const existing = await find();
  if (existing) {
    return update(existing);
  }
  return create();
}
