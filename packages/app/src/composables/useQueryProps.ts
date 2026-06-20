import { reactive, watch, type Reactive, computed, type ComputedRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'

/**
 * Coerce a single URL query value to a typed value.
 * - "true" / "false" → boolean
 * - numeric strings → number
 * - JSON strings starting with { or [ → parsed
 * - everything else → string
 */
export function coerceQueryValue(
  raw: string | string[] | null | undefined
): unknown {
  if (raw === null || raw === undefined) return undefined
  const v = Array.isArray(raw) ? raw[0] : raw
  if (v === 'true') return true
  if (v === 'false') return false
  if (v === '') return ''
  if (/^-?\d+(?:\.\d+)?$/.test(v)) return Number(v)
  if (v.startsWith('{') || v.startsWith('[')) {
    try {
      return JSON.parse(v)
    } catch {
      return v
    }
  }
  return v
}

/**
 * Stringify a typed value for the URL query.
 */
export function stringifyQueryValue(v: unknown): string {
  if (v === undefined || v === null) return ''
  if (typeof v === 'boolean') return v ? 'true' : 'false'
  if (typeof v === 'number') return String(v)
  if (typeof v === 'string') return v
  return JSON.stringify(v)
}

export interface QueryPropsOptions<T extends Record<string, unknown>> {
  /** Default values applied when a key is missing from the URL. */
  defaults: T
}

function getRouteSnapshot(route: unknown): {
  query: Record<string, string | string[] | null | undefined>
} {
  if (route && typeof route === 'object' && 'value' in route) {
    return (route as { value: { query: typeof route.query } }).value
  }
  return route as { query: typeof route.query }
}

/**
 * Bind component props to URL query string.
 *
 * - URL is the source of truth on mount and on every route.query change
 * - `setProp(key, value)` writes to the URL via `router.replace`
 * - `reset()` clears the URL query and reverts to defaults
 */
export function useQueryProps<T extends Record<string, unknown>>(
  options: QueryPropsOptions<T>
): {
  props: Reactive<T>
  setProp: <K extends keyof T>(key: K, value: T[K]) => void
  reset: () => void
  /**
   * Two-way v-model binding for a single prop key.
   * Usage: `const model = bindModel('modelValue')`
   */
  bindModel: <K extends keyof T>(key: K) => ComputedRef<T[K]>
} {
  const route = useRoute()
  const router = useRouter()

  const props = reactive({ ...options.defaults }) as Reactive<T>

  const bindModel = <K extends keyof T>(key: K): ComputedRef<T[K]> =>
    computed({
      get: () => props[key],
      set: (val: T[K]) => {
        ;(props as Record<keyof T, unknown>)[key] = val
        const nextQuery: Record<string, string> = {}
        for (const k of Object.keys(options.defaults) as (keyof T)[]) {
          const v = (props as Record<keyof T, unknown>)[k]
          if (v === options.defaults[k]) continue
          const s = stringifyQueryValue(v)
          if (s !== '') nextQuery[String(k)] = s
        }
        void router.replace({ query: nextQuery })
      }
    })

  const syncFromUrl = (
    query: Record<string, string | string[] | null | undefined>
  ) => {
    for (const key of Object.keys(options.defaults) as (keyof T)[]) {
      const k = String(key)
      if (k in query) {
        const coerced = coerceQueryValue(query[k]) as T[keyof T]
        ;(props as Record<keyof T, unknown>)[key] = coerced
      } else {
        ;(props as Record<keyof T, unknown>)[key] = options.defaults[key]
      }
    }
  }

  const readQuery = () => getRouteSnapshot(route).query as Record<
    string,
    string | string[] | null | undefined
  >

  syncFromUrl(readQuery())
  watch(readQuery, syncFromUrl)

  const setProp = <K extends keyof T>(key: K, value: T[K]) => {
    ;(props as Record<keyof T, unknown>)[key] = value
    const nextQuery: Record<string, string> = {}
    for (const k of Object.keys(options.defaults) as (keyof T)[]) {
      const v = (props as Record<keyof T, unknown>)[k]
      if (v === options.defaults[k]) continue
      const s = stringifyQueryValue(v)
      if (s !== '') nextQuery[String(k)] = s
    }
    void router.replace({ query: nextQuery })
  }

  const reset = () => {
    for (const key of Object.keys(options.defaults) as (keyof T)[]) {
      ;(props as Record<keyof T, unknown>)[key] = options.defaults[key]
    }
    void router.replace({ query: {} })
  }

  return { props, setProp, reset, bindModel }
}
