export function toConvexId<T extends string>(id?: string): Id<T> | undefined {
  console.log("Checking ID in toConvexId:", id);
  if (!id) return undefined;
  // Comment out length check for now to debug:
  // if (id.length !== 36) return undefined;
  return id as Id<T>;
}
