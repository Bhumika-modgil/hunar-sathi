import { createServerFn } from "@tanstack/react-start";

// PhotoRoom "Remove Background" endpoint (Basic plan — works with a standard API key).
// Docs: https://docs.photoroom.com/image-editing-api/remove-background
const PHOTOROOM_ENDPOINT = "https://sdk.photoroom.com/v1/segment";

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15MB — plenty for a phone photo

/**
 * Runs entirely on the server. The PhotoRoom API key is read from
 * `process.env.PHOTOROOM_API_KEY` (see the project's `.env` file) and is
 * never sent to, or visible from, the browser.
 *
 * Client usage:
 *   const formData = new FormData();
 *   formData.set("image", file);
 *   const response = await enhanceProductPhoto({ data: formData });
 *   if (response.ok) {
 *     const blob = await response.blob();
 *     const url = URL.createObjectURL(blob); // background-removed PNG
 *   }
 */
export const enhanceProductPhoto = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (!(data instanceof FormData)) {
      throw new Error("Expected multipart form data");
    }
    const image = data.get("image");
    if (!(image instanceof File)) {
      throw new Error("Missing 'image' file in form data");
    }
    if (image.size > MAX_UPLOAD_BYTES) {
      throw new Error("Photo is too large (max 15MB).");
    }
    return data;
  })
  .handler(async ({ data }) => {
    const apiKey = process.env.PHOTOROOM_API_KEY;

    if (!apiKey) {
      return Response.json(
        {
          error:
            "PHOTOROOM_API_KEY is not set. Add your PhotoRoom API key to the .env file in the project root and restart the dev server.",
        },
        { status: 500 },
      );
    }

    const photo = data.get("image") as File;

    const upstreamForm = new FormData();
    upstreamForm.set("image_file", photo, photo.name || "photo.jpg");
    upstreamForm.set("format", "png");
    upstreamForm.set("size", "hd");

    let upstreamResponse: Response;
    try {
      upstreamResponse = await fetch(PHOTOROOM_ENDPOINT, {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          Accept: "image/png",
        },
        body: upstreamForm,
      });
    } catch (error) {
      console.error("PhotoRoom request failed:", error);
      return Response.json({ error: "Could not reach the PhotoRoom API." }, { status: 502 });
    }

    if (!upstreamResponse.ok) {
      let message = `PhotoRoom API error (${upstreamResponse.status}).`;
      try {
        const body = (await upstreamResponse.json()) as { detail?: string };
        if (body?.detail) message = body.detail;
      } catch {
        // Response wasn't JSON — fall back to the generic message above.
      }
      console.error("PhotoRoom API error:", upstreamResponse.status, message);
      return Response.json({ error: message }, { status: upstreamResponse.status });
    }

    const imageBuffer = await upstreamResponse.arrayBuffer();
    return new Response(imageBuffer, {
      status: 200,
      headers: {
        "content-type": upstreamResponse.headers.get("content-type") ?? "image/png",
      },
    });
  });
