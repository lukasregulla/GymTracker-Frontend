import * as React from 'react'

const TOAST_LIMIT = 3
const TOAST_REMOVE_DELAY = 4000

type ToastVariant = 'default' | 'success' | 'danger'

export type Toast = {
  id: string
  title?: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

type Action =
  | { type: 'ADD_TOAST'; toast: Toast }
  | { type: 'REMOVE_TOAST'; toastId: string }

type State = { toasts: Toast[] }

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

let dispatch: React.Dispatch<Action> = () => {}
let state: State = { toasts: [] }
const listeners: Array<React.Dispatch<React.SetStateAction<State>>> = []

function memDispatch(action: Action) {
  state = reducer(state, action)
  listeners.forEach((listener) => listener(state))
}

export function toast(props: Omit<Toast, 'id'>) {
  const id = Math.random().toString(36).slice(2)
  const duration = props.duration ?? TOAST_REMOVE_DELAY

  memDispatch({ type: 'ADD_TOAST', toast: { ...props, id } })

  const timeout = setTimeout(() => {
    memDispatch({ type: 'REMOVE_TOAST', toastId: id })
    toastTimeouts.delete(id)
  }, duration)
  toastTimeouts.set(id, timeout)

  return id
}

export function dismissToast(toastId: string) {
  const timeout = toastTimeouts.get(toastId)
  if (timeout) clearTimeout(timeout)
  toastTimeouts.delete(toastId)
  memDispatch({ type: 'REMOVE_TOAST', toastId })
}

export function useToast() {
  const [toastState, setToastState] = React.useState<State>(state)

  React.useEffect(() => {
    listeners.push(setToastState)
    return () => {
      const index = listeners.indexOf(setToastState)
      if (index > -1) listeners.splice(index, 1)
    }
  }, [])

  // keep module-level dispatch in sync
  dispatch = memDispatch

  return {
    toasts: toastState.toasts,
    toast,
    dismiss: dismissToast,
  }
}

// allow calling from outside React
export { dispatch }
