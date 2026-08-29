import { z } from "zod";

/**
 * Common Zod fields for authentication forms.
 */
export const emailField = z
  .string()
  .min(1, { message: "Vui lòng nhập địa chỉ email" })
  .email({ message: "Địa chỉ email không đúng định dạng" })
  .max(255, { message: "Email không được vượt quá 255 ký tự" });

export const passwordField = z
  .string()
  .min(6, { message: "Mật khẩu phải có tối thiểu 6 ký tự" })
  .max(72, { message: "Mật khẩu không được vượt quá 72 ký tự" });

export const displayNameField = z
  .string()
  .trim()
  .min(1, { message: "Tên hiển thị không được để trống" })
  .min(2, { message: "Tên hiển thị phải có ít nhất 2 ký tự" })
  .max(100, { message: "Tên hiển thị không được vượt quá 100 ký tự" });

/**
 * Sign In Schema (P09-T03)
 */
export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, { message: "Vui lòng nhập mật khẩu" }),
  redirectTo: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Sign Up Schema (P09-T01)
 */
export const signUpSchema = z
  .object({
    displayName: displayNameField,
    email: emailField,
    password: passwordField,
    confirmPassword: z.string().min(1, { message: "Vui lòng xác nhận mật khẩu" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type SignUpInput = z.infer<typeof signUpSchema>;

/**
 * Forgot Password Schema (P09-T05)
 */
export const forgotPasswordSchema = z.object({
  email: emailField,
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

/**
 * Update Password Schema via recovery link (P09-T06)
 */
export const updatePasswordSchema = z
  .object({
    password: passwordField,
    confirmPassword: z.string().min(1, { message: "Vui lòng xác nhận mật khẩu mới" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;

/**
 * Change Password Schema for authenticated session (P09-T12)
 */
export const changePasswordSchema = z
  .object({
    newPassword: passwordField,
    confirmPassword: z.string().min(1, { message: "Vui lòng xác nhận mật khẩu mới" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

/**
 * Display Name Update Schema (P09-T11)
 */
export const updateDisplayNameSchema = z.object({
  displayName: displayNameField,
});

export type UpdateDisplayNameInput = z.infer<typeof updateDisplayNameSchema>;
