import { MaintenanceConfig, PageConfig, WorkerConfig } from './types/config'

const pageConfig: PageConfig = {
  // Title for your status page
  title: "Falak.me Status",
  // Links shown at the header of your status page, could set `highlight` to `true`
  links: [
    { link: 'https://falak.me', label: 'Main Website' },
    { link: 'https://academy.falak.me', label: 'Academy' },
    { link: 'https://community.falak.me', label: 'Community' },
    { link: 'mailto:contact@falak.me', label: 'Contact', highlight: true },
  ],
  // [OPTIONAL] Group your monitors
  // If not specified, all monitors will be shown in a single list
  // If specified, monitors will be grouped and ordered, not-listed monitors will be invisible (but still monitored)
  // group: {
  //   '🌐 Falak Services': ['falak_main', 'falak_academy', 'gardenx', 'falak_community', 'falak_link'],
  // },
}

const workerConfig: WorkerConfig = {
  // Write KV at most every 3 minutes unless the status changed
  kvWriteCooldownMinutes: 3,
  // Enable HTTP Basic auth for status page & API by uncommenting the line below, format `<USERNAME>:<PASSWORD>`
  // passwordProtection: 'username:password',
  // Define all your monitors here
  monitors: [
    // Falak.me Main Website
    {
      id: 'falak_main',
      name: 'Falak.me',
      method: 'GET',
      target: 'https://falak.me',
      tooltip: 'Main Falak website',
      statusPageLink: 'https://falak.me',
      hideLatencyChart: false,
      expectedCodes: [200],
      timeout: 10000,
      headers: {
        'User-Agent': 'UptimeFlare-Monitor',
      },
    },
    // Falak Academy
    {
      id: 'falak_academy',
      name: 'Falak Academy',
      method: 'GET',
      target: 'https://academy.falak.me',
      tooltip: 'Falak Academy platform',
      statusPageLink: 'https://academy.falak.me',
      hideLatencyChart: false,
      expectedCodes: [200],
      timeout: 10000,
      headers: {
        'User-Agent': 'UptimeFlare-Monitor',
      },
    },
    // GardenX
    {
      id: 'gardenx',
      name: 'GardenX',
      method: 'GET',
      target: 'https://gardenx.falak.me',
      tooltip: 'GardenX application',
      statusPageLink: 'https://gardenx.falak.me',
      hideLatencyChart: false,
      expectedCodes: [200],
      timeout: 10000,
      headers: {
        'User-Agent': 'UptimeFlare-Monitor',
      },
    },
    // Falak Community
    {
      id: 'falak_community',
      name: 'Falak Community',
      method: 'GET',
      target: 'https://community.falak.me',
      tooltip: 'Falak Community platform',
      statusPageLink: 'https://community.falak.me',
      hideLatencyChart: false,
      expectedCodes: [200],
      timeout: 10000,
      headers: {
        'User-Agent': 'UptimeFlare-Monitor',
      },
    },
    // Falak Link
    {
      id: 'falak_link',
      name: 'Falak Link',
      method: 'GET',
      target: 'https://l.falak.me',
      tooltip: 'Falak Link shortener',
      statusPageLink: 'https://l.falak.me',
      hideLatencyChart: false,
      expectedCodes: [200],
      timeout: 10000,
      headers: {
        'User-Agent': 'UptimeFlare-Monitor',
      },
    },
  ],
  notification: {
    // Notifications disabled - Discord requires Apprise server
    // To enable notifications, set up an Apprise server and uncomment the lines below:
    // appriseApiServer: 'https://your-apprise-server.com/notify',
    // recipientUrl: 'discord://1416359119639547974/ddqycFcXMyEDC_yqzrtF4YUAdW0PmnovRg_tx9af5emoJZ3cldlhVTowTydTIglkPgQ',
    
    // Timezone for any future notifications
    timeZone: 'UTC',
    
    // Grace period in minutes before sending a notification
    gracePeriod: 2,
    
    // No notifications will be sent with current config
    skipNotificationIds: [], 
  },
  callbacks: {
    onStatusChange: async (
      env: any,
      monitor: any,
      isUp: boolean,
      timeIncidentStart: number,
      timeNow: number,
      reason: string
    ) => {
      // Custom callback when status changes
      console.log(`Falak Service ${monitor.name} status changed to ${isUp ? 'UP' : 'DOWN'}: ${reason}`)
      
      // You can add custom logic here for Falak services, such as:
      // - Sending notifications to internal systems
      // - Updating service dashboards
      // - Logging to analytics platforms
    },
    onIncident: async (
      env: any,
      monitor: any,
      timeIncidentStart: number,
      timeNow: number,
      reason: string
    ) => {
      // Called every minute during ongoing incidents
      const incidentDuration = Math.floor((timeNow - timeIncidentStart) / 60000) // minutes
      console.log(`Ongoing incident for Falak service ${monitor.name}: ${incidentDuration} minutes`)
    },
  },
}

// Scheduled maintenances for Falak services
const maintenances: MaintenanceConfig[] = [
  // Example maintenance - modify dates and services as needed
  // {
  //   monitors: ['falak_main', 'falak_academy'], // Which Falak services are affected
  //   title: 'Server Maintenance',
  //   body: 'Scheduled maintenance for server updates and performance improvements',
  //   start: '2025-01-15T02:00:00+00:00', // Adjust date/time and timezone
  //   end: '2025-01-15T04:00:00+00:00',   // 2-hour maintenance window
  //   color: 'blue',
  // },
]

export { pageConfig, workerConfig, maintenances }
