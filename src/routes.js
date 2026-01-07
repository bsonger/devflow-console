import Dashboard from './views/dashboard/Dashboard'
import Manifests from './views/manifests/Manifests'
import Applications from './views/applications/Applications'
import Jobs from './views/jobs/Jobs'
import ManifestDetail from './views/manifests/ManifestDetail'

// import Settings from './views/settings/Settings'

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },

  { path: '/manifests', name: 'Manifests', element: Manifests },
  { path: '/manifests/:id', name: 'ManifestDetail', element: ManifestDetail},
  { path: '/applications', name: 'Applications', element: Applications },
  { path: '/jobs', name: 'Jobs', element: Jobs },

  // { path: '/settings', name: 'Settings', element: Settings },
]

export default routes
