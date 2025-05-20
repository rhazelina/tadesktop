import yup from "yup"

const schema_registerform = yup.object({
  name: yup.string()
    .min(3, "nickname_to_short|Nama terlalu pendek")
    .max(254, "nickname_to_long|Nama terlalu panjang")
    .required("nickname_require|Nama dibutuhkan!"),
  email: yup.string()
    .email("email_formattoemail|Email harus berformat email pada umumnya!")
    .min(3, "email_to_short|Email terlalu pendek")
    .max(254, "email_to_long|Email terlalu panjang")
    .required("email_require|Email dibutuhkan!"),
  password: yup.string()
    .min(3, "password_to_short|Kata sandi terlalu pendek")
    // Kalau Butuh Huruf Besar
    // .matches(/[A-Z]/, "password_need_uppercase|Kata sandi harus ada huruf besar")
    .matches(/[a-z]/, "password_need_lowercase|Kata sandi harus ada huruf kecil")
    .matches(/[0-9]/, "password_need_number|Kata sandi harus ada angka")
    // Kalau Butuh Simbol
    // .matches(/[@$!%*?&#^()_+=~<>/\\|\[\]{}\-]/, "password_need_symbol|Kata sandi harus ada simbol")
    .required("password_require|Kata sandi diperlukan!"),
  confrim_password: yup.string()
    .min(3, "confrim_password_to_short|Kata sandi konfirmasi terlalu pendek")
    // Kalau Butuh Huruf Besar
    // .matches(/[A-Z]/, "confrim_password_need_uppercase|Kata sandi konfirmasi harus ada huruf besar")
    .matches(/[a-z]/, "confrim_password_need_lowercase|Kata sandi konfirmasi harus ada huruf kecil")
    .matches(/[0-9]/, "confrim_password_need_number|Kata sandi konfirmasi harus ada angka")
    // Kalau Butuh Simbol
    // .matches(/[@$!%*?&#^()_+=~<>/\\|\[\]{}\-]/, "confrim_password_need_symbol|Kata sandi konfirmasi harus ada simbol")
    .required("confrim_password_require|Kata sandi diperlukan!"),
})

const schema_loginform = yup.object({
  email: yup.string()
    .email("email_formattoemail|Email harus berformat email pada umumnya!")
    .min(3, "email_to_short|Email terlalu pendek")
    .max(254, "email_to_long|Email terlalu panjang")
    .required("email_require|Email dibutuhkan!"),
  password: yup.string()
    .min(3, "password_to_short|Kata sandi terlalu pendek")
    // Kalau Butuh Huruf Besar
    // .matches(/[A-Z]/, "password_need_uppercase|Kata sandi harus ada huruf besar")
    .matches(/[a-z]/, "password_need_lowercase|Kata sandi harus ada huruf kecil")
    .matches(/[0-9]/, "password_need_number|Kata sandi harus ada angka")
    // Kalau Butuh Simbol
    // .matches(/[@$!%*?&#^()_+=~<>/\\|\[\]{}\-]/, "password_need_symbol|Kata sandi harus ada simbol")
    .required("password_require|Kata sandi diperlukan!"),
})
const schema_changepasswordform = yup.object({
  password_now: yup.string()
    .min(3, "password_now_to_short|Kata sandi saat ini terlalu pendek")
    // Kalau Butuh Huruf Besar
    // .matches(/[A-Z]/, "password_now_need_uppercase|Kata sandi saat ini harus ada huruf besar")
    .matches(/[a-z]/, "password_now_need_lowercase|Kata sandi saat ini harus ada huruf kecil")
    .matches(/[0-9]/, "password_now_need_number|Kata sandi saat ini harus ada angka")
    // Kalau Butuh Simbol
    // .matches(/[@$!%*?&#^()_+=~<>/\\|\[\]{}\-]/, "password_now_need_symbol|Kata sandi saat ini harus ada simbol")
    .required("password_now_require|Kata sandi saat ini diperlukan!"),
  change_password: yup.string()
    .min(3, "password_change_to_short|Kata sandi perubahan terlalu pendek")
    // Kalau Butuh Huruf Besar
    // .matches(/[A-Z]/, "password_change_need_uppercase|Kata sandi perubahan harus ada huruf besar")
    .matches(/[a-z]/, "password_change_need_lowercase|Kata sandi perubahan harus ada huruf kecil")
    .matches(/[0-9]/, "password_change_need_number|Kata sandi perubahan harus ada angka")
    // Kalau Butuh Simbol
    // .matches(/[@$!%*?&#^()_+=~<>/\\|\[\]{}\-]/, "password_change_need_symbol|Kata sandi perubahan harus ada simbol")
    .required("password_change_require|Kata sandi perubahan diperlukan!"),
  confirm_password: yup.string()
    .min(3, "password_confrim_to_short|Kata sandi konfrimasi terlalu pendek")
    // Kalau Butuh Huruf Besar
    // .matches(/[A-Z]/, "password_confrim_need_uppercase|Kata sandi konfrimasi harus ada huruf besar")
    .matches(/[a-z]/, "password_confrim_need_lowercase|Kata sandi konfrimasi harus ada huruf kecil")
    .matches(/[0-9]/, "password_confrim_need_number|Kata sandi konfrimasi harus ada angka")
    // Kalau Butuh Simbol
    // .matches(/[@$!%*?&#^()_+=~<>/\\|\[\]{}\-]/, "password_confrim_need_symbol|Kata sandi konfrimasi harus ada simbol")
    .required("password_confrim_require|Kata sandi konfrimasi diperlukan!"),
})

const dataschema = {
  schema_registerform,
  schema_loginform,
  schema_changepasswordform,
}

const msgschema = {}

export {
  dataschema,
  msgschema
}