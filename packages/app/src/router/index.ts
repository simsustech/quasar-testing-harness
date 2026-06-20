import {
  createMemoryHistory,
  createRouter as _createRouter,
  createWebHistory
} from 'vue-router'
import routes from './routes'

export default function createRouter() {
  return _createRouter({
    history: import.meta.env.SSR
      ? createMemoryHistory(__BASE_URL__)
      : createWebHistory(__BASE_URL__),
    routes,
    scrollBehavior() {
      return { top: 0 }
    }
  })
}
