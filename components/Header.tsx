import { Container, Group, Text, Paper, ThemeIcon, Badge } from '@mantine/core'
import { IconActivity } from '@tabler/icons-react'
import classes from '@/styles/Header.module.css'
import { pageConfig } from '@/uptime.config'
import { PageConfigLink } from '@/types/config'

export default function Header() {
  const linkToElement = (link: PageConfigLink) => {
    return (
      <a
        key={link.label}
        href={link.link}
        target="_blank"
        className={classes.link}
        data-active={link.highlight}
      >
        {link.label}
      </a>
    )
  }

  return (
    <header className={classes.header}>
      <Container size="lg" className={classes.inner}>
        <Group gap="sm">
          <ThemeIcon size="lg" radius="xl" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
            <IconActivity size={20} />
          </ThemeIcon>
          <div>
            <Text
              size="xl"
              fw={700}
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
              style={{ lineHeight: 1.2 }}
            >
              {pageConfig.title || 'UptimeFlare'}
            </Text>
            <Badge variant="light" color="green" size="xs">
              Live Monitoring
            </Badge>
          </div>
        </Group>

        <Group gap={5} visibleFrom="sm">
          {pageConfig.links?.map(linkToElement)}
        </Group>

        <Group gap={5} hiddenFrom="sm">
          {pageConfig.links?.filter((link) => link.highlight).map(linkToElement)}
        </Group>
      </Container>
    </header>
  )
}
