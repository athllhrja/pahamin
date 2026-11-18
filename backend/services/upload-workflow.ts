import { AppError } from "../errors";

export async function runUpload<T>(steps: {
  reserve: () => Promise<T>;
  upload: (document: T) => Promise<void>;
  confirm: (document: T) => Promise<T>;
  cleanup: (document: T) => Promise<void>;
}) {
  const document = await steps.reserve();
  try {
    await steps.upload(document);
    return await steps.confirm(document);
  } catch (error) {
    try {
      await steps.cleanup(document);
    } catch {
      throw new AppError("CLEANUP_REQUIRED", 503);
    }
    throw error;
  }
}
