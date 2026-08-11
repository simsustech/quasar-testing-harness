import type { RouteRecordRaw } from 'vue-router'
import { components } from './components'

/**
 * Eagerly discover all generated component pages at build time. Any route
 * whose page file doesn't exist falls back to NotImplementedPage. This
 * pattern keeps the component lookup synchronous and avoids losing the
 * route context when a dynamic-import promise rejects.
 */
const pageModules = import.meta.glob<{ default: unknown }>(
  '../pages/q-*/Q*Page.vue'
)

const componentRoutes: RouteRecordRaw[] = components.map((c) => {
  const key = `../pages/${c.slug}/${c.name}Page.vue`
  const loader = pageModules[key]
  return {
    path: `/${c.slug}`,
    name: c.slug,
    component: (loader
      ? () => loader()
      : () =>
          import('../pages/NotImplementedPage.vue')) as RouteRecordRaw['component'],
    meta: { componentName: c.name, milestone: c.milestone }
  }
})

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'index',
        component: () => import('../pages/IndexPage.vue')
      },
      {
        path: 'review',
        name: 'review',
        component: () => import('../pages/review/ReviewPage.vue')
      },
      {
        path: 'composites',
        name: 'composites',
        component: () => import('../pages/composites/CompositesPage.vue'),
        meta: { componentName: 'Composites', milestone: 'M1' as const }
      },
      ...componentRoutes
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('../pages/Error404Page.vue')
  }
]

export default routes
