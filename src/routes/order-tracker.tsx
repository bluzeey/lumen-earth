import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/order-tracker')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/order-tracker"!</div>
}
