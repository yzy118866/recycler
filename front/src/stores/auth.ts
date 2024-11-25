/* eslint-disable @typescript-eslint/require-await */
import { useLocalStorage } from "@vueuse/core"
import { defineStore } from "pinia"
import { LocalStorage } from "quasar"
import { AuthService, AuthToken, OpenAPI, User, UsersService, PaginatedUserList, UserRegister, RoleEnum } from "src/client"
import { storeShortcut } from "src/Modules/StoreCrud"
import { Ref } from "vue"

// eslint-disable-next-line @typescript-eslint/require-await
const getToken = async () => {
  return localStorage.getItem("authToken") || ""
}

OpenAPI.TOKEN = getToken

// export enum TUserRole {
//   user = 1,
//   manager = 2,
//   admin = 3,
// }
export type TUserRole = RoleEnum

const cachedAccount: User | null = (LocalStorage.getItem("cachedAccount") as unknown as User | null) || null

export const useAuthStore = defineStore("auth", {
  state: () => ({
    authToken: localStorage.getItem("authToken"),
    user: null as User | null,
    users: null as User[] | null,
    account: null as User | null,
    notifications: null as Notification[] | null,
    pageLoading: false,

    cachedAccount: cachedAccount,
    roleOverride: useLocalStorage("userRoleOverride", null) as Ref<TUserRole | null>,
  }),

  getters: {
    isAuthenticated(state) {
      return !!state.authToken
    },
    userRoleActual(state): TUserRole {
      // Force actual user role
      const acc = state.account
      const accCached = state.cachedAccount
      const roleActual = (acc?.role as TUserRole | undefined) || (accCached?.role as TUserRole | undefined) || null;
      return roleActual
    },
    userRole(state): TUserRole {
      // User role or overridden role
      // this.userRoleActual
      // const acc = state.account
      // const accCached = state.cachedAccount
      // const roleActual = (acc?.role as TUserRole | undefined) || (accCached?.role as TUserRole | undefined) || TUserRole.user
      const roleActual = this.userRoleActual
      if (state.roleOverride && roleActual == RoleEnum.ADMIN) {
        console.debug("Overridden role: ", { override: state.roleOverride, actual: roleActual })
        return state.roleOverride
      }
      return roleActual
    },
    accountMaybeCached(state): User | null {
      return state.cachedAccount || state.account
    },
    // permissions(state): Array<string> {
    //   return state.account?.permissions || []
    // },
  },

  actions: {
    hasRole(checkRole: RoleEnum | RoleEnum[], actual = false): boolean {
      if (typeof checkRole === "string") {
        checkRole = [checkRole]
      }
      const currentRole = actual ? this.userRoleActual : this.userRole
      const result = Boolean(currentRole && checkRole.indexOf(currentRole) !== -1)
      console.debug("hasRole: ", { currentRole, checkRole, actual, result })
      if (currentRole == RoleEnum.ADMIN) {
        // Admin always has access
        return true
      }
      return result
    },
    setToken(token: string): void {
      localStorage.setItem("authToken", token)
      this.authToken = token
    },
    deleteToken(): void {
      localStorage.removeItem("authToken")
    },

    //
    async logout(): Promise<void> {
      return new Promise((resolve) => {
        this.authToken = null
        this.deleteToken()
        resolve()
      })
    },

    async loadUser(id: number, noSave = false): Promise<User> {
      return storeShortcut({
        promise: UsersService.usersRetrieve({ id }),
        setValue: (resp: User) => {
          if (!noSave) {
            this.user = resp
          }
        },
      })
    },

    async updateUser(id: number, payload: User): Promise<User> {
      return storeShortcut({
        promise: UsersService.usersPartialUpdate({ id, requestBody: payload }),
        setValue: (resp: User) => {
          this.user = resp
        },
      })
    },

    async createUser(payload: User): Promise<User> {
      return storeShortcut({
        promise: UsersService.usersCreate({ requestBody: payload }),
        setValue: (resp: User) => {
          this.user = resp
        },
      })
    },
    async deleteUser(id: number): Promise<User> {
      return storeShortcut({
        promise: UsersService.usersDestroy({ id }),
        setValue: (resp: User) => {
          this.user = resp
        },
      })
    },

    async loadAccountInfo(): Promise<User> {
      return storeShortcut({
        promise: UsersService.usersCurrentRetrieve(),
        setValue: (user: User) => {
          this.account = user
          LocalStorage.set("cachedAccount", user)
        },
      })
    },
    async setUserPassword(id: number, password: string): Promise<User> {
      return storeShortcut({
        promise: UsersService.usersSetPasswordCreate({ id, requestBody: { password: password } }),
      })
    },
    async loadUsers(payload: object): Promise<PaginatedUserList> {
      return storeShortcut({
        promise: UsersService.usersList(payload),
        setValue: (resp: PaginatedUserList) => {
          this.users = resp.results as User[]
        },
      })
    },

    async login(payload: AuthToken): Promise<AuthToken> {
      return new Promise((resolve, reject) => {
        AuthService.authTokenCreate({ formData: payload })
          .then((resp) => {
            const token = resp.token
            this.setToken(token)

            resolve(resp)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },

    async register(payload: UserRegister): Promise<UserRegister> {
      return new Promise((resolve, reject) => {
        AuthService.authRegisterCreate({ requestBody: payload })
          .then((resp) => {
            if (resp.token) {
              this.setToken(resp.token)
            }
            resolve(resp)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
  },
})
