import { date } from "quasar"
import { RoleEnum, User } from "src/client"
import { UserRoleNames } from "./Globals"

export function formatDate(dt: Date | string): string {
  return date.formatDate(dt, "YYYY.MM.DD")
}

export function formatDateTime(dt: Date | string): string {
  return date.formatDate(dt, "YYYY.MM.DD HH:mm")
}

export function formatDateTimeSeconds(dt: Date | string): string {
  return date.formatDate(dt, "DD.MM HH:mm:ss")
}

export function userNameReadable(user: User | null | undefined): string | undefined {
  if (!user) {
    return undefined
  }
  return user.first_name ? [user.first_name, user.last_name].join(" ") : user.username
}

export function userRoleStr(role: RoleEnum | null | undefined) {
  return role ? UserRoleNames.get(role) : undefined
}
