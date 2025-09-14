import { MaintenanceConfig, MonitorTarget } from '@/types/config'
import { Center, Container, Title, Text, Group, ThemeIcon, Badge } from '@mantine/core'
import { IconCircleCheck, IconAlertCircle, IconClock } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import MaintenanceAlert from './MaintenanceAlert'
import { pageConfig } from '@/uptime.config'

function useWindowVisibility() {
  const [isVisible, setIsVisible] = useState(true)
  useEffect(() => {
    const handleVisibilityChange = () => setIsVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])
  return isVisible
}

export default function OverallStatus({
  state,
  maintenances,
  monitors,
}: {
  state: { overallUp: number; overallDown: number; lastUpdate: number }
  maintenances: MaintenanceConfig[]
  monitors: MonitorTarget[]
}) {
  let group = pageConfig.group
  let groupedMonitor = (group && Object.keys(group).length > 0) || false

  let statusString = ''
  let icon = <IconAlertCircle size={48} />
  let statusColor = 'red'
  let badgeText = 'Issues Detected'
  
  if (state.overallUp === 0 && state.overallDown === 0) {
    statusString = 'Initializing monitors...'
    icon = <IconClock size={48} />
    statusColor = 'orange'
    badgeText = 'Loading'
  } else if (state.overallUp === 0) {
    statusString = 'All systems not operational'
    statusColor = 'red'
    badgeText = 'Critical'
  } else if (state.overallDown === 0) {
    statusString = 'All systems operational'
    icon = <IconCircleCheck size={48} />
    statusColor = 'green'
    badgeText = 'Operational'
  } else {
    statusString = `Partial outage detected`
    statusColor = 'orange'
    badgeText = `${state.overallDown} Issues`
  }

  const [openTime] = useState(Math.round(Date.now() / 1000))
  const [currentTime, setCurrentTime] = useState(Math.round(Date.now() / 1000))
  const isWindowVisible = useWindowVisibility()

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isWindowVisible) return
      if (currentTime - state.lastUpdate > 300 && currentTime - openTime > 30) {
        window.location.reload()
      }
      setCurrentTime(Math.round(Date.now() / 1000))
    }, 1000)
    return () => clearInterval(interval)
  })

  const now = new Date()
  let filteredMaintenances: (Omit<MaintenanceConfig, 'monitors'> & { monitors?: MonitorTarget[] })[] =
    maintenances
      .filter((m) => now >= new Date(m.start) && (!m.end || now <= new Date(m.end)))
      .map((maintenance) => ({
        ...maintenance,
        monitors: maintenance.monitors?.map(
          (monitorId) => monitors.find((mon) => monitorId === mon.id)!
        ),
      }))

  return (
    <div style={{ textAlign: 'center' }}>
      <Group justify="center" mb="md">
        <ThemeIcon size={60} radius="xl" variant="light" color={statusColor}>
          {icon}
        </ThemeIcon>
        <Badge size="lg" variant="light" color={statusColor} style={{ padding: '0.5rem 1rem' }}>
          {badgeText}
        </Badge>
      </Group>
      
      <Text size="lg" fw={600} mb="xs" style={{ color: 'white' }}>
        {statusString}
      </Text>
      
      <Text size="sm" opacity={0.8} mb="lg">
        Last updated: {new Date(state.lastUpdate * 1000).toLocaleString()}
        <br />
        <Text component="span" size="xs" opacity={0.7}>
          Updated {currentTime - state.lastUpdate} seconds ago
        </Text>
      </Text>

      {filteredMaintenances.map((maintenance, idx) => (
        <MaintenanceAlert
          key={idx}
          maintenance={maintenance}
          style={{ maxWidth: groupedMonitor ? '897px' : '865px', marginTop: '1rem' }}
        />
      ))}
    </div>
  )
}
