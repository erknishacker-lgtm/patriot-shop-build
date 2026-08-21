import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { ADMIN_EMAIL } from "@/lib/admin";
import { decodeBase64Bytes, MAX_IMAGE_BYTES, sniffImage } from "@/lib/image-bytes";
import { parseProductInput } from "@/lib/product-schema";
import {
  productToRow,
  rowToProduct,
  type ProductRecord,
  type ProductRow,
} from "@/lib/products";
import { getSupabaseConfig } from "@/lib/supabase";

const ACCESS_COOKIE = "ps_access";
const REFRESH_COOKIE = "ps_refresh";
const ACCESS_MAX_AGE = 60 * 60;
const REFRESH_MAX_AGE = 60 * 60 * 24 * 7;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX = 5;

const loginAttempts = new Map<string, { count: number; resetAt: number }>();

async function serverCookies() {
  return import("@tanstack/react-start/server");
}

async function cookieBase() {
  const { getRequest } = await serverCookies();
  const secure = getRequest().url.startsWith("https:");
  return {
    httpOnly: true,
    secure,
    sameSite: "lax" as const,
    path: "/",
  };
}

async function writeSession(accessToken: string, refreshToken: string) {
  const { setCookie } = await serverCookies();
  const base = await cookieBase();
  setCookie(ACCESS_COOKIE, accessToken, { ...base, maxAge: ACCESS_MAX_AGE });
  setCookie(REFRESH_COOKIE, refreshToken, { ...base, maxAge: REFRESH_MAX_AGE });
}

async function clearSession() {
  const { deleteCookie } = await serverCookies();
  const base = await cookieBase();
  deleteCookie(ACCESS_COOKIE, base);
  deleteCookie(REFRESH_COOKIE, base);
}

async function assertLoginRate() {
  const { getRequestIP } = await serverCookies();
  const ip = getRequestIP({ xForwardedFor: true }) || "unknown";
  const now = Date.now();
  const current = loginAttempts.get(ip);
  if (!current || now > current.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
    return;
  }
  current.count += 1;
  if (current.count > LOGIN_MAX) {
    throw new Error("Muitas tentativas. Espere alguns minutos.");
  }
}

function anonClient() {
  const config = getSupabaseConfig();
  if (!config) throw new Error("Cofre não conectado.");
  return createClient(config.url, config.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

function userClient(accessToken: string) {
  const config = getSupabaseConfig();
  if (!config) throw new Error("Cofre não conectado.");
  return createClient(config.url, config.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}

async function requireAdmin() {
  const { getCookie } = await serverCookies();
  let access = getCookie(ACCESS_COOKIE);
  const refresh = getCookie(REFRESH_COOKIE);
  if (!access && !refresh) throw new Error("Sessão expirada.");

  if (access) {
    const probe = anonClient();
    const { data } = await probe.auth.getUser(access);
    if (data.user?.email?.toLowerCase() === ADMIN_EMAIL) {
      return { user: data.user, supabase: userClient(access) };
    }
  }

  if (!refresh) {
    await clearSession();
    throw new Error("Sessão expirada.");
  }

  const refreshed = await anonClient().auth.refreshSession({ refresh_token: refresh });
  const session = refreshed.data.session;
  if (refreshed.error || !session?.user || session.user.email?.toLowerCase() !== ADMIN_EMAIL) {
    await clearSession();
    throw new Error("Sessão expirada.");
  }
  await writeSession(session.access_token, session.refresh_token);
  return { user: session.user, supabase: userClient(session.access_token) };
}

export const loginAdmin = createServerFn({ method: "POST" })
  .inputValidator((input: { email?: string; password?: string }) => ({
    email: String(input?.email ?? "").trim().toLowerCase(),
    password: String(input?.password ?? ""),
  }))
  .handler(async ({ data }) => {
    try {
      await assertLoginRate();
    } catch (error) {
      return { ok: false as const, error: error instanceof Error ? error.message : "Não entrou." };
    }
    if (data.email !== ADMIN_EMAIL || data.password.length < 8) {
      return { ok: false as const, error: "Não entrou. Confira a senha." };
    }
    const { data: sessionData, error } = await anonClient().auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error || !sessionData.session?.user) {
      return { ok: false as const, error: "Não entrou. Confira a senha." };
    }
    if (sessionData.session.user.email?.toLowerCase() !== ADMIN_EMAIL) {
      await clearSession();
      return { ok: false as const, error: "Não entrou. Confira a senha." };
    }
    await writeSession(sessionData.session.access_token, sessionData.session.refresh_token);
    return { ok: true as const };
  });

export const logoutAdmin = createServerFn({ method: "POST" }).handler(async () => {
  const { getCookie } = await serverCookies();
  const access = getCookie(ACCESS_COOKIE);
  if (access) {
    try {
      await userClient(access).auth.signOut();
    } catch {
      // cookie still gets cleared
    }
  }
  await clearSession();
  return { ok: true as const };
});

export const getAdminSession = createServerFn({ method: "POST" }).handler(async () => {
  try {
    const { user } = await requireAdmin();
    return { email: user.email ?? ADMIN_EMAIL };
  } catch {
    return { email: null };
  }
});

export const adminListProducts = createServerFn({ method: "POST" }).handler(async () => {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("rank", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return ((data ?? []) as ProductRow[]).map(rowToProduct);
});

export const adminGetProduct = createServerFn({ method: "POST" })
  .inputValidator((input: { id?: string }) => ({
    id: z.string().uuid().parse(String(input?.id ?? "")),
  }))
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin();
    const { data: row, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row ? rowToProduct(row as ProductRow) : null;
  });

export const adminSaveProduct = createServerFn({ method: "POST" })
  .inputValidator((input: { product?: unknown; isNew?: boolean }) => ({
    product: input?.product,
    isNew: Boolean(input?.isNew),
  }))
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin();
    const product = parseProductInput(data.product, data.isNew);
    const payload = productToRow(product as ProductRecord);
    if (data.isNew) {
      const { data: row, error } = await supabase.from("products").insert(payload).select("id").single();
      if (error) throw new Error(error.message);
      return row.id as string;
    }
    const id = z.string().uuid().parse(product.id);
    const { error } = await supabase.from("products").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
    return id;
  });

export const adminDeleteProduct = createServerFn({ method: "POST" })
  .inputValidator((input: { id?: string }) => ({
    id: z.string().uuid().parse(String(input?.id ?? "")),
  }))
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("products").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const adminUploadImage = createServerFn({ method: "POST" })
  .inputValidator((input: { productId?: string; base64?: string }) => ({
    productId: z.string().uuid().parse(String(input?.productId ?? "")),
    base64: String(input?.base64 ?? ""),
  }))
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin();
    if (!data.base64 || data.base64.length > MAX_IMAGE_BYTES * 2) {
      throw new Error("Foto inválida.");
    }
    const bytes = decodeBase64Bytes(data.base64);
    if (bytes.byteLength > MAX_IMAGE_BYTES) {
      throw new Error("A foto passa de 6 MB. Envie uma menor.");
    }
    const kind = sniffImage(bytes);
    if (!kind) {
      throw new Error("Envie só foto JPG, PNG, WEBP ou GIF.");
    }
    const path = `${data.productId}/${crypto.randomUUID()}.${kind.ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, bytes, {
      cacheControl: "3600",
      upsert: false,
      contentType: kind.mime,
    });
    if (error) throw new Error(error.message);
    const { data: publicUrl } = supabase.storage.from("product-images").getPublicUrl(path);
    return publicUrl.publicUrl;
  });
