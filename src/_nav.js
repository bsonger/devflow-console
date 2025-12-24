import {
  cilSpeedometer,
  cilDescription,
  cilApps,
  cilTask,
  cilSettings,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} />,
  },
  {
    component: CNavItem,
    name: 'Applications',
    to: '/applications',
    icon: <CIcon icon={cilApps} />,
  },
  {
    component: CNavItem,
    name: 'Manifests',
    to: '/manifests',
    icon: <CIcon icon={cilDescription} />,
  },
  {
    component: CNavItem,
    name: 'Jobs',
    to: '/jobs',
    icon: <CIcon icon={cilTask} />,
  },
  {
    component: CNavItem,
    name: 'Settings',
    to: '/settings',
    icon: <CIcon icon={cilSettings} />,
  },
]

export default _nav
