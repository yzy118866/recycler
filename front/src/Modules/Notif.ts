import { Notify, QNotifyCreateOptions } from "quasar"

type NotifyParams = QNotifyCreateOptions

export function notify(params: NotifyParams | string, def?: NotifyParams) {
  if (typeof params == "string") {
    params = { message: params }
  }
  return Notify.create(Object.assign({}, def, params))
}

export function notifySuccess(params: NotifyParams | string) {
  return notify(params, {
    type: "positive",
  })
}

export function notifyError(params: NotifyParams | string) {
  return notify(params, {
    type: "negative",
  })
}

export function notifySaved(message?: string) {
  Notify.create({
    type: "positive",
    message: message ?? "Успешно сохранено",
  })
}

export function notifyTaskStatusUpdated() {
  Notify.create({
    type: "positive",
    message: "Статус задачи успешно изменен",
  })
}

export function notifyDeleted() {
  Notify.create({
    type: "positive",
    icon: "delete",
    message: "Успешно удалено",
  })
}

export function promiseFunc(promise: Promise<unknown>, func: CallableFunction) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  void promise.then(() => func())
}
