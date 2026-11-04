const IMGBB_ENDPOINT = "https://api.imgbb.com/1/upload";

type ImgbbResponse = {
  data?: {
    url?: string;
    display_url?: string;
  };
  error?: {
    message?: string;
  };
};

/**
 * Uploads a studio image to ImgBB and returns the direct image URL.
 * If the API key is missing, the form can still accept a pasted image URL.
 */
export async function uploadStudioImage(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Image upload is not configured. Add NEXT_PUBLIC_IMGBB_API_KEY or paste a direct image URL.",
    );
  }

  const formData = new FormData();
  formData.append("image", file);
  formData.append("name", `studiospace-${Date.now()}`);

  const response = await fetch(`${IMGBB_ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    body: formData,
  });

  const payload = (await response.json().catch(() => ({}))) as ImgbbResponse;

  if (!response.ok || !payload.data?.url) {
    throw new Error(
      payload.error?.message ??
        "ImgBB rejected the upload. Try a smaller image or paste a direct URL.",
    );
  }

  return payload.data.url;
}
