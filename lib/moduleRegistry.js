// lib/moduleRegistry.js — Next.js
const BASE_MODULES = {
  clients: () => import("@/modules/clients/ClientsModule"),
  projects: () => import("@/modules/projects/ProjectsModule"),
  support: () => import("@/modules/support/SupportModule"),
  // ... resto de módulos base
};

export async function resolveModule(moduleKey, tenantConfig) {
  const override = tenantConfig?.uiOverride?.componentPath;

  // Si este cliente tiene un componente custom, lo carga
  if (override) {
    return import(`@/modules/overrides/${override}`);
  }

  // Si no, carga el módulo base
  return BASE_MODULES[moduleKey]?.();
}
