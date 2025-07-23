import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/insets/$projectId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/insets/$projectId"!</div>
}
