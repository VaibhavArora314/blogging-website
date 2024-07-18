import { verify } from "hono/jwt";

const checkAuthHeader = async (
  authHeader: string | undefined,
  JWT_SECRET: string
): Promise<string> => {
  try {
    if (!authHeader || authHeader.split(" ")[0] != "Bearer") return "";

    const token = authHeader.split(" ")[1];
    const payload = await verify(token, JWT_SECRET);

    if (!payload || !payload.id) return "";

    return String(payload?.id);
  } catch (error) {
    return "";
  }
};


export default checkAuthHeader;