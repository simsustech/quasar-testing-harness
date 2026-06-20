export type PropType = 'string' | 'number' | 'boolean' | 'select'

export interface PropSchema {
  key: string
  type: PropType
  default: string | number | boolean
  options?: string[]
  required?: boolean
  description?: string
}
