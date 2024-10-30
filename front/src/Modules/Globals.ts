import { RoleEnum, TicketStatusEnum } from "src/client"

export const ruleRequired = (val: string) => !!val || "Обязательное поле"
export const ruleValidEmail = (val: string) => {
  const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
  return emailPattern.test(val) || "Введите валидный email адрес "
}

export const UserRoleNames: Map<RoleEnum, string> = new Map([
  [RoleEnum.ADMIN, "Администратор"],
  [RoleEnum.BUH_INN, "Бухгалетр"],
  [RoleEnum.BUH_EXT, "Бухгалтер заказчика"],
  [RoleEnum.OUTLEN, "Отходообразователь"],
  [RoleEnum.DISP, "Диспетчер"],
  [RoleEnum.OTV, "Отвальщик"],
  [RoleEnum.MAN, "Мастер участка"],
])

export const TicketStatusNames: Map<TicketStatusEnum, string> = new Map([
  [TicketStatusEnum.CR, "Создан"],
  [TicketStatusEnum.PR, "В процессе"],
  [TicketStatusEnum.AR, "Архив"],
  [TicketStatusEnum.NC, "Несоответствие"],
  [TicketStatusEnum.ER, "Ошибка"],
])
