"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import {
  loginSchema,
  signUpSchema,
  forgotPasswordSchema,
  updatePasswordSchema,
  changePasswordSchema,
  updateDisplayNameSchema,
} from "../schemas";
import { mapAuthError, AUTH_ERROR_CODES } from "../errors";
import { AUTH_ROUTES, DEFAULT_LOGIN_REDIRECT } from "@/lib/auth/constants";
import { getSafeRedirectUrl } from "@/lib/auth/redirects";

export interface ActionResult<T = unknown> {
  success: boolean;
  message?: string;
  errorCode?: string;
  data?: T;
}

/**
 * Sign Up with Email and Password (P09-T01)
 */
export async function signUpAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const rawData = {
    displayName: formData.get("displayName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const validation = signUpSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      message: validation.error.issues[0]?.message || "Dữ liệu đăng ký không hợp lệ",
      errorCode: AUTH_ERROR_CODES.AUTH_SIGNUP_FAILED,
    };
  }

  const { displayName, email, password } = validation.data;
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") || headerList.get("host") || "localhost:3000";
  const protocol = headerList.get("x-forwarded-proto") || "http";
  const origin = `${protocol}://${host}`;
  const emailRedirectTo = `${origin}${AUTH_ROUTES.CALLBACK}`;

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
        full_name: displayName,
      },
      emailRedirectTo,
    },
  });

  if (error) {
    const errorDetail = mapAuthError(error);
    return {
      success: false,
      message: errorDetail.messageVi,
      errorCode: errorDetail.code,
    };
  }

  redirect(AUTH_ROUTES.VERIFY_EMAIL);
}

/**
 * Sign In with Email and Password (P09-T03)
 */
export async function signInAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
    redirectTo: formData.get("redirectTo"),
  };

  const validation = loginSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      message: validation.error.issues[0]?.message || "Thông tin đăng nhập không hợp lệ",
      errorCode: AUTH_ERROR_CODES.AUTH_INVALID_CREDENTIALS,
    };
  }

  const { email, password, redirectTo: targetRedirect } = validation.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const errorDetail = mapAuthError(error);
    return {
      success: false,
      message: errorDetail.messageVi,
      errorCode: errorDetail.code,
    };
  }

  const destination = getSafeRedirectUrl(targetRedirect, DEFAULT_LOGIN_REDIRECT);
  redirect(destination);
}

/**
 * Sign Out (P09-T04)
 */
export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(AUTH_ROUTES.LOGIN);
}

/**
 * Forgot Password Request (P09-T05)
 */
export async function forgotPasswordAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const rawData = {
    email: formData.get("email"),
  };

  const validation = forgotPasswordSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      message: validation.error.issues[0]?.message || "Email không hợp lệ",
      errorCode: AUTH_ERROR_CODES.AUTH_RECOVERY_INVALID,
    };
  }

  const { email } = validation.data;
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") || headerList.get("host") || "localhost:3000";
  const protocol = headerList.get("x-forwarded-proto") || "http";
  const origin = `${protocol}://${host}`;
  const redirectTo = `${origin}${AUTH_ROUTES.CALLBACK}?next=${encodeURIComponent(AUTH_ROUTES.UPDATE_PASSWORD)}`;

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  // Always return neutral success message to prevent account enumeration
  return {
    success: true,
    message:
      "Nếu email tồn tại trong hệ thống, bạn sẽ nhận được liên kết đặt lại mật khẩu trong ít phút.",
  };
}

/**
 * Update Password from Recovery Flow (P09-T06)
 */
export async function updatePasswordAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const rawData = {
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const validation = updatePasswordSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      message: validation.error.issues[0]?.message || "Mật khẩu không hợp lệ",
      errorCode: AUTH_ERROR_CODES.AUTH_PASSWORD_UPDATE_FAILED,
    };
  }

  const { password } = validation.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    const errorDetail = mapAuthError(error);
    return {
      success: false,
      message: errorDetail.messageVi,
      errorCode: errorDetail.code,
    };
  }

  redirect(AUTH_ROUTES.DASHBOARD);
}

/**
 * Change Password for Authenticated Session (P09-T12)
 */
export async function changePasswordAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const rawData = {
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const validation = changePasswordSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      message: validation.error.issues[0]?.message || "Mật khẩu mới không hợp lệ",
      errorCode: AUTH_ERROR_CODES.AUTH_PASSWORD_UPDATE_FAILED,
    };
  }

  const { newPassword } = validation.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    const errorDetail = mapAuthError(error);
    return {
      success: false,
      message: errorDetail.messageVi,
      errorCode: errorDetail.code,
    };
  }

  return {
    success: true,
    message: "Đổi mật khẩu thành công!",
  };
}

/**
 * Update Profile Display Name (P09-T11)
 */
export async function updateDisplayNameAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const rawData = {
    displayName: formData.get("displayName"),
  };

  const validation = updateDisplayNameSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      message: validation.error.issues[0]?.message || "Tên hiển thị không hợp lệ",
      errorCode: AUTH_ERROR_CODES.AUTH_PROFILE_PROVISION_FAILED,
    };
  }

  const { displayName } = validation.data;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(AUTH_ROUTES.LOGIN);
  }

  // Update profile under RLS policy `profiles_update_own`
  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: displayName,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return {
      success: false,
      message: "Không thể cập nhật tên hiển thị. Vui lòng thử lại sau.",
      errorCode: AUTH_ERROR_CODES.AUTH_PROFILE_PROVISION_FAILED,
    };
  }

  return {
    success: true,
    message: "Cập nhật tên hiển thị thành công!",
  };
}
