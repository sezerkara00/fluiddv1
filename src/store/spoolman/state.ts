import type { SpoolmanState } from '@/store/spoolman/types'

export const defaultState = (): SpoolmanState => {
  return {
    availableSpools: [],
    activeSpool: undefined,
    currency: undefined,
    connected: false,
    dialog: {
      show: false
    }
  }
}

export const state = defaultState()
