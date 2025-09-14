import Head from 'next/head'

import { Inter } from 'next/font/google'
import { MonitorState, MonitorTarget } from '@/types/config'
import { KVNamespace } from '@cloudflare/workers-types'
import { maintenances, pageConfig, workerConfig } from '@/uptime.config'
import OverallStatus from '@/components/OverallStatus'
import Header from '@/components/Header'
import MonitorList from '@/components/MonitorList'
import { Center, Divider, Text, Container, Box, Space, Paper, Group, Badge, ThemeIcon } from '@mantine/core'
import { IconShield, IconClock, IconGlobe } from '@tabler/icons-react'
import MonitorDetail from '@/components/MonitorDetail'

export const runtime = 'experimental-edge'
const inter = Inter({ subsets: ['latin'] })

export default function Home({
  state: stateStr,
  monitors,
}: {
  state: string
  monitors: MonitorTarget[]
  tooltip?: string
  statusPageLink?: string
}) {
  let state
  if (stateStr !== undefined) {
    state = JSON.parse(stateStr) as MonitorState
  }

  // Specify monitorId in URL hash to view a specific monitor (can be used in iframe)
  const monitorId = window.location.hash.substring(1)
  if (monitorId) {
    const monitor = monitors.find((monitor) => monitor.id === monitorId)
    if (!monitor || !state) {
      return <Text fw={700}>Monitor with id {monitorId} not found!</Text>
    }
    return (
      <div style={{ maxWidth: '810px' }}>
        <MonitorDetail monitor={monitor} state={state} />
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{pageConfig.title}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Real-time status monitoring for Falak services" />
      </Head>

      <main className={inter.className} style={{ minHeight: '100vh', backgroundColor: 'var(--mantine-color-gray-0)' }}>
        <Header />

        <Container size="lg" style={{ paddingBottom: '4rem' }}>
          {state == undefined ? (
            <Paper p="xl" radius="md" shadow="sm" style={{ textAlign: 'center', marginTop: '2rem' }}>
              <ThemeIcon size={60} radius="xl" variant="light" color="orange" style={{ margin: '0 auto 1rem' }}>
                <IconClock size={30} />
              </ThemeIcon>
              <Text fw={700} size="lg" mb="sm">
                Monitor State Loading...
              </Text>
              <Text c="dimmed">
                Monitor State is not defined now, please check your worker&apos;s status and KV
                binding!
              </Text>
            </Paper>
          ) : (
            <Box>
              {/* Hero Section with Overall Status */}
              <Paper p="xl" radius="lg" shadow="md" mb="xl" 
                     style={{ 
                       background: 'linear-gradient(135deg, var(--mantine-color-blue-6) 0%, var(--mantine-color-cyan-5) 100%)',
                       color: 'white',
                       textAlign: 'center'
                     }}>
                <Group justify="center" mb="md">
                  <ThemeIcon size={80} radius="xl" variant="white" color="blue">
                    <IconShield size={40} />
                  </ThemeIcon>
                </Group>
                <Text size="xl" fw={700} mb="xs">
                  {pageConfig.title}
                </Text>
                <Text size="md" opacity={0.9} mb="lg">
                  Real-time monitoring for all your critical services
                </Text>
                <OverallStatus state={state} monitors={monitors} maintenances={maintenances} />
              </Paper>

              {/* Stats Cards */}
              <Group grow mb="xl">
                <Paper p="md" radius="md" shadow="sm" style={{ textAlign: 'center' }}>
                  <ThemeIcon size={40} radius="xl" variant="light" color="green" style={{ margin: '0 auto 0.5rem' }}>
                    <IconShield size={20} />
                  </ThemeIcon>
                  <Text fw={600} size="lg">{state.overallUp}</Text>
                  <Text size="sm" c="dimmed">Services Online</Text>
                </Paper>
                
                <Paper p="md" radius="md" shadow="sm" style={{ textAlign: 'center' }}>
                  <ThemeIcon size={40} radius="xl" variant="light" color="red" style={{ margin: '0 auto 0.5rem' }}>
                    <IconClock size={20} />
                  </ThemeIcon>
                  <Text fw={600} size="lg">{state.overallDown}</Text>
                  <Text size="sm" c="dimmed">Services Down</Text>
                </Paper>
                
                <Paper p="md" radius="md" shadow="sm" style={{ textAlign: 'center' }}>
                  <ThemeIcon size={40} radius="xl" variant="light" color="blue" style={{ margin: '0 auto 0.5rem' }}>
                    <IconGlobe size={20} />
                  </ThemeIcon>
                  <Text fw={600} size="lg">{monitors.length}</Text>
                  <Text size="sm" c="dimmed">Total Monitors</Text>
                </Paper>
              </Group>

              {/* Monitor List Section */}
              <Paper p="xl" radius="lg" shadow="sm">
                <Group justify="space-between" align="center" mb="lg">
                  <div>
                    <Text size="xl" fw={700} mb="xs">Service Status</Text>
                    <Text c="dimmed">Monitor the health and performance of all services</Text>
                  </div>
                  <Badge 
                    size="lg" 
                    variant="light" 
                    color={state.overallDown === 0 ? "green" : "red"}
                    style={{ padding: '0.5rem 1rem' }}
                  >
                    {state.overallDown === 0 ? "All Systems Operational" : `${state.overallDown} Issues`}
                  </Badge>
                </Group>
                
                <MonitorList monitors={monitors} state={state} />
              </Paper>
            </Box>
          )}
        </Container>

        {/* Enhanced Footer */}
        <Box style={{ 
          backgroundColor: 'var(--mantine-color-gray-1)', 
          borderTop: '1px solid var(--mantine-color-gray-3)',
          padding: '2rem 0'
        }}>
          <Container size="lg">
            <Divider mb="lg" />
            <Group justify="space-between" align="center">
              <div>
                <Text size="sm" fw={600} mb="xs">
                  Powered by UptimeFlare
                </Text>
                <Text size="xs" c="dimmed">
                  Open-source monitoring powered by{' '}
                  <Text component="a" href="https://github.com/lyc8503/UptimeFlare" target="_blank" 
                        style={{ color: 'var(--mantine-color-blue-6)', textDecoration: 'none' }}>
                    UptimeFlare
                  </Text>{' '}
                  and{' '}
                  <Text component="a" href="https://www.cloudflare.com/" target="_blank"
                        style={{ color: 'var(--mantine-color-blue-6)', textDecoration: 'none' }}>
                    Cloudflare
                  </Text>
                </Text>
              </div>
              
              <Group gap="xs">
                <Badge variant="light" color="blue" size="sm">v1.0</Badge>
                <Badge variant="light" color="green" size="sm">Live</Badge>
              </Group>
            </Group>
          </Container>
        </Box>
      </main>
    </>
  )
}

export async function getServerSideProps() {
  const { UPTIMEFLARE_STATE } = process.env as unknown as {
    UPTIMEFLARE_STATE: KVNamespace
  }

  // Read state as string from KV, to avoid hitting server-side cpu time limit
  const state = (await UPTIMEFLARE_STATE?.get('state')) as unknown as MonitorState

  // Only present these values to client
  const monitors = workerConfig.monitors.map((monitor) => {
    return {
      id: monitor.id,
      name: monitor.name,
      // @ts-ignore
      tooltip: monitor?.tooltip,
      // @ts-ignore
      statusPageLink: monitor?.statusPageLink,
      // @ts-ignore
      hideLatencyChart: monitor?.hideLatencyChart,
    }
  })

  return { props: { state, monitors } }
}
